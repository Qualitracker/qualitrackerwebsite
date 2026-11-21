import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { Link } from 'wouter';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'gold' | 'ghost' | 'reversed';

const VARIANT_STYLE: Record<Variant, { bg: string; color: string; border?: string; hoverBg: string }> = {
  primary: { bg: 'var(--qt-deep-teal)', color: '#FFFFFF', hoverBg: 'var(--qt-teal-hover)' },
  secondary: { bg: 'transparent', color: 'var(--qt-deep-teal)', border: '1.5px solid var(--qt-deep-teal)', hoverBg: 'var(--qt-teal-tint)' },
  gold: { bg: 'var(--qt-quality-gold)', color: 'var(--qt-dark-navy)', hoverBg: 'var(--qt-gold-hover)' },
  ghost: { bg: 'transparent', color: 'var(--qt-deep-teal)', hoverBg: 'var(--qt-lab-grey)' },
  reversed: { bg: 'transparent', color: '#FFFFFF', border: '1.5px solid rgba(255,255,255,.4)', hoverBg: 'rgba(255,255,255,.12)' },
};

type ButtonProps = (
  | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
  | ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
) & {
  variant?: Variant;
  size?: 'default' | 'sm';
  fullWidth?: boolean;
  /** Adds a directional-nudge icon (translates ~3px on hover/focus, the
      brand's one allowed position-only micro-interaction). "arrow" for an
      internal/exploratory link, "external" for a link that leaves the site. */
  arrow?: 'arrow' | 'external';
};

/**
 * The brand's one Button: 44px (36px compact), 4px radius, Inter SemiBold.
 * Hover is a colour shift only — never scale/translate, except the optional
 * `arrow` icon, which nudges position only (no bounce/scale), per the
 * technical UI language's restrained button micro-interaction rule.
 * `gold` is reserved for the hero and waitlist/talk-to-team CTAs; never a
 * general button colour.
 */
export function Button({ variant = 'primary', size = 'default', fullWidth, arrow, className = '', style, children, ...rest }: ButtonProps) {
  const v = VARIANT_STYLE[variant];
  const sharedStyle = {
    background: v.bg,
    color: v.color,
    border: v.border ?? '1.5px solid transparent',
    height: size === 'sm' ? 36 : 44,
    padding: size === 'sm' ? '0 16px' : '0 22px',
    borderRadius: 4,
    width: fullWidth ? '100%' : undefined,
    ...style,
  };
  const sharedClass = `qt-button qt-focus inline-flex items-center justify-center gap-2 font-sans text-sm font-semibold whitespace-nowrap ${arrow ? 'qt-arrow-link' : ''} ${className}`;
  const arrowIcon = arrow === 'external' ? <ArrowUpRight size={15} /> : arrow === 'arrow' ? <ArrowRight size={15} /> : null;

  if (rest.href !== undefined) {
    const { href, ...linkProps } = rest;
    const isExternal = href.startsWith('http') || href.startsWith('mailto:');
    if (isExternal) {
      return (
        <a href={href} className={sharedClass} style={sharedStyle} onMouseEnter={(e) => (e.currentTarget.style.background = v.hoverBg)} onMouseLeave={(e) => (e.currentTarget.style.background = v.bg)} {...linkProps}>
          {children}{arrowIcon}
        </a>
      );
    }
    return (
      <Link href={href} className={sharedClass} style={sharedStyle} onMouseEnter={(e) => (e.currentTarget.style.background = v.hoverBg)} onMouseLeave={(e) => (e.currentTarget.style.background = v.bg)} {...linkProps}>
        {children}{arrowIcon}
      </Link>
    );
  }

  return (
    <button
      className={sharedClass}
      style={{ ...sharedStyle, cursor: rest.disabled ? 'not-allowed' : 'pointer', opacity: rest.disabled ? 0.4 : 1 }}
      onMouseEnter={(e) => !rest.disabled && (e.currentTarget.style.background = v.hoverBg)}
      onMouseLeave={(e) => !rest.disabled && (e.currentTarget.style.background = v.bg)}
      {...rest}
    >
      {children}{arrowIcon}
    </button>
  );
}
