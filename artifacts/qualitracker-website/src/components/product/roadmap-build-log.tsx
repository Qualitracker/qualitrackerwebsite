import { navigateTabs } from '@/lib/tab-keyboard';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { L, type Text, useI18n } from '@/lib/i18n';

type Horizon = 'now' | 'next' | 'later';

interface LogEntry {
  when: Text;
  title: Text;
  detail: Text;
  state: 'planned' | 'in-progress' | 'conditional';
}

// Sourced from the October 2026 strategy plan (v0.4), product implementation
// plan, and CTO plan. Anything that depends on an unsigned agreement or an
// internal safety gate is marked "conditional" rather than promised.
const HORIZONS: Array<{ id: Horizon; label: Text; caption: string; entries: LogEntry[] }> = [
  {
    id: 'now',
    label: L('Now', 'Sasa'),
    caption: 'Nov 2026',
    entries: [
      { when: L('Mid-Nov 2026', 'Katikati ya Nov 2026'), title: L('eQMS private beta starts', 'Beta ya faragha ya eQMS inaanza'), detail: L('A small cohort of laboratories tests document control and quality records in real workflows.', 'Kundi dogo la maabara linajaribu udhibiti wa nyaraka na rekodi za ubora katika kazi halisi.'), state: 'planned' },
      { when: L('Before beta', 'Kabla ya beta'), title: L('Superuser orientation and training', 'Utambulisho na mafunzo ya watumiaji wakuu'), detail: L('Each lab names superusers who are trained virtually first, then supported on site for three days.', 'Kila maabara inataja watumiaji wakuu wanaofunzwa mtandaoni kwanza, kisha kusaidiwa eneo la kazi kwa siku tatu.'), state: 'in-progress' },
      { when: L('Throughout', 'Wakati wote'), title: L('Feedback ranked every week', 'Maoni yanapangwa kila wiki'), detail: L('Every request is logged, ranked, and marked done, deferred, or declined, so users can see what happened to it.', 'Kila ombi linarekodiwa, linapangwa, na kuwekwa alama kuwa limekamilika, limeahirishwa, au limekataliwa ili watumiaji waone kilichotokea.'), state: 'in-progress' },
    ],
  },
  {
    id: 'next',
    label: L('Next', 'Ifuatayo'),
    caption: 'Q1 – Q2 2027',
    entries: [
      { when: L('After beta', 'Baada ya beta'), title: L('Exit review and go / no-go', 'Mapitio ya mwisho na uamuzi wa kuendelea au kusimama'), detail: L('Results are measured against the targets set before the beta, then a documented decision on wider pilots.', 'Matokeo yanapimwa dhidi ya malengo yaliyowekwa kabla ya beta, kisha uamuzi wa majaribio mapana unaandikwa.'), state: 'planned' },
      { when: L('From Mar 2027', 'Kuanzia Machi 2027'), title: L('Monthly Quality Excellence Challenge', 'Quality Excellence Challenge ya kila mwezi'), detail: L('A recurring knowledge challenge for laboratory professionals, as requested after the October event.', 'Changamoto ya maarifa inayorudiwa kwa wataalamu wa maabara, kama ilivyoombwa baada ya tukio la Oktoba.'), state: 'conditional' },
      { when: L('After safety review', 'Baada ya mapitio ya usalama'), title: L('QualiBOT for named users', 'QualiBOT kwa watumiaji waliotajwa'), detail: L('Released online only after the 100-case grounding test passes and the product and technology leads agree it is safe.', 'Inatolewa mtandaoni tu baada ya jaribio la kesi 100 kufaulu na viongozi wa bidhaa na teknolojia kukubaliana kuwa ni salama.'), state: 'conditional' },
    ],
  },
  {
    id: 'later',
    label: L('Later', 'Baadaye'),
    caption: 'By Sep 2027',
    entries: [
      { when: L('By Sep 2027', 'Kufikia Sep 2027'), title: L('Pilot results published', 'Matokeo ya majaribio yanachapishwa'), detail: L('What worked, what did not, and what laboratories actually did differently, measured rather than assumed.', 'Kilichofanya kazi, kisichofanya kazi, na maabara zilichobadilisha kwa kweli, vikipimwa badala ya kudhaniwa.'), state: 'planned' },
      { when: L('By Sep 2027', 'Kufikia Sep 2027'), title: L('First price list', 'Orodha ya kwanza ya bei'), detail: L('Pricing is set from pilot evidence. QualiTracker is pre-revenue and is not selling during the beta.', 'Bei zinawekwa kutokana na ushahidi wa majaribio. QualiTracker bado haina mapato na haiuzi wakati wa beta.'), state: 'planned' },
      { when: L('Beyond', 'Baada ya hapo'), title: L('Wider East Africa', 'Afrika Mashariki kwa upana'), detail: L('Tanzania and East Africa come first. Other regions follow the evidence, not the other way round.', 'Tanzania na Afrika Mashariki vinatangulia. Maeneo mengine yanafuata ushahidi, si kinyume chake.'), state: 'planned' },
    ],
  },
];

const STATE_LABEL: Record<LogEntry['state'], Text> = {
  planned: L('planned', 'imepangwa'),
  'in-progress': L('in progress', 'inaendelea'),
  conditional: L('depends on a gate', 'inategemea sharti'),
};

export function RoadmapBuildLog() {
  const { tr, tx } = useI18n();
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<Horizon>('now');
  const current = HORIZONS.find((h) => h.id === active) ?? HORIZONS[0];

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border" style={{ background: 'var(--qt-dark-navy)', borderColor: 'rgba(255,255,255,.14)' }} data-testid="roadmap-build-log">
      <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3" style={{ borderColor: 'rgba(255,255,255,.14)' }}>
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--qt-quality-gold)' }} aria-hidden="true" />
        <span className="font-mono-ui text-[11px]" style={{ color: 'var(--qt-light-teal)' }}>qualitracker / build-log</span>
        <div role="tablist" onKeyDown={navigateTabs} aria-label={tr('Roadmap horizon', 'Kipindi cha ramani ya njia')} className="flex w-full justify-end gap-1 sm:ml-auto sm:w-auto">
          {HORIZONS.map((h) => {
            const selected = h.id === active;
            return (
              <button
                key={h.id}
                role="tab"
                id={`roadmap-tab-${h.id}`}
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                aria-controls="roadmap-panel"
                type="button"
                onClick={() => setActive(h.id)}
                className="qt-focus rounded-md px-3 py-1.5 font-mono-ui text-[11px] transition-colors"
                style={{
                  background: selected ? 'var(--qt-quality-gold)' : 'transparent',
                  color: selected ? 'var(--qt-dark-navy)' : 'var(--qt-mint-light)',
                }}
              >
                {tx(h.label)}
              </button>
            );
          })}
        </div>
      </div>

      <div role="tabpanel" id="roadmap-panel" aria-labelledby={`roadmap-tab-${active}`} className="p-5 sm:p-6">
        <p className="font-mono-ui text-[11px]" style={{ color: 'var(--qt-light-teal)' }}>$ roadmap --horizon {current.id} <span># {current.caption}</span></p>
        <ol className="mt-5 space-y-5">
          {current.entries.map((entry, i) => (
            <motion.li
              key={entry.title.en}
              initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08, ease: [0.2, 0, 0.2, 1] }}
              className="grid gap-1 border-l-2 pl-4 sm:grid-cols-[130px_1fr] sm:gap-4"
              style={{ borderColor: entry.state === 'conditional' ? 'rgba(255,255,255,.28)' : 'var(--qt-quality-gold)' }}
            >
              <span className="font-mono-ui text-[11px]" style={{ color: 'var(--qt-light-teal)' }}>{tx(entry.when)}</span>
              <div>
                <p className="font-brand text-base font-bold" style={{ color: '#FFFFFF' }}>
                  {tx(entry.title)}
                  <span className="ml-2 align-middle font-mono-ui text-[10px] font-normal uppercase tracking-[.1em]" style={{ color: 'var(--qt-light-teal)' }}>{tx(STATE_LABEL[entry.state])}</span>
                </p>
                <p className="mt-1 text-xs leading-5" style={{ color: 'var(--qt-mint-light)' }}>{tx(entry.detail)}</p>
              </div>
            </motion.li>
          ))}
        </ol>
        <p className="mt-6 font-mono-ui text-[10px] leading-4" style={{ color: 'var(--qt-light-teal)' }}>
          {tr('Plans change with evidence. Dates marked “depends on a gate” need a signed agreement or an internal safety check first.', 'Mipango hubadilika kulingana na ushahidi. Tarehe zilizoandikwa “inategemea sharti” zinahitaji makubaliano yaliyosainiwa au ukaguzi wa usalama wa ndani kwanza.')}
        </p>
      </div>
    </div>
  );
}
