import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { Search } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

type Text = { en: string; sw: string };
interface Command {
  label: Text;
  hint: Text;
  href: string;
}

const COMMANDS: Command[] = [
  { label: { en: 'Product', sw: 'Bidhaa' }, hint: { en: 'The eQMS and QualiBOT', sw: 'eQMS na QualiBOT' }, href: '/product' },
  { label: { en: 'Solutions', sw: 'Suluhisho' }, hint: { en: 'Who QualiTracker eQMS is for', sw: 'QualiTracker eQMS ni ya nani' }, href: '/solutions' },
  { label: { en: 'Docs', sw: 'Nyaraka' }, hint: { en: 'Guides and how it works', sw: 'Miongozo na jinsi inavyofanya kazi' }, href: '/docs' },
  { label: { en: 'Security', sw: 'Usalama' }, hint: { en: 'Architecture and what is not claimed', sw: 'Muundo na tusichodai' }, href: '/security' },
  { label: { en: 'Company', sw: 'Kampuni' }, hint: { en: 'Story, values, and roadmap', sw: 'Hadithi, maadili, na ramani ya safari' }, href: '/company' },
  { label: { en: 'Register beta interest', sw: 'Onyesha nia ya beta' }, hint: { en: 'Tell us which workflow you would test', sw: 'Tuambie mtiririko wa kazi ungependa kujaribu' }, href: '/waitlist' },
  { label: { en: 'Talk to the team', sw: 'Ongea na timu' }, hint: { en: 'Partnerships, research, evaluation', sw: 'Ushirikiano, utafiti, tathmini' }, href: '/talk-to-team' },
];

function localizeCommand(command: Command, lang: keyof Text) {
  return { label: command.label[lang], hint: command.hint[lang] };
}

/** ⌘K / Ctrl+K site navigation. Opens from the nav button or the keyboard. */
export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [, navigate] = useLocation();
  const { lang, tr } = useI18n();
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? COMMANDS.filter((command) => {
      const text = localizeCommand(command, lang);
      return `${text.label} ${text.hint}`.toLowerCase().includes(q);
    }) : COMMANDS;
  }, [query, lang]);

  useEffect(() => {
    if (!open) return undefined;
    const frame = window.requestAnimationFrame(() => {
      setQuery('');
      setIndex(0);
      inputRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  if (!open) return null;

  const go = (c: Command | undefined) => {
    if (!c) return;
    onClose();
    navigate(c.href);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[14vh]"
      style={{ background: 'rgba(10,25,32,.55)' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      data-testid="command-palette"
    >
      <div role="dialog" aria-modal="true" aria-label={tr('Site navigation', 'Urambazaji wa tovuti')} className="w-full max-w-[520px] overflow-hidden rounded-xl border shadow-2xl" style={{ background: '#FFFFFF', borderColor: 'var(--qt-border-grey)' }}>
        <div className="flex items-center gap-3 border-b px-4" style={{ borderColor: 'var(--qt-border-grey)' }}>
          <Search size={16} aria-hidden="true" style={{ color: 'var(--qt-body-grey)' }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setIndex(0); }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((i) => Math.min(i + 1, results.length - 1)); }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((i) => Math.max(i - 1, 0)); }
              else if (e.key === 'Enter') { e.preventDefault(); go(results[index]); }
              else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
            }}
            placeholder={tr('Go to a page…', 'Nenda kwenye ukurasa…')}
            aria-label={tr('Search pages', 'Tafuta kurasa')}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-results"
            aria-activedescendant={results[index] ? `cmd-${index}` : undefined}
            className="h-12 flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--qt-near-black)' }}
          />
          <kbd className="font-mono-ui rounded border px-1.5 py-0.5 text-[10px]" style={{ borderColor: 'var(--qt-border-grey)', color: 'var(--qt-body-grey)' }}>esc</kbd>
        </div>
        <ul id="command-results" role="listbox" className="max-h-[320px] overflow-auto p-2">
          {results.length === 0 && <li className="px-3 py-6 text-center text-xs" style={{ color: 'var(--qt-body-grey)' }}>{tr('No matching page.', 'Hakuna ukurasa unaolingana.')}</li>}
          {results.map((c, i) => (
            <li
              key={c.href}
              id={`cmd-${i}`}
              role="option"
              aria-selected={i === index}
              onMouseEnter={() => setIndex(i)}
              onClick={() => go(c)}
              className="flex cursor-pointer items-baseline justify-between gap-4 rounded-md px-3 py-2.5"
              style={{ background: i === index ? 'var(--qt-teal-tint)' : 'transparent' }}
            >
              <span className="text-[13px] font-semibold" style={{ color: 'var(--qt-near-black)' }}>{localizeCommand(c, lang).label}</span>
              <span className="truncate text-[11px]" style={{ color: 'var(--qt-body-grey)' }}>{localizeCommand(c, lang).hint}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
