/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DateFormatter — tarih formatlama bilesen (Dual API).
 * DateFormatter — date formatting component (Dual API).
 *
 * Props-based: `<DateFormatter value={new Date()} locale="tr-TR" dateStyle="long" />`
 * Compound:    `<DateFormatter><DateFormatter.Value>{new Date()}</DateFormatter.Value></DateFormatter>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useMemo, type ReactNode } from 'react';
import { rootStyle, valueStyle, prefixStyle, suffixStyle } from './date-formatter.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** DateFormatter slot isimleri / DateFormatter slot names. */
export type DateFormatterSlot = 'root' | 'value' | 'prefix' | 'suffix';

// ── Types ─────────────────────────────────────────────

/** Tarih stili / Date style */
export type DateFormatDateStyle = 'full' | 'long' | 'medium' | 'short';

/** Saat stili / Time style */
export type DateFormatTimeStyle = 'full' | 'long' | 'medium' | 'short';

/** Tarih girdi tipi / Date input type */
export type DateInput = Date | number | string;

// ── Context (Compound API) ──────────────────────────

interface DateFormatterContextValue {
  locale: string;
  dateStyle: DateFormatDateStyle | undefined;
  timeStyle: DateFormatTimeStyle | undefined;
  year: Intl.DateTimeFormatOptions['year'] | undefined;
  month: Intl.DateTimeFormatOptions['month'] | undefined;
  day: Intl.DateTimeFormatOptions['day'] | undefined;
  hour: Intl.DateTimeFormatOptions['hour'] | undefined;
  minute: Intl.DateTimeFormatOptions['minute'] | undefined;
  second: Intl.DateTimeFormatOptions['second'] | undefined;
  classNames: ClassNames<DateFormatterSlot> | undefined;
  styles: Styles<DateFormatterSlot> | undefined;
}

const DateFormatterContext = createContext<DateFormatterContextValue | null>(null);

function useDateFormatterContext(): DateFormatterContextValue {
  const ctx = useContext(DateFormatterContext);
  if (!ctx) throw new Error('DateFormatter compound sub-components must be used within <DateFormatter>.');
  return ctx;
}

// ── Helper ────────────────────────────────────────────

function toDate(input: DateInput): Date {
  if (input instanceof Date) return input;
  return new Date(input);
}

function formatDate(
  value: DateInput,
  locale: string,
  dateStyle: DateFormatDateStyle | undefined,
  timeStyle: DateFormatTimeStyle | undefined,
  year: Intl.DateTimeFormatOptions['year'] | undefined,
  month: Intl.DateTimeFormatOptions['month'] | undefined,
  day: Intl.DateTimeFormatOptions['day'] | undefined,
  hour: Intl.DateTimeFormatOptions['hour'] | undefined,
  minute: Intl.DateTimeFormatOptions['minute'] | undefined,
  second: Intl.DateTimeFormatOptions['second'] | undefined,
): string {
  const date = toDate(value);

  if (dateStyle || timeStyle) {
    const options: Intl.DateTimeFormatOptions = {};
    if (dateStyle) options.dateStyle = dateStyle;
    if (timeStyle) options.timeStyle = timeStyle;
    return new Intl.DateTimeFormat(locale, options).format(date);
  }

  if (year || month || day || hour || minute || second) {
    const options: Intl.DateTimeFormatOptions = {};
    if (year) options.year = year;
    if (month) options.month = month;
    if (day) options.day = day;
    if (hour) options.hour = hour;
    if (minute) options.minute = minute;
    if (second) options.second = second;
    return new Intl.DateTimeFormat(locale, options).format(date);
  }

  return new Intl.DateTimeFormat(locale).format(date);
}

// ── Compound: DateFormatter.Value ────────────────────

/** DateFormatter.Value props */
export interface DateFormatterValueProps {
  /** Formatlanacak tarih / Date to format */
  children: DateInput | ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const DateFormatterValue = forwardRef<HTMLSpanElement, DateFormatterValueProps>(
  function DateFormatterValue(props, ref) {
    const { children, className } = props;
    const ctx = useDateFormatterContext();
    const slot = getSlotProps('value', valueStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const formatted = useMemo(() => {
      if (children instanceof Date || typeof children === 'number') {
        return formatDate(
          children, ctx.locale, ctx.dateStyle, ctx.timeStyle,
          ctx.year, ctx.month, ctx.day, ctx.hour, ctx.minute, ctx.second,
        );
      }
      if (typeof children === 'string') {
        const date = new Date(children);
        if (!Number.isNaN(date.getTime())) {
          return formatDate(
            date, ctx.locale, ctx.dateStyle, ctx.timeStyle,
            ctx.year, ctx.month, ctx.day, ctx.hour, ctx.minute, ctx.second,
          );
        }
      }
      return children;
    }, [children, ctx.locale, ctx.dateStyle, ctx.timeStyle, ctx.year, ctx.month, ctx.day, ctx.hour, ctx.minute, ctx.second]);

    return (
      <span ref={ref} className={cls} style={slot.style} data-testid="date-formatter-value">
        {formatted}
      </span>
    );
  },
);

// ── Compound: DateFormatter.Prefix ───────────────────

/** DateFormatter.Prefix props */
export interface DateFormatterPrefixProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const DateFormatterPrefix = forwardRef<HTMLSpanElement, DateFormatterPrefixProps>(
  function DateFormatterPrefix(props, ref) {
    const { children, className } = props;
    const ctx = useDateFormatterContext();
    const slot = getSlotProps('prefix', prefixStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span ref={ref} className={cls} style={slot.style} data-testid="date-formatter-prefix">
        {children}
      </span>
    );
  },
);

// ── Compound: DateFormatter.Suffix ───────────────────

/** DateFormatter.Suffix props */
export interface DateFormatterSuffixProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const DateFormatterSuffix = forwardRef<HTMLSpanElement, DateFormatterSuffixProps>(
  function DateFormatterSuffix(props, ref) {
    const { children, className } = props;
    const ctx = useDateFormatterContext();
    const slot = getSlotProps('suffix', suffixStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span ref={ref} className={cls} style={slot.style} data-testid="date-formatter-suffix">
        {children}
      </span>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface DateFormatterComponentProps extends SlotStyleProps<DateFormatterSlot> {
  /** Props-based: formatlanacak tarih / Date to format */
  value?: DateInput;
  /** Locale / Locale */
  locale?: string;
  /** Tarih stili / Date style */
  dateStyle?: DateFormatDateStyle;
  /** Saat stili / Time style */
  timeStyle?: DateFormatTimeStyle;
  /** Yil formati / Year format */
  year?: Intl.DateTimeFormatOptions['year'];
  /** Ay formati / Month format */
  month?: Intl.DateTimeFormatOptions['month'];
  /** Gun formati / Day format */
  day?: Intl.DateTimeFormatOptions['day'];
  /** Saat formati / Hour format */
  hour?: Intl.DateTimeFormatOptions['hour'];
  /** Dakika formati / Minute format */
  minute?: Intl.DateTimeFormatOptions['minute'];
  /** Saniye formati / Second format */
  second?: Intl.DateTimeFormatOptions['second'];
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

const DateFormatterBase = forwardRef<HTMLSpanElement, DateFormatterComponentProps>(
  function DateFormatter(props, ref) {
    const {
      value,
      locale = 'en-US',
      dateStyle,
      timeStyle,
      year,
      month,
      day,
      hour,
      minute,
      second,
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

    const ctxValue: DateFormatterContextValue = {
      locale, dateStyle, timeStyle,
      year, month, day, hour, minute, second,
      classNames, styles,
    };

    // ── Compound API ──
    if (children) {
      return (
        <DateFormatterContext.Provider value={ctxValue}>
          <span
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="date-formatter-root"
          >
            {children}
          </span>
        </DateFormatterContext.Provider>
      );
    }

    // ── Props-based API ──
    const prefixSlot = getSlotProps('prefix', prefixStyle, classNames, styles);
    const valueSlot = getSlotProps('value', valueStyle, classNames, styles);
    const suffixSlot = getSlotProps('suffix', suffixStyle, classNames, styles);

    const formatted = useMemo(() => {
      if (value === undefined) return '';
      return formatDate(value, locale, dateStyle, timeStyle, year, month, day, hour, minute, second);
    }, [value, locale, dateStyle, timeStyle, year, month, day, hour, minute, second]);

    return (
      <span
        ref={ref}
        className={rootClassName}
        style={{ ...rootSlot.style, ...styleProp }}
        data-testid="date-formatter-root"
      >
        {prefix !== undefined && (
          <span
            className={prefixSlot.className}
            style={prefixSlot.style}
            data-testid="date-formatter-prefix"
          >
            {prefix}
          </span>
        )}
        <span
          className={valueSlot.className}
          style={valueSlot.style}
          data-testid="date-formatter-value"
        >
          {formatted}
        </span>
        {suffix !== undefined && (
          <span
            className={suffixSlot.className}
            style={suffixSlot.style}
            data-testid="date-formatter-suffix"
          >
            {suffix}
          </span>
        )}
      </span>
    );
  },
);

/**
 * DateFormatter bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <DateFormatter value={new Date()} locale="tr-TR" dateStyle="long" />
 * ```
 *
 * @example Compound
 * ```tsx
 * <DateFormatter locale="tr-TR" dateStyle="long">
 *   <DateFormatter.Prefix>Tarih: </DateFormatter.Prefix>
 *   <DateFormatter.Value>{new Date()}</DateFormatter.Value>
 *   <DateFormatter.Suffix> (bugun)</DateFormatter.Suffix>
 * </DateFormatter>
 * ```
 */
export const DateFormatter = Object.assign(DateFormatterBase, {
  Value: DateFormatterValue,
  Prefix: DateFormatterPrefix,
  Suffix: DateFormatterSuffix,
});
