import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { QtSymbol } from '@/assets/qt-symbol';
import { TechnicalRecordBlock } from '@/components/site/technical-block';
import { SegmentedControl } from '@/components/site/segmented-control';
import { L, type Text, useI18n } from '@/lib/i18n';

type Mode = 'found' | 'missing';

const QUESTIONS: Record<Mode, Text> = {
  found: L('What corrective actions remain unresolved from the most recent internal audit?', 'Ni hatua gani za kurekebisha bado hazijatatuliwa kutoka ukaguzi wa ndani wa hivi karibuni?'),
  missing: L('How does our turnaround time compare to other labs in the region?', 'Muda wetu wa kutoa matokeo unalinganishwaje na maabara nyingine katika eneo hili?'),
};

/**
 * "Ask QualiTracker" — the RAG demo. Illustrative/demo data, not a real
 * customer's lab. Every answer carries a citation, a confidence level, and
 * the mandatory disclaimer, per the real brand kit's QualiBOT spec — this is
 * QualiTracker's own version of "every answer traces to a path you can
 * audit," made visible the way the Graphify analysis recommends.
 */
export function AskQualiTrackerDemo() {
  const { tr, tx } = useI18n();
  const [mode, setMode] = useState<Mode>('found');
  const [draft, setDraft] = useState<string | null>(null);
  const [submittedQuestion, setSubmittedQuestion] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const question = submittedQuestion ?? tx(QUESTIONS[mode]);
  const inputValue = draft ?? question;

  function showResponse(next: Mode, submitted: string | null) {
    if (thinking) return;
    setMode(next);
    setSubmittedQuestion(submitted);
    setDraft(null);
    setThinking(true);
    window.setTimeout(() => setThinking(false), 450);
  }

  function sendQuestion() {
    if (draft === null) {
      showResponse(mode, submittedQuestion);
      return;
    }
    const submitted = draft.trim();
    if (!submitted) return;
    // The demo has one matching source, shown by either language's audit preset.
    const auditQuestion = QUESTIONS.found;
    const matchesAudit = submitted === auditQuestion.en || submitted === auditQuestion.sw;
    showResponse(matchesAudit ? 'found' : 'missing', submitted);
  }

  return (
    <div className="qt-card overflow-hidden" style={{ background: 'var(--qt-clinical-white)' }} data-testid="ask-qualitracker-demo">
      <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'var(--qt-border-grey)' }}>
        <div className="flex items-center gap-2.5">
          <span className={`flex h-9 w-9 items-center justify-center rounded-full ${thinking ? 'qt-thinking' : ''}`} style={{ background: 'var(--qt-deep-teal)' }}>
            <QtSymbol color="#FFFFFF" size={16} />
          </span>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--qt-near-black)' }}>{tr('Ask QualiBOT', 'Uliza QualiBOT')}</p>
            <p className="font-mono-ui text-[10px] uppercase tracking-[.08em]" style={{ color: 'var(--qt-body-grey)' }}>{tr("Illustrative demo, not a real laboratory's data", 'Onyesho la mfano, si data ya maabara halisi')}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="ml-auto max-w-[90%] rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-6" style={{ background: 'var(--qt-teal-tint)', color: 'var(--qt-dark-navy)' }}>
          {question}
        </div>

        {thinking ? (
          <div className="max-w-[94%] rounded-2xl rounded-bl-sm border px-4 py-3.5" style={{ borderColor: 'var(--qt-border-grey)', background: 'var(--qt-lab-grey)' }} data-testid="ask-thinking-state">
            <p className="font-mono-ui text-[11px] uppercase tracking-[.08em]" style={{ color: 'var(--qt-body-grey)' }}>{tr("Checking your lab's records…", 'Inakagua rekodi za maabara yako…')}</p>
          </div>
        ) : mode === 'found' ? (
          <div className="max-w-[94%] space-y-3">
            <div className="rounded-2xl rounded-bl-sm border px-4 py-3.5" style={{ borderColor: 'var(--qt-border-grey)', background: 'var(--qt-lab-grey)' }}>
              <p className="text-sm leading-6" style={{ color: 'var(--qt-near-black)' }}>
                {tr('Two corrective actions are still open from the Q3 internal audit:', 'Hatua mbili za kurekebisha bado ziko wazi kutoka ukaguzi wa ndani wa Q3:')} <strong>CAPA-014</strong> {tr('(reagent storage deviation, due in 4 days) and', '(hitilafu ya uhifadhi wa vitendanishi, inatakiwa ndani ya siku 4) na')} <strong>CAPA-017</strong> {tr('(equipment calibration record gap, due in 11 days).', '(pengo la rekodi ya urekebishaji wa kifaa, inatakiwa ndani ya siku 11).')}
              </p>
            </div>
            {/* Real fields only: retrieval is gated by a threshold internally
                (see docs/website/17_WEBSITE_IMPLEMENTATION_PLAN.md's Wave 2
                note) but the system doesn't expose a labeled confidence
                percentage, so this shows the gate result, not an invented
                number. */}
            <TechnicalRecordBlock
              eyebrow={tr('QUALIBOT / RESPONSE', 'QUALIBOT / JIBU')}
              fields={[
                { label: tr('SOURCE', 'CHANZO'), value: tr('Audit Log · Q3 2026', 'Kumbukumbu ya Ukaguzi · Q3 2026') },
                { label: tr('RETRIEVAL', 'UTAFUTAJI'), value: tr('ABOVE THRESHOLD', 'JUU YA KIWANGO') },
                { label: tr('TRACE', 'UFUATILIAJI'), value: tr('AUDIT → FINDING → CAPA', 'UKAGUZI → TATIZO → CAPA') },
                { label: tr('HUMAN REVIEW', 'MAPITIO YA BINADAMU'), value: tr('REQUIRED', 'YANAHITAJIKA') },
              ]}
            />
          </div>
        ) : (
          <div className="max-w-[94%] space-y-3">
            <div className="rounded-2xl rounded-bl-sm border border-dashed px-4 py-3.5" style={{ borderColor: 'var(--qt-quality-gold)', background: 'var(--qt-lab-grey)' }}>
              <p className="text-sm leading-6" style={{ color: 'var(--qt-near-black)' }}>{tr("I couldn't find a relevant record in this lab's quality system for that question.", 'Sikuweza kupata rekodi inayohusika katika mfumo wa ubora wa maabara hii kwa swali hilo.')}</p>
              <p className="mt-2 text-[11px] leading-5" style={{ color: 'var(--qt-body-grey)' }}>{tr("QualiBOT only answers from your lab's own uploaded documents, it doesn't guess or compare against other laboratories.", 'QualiBOT hujibu kutoka kwenye nyaraka zilizopakiwa na maabara yako pekee; haibahatishi wala kulinganisha na maabara nyingine.')}</p>
            </div>
            <TechnicalRecordBlock
              eyebrow={tr('QUALIBOT / RESPONSE', 'QUALIBOT / JIBU')}
              fields={[
                { label: tr('RETRIEVAL', 'UTAFUTAJI'), value: tr('BELOW THRESHOLD', 'CHINI YA KIWANGO') },
                { label: tr('STATUS', 'HALI'), value: tr('NO RECORD FOUND', 'HAKUNA REKODI ILIYOPATIKANA') },
              ]}
            />
          </div>
        )}

        <p className="text-[10px] leading-4" style={{ color: 'var(--qt-body-grey)' }}>
          {tr('AI-generated, verify critical decisions with your lab supervisor. Not a diagnostic tool.', 'Imetengenezwa na AI; thibitisha maamuzi muhimu na msimamizi wa maabara yako. Si kifaa cha uchunguzi.')}
        </p>

        <div className="border-t pt-4" style={{ borderColor: 'var(--qt-border-grey)' }}>
          <div className="mb-2 qt-technical-label">{tr('Try the other state', 'Jaribu hali nyingine')}</div>
          <SegmentedControl
            aria-label={tr('Demo question state', 'Hali ya swali la onyesho')}
            value={mode}
            onChange={(next) => showResponse(next, null)}
            options={[
              { value: 'found', label: tr('Audit finding', 'Tatizo la ukaguzi') },
              { value: 'missing', label: tr('Out of scope', 'Nje ya wigo') },
            ]}
          />
        </div>

        <div className="flex gap-2 rounded-xl border p-2" style={{ borderColor: 'var(--qt-border-grey)', background: 'var(--qt-lab-grey)' }}>
          <input
            value={inputValue}
            onChange={(event) => setDraft(event.target.value)}
            className="min-w-0 flex-1 bg-transparent px-2 text-xs outline-none"
            style={{ color: 'var(--qt-near-black)' }}
            aria-label={tr('Ask QualiBOT a question', 'Uliza QualiBOT swali')}
            data-testid="input-ask-question"
          />
          <button
            type="button"
            onClick={sendQuestion}
            disabled={thinking || !inputValue.trim()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            style={{ background: 'var(--qt-deep-teal)', color: '#FFFFFF' }}
            aria-label={tr('Send question', 'Tuma swali')}
            data-testid="button-send-ask"
          >
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
