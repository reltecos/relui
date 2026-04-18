/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * PieChart — pasta grafik bilesen (Dual API).
 * PieChart — pie chart component (Dual API).
 *
 * Props-based: `<PieChart slices={slices} donut />`
 * Compound:    `<PieChart slices={slices}><PieChart.Slice /><PieChart.Legend /></PieChart>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { PieArc } from '@relteco/relui-core';
import {
  rootStyle, sliceStyle, labelStyle, legendStyle, legendItemStyle, legendDotStyle,
} from './pie-chart.css';
import { usePieChart, type UsePieChartProps } from './usePieChart';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type PieChartSlot = 'root' | 'slice' | 'label' | 'legend';

interface PieChartContextValue {
  arcs: readonly PieArc[];
  total: number;
  donut: boolean;
  classNames: ClassNames<PieChartSlot> | undefined;
  styles: Styles<PieChartSlot> | undefined;
}

const PieChartContext = createContext<PieChartContextValue | null>(null);

function usePieChartContext(): PieChartContextValue {
  const ctx = useContext(PieChartContext);
  if (!ctx) throw new Error('PieChart compound sub-components must be used within <PieChart>.');
  return ctx;
}

// ── Sub: PieChart.Slice ──

export interface PieChartSliceProps { className?: string; }

const PieChartSlice = forwardRef<SVGGElement, PieChartSliceProps>(
  function PieChartSlice(props, ref) {
    const { className } = props;
    const ctx = usePieChartContext();
    const slot = getSlotProps('slice', sliceStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <g ref={ref} data-testid="pie-chart-slice">
        {ctx.arcs.map((a, i) => (
          <path key={i} d={a.path} fill={a.color} className={cls} style={slot.style} />
        ))}
      </g>
    );
  },
);

// ── Sub: PieChart.Label ──

export interface PieChartLabelProps { className?: string; }

const PieChartLabel = forwardRef<SVGGElement, PieChartLabelProps>(
  function PieChartLabel(props, ref) {
    const { className } = props;
    const ctx = usePieChartContext();
    const slot = getSlotProps('label', labelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <g ref={ref} data-testid="pie-chart-label">
        {ctx.arcs.map((a, i) => (
          <text key={i} x={a.labelPos.x} y={a.labelPos.y} className={cls} style={slot.style}>
            {`${a.percentage.toFixed(0)}%`}
          </text>
        ))}
      </g>
    );
  },
);

// ── Sub: PieChart.Legend ──

export interface PieChartLegendProps { className?: string; }

const PieChartLegend = forwardRef<HTMLDivElement, PieChartLegendProps>(
  function PieChartLegend(props, ref) {
    const { className } = props;
    const ctx = usePieChartContext();
    const slot = getSlotProps('legend', legendStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="pie-chart-legend">
        {ctx.arcs.map((a, i) => (
          <span key={i} className={legendItemStyle}>
            <span className={legendDotStyle} style={{ backgroundColor: a.color }} />
            {a.name} ({a.percentage.toFixed(0)}%)
          </span>
        ))}
      </div>
    );
  },
);

// ── Props ──

export interface PieChartComponentProps extends SlotStyleProps<PieChartSlot>, UsePieChartProps {
  size?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ──

const PieChartBase = forwardRef<HTMLDivElement, PieChartComponentProps>(
  function PieChart(props, ref) {
    const {
      slices, donut, innerRadius, size = 200, showLabels = false, showLegend = true,
      children, className, style: styleProp, classNames, styles,
    } = props;

    const pie = usePieChart({ slices, donut, innerRadius });
    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: PieChartContextValue = {
      arcs: pie.arcs, total: pie.total, donut: pie.donut, classNames, styles,
    };

    if (children) {
      return (
        <PieChartContext.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="pie-chart-root">
            <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="Pie chart">
              {children}
            </svg>
          </div>
        </PieChartContext.Provider>
      );
    }

    const slSlot = getSlotProps('slice', sliceStyle, classNames, styles);
    const lbSlot = getSlotProps('label', labelStyle, classNames, styles);
    const lgSlot = getSlotProps('legend', legendStyle, classNames, styles);

    return (
      <PieChartContext.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="pie-chart-root">
          <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="Pie chart">
            {pie.arcs.map((a, i) => (
              <path key={i} d={a.path} fill={a.color} className={slSlot.className} style={slSlot.style} data-testid="pie-chart-slice" />
            ))}
            {showLabels && pie.arcs.map((a, i) => (
              <text key={i} x={a.labelPos.x} y={a.labelPos.y} className={lbSlot.className} style={lbSlot.style} data-testid="pie-chart-label">
                {`${a.percentage.toFixed(0)}%`}
              </text>
            ))}
          </svg>
          {showLegend && (
            <div className={lgSlot.className} style={lgSlot.style} data-testid="pie-chart-legend">
              {pie.arcs.map((a, i) => (
                <span key={i} className={legendItemStyle}>
                  <span className={legendDotStyle} style={{ backgroundColor: a.color }} />
                  {a.name} ({a.percentage.toFixed(0)}%)
                </span>
              ))}
            </div>
          )}
        </div>
      </PieChartContext.Provider>
    );
  },
);

export const PieChart = Object.assign(PieChartBase, {
  Slice: PieChartSlice,
  Label: PieChartLabel,
  Legend: PieChartLegend,
});
