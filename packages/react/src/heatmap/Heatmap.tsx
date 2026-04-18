/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Heatmap — isi haritasi bilesen (Dual API).
 * Heatmap — heatmap component (Dual API).
 *
 * Props-based: `<Heatmap data={matrix} rowLabels={r} colLabels={c} />`
 * Compound:    `<Heatmap ...><Heatmap.Grid /><Heatmap.XAxis /><Heatmap.Legend /></Heatmap>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { HeatmapCell } from '@relteco/relui-core';
import { rootStyle, cellStyle, axisLabelStyle, legendStyle } from './heatmap.css';
import { useHeatmap, type UseHeatmapProps } from './useHeatmap';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type HeatmapSlot = 'root' | 'cell' | 'xAxis' | 'yAxis' | 'legend';

interface HeatmapContextValue {
  cells: readonly HeatmapCell[];
  rowLabels: readonly string[];
  colLabels: readonly string[];
  min: number;
  max: number;
  width: number;
  height: number;
  plotArea: { x: number; y: number; width: number; height: number };
  classNames: ClassNames<HeatmapSlot> | undefined;
  styles: Styles<HeatmapSlot> | undefined;
}

const HeatmapContext = createContext<HeatmapContextValue | null>(null);

function useHeatmapContext(): HeatmapContextValue {
  const ctx = useContext(HeatmapContext);
  if (!ctx) throw new Error('Heatmap compound sub-components must be used within <Heatmap>.');
  return ctx;
}

export interface HeatmapGridProps { className?: string; }
const HeatmapGrid = forwardRef<SVGGElement, HeatmapGridProps>(
  function HeatmapGrid(props, ref) {
    const { className } = props;
    const ctx = useHeatmapContext();
    const slot = getSlotProps('cell', cellStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return (
      <g ref={ref} data-testid="heatmap-grid">
        {ctx.cells.map((c, i) => (
          <rect key={i} x={c.x} y={c.y} width={c.width} height={c.height} fill={c.color} rx={2}
            className={cls} style={slot.style} data-testid="heatmap-cell" />
        ))}
      </g>
    );
  },
);

export interface HeatmapXAxisProps { className?: string; }
const HeatmapXAxis = forwardRef<SVGGElement, HeatmapXAxisProps>(
  function HeatmapXAxis(props, ref) {
    const { className } = props;
    const ctx = useHeatmapContext();
    const slot = getSlotProps('xAxis', axisLabelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const pa = ctx.plotArea;
    const colW = ctx.colLabels.length > 0 ? pa.width / ctx.colLabels.length : 0;
    return (
      <g ref={ref} data-testid="heatmap-xAxis">
        {ctx.colLabels.map((l, i) => (
          <text key={i} x={pa.x + i * colW + colW / 2} y={pa.y + pa.height + 14} textAnchor="middle" className={cls} style={slot.style}>{l}</text>
        ))}
      </g>
    );
  },
);

export interface HeatmapYAxisProps { className?: string; }
const HeatmapYAxis = forwardRef<SVGGElement, HeatmapYAxisProps>(
  function HeatmapYAxis(props, ref) {
    const { className } = props;
    const ctx = useHeatmapContext();
    const slot = getSlotProps('yAxis', axisLabelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const pa = ctx.plotArea;
    const rowH = ctx.rowLabels.length > 0 ? pa.height / ctx.rowLabels.length : 0;
    return (
      <g ref={ref} data-testid="heatmap-yAxis">
        {ctx.rowLabels.map((l, i) => (
          <text key={i} x={pa.x - 6} y={pa.y + i * rowH + rowH / 2 + 4} textAnchor="end" className={cls} style={slot.style}>{l}</text>
        ))}
      </g>
    );
  },
);

export interface HeatmapLegendProps { className?: string; }
const HeatmapLegend = forwardRef<HTMLDivElement, HeatmapLegendProps>(
  function HeatmapLegend(props, ref) {
    const { className } = props;
    const ctx = useHeatmapContext();
    const slot = getSlotProps('legend', legendStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="heatmap-legend">
        <span>{ctx.min}</span>
        <div style={{ width: 80, height: 8, background: 'linear-gradient(to right, var(--rel-color-primary-subtle, #dbeafe), var(--rel-color-primary, #1e40af))', borderRadius: 4 }} />
        <span>{ctx.max}</span>
      </div>
    );
  },
);

export interface HeatmapComponentProps extends SlotStyleProps<HeatmapSlot>, UseHeatmapProps {
  showLegend?: boolean;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const HeatmapBase = forwardRef<HTMLDivElement, HeatmapComponentProps>(
  function Heatmap(props, ref) {
    const {
      data, rowLabels, colLabels, width = 400, height = 300, lowColor, highColor,
      showLegend = true, children, className, style: styleProp, classNames, styles,
    } = props;

    const hm = useHeatmap({ data, rowLabels, colLabels, width, height, lowColor, highColor });
    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: HeatmapContextValue = {
      cells: hm.cells, rowLabels: hm.rowLabels, colLabels: hm.colLabels,
      min: hm.min, max: hm.max, width: hm.width, height: hm.height,
      plotArea: hm.plotArea, classNames, styles,
    };

    if (children) {
      return (
        <HeatmapContext.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="heatmap-root">
            <svg viewBox={`0 0 ${hm.width} ${hm.height}`} width={hm.width} height={hm.height} role="img" aria-label="Heatmap">
              {children}
            </svg>
          </div>
        </HeatmapContext.Provider>
      );
    }

    const clSlot = getSlotProps('cell', cellStyle, classNames, styles);
    const xlSlot = getSlotProps('xAxis', axisLabelStyle, classNames, styles);
    const ylSlot = getSlotProps('yAxis', axisLabelStyle, classNames, styles);
    const lgSlot = getSlotProps('legend', legendStyle, classNames, styles);
    const pa = hm.plotArea;
    const colW = hm.colLabels.length > 0 ? pa.width / hm.colLabels.length : 0;
    const rowH = hm.rowLabels.length > 0 ? pa.height / hm.rowLabels.length : 0;

    return (
      <HeatmapContext.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="heatmap-root">
          <svg viewBox={`0 0 ${hm.width} ${hm.height}`} width={hm.width} height={hm.height} role="img" aria-label="Heatmap">
            {hm.cells.map((c, i) => (
              <rect key={i} x={c.x} y={c.y} width={c.width} height={c.height} fill={c.color} rx={2}
                className={clSlot.className} style={clSlot.style} data-testid="heatmap-cell" />
            ))}
            {hm.colLabels.map((l, i) => (
              <text key={`c${i}`} x={pa.x + i * colW + colW / 2} y={pa.y + pa.height + 14} textAnchor="middle"
                className={xlSlot.className} style={xlSlot.style} data-testid="heatmap-xAxis">{l}</text>
            ))}
            {hm.rowLabels.map((l, i) => (
              <text key={`r${i}`} x={pa.x - 6} y={pa.y + i * rowH + rowH / 2 + 4} textAnchor="end"
                className={ylSlot.className} style={ylSlot.style} data-testid="heatmap-yAxis">{l}</text>
            ))}
          </svg>
          {showLegend && (
            <div className={lgSlot.className} style={lgSlot.style} data-testid="heatmap-legend">
              <span>{hm.min}</span>
              <div style={{ width: 80, height: 8, background: 'linear-gradient(to right, var(--rel-color-primary-subtle, #dbeafe), var(--rel-color-primary, #1e40af))', borderRadius: 4 }} />
              <span>{hm.max}</span>
            </div>
          )}
        </div>
      </HeatmapContext.Provider>
    );
  },
);

export const Heatmap = Object.assign(HeatmapBase, {
  Grid: HeatmapGrid, XAxis: HeatmapXAxis, YAxis: HeatmapYAxis, Legend: HeatmapLegend,
});
