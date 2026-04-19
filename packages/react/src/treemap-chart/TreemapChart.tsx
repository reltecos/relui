/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * TreemapChart — treemap gorsellemesi bilesen (Dual API).
 * TreemapChart — treemap visualization component (Dual API).
 *
 * Props-based: `<TreemapChart data={data} />`
 * Compound:    `<TreemapChart data={data}><TreemapChart.Cell /><TreemapChart.Label /></TreemapChart>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { TreemapChartContext } from '@relteco/relui-core';
import {
  rootStyle, cellStyle, labelStyle,
  legendStyle, legendItemStyle, legendDotStyle,
} from './treemap-chart.css';
import { useTreemapChart, type UseTreemapChartProps } from './useTreemapChart';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──

export type TreemapChartSlot = 'root' | 'cell' | 'label' | 'legend';

// ── Context ──

interface TreemapChartCtxValue extends TreemapChartContext {
  width: number;
  height: number;
  classNames: ClassNames<TreemapChartSlot> | undefined;
  styles: Styles<TreemapChartSlot> | undefined;
}

const TreemapChartCtx = createContext<TreemapChartCtxValue | null>(null);

function useTreemapChartCtx(): TreemapChartCtxValue {
  const c = useContext(TreemapChartCtx);
  if (!c) throw new Error('TreemapChart compound sub-components must be used within <TreemapChart>.');
  return c;
}

// ── Sub: Cell ──

export interface TreemapChartCellProps { className?: string; }

export const TreemapChartCell = forwardRef<SVGGElement, TreemapChartCellProps>(
  function TreemapChartCell(props, ref) {
    const { className } = props;
    const ctx = useTreemapChartCtx();
    const slot = getSlotProps('cell', cellStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <g ref={ref} data-testid="treemap-chart-cell">
        {ctx.cells.map((c, i) => (
          <rect
            key={i}
            x={c.x}
            y={c.y}
            width={c.width}
            height={c.height}
            fill={c.color}
            className={cls}
            style={slot.style}
            data-testid="treemap-chart-cell-rect"
          />
        ))}
      </g>
    );
  },
);

// ── Sub: Label ──

export interface TreemapChartLabelProps { className?: string; }

export const TreemapChartLabel = forwardRef<SVGGElement, TreemapChartLabelProps>(
  function TreemapChartLabel(props, ref) {
    const { className } = props;
    const ctx = useTreemapChartCtx();
    const slot = getSlotProps('label', labelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <g ref={ref} data-testid="treemap-chart-label">
        {ctx.cells.map((c, i) => (
          <text
            key={i}
            x={c.labelPos.x}
            y={c.labelPos.y}
            className={cls}
            style={slot.style}
            data-testid="treemap-chart-label-text"
          >
            {c.name}
          </text>
        ))}
      </g>
    );
  },
);

// ── Sub: Legend ──

export interface TreemapChartLegendProps { className?: string; }

export const TreemapChartLegend = forwardRef<HTMLDivElement, TreemapChartLegendProps>(
  function TreemapChartLegend(props, ref) {
    const { className } = props;
    const ctx = useTreemapChartCtx();
    const slot = getSlotProps('legend', legendStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const topLevel = ctx.cells.filter((c) => c.depth === 0);

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="treemap-chart-legend">
        {topLevel.map((c, i) => (
          <span key={i} className={legendItemStyle}>
            <span className={legendDotStyle} style={{ backgroundColor: c.color }} />
            {c.name}: {c.value}
          </span>
        ))}
      </div>
    );
  },
);

// ── Props ──

export interface TreemapChartComponentProps extends SlotStyleProps<TreemapChartSlot>, UseTreemapChartProps {
  showLabels?: boolean;
  showLegend?: boolean;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ──

export const TreemapChartBase = forwardRef<HTMLDivElement, TreemapChartComponentProps>(
  function TreemapChart(props, ref) {
    const {
      data, width = 400, height = 300, padding,
      showLabels = true, showLegend = true,
      children, className, style: styleProp, classNames, styles,
    } = props;

    const chart = useTreemapChart({ data, width, height, padding });
    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue: TreemapChartCtxValue = { ...chart, width, height, classNames, styles };

    if (children) {
      return (
        <TreemapChartCtx.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="treemap-chart-root">
            <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label="Treemap chart">{children}</svg>
          </div>
        </TreemapChartCtx.Provider>
      );
    }

    const cSlot = getSlotProps('cell', cellStyle, classNames, styles);
    const lSlot = getSlotProps('label', labelStyle, classNames, styles);

    return (
      <TreemapChartCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="treemap-chart-root">
          <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label="Treemap chart">
            {chart.cells.map((c, i) => (
              <g key={i}>
                <rect
                  x={c.x}
                  y={c.y}
                  width={c.width}
                  height={c.height}
                  fill={c.color}
                  className={cSlot.className}
                  style={cSlot.style}
                  data-testid="treemap-chart-cell-rect"
                />
                {showLabels && (
                  <text
                    x={c.labelPos.x}
                    y={c.labelPos.y}
                    className={lSlot.className}
                    style={lSlot.style}
                    data-testid="treemap-chart-label-text"
                  >
                    {c.name}
                  </text>
                )}
              </g>
            ))}
          </svg>
          {showLegend && <TreemapChartLegend />}
        </div>
      </TreemapChartCtx.Provider>
    );
  },
);

/**
 * TreemapChart bilesen — Dual API (props-based + compound).
 */
export const TreemapChart = Object.assign(TreemapChartBase, {
  Cell: TreemapChartCell,
  Label: TreemapChartLabel,
  Legend: TreemapChartLegend,
});
