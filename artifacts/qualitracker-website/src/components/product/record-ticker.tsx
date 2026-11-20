import { L, type Text, useI18n } from '@/lib/i18n';

// An endless strip of illustrative record events, in the spirit of a live feed.
// Decorative only, and labelled as illustrative so it is never read as real data.
const EVENTS: Array<[string, Text, Text]> = [
  ['NC-014', L('temperature excursion', 'joto nje ya kiwango'), L('pending review', 'inasubiri mapitio')],
  ['SOP-017', L('freezer monitoring', 'ufuatiliaji wa friza'), L('approved v3', 'toleo la 3 limeidhinishwa')],
  ['CAPA-009', L('reagent labelling', 'uwekaji lebo wa vitendanishi'), L('closed', 'imefungwa')],
  ['REC-231', L('daily QC check', 'ukaguzi wa QC wa kila siku'), L('recorded', 'imerekodiwa')],
  ['SOP-022', L('sample rejection', 'kukataliwa kwa sampuli'), L('under review', 'inapitiwa')],
  ['NC-015', L('missing entry', 'ingizo lililokosekana'), L('registered', 'imesajiliwa')],
  ['AUD-003', L('internal audit', 'ukaguzi wa ndani'), L('scheduled', 'imepangwa')],
  ['REC-232', L('centrifuge calibration', 'urekebishaji wa centrifuge'), L('recorded', 'imerekodiwa')],
];

export function RecordTicker() {
  const { tx } = useI18n();
  const row = [...EVENTS, ...EVENTS];
  return (
    <div className="overflow-hidden" aria-hidden="true" data-testid="record-ticker">
      <div className="flex w-max gap-3" style={{ animation: 'qt-marquee 40s linear infinite' }}>
        {row.map(([id, what, state], i) => (
          <div key={`${id}-${i}`} className="font-mono-ui shrink-0 rounded-md border border-dashed px-3 py-2 text-[11px]" style={{ borderColor: 'rgba(255,255,255,.28)', color: 'var(--qt-mint-light)' }}>
            <span style={{ color: 'var(--qt-quality-gold)' }}>{id}</span> {tx(what)} <span style={{ color: 'var(--qt-light-teal)' }}>· {tx(state)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
