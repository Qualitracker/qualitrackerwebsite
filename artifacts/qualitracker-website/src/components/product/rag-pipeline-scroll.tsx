import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const STEPS = [
  { label: 'Question', copy: 'A staff member asks in plain language, with no query syntax to learn.', trace: ['Q', 'What do I do if the freezer alarm sounds?'] },
  { label: 'Permission layer', copy: "Checked against what that person's role is allowed to see, first.", trace: ['Role', 'Technologist. Can read SOPs and records.'] },
  { label: 'Authorized knowledge', copy: "Only this lab's own uploaded SOPs, records, and audit logs, never another lab's data.", trace: ['Scope', "This laboratory's documents only."] },
  { label: 'Retrieval', copy: 'The relevant passage is located, not guessed at.', trace: ['Found', 'SOP-017, section 4.2'] },
  { label: 'Evidence', copy: 'The exact document and section the answer will cite.', trace: ['Source', 'SOP-017, version 3, page 4'] },
  { label: 'AI reasoning', copy: 'A plain-language answer is drafted from the evidence, not from general knowledge.', trace: ['Draft', 'Check the door seal, record the temperature, tell the quality manager.'] },
  { label: 'Traceable response', copy: 'Delivered with its citation and a confidence level attached, or a clear "not found."', trace: ['Answer', 'Cited to SOP-017 section 4.2. Confidence: high.'] },
] as const;

/** The answer assembling line by line as each step lights up. Illustrative, not a real laboratory's data. */
function AnswerBuild({ upTo }: { upTo: number }) {
  return (
    <div className="qt-brackets relative p-5 lg:sticky lg:top-24" data-testid="answer-build">
      <span className="qt-bracket-b absolute inset-0" aria-hidden="true" />
      <p className="qt-technical-label">The answer, as it is built</p>
      <ol className="font-mono-ui mt-4 space-y-3 text-[12px] leading-5">
        {STEPS.map((step, i) => {
          const shown = i <= upTo;
          return (
            // Never dim text with opacity: Lighthouse measured the dimmed rows at
            // 1.5:1 contrast. Unlit rows use the body grey (readable) and lit rows
            // switch to full-strength text with a teal label.
            <li key={step.label} className="grid grid-cols-[64px_1fr] gap-3">
              <span className="transition-colors duration-300" style={{ color: shown ? 'var(--qt-deep-teal)' : 'var(--qt-body-grey)', fontWeight: shown ? 700 : 400 }}>{step.trace[0]}</span>
              <span className="transition-colors duration-300" style={{ color: shown ? 'var(--qt-near-black)' : 'var(--qt-body-grey)' }}>{step.trace[1]}</span>
            </li>
          );
        })}
      </ol>
      <p className="mt-5 text-[11px]" style={{ color: 'var(--qt-body-grey)' }}>Illustrative example, not a real laboratory's data.</p>
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
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(reduceMotion ? STEPS.length - 1 : -1);

  if (reduceMotion) {
    return (
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="qt-card p-6">
          {STEPS.map((step, i) => (
            <div key={step.label} className="flex gap-4 py-2">
              <span className="font-mono-ui flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: 'var(--qt-deep-teal)', color: '#FFFFFF' }}>
                {i + 1}
              </span>
              <div>
                <p className="font-brand text-sm font-semibold" style={{ color: 'var(--qt-near-black)' }}>{step.label}</p>
                <p className="text-xs leading-5" style={{ color: 'var(--qt-body-grey)' }}>{step.copy}</p>
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
        <p className="qt-eyebrow">How an answer gets built</p>
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
                key={step.label}
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
                  {step.label}
                </p>
                {/* Full opacity always: a real Lighthouse run caught the dimmed
                    state failing contrast. The circle fill and label above
                    already carry the active/inactive cue. */}
                <p className="mt-1 max-w-[420px] text-xs leading-5" style={{ color: 'var(--qt-body-grey)' }}>
                  {step.copy}
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
