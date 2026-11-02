import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { StatusBadge, type ProductStatus } from '@/components/site/status-badge';

interface Module {
  label: string;
  status: ProductStatus;
  copy: string;
}

// Descriptions state intent in plain terms. Anything not in the beta is
// described as planned or in development, never as available.
const MODULES: Module[] = [
  { label: 'Document & SOP control', status: 'private-beta', copy: 'Versioned documents that move through draft, review, and approval, with the history kept.' },
  { label: 'Quality records', status: 'private-beta', copy: 'Daily records such as temperature checks, QC and proficiency testing, each with who recorded it and when.' },
  { label: 'AI assistant (QualiBOT)', status: 'in-development', copy: 'Answers questions only from your laboratory\'s own documents, cites the source, and says so when it cannot find an answer. Tested separately and not part of the November beta.' },
  { label: 'Corrective actions (CAPA)', status: 'in-development', copy: 'A finding becomes an assigned action that closes only after two independent reviews.' },
  { label: 'Non-conformances', status: 'in-development', copy: 'Findings are logged, numbered, and classed as major or minor so none are lost.' },
  { label: 'Internal audits', status: 'in-development', copy: 'Plan and record audits, and link what they find to actions.' },
  { label: 'Equipment & calibration', status: 'planned', copy: 'Track instruments and when calibration is due.' },
  { label: 'Personnel competency & training', status: 'planned', copy: 'Keep training records and competency sign-offs in one place.' },
  { label: 'Risk management', status: 'planned', copy: 'Register risks with owners and review dates.' },
  { label: 'Analytics & reporting', status: 'planned', copy: 'Summaries of quality indicators drawn from the records above.' },
];

const LANES: Array<{ status: ProductStatus; title: string; empty?: string }> = [
  { status: 'planned', title: 'Planned' },
  { status: 'in-development', title: 'In development' },
  { status: 'private-beta', title: 'Private beta' },
  { status: 'live', title: 'Live', empty: 'Nothing is live yet. Modules move here only after the beta shows they work.' },
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, '-');

export function ModuleMap() {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<string>(MODULES[0].label);
  const current = MODULES.find((m) => m.label === selected) ?? MODULES[0];

  return (
    <div data-testid="module-map">
      <div className="grid gap-4 md:grid-cols-4">
        {LANES.map((lane, li) => {
          const items = MODULES.filter((m) => m.status === lane.status);
          return (
            <div key={lane.status} className="relative">
              <div className="mb-3 flex items-center gap-2">
                <span className="font-mono-ui flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold" style={{ borderColor: 'var(--qt-deep-teal)', color: 'var(--qt-deep-teal)' }}>{li + 1}</span>
                <p className="font-mono-ui text-[11px] font-bold uppercase tracking-[.1em]" style={{ color: 'var(--qt-near-black)' }}>{lane.title}</p>
                <span className="font-mono-ui text-[10px]" style={{ color: 'var(--qt-body-grey)' }}>{items.length}</span>
              </div>
              <div className="h-px w-full" style={{ background: 'var(--qt-border-grey)' }} aria-hidden="true" />
              <ul className="mt-3 space-y-2">
                {items.length === 0 && lane.empty && (
                  <li className="rounded-md border border-dashed p-3 text-xs leading-5" style={{ borderColor: 'var(--qt-border-grey)', color: 'var(--qt-body-grey)' }}>{lane.empty}</li>
                )}
                {items.map((m) => {
                  const on = m.label === selected;
                  return (
                    <li key={m.label}>
                      <button
                        type="button"
                        onClick={() => setSelected(m.label)}
                        aria-pressed={on}
                        className="qt-focus w-full rounded-md border px-3 py-2.5 text-left text-xs font-semibold leading-4 transition-colors"
                        style={{
                          borderColor: on ? 'var(--qt-deep-teal)' : 'var(--qt-border-grey)',
                          background: on ? 'var(--qt-teal-tint)' : '#FFFFFF',
                          borderStyle: lane.status === 'planned' && !on ? 'dashed' : 'solid',
                          color: 'var(--qt-near-black)',
                        }}
                        data-testid={`row-capability-${slug(m.label)}`}
                      >
                        {m.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <motion.div
        key={current.label}
        initial={reduce ? undefined : { opacity: 0, y: 8 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="qt-brackets relative mt-8 p-6"
        aria-live="polite"
      >
        <span className="qt-bracket-b absolute inset-0" aria-hidden="true" />
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-brand text-lg font-bold" style={{ color: 'var(--qt-near-black)' }}>{current.label}</h3>
          <StatusBadge status={current.status} />
        </div>
        <p className="mt-3 max-w-[620px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>{current.copy}</p>
      </motion.div>
    </div>
  );
}
