import { useLayoutEffect, type ReactNode } from 'react';
import { useLocationProperty } from 'wouter/use-browser-location';
import { SiteNav } from '@/components/site/site-nav';
import { SiteFooter } from '@/components/site/site-footer';
import { useI18n } from '@/lib/i18n';

const pageAddress = () => window.location.pathname + window.location.hash;

export function PageShell({ children }: { children: ReactNode }) {
  const { tr } = useI18n();
  const address = useLocationProperty(pageAddress, () => '');

  useLayoutEffect(() => {
    // The lazy page has rendered by this point, so fragment targets exist.
    const hash = window.location.hash.slice(1);
    let target = hash;
    try {
      target = decodeURIComponent(hash);
    } catch {
      // Keep the raw fragment if someone supplies malformed URL encoding.
    }
    const section = target ? document.getElementById(target) : null;
    if (section) {
      section.scrollIntoView({ behavior: 'instant', block: 'start' });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [address]);

  return (
    <div className="qt-site flex min-h-dvh flex-col">
      <a className="qt-skip-link" href="#main-content">
        {tr('Skip to main content', 'Ruka hadi maudhui makuu')}
      </a>
      <SiteNav />
      <main id="main-content" className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
