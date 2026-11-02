interface ComparisonRow {
  label: string;
  qualitracker: string;
  statusQuo: string;
  genericQms: string;
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
    label: 'Traceability',
    qualitracker: 'Every record traced, standard to verification',
    statusQuo: 'No structured trace, tribal knowledge',
    genericQms: 'Varies by vendor',
  },
  {
    label: 'AI answers',
    qualitracker: 'Cites its source, or says "not found"',
    statusQuo: 'No AI assistant',
    genericQms: 'Varies by vendor',
  },
  {
    label: 'Built for these standards',
    qualitracker: 'ISO 15189 · SLIPTA · WHO LQMS',
    statusQuo: "Standards knowledge lives in people's heads",
    genericQms: 'Often built for a different regulatory context',
  },
  {
    label: 'Data handling',
    qualitracker: 'Per-tenant isolation, self-hosted inference',
    statusQuo: "Whatever the drive's own access controls allow",
    genericQms: 'Varies by vendor',
  },
  {
    label: 'Status',
    qualitracker: 'Private beta, pre-revenue',
    statusQuo: 'Already what most labs use',
    genericQms: 'Established, but often not region-specific',
  },
];

export function ComparisonTable() {
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
              <span className="qt-technical-label">Shared drive / paper</span>
            </th>
            <th className="border-b px-4 py-3" style={{ borderColor: 'var(--qt-border-grey)' }}>
              <span className="qt-technical-label">Generic QMS software</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label} data-testid={`comparison-row-${row.label.toLowerCase().replace(/[^a-z]+/g, '-')}`}>
              <th scope="row" className="border-b py-4 pr-4 text-left align-top text-xs font-semibold uppercase tracking-[.04em]" style={{ borderColor: 'var(--qt-border-grey)', color: 'var(--qt-body-grey)' }}>
                {row.label}
              </th>
              <td className="border-b px-4 py-4 align-top font-semibold" style={{ borderColor: 'var(--qt-border-grey)', background: 'var(--qt-teal-tint)', color: 'var(--qt-deep-teal)' }}>
                {row.qualitracker}
              </td>
              <td className="border-b px-4 py-4 align-top" style={{ borderColor: 'var(--qt-border-grey)', color: 'var(--qt-body-grey)' }}>
                {row.statusQuo}
              </td>
              <td className="border-b px-4 py-4 align-top" style={{ borderColor: 'var(--qt-border-grey)', color: 'var(--qt-body-grey)' }}>
                {row.genericQms}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
