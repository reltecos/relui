/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * RadarChart — radar/polar grafik bilesen (Dual API).
 * RadarChart — radar/polar chart component (Dual API).
 *
 * Props-based: `<RadarChart axes={axes} series={series} />`
 * Compound:    `<RadarChart axes={axes} series={series}><RadarChart.Grid /><RadarChart.Series /></RadarChart>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { RadarChartContext } from '@relteco/relui-core';
import {
  rootStyle, gridStyle, axisStyle, axisLabelStyle, seriesStyle,
  legendStyle, legendItemStyle, legendDotStyle,
} from './radar-chart.css';
import { useRadarChart, type UseRadarChartProps } from './useRadarChart';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──

export type RadarChartSlot = 'root' | 'grid' | 'axis' | 'series' | 'legend';

// ── Context ──

interface RadarChartCtxValue extends RadarChartContext {
  classNames: ClassNames<RadarChartSlot> | undefined;
  styles: Styles<RadarChartSlot> | undefined;
}

const RadarChartCtx = createContext<RadarChartCtxValue | null>(null);

function useRadarChartCtx(): RadarChartCtxValue {
  const c = useContext(RadarChartCtx);
  if (!c) throw new Error('RadarChart compound sub-components must be used within <RadarChart>.');
  return c;
}

// ── Sub: Grid ──

export interface RadarChartGridProps { className?: string; }

export const RadarChartGrid = forwardRef<SVGGElement, RadarChartGridProps>(
  function RadarChartGrid(props, ref) {
    const { className } = props;
    const ctx = useRadarChartCtx();
    const slot = getSlotProps('grid', gridStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <g ref={ref} data-testid="radar-chart-grid">
        {ctx.gridLines.map((gl, i) => (
          <path key={i} d={gl.path} className={cls} style={slot.style} />
        ))}
        {ctx.axisLines.map((al) => (
          <g key={al.key}>
            <line x1={ctx.center.x} y1={ctx.center.y} x2={al.lineEnd.x} y2={al.lineEnd.y} className={axisStyle} data-testid="radar-chart-axis" />
            <text x={al.labelPos.x} y={al.labelPos.y} className={axisLabelStyle} data-testid="radar-chart-axis-label">{al.label}</text>
          </g>
        ))}
      </g>
    );
  },
);

// ── Sub: Series ──

export interface RadarChartSeriesProps { className?: string; }

export const RadarChartSeries = forwardRef<SVGGElement, RadarChartSeriesProps>(
  function RadarChartSeries(props, ref) {
    const { className } = props;
    const ctx = useRadarChartCtx();
    const slot = getSlotProps('series', seriesStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <g ref={ref} data-testid="radar-chart-series">
        {ctx.series.map((s, i) => (
          <g key={i}>
            <path d={s.path} fill={s.color} stroke={s.color} className={cls} style={slot.style} data-testid="radar-chart-series-path" />
            {s.points.map((p, pi) => (
              <circle key={pi} cx={p.x} cy={p.y} r={3} fill={s.color} data-testid="radar-chart-point" />
            ))}
          </g>
        ))}
      </g>
    );
  },
);

// ── Sub: Legend ──

export interface RadarChartLegendProps { className?: string; }

export const RadarChartLegend = forwardRef<HTMLDivElement, RadarChartLegendProps>(
  function RadarChartLegend(props, ref) {
    const { className } = props;
    const ctx = useRadarChartCtx();
    const slot = getSlotProps('legend', legendStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="radar-chart-legend">
        {ctx.series.map((s, i) => (
          <span key={i} className={legendItemStyle}>
            <span className={legendDotStyle} style={{ backgroundColor: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
    );
  },
);

// ── Props ──

export interface RadarChartComponentProps extends SlotStyleProps<RadarChartSlot>, UseRadarChartProps {
  showLegend?: boolean;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ──

export const RadarChartBase = forwardRef<HTMLDivElement, RadarChartComponentProps>(
  function RadarChart(props, ref) {
    const {
      axes, series, gridLevels, size = 200, padding,
      showLegend = true,
      children, className, style: styleProp, classNames, styles,
    } = props;

    const hookProps: UseRadarChartProps = { axes, series, gridLevels, size, padding };
    const chart = useRadarChart(hookProps);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue: RadarChartCtxValue = { ...chart, classNames, styles };

    if (children) {
      return (
        <RadarChartCtx.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="radar-chart-root">
            <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="Radar chart">
              {children}
            </svg>
          </div>
        </RadarChartCtx.Provider>
      );
    }

    const gSlot = getSlotProps('grid', gridStyle, classNames, styles);
    const sSlot = getSlotProps('series', seriesStyle, classNames, styles);

    return (
      <RadarChartCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="radar-chart-root">
          <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="Radar chart">
            {/* Grid */}
            {chart.gridLines.map((gl, i) => (
              <path key={`g${i}`} d={gl.path} className={gSlot.className} style={gSlot.style} data-testid="radar-chart-grid" />
            ))}
            {/* Axes */}
            {chart.axisLines.map((al) => (
              <g key={al.key}>
                <line x1={chart.center.x} y1={chart.center.y} x2={al.lineEnd.x} y2={al.lineEnd.y} className={axisStyle} data-testid="radar-chart-axis" />
                <text x={al.labelPos.x} y={al.labelPos.y} className={axisLabelStyle} data-testid="radar-chart-axis-label">{al.label}</text>
              </g>
            ))}
            {/* Series */}
            {chart.series.map((s, i) => (
              <g key={i}>
                <path d={s.path} fill={s.color} stroke={s.color} className={sSlot.className} style={sSlot.style} data-testid="radar-chart-series-path" />
                {s.points.map((p, pi) => (
                  <circle key={pi} cx={p.x} cy={p.y} r={3} fill={s.color} data-testid="radar-chart-point" />
                ))}
              </g>
            ))}
          </svg>
          {showLegend && (
            <RadarChartLegend />
          )}
        </div>
      </RadarChartCtx.Provider>
    );
  },
);

/**
 * RadarChart bilesen — Dual API (props-based + compound).
 */
export const RadarChart = Object.assign(RadarChartBase, {
  Grid: RadarChartGrid,
  Series: RadarChartSeries,
  Legend: RadarChartLegend,
});
