import { useState } from 'react';

const STEPS = [
  { label: 'Question', copy: 'A staff member asks in plain language, no query syntax to learn.' },
  { label: 'Permission layer', copy: "Checked against what that person's role is allowed to see, first." },
  { label: 'Authorized knowledge', copy: "Only this lab's own uploaded SOPs, records, and audit logs, never another lab's data." },
  { label: 'Retrieval', copy: 'The relevant passage is located, not guessed at.' },
  { label: 'Evidence', copy: 'The exact document and section the answer will cite.' },
  { label: 'AI reasoning', copy: 'A plain-language answer is drafted from the evidence, not from general knowledge.' },
  { label: 'Traceable response', copy: 'Delivered with its citation and a confidence level attached, or a clear "not found."' },
] as const;

/** How QualiBOT actually answers a question — the honest version of the brief's own RAG diagram. */
export function RagFlowDiagram() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="qt-card p-6" style={{ background: 'var(--qt-clinical-white)' }}>
      <div className="flex flex-col gap-0">
        {STEPS.map((step, i) => {
          const isActive = active === i;
          return (
            <div key={step.label}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="qt-button qt-focus flex w-full items-center gap-4 rounded-md px-2 py-3 text-left"
                style={{ background: isActive ? 'var(--qt-teal-tint)' : 'transparent' }}
                data-testid={`button-rag-step-${i}`}
              >
                <span
                  className="font-mono-ui flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                  style={{
                    background: isActive ? 'var(--qt-deep-teal)' : 'var(--qt-lab-grey)',
                    color: isActive ? '#FFFFFF' : 'var(--qt-body-grey)',
                  }}
                >
                  {i + 1}
                </span>
                <span className="font-brand text-sm font-semibold" style={{ color: 'var(--qt-near-black)' }}>{step.label}</span>
              </button>
              {isActive && (
                <p className="qt-reveal ml-11 mb-2 max-w-[480px] text-xs leading-5" style={{ color: 'var(--qt-body-grey)' }}>
                  {step.copy}
                </p>
              )}
              {i < STEPS.length - 1 && <div className="ml-[26px] h-4 w-px" style={{ background: 'var(--qt-border-grey)' }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
