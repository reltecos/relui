/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * NumberFormatter — sayi formatlama bilesen (Dual API).
 * NumberFormatter — number formatting component (Dual API).
 *
 * Props-based: `<NumberFormatter value={1234.5} locale="tr-TR" currency="TRY" />`
 * Compound:    `<NumberFormatter><NumberFormatter.Value>1234</NumberFormatter.Value></NumberFormatter>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useMemo, type ReactNode } from 'react';
import { rootStyle, valueStyle, prefixStyle, suffixStyle } from './number-formatter.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** NumberFormatter slot isimleri / NumberFormatter slot names. */
export type NumberFormatterSlot = 'root' | 'value' | 'prefix' | 'suffix';

// ── Types ─────────────────────────────────────────────

/** Format stili / Format style */
export type NumberFormatStyle = 'decimal' | 'currency' | 'percent' | 'unit';

/** Notation tipi / Notation type */
export type NumberFormatNotation = 'standard' | 'scientific' | 'engineering' | 'compact';

// ── Context (Compound API) ──────────────────────────

interface NumberFormatterContextValue {
  locale: string;
  formatStyle: NumberFormatStyle;
  currency: string | undefined;
  notation: NumberFormatNotation;
  minimumFractionDigits: number | undefined;
  maximumFractionDigits: number | undefined;
  unit: string | undefined;
  classNames: ClassNames<NumberFormatterSlot> | undefined;
  styles: Styles<NumberFormatterSlot> | undefined;
}

const NumberFormatterContext = createContext<NumberFormatterContextValue | null>(null);

function useNumberFormatterContext(): NumberFormatterContextValue {
  const ctx = useContext(NumberFormatterContext);
  if (!ctx) throw new Error('NumberFormatter compound sub-components must be used within <NumberFormatter>.');
  return ctx;
}

// ── Helper ────────────────────────────────────────────

function formatNumber(
  value: number,
  locale: string,
  formatStyle: NumberFormatStyle,
  currency: string | undefined,
  notation: NumberFormatNotation,
  minimumFractionDigits: number | undefined,
  maximumFractionDigits: number | undefined,
  unit: string | undefined,
): string {
  const options: Intl.NumberFormatOptions = {
    style: formatStyle,
    notation,
    minimumFractionDigits,
    maximumFractionDigits,
  };
  if (formatStyle === 'currency' && currency) {
    options.currency = currency;
  }
  if (formatStyle === 'unit' && unit) {
    options.unit = unit;
  }
  return new Intl.NumberFormat(locale, options).format(value);
}

// ── Compound: NumberFormatter.Value ──────────────────

/** NumberFormatter.Value props */
export interface NumberFormatterValueProps {
  /** Formatlanacak sayi veya metin / Number to format or text content */
  children: number | string | ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const NumberFormatterValue = forwardRef<HTMLSpanElement, NumberFormatterValueProps>(
  function NumberFormatterValue(props, ref) {
    const { children, className } = props;
    const ctx = useNumberFormatterContext();
    const slot = getSlotProps('value', valueStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const formatted = useMemo(() => {
      if (typeof children === 'number') {
        return formatNumber(
          children, ctx.locale, ctx.formatStyle, ctx.currency,
          ctx.notation, ctx.minimumFractionDigits, ctx.maximumFractionDigits, ctx.unit,
        );
      }
      if (typeof children === 'string') {
        const num = Number(children);
        if (!Number.isNaN(num)) {
          return formatNumber(
            num, ctx.locale, ctx.formatStyle, ctx.currency,
            ctx.notation, ctx.minimumFractionDigits, ctx.maximumFractionDigits, ctx.unit,
          );
        }
      }
      return children;
    }, [children, ctx.locale, ctx.formatStyle, ctx.currency, ctx.notation, ctx.minimumFractionDigits, ctx.maximumFractionDigits, ctx.unit]);

    return (
      <span ref={ref} className={cls} style={slot.style} data-testid="number-formatter-value">
        {formatted}
      </span>
    );
  },
);

// ── Compound: NumberFormatter.Prefix ─────────────────

/** NumberFormatter.Prefix props */
export interface NumberFormatterPrefixProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const NumberFormatterPrefix = forwardRef<HTMLSpanElement, NumberFormatterPrefixProps>(
  function NumberFormatterPrefix(props, ref) {
    const { children, className } = props;
    const ctx = useNumberFormatterContext();
    const slot = getSlotProps('prefix', prefixStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span ref={ref} className={cls} style={slot.style} data-testid="number-formatter-prefix">
        {children}
      </span>
    );
  },
);

// ── Compound: NumberFormatter.Suffix ─────────────────

/** NumberFormatter.Suffix props */
export interface NumberFormatterSuffixProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const NumberFormatterSuffix = forwardRef<HTMLSpanElement, NumberFormatterSuffixProps>(
  function NumberFormatterSuffix(props, ref) {
    const { children, className } = props;
    const ctx = useNumberFormatterContext();
    const slot = getSlotProps('suffix', suffixStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span ref={ref} className={cls} style={slot.style} data-testid="number-formatter-suffix">
        {children}
      </span>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface NumberFormatterComponentProps extends SlotStyleProps<NumberFormatterSlot> {
  /** Props-based: formatlanacak sayi / Number to format */
  value?: number;
  /** Locale / Locale */
  locale?: string;
  /** Format stili / Format style (React style prop ile cakismamasi icin formatStyle) */
  formatStyle?: NumberFormatStyle;
  /** Para birimi (formatStyle="currency" icin) / Currency code */
  currency?: string;
  /** Notation / Notation */
  notation?: NumberFormatNotation;
  /** Minimum kesir basamagi / Minimum fraction digits */
  minimumFractionDigits?: number;
  /** Maksimum kesir basamagi / Maximum fraction digits */
  maximumFractionDigits?: number;
  /** Birim (formatStyle="unit" icin) / Unit for unit formatting */
  unit?: string;
  /** Opsiyonel on ek / Optional prefix */
  prefix?: ReactNode;
  /** Opsiyonel son ek / Optional suffix */
  suffix?: ReactNode;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const NumberFormatterBase = forwardRef<HTMLSpanElement, NumberFormatterComponentProps>(
  function NumberFormatter(props, ref) {
    const {
      value,
      locale = 'en-US',
      formatStyle = 'decimal',
      currency,
      notation = 'standard',
      minimumFractionDigits,
      maximumFractionDigits,
      unit,
      prefix,
      suffix,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    // ── Slots ──
    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const ctxValue: NumberFormatterContextValue = {
      locale, formatStyle, currency, notation,
      minimumFractionDigits, maximumFractionDigits, unit,
      classNames, styles,
    };

    // ── Compound API ──
    if (children) {
      return (
        <NumberFormatterContext.Provider value={ctxValue}>
          <span
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="number-formatter-root"
          >
            {children}
          </span>
        </NumberFormatterContext.Provider>
      );
    }

    // ── Props-based API ──
    const prefixSlot = getSlotProps('prefix', prefixStyle, classNames, styles);
    const valueSlot = getSlotProps('value', valueStyle, classNames, styles);
    const suffixSlot = getSlotProps('suffix', suffixStyle, classNames, styles);

    const formatted = useMemo(() => {
      if (value === undefined) return '';
      return formatNumber(
        value, locale, formatStyle, currency,
        notation, minimumFractionDigits, maximumFractionDigits, unit,
      );
    }, [value, locale, formatStyle, currency, notation, minimumFractionDigits, maximumFractionDigits, unit]);

    return (
      <span
        ref={ref}
        className={rootClassName}
        style={{ ...rootSlot.style, ...styleProp }}
        data-testid="number-formatter-root"
      >
        {prefix !== undefined && (
          <span
            className={prefixSlot.className}
            style={prefixSlot.style}
            data-testid="number-formatter-prefix"
          >
            {prefix}
          </span>
        )}
        <span
          className={valueSlot.className}
          style={valueSlot.style}
          data-testid="number-formatter-value"
        >
          {formatted}
        </span>
        {suffix !== undefined && (
          <span
            className={suffixSlot.className}
            style={suffixSlot.style}
            data-testid="number-formatter-suffix"
          >
            {suffix}
          </span>
        )}
      </span>
    );
  },
);

/**
 * NumberFormatter bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <NumberFormatter value={1234.5} locale="tr-TR" formatStyle="currency" currency="TRY" />
 * ```
 *
 * @example Compound
 * ```tsx
 * <NumberFormatter locale="tr-TR">
 *   <NumberFormatter.Prefix>Toplam: </NumberFormatter.Prefix>
 *   <NumberFormatter.Value>{1234.5}</NumberFormatter.Value>
 *   <NumberFormatter.Suffix> TL</NumberFormatter.Suffix>
 * </NumberFormatter>
 * ```
 */
export const NumberFormatter = Object.assign(NumberFormatterBase, {
  Value: NumberFormatterValue,
  Prefix: NumberFormatterPrefix,
  Suffix: NumberFormatterSuffix,
});
