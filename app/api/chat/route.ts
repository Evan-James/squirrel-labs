import { env } from 'cloudflare:workers';
import { z } from 'zod';
import knowledge from '@/content/hazel-knowledge.md?raw';
import { findKnowledge, knowledgeReply, parseKnowledge } from '@/lib/hazel-knowledge';
import { generateHazelAnswer } from '@/lib/hazel-ai';

const entries = parseKnowledge(knowledge);
const schema = z.object({ messages: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().trim().min(1).max(3000) })).min(1).max(8) });
const headers = { 'Cache-Control': 'no-store' };
const windows = new Map<string, { count: number; until: number }>();
function allowAI(request: Request) {
  const now = Date.now();
  for (const [key, window] of windows) if (window.until < now) windows.delete(key);
  const key = request.headers.get('cf-connecting-ip') || 'local';
  const window = windows.get(key) || { count: 0, until: now + 60000 };
  if (window.count >= 12 || (!windows.has(key) && windows.size >= 2000)) return false;
  window.count++; windows.set(key, window); return true;
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: 'Please use Hazel on this website.' }, { status: 403, headers });
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ error: 'Please send a chat message.' }, { status: 415, headers });
  let input: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error('Missing message');
    const decoder = new TextDecoder(); let body = ''; let size = 0;
    while (true) { const chunk = await reader.read(); if (chunk.done) break; size += chunk.value.byteLength; if (size > 24000) { await reader.cancel(); return Response.json({ error: 'Please shorten your conversation.' }, { status: 413, headers }); } body += decoder.decode(chunk.value, { stream: true }); }
    input = JSON.parse(body + decoder.decode());
  } catch { return Response.json({ error: 'That message could not be read. Please try again.' }, { status: 400, headers }); }
  const parsed = schema.safeParse(input);
  if (!parsed.success) return Response.json({ error: 'Please keep your question under 1,000 characters.' }, { status: 400, headers });
  const messages = parsed.data.messages;
  const last = messages[messages.length - 1];
  if (last.role !== 'user' || last.content.length > 1000) return Response.json({ error: 'Please send a question under 1,000 characters.' }, { status: 400, headers });
  const fallback = knowledgeReply(entries, messages);
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey || fallback.mode === 'fallback') return Response.json(fallback, { headers });
  // The local limit is a burst guard, not a global provider spending limit.
  if (!allowAI(request)) return Response.json(fallback, { headers });
  try {
    const context = findKnowledge(entries, messages);
    const answer = await generateHazelAnswer(apiKey, env.OPENAI_MODEL || 'gpt-4.1-mini', messages, context);
    return Response.json({ answer, mode: 'ai', sources: context.map(({ title, href, label }) => ({ title, href, label })) }, { headers });
  } catch {
    // Never log visitor messages or provider response bodies. Approved answers remain available.
    return Response.json(fallback, { headers });
  }
}
