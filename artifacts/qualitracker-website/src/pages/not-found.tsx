import { Link, useLocation } from 'wouter';
import { PageShell } from '@/components/site/page-shell';
import { Button } from '@/components/site/button';

const SUGGESTIONS = [
  { label: 'Product', href: '/product', hint: 'The modules and where each one stands' },
  { label: 'Solutions', href: '/solutions', hint: 'How a laboratory takes part in the beta' },
  { label: 'Docs', href: '/docs', hint: 'Guides and workflow states' },
  { label: 'Talk to the team', href: '/talk-to-team', hint: 'Ask us directly' },
];

/** A lab-record "not found" rather than a bare error: it names what was searched and offers the nearest real pages. */
export default function NotFound() {
  const [location] = useLocation();
  return (
    <PageShell>
      <div className="mx-auto flex min-h-[60vh] max-w-[640px] flex-col justify-center px-5 py-16">
        <p className="qt-eyebrow">404</p>
        <h1 className="font-brand mt-2 text-3xl font-bold" style={{ color: 'var(--qt-near-black)' }}>Page not found.</h1>
        <div className="font-mono-ui qt-brackets relative mt-6 p-5 text-[12px] leading-6" style={{ color: 'var(--qt-near-black)', background: '#FFFFFF' }}>
          <span className="qt-bracket-b absolute inset-0" aria-hidden="true" />
          <p>$ find record <span style={{ color: 'var(--qt-deep-teal)' }}>{location}</span></p>
          <p style={{ color: 'var(--qt-body-grey)' }}>→ no matching record. It may have moved, or never existed.</p>
        </div>
        <p className="mt-6 text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
          Try one of these, or press <kbd className="font-mono-ui rounded border px-1.5 text-[11px]" style={{ borderColor: 'var(--qt-border-grey)' }}>⌘K</kbd> to jump to any page.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {SUGGESTIONS.map((s) => (
            <li key={s.href}>
              <Link href={s.href} className="qt-dashed qt-focus block rounded-md px-4 py-3">
                <span className="text-sm font-semibold" style={{ color: 'var(--qt-near-black)' }}>{s.label}</span>
                <span className="mt-0.5 block text-xs" style={{ color: 'var(--qt-body-grey)' }}>{s.hint}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8"><Button href="/" variant="secondary" arrow="arrow">Back to home</Button></div>
      </div>
    </PageShell>
  );
}
