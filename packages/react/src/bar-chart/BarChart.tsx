/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * BarChart — cubuk grafik bilesen (Dual API).
 * BarChart — bar chart component (Dual API).
 *
 * Props-based: `<BarChart series={s} categories={c} />`
 * Compound:    `<BarChart ...><BarChart.Grid /><BarChart.Bar /><BarChart.Legend /></BarChart>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { ComputedBar, BarSeries, BarChartMode } from '@relteco/relui-core';
import { formatTickValue, linearScale, bandScale } from '@relteco/relui-core';
import {
  rootStyle, barRectStyle, gridLineStyle, axisLabelStyle, legendStyle, legendItemStyle, legendDotStyle,
} from './bar-chart.css';
import { useBarChart, type UseBarChartProps } from './useBarChart';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type BarChartSlot = 'root' | 'bar' | 'grid' | 'xAxis' | 'yAxis' | 'legend';

interface BarChartContextValue {
  bars: readonly ComputedBar[];
  series: readonly BarSeries[];
  categories: readonly string[];
  xTicks: readonly string[];
  yTicks: readonly number[];
  yMax: number;
  mode: BarChartMode;
  width: number;
  height: number;
  plotArea: { x: number; y: number; width: number; height: number };
  classNames: ClassNames<BarChartSlot> | undefined;
  styles: Styles<BarChartSlot> | undefined;
}

const BarChartContext = createContext<BarChartContextValue | null>(null);

function useBarChartContext(): BarChartContextValue {
  const ctx = useContext(BarChartContext);
  if (!ctx) throw new Error('BarChart compound sub-components must be used within <BarChart>.');
  return ctx;
}

export interface BarChartBarProps { className?: string; }
const BarChartBar = forwardRef<SVGGElement, BarChartBarProps>(
  function BarChartBar(props, ref) {
    const { className } = props;
    const ctx = useBarChartContext();
    const slot = getSlotProps('bar', barRectStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return (
      <g ref={ref} data-testid="bar-chart-bar">
        {ctx.bars.map((b, i) => (
          <rect key={i} x={b.x} y={b.y} width={b.width} height={Math.max(b.height, 0)} rx={2}
            fill={b.color} className={cls} style={slot.style} />
        ))}
      </g>
    );
  },
);

export interface BarChartGridProps { className?: string; }
const BarChartGrid = forwardRef<SVGGElement, BarChartGridProps>(
  function BarChartGrid(props, ref) {
    const { className } = props;
    const ctx = useBarChartContext();
    const slot = getSlotProps('grid', gridLineStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const pa = ctx.plotArea;
    const yScale = linearScale(0, ctx.yMax, pa.y + pa.height, pa.y);
    return (
      <g ref={ref} data-testid="bar-chart-grid">
        {ctx.yTicks.map((t) => (
          <line key={t} x1={pa.x} x2={pa.x + pa.width} y1={yScale(t)} y2={yScale(t)}
            className={cls} style={{ ...slot.style, stroke: 'var(--rel-color-border, #e5e7eb)' }} />
        ))}
      </g>
    );
  },
);

export interface BarChartXAxisProps { className?: string; }
const BarChartXAxis = forwardRef<SVGGElement, BarChartXAxisProps>(
  function BarChartXAxis(props, ref) {
    const { className } = props;
    const ctx = useBarChartContext();
    const slot = getSlotProps('xAxis', axisLabelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const pa = ctx.plotArea;
    const catScale = bandScale(ctx.categories as string[], pa.x, pa.x + pa.width, 0.2);
    return (
      <g ref={ref} data-testid="bar-chart-xAxis">
        {ctx.categories.map((c) => {
          const band = catScale(c);
          return <text key={c} x={band.x + band.width / 2} y={pa.y + pa.height + 16} textAnchor="middle" className={cls} style={slot.style}>{c}</text>;
        })}
      </g>
    );
  },
);

export interface BarChartYAxisProps { className?: string; }
const BarChartYAxis = forwardRef<SVGGElement, BarChartYAxisProps>(
  function BarChartYAxis(props, ref) {
    const { className } = props;
    const ctx = useBarChartContext();
    const slot = getSlotProps('yAxis', axisLabelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const pa = ctx.plotArea;
    const yScale = linearScale(0, ctx.yMax, pa.y + pa.height, pa.y);
    return (
      <g ref={ref} data-testid="bar-chart-yAxis">
        {ctx.yTicks.map((t) => (
          <text key={t} x={pa.x - 6} y={yScale(t) + 4} textAnchor="end" className={cls} style={slot.style}>{formatTickValue(t)}</text>
        ))}
      </g>
    );
  },
);

export interface BarChartLegendProps { className?: string; }
const BarChartLegend = forwardRef<HTMLDivElement, BarChartLegendProps>(
  function BarChartLegend(props, ref) {
    const { className } = props;
    const ctx = useBarChartContext();
    const slot = getSlotProps('legend', legendStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="bar-chart-legend">
        {ctx.series.map((s, i) => {
          const color = s.color ?? `var(--rel-color-primary, #3b82f6)`;
          return <span key={i} className={legendItemStyle}><span className={legendDotStyle} style={{ backgroundColor: color }} />{s.name}</span>;
        })}
      </div>
    );
  },
);

export interface BarChartComponentProps extends SlotStyleProps<BarChartSlot>, UseBarChartProps {
  showGrid?: boolean;
  showLegend?: boolean;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const BarChartBase = forwardRef<HTMLDivElement, BarChartComponentProps>(
  function BarChart(props, ref) {
    const {
      series, categories, mode, orientation, width = 400, height = 300,
      showGrid = true, showLegend = true,
      children, className, style: styleProp, classNames, styles,
    } = props;

    const chart = useBarChart({ series, categories, mode, orientation, width, height });
    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: BarChartContextValue = {
      bars: chart.bars, series: chart.series, categories: chart.categories,
      xTicks: chart.xTicks, yTicks: chart.yTicks, yMax: chart.yMax,
      mode: chart.mode, width: chart.width, height: chart.height,
      plotArea: chart.plotArea, classNames, styles,
    };

    if (children) {
      return (
        <BarChartContext.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="bar-chart-root">
            <svg viewBox={`0 0 ${chart.width} ${chart.height}`} width={chart.width} height={chart.height} role="img" aria-label="Bar chart">
              {children}
            </svg>
          </div>
        </BarChartContext.Provider>
      );
    }

    const pa = chart.plotArea;
    const yScale = linearScale(0, chart.yMax, pa.y + pa.height, pa.y);
    const catScale = bandScale(chart.categories as string[], pa.x, pa.x + pa.width, 0.2);
    const grSlot = getSlotProps('grid', gridLineStyle, classNames, styles);
    const brSlot = getSlotProps('bar', barRectStyle, classNames, styles);
    const xlSlot = getSlotProps('xAxis', axisLabelStyle, classNames, styles);
    const ylSlot = getSlotProps('yAxis', axisLabelStyle, classNames, styles);
    const lgSlot = getSlotProps('legend', legendStyle, classNames, styles);

    return (
      <BarChartContext.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="bar-chart-root">
          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} width={chart.width} height={chart.height} role="img" aria-label="Bar chart">
            {showGrid && chart.yTicks.map((t) => (
              <line key={t} x1={pa.x} x2={pa.x + pa.width} y1={yScale(t)} y2={yScale(t)}
                className={grSlot.className} style={{ ...grSlot.style, stroke: 'var(--rel-color-border, #e5e7eb)' }} data-testid="bar-chart-grid" />
            ))}
            {chart.bars.map((b, i) => (
              <rect key={i} x={b.x} y={b.y} width={b.width} height={Math.max(b.height, 0)} rx={2}
                fill={b.color} className={brSlot.className} style={brSlot.style} data-testid="bar-chart-bar" />
            ))}
            {chart.categories.map((c) => {
              const band = catScale(c);
              return <text key={c} x={band.x + band.width / 2} y={pa.y + pa.height + 16} textAnchor="middle"
                className={xlSlot.className} style={xlSlot.style} data-testid="bar-chart-xAxis">{c}</text>;
            })}
            {chart.yTicks.map((t) => (
              <text key={t} x={pa.x - 6} y={yScale(t) + 4} textAnchor="end"
                className={ylSlot.className} style={ylSlot.style} data-testid="bar-chart-yAxis">{formatTickValue(t)}</text>
            ))}
          </svg>
          {showLegend && chart.series.length > 0 && (
            <div className={lgSlot.className} style={lgSlot.style} data-testid="bar-chart-legend">
              {chart.series.map((s, i) => (
                <span key={i} className={legendItemStyle}><span className={legendDotStyle} style={{ backgroundColor: s.color ?? 'var(--rel-color-primary, #3b82f6)' }} />{s.name}</span>
              ))}
            </div>
          )}
        </div>
      </BarChartContext.Provider>
    );
  },
);

export const BarChart = Object.assign(BarChartBase, {
  Bar: BarChartBar, Grid: BarChartGrid, XAxis: BarChartXAxis, YAxis: BarChartYAxis, Legend: BarChartLegend,
});
