/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DigitalGauge — dijital gosterge bilesen (Dual API).
 * DigitalGauge — digital gauge component with 7-segment display style (Dual API).
 *
 * Props-based: `<DigitalGauge value={42} label="Sicaklik" unit="C" />`
 * Compound:    `<DigitalGauge value={42}><DigitalGauge.Display /><DigitalGauge.Label>Sicaklik</DigitalGauge.Label></DigitalGauge>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import {
  rootStyle,
  sizeStyles,
  displayStyle,
  displaySizeStyles,
  digitStyle,
  labelStyle,
  unitStyle,
  minMaxStyle,
} from './digital-gauge.css';
import { useDigitalGauge } from './useDigitalGauge';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** DigitalGauge slot isimleri / DigitalGauge slot names. */
export type DigitalGaugeSlot = 'root' | 'display' | 'digit' | 'label' | 'unit' | 'minMax';

// ── Types ─────────────────────────────────────────────

/** DigitalGauge boyutu / DigitalGauge size */
export type DigitalGaugeSize = 'sm' | 'md' | 'lg';

// ── Context (Compound API) ──────────────────────────

interface DigitalGaugeContextValue {
  size: DigitalGaugeSize;
  value: number;
  formattedValue: string;
  digits: string[];
  min: number;
  max: number;
  precision: number;
  classNames: ClassNames<DigitalGaugeSlot> | undefined;
  styles: Styles<DigitalGaugeSlot> | undefined;
}

const DigitalGaugeContext = createContext<DigitalGaugeContextValue | null>(null);

function useDigitalGaugeContext(): DigitalGaugeContextValue {
  const ctx = useContext(DigitalGaugeContext);
  if (!ctx) throw new Error('DigitalGauge compound sub-components must be used within <DigitalGauge>.');
  return ctx;
}

// ── Compound: DigitalGauge.Display ──────────────────

/** DigitalGauge.Display props */
export interface DigitalGaugeDisplayProps {
  /** Icerik override / Content override (varsayilan: otomatik digit render) */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const DigitalGaugeDisplay = forwardRef<HTMLDivElement, DigitalGaugeDisplayProps>(
  function DigitalGaugeDisplay(props, ref) {
    const { children, className } = props;
    const ctx = useDigitalGaugeContext();
    const slot = getSlotProps(
      'display',
      `${displayStyle} ${displaySizeStyles[ctx.size]}`,
      ctx.classNames,
      ctx.styles,
    );
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="digital-gauge-display">
        {children ?? ctx.digits.map((d, i) => (
          <DigitalGaugeDigitInternal key={i} char={d} classNames={ctx.classNames} styles={ctx.styles} />
        ))}
      </div>
    );
  },
);

// ── Compound: DigitalGauge.Label ────────────────────

/** DigitalGauge.Label props */
export interface DigitalGaugeLabelProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const DigitalGaugeLabel = forwardRef<HTMLParagraphElement, DigitalGaugeLabelProps>(
  function DigitalGaugeLabel(props, ref) {
    const { children, className } = props;
    const ctx = useDigitalGaugeContext();
    const slot = getSlotProps('label', labelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <p ref={ref} className={cls} style={slot.style} data-testid="digital-gauge-label">
        {children}
      </p>
    );
  },
);

// ── Compound: DigitalGauge.Unit ─────────────────────

/** DigitalGauge.Unit props */
export interface DigitalGaugeUnitProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const DigitalGaugeUnit = forwardRef<HTMLSpanElement, DigitalGaugeUnitProps>(
  function DigitalGaugeUnit(props, ref) {
    const { children, className } = props;
    const ctx = useDigitalGaugeContext();
    const slot = getSlotProps('unit', unitStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span ref={ref} className={cls} style={slot.style} data-testid="digital-gauge-unit">
        {children}
      </span>
    );
  },
);

// ── Compound: DigitalGauge.MinMax ───────────────────

/** DigitalGauge.MinMax props */
export interface DigitalGaugeMinMaxProps {
  /** Icerik override / Content override */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const DigitalGaugeMinMax = forwardRef<HTMLDivElement, DigitalGaugeMinMaxProps>(
  function DigitalGaugeMinMax(props, ref) {
    const { children, className } = props;
    const ctx = useDigitalGaugeContext();
    const slot = getSlotProps('minMax', minMaxStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const minLabel = ctx.min === -Infinity ? '-\u221E' : ctx.min.toFixed(ctx.precision);
    const maxLabel = ctx.max === Infinity ? '+\u221E' : ctx.max.toFixed(ctx.precision);

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="digital-gauge-minmax">
        {children ?? (
          <>
            <span>Min: {minLabel}</span>
            <span>Max: {maxLabel}</span>
          </>
        )}
      </div>
    );
  },
);

// ── Internal Digit ──────────────────────────────────

function DigitalGaugeDigitInternal(props: {
  char: string;
  classNames: ClassNames<DigitalGaugeSlot> | undefined;
  styles: Styles<DigitalGaugeSlot> | undefined;
}) {
  const slot = getSlotProps('digit', digitStyle, props.classNames, props.styles);
  return (
    <span className={slot.className} style={slot.style} data-testid="digital-gauge-digit">
      {props.char}
    </span>
  );
}

// ── Component Props ───────────────────────────────────

export interface DigitalGaugeComponentProps extends SlotStyleProps<DigitalGaugeSlot> {
  /** Gosterge degeri / Gauge value */
  value?: number;
  /** Etiket / Label */
  label?: ReactNode;
  /** Birim / Unit */
  unit?: ReactNode;
  /** Minimum sinir / Minimum bound */
  min?: number;
  /** Maksimum sinir / Maximum bound */
  max?: number;
  /** Ondalik basamak / Precision */
  precision?: number;
  /** Min/Max gosterilsin mi / Show min/max */
  showMinMax?: boolean;
  /** Boyut / Size */
  size?: DigitalGaugeSize;
  /** Deger degisince / On value change */
  onChange?: (value: number) => void;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const DigitalGaugeBase = forwardRef<HTMLDivElement, DigitalGaugeComponentProps>(
  function DigitalGauge(props, ref) {
    const {
      value: valueProp,
      label,
      unit,
      min,
      max,
      precision,
      showMinMax = false,
      size = 'md',
      onChange,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const gauge = useDigitalGauge({
      value: valueProp,
      min,
      max,
      precision,
      onChange,
    });

    // ── Slots ──
    const rootSlot = getSlotProps('root', `${rootStyle} ${sizeStyles[size]}`, classNames, styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const ctxValue: DigitalGaugeContextValue = {
      size,
      value: gauge.value,
      formattedValue: gauge.formattedValue,
      digits: gauge.digits,
      min: gauge.min,
      max: gauge.max,
      precision: gauge.precision,
      classNames,
      styles,
    };

    // ── Compound API ──
    if (children) {
      return (
        <DigitalGaugeContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="digital-gauge-root"
            data-size={size}
            role="meter"
            aria-valuenow={gauge.value}
            aria-valuemin={gauge.min === -Infinity ? undefined : gauge.min}
            aria-valuemax={gauge.max === Infinity ? undefined : gauge.max}
            aria-label={typeof label === 'string' ? label : undefined}
          >
            {children}
          </div>
        </DigitalGaugeContext.Provider>
      );
    }

    // ── Props-based API ──
    const displaySlot = getSlotProps(
      'display',
      `${displayStyle} ${displaySizeStyles[size]}`,
      classNames,
      styles,
    );
    const labelSlot = getSlotProps('label', labelStyle, classNames, styles);
    const unitSlot = getSlotProps('unit', unitStyle, classNames, styles);
    const minMaxSlot = getSlotProps('minMax', minMaxStyle, classNames, styles);

    const minLabel = gauge.min === -Infinity ? '-\u221E' : gauge.min.toFixed(gauge.precision);
    const maxLabel = gauge.max === Infinity ? '+\u221E' : gauge.max.toFixed(gauge.precision);

    return (
      <div
        ref={ref}
        className={rootClassName}
        style={{ ...rootSlot.style, ...styleProp }}
        data-testid="digital-gauge-root"
        data-size={size}
        role="meter"
        aria-valuenow={gauge.value}
        aria-valuemin={gauge.min === -Infinity ? undefined : gauge.min}
        aria-valuemax={gauge.max === Infinity ? undefined : gauge.max}
        aria-label={typeof label === 'string' ? label : undefined}
      >
        <div
          className={displaySlot.className}
          style={displaySlot.style}
          data-testid="digital-gauge-display"
        >
          {gauge.digits.map((d, i) => (
            <DigitalGaugeDigitInternal key={i} char={d} classNames={classNames} styles={styles} />
          ))}
          {unit !== undefined && (
            <span
              className={unitSlot.className}
              style={unitSlot.style}
              data-testid="digital-gauge-unit"
            >
              {unit}
            </span>
          )}
        </div>

        {label !== undefined && (
          <p
            className={labelSlot.className}
            style={labelSlot.style}
            data-testid="digital-gauge-label"
          >
            {label}
          </p>
        )}

        {showMinMax && (
          <div
            className={minMaxSlot.className}
            style={minMaxSlot.style}
            data-testid="digital-gauge-minmax"
          >
            <span>Min: {minLabel}</span>
            <span>Max: {maxLabel}</span>
          </div>
        )}
      </div>
    );
  },
);

/**
 * DigitalGauge bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <DigitalGauge value={42} label="Sicaklik" unit="C" min={0} max={100} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <DigitalGauge value={42} min={0} max={100}>
 *   <DigitalGauge.Display />
 *   <DigitalGauge.Label>Sicaklik</DigitalGauge.Label>
 *   <DigitalGauge.MinMax />
 * </DigitalGauge>
 * ```
 */
export const DigitalGauge = Object.assign(DigitalGaugeBase, {
  Display: DigitalGaugeDisplay,
  Label: DigitalGaugeLabel,
  Unit: DigitalGaugeUnit,
  MinMax: DigitalGaugeMinMax,
});
