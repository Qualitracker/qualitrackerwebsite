import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Mode = 'paper' | 'digital';

// Illustrative freezer temperature log. Not a real laboratory's data.
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const PAPER = ['-19', '', '-18', '-1B', ''];
const DIGITAL = [
  { v: '-19.2 °C', who: 'A. Mushi · 07:42', ok: true },
  { v: '-18.7 °C', who: 'A. Mushi · 07:40', ok: true },
  { v: '-18.1 °C', who: 'J. Komba · 07:51', ok: true },
  { v: '-9.4 °C', who: 'J. Komba · 07:49', ok: false },
  { v: '-18.9 °C', who: 'A. Mushi · 07:44', ok: true },
];

export function PaperToProof() {
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState<Mode>('paper');

  return (
    <div className="rounded-xl border p-5 sm:p-6" style={{ background: '#FFFFFF', borderColor: 'var(--qt-border-grey)' }} data-testid="paper-to-proof">
      <div role="tablist" aria-label="Record keeping method" className="inline-flex rounded-lg p-1" style={{ background: 'var(--qt-lab-grey)' }}>
        {([['paper', 'Paper today'], ['digital', 'With QualiTracker eQMS']] as const).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={mode === id}
            onClick={() => setMode(id)}
            className="qt-focus rounded-md px-4 py-2 text-xs font-semibold transition-colors"
            style={{ background: mode === id ? 'var(--qt-dark-navy)' : 'transparent', color: mode === id ? '#FFFFFF' : 'var(--qt-body-grey)' }}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="qt-technical-label mt-5">Freezer 2 · daily temperature check · acceptable range −25 to −15 °C</p>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {DAYS.map((day, i) => {
          const d = DIGITAL[i];
          const paperValue = PAPER[i];
          const missing = paperValue === '';
          return (
            <motion.div
              key={`${mode}-${day}`}
              initial={reduceMotion ? undefined : { opacity: 0, y: 6 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              className="rounded-md border p-2 sm:p-3"
              style={{
                borderColor: mode === 'digital' && !d.ok ? 'var(--qt-quality-gold)' : 'var(--qt-border-grey)',
                background: mode === 'paper' ? '#FBF8EF' : '#FFFFFF',
                borderStyle: mode === 'paper' && missing ? 'dashed' : 'solid',
              }}
            >
              <p className="font-mono-ui text-[10px] uppercase" style={{ color: 'var(--qt-body-grey)' }}>{day}</p>
              {mode === 'paper' ? (
                <p className="mt-2 text-sm italic" style={{ color: 'var(--qt-near-black)', fontFamily: 'cursive' }}>{missing ? ', ' : paperValue}</p>
              ) : (
                <>
                  <p className="mt-2 text-xs font-bold" style={{ color: d.ok ? 'var(--qt-near-black)' : 'var(--qt-gold-text, #9D833B)' }}>{d.v}</p>
                  <p className="mt-1 hidden text-[10px] leading-4 sm:block" style={{ color: 'var(--qt-body-grey)' }}>{d.who}</p>
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      <div aria-live="polite" className="mt-5 text-xs leading-5" style={{ color: 'var(--qt-body-grey)' }}>
        {mode === 'paper' ? (
          <ul className="list-disc space-y-1 pl-4">
            <li>Two days were never filled in, and nobody finds out until an audit.</li>
            <li>“-1B” could be −18 or −19. Nobody can tell which, and the sample decision depends on it.</li>
          </ul>
        ) : (
          <ul className="list-disc space-y-1 pl-4">
            <li>Each entry carries a value, a person and a time, and an empty day is flagged as missing instead of hidden.</li>
            <li>Thursday's out-of-range reading is flagged as it is recorded, so an action can be opened before samples are affected.</li>
          </ul>
        )}
      </div>
      <p className="mt-4 font-mono-ui text-[10px]" style={{ color: 'var(--qt-body-grey)' }}>Illustrative example, not a real laboratory's data. Names are placeholders.</p>
    </div>
  );
}
