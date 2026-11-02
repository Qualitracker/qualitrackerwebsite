import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Horizon = 'now' | 'next' | 'later';

interface LogEntry {
  when: string;
  title: string;
  detail: string;
  state: 'planned' | 'in-progress' | 'conditional';
}

// Sourced from the October 2026 strategy plan (v0.4), product implementation
// plan, and CTO plan. Anything that depends on an unsigned agreement or an
// internal safety gate is marked "conditional" rather than promised.
const HORIZONS: Array<{ id: Horizon; label: string; caption: string; entries: LogEntry[] }> = [
  {
    id: 'now',
    label: 'Now',
    caption: 'Nov 2026',
    entries: [
      { when: 'Mid-Nov 2026', title: 'eQMS private beta starts', detail: 'A small cohort of laboratories tests document control and quality records in real workflows.', state: 'planned' },
      { when: 'Before beta', title: 'Superuser orientation and training', detail: 'Each lab names superusers who are trained virtually first, then supported on site for three days.', state: 'in-progress' },
      { when: 'Throughout', title: 'Feedback ranked every week', detail: 'Every request is logged, ranked, and marked done, deferred, or declined, so users can see what happened to it.', state: 'in-progress' },
    ],
  },
  {
    id: 'next',
    label: 'Next',
    caption: 'Q1 – Q2 2027',
    entries: [
      { when: 'After beta', title: 'Exit review and go / no-go', detail: 'Results are measured against the targets set before the beta, then a documented decision on wider pilots.', state: 'planned' },
      { when: 'From Mar 2027', title: 'Monthly Quality Excellence Challenge', detail: 'A recurring knowledge challenge for laboratory professionals, as requested after the October event.', state: 'conditional' },
      { when: 'After safety review', title: 'QualiBOT for named users', detail: 'Released online only after the 100-case grounding test passes and the product and technology leads agree it is safe.', state: 'conditional' },
    ],
  },
  {
    id: 'later',
    label: 'Later',
    caption: 'By Sep 2027',
    entries: [
      { when: 'By Sep 2027', title: 'Pilot results published', detail: 'What worked, what did not, and what laboratories actually did differently, measured rather than assumed.', state: 'planned' },
      { when: 'By Sep 2027', title: 'First price list', detail: 'Pricing is set from pilot evidence. QualiTracker is pre-revenue and is not selling during the beta.', state: 'planned' },
      { when: 'Beyond', title: 'Wider East Africa', detail: 'Tanzania and East Africa come first. Other regions follow the evidence, not the other way round.', state: 'planned' },
    ],
  },
];

const STATE_LABEL: Record<LogEntry['state'], string> = {
  planned: 'planned',
  'in-progress': 'in progress',
  conditional: 'depends on a gate',
};

export function RoadmapBuildLog() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<Horizon>('now');
  const current = HORIZONS.find((h) => h.id === active) ?? HORIZONS[0];

  return (
    <div className="overflow-hidden rounded-xl border" style={{ background: 'var(--qt-dark-navy)', borderColor: 'rgba(255,255,255,.14)' }} data-testid="roadmap-build-log">
      <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: 'rgba(255,255,255,.14)' }}>
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--qt-quality-gold)' }} aria-hidden="true" />
        <span className="font-mono-ui text-[11px]" style={{ color: 'var(--qt-light-teal)' }}>qualitracker / build-log</span>
        <div role="tablist" aria-label="Roadmap horizon" className="ml-auto flex gap-1">
          {HORIZONS.map((h) => {
            const selected = h.id === active;
            return (
              <button
                key={h.id}
                role="tab"
                id={`roadmap-tab-${h.id}`}
                aria-selected={selected}
                aria-controls="roadmap-panel"
                type="button"
                onClick={() => setActive(h.id)}
                className="qt-focus rounded-md px-3 py-1.5 font-mono-ui text-[11px] transition-colors"
                style={{
                  background: selected ? 'var(--qt-quality-gold)' : 'transparent',
                  color: selected ? 'var(--qt-dark-navy)' : 'var(--qt-mint-light)',
                }}
              >
                {h.label}
              </button>
            );
          })}
        </div>
      </div>

      <div role="tabpanel" id="roadmap-panel" aria-labelledby={`roadmap-tab-${active}`} className="p-5 sm:p-6">
        <p className="font-mono-ui text-[11px]" style={{ color: 'var(--qt-light-teal)' }}>$ roadmap --horizon {current.id} <span># {current.caption}</span></p>
        <ol className="mt-5 space-y-5">
          {current.entries.map((entry, i) => (
            <motion.li
              key={`${current.id}-${entry.title}`}
              initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08, ease: [0.2, 0, 0.2, 1] }}
              className="grid gap-1 border-l-2 pl-4 sm:grid-cols-[130px_1fr] sm:gap-4"
              style={{ borderColor: entry.state === 'conditional' ? 'rgba(255,255,255,.28)' : 'var(--qt-quality-gold)' }}
            >
              <span className="font-mono-ui text-[11px]" style={{ color: 'var(--qt-light-teal)' }}>{entry.when}</span>
              <div>
                <p className="font-brand text-base font-bold" style={{ color: '#FFFFFF' }}>
                  {entry.title}
                  <span className="ml-2 align-middle font-mono-ui text-[10px] font-normal uppercase tracking-[.1em]" style={{ color: 'var(--qt-light-teal)' }}>{STATE_LABEL[entry.state]}</span>
                </p>
                <p className="mt-1 text-xs leading-5" style={{ color: 'var(--qt-mint-light)' }}>{entry.detail}</p>
              </div>
            </motion.li>
          ))}
        </ol>
        <p className="mt-6 font-mono-ui text-[10px] leading-4" style={{ color: 'var(--qt-light-teal)' }}>
          Plans change with evidence. Dates marked “depends on a gate” need a signed agreement or an internal safety check first.
        </p>
      </div>
    </div>
  );
}
