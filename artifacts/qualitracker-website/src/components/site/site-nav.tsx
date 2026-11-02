import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, Search, X } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { Button } from '@/components/site/button';
import { CommandPalette } from '@/components/site/command-palette';
import { useI18n, type DictKey } from '@/lib/i18n';

const NAV_LINKS: Array<{ id: string; key: DictKey; href: string }> = [
  { id: 'product', key: 'nav.product', href: '/product' },
  { id: 'solutions', key: 'nav.solutions', href: '/solutions' },
  { id: 'docs', key: 'nav.docs', href: '/docs' },
  { id: 'company', key: 'nav.company', href: '/company' },
];

/** Sticky white nav bar: dual-tone lockup, teal active underline, teal CTA — matches the real brand kit's SiteNav. */
export function SiteNav() {
  const [location] = useLocation();
  const { lang, setLang, t } = useI18n();
  const toggleLang = () => setLang(lang === 'en' ? 'sw' : 'en');
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40" style={{ background: '#FFFFFF', borderBottom: '1px solid var(--qt-border-grey)' }}>
      <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-8 px-5 lg:px-8">
        <Link href="/" aria-label="QualiTracker home" data-testid="link-brand-home">
          <Logo height={28} />
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((item) => {
            const active = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="qt-dashed rounded px-3 py-1 text-[13px] font-medium"
                style={{ color: active ? 'var(--qt-deep-teal)' : 'var(--qt-near-black)', borderColor: active ? 'var(--qt-deep-teal)' : 'transparent' }}
                data-testid={`link-nav-${item.id}`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="qt-focus flex h-8 items-center gap-2 rounded-md border px-2.5 text-[12px]"
            style={{ borderColor: 'var(--qt-border-grey)', color: 'var(--qt-body-grey)' }}
            data-testid="button-command-palette"
          >
            <Search size={13} aria-hidden="true" />
            <span>Jump to</span>
            <kbd className="font-mono-ui text-[10px]">⌘K</kbd>
          </button>
          <button
            type="button"
            onClick={toggleLang}
            lang={lang === 'en' ? 'sw' : 'en'}
            className="qt-focus qt-dashed h-8 rounded-md px-2.5 text-[12px] font-medium"
            style={{ color: 'var(--qt-near-black)' }}
            data-testid="button-lang-toggle"
          >
            {t('lang.switch')}
          </button>
          <Button href="/talk-to-team" variant="ghost" size="sm">{t('nav.talk')}</Button>
          <Button href="/waitlist" size="sm" data-testid="link-nav-waitlist">{t('nav.beta')}</Button>
        </div>
        <button
          type="button"
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-md md:hidden"
          style={{ color: 'var(--qt-near-black)' }}
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          data-testid="button-mobile-menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {menuOpen && (
        <nav className="border-t px-5 py-3 md:hidden" style={{ borderColor: 'var(--qt-border-grey)' }} aria-label="Mobile navigation">
          {NAV_LINKS.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="block py-2.5 text-sm font-medium" style={{ color: 'var(--qt-near-black)' }}>
              {t(item.key)}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t pt-3" style={{ borderColor: 'var(--qt-border-grey)' }}>
            <button type="button" onClick={toggleLang} lang={lang === 'en' ? 'sw' : 'en'} className="qt-focus qt-dashed rounded-md py-2 text-sm font-medium" >
              {t('lang.switch')}
            </button>
            <Button href="/talk-to-team" variant="secondary" onClick={() => setMenuOpen(false)} fullWidth>{t('nav.talk')}</Button>
            <Button href="/waitlist" onClick={() => setMenuOpen(false)} fullWidth>{t('nav.beta')}</Button>
          </div>
        </nav>
      )}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </header>
  );
}
