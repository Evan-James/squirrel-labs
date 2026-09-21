'use client';

import { useState, type ComponentType } from 'react';
import {
  ArrowRight,
  Bell,
  CalendarCheck,
  Check,
  Clock3,
  FileText,
  Globe2,
  Mail,
  MessageSquareText,
  Sparkles,
} from 'lucide-react';

type Icon = ComponentType<{ size?: number; strokeWidth?: number; 'aria-hidden'?: boolean }>;

const websites = [
  {
    kind: 'service',
    label: 'Local service business',
    title: 'Turn local searches into useful enquiries.',
    copy: 'A clear service website with trust signals, service areas and a quote journey that asks the right questions.',
    features: ['Service-led landing pages', 'Smart quote enquiry', 'Local search foundations'],
  },
  {
    kind: 'professional',
    label: 'Professional services',
    title: 'Make expertise easier to understand—and act on.',
    copy: 'A polished, credible site that explains complex services simply and guides the right prospects toward a conversation.',
    features: ['Clear service pathways', 'Insight-led content', 'Qualified contact flow'],
  },
  {
    kind: 'booking',
    label: 'Appointment business',
    title: 'Help customers find and book the next step.',
    copy: 'A calm, mobile-first experience for browsing services, checking availability and requesting an appointment.',
    features: ['Mobile booking journey', 'Service comparison', 'Automated confirmation'],
  },
] as const;

const automations: Array<{
  label: string;
  title: string;
  copy: string;
  result: string;
  steps: Array<{ label: string; icon: Icon }>;
}> = [
  {
    label: 'Enquiry handling',
    title: 'A helpful first response, then one clear handover.',
    copy: 'Capture the useful details, answer common questions and notify the right person without another round of copying and pasting.',
    result: 'The owner receives a useful enquiry summary.',
    steps: [
      { label: 'Enquiry arrives', icon: Mail },
      { label: 'AI asks questions', icon: Sparkles },
      { label: 'Summary prepared', icon: FileText },
      { label: 'Owner notified', icon: Bell },
    ],
  },
  {
    label: 'Quote follow-up',
    title: 'Keep quotes moving without another reminder note.',
    copy: 'When a quote has not received a reply, prepare a timely customer follow-up and alert the owner when the customer responds.',
    result: 'Every open quote has a visible next step.',
    steps: [
      { label: 'Quote sent', icon: FileText },
      { label: 'Wait two days', icon: Clock3 },
      { label: 'Follow-up prepared', icon: MessageSquareText },
      { label: 'Reply highlighted', icon: Bell },
    ],
  },
  {
    label: 'Admin handover',
    title: 'Turn captured details into ready-to-use admin.',
    copy: 'Use information already collected to prepare documents, create the next task and give the team a consistent handover.',
    result: 'Less retyping and fewer missing details.',
    steps: [
      { label: 'Details captured', icon: Check },
      { label: 'Document prepared', icon: FileText },
      { label: 'Task scheduled', icon: CalendarCheck },
      { label: 'Handover ready', icon: ArrowRight },
    ],
  },
];

function WebsitePreview({ kind }: { kind: (typeof websites)[number]['kind'] }) {
  return <div className={`website-preview website-preview-${kind}`} aria-hidden="true">
    <div className="preview-browser-bar"><i /><i /><i /><span>yourbusiness.com.au</span></div>
    <div className="preview-site-nav"><b>{kind === 'service' ? 'NORTHSIDE' : kind === 'professional' ? 'FIELD & CO.' : 'WELLSPACE'}</b><span>Services&nbsp;&nbsp; About&nbsp;&nbsp; Contact</span></div>
    {kind === 'service' && <div className="preview-service">
      <span>LOCAL EXPERTS · CLEAR ANSWERS</span>
      <strong>Good work starts with<br />a better enquiry.</strong>
      <p>Tell us what you need. We’ll take it from here.</p>
      <button tabIndex={-1}>REQUEST A QUOTE <ArrowRight size={12} /></button>
      <aside><Check size={13} /> Enquiry ready to review</aside>
    </div>}
    {kind === 'professional' && <div className="preview-professional">
      <span>ADVICE FOR GROWING BUSINESSES</span>
      <strong>Clear thinking.<br />Confident decisions.</strong>
      <p>Practical advice, explained simply.</p>
      <div><i>01<br /><b>Strategy</b></i><i>02<br /><b>Planning</b></i><i>03<br /><b>Support</b></i></div>
    </div>}
    {kind === 'booking' && <div className="preview-booking">
      <span>CARE THAT FITS YOUR DAY</span>
      <strong>Your next appointment,<br />made simple.</strong>
      <p>Choose a service and find a time that works.</p>
      <div><i>MON<strong>10:30</strong></i><i className="selected">TUE<strong>2:00</strong></i><i>WED<strong>4:15</strong></i></div>
    </div>}
  </div>;
}

export default function CapabilityShowcase() {
  const [view, setView] = useState<'websites' | 'automations'>('websites');

  return <section className="capability-showcase section-pad" id="showcase">
    <div className="showcase-heading">
      <div>
        <div className="eyebrow"><span className="chapter-number">08</span>WHAT WE CAN BUILD</div>
        <h2>See the possibilities.<br /><em>Picture your business.</em></h2>
      </div>
      <div className="showcase-intro">
        <p>Website directions and practical automations designed around the way a small business actually works.</p>
        <small>Illustrative concepts and example workflows. No invented client results.</small>
      </div>
    </div>

    <div className="showcase-tabs" role="tablist" aria-label="Showcase type">
      <button id="websites-tab" role="tab" aria-selected={view === 'websites'} aria-controls="websites-panel" onClick={() => setView('websites')}><Globe2 size={17} /> Website concepts</button>
      <button id="automations-tab" role="tab" aria-selected={view === 'automations'} aria-controls="automations-panel" onClick={() => setView('automations')}><Sparkles size={17} /> Sample automations</button>
    </div>

    {view === 'websites' ? <div className="website-concepts" id="websites-panel" role="tabpanel" aria-labelledby="websites-tab">
      {websites.map(site => <article className="website-concept" key={site.kind}>
        <WebsitePreview kind={site.kind} />
        <div className="concept-copy">
          <span>{site.label}</span>
          <h3>{site.title}</h3>
          <p>{site.copy}</p>
          <ul>{site.features.map(feature => <li key={feature}><Check size={13} />{feature}</li>)}</ul>
        </div>
      </article>)}
    </div> : <div className="automation-concepts" id="automations-panel" role="tabpanel" aria-labelledby="automations-tab">
      {automations.map(automation => <article className="automation-concept" key={automation.label}>
        <div className="automation-copy">
          <span>{automation.label}</span>
          <h3>{automation.title}</h3>
          <p>{automation.copy}</p>
        </div>
        <ol className="automation-flow">
          {automation.steps.map(({ label, icon: StepIcon }, index) => <li key={label}>
            <i><StepIcon size={18} strokeWidth={1.7} aria-hidden={true} /></i>
            <span><small>0{index + 1}</small>{label}</span>
            {index < automation.steps.length - 1 && <ArrowRight size={15} aria-hidden="true" />}
          </li>)}
        </ol>
        <p className="automation-result"><Check size={15} />{automation.result}</p>
      </article>)}
    </div>}
  </section>;
}
