'use client';

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { ArrowUp, ArrowUpRight, BookOpen, Check, RotateCcw, Squirrel, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type ChatSource = { title: string; href: string; label: string };
type ReplyMode = 'knowledge' | 'ai' | 'fallback';
type ChatMessage = { id: number; role: 'user' | 'assistant'; content: string; mode?: ReplyMode; sources?: ChatSource[] };
type OutgoingMessage = Pick<ChatMessage, 'role' | 'content'>;

const starters = ['What can you help with?', 'Can you automate my admin?', 'How much does a website cost?'];
const modeLabels: Record<ReplyMode, string> = {
  knowledge: 'From our knowledge base',
  ai: 'AI answer · based on our knowledge base',
  fallback: 'No matching knowledge-base answer',
};

function safeSourceHref(href: string) {
  return /^(#[a-zA-Z0-9_-]+|\/(?!\/)|https?:\/\/)/.test(href);
}

export default function HazelChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [retryMessages, setRetryMessages] = useState<OutgoingMessage[] | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const sequenceRef = useRef(0);
  const nextId = useRef(0);

  useEffect(() => () => requestRef.current?.abort(), []);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => {
      const log = logRef.current;
      if (log) log.scrollTop = log.scrollHeight;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [messages, pending, error, open]);

  async function ask(history: OutgoingMessage[]) {
    const sequence = ++sequenceRef.current;
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setPending(true);
    setError('');
    setRetryMessages(null);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });
      const result = await response.json() as { answer?: string; mode?: ReplyMode; sources?: ChatSource[]; error?: string };
      if (!response.ok) throw new Error(result.error || 'Hazel couldn’t get an answer just now. Please try again.');
      if (typeof result.answer !== 'string' || !result.answer.trim()) throw new Error('Hazel couldn’t get an answer just now. Please try again.');
      if (sequence !== sequenceRef.current) return;
      const mode = result.mode && result.mode in modeLabels ? result.mode : 'knowledge';
      const sources = Array.isArray(result.sources) ? result.sources.filter(source => typeof source.href === 'string' && safeSourceHref(source.href)).slice(0, 3) : [];
      setMessages(current => [...current, { id: ++nextId.current, role: 'assistant', content: result.answer!, mode, sources }]);
    } catch (failure) {
      if (controller.signal.aborted || sequence !== sequenceRef.current) return;
      setError(failure instanceof Error && !(failure instanceof TypeError) ? failure.message : 'Hazel couldn’t connect. Check your connection and try again.');
      setRetryMessages(history);
    } finally {
      if (sequence === sequenceRef.current) {
        setPending(false);
        requestRef.current = null;
      }
    }
  }

  function send(text: string) {
    const content = text.trim();
    if (!content || content.length > 1000 || pending || requestRef.current) return;
    const message: ChatMessage = { id: ++nextId.current, role: 'user', content };
    const updated = [...messages, message];
    setMessages(updated);
    setDraft('');
    void ask(updated.slice(-8).map(({ role, content: messageContent }) => ({ role, content: messageContent })));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(draft);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      send(draft);
    }
  }

  function resetConversation() {
    ++sequenceRef.current;
    requestRef.current?.abort();
    requestRef.current = null;
    setMessages([]);
    setDraft('');
    setError('');
    setRetryMessages(null);
    setPending(false);
    inputRef.current?.focus({ preventScroll: true });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="hazel-launcher" type="button" aria-label="Ask Hazel, Squirrel Labs’ chatbot">
          <span className="hazel-launcher-avatar" aria-hidden="true">
            <img src="/images/hazel-avatar.webp" alt="" width="320" height="320" />
          </span>
          <span>Ask Hazel<small>A little help, right here.</small></span>
          <span className="hazel-launcher-dot" aria-hidden="true" />
        </button>
      </DialogTrigger>
      <DialogContent
        className="hazel-dialog"
        showCloseButton={false}
        onOpenAutoFocus={event => { event.preventDefault(); inputRef.current?.focus({ preventScroll: true }); }}
      >
        <div className="hazel-header">
          <div className="hazel-avatar" aria-hidden="true">
            <img src="/images/hazel-avatar.webp" alt="" width="320" height="320" />
          </div>
          <div className="hazel-heading">
            <DialogTitle>Meet Hazel.</DialogTitle>
            <DialogDescription>Your Squirrel Labs knowledge guide</DialogDescription>
          </div>
          <div className="hazel-header-actions">
            <button type="button" className="hazel-icon-button" onClick={resetConversation} aria-label="Start a new conversation" title="Start a new conversation"><RotateCcw size={17} /></button>
            <DialogClose asChild><button type="button" className="hazel-icon-button" aria-label="Close Hazel"><X size={21} /></button></DialogClose>
          </div>
        </div>
        <div className="hazel-log" ref={logRef} role="log" aria-live="polite" aria-relevant="additions text" aria-label="Conversation with Hazel" aria-busy={pending} tabIndex={0}>
          <div className="hazel-welcome">
            <span className="hazel-welcome-eyebrow"><Squirrel size={15} aria-hidden="true" /> SMALL SQUIRREL. HELPFUL ANSWERS.</span>
            <p>Hi, I’m Hazel <span aria-hidden="true">🌰</span></p>
            <p>I can help you explore websites, AI assistants and ways to automate repetitive admin. What would make your day easier?</p>
            <span className="hazel-guide-note"><BookOpen size={14} aria-hidden="true" /> A knowledge guide, not a live person.</span>
          </div>
          {messages.length === 0 && <div className="hazel-starters" aria-label="Suggested questions">
            {starters.map(question => <button key={question} type="button" onClick={() => send(question)} disabled={pending}>{question}<ArrowUpRight size={16} aria-hidden="true" /></button>)}
          </div>}
          {messages.map(message => <div key={message.id} className={`hazel-message hazel-message-${message.role}`}>
            <span className="hazel-message-author">{message.role === 'user' ? 'You' : 'Hazel'}</span>
            <p>{message.content}</p>
            {message.role === 'assistant' && <>
              {!!message.sources?.length && <div className="hazel-sources" aria-label="Helpful links">{message.sources.map((source, index) => <a key={`${source.href}-${index}`} href={source.href} title={source.title} onClick={() => setOpen(false)}>{source.label || source.title}<ArrowUpRight size={14} aria-hidden="true" /></a>)}</div>}
              <span className="hazel-answer-mode"><Check size={12} aria-hidden="true" />{modeLabels[message.mode || 'knowledge']}</span>
            </>}
          </div>)}
          {pending && <div className="hazel-thinking" role="status"><span aria-hidden="true"><i /><i /><i /></span>Hazel is finding an answer…</div>}
          {error && <div className="hazel-error" role="alert"><p>{error}</p>{retryMessages && <button type="button" onClick={() => void ask(retryMessages)}><RotateCcw size={15} aria-hidden="true" />Try again</button>}</div>}
        </div>
        <div className="hazel-composer">
          <form onSubmit={submit} className="hazel-input-form">
            <label htmlFor="hazel-message" className="sr-only">Your message to Hazel</label>
            <textarea id="hazel-message" ref={inputRef} value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={handleKeyDown} maxLength={1000} rows={1} placeholder="Ask Hazel a question…" autoComplete="off" enterKeyHint="send" aria-describedby="hazel-privacy" />
            <button type="submit" className="hazel-send" disabled={pending || !draft.trim()} aria-label={pending ? 'Waiting for Hazel’s reply' : 'Send message'}><ArrowUp size={21} /></button>
          </form>
          {draft.length > 850 && <p className="hazel-character-count">{draft.length}/1,000 characters</p>}
          <p id="hazel-privacy" className="hazel-privacy">Messages aren’t saved by this site. If AI is enabled, messages are sent to OpenAI. Please don’t share sensitive details.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
