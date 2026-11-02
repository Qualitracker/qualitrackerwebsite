import type { ReactNode } from 'react';

/**
 * The technical typography layer's one reusable container | QualiTracker's
 * equivalent to the terminal/IDE blocks in the Graphify reference, built to
 * feel like a quality-system record rather than a literal macOS terminal.
 * Three variants cover every real use on this site (see
 * docs/website/20_TECHNICAL_UI_LANGUAGE.md):
 *  - "record": label/value metadata rows (an audit, a CAPA, a document rev).
 *  - "trace": a directional chain of connected entities (a traceability path).
 *  - "narrative": a query→result monospace passage (the QualiBOT block).
 * Every field is real product data supplied by the caller — this component
 * has no default/sample content of its own, so it can't silently drift into
 * decorative numbers.
 */

interface StatusIndicatorProps {
  label: string;
  tone?: 'live' | 'verified' | 'development' | 'planned';
  /** For use on a dark surface (e.g. inside ExplorerFrame's chrome bar) —
      body-grey text fails contrast there; caught by a real Lighthouse run. */
  light?: boolean;
}

export function StatusIndicator({ label, tone = 'verified', light }: StatusIndicatorProps) {
  // A deep-teal/gold dot barely shows on a dark-navy surface — swap to the
  // lighter teal already used for other text on dark navy elsewhere on the
  // site, rather than reach for gold (reserved for hero/CTA use only).
  const dotOverride = light && (tone === 'verified' || tone === 'live') ? { background: 'var(--qt-light-teal)' } : undefined;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`qt-status-dot qt-status-dot--${tone}`} style={dotOverride} aria-hidden="true" />
      <span className="qt-technical-label" style={{ color: light ? 'var(--qt-mint-light)' : 'var(--qt-body-grey)' }}>{label}</span>
    </span>
  );
}

interface TechnicalBlockHeaderProps {
  eyebrow: string;
  status?: ReactNode;
}

function Header({ eyebrow, status }: TechnicalBlockHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: 'var(--qt-border-grey)' }}>
      <span className="qt-technical-eyebrow">{eyebrow}</span>
      {status}
    </div>
  );
}

interface RecordField {
  label: string;
  value: string;
}

interface TechnicalRecordBlockProps {
  eyebrow: string;
  status?: ReactNode;
  fields: RecordField[];
  dark?: boolean;
  className?: string;
}

/** Label/value metadata rows — e.g. AUDIT / AUD-2026-014, STATUS, FINDINGS. */
export function TechnicalRecordBlock({ eyebrow, status, fields, dark, className = '' }: TechnicalRecordBlockProps) {
  return (
    <div
      className={`qt-card overflow-hidden ${className}`}
      style={dark ? { background: 'var(--qt-dark-navy)', boxShadow: 'none' } : undefined}
    >
      <Header eyebrow={eyebrow} status={status} />
      <dl className="px-4 py-3">
        {fields.map((f) => (
          <div key={f.label} className="flex items-baseline justify-between gap-4 py-1.5">
            <dt className="qt-technical-label" style={dark ? { color: 'rgba(255,255,255,.6)' } : undefined}>{f.label}</dt>
            <dd className="qt-technical-value text-right" style={dark ? { color: '#FFFFFF' } : undefined}>{f.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

interface TraceStep<T extends string> {
  id: T;
  label: string;
  relation?: string;
}

interface TraceBlockProps<T extends string> {
  eyebrow: string;
  steps: Array<TraceStep<T>>;
  activeId?: T | null;
  onStepFocus?: (id: T | null) => void;
  className?: string;
}

/** A directional traceability path — Standard → SOP → Process → Evidence → Audit → CAPA. */
export function TraceBlock<T extends string>({ eyebrow, steps, activeId, onStepFocus, className = '' }: TraceBlockProps<T>) {
  return (
    <div className={`qt-card p-4 ${className}`}>
      <p className="qt-technical-eyebrow mb-3">{eyebrow}</p>
      <ol className="space-y-0">
        {steps.map((step, i) => {
          const isActive = activeId === step.id;
          return (
            <li key={step.id}>
              {i > 0 && step.relation && (
                <div className="qt-technical-label pl-[3px]">
                  ↓ {step.relation}
                </div>
              )}
              <button
                type="button"
                className="qt-focus block w-full rounded px-1.5 py-0.5 text-left transition-colors"
                style={{ background: isActive ? 'var(--qt-teal-tint)' : 'transparent' }}
                onMouseEnter={() => onStepFocus?.(step.id)}
                onFocus={() => onStepFocus?.(step.id)}
                onMouseLeave={() => onStepFocus?.(null)}
                onBlur={() => onStepFocus?.(null)}
                data-testid={`trace-step-${step.id}`}
              >
                <span className="qt-technical-id">{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

interface ExplorerFrameProps {
  title: string;
  status?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

/**
 * An IDE/inspector-style frame — dark technical-surface chrome bar (title +
 * live status) around a body, with an optional condensed footer row. Used
 * to give an existing real interactive section (e.g. the Quality
 * Intelligence Graph + trace path) one unified "engineered system" frame
 * instead of two separate cards sitting side by side.
 */
export function ExplorerFrame({ title, status, footer, children }: ExplorerFrameProps) {
  return (
    <div className="overflow-hidden rounded-lg" style={{ boxShadow: 'inset 0 0 0 1px var(--qt-border-grey)' }}>
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5" style={{ background: 'var(--qt-dark-navy)' }}>
        <span className="qt-technical-eyebrow" style={{ color: '#FFFFFF' }}>{title}</span>
        {status}
      </div>
      <div className="p-5 sm:p-6" style={{ background: 'var(--qt-clinical-white)' }}>
        {children}
      </div>
      {footer && (
        <div className="overflow-x-auto border-t px-5 py-3 sm:px-6" style={{ borderColor: 'var(--qt-border-grey)', background: 'var(--qt-lab-grey)' }}>
          {footer}
        </div>
      )}
    </div>
  );
}

interface NarrativeBlockProps {
  eyebrow: string;
  status?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** A query→result monospace passage — the QualiBOT block's shape. */
export function NarrativeBlock({ eyebrow, status, children, className = '' }: NarrativeBlockProps) {
  return (
    <div className={`qt-card overflow-hidden ${className}`}>
      <Header eyebrow={eyebrow} status={status} />
      <div className="px-4 py-3 font-mono-ui text-[12px] leading-6" style={{ color: 'var(--qt-near-black)' }}>
        {children}
      </div>
    </div>
  );
}
