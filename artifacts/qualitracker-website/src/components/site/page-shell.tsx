import type { ReactNode } from 'react';
import { SiteNav } from '@/components/site/site-nav';
import { SiteFooter } from '@/components/site/site-footer';
import { useI18n } from '@/lib/i18n';

export function PageShell({ children }: { children: ReactNode }) {
  const { tr } = useI18n();
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
