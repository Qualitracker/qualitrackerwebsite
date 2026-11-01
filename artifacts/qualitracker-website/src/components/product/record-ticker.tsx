// An endless strip of illustrative record events, in the spirit of a live feed.
// Decorative only, and labelled as illustrative so it is never read as real data.
const EVENTS = [
  ['NC-014', 'temperature excursion', 'pending review'],
  ['SOP-017', 'freezer monitoring', 'approved v3'],
  ['CAPA-009', 'reagent labelling', 'closed'],
  ['REC-231', 'daily QC check', 'recorded'],
  ['SOP-022', 'sample rejection', 'under review'],
  ['NC-015', 'missing entry', 'registered'],
  ['AUD-003', 'internal audit', 'scheduled'],
  ['REC-232', 'centrifuge calibration', 'recorded'],
];

export function RecordTicker() {
  const row = [...EVENTS, ...EVENTS];
  return (
    <div className="overflow-hidden" aria-hidden="true" data-testid="record-ticker">
      <div className="flex w-max gap-3" style={{ animation: 'qt-marquee 40s linear infinite' }}>
        {row.map(([id, what, state], i) => (
          <div key={`${id}-${i}`} className="font-mono-ui shrink-0 rounded-md border border-dashed px-3 py-2 text-[11px]" style={{ borderColor: 'rgba(255,255,255,.28)', color: 'var(--qt-mint-light)' }}>
            <span style={{ color: 'var(--qt-quality-gold)' }}>{id}</span> {what} <span style={{ opacity: 0.6 }}>· {state}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
