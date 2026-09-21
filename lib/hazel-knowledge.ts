export type KnowledgeEntry = { title: string; keywords: string[]; answer: string; href: string; label: string };
export type ChatMessage = { role: 'user' | 'assistant'; content: string };
export type ChatSource = { title: string; href: string; label: string };

export function parseKnowledge(markdown: string): KnowledgeEntry[] {
  return markdown.split(/^## /m).slice(1).map(block => {
    const [title, ...lines] = block.trim().split(/\r?\n/);
    const keywordLine = lines.find(line => line.startsWith('Keywords:'));
    const linkLine = lines.find(line => line.startsWith('Link:'));
    const [href, label] = (linkLine?.slice(5).trim() || '#quote | Talk to Squirrel Labs').split('|').map(x => x.trim());
    const answer = lines.filter(line => !line.startsWith('Keywords:') && !line.startsWith('Link:')).join('\n').trim();
    if (!title || !keywordLine || !answer || !/^#[a-z0-9-]+$/.test(href)) throw new Error('Invalid Hazel knowledge entry');
    return { title, keywords: keywordLine.slice(9).split(',').map(x => normalise(x)), answer, href, label: label || title };
  });
}

function normalise(value: string) {
  return value.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}

function rank(entries: KnowledgeEntry[], query: string) {
  const text = ` ${normalise(query)} `;
  return entries.map(entry => {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (keyword && text.includes(` ${keyword} `)) score += keyword.includes(' ') ? 12 : 4;
    }
    // Promote explicit constraints without confusing quote reminders with prices,
    // or customer-support chatbots with an ongoing technical-support contract.
    const pricingIntent = /\b(price|prices|pricing|cost|costs|how much|fee|fees|rate|rates|budget|cheap|expensive|estimate)\b/.test(text)
      || (/\b(quote|quotation)\b/.test(text) && !/\b(automate|automation|reminder|reminders|follow|chase|chasing)\b/.test(text));
    const platformIntent = /\b(wordpress|shopify|wix|hosting|maintenance|platform|platforms|software|integrations|integration|support plan|ongoing support|technical support)\b/.test(text);
    if (score && (entry.title === 'Pricing and quotes' && pricingIntent
      || entry.title === 'Tools, hosting and support' && platformIntent
      || /^(Timing and availability|Chat privacy)$/.test(entry.title))) score += 15;
    if (score && entry.title === 'CRM services') score += 50;
    return { entry, score };
  }).filter(item => item.score > 0).sort((a, b) => b.score - a.score);
}

export function findKnowledge(entries: KnowledgeEntry[], messages: ChatMessage[]) {
  const query = messages[messages.length - 1]?.content || '';
  let ranked = rank(entries, query);
  if (!ranked.length && /\b(that|those|it|more|this)\b/i.test(query) && /\b(tell|explain|work|more)\b/i.test(query)) {
    const previous = [...messages.slice(0, -1)].reverse().find(message => message.role === 'user');
    if (previous) ranked = rank(entries, previous.content);
  }
  // One clear approved answer in knowledge mode; nearby entries are context only for AI mode.
  return ranked.slice(0, 3).map(item => item.entry);
}

export function knowledgeReply(entries: KnowledgeEntry[], messages: ChatMessage[]) {
  const matches = findKnowledge(entries, messages);
  const first = matches[0];
  return {
    answer: first?.answer || 'I don’t have that information in my knowledge base yet. I can help with Squirrel Labs websites, AI assistants and repetitive admin automation. For a specific project question, please use the quote form so the team can confirm the details.',
    mode: first ? 'knowledge' as const : 'fallback' as const,
    sources: [{ title: first?.title || 'Ask the team', href: first?.href || '#quote', label: first?.label || 'Ask about your project' }],
  };
}
