'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { ArrowDown, ArrowRight, Check, ClipboardCheck, Globe2, Mail, MapPin, Pause, Play, RotateCcw, Sparkles, Squirrel, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stages = [
  { name: 'Website', icon: Globe2, status: 'Sarah’s enquiry captured.', duration: 1500 },
  { name: 'AI lead agent', icon: Sparkles, status: 'A helpful first response prepared.', duration: 2800 },
  { name: 'Qualification', icon: Check, status: 'Service, location, contact and job details checked.', duration: 1800 },
  { name: 'Enquiry handover', icon: ClipboardCheck, status: 'A clear summary ready for the business owner.', duration: 1800 },
  { name: 'Automation', icon: Workflow, status: 'Confirmation, follow-up and owner notification complete in this example.', duration: 2000 },
  { name: 'Result', icon: Check, status: 'Sarah is ready for a callback. Experiment complete.', duration: 0 },
];

function StageContent({ stage }: { stage: number }) {
  if (stage === 0) return <div className="pl-capture">
    <div className="pl-browser-bar"><span /><span /><span /><small>YOUR BUSINESS WEBSITE</small><Globe2 size={13} /></div>
    <div className="pl-capture-body"><span className="pl-mini-label">NEW WEBSITE ENQUIRY</span><p>“Could I get a quote for a<br />switchboard replacement?”</p><span className="pl-stamp"><Check size={14} /> Enquiry captured</span></div>
  </div>;
  if (stage === 1) return <div className="pl-agent">
    <div className="pl-agent-label"><Sparkles size={15} /> A HELPFUL FIRST RESPONSE</div>
    <p>“Hi Sarah! We can help with that. Can I ask you a couple of quick questions?”</p>
    <small>Sample AI response</small>
  </div>;
  if (stage === 2) return <div className="pl-qualification">
    <div>{['Service', 'Location', 'Contact', 'Job details'].map((field, i) => <span key={field} style={{ animationDelay: `${i * 90}ms` }}>{field}<Check size={15} /></span>)}</div>
    <span className="pl-stamp"><ClipboardCheck size={15} /> Lead qualified</span>
  </div>;
  if (stage === 3) return <div className="pl-handover">
    <span className="pl-mini-label"><Check size={14} /> NEW QUALIFIED LEAD</span>
    <div className="pl-person"><span>S</span><div><strong>Sarah</strong><p>Switchboard replacement</p><small>Richmond, VIC</small></div></div>
    <div className="pl-handover-note"><ClipboardCheck size={14} /> One clear summary. Ready to act on.</div>
  </div>;
  if (stage === 4) return <div className="pl-automation">{['Confirmation sent', 'Follow-up scheduled', 'Enquiry summary prepared', 'Business owner notified'].map((label, i) => <div key={label} style={{ animationDelay: `${i * 100}ms` }}><Check size={15} /><span>{label}</span></div>)}</div>;
  return <div className="pl-result">
    <span className="pl-mini-label">SARAH IS READY FOR A CALLBACK.</span>
    <h3>One enquiry.<br /><em>Zero chasing.</em></h3>
    <p>Website <b>+</b> AI agent <b>+</b> Handover <b>+</b> Automation<br /><strong>working together.</strong></p>
  </div>;
}

export default function InteractiveHero() {
  const [stage, setStage] = useState(-1);
  const [furthest, setFurthest] = useState(-1);
  const [running, setRunning] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const panel = useRef<HTMLDivElement>(null);
  const finished = stage === stages.length - 1;
  const started = stage >= 0;

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => { setReducedMotion(preference.matches); if (preference.matches) setRunning(false); };
    const visibility = () => setPageVisible(!document.hidden);
    sync(); visibility();
    preference.addEventListener('change', sync);
    document.addEventListener('visibilitychange', visibility);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .15 });
    if (panel.current) observer.observe(panel.current);
    return () => { preference.removeEventListener('change', sync); document.removeEventListener('visibilitychange', visibility); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!running || !inView || !pageVisible || reducedMotion || stage < 0 || finished) return;
    const timer = window.setTimeout(() => {
      const next = stage + 1;
      setStage(next); setFurthest(value => Math.max(value, next));
      if (next === stages.length - 1) setRunning(false);
    }, stages[stage].duration);
    return () => window.clearTimeout(timer);
  }, [stage, running, reducedMotion, inView, pageVisible, finished]);

  function run() {
    setStage(0); setFurthest(0);
    setRunning(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (window.matchMedia('(max-width: 1023px)').matches) {
      window.requestAnimationFrame(() => panel.current?.scrollIntoView({ block: 'start', behavior: 'instant' }));
    }
  }
  function next() {
    setRunning(false);
    const nextStage = Math.min(stage + 1, stages.length - 1);
    setStage(nextStage);
    setFurthest(reached => Math.max(reached, nextStage));
  }
  function explore(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const target = document.getElementById('missed');
    if (!target) return;
    event.preventDefault();
    setRunning(false);
    window.history.pushState(null, '', '#missed');
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  }

  return <section className="digital-hero" id="start" aria-labelledby="hero-title">
    <div className="hero-layout">
      <div className="hero-message">
        <div className="hero-eyebrow"><span aria-hidden="true" /> SMALL BUSINESS. BIG POSSIBILITIES.</div>
        <h1 id="hero-title"><span>You do the work.</span><em>We’ll keep<br className="hero-desktop-break" /> things moving.</em></h1>
        <p>Websites, AI agents and automations that capture opportunities, follow up customers and take repetitive work off your plate.</p>
        <div className="hero-actions">
          <Button asChild className="action hero-primary"><a href="#quote">Get a quote <ArrowRight size={18} /></a></Button>
          <a className="hero-secondary" href="#missed" onClick={explore}>Explore the lab <ArrowDown size={17} /></a>
        </div>
        <p className="hero-microcopy">Built around your business.<br /><strong>Not the other way around.</strong></p>
      </div>

      <div className="hero-playground" id="try-the-lab">
        <div className="pl-introduction"><span>Less “what if.”</span><strong>More “watch this.”</strong><span className="pl-edition" aria-hidden="true">EXPERIMENT / 001</span></div>
        <div ref={panel} className={`possibility-lab ${started ? 'pl-started' : ''} ${running && inView && pageVisible ? 'pl-running' : ''} ${finished ? 'pl-finished' : ''}`}>
          <div className="pl-topline"><span className="pl-online"><i aria-hidden="true" /> LAB ONLINE</span><span className="pl-serial" aria-hidden="true">SL—001 <Squirrel size={18} strokeWidth={1.5} /></span></div>
          <div className="pl-heading"><h2>The possibility lab</h2><p>See what happens when an enquiry<br className="pl-wide-only" /> enters a smarter business.</p></div>

          <div className="pl-enquiry">
            <div className="pl-enquiry-meta"><span><Mail size={13} /> NEW ENQUIRY</span><time>10:42 AM</time></div>
            <div className="pl-person"><span>S</span><div><strong>Sarah</strong><p>Switchboard replacement</p><small><MapPin size={11} /> Richmond, VIC</small></div></div>
            <span className="pl-entry-port" aria-hidden="true"><ArrowRight size={14} /></span>
          </div>

          <div className="pl-controls">
            <div className={`pl-control-row ${started ? 'pl-has-started' : ''}`}>
              {started && !reducedMotion && <Button key="pause" variant="ghost" className="pl-pause" aria-disabled={finished} onClick={() => { if (!finished) setRunning(value => !value); }}>{finished ? <Check size={15} /> : running ? <Pause size={15} /> : <Play size={15} />}{finished ? 'Complete' : running ? 'Pause' : 'Play'}</Button>}
              <Button key="advance" variant={started ? 'ghost' : 'default'} className={!started ? 'action pl-run-button' : finished ? 'pl-replay' : 'pl-next'} onClick={!started || finished ? run : next}>{!started ? <>Run the experiment <ArrowRight size={18} /></> : finished ? <><RotateCcw size={16} /> Replay experiment</> : <>Next step <ArrowRight size={16} /></>}</Button>
            </div>
            {finished && <a className="pl-see-how" href="#missed" onClick={explore}>See how it works <ArrowDown size={16} /></a>}
            <p className="pl-control-hint">{!started ? 'Six small steps. One better way to work.' : finished ? 'Example complete. Your business shapes the real workflow.' : reducedMotion ? 'Step through at your own pace. Motion is reduced.' : running ? 'Follow the signal. Pause or step ahead anytime.' : 'Paused. Take a closer look, or continue.'}</p>
          </div>

          {!started ? <div className="pl-ready">
            <div className="pl-intake" aria-hidden="true"><span /><ArrowDown size={16} /><span /></div>
            <div className="pl-ready-modules" aria-hidden="true"><span><Globe2 size={22} /><small>WEBSITE</small></span><i /><span><Sparkles size={22} /><small>AI AGENT</small></span><i /><span><Workflow size={22} /><small>AUTOMATION</small></span></div>
            <div className="pl-ready-message"><span>One opportunity.</span><strong>Let’s put it to work.</strong></div>
          </div> : <div className="pl-workflow" aria-label="Enquiry experiment">
            <div className="pl-traveller" aria-hidden="true"><Mail size={12} /><span>Sarah’s enquiry</span><span>10:42 AM</span></div>
            <ol className="pl-stages">
              {stages.map(({ name, icon: Icon }, index) => {
                const current = stage === index;
                const complete = index < furthest || furthest === stages.length - 1;
                return <li key={name} className={`pl-stage ${current ? 'pl-current' : ''} ${complete ? 'pl-complete' : ''}`} aria-current={current ? 'step' : undefined}>
                  <span className="pl-stage-marker" aria-hidden="true">{complete ? <Check size={13} /> : String(index + 1).padStart(2, '0')}</span>
                  <button type="button" className="pl-stage-label" aria-expanded={current} aria-controls={`pl-stage-detail-${index}`} aria-label={`${name}, ${current ? 'current stage' : complete ? 'completed, review stage' : index <= furthest ? 'review stage' : 'upcoming stage'}`} disabled={index > furthest} onClick={() => { setStage(index); setRunning(false); }}><Icon size={14} /><span>{name}</span><small>{current ? `0${index + 1} / 06` : complete ? 'Done' : 'Waiting'}</small></button>
                  <div id={`pl-stage-detail-${index}`} hidden={!current}>{current && <div className="pl-active-detail"><StageContent stage={index} /></div>}</div>
                </li>;
              })}
            </ol>
          </div>}

          <div className="pl-result-ticket" aria-hidden="true"><span><Check size={14} /> QUALIFIED</span><strong>Ready for callback</strong><small>Sarah’s next step is clear.</small></div>
          <p className="pl-announcement" role="status" aria-atomic="true">{started ? `Stage ${stage + 1} of 6. ${stages[stage].name}. ${stages[stage].status}` : 'The experiment is ready. Select Run the experiment to begin.'}</p>
        </div>
        <p className="hero-demo-disclosure">Illustrative demo. Sarah is fictional. No messages are sent<br className="pl-wide-only" /> and no external actions are performed.</p>
      </div>
    </div>
  </section>;
}
