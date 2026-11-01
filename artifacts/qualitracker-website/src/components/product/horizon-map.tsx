import { useState } from 'react';

// From the company profile (2026): four growth horizons. The profile states
// that timelines are illustrative, and that a horizon starts only once the
// previous one meets its exit signals. No dates are shown for that reason.
const HORIZONS = [
  { id: 'H1', place: 'Tanzania & East Africa', status: 'Current focus', copy: 'Become a trusted ISO 15189 quality platform and partner at home, with labs that stay and a pricing model validated on evidence.', exit: 'Exit signal: retained laboratories, validated pricing, and a national partnership.' },
  { id: 'H2', place: 'Other Sub-Saharan Africa', status: 'Direction', copy: 'Repeat the model in a second country, working through a professional body there.', exit: 'Exit signal: laboratories and a partnership in a second country.' },
  { id: 'H3', place: 'United States', status: 'Direction', copy: 'An ISO 15189-focused offering built on case studies from the first two horizons.', exit: 'Starts only after the earlier horizons have proven the model.' },
  { id: 'H4', place: 'UK, Canada & beyond', status: 'Direction', copy: 'English-speaking markets that share the standard.', exit: 'Starts only after the earlier horizons have proven the model.' },
];

export function HorizonMap() {
  const [active, setActive] = useState(0);
  const h = HORIZONS[active];
  return (
    <div data-testid="horizon-map">
      <div role="tablist" aria-label="Growth horizons" className="flex flex-wrap items-center gap-2">
        {HORIZONS.map((item, i) => (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls="horizon-panel"
            onClick={() => setActive(i)}
            className="qt-focus font-mono-ui rounded-full border px-4 py-2 text-[11px] transition-colors"
            style={{
              background: i === active ? 'var(--qt-dark-navy)' : '#FFFFFF',
              color: i === active ? '#FFFFFF' : 'var(--qt-body-grey)',
              borderColor: i === active ? 'var(--qt-dark-navy)' : 'var(--qt-border-grey)',
            }}
          >
            {item.id} · {item.place}
          </button>
        ))}
      </div>
      <div id="horizon-panel" role="tabpanel" className="qt-card mt-5 p-6" aria-live="polite">
        <p className="qt-technical-label">{h.status}</p>
        <h3 className="font-brand mt-2 text-lg font-bold" style={{ color: 'var(--qt-near-black)' }}>{h.place}</h3>
        <p className="mt-2 max-w-[560px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>{h.copy}</p>
        <p className="mt-3 text-xs leading-5" style={{ color: 'var(--qt-deep-teal)' }}>{h.exit}</p>
      </div>
      <p className="mt-3 font-mono-ui text-[10px]" style={{ color: 'var(--qt-body-grey)' }}>Direction, not commitments. Each horizon starts only when the one before it has earned it.</p>
    </div>
  );
}
