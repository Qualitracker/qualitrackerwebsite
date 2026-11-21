import { navigateTabs } from '@/lib/tab-keyboard';
/**
 * A tab-like state switcher styled as an engineered control, not a default
 * browser/component-library tab strip: mono uppercase labels, a filled
 * active segment on a hairline-bordered track. Used wherever the site
 * switches between two or more real, already-existing states — never
 * built with empty panels for content that doesn't exist yet.
 */
interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string }>;
  'aria-label': string;
}

export function SegmentedControl<T extends string>({ value, onChange, options, ...rest }: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      onKeyDown={navigateTabs}
      aria-label={rest['aria-label']}
      className="inline-flex rounded-md p-1"
      style={{ background: 'var(--qt-lab-grey)', boxShadow: 'inset 0 0 0 1px var(--qt-border-grey)' }}
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(opt.value)}
            className="qt-button qt-focus rounded px-3 py-1.5 font-mono-ui text-[10px] font-bold uppercase tracking-[.08em]"
            style={{
              background: isActive ? 'var(--qt-clinical-white)' : 'transparent',
              color: isActive ? 'var(--qt-deep-teal)' : 'var(--qt-body-grey)',
              boxShadow: isActive ? '0 1px 2px rgba(28,40,51,.1)' : 'none',
            }}
            data-testid={`segment-${opt.value}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
