import type { ReactNode } from 'react';

type TheatreVariant = 'application' | 'intelligence' | 'assistant' | 'workflow';

interface ProductTheatreProps {
  children: ReactNode;
  label: string;
  status: string;
  caption: string;
  detail: string;
  markers?: string[];
  variant?: TheatreVariant;
  className?: string;
}

/**
 * Marketing-stage chrome for real product UI. The child is never restyled or
 * reauthored: all depth, labels and motion live outside the product surface so
 * Figma-authored screens keep their exact hierarchy and interaction model.
 */
export function ProductTheatre({
  children,
  label,
  status,
  caption,
  detail,
  markers = [],
  variant = 'application',
  className = '',
}: ProductTheatreProps) {
  return (
    <figure className={`qt-product-theatre qt-product-theatre--${variant} ${className}`} data-theatre={variant}>
      <div className="qt-product-theatre__grid" aria-hidden="true" />
      <div className="qt-product-theatre__plate qt-product-theatre__plate--one" aria-hidden="true" />
      <div className="qt-product-theatre__plate qt-product-theatre__plate--two" aria-hidden="true" />

      <div className="qt-product-theatre__chrome">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="qt-product-theatre__lights" aria-hidden="true"><i /><i /><i /></span>
          <span className="qt-product-theatre__label">{label}</span>
        </div>
        <span className="qt-product-theatre__status"><i aria-hidden="true" />{status}</span>
      </div>

      <div className="qt-product-theatre__surface">
        {children}
      </div>

      {markers.length > 0 && (
        <div className="qt-product-theatre__markers" aria-hidden="true">
          {markers.slice(0, 3).map((marker, index) => <span key={marker} data-marker={index + 1}>{marker}</span>)}
        </div>
      )}

      <figcaption className="qt-product-theatre__caption">
        <span>{caption}</span>
        <span>{detail}</span>
      </figcaption>
    </figure>
  );
}
