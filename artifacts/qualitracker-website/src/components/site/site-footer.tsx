import { Link } from 'wouter';
import { Logo } from '@/components/brand/logo';
import { useI18n } from '@/lib/i18n';

type Text = { en: string; sw: string };
const COLUMNS: Array<[Text, Array<{ label: Text; href: string }>]> = [
  [{ en: 'Product', sw: 'Bidhaa' }, [
    { label: { en: 'Platform', sw: 'Jukwaa' }, href: '/product' },
    { label: { en: 'AI & RAG', sw: 'AI na RAG' }, href: '/product#ai-rag' },
    { label: { en: 'Docs', sw: 'Nyaraka' }, href: '/docs' },
  ]],
  [{ en: 'Company', sw: 'Kampuni' }, [
    { label: { en: 'About', sw: 'Kuhusu sisi' }, href: '/company' },
    { label: { en: 'Team', sw: 'Timu' }, href: '/company#team' },
    { label: { en: 'Vision', sw: 'Dira' }, href: '/company#vision' },
  ]],
  [{ en: 'Connect', sw: 'Wasiliana' }, [
    { label: { en: 'Register beta interest', sw: 'Onyesha nia ya beta' }, href: '/waitlist' },
    { label: { en: 'Talk to the team', sw: 'Ongea na timu' }, href: '/talk-to-team' },
    { label: { en: 'Security', sw: 'Usalama' }, href: '/security' },
  ]],
];

/** Dark Navy footer, reversed lockup, gold column headings — matches the real brand kit. */
export function SiteFooter() {
  const { tr } = useI18n();
  return (
    <footer style={{ background: 'var(--qt-dark-navy)', color: '#FFFFFF' }}>
      <div className="mx-auto max-w-[1280px] px-5 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-3">
            <Logo tone="reversed" height={26} />
            <p className="max-w-[260px] text-[13px] leading-6" style={{ color: 'var(--qt-mint-light)' }}>
              {tr('Digital quality-management infrastructure for laboratories, built in East Africa.', 'Miundombinu ya kidijitali ya usimamizi wa ubora kwa maabara, iliyojengwa Afrika Mashariki.')}
            </p>
          </div>
          {COLUMNS.map(([heading, items]) => (
            <div key={heading.en} className="flex flex-col gap-3">
              <span className="qt-eyebrow qt-eyebrow-light">{tr(heading.en, heading.sw)}</span>
              {items.map((item) => (
                <Link key={item.label.en} href={item.href} className="text-[13px]" style={{ color: '#FFFFFF' }} data-testid={`link-footer-${item.label.en.toLowerCase().replace(/\s+/g, '-')}`}>
                  {tr(item.label.en, item.label.sw)}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t pt-6 text-[11px] sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: 'rgba(255,255,255,.12)', color: 'var(--qt-light-teal)' }}>
          <span>© {new Date().getFullYear()} Qualitracker Limited · Dar es Salaam, Tanzania · <Link href="/privacy" className="underline" data-testid="link-footer-privacy">{tr('Privacy notice', 'Taarifa ya faragha')}</Link></span>
          <span className="font-mono-ui inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: 'var(--qt-quality-gold)' }} aria-hidden="true" />
            {tr('Private beta · pre-revenue · East Africa first', 'Beta ya faragha · bado hatujaanza kuuza · Afrika Mashariki kwanza')}
          </span>
        </div>
      </div>
    </footer>
  );
}
