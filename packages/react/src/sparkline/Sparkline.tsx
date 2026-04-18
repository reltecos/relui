/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Sparkline — mini inline grafik bilesen (Dual API).
 * Sparkline — mini inline chart component (Dual API).
 *
 * Props-based: `<Sparkline data={[10,20,30]} mode="line" />`
 * Compound:    `<Sparkline data={[10,20,30]}><Sparkline.Line /><Sparkline.Area /></Sparkline>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { SparklinePoint, SparklineBar } from '@relteco/relui-core';
import { getChartColor } from '@relteco/relui-core';
import {
  rootStyle,
  svgStyle,
  lineStyle,
  areaStyle,
  barStyle,
  pointStyle,
} from './sparkline.css';
import { useSparkline, type UseSparklineProps } from './useSparkline';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** Sparkline slot isimleri / Sparkline slot names. */
export type SparklineSlot = 'root' | 'line' | 'area' | 'bar' | 'point';

// ── Types ────────────────────────────────────────────

/** Sparkline modu / Sparkline mode */
export type SparklineDisplayMode = 'line' | 'bar' | 'area';

// ── Context (Compound API) ──────────────────────────

interface SparklineContextValue {
  points: readonly SparklinePoint[];
  bars: readonly SparklineBar[];
  linePath: string;
  areaPath: string;
  width: number;
  height: number;
  color: string;
  classNames: ClassNames<SparklineSlot> | undefined;
  styles: Styles<SparklineSlot> | undefined;
}

const SparklineContext = createContext<SparklineContextValue | null>(null);

function useSparklineContext(): SparklineContextValue {
  const ctx = useContext(SparklineContext);
  if (!ctx) throw new Error('Sparkline compound sub-components must be used within <Sparkline>.');
  return ctx;
}

// ── Compound: Sparkline.Line ─────────────────────────

/** Sparkline.Line props */
export interface SparklineLineProps {
  /** Ek className / Additional className */
  className?: string;
}

const SparklineLine = forwardRef<SVGPathElement, SparklineLineProps>(
  function SparklineLine(props, ref) {
    const { className } = props;
    const ctx = useSparklineContext();
    const slot = getSlotProps('line', lineStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    if (!ctx.linePath) return null;

    return (
      <path
        ref={ref}
        d={ctx.linePath}
        className={cls}
        style={{ ...slot.style, stroke: ctx.color }}
        data-testid="sparkline-line"
      />
    );
  },
);

// ── Compound: Sparkline.Area ─────────────────────────

/** Sparkline.Area props */
export interface SparklineAreaProps {
  /** Ek className / Additional className */
  className?: string;
}

const SparklineArea = forwardRef<SVGPathElement, SparklineAreaProps>(
  function SparklineArea(props, ref) {
    const { className } = props;
    const ctx = useSparklineContext();
    const slot = getSlotProps('area', areaStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    if (!ctx.areaPath) return null;

    return (
      <path
        ref={ref}
        d={ctx.areaPath}
        className={cls}
        style={{ ...slot.style, fill: ctx.color }}
        data-testid="sparkline-area"
      />
    );
  },
);

// ── Compound: Sparkline.Bar ──────────────────────────

/** Sparkline.Bar props */
export interface SparklineBarProps {
  /** Ek className / Additional className */
  className?: string;
}

const SparklineBarComp = forwardRef<SVGGElement, SparklineBarProps>(
  function SparklineBar(props, ref) {
    const { className } = props;
    const ctx = useSparklineContext();
    const slot = getSlotProps('bar', barStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <g ref={ref} data-testid="sparkline-bar">
        {ctx.bars.map((b) => (
          <rect
            key={b.index}
            x={b.x}
            y={b.y}
            width={b.width}
            height={Math.max(b.height, 0)}
            rx={1}
            className={cls}
            style={{ ...slot.style, fill: ctx.color }}
          />
        ))}
      </g>
    );
  },
);

// ── Compound: Sparkline.Point ────────────────────────

/** Sparkline.Point props */
export interface SparklinePointProps {
  /** Nokta yarucapi / Point radius */
  radius?: number;
  /** Ek className / Additional className */
  className?: string;
}

const SparklinePointComp = forwardRef<SVGGElement, SparklinePointProps>(
  function SparklinePoint(props, ref) {
    const { radius = 2, className } = props;
    const ctx = useSparklineContext();
    const slot = getSlotProps('point', pointStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <g ref={ref} data-testid="sparkline-point">
        {ctx.points.map((p) => (
          <circle
            key={p.index}
            cx={p.x}
            cy={p.y}
            r={radius}
            className={cls}
            style={{ ...slot.style, fill: ctx.color }}
          />
        ))}
      </g>
    );
  },
);

// ── Component Props ─────────────────────────────────

export interface SparklineComponentProps extends SlotStyleProps<SparklineSlot> {
  /** Veri / Data */
  data?: number[];
  /** Mod / Mode */
  mode?: SparklineDisplayMode;
  /** Genislik / Width */
  width?: number;
  /** Yukseklik / Height */
  height?: number;
  /** Renk / Color */
  color?: string;
  /** Nokta goster / Show dots */
  showDots?: boolean;
  /** Compound children */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────

const SparklineBase = forwardRef<HTMLDivElement, SparklineComponentProps>(
  function Sparkline(props, ref) {
    const {
      data,
      mode = 'line',
      width = 100,
      height = 32,
      color = getChartColor(0),
      showDots = false,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const hookProps: UseSparklineProps = { data, width, height };
    const spark = useSparkline(hookProps);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: SparklineContextValue = {
      points: spark.points,
      bars: spark.bars,
      linePath: spark.linePath,
      areaPath: spark.areaPath,
      width: spark.width,
      height: spark.height,
      color,
      classNames,
      styles,
    };

    // ── Compound API ──
    if (children) {
      return (
        <SparklineContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="sparkline-root"
          >
            <svg
              className={svgStyle}
              viewBox={`0 0 ${spark.width} ${spark.height}`}
              width={spark.width}
              height={spark.height}
              role="img"
              aria-label="Sparkline chart"
            >
              {children}
            </svg>
          </div>
        </SparklineContext.Provider>
      );
    }

    // ── Props-based API ──
    const lnSlot = getSlotProps('line', lineStyle, classNames, styles);
    const arSlot = getSlotProps('area', areaStyle, classNames, styles);
    const brSlot = getSlotProps('bar', barStyle, classNames, styles);
    const ptSlot = getSlotProps('point', pointStyle, classNames, styles);

    return (
      <SparklineContext.Provider value={ctxValue}>
        <div
          ref={ref}
          className={rootClassName}
          style={{ ...rootSlot.style, ...styleProp }}
          data-testid="sparkline-root"
        >
          <svg
            className={svgStyle}
            viewBox={`0 0 ${spark.width} ${spark.height}`}
            width={spark.width}
            height={spark.height}
            role="img"
            aria-label="Sparkline chart"
          >
            {mode === 'area' && spark.areaPath && (
              <path
                d={spark.areaPath}
                className={arSlot.className}
                style={{ ...arSlot.style, fill: color }}
                data-testid="sparkline-area"
              />
            )}
            {(mode === 'line' || mode === 'area') && spark.linePath && (
              <path
                d={spark.linePath}
                className={lnSlot.className}
                style={{ ...lnSlot.style, stroke: color }}
                data-testid="sparkline-line"
              />
            )}
            {mode === 'bar' && (
              <g data-testid="sparkline-bar">
                {spark.bars.map((b) => (
                  <rect
                    key={b.index}
                    x={b.x}
                    y={b.y}
                    width={b.width}
                    height={Math.max(b.height, 0)}
                    rx={1}
                    className={brSlot.className}
                    style={{ ...brSlot.style, fill: color }}
                  />
                ))}
              </g>
            )}
            {showDots && (mode === 'line' || mode === 'area') && (
              <g data-testid="sparkline-point">
                {spark.points.map((p) => (
                  <circle
                    key={p.index}
                    cx={p.x}
                    cy={p.y}
                    r={2}
                    className={ptSlot.className}
                    style={{ ...ptSlot.style, fill: color }}
                  />
                ))}
              </g>
            )}
          </svg>
        </div>
      </SparklineContext.Provider>
    );
  },
);

/**
 * Sparkline bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Sparkline data={[10, 20, 15, 30, 25]} mode="line" />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Sparkline data={[10, 20, 15, 30]}>
 *   <Sparkline.Area />
 *   <Sparkline.Line />
 *   <Sparkline.Point />
 * </Sparkline>
 * ```
 */
export const Sparkline = Object.assign(SparklineBase, {
  Line: SparklineLine,
  Area: SparklineArea,
  Bar: SparklineBarComp,
  Point: SparklinePointComp,
});
