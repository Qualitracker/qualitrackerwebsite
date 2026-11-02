import { useState } from 'react';

interface LifecycleStage {
  label: string;
  detail: string;
  branch?: string;
}

/**
 * A real workflow state machine, rendered as a horizontal timeline. Both
 * callers below use the actual Django model STATUS_CHOICES from the real
 * QMS repository (thestartupgroup7/qmswebsite), not an invented or
 * idealized version of the workflow — see the stage copy for what each
 * one maps to.
 */
export function LifecycleTimeline({
  stages,
  accent = 'var(--qt-deep-teal)',
  accentText = '#FFFFFF',
}: {
  stages: LifecycleStage[];
  accent?: string;
  /** Text color for the active pill. White fails contrast on the gold accent
      (~2.3:1), pass 'var(--qt-dark-navy)' when accent is gold. */
  accentText?: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="qt-card p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono-ui text-[11px] uppercase tracking-[.08em]" style={{ color: 'var(--qt-body-grey)' }}>Step {active + 1} of {stages.length}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setActive((i) => Math.max(0, i - 1))} disabled={active === 0} className="qt-focus qt-dashed rounded-md px-3 py-1.5 text-[11px] font-semibold disabled:opacity-40" style={{ color: 'var(--qt-near-black)' }}>Back</button>
          <button type="button" onClick={() => setActive((i) => Math.min(stages.length - 1, i + 1))} disabled={active === stages.length - 1} className="qt-focus rounded-md px-3 py-1.5 text-[11px] font-semibold disabled:opacity-40" style={{ background: accent, color: accentText }}>Next</button>
        </div>
      </div>
      <div className="mt-3 flex gap-1" aria-hidden="true">
        {stages.map((stage, i) => (
          <span key={stage.label} className="h-1 flex-1 rounded-full transition-colors" style={{ background: i <= active ? accent : 'var(--qt-border-grey)' }} />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {stages.map((stage, i) => (
          <button
            key={stage.label}
            type="button"
            onClick={() => setActive(i)}
            onFocus={() => setActive(i)}
            className="qt-button qt-focus rounded-full border px-3 py-1.5 text-left text-[11px] font-semibold"
            style={
              active === i
                ? { borderColor: accent, background: accent, color: accentText }
                : { borderColor: 'var(--qt-border-grey)', color: 'var(--qt-body-grey)' }
            }
            data-testid={`lifecycle-stage-${i}`}
          >
            {stage.label}
          </button>
        ))}
      </div>
      <p className="mt-5 text-sm leading-6" style={{ color: 'var(--qt-near-black)' }}>{stages[active].detail}</p>
      {/* body-grey, not gold-text — gold-text is ~3.66:1 on white at any size,
          confirmed failing 4.5:1 by the earlier Lighthouse run; reserve gold
          for icons/graphics only, per docs/website/14_ACCESSIBILITY_AUDIT.md */}
      {stages[active].branch && (
        <p className="mt-2 text-xs leading-5" style={{ color: 'var(--qt-body-grey)' }}>↩ {stages[active].branch}</p>
      )}
    </div>
  );
}
