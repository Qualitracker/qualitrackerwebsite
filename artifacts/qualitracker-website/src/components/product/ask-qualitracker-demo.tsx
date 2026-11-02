import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { QtSymbol } from '@/assets/qt-symbol';
import { TechnicalRecordBlock } from '@/components/site/technical-block';
import { SegmentedControl } from '@/components/site/segmented-control';

type Mode = 'found' | 'missing';

const QUESTIONS: Record<Mode, string> = {
  found: 'What corrective actions remain unresolved from the most recent internal audit?',
  missing: 'How does our turnaround time compare to other labs in the region?',
};

/**
 * "Ask QualiTracker" — the RAG demo. Illustrative/demo data, not a real
 * customer's lab. Every answer carries a citation, a confidence level, and
 * the mandatory disclaimer, per the real brand kit's QualiBOT spec — this is
 * QualiTracker's own version of "every answer traces to a path you can
 * audit," made visible the way the Graphify analysis recommends.
 */
export function AskQualiTrackerDemo() {
  const [mode, setMode] = useState<Mode>('found');
  const [question, setQuestion] = useState(QUESTIONS.found);
  const [thinking, setThinking] = useState(false);

  function selectMode(next: Mode) {
    setQuestion(QUESTIONS[next]);
    setThinking(true);
    // A brief, real "retrieving" beat — not decoration, the same thinking
    // state the brand kit's own BotAvatar spec defines (a pulsing ring)
    // wired up here, since it was previously defined in CSS but unused.
    window.setTimeout(() => {
      setMode(next);
      setThinking(false);
    }, 450);
  }

  return (
    <div className="qt-card overflow-hidden" style={{ background: 'var(--qt-clinical-white)' }}>
      <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'var(--qt-border-grey)' }}>
        <div className="flex items-center gap-2.5">
          <span className={`flex h-9 w-9 items-center justify-center rounded-full ${thinking ? 'qt-thinking' : ''}`} style={{ background: 'var(--qt-deep-teal)' }}>
            <QtSymbol color="#FFFFFF" size={16} />
          </span>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--qt-near-black)' }}>Ask QualiBOT</p>
            <p className="font-mono-ui text-[10px] uppercase tracking-[.08em]" style={{ color: 'var(--qt-body-grey)' }}>Illustrative demo, not a real laboratory's data</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="ml-auto max-w-[90%] rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-6" style={{ background: 'var(--qt-teal-tint)', color: 'var(--qt-dark-navy)' }}>
          {question}
        </div>

        {thinking ? (
          <div className="max-w-[94%] rounded-2xl rounded-bl-sm border px-4 py-3.5" style={{ borderColor: 'var(--qt-border-grey)', background: 'var(--qt-lab-grey)' }} data-testid="ask-thinking-state">
            <p className="font-mono-ui text-[11px] uppercase tracking-[.08em]" style={{ color: 'var(--qt-body-grey)' }}>Checking your lab's records…</p>
          </div>
        ) : mode === 'found' ? (
          <div className="max-w-[94%] space-y-3">
            <div className="rounded-2xl rounded-bl-sm border px-4 py-3.5" style={{ borderColor: 'var(--qt-border-grey)', background: 'var(--qt-lab-grey)' }}>
              <p className="text-sm leading-6" style={{ color: 'var(--qt-near-black)' }}>
                Two corrective actions are still open from the Q3 internal audit: <strong>CAPA-014</strong> (reagent storage deviation, due in 4 days) and <strong>CAPA-017</strong> (equipment calibration record gap, due in 11 days).
              </p>
            </div>
            {/* Real fields only: retrieval is gated by a threshold internally
                (see docs/website/17_WEBSITE_IMPLEMENTATION_PLAN.md's Wave 2
                note) but the system doesn't expose a labeled confidence
                percentage, so this shows the gate result, not an invented
                number. */}
            <TechnicalRecordBlock
              eyebrow="QUALIBOT / RESPONSE"
              fields={[
                { label: 'SOURCE', value: 'Audit Log · Q3 2026' },
                { label: 'RETRIEVAL', value: 'ABOVE THRESHOLD' },
                { label: 'TRACE', value: 'AUDIT → FINDING → CAPA' },
                { label: 'HUMAN REVIEW', value: 'REQUIRED' },
              ]}
            />
          </div>
        ) : (
          <div className="max-w-[94%] space-y-3">
            <div className="rounded-2xl rounded-bl-sm border border-dashed px-4 py-3.5" style={{ borderColor: 'var(--qt-quality-gold)', background: 'var(--qt-lab-grey)' }}>
              <p className="text-sm leading-6" style={{ color: 'var(--qt-near-black)' }}>I couldn't find a relevant record in this lab's quality system for that question.</p>
              <p className="mt-2 text-[11px] leading-5" style={{ color: 'var(--qt-body-grey)' }}>QualiBOT only answers from your lab's own uploaded documents, it doesn't guess or compare against other laboratories.</p>
            </div>
            <TechnicalRecordBlock
              eyebrow="QUALIBOT / RESPONSE"
              fields={[
                { label: 'RETRIEVAL', value: 'BELOW THRESHOLD' },
                { label: 'STATUS', value: 'NO RECORD FOUND' },
              ]}
            />
          </div>
        )}

        <p className="text-[10px] leading-4" style={{ color: 'var(--qt-body-grey)' }}>
          AI-generated, verify critical decisions with your lab supervisor. Not a diagnostic tool.
        </p>

        <div className="border-t pt-4" style={{ borderColor: 'var(--qt-border-grey)' }}>
          <div className="mb-2 qt-technical-label">Try the other state</div>
          <SegmentedControl
            aria-label="Demo question state"
            value={mode}
            onChange={selectMode}
            options={[
              { value: 'found', label: 'Audit finding' },
              { value: 'missing', label: 'Out of scope' },
            ]}
          />
        </div>

        <div className="flex gap-2 rounded-xl border p-2" style={{ borderColor: 'var(--qt-border-grey)', background: 'var(--qt-lab-grey)' }}>
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            className="min-w-0 flex-1 bg-transparent px-2 text-xs outline-none"
            style={{ color: 'var(--qt-near-black)' }}
            aria-label="Ask QualiBOT a question"
            data-testid="input-ask-question"
          />
          <button
            type="button"
            onClick={() => selectMode(question.toLowerCase().includes('compare') ? 'missing' : 'found')}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            style={{ background: 'var(--qt-deep-teal)', color: '#FFFFFF' }}
            aria-label="Send question"
            data-testid="button-send-ask"
          >
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
