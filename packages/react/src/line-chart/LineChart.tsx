/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * LineChart — cizgi grafik bilesen (Dual API).
 * LineChart — line chart component (Dual API).
 *
 * Props-based: `<LineChart series={series} width={400} height={300} />`
 * Compound:    `<LineChart series={s}><LineChart.Grid /><LineChart.Series /><LineChart.XAxis /></LineChart>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { LineComputedSeries } from '@relteco/relui-core';
import { formatTickValue, linearScale } from '@relteco/relui-core';
import {
  rootStyle, gridLineStyle, axisLabelStyle, seriesLineStyle, dotStyle,
  legendStyle, legendItemStyle, legendDotStyle,
} from './line-chart.css';
import { useLineChart, type UseLineChartProps } from './useLineChart';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type LineChartSlot = 'root' | 'grid' | 'xAxis' | 'yAxis' | 'series' | 'dot' | 'legend';

interface LineChartContextValue {
  computedSeries: readonly LineComputedSeries[];
  xTicks: readonly number[];
  yTicks: readonly number[];
  xDomain: readonly [number, number];
  yDomain: readonly [number, number];
  width: number;
  height: number;
  plotArea: { x: number; y: number; width: number; height: number };
  classNames: ClassNames<LineChartSlot> | undefined;
  styles: Styles<LineChartSlot> | undefined;
}

const LineChartContext = createContext<LineChartContextValue | null>(null);

function useLineChartContext(): LineChartContextValue {
  const ctx = useContext(LineChartContext);
  if (!ctx) throw new Error('LineChart compound sub-components must be used within <LineChart>.');
  return ctx;
}

// ── Sub: LineChart.Grid ──

export interface LineChartGridProps { className?: string; }

const LineChartGrid = forwardRef<SVGGElement, LineChartGridProps>(
  function LineChartGrid(props, ref) {
    const { className } = props;
    const ctx = useLineChartContext();
    const slot = getSlotProps('grid', gridLineStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const pa = ctx.plotArea;
    const yScale = linearScale(ctx.yDomain[0], ctx.yDomain[1], pa.y + pa.height, pa.y);

    return (
      <g ref={ref} data-testid="line-chart-grid">
        {ctx.yTicks.map((t) => (
          <line key={t} x1={pa.x} x2={pa.x + pa.width} y1={yScale(t)} y2={yScale(t)}
            className={cls} style={{ ...slot.style, stroke: 'var(--rel-color-border, #e5e7eb)' }} />
        ))}
      </g>
    );
  },
);

// ── Sub: LineChart.XAxis ──

export interface LineChartXAxisProps { className?: string; }

const LineChartXAxis = forwardRef<SVGGElement, LineChartXAxisProps>(
  function LineChartXAxis(props, ref) {
    const { className } = props;
    const ctx = useLineChartContext();
    const slot = getSlotProps('xAxis', axisLabelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const pa = ctx.plotArea;
    const xScale = linearScale(ctx.xDomain[0], ctx.xDomain[1], pa.x, pa.x + pa.width);

    return (
      <g ref={ref} data-testid="line-chart-xAxis">
        {ctx.xTicks.map((t) => (
          <text key={t} x={xScale(t)} y={pa.y + pa.height + 16} textAnchor="middle" className={cls} style={slot.style}>
            {formatTickValue(t)}
          </text>
        ))}
      </g>
    );
  },
);

// ── Sub: LineChart.YAxis ──

export interface LineChartYAxisProps { className?: string; }

const LineChartYAxis = forwardRef<SVGGElement, LineChartYAxisProps>(
  function LineChartYAxis(props, ref) {
    const { className } = props;
    const ctx = useLineChartContext();
    const slot = getSlotProps('yAxis', axisLabelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const pa = ctx.plotArea;
    const yScale = linearScale(ctx.yDomain[0], ctx.yDomain[1], pa.y + pa.height, pa.y);

    return (
      <g ref={ref} data-testid="line-chart-yAxis">
        {ctx.yTicks.map((t) => (
          <text key={t} x={pa.x - 6} y={yScale(t) + 4} textAnchor="end" className={cls} style={slot.style}>
            {formatTickValue(t)}
          </text>
        ))}
      </g>
    );
  },
);

// ── Sub: LineChart.Series ──

export interface LineChartSeriesProps { showDots?: boolean; className?: string; }

const LineChartSeries = forwardRef<SVGGElement, LineChartSeriesProps>(
  function LineChartSeries(props, ref) {
    const { showDots = false, className } = props;
    const ctx = useLineChartContext();
    const slot = getSlotProps('series', seriesLineStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const dtSlot = getSlotProps('dot', dotStyle, ctx.classNames, ctx.styles);

    return (
      <g ref={ref} data-testid="line-chart-series">
        {ctx.computedSeries.map((s) => (
          <g key={s.name}>
            <path d={s.path} className={cls} style={{ ...slot.style, stroke: s.color }} />
            {showDots && s.points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={3} fill={s.color} className={dtSlot.className} style={dtSlot.style} data-testid="line-chart-dot" />
            ))}
          </g>
        ))}
      </g>
    );
  },
);

// ── Sub: LineChart.Legend ──

export interface LineChartLegendProps { className?: string; }

const LineChartLegend = forwardRef<HTMLDivElement, LineChartLegendProps>(
  function LineChartLegend(props, ref) {
    const { className } = props;
    const ctx = useLineChartContext();
    const slot = getSlotProps('legend', legendStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="line-chart-legend">
        {ctx.computedSeries.map((s) => (
          <span key={s.name} className={legendItemStyle}>
            <span className={legendDotStyle} style={{ backgroundColor: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
    );
  },
);

// ── Props ──

export interface LineChartComponentProps extends SlotStyleProps<LineChartSlot>, UseLineChartProps {
  showGrid?: boolean;
  showDots?: boolean;
  showLegend?: boolean;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ──

const LineChartBase = forwardRef<HTMLDivElement, LineChartComponentProps>(
  function LineChart(props, ref) {
    const {
      series, width = 400, height = 300, margin, showGrid = true, showDots = false, showLegend = true,
      children, className, style: styleProp, classNames, styles,
    } = props;

    const chart = useLineChart({ series, width, height, margin });
    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: LineChartContextValue = {
      computedSeries: chart.computedSeries, xTicks: chart.xTicks, yTicks: chart.yTicks,
      xDomain: chart.xDomain, yDomain: chart.yDomain, width: chart.width, height: chart.height,
      plotArea: chart.plotArea, classNames, styles,
    };

    if (children) {
      return (
        <LineChartContext.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="line-chart-root">
            <svg viewBox={`0 0 ${chart.width} ${chart.height}`} width={chart.width} height={chart.height} role="img" aria-label="Line chart">
              {children}
            </svg>
          </div>
        </LineChartContext.Provider>
      );
    }

    const pa = chart.plotArea;
    const xScale = linearScale(chart.xDomain[0], chart.xDomain[1], pa.x, pa.x + pa.width);
    const yScale = linearScale(chart.yDomain[0], chart.yDomain[1], pa.y + pa.height, pa.y);
    const grSlot = getSlotProps('grid', gridLineStyle, classNames, styles);
    const xlSlot = getSlotProps('xAxis', axisLabelStyle, classNames, styles);
    const ylSlot = getSlotProps('yAxis', axisLabelStyle, classNames, styles);
    const srSlot = getSlotProps('series', seriesLineStyle, classNames, styles);
    const dtSlot = getSlotProps('dot', dotStyle, classNames, styles);
    const lgSlot = getSlotProps('legend', legendStyle, classNames, styles);

    return (
      <LineChartContext.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="line-chart-root">
          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} width={chart.width} height={chart.height} role="img" aria-label="Line chart">
            {showGrid && chart.yTicks.map((t) => (
              <line key={`g${t}`} x1={pa.x} x2={pa.x + pa.width} y1={yScale(t)} y2={yScale(t)}
                className={grSlot.className} style={{ ...grSlot.style, stroke: 'var(--rel-color-border, #e5e7eb)' }} data-testid="line-chart-grid" />
            ))}
            {chart.xTicks.map((t) => (
              <text key={`x${t}`} x={xScale(t)} y={pa.y + pa.height + 16} textAnchor="middle"
                className={xlSlot.className} style={xlSlot.style} data-testid="line-chart-xAxis">{formatTickValue(t)}</text>
            ))}
            {chart.yTicks.map((t) => (
              <text key={`y${t}`} x={pa.x - 6} y={yScale(t) + 4} textAnchor="end"
                className={ylSlot.className} style={ylSlot.style} data-testid="line-chart-yAxis">{formatTickValue(t)}</text>
            ))}
            {chart.computedSeries.map((s) => (
              <g key={s.name}>
                <path d={s.path} className={srSlot.className} style={{ ...srSlot.style, stroke: s.color }} data-testid="line-chart-series" />
                {showDots && s.points.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={3} fill={s.color} className={dtSlot.className} style={dtSlot.style} data-testid="line-chart-dot" />
                ))}
              </g>
            ))}
          </svg>
          {showLegend && chart.computedSeries.length > 0 && (
            <div className={lgSlot.className} style={lgSlot.style} data-testid="line-chart-legend">
              {chart.computedSeries.map((s) => (
                <span key={s.name} className={legendItemStyle}><span className={legendDotStyle} style={{ backgroundColor: s.color }} />{s.name}</span>
              ))}
            </div>
          )}
        </div>
      </LineChartContext.Provider>
    );
  },
);

export const LineChart = Object.assign(LineChartBase, {
  Grid: LineChartGrid, XAxis: LineChartXAxis, YAxis: LineChartYAxis,
  Series: LineChartSeries, Legend: LineChartLegend,
});
