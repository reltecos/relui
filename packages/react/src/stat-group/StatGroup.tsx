/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * StatGroup — Stat bilesenleri gruplama bilesen (Dual API).
 * StatGroup — groups Stat components together (Dual API).
 *
 * Props-based: `<StatGroup items={[...]} divider />`
 * Compound:    `<StatGroup divider><StatGroup.Stat>...</StatGroup.Stat></StatGroup>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, Children, isValidElement, type ReactNode } from 'react';
import {
  rootBaseStyle,
  directionStyles,
  statBaseStyle,
  statRowDividerStyle,
  statColumnDividerStyle,
  statRowNoDividerStyle,
  statColumnNoDividerStyle,
} from './stat-group.css';
import { Stat, type StatComponentProps } from '../stat/Stat';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** StatGroup slot isimleri / StatGroup slot names. */
export type StatGroupSlot = 'root' | 'stat';

// ── Types ─────────────────────────────────────────────

/** StatGroup yon / StatGroup direction */
export type StatGroupDirection = 'row' | 'column';

/** Stat tanimlari (items prop icin) / Stat definitions (for items prop) */
export interface StatDef {
  /** Benzersiz kimlik / Unique identifier */
  id: string;
  /** Istatistik degeri / Statistic value */
  value: ReactNode;
  /** Etiket / Label */
  label: ReactNode;
  /** Yardimci metin / Help text */
  helpText?: ReactNode;
  /** Ikon / Icon */
  icon?: ReactNode;
  /** Trend yonu / Trend direction */
  trend?: StatComponentProps['trend'];
  /** Trend degeri / Trend value */
  trendValue?: ReactNode;
}

// ── Context (Compound API) ──────────────────────────

interface StatGroupContextValue {
  direction: StatGroupDirection;
  divider: boolean;
  classNames: ClassNames<StatGroupSlot> | undefined;
  styles: Styles<StatGroupSlot> | undefined;
}

const StatGroupContext = createContext<StatGroupContextValue | null>(null);

function useStatGroupContext(): StatGroupContextValue {
  const ctx = useContext(StatGroupContext);
  if (!ctx) throw new Error('StatGroup.Stat must be used within <StatGroup>.');
  return ctx;
}

// ── Compound: StatGroup.Stat ────────────────────────

/** StatGroup.Stat props */
export interface StatGroupStatProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const StatGroupStat = forwardRef<HTMLDivElement, StatGroupStatProps>(
  function StatGroupStat(props, ref) {
    const { children, className } = props;
    const ctx = useStatGroupContext();

    const wrapperCls = getStatWrapperClass(ctx.direction, ctx.divider);
    const slot = getSlotProps('stat', `${statBaseStyle} ${wrapperCls}`, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="stat-group-stat"
      >
        {children}
      </div>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface StatGroupComponentProps extends SlotStyleProps<StatGroupSlot> {
  /** Props-based: stat listesi / Stat list for auto-render */
  items?: StatDef[];
  /** Children olarak Stat bilesen / Stat components as children */
  children?: ReactNode;
  /** Yon / Direction */
  direction?: StatGroupDirection;
  /** Araya cizgi koy / Show dividers between stats */
  divider?: boolean;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const StatGroupBase = forwardRef<HTMLDivElement, StatGroupComponentProps>(
  function StatGroup(props, ref) {
    const {
      items,
      children,
      direction = 'row',
      divider = false,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    // ── Slots ──
    const rootSlot = getSlotProps(
      'root',
      `${rootBaseStyle} ${directionStyles[direction]}`,
      classNames,
      styles,
    );

    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const ctxValue: StatGroupContextValue = { direction, divider, classNames, styles };

    // ── Compound API (children with StatGroup.Stat) ──
    if (!items && children !== undefined) {
      return (
        <StatGroupContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="stat-group-root"
            data-direction={direction}
            data-divider={divider}
          >
            {wrapChildren(children, direction, divider, classNames, styles)}
          </div>
        </StatGroupContext.Provider>
      );
    }

    // ── Props-based API ──
    const statWrapperCls = getStatWrapperClass(direction, divider);
    const statSlot = getSlotProps('stat', `${statBaseStyle} ${statWrapperCls}`, classNames, styles);

    return (
      <StatGroupContext.Provider value={ctxValue}>
        <div
          ref={ref}
          className={rootClassName}
          style={{ ...rootSlot.style, ...styleProp }}
          data-testid="stat-group-root"
          data-direction={direction}
          data-divider={divider}
        >
          {items && items.map((item) => (
            <div
              key={item.id}
              className={statSlot.className}
              style={statSlot.style}
              data-testid="stat-group-stat"
            >
              <Stat
                value={item.value}
                label={item.label}
                helpText={item.helpText}
                icon={item.icon}
                trend={item.trend}
                trendValue={item.trendValue}
              />
            </div>
          ))}
        </div>
      </StatGroupContext.Provider>
    );
  },
);

/**
 * StatGroup bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <StatGroup
 *   items={[
 *     { id: '1', value: '1,234', label: 'Kullanicilar' },
 *     { id: '2', value: '567', label: 'Siparisler' },
 *   ]}
 *   divider
 * />
 * ```
 *
 * @example Compound
 * ```tsx
 * <StatGroup divider>
 *   <StatGroup.Stat>
 *     <Stat value="1,234" label="Kullanicilar" />
 *   </StatGroup.Stat>
 *   <StatGroup.Stat>
 *     <Stat value="567" label="Siparisler" />
 *   </StatGroup.Stat>
 * </StatGroup>
 * ```
 */
export const StatGroup = Object.assign(StatGroupBase, {
  Stat: StatGroupStat,
});

// ── Helpers ───────────────────────────────────────────

function getStatWrapperClass(direction: StatGroupDirection, divider: boolean): string {
  if (direction === 'row') {
    return divider ? statRowDividerStyle : statRowNoDividerStyle;
  }
  return divider ? statColumnDividerStyle : statColumnNoDividerStyle;
}

function wrapChildren(
  children: ReactNode,
  direction: StatGroupDirection,
  divider: boolean,
  classNames: ClassNames<StatGroupSlot> | undefined,
  styles: Styles<StatGroupSlot> | undefined,
): ReactNode[] {
  const statWrapperCls = getStatWrapperClass(direction, divider);
  const statSlot = getSlotProps('stat', `${statBaseStyle} ${statWrapperCls}`, classNames, styles);

  return Children.toArray(children).filter(Boolean).map((child, index) => {
    // StatGroup.Stat zaten kendi wrapper div'ini render ediyor, tekrar sarma
    if (isValidElement(child) && child.type === StatGroupStat) {
      return child;
    }
    return (
      <div
        key={index}
        className={statSlot.className}
        style={statSlot.style}
        data-testid="stat-group-stat"
      >
        {child}
      </div>
    );
  });
}
