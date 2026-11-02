import { useI18n, L, type Text } from '@/lib/i18n';

/**
 * The product-status vocabulary the site uses everywhere a capability isn't
 * simply live today: "Private Beta" / "In Development" / "Coming Soon" /
 * "Preview" / "Planned". Never omit this on anything not fully shipped —
 * it's the mechanism that keeps an honest, still-building product from
 * reading as either unfinished or overclaiming.
 */
export type ProductStatus = 'live' | 'private-beta' | 'early-access' | 'preview' | 'in-development' | 'coming-soon' | 'planned';

const LABEL: Record<ProductStatus, Text> = {
  live: L('Live', 'Inapatikana'),
  'private-beta': L('Private beta', 'Beta ya faragha'),
  'early-access': L('Early access', 'Ufikiaji wa mapema'),
  preview: L('Preview', 'Onyesho la awali'),
  'in-development': L('In development', 'Inaandaliwa'),
  'coming-soon': L('Coming soon', 'Inakuja hivi karibuni'),
  planned: L('Planned', 'Imepangwa'),
};

export function StatusBadge({ status }: { status: ProductStatus }) {
  const { tx } = useI18n();
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
      {tx(LABEL[status])}
    </span>
  );
}
