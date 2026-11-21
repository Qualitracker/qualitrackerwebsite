import { useState } from 'react';
import { L, useI18n } from '@/lib/i18n';

/**
 * A recreation of the shape of the product dashboard: stat cards plus a
 * lab-scoped context panel, restyled to the QualiTracker brand tokens. The
 * layout and fields mirror templates/dashboard.html in the real repository
 * (Laboratories / Departments / Roles / Users counts, current lab,
 * department, and role panel). All values are illustrative, and the role
 * switcher only shows how the same dashboard is scoped to who is signed in.
 */
const VIEWS = [
  {
    role: L('Lab director', 'Mkurugenzi wa maabara'),
    stats: [
      { label: L('Laboratories', 'Maabara'), value: '4', tint: 'var(--qt-teal-tint)', color: 'var(--qt-deep-teal)' },
      { label: L('Departments', 'Idara'), value: '11', tint: 'var(--qt-mint-light)', color: 'var(--qt-deep-teal)' },
      { label: L('Roles', 'Majukumu'), value: '6', tint: 'var(--qt-lab-grey)', color: 'var(--qt-body-grey)' },
      { label: L('Users in your lab', 'Watumiaji katika maabara yako'), value: '23', tint: '#F9F5EA', color: 'var(--qt-gold-text)' },
    ],
    scope: L('Every laboratory and department you oversee.', 'Kila maabara na idara unayosimamia.'),
  },
  {
    role: L('Quality manager', 'Meneja wa ubora'),
    stats: [
      { label: L('Open findings', 'Matatizo yaliyo wazi'), value: '5', tint: '#F9F5EA', color: 'var(--qt-gold-text)' },
      { label: L('Documents in review', 'Nyaraka zinazopitiwa'), value: '8', tint: 'var(--qt-teal-tint)', color: 'var(--qt-deep-teal)' },
      { label: L('Actions due this week', 'Hatua zinazotakiwa wiki hii'), value: '3', tint: 'var(--qt-mint-light)', color: 'var(--qt-deep-teal)' },
      { label: L('Audits planned', 'Ukaguzi uliopangwa'), value: '2', tint: 'var(--qt-lab-grey)', color: 'var(--qt-body-grey)' },
    ],
    scope: L('The quality records for your laboratory.', 'Rekodi za ubora za maabara yako.'),
  },
  {
    role: L('Technologist', 'Mtaalamu wa maabara'),
    stats: [
      { label: L('Records to complete today', 'Rekodi za kukamilisha leo'), value: '6', tint: '#F9F5EA', color: 'var(--qt-gold-text)' },
      { label: L('SOPs assigned to read', 'SOP ulizopewa kusoma'), value: '2', tint: 'var(--qt-teal-tint)', color: 'var(--qt-deep-teal)' },
      { label: L('Questions asked', 'Maswali yaliyoulizwa'), value: '4', tint: 'var(--qt-mint-light)', color: 'var(--qt-deep-teal)' },
      { label: L('Training due', 'Mafunzo yanayotakiwa'), value: '1', tint: 'var(--qt-lab-grey)', color: 'var(--qt-body-grey)' },
    ],
    scope: L('Only what your role needs for the work in front of you.', 'Ni yale tu ambayo jukumu lako linahitaji kwa kazi iliyo mbele yako.'),
  },
] as const;

export function QualityCommandCenter() {
  const { tr, tx } = useI18n();
  const [index, setIndex] = useState(0);
  const view = VIEWS[index];

  return (
    <div className="qt-card qt-shadow-overlay overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3.5" style={{ borderColor: 'var(--qt-border-grey)', background: 'var(--qt-clinical-white)' }}>
        <span className="text-sm font-semibold" style={{ color: 'var(--qt-near-black)' }}>{tr('Welcome back, dashboard', 'Karibu tena kwenye dashibodi')}</span>
        <span className="font-mono-ui rounded-md px-2 py-1 text-[9px] uppercase tracking-[.08em]" style={{ background: 'var(--qt-lab-grey)', color: 'var(--qt-body-grey)' }}>
          {tr('Illustrative sample', 'Mfano wa kuonyesha')}
        </span>
      </div>
      <div role="tablist" aria-label={tr('Sign in as', 'Ingia kama')} className="flex flex-wrap gap-2 px-5 pt-4">
        {VIEWS.map((v, i) => (
          <button
            key={v.role.en}
            role="tab"
            type="button"
            aria-selected={i === index}
            onClick={() => setIndex(i)}
            className="qt-focus rounded-full border px-3.5 py-1.5 text-[11px] font-semibold transition-colors"
            style={{
              background: i === index ? 'var(--qt-dark-navy)' : '#FFFFFF',
              color: i === index ? '#FFFFFF' : 'var(--qt-body-grey)',
              borderColor: i === index ? 'var(--qt-dark-navy)' : 'var(--qt-border-grey)',
              borderStyle: i === index ? 'solid' : 'dashed',
            }}
          >
            {tx(v.role)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4" aria-live="polite">
        {view.stats.map((s) => (
          <div key={s.label.en} className="rounded-xl p-4" style={{ background: s.tint }}>
            <div className="font-brand text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="mt-1 text-[11px]" style={{ color: 'var(--qt-body-grey)' }}>{tx(s.label)}</div>
          </div>
        ))}
      </div>
      <div className="border-t px-5 py-4" style={{ borderColor: 'var(--qt-border-grey)' }}>
        <p className="font-mono-ui text-[10px] uppercase tracking-[.08em]" style={{ color: 'var(--qt-body-grey)' }}>{tr('Your laboratory', 'Maabara yako')}</p>
        <div className="mt-3 flex flex-wrap gap-6">
          <div>
            <div className="text-[10px]" style={{ color: 'var(--qt-body-grey)' }}>{tr('LABORATORY', 'MAABARA')}</div>
            <div className="mt-0.5 text-sm font-bold" style={{ color: 'var(--qt-near-black)' }}>{tr('Central Reference Lab', 'Maabara Kuu ya Rufaa')}</div>
          </div>
          <div>
            <div className="text-[10px]" style={{ color: 'var(--qt-body-grey)' }}>{tr('LAB TYPE', 'AINA YA MAABARA')}</div>
            <span className="mt-0.5 inline-block rounded-full px-2.5 py-1 font-mono-ui text-[10px]" style={{ background: 'var(--qt-teal-tint)', color: 'var(--qt-deep-teal)' }}>{tr('Clinical', 'Kliniki')}</span>
          </div>
          <div>
            <div className="text-[10px]" style={{ color: 'var(--qt-body-grey)' }}>{tr('DEPARTMENT', 'IDARA')}</div>
            <div className="mt-0.5 text-sm font-semibold" style={{ color: 'var(--qt-near-black)' }}>{tr('Microbiology', 'Mikrobiolojia')}</div>
          </div>
        </div>
        <p className="mt-4 text-xs leading-5" style={{ color: 'var(--qt-body-grey)' }}>{tr('You see:', 'Unaona:')} {tx(view.scope)}</p>
      </div>
    </div>
  );
}
