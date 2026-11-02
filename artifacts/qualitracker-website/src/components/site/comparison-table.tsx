import { L, type Text, useI18n } from '@/lib/i18n';

interface ComparisonRow {
  label: Text;
  qualitracker: Text;
  statusQuo: Text;
  genericQms: Text;
}

/**
 * Modeled on Graphify's own "Graph vs Vector DB vs Grep" table — three
 * generic approaches, not named competing products, so nothing here is a
 * claim about a specific competitor we have no evidence for. Every
 * QualiTracker cell restates a fact already established elsewhere on this
 * site (the reality section, the security page, the standards row); every
 * "generic QMS" cell is deliberately hedged ("varies by vendor") rather
 * than asserting something about products we haven't verified.
 */
const ROWS: ComparisonRow[] = [
  {
    label: L('Traceability', 'Ufuatiliaji'),
    qualitracker: L('Every record traced, standard to verification', 'Kila rekodi hufuatiliwa, kutoka kiwango hadi uthibitishaji'),
    statusQuo: L('No structured trace, tribal knowledge', 'Hakuna ufuatiliaji uliopangwa, maarifa hubaki kwa watu'),
    genericQms: L('Varies by vendor', 'Hutofautiana kwa mtoa huduma'),
  },
  {
    label: L('AI answers', 'Majibu ya AI'),
    qualitracker: L('Cites its source, or says "not found"', 'Hutaja chanzo, au husema "haijapatikana"'),
    statusQuo: L('No AI assistant', 'Hakuna msaidizi wa AI'),
    genericQms: L('Varies by vendor', 'Hutofautiana kwa mtoa huduma'),
  },
  {
    label: L('Built for these standards', 'Imejengwa kwa viwango hivi'),
    qualitracker: L('ISO 15189 · SLIPTA · WHO LQMS', 'ISO 15189 · SLIPTA · WHO LQMS'),
    statusQuo: L("Standards knowledge lives in people's heads", 'Maarifa ya viwango hubaki akilini mwa watu'),
    genericQms: L('Often built for a different regulatory context', 'Mara nyingi hujengwa kwa mazingira tofauti ya udhibiti'),
  },
  {
    label: L('Data handling', 'Utunzaji wa data'),
    qualitracker: L('Per-tenant isolation, self-hosted inference', 'Kutenganisha kila mteja, uchakataji unaosimamiwa wenyewe'),
    statusQuo: L("Whatever the drive's own access controls allow", 'Kulingana na udhibiti wa ufikiaji wa hifadhi yenyewe'),
    genericQms: L('Varies by vendor', 'Hutofautiana kwa mtoa huduma'),
  },
  {
    label: L('Status', 'Hali'),
    qualitracker: L('Private beta, pre-revenue', 'Beta ya faragha, kabla ya mapato'),
    statusQuo: L('Already what most labs use', 'Hivi ndivyo maabara nyingi tayari hutumia'),
    genericQms: L('Established, but often not region-specific', 'Imeimarika, lakini mara nyingi haijalengwa kwa eneo hili'),
  },
];

export function ComparisonTable() {
  const { tr, tx } = useI18n();
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr>
            <th className="w-[26%] border-b py-3 pr-4" style={{ borderColor: 'var(--qt-border-grey)' }} />
            <th
              className="border-b px-4 py-3"
              style={{ borderColor: 'var(--qt-deep-teal)', borderBottomWidth: 2, background: 'var(--qt-teal-tint)' }}
            >
              <span className="qt-technical-eyebrow">QualiTracker eQMS</span>
            </th>
            <th className="border-b px-4 py-3" style={{ borderColor: 'var(--qt-border-grey)' }}>
              <span className="qt-technical-label">{tr('Shared drive / paper', 'Hifadhi ya pamoja / karatasi')}</span>
            </th>
            <th className="border-b px-4 py-3" style={{ borderColor: 'var(--qt-border-grey)' }}>
              <span className="qt-technical-label">{tr('Generic QMS software', 'Programu ya kawaida ya QMS')}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label.en} data-testid={`comparison-row-${row.label.en.toLowerCase().replace(/[^a-z]+/g, '-')}`}>
              <th scope="row" className="border-b py-4 pr-4 text-left align-top text-xs font-semibold uppercase tracking-[.04em]" style={{ borderColor: 'var(--qt-border-grey)', color: 'var(--qt-body-grey)' }}>
                {tx(row.label)}
              </th>
              <td className="border-b px-4 py-4 align-top font-semibold" style={{ borderColor: 'var(--qt-border-grey)', background: 'var(--qt-teal-tint)', color: 'var(--qt-deep-teal)' }}>
                {tx(row.qualitracker)}
              </td>
              <td className="border-b px-4 py-4 align-top" style={{ borderColor: 'var(--qt-border-grey)', color: 'var(--qt-body-grey)' }}>
                {tx(row.statusQuo)}
              </td>
              <td className="border-b px-4 py-4 align-top" style={{ borderColor: 'var(--qt-border-grey)', color: 'var(--qt-body-grey)' }}>
                {tx(row.genericQms)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
