import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { StatusBadge, type ProductStatus } from '@/components/site/status-badge';
import { L, type Text, useI18n } from '@/lib/i18n';

interface Module {
  label: Text;
  status: ProductStatus;
  copy: Text;
}

// Descriptions state intent in plain terms. Anything not in the beta is
// described as planned or in development, never as available.
const MODULES: Module[] = [
  { label: L('Document & SOP control', 'Udhibiti wa nyaraka na SOP'), status: 'private-beta', copy: L('Versioned documents that move through draft, review, and approval, with the history kept.', 'Nyaraka zenye matoleo zinazopitia rasimu, mapitio, na idhini huku historia ikihifadhiwa.') },
  { label: L('Quality records', 'Rekodi za ubora'), status: 'private-beta', copy: L('Daily records such as temperature checks, QC and proficiency testing, each with who recorded it and when.', 'Rekodi za kila siku kama ukaguzi wa joto, QC, na upimaji wa ustadi, kila moja ikiwa na aliyerekodi na wakati.') },
  { label: L('AI assistant (QualiBOT)', 'Msaidizi wa AI (QualiBOT)'), status: 'in-development', copy: L("Answers questions only from your laboratory's own documents, cites the source, and says so when it cannot find an answer. Tested separately and not part of the November beta.", 'Hujibu maswali kutoka kwenye nyaraka za maabara yako pekee, hutaja chanzo, na husema wazi asipopata jibu. Hujaribiwa kando na si sehemu ya beta ya Novemba.') },
  { label: L('Corrective actions (CAPA)', 'Hatua za kurekebisha (CAPA)'), status: 'in-development', copy: L('A finding becomes an assigned action that closes only after two independent reviews.', 'Tatizo lililobainika huwa hatua iliyokabidhiwa inayofungwa tu baada ya mapitio mawili huru.') },
  { label: L('Non-conformances', 'Kutokidhi viwango'), status: 'in-development', copy: L('Findings are logged, numbered, and classed as major or minor so none are lost.', 'Matatizo yaliyobainika hurekodiwa, hupewa namba, na kuainishwa kuwa makuu au madogo ili yasipotee.') },
  { label: L('Internal audits', 'Ukaguzi wa ndani'), status: 'in-development', copy: L('Plan and record audits, and link what they find to actions.', 'Panga na rekodi ukaguzi, kisha unganisha matatizo yaliyobainika na hatua.') },
  { label: L('Equipment & calibration', 'Vifaa na urekebishaji'), status: 'planned', copy: L('Track instruments and when calibration is due.', 'Fuatilia vifaa na wakati urekebishaji unapohitajika.') },
  { label: L('Personnel competency & training', 'Umahiri na mafunzo ya wafanyakazi'), status: 'planned', copy: L('Keep training records and competency sign-offs in one place.', 'Hifadhi rekodi za mafunzo na idhini za umahiri sehemu moja.') },
  { label: L('Risk management', 'Usimamizi wa hatari'), status: 'planned', copy: L('Register risks with owners and review dates.', 'Sajili hatari pamoja na wamiliki na tarehe za mapitio.') },
  { label: L('Analytics & reporting', 'Uchanganuzi na ripoti'), status: 'planned', copy: L('Summaries of quality indicators drawn from the records above.', 'Muhtasari wa viashiria vya ubora unaotokana na rekodi zilizo hapo juu.') },
];

const LANES: Array<{ status: ProductStatus; title: Text; empty?: Text }> = [
  { status: 'planned', title: L('Planned', 'Imepangwa') },
  { status: 'in-development', title: L('In development', 'Inaendelezwa') },
  { status: 'private-beta', title: L('Private beta', 'Beta ya faragha') },
  { status: 'live', title: L('Live', 'Inatumika'), empty: L('Nothing is live yet. Modules move here only after the beta shows they work.', 'Hakuna kitu kinachotumika rasmi bado. Moduli huja hapa baada ya beta kuonyesha zinafanya kazi.') },
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, '-');

export function ModuleMap() {
  const { tx } = useI18n();
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<string>(MODULES[0].label.en);
  const current = MODULES.find((m) => m.label.en === selected) ?? MODULES[0];

  return (
    <div data-testid="module-map">
      <div className="grid gap-4 md:grid-cols-4">
        {LANES.map((lane, li) => {
          const items = MODULES.filter((m) => m.status === lane.status);
          return (
            <div key={lane.status} className="relative">
              <div className="mb-3 flex items-center gap-2">
                <span className="font-mono-ui flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold" style={{ borderColor: 'var(--qt-deep-teal)', color: 'var(--qt-deep-teal)' }}>{li + 1}</span>
                <p className="font-mono-ui text-[11px] font-bold uppercase tracking-[.1em]" style={{ color: 'var(--qt-near-black)' }}>{tx(lane.title)}</p>
                <span className="font-mono-ui text-[10px]" style={{ color: 'var(--qt-body-grey)' }}>{items.length}</span>
              </div>
              <div className="h-px w-full" style={{ background: 'var(--qt-border-grey)' }} aria-hidden="true" />
              <ul className="mt-3 space-y-2">
                {items.length === 0 && lane.empty && (
                  <li className="rounded-md border border-dashed p-3 text-xs leading-5" style={{ borderColor: 'var(--qt-border-grey)', color: 'var(--qt-body-grey)' }}>{tx(lane.empty)}</li>
                )}
                {items.map((m) => {
                  const on = m.label.en === selected;
                  return (
                    <li key={m.label.en}>
                      <button
                        type="button"
                        onClick={() => setSelected(m.label.en)}
                        aria-pressed={on}
                        className="qt-focus w-full rounded-md border px-3 py-2.5 text-left text-xs font-semibold leading-4 transition-colors"
                        style={{
                          borderColor: on ? 'var(--qt-deep-teal)' : 'var(--qt-border-grey)',
                          background: on ? 'var(--qt-teal-tint)' : '#FFFFFF',
                          borderStyle: lane.status === 'planned' && !on ? 'dashed' : 'solid',
                          color: 'var(--qt-near-black)',
                        }}
                        data-testid={`row-capability-${slug(m.label.en)}`}
                      >
                        {tx(m.label)}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <motion.div
        key={current.label.en}
        initial={reduce ? undefined : { opacity: 0, y: 8 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="qt-brackets relative mt-8 p-6"
        aria-live="polite"
      >
        <span className="qt-bracket-b absolute inset-0" aria-hidden="true" />
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-brand text-lg font-bold" style={{ color: 'var(--qt-near-black)' }}>{tx(current.label)}</h3>
          <StatusBadge status={current.status} />
        </div>
        <p className="mt-3 max-w-[620px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>{tx(current.copy)}</p>
      </motion.div>
    </div>
  );
}
