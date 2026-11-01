/**
 * The product-status vocabulary the site uses everywhere a capability isn't
 * simply live today: "Private Beta" / "In Development" / "Coming Soon" /
 * "Preview" / "Planned". Never omit this on anything not fully shipped —
 * it's the mechanism that keeps an honest, still-building product from
 * reading as either unfinished or overclaiming.
 */
export type ProductStatus = 'live' | 'private-beta' | 'early-access' | 'preview' | 'in-development' | 'coming-soon' | 'planned';

const LABEL: Record<ProductStatus, string> = {
  live: 'Live',
  'private-beta': 'Private beta',
  'early-access': 'Early access',
  preview: 'Preview',
  'in-development': 'In development',
  'coming-soon': 'Coming soon',
  planned: 'Planned',
};

export function StatusBadge({ status }: { status: ProductStatus }) {
  const isLive = status === 'live';
  return (
    <span
      className="font-mono-ui inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.08em]"
      style={{
        background: isLive ? 'var(--qt-teal-tint)' : 'var(--qt-lab-grey)',
        color: isLive ? 'var(--qt-deep-teal)' : 'var(--qt-body-grey)',
      }}
      data-testid={`status-badge-${status}`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: isLive ? 'var(--qt-success)' : 'var(--qt-body-grey)' }}
      />
      {LABEL[status]}
    </span>
  );
}
