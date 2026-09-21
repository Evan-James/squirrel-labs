'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, CheckCheck, Globe2, MousePointer2, Play, RotateCcw, Send, Sparkles, Workflow } from 'lucide-react';

const modes = [
  { name: 'Websites', icon: Globe2, caption: 'A better first impression. A clear next step.' },
  { name: 'AI assistants', icon: Sparkles, caption: 'Helpful answers, even when you’re busy.' },
  { name: 'Admin automation', icon: Workflow, caption: 'The same small tasks. A lot less effort.' },
];
const questions = [
  { question: 'What can you build for me?', answer: 'A website that brings in enquiries, an AI assistant that answers common questions, or an automation that handles repetitive admin. What would make your day easier?' },
  { question: 'Can you help with repetitive admin?', answer: 'Yes. Think quote follow-ups, appointment reminders, routine data entry and enquiry summaries. Start with the task you keep doing by hand, and we can explore how to automate it.' },
];
const workflows = [
  { name: 'Quote follow-up', steps: ['Read the quote details', 'Prepare a friendly follow-up', 'Set a reminder for the right day'], outcome: 'A follow-up ready to go. One less thing to remember.' },
  { name: 'Enquiry summary', steps: ['Collect the enquiry details', 'Organise the key information', 'Prepare a clear handover'], outcome: 'The useful details in one summary. No copying them twice.' },
  { name: 'Appointment reminder', steps: ['Read the appointment details', 'Prepare the reminder message', 'Schedule it before the appointment'], outcome: 'A reminder prepared. One less manual message.' },
];

export default function InteractiveHero() {
  const [mode, setMode] = useState(0);
  const [websiteStyle, setWebsiteStyle] = useState(0);
  const [enquiry, setEnquiry] = useState(false);
  const [question, setQuestion] = useState<number | null>(null);
  const [workflow, setWorkflow] = useState(0);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!running) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(3); setRunning(false); return;
    }
    const timer = window.setTimeout(() => {
      setStep(current => current + 1);
      if (step === 2) setRunning(false);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [running, step]);

  function chooseMode(index: number) {
    setMode(index); setRunning(false); setStep(0);
  }
  function tabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === 'ArrowRight' ? (index + 1) % 3 : event.key === 'ArrowLeft' ? (index + 2) % 3 : event.key === 'Home' ? 0 : event.key === 'End' ? 2 : null;
    if (next === null) return;
    event.preventDefault(); chooseMode(next); tabs.current[next]?.focus();
  }

  return <section className="digital-hero" id="start" aria-labelledby="hero-title">
    <div className="hero-layout">
      <div className="hero-message">
        <div className="hero-eyebrow"><span /> SMALL BUSINESS. BIG POSSIBILITIES.</div>
        <h1 id="hero-title">Smarter websites.<br /><em>Less busywork.</em></h1>
        <p>Websites that open doors. AI assistants that lend a hand. Automations that take repetitive admin off your plate.</p>
        <div className="hero-actions"><a className="action" href="#quote">Let’s build something <ArrowUpRight size={19} /></a><a className="hero-secondary" href="#lab">Explore our services <ArrowRight size={17} /></a></div>
        <div className="hero-signature"><span className="hero-spark"><Sparkles size={18} /></span><span>Built around your business.<br /><strong>A little Squirrel Labs ingenuity.</strong></span></div>
      </div>

      <div className="hero-playground" id="try-the-lab">
        <div className="playground-note"><span>LESS “WHAT IF”. MORE “LIKE THIS”.</span><span><MousePointer2 size={14} /> Try the lab</span></div>
        <div className="lab-console">
          <div className="console-top"><span className="console-brand"><span>s.</span>THE POSSIBILITY LAB</span><span className="console-live"><span /> Interactive demo</span></div>
          <div className="hero-tabs" role="tablist" aria-label="Explore what Squirrel Labs builds">
            {modes.map(({ name, icon: Icon }, index) => <button key={name} ref={node => { tabs.current[index] = node; }} type="button" role="tab" id={`hero-tab-${index}`} aria-selected={mode === index} aria-controls="hero-panel" tabIndex={mode === index ? 0 : -1} onClick={() => chooseMode(index)} onKeyDown={event => tabKey(event, index)}><Icon size={17} /><span>{name}</span></button>)}
          </div>
          <div className="hero-demo-panel" id="hero-panel" role="tabpanel" aria-labelledby={`hero-tab-${mode}`} tabIndex={0}>
            <div className="demo-caption"><span>0{mode + 1} / {modes[mode].name.toUpperCase()}</span><p>{modes[mode].caption}</p></div>
            {mode === 0 && <div className="website-demo">
              <div className="website-style" role="group" aria-label="Choose a website example">{['Business website', 'Landing page'].map((name, index) => <button type="button" key={name} aria-pressed={websiteStyle === index} onClick={() => { setWebsiteStyle(index); setEnquiry(false); }}>{name}</button>)}</div>
              <div className={`mini-browser ${websiteStyle === 1 ? 'landing-preview' : ''}`}>
                <div className="mini-browser-bar"><i /><i /><i /><span>your-business.com.au</span><Globe2 size={12} /></div>
                <div className="mini-site"><div className="mini-site-nav"><strong>{websiteStyle === 0 ? 'YOUR BUSINESS' : 'YOUR NEXT BIG IDEA'}</strong><span>Made for you <Sparkles size={12} /></span></div>
                  {enquiry ? <div className="mini-enquiry" role="status"><span><CheckCheck size={26} /></span><h3>A new conversation starts.</h3><p>Example enquiry captured.<br />A clear summary, ready for your reply.</p><button type="button" onClick={() => setEnquiry(false)}><RotateCcw size={13} /> Back to the website</button></div> : <div className="mini-site-content"><span className="mini-label">{websiteStyle === 0 ? 'GOOD AT WHAT YOU DO.' : 'ONE IDEA. ONE CLEAR NEXT STEP.'}</span><h3>{websiteStyle === 0 ? <>Make a great<br /><em>first impression.</em></> : <>Turn a little interest<br /><em>into a conversation.</em></>}</h3><p>{websiteStyle === 0 ? 'Give your next customer a reason to get in touch.' : 'A focused page built around your next offer.'}</p><button type="button" onClick={() => setEnquiry(true)}>Try an enquiry <ArrowUpRight size={14} /></button><div className="mini-orbit" aria-hidden="true"><span /><span /><Sparkles /></div></div>}
                </div>
              </div>
              <div className="demo-hint"><MousePointer2 size={14} /> Change the page. Try the enquiry button.</div>
            </div>}
            {mode === 1 && <div className="assistant-demo">
              <div className="assistant-identity"><span><Sparkles size={19} /></span><div><strong>Your helpful assistant</strong><small>Business knowledge. A human touch.</small></div></div>
              <div className="assistant-conversation" aria-live="polite"><p className="assistant-bubble">Hello! What would you like to make easier?</p>{question !== null && <><p className="visitor-bubble">{questions[question].question}</p><p className="assistant-bubble assistant-answer">{questions[question].answer}</p></>}</div>
              <div className="assistant-prompts"><span>TRY A QUESTION</span>{questions.map(({ question: text }, index) => <button type="button" aria-pressed={question === index} key={text} onClick={() => setQuestion(index)}>{text}<Send size={14} /></button>)}</div>
            </div>}
            {mode === 2 && <div className="automation-demo">
              <label htmlFor="hero-task">What keeps ending up on your to-do list?</label><select id="hero-task" value={workflow} onChange={event => { setWorkflow(Number(event.target.value)); setRunning(false); setStep(0); }}>{workflows.map((task, index) => <option value={index} key={task.name}>{task.name}</option>)}</select>
              <ol className="automation-steps">{workflows[workflow].steps.map((label, index) => <li key={label} className={step > index ? 'step-done' : running && step === index ? 'step-active' : ''}><span>{step > index ? <Check size={16} /> : `0${index + 1}`}</span><span>{label}</span>{step > index && <small>Ready</small>}</li>)}</ol>
              <button className="run-workflow" type="button" disabled={running} onClick={() => { setStep(0); setRunning(true); }}>{running ? <Workflow size={17} /> : step === 3 ? <RotateCcw size={17} /> : <Play size={17} />}{running ? 'Working through the steps…' : step === 3 ? 'Run it again' : 'Run this example'}<ArrowRight size={17} /></button>
              <p className="workflow-outcome" role="status">{step === 3 ? workflows[workflow].outcome : 'Watch the routine steps take care of themselves.'}</p>
            </div>}
          </div>
          <div className="console-foot"><span><span /> {mode === 0 ? 'DESIGNED TO START CONVERSATIONS' : mode === 1 ? 'A HELPFUL FIRST RESPONSE' : 'LESS COPYING. LESS CHASING.'}</span><span>SL / 001</span></div>
        </div>
        <p className="hero-demo-disclosure">Interactive examples. Sample replies and outcomes; no messages are sent.</p>
      </div>
    </div>
    <div className="hero-story-link"><a href="#missed"><span className="scroll-circle"><ArrowDown size={18} /></span><span>See what this could change<br /><strong>A small business story</strong></span></a><span>AI ASSISTANTS <i /> ADMIN AUTOMATION <i /> WEBSITES</span></div>
  </section>;
}
