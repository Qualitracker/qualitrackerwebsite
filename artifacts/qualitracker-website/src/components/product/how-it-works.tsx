import { useState } from 'react';
import { useI18n, type DictKey } from '@/lib/i18n';
import { DashedLattice, type LatticeShape } from '@/components/product/dashed-lattice';

const ITEMS: Array<{ n: 1 | 2 | 3; title: string; copy: string; shape: LatticeShape; log: string[] }> = [
  {
    n: 1,
    title: 'One map of the lab',
    shape: 'record',
    copy: 'Documents, records, and actions live in one place, versioned and findable, so nobody has to remember which binder holds the answer.',
    log: ['$ find "freezer temperature SOP"', '→ SOP-017 · v3 · Approved', '→ 2 linked records, 1 open action'],
  },
  {
    n: 2,
    title: 'A trail for every change',
    shape: 'trail',
    copy: 'Every edit, review, and sign-off is recorded with who did it and when, which is the evidence an accreditation audit asks to see.',
    log: ['$ trail SOP-017', '→ v2 → v3 · reviewed by quality manager', '→ approved · version locked'],
  },
  {
    n: 3,
    title: 'Findings that close',
    shape: 'loop',
    copy: 'A finding becomes an assigned action with two independent reviews, so problems are closed with a trail instead of quietly dropped.',
    log: ['$ open NC-014 --class minor', '→ review 1 complete · review 2 pending', '→ closure needs final sign-off'],
  },
];

/** Left: a list where one statement is highlighted. Right: a bracket-framed lattice and a mono log that follow it. */
export function HowItWorks() {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const item = ITEMS[active];

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16" data-testid="how-it-works">
      <div role="tablist" aria-label="How QualiTracker works" aria-orientation="vertical" className="divide-y" style={{ borderColor: 'var(--qt-border-grey)' }}>
        {ITEMS.map((it, i) => {
          const on = i === active;
          return (
            <div key={it.title} className="border-t py-5 first:border-t-0" style={{ borderColor: 'var(--qt-border-grey)' }}>
              <button
                role="tab"
                type="button"
                id={`hiw-tab-${i}`}
                aria-selected={on}
                aria-controls="hiw-panel"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className="qt-focus text-left"
              >
                <span className={`font-mono-ui text-[clamp(1.25rem,2.4vw,1.75rem)] font-bold leading-tight ${on ? 'qt-mark' : ''}`} style={{ color: on ? undefined : 'var(--qt-body-grey)', opacity: on ? 1 : 0.6 }}>
                  {t(`hiw.${it.n}.title` as DictKey)}
                </span>
              </button>
              {on && <p className="mt-3 max-w-[420px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>{t(`hiw.${it.n}.copy` as DictKey)}</p>}
            </div>
          );
        })}
      </div>

      <div id="hiw-panel" role="tabpanel" aria-labelledby={`hiw-tab-${active}`}>
        <div className="qt-brackets relative aspect-[300/260] max-h-[380px] w-full p-4">
          <DashedLattice shape={item.shape} />
          <span className="qt-bracket-b absolute inset-0" aria-hidden="true" />
        </div>
        <div className="font-mono-ui mt-4 rounded-md border border-dashed p-4 text-[11px] leading-5" style={{ borderColor: 'var(--qt-border-grey)', color: 'var(--qt-near-black)', background: '#FFFFFF' }} aria-live="polite">
          {item.log.map((line) => <p key={line}>{line}</p>)}
          <p className="mt-2" style={{ color: 'var(--qt-body-grey)' }}>Illustrative. Not a real laboratory's records.</p>
        </div>
      </div>
    </div>
  );
}
