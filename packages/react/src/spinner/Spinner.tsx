/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Spinner — yukleme gostergesi.
 * Spinner — loading indicator.
 *
 * SVG tabanli animasyonlu yukleme gostergesi.
 *
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';
import {
  spinnerRootRecipe,
  spinnerSvgStyle,
  spinnerLabelStyle,
} from './spinner.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/**
 * Spinner slot isimleri / Spinner slot names.
 */
export type SpinnerSlot = 'root' | 'svg' | 'label';

// ── Types ─────────────────────────────────────────────

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// ── Component Props ──────────────────────────────────

export interface SpinnerComponentProps extends SlotStyleProps<SpinnerSlot> {
  /** Boyut / Size */
  size?: SpinnerSize;

  /** Renk / Color (stroke color) */
  color?: string;

  /** Kalinlik / Thickness (stroke width) */
  thickness?: number;

  /** Etiket / Label */
  label?: ReactNode;

  /** Ek className / Additional className */
  className?: string;

  /** Inline style / Inline style */
  style?: React.CSSProperties;

  /** id */
  id?: string;
}

// ── Component ────────────────────────────────────────

/**
 * Spinner bilesen — yukleme gostergesi.
 * Spinner component — loading indicator.
 *
 * @example
 * ```tsx
 * <Spinner />
 * <Spinner size="lg" color="#3b82f6" label="Loading..." />
 * ```
 */
export const Spinner = forwardRef<HTMLDivElement, SpinnerComponentProps>(
  function Spinner(props, ref) {
    const {
      size = 'md',
      color = 'var(--rel-color-primary, #3b82f6)',
      thickness = 3,
      label,
      className,
      style: styleProp,
      classNames,
      styles,
      id,
    } = props;

    // ── Slots ──
    const rootClass = spinnerRootRecipe({ size });
    const rootSlot = getSlotProps('root', rootClass, classNames, styles);
    const combinedRootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;
    const combinedRootStyle = styleProp
      ? { ...rootSlot.style, ...styleProp }
      : rootSlot.style;

    const svgSlot = getSlotProps('svg', spinnerSvgStyle, classNames, styles);
    const labelSlot = getSlotProps('label', spinnerLabelStyle, classNames, styles);

    return (
      <div
        ref={ref}
        className={combinedRootClassName}
        style={combinedRootStyle}
        id={id}
        role="status"
        aria-label={typeof label === 'string' ? label : 'Loading'}
        data-testid="spinner"
      >
        <svg
          className={svgSlot.className}
          style={svgSlot.style}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke={color}
            strokeWidth={thickness}
            opacity={0.2}
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke={color}
            strokeWidth={thickness}
            strokeLinecap="round"
          />
        </svg>

        {label && (
          <span className={labelSlot.className} style={labelSlot.style}>
            {label}
          </span>
        )}
      </div>
    );
  },
);
