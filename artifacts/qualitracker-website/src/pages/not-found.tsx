import { Link, useLocation } from 'wouter';
import { PageShell } from '@/components/site/page-shell';
import { Button } from '@/components/site/button';
import { useI18n } from '@/lib/i18n';
import { useDocumentMeta } from '@/lib/use-document-meta';

type Text = { en: string; sw: string };
const SUGGESTIONS: Array<{ label: Text; href: string; hint: Text }> = [
  { label: { en: 'Product', sw: 'Bidhaa' }, href: '/product', hint: { en: 'The modules and where each one stands', sw: 'Moduli na hatua ambayo kila moja imefikia' } },
  { label: { en: 'Solutions', sw: 'Suluhisho' }, href: '/solutions', hint: { en: 'How a laboratory takes part in the beta', sw: 'Jinsi maabara inavyoshiriki kwenye beta' } },
  { label: { en: 'Docs', sw: 'Nyaraka' }, href: '/docs', hint: { en: 'Guides and workflow states', sw: 'Miongozo na hatua za mtiririko wa kazi' } },
  { label: { en: 'Talk to the team', sw: 'Ongea na timu' }, href: '/talk-to-team', hint: { en: 'Ask us directly', sw: 'Tuulize moja kwa moja' } },
];

/** A lab-record "not found" rather than a bare error: it names what was searched and offers the nearest real pages. */
export default function NotFound() {
  const [location] = useLocation();
  const { tr } = useI18n();
  useDocumentMeta(
    tr('Page not found | QualiTracker', 'Ukurasa haujapatikana | QualiTracker'),
    tr('The requested QualiTracker page could not be found.', 'Ukurasa wa QualiTracker ulioombwa haukupatikana.'),
    location,
    { robots: 'noindex, follow' },
  );
  return (
    <PageShell>
      <div className="mx-auto flex min-h-[60vh] max-w-[640px] flex-col justify-center px-5 py-16">
        <p className="qt-eyebrow">404</p>
        <h1 className="font-brand mt-2 text-3xl font-bold" style={{ color: 'var(--qt-near-black)' }}>{tr('Page not found.', 'Ukurasa haujapatikana.')}</h1>
        <div className="font-mono-ui qt-brackets relative mt-6 p-5 text-[12px] leading-6" style={{ color: 'var(--qt-near-black)', background: '#FFFFFF' }}>
          <span className="qt-bracket-b absolute inset-0" aria-hidden="true" />
          <p>$ find record <span style={{ color: 'var(--qt-deep-teal)' }}>{location}</span></p>
          <p style={{ color: 'var(--qt-body-grey)' }}>{tr('→ no matching record. It may have moved, or never existed.', '→ hakuna rekodi inayolingana. Huenda ilihamishwa, au haikuwepo kamwe.')}</p>
        </div>
        <p className="mt-6 text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
          {tr('Try one of these, or press', 'Jaribu mojawapo ya hizi, au bonyeza')} <kbd className="font-mono-ui rounded border px-1.5 text-[11px]" style={{ borderColor: 'var(--qt-border-grey)' }}>⌘K</kbd> {tr('to jump to any page.', 'kwenda ukurasa wowote.')}
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {SUGGESTIONS.map((s) => (
            <li key={s.href}>
              <Link href={s.href} className="qt-dashed qt-focus block rounded-md px-4 py-3">
                <span className="text-sm font-semibold" style={{ color: 'var(--qt-near-black)' }}>{tr(s.label.en, s.label.sw)}</span>
                <span className="mt-0.5 block text-xs" style={{ color: 'var(--qt-body-grey)' }}>{tr(s.hint.en, s.hint.sw)}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8"><Button href="/" variant="secondary" arrow="arrow">{tr('Back to home', 'Rudi mwanzo')}</Button></div>
      </div>
    </PageShell>
  );
}
