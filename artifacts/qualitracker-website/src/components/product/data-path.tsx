import { useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface DataPathStep {
  key: string;
  label: string;
  icon: ReactNode;
  title: string;
  copy: string;
}

/**
 * The path a laboratory document and a question take through QualiBOT, one
 * node per security practice. Selecting a node explains that practice. The
 * order mirrors the system: redact, isolate, gate, then generate.
 */
export function DataPath({ steps }: { steps: DataPathStep[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <div data-testid="data-path">
      <div role="tablist" aria-label="Path of your data" className="relative grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="absolute left-[12%] right-[12%] top-[26px] hidden h-px border-t border-dashed md:block" style={{ borderColor: 'var(--qt-light-teal)' }} aria-hidden="true" />
        {steps.map((s, i) => {
          const on = i === active;
          return (
            <button
              key={s.key}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls="data-path-panel"
              onClick={() => setActive(i)}
              className="qt-focus relative z-10 flex flex-col items-center gap-2 rounded-lg px-2 py-2 text-center"
              data-testid={`security-practice-${s.key}`}
            >
              <span
                className="flex h-[52px] w-[52px] items-center justify-center rounded-xl border transition-colors"
                style={{
                  background: on ? 'var(--qt-dark-navy)' : '#FFFFFF',
                  color: on ? 'var(--qt-quality-gold)' : 'var(--qt-deep-teal)',
                  borderColor: on ? 'var(--qt-dark-navy)' : 'var(--qt-border-grey)',
                }}
              >
                {s.icon}
              </span>
              <span className="font-mono-ui text-[10px] uppercase tracking-[.08em]" style={{ color: 'var(--qt-body-grey)' }}>Step {i + 1}</span>
              <span className="text-xs font-semibold leading-4" style={{ color: 'var(--qt-near-black)' }}>{s.label}</span>
            </button>
          );
        })}
      </div>

      <motion.div
        key={step.key}
        id="data-path-panel"
        role="tabpanel"
        initial={reduce ? undefined : { opacity: 0, y: 8 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="qt-brackets relative mt-8 p-6"
        aria-live="polite"
      >
        <span className="qt-bracket-b absolute inset-0" aria-hidden="true" />
        <h3 className="font-brand text-lg font-bold" style={{ color: 'var(--qt-near-black)' }}>{step.title}</h3>
        <p className="mt-3 max-w-[620px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>{step.copy}</p>
      </motion.div>
    </div>
  );
}
