import { navigateTabs } from '@/lib/tab-keyboard';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useI18n, L } from '@/lib/i18n';

// From the Product Implementation Plan (7 Oct 2026): prepare, orient, train,
// run, and close with a documented exit decision. Durations are not stated
// there beyond relative weeks, so none are shown here.
const STEPS = [
  { label: L('Orientation', 'Utangulizi'), title: L('Understand before committing', 'Elewa kabla ya kujitolea'), copy: L('Superusers see how the eQMS works before their laboratory commits staff time, so expectations are clear on both sides.', 'Watumiaji wakuu huona jinsi eQMS inavyofanya kazi kabla maabara yao haijatoa muda wa wafanyakazi, ili matarajio yawe wazi pande zote mbili.') },
  { label: L('Training', 'Mafunzo'), title: L('Superusers trained virtually', 'Watumiaji wakuu hufundishwa mtandaoni'), copy: L('Once a laboratory commits, its superusers are trained online with guides and slides prepared for the beta.', 'Maabara inapojitolea, watumiaji wake wakuu hufundishwa mtandaoni kwa miongozo na slaidi zilizoandaliwa kwa beta.') },
  { label: L('On-site support', 'Msaada wa papo hapo'), title: L('Three days alongside your team', 'Siku tatu pamoja na timu yako'), copy: L('The QualiTracker team supports superusers in person until they are working independently.', 'Timu ya QualiTracker huwasaidia watumiaji wakuu ana kwa ana hadi wafanye kazi wenyewe.') },
  { label: L('Run & feedback', 'Matumizi na maoni'), title: L('Real workflows, ranked weekly', 'Mtiririko halisi wa kazi, unapangwa kila wiki'), copy: L('Feedback is logged in one place and ranked each week. Every item is marked done, deferred, or declined.', 'Maoni huandikwa mahali pamoja na kupangwa kila wiki. Kila jambo huwekwa alama: limefanyika, limeahirishwa, au limekataliwa.') },
  { label: L('Exit review', 'Mapitio ya mwisho'), title: L('A documented go / no-go', 'Uamuzi ulioandikwa wa endelea / acha'), copy: L('Results are compared with the measures set at the start, and the decision about wider pilots is written down.', 'Matokeo hulinganishwa na vipimo vilivyowekwa mwanzoni, na uamuzi kuhusu majaribio mapana huandikwa.') },
];

export function BetaJourney() {
  const reduceMotion = useReducedMotion();
  const { tr, tx } = useI18n();
  const [active, setActive] = useState(0);
  const step = STEPS[active];

  return (
    <div data-testid="beta-journey">
      <div role="tablist" onKeyDown={navigateTabs} aria-label={tr('Beta journey', 'Safari ya beta')} className="relative grid grid-cols-5 gap-1">
        <div className="absolute left-[10%] right-[10%] top-[15px] h-px" style={{ background: 'var(--qt-border-grey)' }} aria-hidden="true" />
        {STEPS.map((s, i) => {
          const reached = i <= active;
          return (
            <button
              key={s.label.en}
              role="tab"
              type="button"
              aria-selected={i === active}
              tabIndex={i === active ? 0 : -1}
              aria-controls="beta-journey-panel"
              onClick={() => setActive(i)}
              className="qt-focus relative flex flex-col items-center gap-2 rounded-md py-1 text-center"
            >
              <span
                className="font-mono-ui relative z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full border text-[11px] font-bold transition-colors"
                style={{
                  background: reached ? 'var(--qt-dark-navy)' : '#FFFFFF',
                  color: reached ? 'var(--qt-quality-gold)' : 'var(--qt-body-grey)',
                  borderColor: reached ? 'var(--qt-dark-navy)' : 'var(--qt-border-grey)',
                }}
              >
                {i + 1}
              </span>
              <span className="text-[10px] font-semibold leading-3 sm:text-xs" style={{ color: i === active ? 'var(--qt-near-black)' : 'var(--qt-body-grey)' }}>{tx(s.label)}</span>
            </button>
          );
        })}
      </div>
      <motion.div
        key={active}
        id="beta-journey-panel"
        role="tabpanel"
        initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="qt-card mt-6 p-6"
        aria-live="polite"
      >
        <p className="qt-technical-label">{tr('Step', 'Hatua')} {active + 1} {tr('of', 'ya')} {STEPS.length}</p>
        <h3 className="font-brand mt-2 text-lg font-bold" style={{ color: 'var(--qt-near-black)' }}>{tx(step.title)}</h3>
        <p className="mt-2 max-w-[520px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>{tx(step.copy)}</p>
      </motion.div>
    </div>
  );
}
