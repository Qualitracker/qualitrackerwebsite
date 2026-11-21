import { useState } from 'react';
import { TriangleAlert } from 'lucide-react';
import { QtSymbol } from '@/assets/qt-symbol';
import { L, useI18n } from '@/lib/i18n';

const CATEGORIES = [
  { label: L('Document control', 'Udhibiti wa nyaraka'), value: 96, detail: L('SOPs and policies current, versioned, and owned.', 'SOP na sera ni za sasa, zina matoleo, na zina wamiliki.') },
  { label: L('Quality records', 'Rekodi za ubora'), value: 88, detail: L('Temperature logs, QC runs, and proficiency testing captured at the bench.', 'Kumbukumbu za joto, ukaguzi wa QC, na upimaji wa ustadi hunaswa kwenye eneo la kazi.') },
  { label: L('Internal audit', 'Ukaguzi wa ndani'), value: 71, detail: L('Findings logged and tracked through to closure.', 'Matatizo yaliyobainika hurekodiwa na kufuatiliwa hadi kufungwa.') },
  { label: L('CAPA', 'CAPA'), value: 64, detail: L('Corrective actions assigned, dated, and not left open.', 'Hatua za kurekebisha hukabidhiwa, hupewa tarehe, na haziachwi wazi.') },
  { label: L('Proficiency testing', 'Upimaji wa ustadi'), value: 90, detail: L('Results recorded and reviewed on schedule.', 'Matokeo hurekodiwa na kupitiwa kwa ratiba.') },
] as const;

/**
 * Illustrative — a sample lab's readiness, not real customer data. Rebuilt
 * from the accreditation-readiness sketch already in the real brand kit
 * (ui_kits/website/Marketing.jsx), made genuinely interactive: hover a
 * category to see what it tracks. This is the site's one signature product
 * visualization for v1 — real product concept, not a decorative diagram.
 */
export function AccreditationReadinessWidget() {
  const { tr, tx } = useI18n();
  const [active, setActive] = useState(0);

  return (
    <div className="qt-card qt-shadow-overlay p-5" style={{ background: 'var(--qt-clinical-white)' }}>
      <div className="mb-4 flex items-center gap-2">
        <QtSymbol color="var(--qt-deep-teal)" size={18} />
        <span className="text-sm font-semibold" style={{ color: 'var(--qt-near-black)' }}>{tr('Accreditation readiness', 'Utayari wa ithibati')}</span>
        <span
          className="font-mono-ui ml-auto rounded-md px-2 py-1 text-[9px] uppercase tracking-[.08em]"
          style={{ background: 'var(--qt-lab-grey)', color: 'var(--qt-body-grey)' }}
        >
          {tr('Illustrative sample', 'Mfano wa kuonyesha')}
        </span>
      </div>

      {CATEGORIES.map((cat, i) => (
        <button
          key={cat.label.en}
          type="button"
          onMouseEnter={() => setActive(i)}
          onFocus={() => setActive(i)}
          onClick={() => setActive(i)}
          aria-pressed={active === i}
          className="qt-button qt-focus mb-2 flex w-full items-center gap-3 rounded-md px-1 py-1 text-left last:mb-0"
          data-testid={`button-readiness-${i}`}
        >
          <span className="w-[120px] shrink-0 text-[11px]" style={{ color: active === i ? 'var(--qt-near-black)' : 'var(--qt-body-grey)', fontWeight: active === i ? 600 : 400 }}>
            {tx(cat.label)}
          </span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--qt-border-grey)' }}>
            <span
              className="block h-full rounded-full"
              style={{ width: `${cat.value}%`, background: cat.value < 70 ? 'var(--qt-quality-gold)' : 'var(--qt-deep-teal)' }}
            />
          </span>
          <span className="flex w-12 shrink-0 items-center justify-end gap-1">
            {cat.value < 70 && <TriangleAlert size={11} aria-label={tr('Needs attention', 'Inahitaji umakini')} style={{ color: 'var(--qt-gold-text)' }} />}
            <span className="font-mono-ui text-[10px]" style={{ color: 'var(--qt-body-grey)' }}>{cat.value}%</span>
          </span>
        </button>
      ))}

      <p className="qt-reveal mt-4 border-t pt-3 text-xs leading-5" style={{ borderColor: 'var(--qt-border-grey)', color: 'var(--qt-body-grey)' }}>
        {tx(CATEGORIES[active].detail)}
      </p>
    </div>
  );
}
