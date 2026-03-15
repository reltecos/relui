/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Spinner — yukleme gostergesi (Dual API).
 * Spinner — loading indicator (Dual API).
 *
 * Props-based: `<Spinner label="Loading..." />`
 * Compound:    `<Spinner><Spinner.Label>Loading...</Spinner.Label></Spinner>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import {
  spinnerRootRecipe,
  spinnerSvgStyle,
  spinnerLabelStyle,
} from './spinner.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/**
 * Spinner slot isimleri / Spinner slot names.
 */
export type SpinnerSlot = 'root' | 'svg' | 'label';

// ── Types ─────────────────────────────────────────────

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// ── Context (Compound API) ──────────────────────────

interface SpinnerContextValue {
  size: SpinnerSize;
  classNames: ClassNames<SpinnerSlot> | undefined;
  styles: Styles<SpinnerSlot> | undefined;
}

const SpinnerContext = createContext<SpinnerContextValue | null>(null);

function useSpinnerContext(): SpinnerContextValue {
  const ctx = useContext(SpinnerContext);
  if (!ctx) throw new Error('Spinner compound sub-components must be used within <Spinner>.');
  return ctx;
}

// ── Compound: Spinner.Label ─────────────────────────

/** Spinner.Label props */
export interface SpinnerLabelProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const SpinnerLabel = forwardRef<HTMLSpanElement, SpinnerLabelProps>(
  function SpinnerLabel(props, ref) {
    const { children, className } = props;
    const ctx = useSpinnerContext();
    const slot = getSlotProps('label', spinnerLabelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span ref={ref} className={cls} style={slot.style} data-testid="spinner-label">
        {children}
      </span>
    );
  },
);

// ── Component Props ──────────────────────────────────

export interface SpinnerComponentProps extends SlotStyleProps<SpinnerSlot> {
  /** Boyut / Size */
  size?: SpinnerSize;

  /** Renk / Color (stroke color) */
  color?: string;

  /** Kalinlik / Thickness (stroke width) */
  thickness?: number;

  /** Props-based: etiket / Label */
  label?: ReactNode;

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;

  /** Ek className / Additional className */
  className?: string;

  /** Inline style / Inline style */
  style?: React.CSSProperties;

  /** id */
  id?: string;
}

// ── Component ────────────────────────────────────────

const SpinnerBase = forwardRef<HTMLDivElement, SpinnerComponentProps>(
  function Spinner(props, ref) {
    const {
      size = 'md',
      color = 'var(--rel-color-primary, #3b82f6)',
      thickness = 3,
      label,
      children,
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

    const ctxValue: SpinnerContextValue = { size, classNames, styles };

    // ── Compound API ──
    if (children) {
      return (
        <SpinnerContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={combinedRootClassName}
            style={combinedRootStyle}
            id={id}
            role="status"
            aria-label="Loading"
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
            {children}
          </div>
        </SpinnerContext.Provider>
      );
    }

    // ── Props-based API ──
    return (
      <SpinnerContext.Provider value={ctxValue}>
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
      </SpinnerContext.Provider>
    );
  },
);

/**
 * Spinner bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Spinner />
 * <Spinner size="lg" color="#3b82f6" label="Loading..." />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Spinner size="lg">
 *   <Spinner.Label>Yukleniyor...</Spinner.Label>
 * </Spinner>
 * ```
 */
export const Spinner = Object.assign(SpinnerBase, {
  Label: SpinnerLabel,
});
