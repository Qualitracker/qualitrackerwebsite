import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Mode = 'paper' | 'digital';

// Illustrative example of what a night shift passes to the day shift.
// Not a real laboratory's data.
const ITEMS = [
  'Freezer 2 alarm at 03:10, door seal checked',
  'Analyser B: QC failed once, repeated and passed',
  'Reagent lot change on chemistry panel',
  'Two samples rejected: unlabelled tubes',
];

// On paper, the handover depends on what the writer remembered to note and
// what the reader can read. These two stand for notes lost that way.
const LOST_ON_PAPER = new Set([1, 3]);

export function ShiftHandover() {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode>('paper');
  const [handedOver, setHandedOver] = useState(false);

  const received = ITEMS.filter((_, i) => mode === 'digital' || !LOST_ON_PAPER.has(i));

  const choose = (m: Mode) => {
    setMode(m);
    setHandedOver(false);
  };

  return (
    <div className="rounded-xl border p-5 sm:p-6" style={{ background: '#FFFFFF', borderColor: 'var(--qt-border-grey)' }} data-testid="shift-handover">
      <div role="tablist" aria-label="Handover method" className="inline-flex rounded-lg p-1" style={{ background: 'var(--qt-lab-grey)' }}>
        {([['paper', 'Paper notes'], ['digital', 'With QualiTracker']] as const).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={mode === id}
            onClick={() => choose(id)}
            className="qt-focus rounded-md px-4 py-2 text-xs font-semibold transition-colors"
            style={{ background: mode === id ? 'var(--qt-dark-navy)' : 'transparent', color: mode === id ? '#FFFFFF' : 'var(--qt-body-grey)' }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="qt-technical-label">Night shift wrote</p>
          <ul className="mt-2 space-y-2">
            {ITEMS.map((item) => (
              <li key={item} className="rounded-md border border-dashed px-3 py-2 text-xs leading-5" style={{ borderColor: 'var(--qt-border-grey)', color: 'var(--qt-near-black)' }}>{item}</li>
            ))}
          </ul>
        </div>
        <div aria-live="polite">
          <p className="qt-technical-label">Day shift received</p>
          <ul className="mt-2 space-y-2">
            {handedOver ? (
              received.map((item, i) => (
                <motion.li
                  key={`${mode}-${item}`}
                  initial={reduce ? undefined : { opacity: 0, x: -12 }}
                  animate={reduce ? undefined : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="rounded-md border px-3 py-2 text-xs leading-5"
                  style={{ borderColor: 'var(--qt-deep-teal)', background: 'var(--qt-teal-tint)', color: 'var(--qt-near-black)' }}
                >
                  {item}
                </motion.li>
              ))
            ) : (
              <li className="rounded-md border border-dashed px-3 py-6 text-center text-xs" style={{ borderColor: 'var(--qt-border-grey)', color: 'var(--qt-body-grey)' }}>Nothing handed over yet.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setHandedOver(true)}
          className="qt-focus qt-button rounded-md px-4 py-2 text-xs font-semibold"
          style={{ background: 'var(--qt-deep-teal)', color: '#FFFFFF' }}
          data-testid="button-handover"
        >
          Hand over
        </button>
        {handedOver && (
          <p className="text-xs leading-5" style={{ color: 'var(--qt-body-grey)' }}>
            {mode === 'paper'
              ? `${received.length} of ${ITEMS.length} notes arrived. The rest were never written clearly or could not be read.`
              : `All ${ITEMS.length} notes arrived, each with who wrote it and when.`}
          </p>
        )}
      </div>
      <p className="mt-4 font-mono-ui text-[10px]" style={{ color: 'var(--qt-body-grey)' }}>Illustrative example — not a real laboratory's data.</p>
    </div>
  );
}
