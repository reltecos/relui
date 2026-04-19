/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * StockChart — mum grafik (candlestick chart) bilesen (Dual API).
 * StockChart — candlestick stock chart component (Dual API).
 *
 * Props-based: `<StockChart data={data} />`
 * Compound:    `<StockChart data={data}><StockChart.Candle /><StockChart.Volume /></StockChart>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { StockChartContext } from '@relteco/relui-core';
import {
  rootStyle, candleStyle, volumeStyle, axisStyle,
  legendStyle, legendItemStyle, legendDotStyle,
} from './stock-chart.css';
import { useStockChart, type UseStockChartProps } from './useStockChart';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──

export type StockChartSlot = 'root' | 'candle' | 'volume' | 'axis' | 'legend';

// ── Context ──

interface StockChartCtxValue extends StockChartContext {
  width: number;
  height: number;
  classNames: ClassNames<StockChartSlot> | undefined;
  styles: Styles<StockChartSlot> | undefined;
}

const StockChartCtx = createContext<StockChartCtxValue | null>(null);

function useStockChartCtx(): StockChartCtxValue {
  const c = useContext(StockChartCtx);
  if (!c) throw new Error('StockChart compound sub-components must be used within <StockChart>.');
  return c;
}

// ── Sub: Candle ──

export interface StockChartCandleProps { className?: string; }

export const StockChartCandle = forwardRef<SVGGElement, StockChartCandleProps>(
  function StockChartCandle(props, ref) {
    const { className } = props;
    const ctx = useStockChartCtx();
    const slot = getSlotProps('candle', candleStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <g ref={ref} data-testid="stock-chart-candle">
        {ctx.candles.map((c, i) => (
          <g key={i}>
            {/* Wick */}
            <line
              x1={c.x + c.width / 2}
              y1={c.wickY}
              x2={c.x + c.width / 2}
              y2={c.wickY + c.wickHeight}
              stroke={c.color}
              strokeWidth={1}
              data-testid="stock-chart-wick"
            />
            {/* Body */}
            <rect
              x={c.x}
              y={c.bodyY}
              width={c.width}
              height={c.bodyHeight}
              fill={c.color}
              className={cls}
              style={slot.style}
              data-testid="stock-chart-candle-rect"
            />
          </g>
        ))}
      </g>
    );
  },
);

// ── Sub: Volume ──

export interface StockChartVolumeProps { className?: string; }

export const StockChartVolume = forwardRef<SVGGElement, StockChartVolumeProps>(
  function StockChartVolume(props, ref) {
    const { className } = props;
    const ctx = useStockChartCtx();
    const slot = getSlotProps('volume', volumeStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <g ref={ref} data-testid="stock-chart-volume">
        {ctx.candles.map((c, i) => (
          <rect
            key={i}
            x={c.x}
            y={c.volumeY}
            width={c.width}
            height={c.volumeHeight}
            fill={c.color}
            className={cls}
            style={slot.style}
            data-testid="stock-chart-volume-bar"
          />
        ))}
      </g>
    );
  },
);

// ── Sub: Axis ──

export interface StockChartAxisProps { className?: string; }

export const StockChartAxis = forwardRef<SVGGElement, StockChartAxisProps>(
  function StockChartAxis(props, ref) {
    const { className } = props;
    const ctx = useStockChartCtx();
    const slot = getSlotProps('axis', axisStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <g ref={ref} className={cls} style={slot.style} data-testid="stock-chart-axis">
        {/* Price axis labels */}
        <text x={2} y={12} className={cls} data-testid="stock-chart-axis-label">
          {ctx.priceMax.toFixed(0)}
        </text>
        <text x={2} y={ctx.chartHeight / 2} className={cls} data-testid="stock-chart-axis-label">
          {((ctx.priceMax + ctx.priceMin) / 2).toFixed(0)}
        </text>
        <text x={2} y={ctx.chartHeight - 4} className={cls} data-testid="stock-chart-axis-label">
          {ctx.priceMin.toFixed(0)}
        </text>
      </g>
    );
  },
);

// ── Sub: Legend ──

export interface StockChartLegendProps { className?: string; }

export const StockChartLegend = forwardRef<HTMLDivElement, StockChartLegendProps>(
  function StockChartLegend(props, ref) {
    const { className } = props;
    const ctx = useStockChartCtx();
    const slot = getSlotProps('legend', legendStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const bullish = ctx.candles.filter((c) => c.isBullish).length;
    const bearish = ctx.candles.length - bullish;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="stock-chart-legend">
        <span className={legendItemStyle}>
          <span className={legendDotStyle} style={{ backgroundColor: 'var(--rel-color-success, #16a34a)' }} />
          Bullish: {bullish}
        </span>
        <span className={legendItemStyle}>
          <span className={legendDotStyle} style={{ backgroundColor: 'var(--rel-color-error, #dc2626)' }} />
          Bearish: {bearish}
        </span>
      </div>
    );
  },
);

// ── Props ──

export interface StockChartComponentProps extends SlotStyleProps<StockChartSlot>, UseStockChartProps {
  showVolume?: boolean;
  showLegend?: boolean;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ──

export const StockChartBase = forwardRef<HTMLDivElement, StockChartComponentProps>(
  function StockChart(props, ref) {
    const {
      data, width = 600, height = 400,
      volumeHeight, padding, bullishColor, bearishColor,
      showVolume = true, showLegend = true,
      children, className, style: styleProp, classNames, styles,
    } = props;

    const chart = useStockChart({ data, width, height, volumeHeight, padding, bullishColor, bearishColor });
    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue: StockChartCtxValue = { ...chart, width, height, classNames, styles };

    if (children) {
      return (
        <StockChartCtx.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="stock-chart-root">
            <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label="Stock chart">{children}</svg>
          </div>
        </StockChartCtx.Provider>
      );
    }

    const cSlot = getSlotProps('candle', candleStyle, classNames, styles);
    const vSlot = getSlotProps('volume', volumeStyle, classNames, styles);

    return (
      <StockChartCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="stock-chart-root">
          <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label="Stock chart">
            {/* Candles */}
            {chart.candles.map((c, i) => (
              <g key={i}>
                {/* Wick */}
                <line
                  x1={c.x + c.width / 2}
                  y1={c.wickY}
                  x2={c.x + c.width / 2}
                  y2={c.wickY + c.wickHeight}
                  stroke={c.color}
                  strokeWidth={1}
                  data-testid="stock-chart-wick"
                />
                {/* Body */}
                <rect
                  x={c.x}
                  y={c.bodyY}
                  width={c.width}
                  height={c.bodyHeight}
                  fill={c.color}
                  className={cSlot.className}
                  style={cSlot.style}
                  data-testid="stock-chart-candle-rect"
                />
              </g>
            ))}
            {/* Volume */}
            {showVolume && chart.candles.map((c, i) => (
              <rect
                key={`vol-${i}`}
                x={c.x}
                y={c.volumeY}
                width={c.width}
                height={c.volumeHeight}
                fill={c.color}
                className={vSlot.className}
                style={vSlot.style}
                data-testid="stock-chart-volume-bar"
              />
            ))}
          </svg>
          {showLegend && <StockChartLegend />}
        </div>
      </StockChartCtx.Provider>
    );
  },
);

/**
 * StockChart bilesen — Dual API (props-based + compound).
 */
export const StockChart = Object.assign(StockChartBase, {
  Candle: StockChartCandle,
  Volume: StockChartVolume,
  Axis: StockChartAxis,
  Legend: StockChartLegend,
});
