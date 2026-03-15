/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Stat — tek istatistik gosterimi bilesen (Dual API).
 * Stat — single statistic display component (Dual API).
 *
 * Props-based: `<Stat value="1,234" label="Kullanicilar" trend="up" />`
 * Compound:    `<Stat><Stat.Value>1,234</Stat.Value><Stat.Label>Kullanicilar</Stat.Label></Stat>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import {
  rootStyle,
  sizeStyles,
  iconStyle,
  valueBaseStyle,
  valueSizeStyles,
  labelStyle,
  helpTextStyle,
  trendBaseStyle,
  trendDirectionStyles,
} from './stat.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** Stat slot isimleri / Stat slot names. */
export type StatSlot = 'root' | 'value' | 'label' | 'helpText' | 'icon' | 'trend';

// ── Types ─────────────────────────────────────────────

/** Stat boyutu / Stat size */
export type StatSize = 'sm' | 'md' | 'lg';

/** Trend yonu / Trend direction */
export type StatTrendDirection = 'up' | 'down' | 'neutral';

// ── Context (Compound API) ──────────────────────────

interface StatContextValue {
  size: StatSize;
  classNames: ClassNames<StatSlot> | undefined;
  styles: Styles<StatSlot> | undefined;
}

const StatContext = createContext<StatContextValue | null>(null);

function useStatContext(): StatContextValue {
  const ctx = useContext(StatContext);
  if (!ctx) throw new Error('Stat compound sub-components must be used within <Stat>.');
  return ctx;
}

// ── Compound: Stat.Value ────────────────────────────

/** Stat.Value props */
export interface StatValueProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const StatValue = forwardRef<HTMLParagraphElement, StatValueProps>(
  function StatValue(props, ref) {
    const { children, className } = props;
    const ctx = useStatContext();
    const slot = getSlotProps(
      'value',
      `${valueBaseStyle} ${valueSizeStyles[ctx.size]}`,
      ctx.classNames,
      ctx.styles,
    );
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <p ref={ref} className={cls} style={slot.style} data-testid="stat-value">
        {children}
      </p>
    );
  },
);

// ── Compound: Stat.Label ────────────────────────────

/** Stat.Label props */
export interface StatLabelProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const StatLabel = forwardRef<HTMLParagraphElement, StatLabelProps>(
  function StatLabel(props, ref) {
    const { children, className } = props;
    const ctx = useStatContext();
    const slot = getSlotProps('label', labelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <p ref={ref} className={cls} style={slot.style} data-testid="stat-label">
        {children}
      </p>
    );
  },
);

// ── Compound: Stat.HelpText ─────────────────────────

/** Stat.HelpText props */
export interface StatHelpTextProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const StatHelpText = forwardRef<HTMLParagraphElement, StatHelpTextProps>(
  function StatHelpText(props, ref) {
    const { children, className } = props;
    const ctx = useStatContext();
    const slot = getSlotProps('helpText', helpTextStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <p ref={ref} className={cls} style={slot.style} data-testid="stat-helptext">
        {children}
      </p>
    );
  },
);

// ── Compound: Stat.Icon ─────────────────────────────

/** Stat.Icon props */
export interface StatIconProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const StatIcon = forwardRef<HTMLDivElement, StatIconProps>(
  function StatIcon(props, ref) {
    const { children, className } = props;
    const ctx = useStatContext();
    const slot = getSlotProps('icon', iconStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="stat-icon">
        {children}
      </div>
    );
  },
);

// ── Compound: Stat.Trend ────────────────────────────

/** Stat.Trend props */
export interface StatTrendProps {
  /** Trend yonu / Trend direction */
  direction?: StatTrendDirection;
  /** Icerik (orn. "+12%") / Content (e.g. "+12%") */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const StatTrend = forwardRef<HTMLSpanElement, StatTrendProps>(
  function StatTrend(props, ref) {
    const { direction, children, className } = props;
    const ctx = useStatContext();
    const trendCls = direction
      ? `${trendBaseStyle} ${trendDirectionStyles[direction]}`
      : trendBaseStyle;
    const slot = getSlotProps('trend', trendCls, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const trendArrow = direction === 'up' ? '\u2191' : direction === 'down' ? '\u2193' : direction === 'neutral' ? '\u2192' : null;

    return (
      <span
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="stat-trend"
        data-trend={direction}
      >
        {trendArrow !== null && <span aria-hidden="true">{trendArrow}</span>}
        {children !== undefined && <span>{children}</span>}
      </span>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface StatComponentProps extends SlotStyleProps<StatSlot> {
  /** Props-based: istatistik degeri / Statistic value */
  value?: ReactNode;
  /** Props-based: etiket / Label */
  label?: ReactNode;
  /** Props-based: yardimci metin / Help text */
  helpText?: ReactNode;
  /** Props-based: ikon / Icon */
  icon?: ReactNode;
  /** Props-based: trend yonu / Trend direction */
  trend?: StatTrendDirection;
  /** Props-based: trend degeri / Trend value */
  trendValue?: ReactNode;
  /** Boyut / Size */
  size?: StatSize;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const StatBase = forwardRef<HTMLDivElement, StatComponentProps>(
  function Stat(props, ref) {
    const {
      value,
      label,
      helpText,
      icon,
      trend,
      trendValue,
      size = 'md',
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    // ── Slots ──
    const rootSlot = getSlotProps('root', `${rootStyle} ${sizeStyles[size]}`, classNames, styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const ctxValue: StatContextValue = { size, classNames, styles };

    // ── Compound API ──
    if (children) {
      return (
        <StatContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="stat-root"
            data-size={size}
          >
            {children}
          </div>
        </StatContext.Provider>
      );
    }

    // ── Props-based API ──
    const iconSlot = getSlotProps('icon', iconStyle, classNames, styles);
    const valueSlot = getSlotProps('value', `${valueBaseStyle} ${valueSizeStyles[size]}`, classNames, styles);
    const labelSlot = getSlotProps('label', labelStyle, classNames, styles);
    const helpTextSlot = getSlotProps('helpText', helpTextStyle, classNames, styles);
    const trendCls = trend ? `${trendBaseStyle} ${trendDirectionStyles[trend]}` : trendBaseStyle;
    const trendSlot = getSlotProps('trend', trendCls, classNames, styles);

    const trendArrow = trend === 'up' ? '\u2191' : trend === 'down' ? '\u2193' : '\u2192';

    return (
      <div
        ref={ref}
        className={rootClassName}
        style={{ ...rootSlot.style, ...styleProp }}
        data-testid="stat-root"
        data-size={size}
      >
        {icon !== undefined && (
          <div
            className={iconSlot.className}
            style={iconSlot.style}
            data-testid="stat-icon"
          >
            {icon}
          </div>
        )}

        <p
          className={valueSlot.className}
          style={valueSlot.style}
          data-testid="stat-value"
        >
          {value}
        </p>

        <p
          className={labelSlot.className}
          style={labelSlot.style}
          data-testid="stat-label"
        >
          {label}
        </p>

        {(trend !== undefined || trendValue !== undefined) && (
          <span
            className={trendSlot.className}
            style={trendSlot.style}
            data-testid="stat-trend"
            data-trend={trend}
          >
            {trend !== undefined && <span aria-hidden="true">{trendArrow}</span>}
            {trendValue !== undefined && <span>{trendValue}</span>}
          </span>
        )}

        {helpText !== undefined && (
          <p
            className={helpTextSlot.className}
            style={helpTextSlot.style}
            data-testid="stat-helptext"
          >
            {helpText}
          </p>
        )}
      </div>
    );
  },
);

/**
 * Stat bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Stat value="1,234" label="Toplam Kullanici" trend="up" trendValue="+12.5%" />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Stat>
 *   <Stat.Icon><DollarIcon /></Stat.Icon>
 *   <Stat.Value>1,234</Stat.Value>
 *   <Stat.Label>Toplam Kullanici</Stat.Label>
 *   <Stat.Trend direction="up">+12.5%</Stat.Trend>
 *   <Stat.HelpText>Son 30 gun</Stat.HelpText>
 * </Stat>
 * ```
 */
export const Stat = Object.assign(StatBase, {
  Value: StatValue,
  Label: StatLabel,
  HelpText: StatHelpText,
  Icon: StatIcon,
  Trend: StatTrend,
});
