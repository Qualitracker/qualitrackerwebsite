import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { L, useI18n } from '@/lib/i18n';

const STEPS = [
  { label: L('Question', 'Swali'), copy: L('A staff member asks in plain language, with no query syntax to learn.', 'Mfanyakazi anauliza kwa lugha rahisi bila kujifunza muundo wa amri.'), trace: [L('Q', 'S'), L('What do I do if the freezer alarm sounds?', 'Nifanye nini kengele ya friza ikilia?')] },
  { label: L('Permission layer', 'Tabaka la ruhusa'), copy: L("Checked against what that person's role is allowed to see, first.", 'Kwanza huangaliwa dhidi ya kile ambacho jukumu la mtu huyo linaruhusiwa kuona.'), trace: [L('Role', 'Jukumu'), L('Technologist. Can read SOPs and records.', 'Mtaalamu wa maabara. Anaweza kusoma SOP na rekodi.')] },
  { label: L('Authorized knowledge', 'Maarifa yaliyoidhinishwa'), copy: L("Only this lab's own uploaded SOPs, records, and audit logs, never another lab's data.", 'SOP, rekodi, na kumbukumbu za ukaguzi zilizopakiwa na maabara hii pekee, kamwe si data ya maabara nyingine.'), trace: [L('Scope', 'Wigo'), L("This laboratory's documents only.", 'Nyaraka za maabara hii pekee.')] },
  { label: L('Retrieval', 'Utafutaji'), copy: L('The relevant passage is located, not guessed at.', 'Sehemu inayohusika inatafutwa, haibahatishwi.'), trace: [L('Found', 'Imepatikana'), L('SOP-017, section 4.2', 'SOP-017, sehemu ya 4.2')] },
  { label: L('Evidence', 'Ushahidi'), copy: L('The exact document and section the answer will cite.', 'Hati na sehemu halisi ambayo jibu litataja.'), trace: [L('Source', 'Chanzo'), L('SOP-017, version 3, page 4', 'SOP-017, toleo la 3, ukurasa wa 4')] },
  { label: L('AI reasoning', 'Uchanganuzi wa AI'), copy: L('A plain-language answer is drafted from the evidence, not from general knowledge.', 'Jibu la lugha rahisi linaandaliwa kutoka kwenye ushahidi, si maarifa ya jumla.'), trace: [L('Draft', 'Rasimu'), L('Check the door seal, record the temperature, tell the quality manager.', 'Kagua muhuri wa mlango, rekodi joto, na mjulishe meneja wa ubora.')] },
  { label: L('Traceable response', 'Jibu linalofuatilika'), copy: L('Delivered with its citation and a confidence level attached, or a clear "not found."', 'Hutolewa pamoja na rejea na kiwango cha uhakika, au ujumbe wazi wa "haijapatikana."'), trace: [L('Answer', 'Jibu'), L('Cited to SOP-017 section 4.2. Confidence: high.', 'Rejea SOP-017 sehemu ya 4.2. Uhakika: juu.')] },
] as const;

/** The answer assembling line by line as each step lights up. Illustrative, not a real laboratory's data. */
function AnswerBuild({ upTo }: { upTo: number }) {
  const { tr, tx } = useI18n();
  return (
    <div className="qt-brackets relative p-5 lg:sticky lg:top-24" data-testid="answer-build">
      <span className="qt-bracket-b absolute inset-0" aria-hidden="true" />
      <p className="qt-technical-label">{tr('The answer, as it is built', 'Jibu linavyojengwa')}</p>
      <ol className="font-mono-ui mt-4 space-y-3 text-[12px] leading-5">
        {STEPS.map((step, i) => {
          const shown = i <= upTo;
          return (
            // Never dim text with opacity: Lighthouse measured the dimmed rows at
            // 1.5:1 contrast. Unlit rows use the body grey (readable) and lit rows
            // switch to full-strength text with a teal label.
            <li key={step.label.en} className="grid grid-cols-[64px_1fr] gap-3">
              <span className="transition-colors duration-300" style={{ color: shown ? 'var(--qt-deep-teal)' : 'var(--qt-body-grey)', fontWeight: shown ? 700 : 400 }}>{tx(step.trace[0])}</span>
              <span className="transition-colors duration-300" style={{ color: shown ? 'var(--qt-near-black)' : 'var(--qt-body-grey)' }}>{tx(step.trace[1])}</span>
            </li>
          );
        })}
      </ol>
      <p className="mt-5 text-[11px]" style={{ color: 'var(--qt-body-grey)' }}>{tr("Illustrative example, not a real laboratory's data.", 'Mfano wa kuonyesha, si data ya maabara halisi.')}</p>
    </div>
  );
}

/**
 * How a QualiBOT answer actually gets built, played out as a scroll-driven
 * pipeline. Each step activates as it crosses the vertical centre of the
 * screen and stays lit, while the card beside it assembles the same answer.
 * Every stage is something the product does (see ask-qualitracker-demo.tsx
 * for the same steps as a conversation), with no invented infrastructure.
 */
export function RagPipelineScroll() {
  const { tr, tx } = useI18n();
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(reduceMotion ? STEPS.length - 1 : -1);

  if (reduceMotion) {
    return (
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="qt-card p-6">
          {STEPS.map((step, i) => (
            <div key={step.label.en} className="flex gap-4 py-2">
              <span className="font-mono-ui flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: 'var(--qt-deep-teal)', color: '#FFFFFF' }}>
                {i + 1}
              </span>
              <div>
                <p className="font-brand text-sm font-semibold" style={{ color: 'var(--qt-near-black)' }}>{tx(step.label)}</p>
                <p className="text-xs leading-5" style={{ color: 'var(--qt-body-grey)' }}>{tx(step.copy)}</p>
              </div>
            </div>
          ))}
        </div>
        <AnswerBuild upTo={STEPS.length - 1} />
      </div>
    );
  }

  const lineHeightPct = ((activeIndex + 1) / STEPS.length) * 100;

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <div className="qt-card overflow-hidden p-6 sm:p-8">
        <p className="qt-eyebrow">{tr('How an answer gets built', 'Jinsi jibu linavyojengwa')}</p>
        <div className="relative mt-6 pl-9">
          <div className="absolute left-[13px] top-1 bottom-1 w-[2px] rounded-full" style={{ background: 'var(--qt-border-grey)' }} />
          <div
            className="absolute left-[13px] top-1 w-[2px] rounded-full transition-[height] duration-500 ease-out"
            style={{ background: 'var(--qt-deep-teal)', height: `${lineHeightPct}%` }}
          />
          {STEPS.map((step, i) => {
            const isActive = i <= activeIndex;
            return (
              <motion.div
                key={step.label.en}
                className="relative mb-12 last:mb-0"
                style={{ minHeight: 44 }}
                viewport={{ margin: '-45% 0px -45% 0px', once: false }}
                onViewportEnter={() => setActiveIndex((prev) => Math.max(prev, i))}
              >
                <span
                  className="font-mono-ui absolute -left-9 flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-colors duration-300"
                  style={{ background: isActive ? 'var(--qt-deep-teal)' : 'var(--qt-lab-grey)', color: isActive ? '#FFFFFF' : 'var(--qt-body-grey)' }}
                >
                  {i + 1}
                </span>
                <p
                  className="font-brand text-base font-bold transition-colors duration-300"
                  style={{ color: isActive ? 'var(--qt-near-black)' : 'var(--qt-body-grey)' }}
                >
                  {tx(step.label)}
                </p>
                {/* Full opacity always: a real Lighthouse run caught the dimmed
                    state failing contrast. The circle fill and label above
                    already carry the active/inactive cue. */}
                <p className="mt-1 max-w-[420px] text-xs leading-5" style={{ color: 'var(--qt-body-grey)' }}>
                  {tx(step.copy)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
      <AnswerBuild upTo={activeIndex} />
    </div>
  );
}
