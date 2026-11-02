import { useState } from 'react';

/**
 * A recreation of the shape of the product dashboard: stat cards plus a
 * lab-scoped context panel, restyled to the QualiTracker brand tokens. The
 * layout and fields mirror templates/dashboard.html in the real repository
 * (Laboratories / Departments / Roles / Users counts, current lab,
 * department, and role panel). All values are illustrative, and the role
 * switcher only shows how the same dashboard is scoped to who is signed in.
 */
const VIEWS = [
  {
    role: 'Lab director',
    stats: [
      { label: 'Laboratories', value: '4', tint: 'var(--qt-teal-tint)', color: 'var(--qt-deep-teal)' },
      { label: 'Departments', value: '11', tint: 'var(--qt-mint-light)', color: 'var(--qt-deep-teal)' },
      { label: 'Roles', value: '6', tint: 'var(--qt-lab-grey)', color: 'var(--qt-body-grey)' },
      { label: 'Users in your lab', value: '23', tint: '#F9F5EA', color: 'var(--qt-gold-text)' },
    ],
    scope: 'Every laboratory and department you oversee.',
  },
  {
    role: 'Quality manager',
    stats: [
      { label: 'Open findings', value: '5', tint: '#F9F5EA', color: 'var(--qt-gold-text)' },
      { label: 'Documents in review', value: '8', tint: 'var(--qt-teal-tint)', color: 'var(--qt-deep-teal)' },
      { label: 'Actions due this week', value: '3', tint: 'var(--qt-mint-light)', color: 'var(--qt-deep-teal)' },
      { label: 'Audits planned', value: '2', tint: 'var(--qt-lab-grey)', color: 'var(--qt-body-grey)' },
    ],
    scope: 'The quality records for your laboratory.',
  },
  {
    role: 'Technologist',
    stats: [
      { label: 'Records to complete today', value: '6', tint: '#F9F5EA', color: 'var(--qt-gold-text)' },
      { label: 'SOPs assigned to read', value: '2', tint: 'var(--qt-teal-tint)', color: 'var(--qt-deep-teal)' },
      { label: 'Questions asked', value: '4', tint: 'var(--qt-mint-light)', color: 'var(--qt-deep-teal)' },
      { label: 'Training due', value: '1', tint: 'var(--qt-lab-grey)', color: 'var(--qt-body-grey)' },
    ],
    scope: 'Only what your role needs for the work in front of you.',
  },
] as const;

export function QualityCommandCenter() {
  const [index, setIndex] = useState(0);
  const view = VIEWS[index];

  return (
    <div className="qt-card qt-shadow-overlay overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3.5" style={{ borderColor: 'var(--qt-border-grey)', background: 'var(--qt-clinical-white)' }}>
        <span className="text-sm font-semibold" style={{ color: 'var(--qt-near-black)' }}>Welcome back, dashboard</span>
        <span className="font-mono-ui rounded-md px-2 py-1 text-[9px] uppercase tracking-[.08em]" style={{ background: 'var(--qt-lab-grey)', color: 'var(--qt-body-grey)' }}>
          Illustrative sample
        </span>
      </div>
      <div role="tablist" aria-label="Sign in as" className="flex flex-wrap gap-2 px-5 pt-4">
        {VIEWS.map((v, i) => (
          <button
            key={v.role}
            role="tab"
            type="button"
            aria-selected={i === index}
            onClick={() => setIndex(i)}
            className="qt-focus rounded-full border px-3.5 py-1.5 text-[11px] font-semibold transition-colors"
            style={{
              background: i === index ? 'var(--qt-dark-navy)' : '#FFFFFF',
              color: i === index ? '#FFFFFF' : 'var(--qt-body-grey)',
              borderColor: i === index ? 'var(--qt-dark-navy)' : 'var(--qt-border-grey)',
              borderStyle: i === index ? 'solid' : 'dashed',
            }}
          >
            {v.role}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4" aria-live="polite">
        {view.stats.map((s) => (
          <div key={s.label} className="rounded-xl p-4" style={{ background: s.tint }}>
            <div className="font-brand text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="mt-1 text-[11px]" style={{ color: 'var(--qt-body-grey)' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className="border-t px-5 py-4" style={{ borderColor: 'var(--qt-border-grey)' }}>
        <p className="font-mono-ui text-[10px] uppercase tracking-[.08em]" style={{ color: 'var(--qt-body-grey)' }}>Your laboratory</p>
        <div className="mt-3 flex flex-wrap gap-6">
          <div>
            <div className="text-[10px]" style={{ color: 'var(--qt-body-grey)' }}>LABORATORY</div>
            <div className="mt-0.5 text-sm font-bold" style={{ color: 'var(--qt-near-black)' }}>Central Reference Lab</div>
          </div>
          <div>
            <div className="text-[10px]" style={{ color: 'var(--qt-body-grey)' }}>LAB TYPE</div>
            <span className="mt-0.5 inline-block rounded-full px-2.5 py-1 font-mono-ui text-[10px]" style={{ background: 'var(--qt-teal-tint)', color: 'var(--qt-deep-teal)' }}>Clinical</span>
          </div>
          <div>
            <div className="text-[10px]" style={{ color: 'var(--qt-body-grey)' }}>DEPARTMENT</div>
            <div className="mt-0.5 text-sm font-semibold" style={{ color: 'var(--qt-near-black)' }}>Microbiology</div>
          </div>
        </div>
        <p className="mt-4 text-xs leading-5" style={{ color: 'var(--qt-body-grey)' }}>You see: {view.scope}</p>
      </div>
    </div>
  );
}
