/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * SunburstChart — cok katmanli pasta grafik bilesen (Dual API).
 * SunburstChart — multi-level sunburst chart component (Dual API).
 *
 * Props-based: `<SunburstChart data={data} />`
 * Compound:    `<SunburstChart data={data}><SunburstChart.Arc /><SunburstChart.Label /></SunburstChart>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { SunburstChartContext } from '@relteco/relui-core';
import {
  rootStyle, arcStyle, labelStyle,
  legendStyle, legendItemStyle, legendDotStyle,
} from './sunburst-chart.css';
import { useSunburstChart, type UseSunburstChartProps } from './useSunburstChart';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──

export type SunburstChartSlot = 'root' | 'arc' | 'label' | 'legend';

// ── Context ──

interface SunburstChartCtxValue extends SunburstChartContext {
  size: number;
  classNames: ClassNames<SunburstChartSlot> | undefined;
  styles: Styles<SunburstChartSlot> | undefined;
}

const SunburstChartCtx = createContext<SunburstChartCtxValue | null>(null);

function useSunburstChartCtx(): SunburstChartCtxValue {
  const c = useContext(SunburstChartCtx);
  if (!c) throw new Error('SunburstChart compound sub-components must be used within <SunburstChart>.');
  return c;
}

// ── Sub: Arc ──

export interface SunburstChartArcProps { className?: string; }

export const SunburstChartArc = forwardRef<SVGGElement, SunburstChartArcProps>(
  function SunburstChartArc(props, ref) {
    const { className } = props;
    const ctx = useSunburstChartCtx();
    const slot = getSlotProps('arc', arcStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <g ref={ref} data-testid="sunburst-chart-arc">
        {ctx.arcs.map((a, i) => (
          <path
            key={i}
            d={a.path}
            fill={a.color}
            className={cls}
            style={slot.style}
            data-testid="sunburst-chart-arc-path"
          />
        ))}
      </g>
    );
  },
);

// ── Sub: Label ──

export interface SunburstChartLabelProps { className?: string; }

export const SunburstChartLabel = forwardRef<SVGGElement, SunburstChartLabelProps>(
  function SunburstChartLabel(props, ref) {
    const { className } = props;
    const ctx = useSunburstChartCtx();
    const slot = getSlotProps('label', labelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <g ref={ref} data-testid="sunburst-chart-label">
        {ctx.arcs.map((a, i) => (
          <text
            key={i}
            x={a.labelPos.x}
            y={a.labelPos.y}
            className={cls}
            style={slot.style}
            data-testid="sunburst-chart-label-text"
          >
            {a.name}
          </text>
        ))}
      </g>
    );
  },
);

// ── Sub: Legend ──

export interface SunburstChartLegendProps { className?: string; }

export const SunburstChartLegend = forwardRef<HTMLDivElement, SunburstChartLegendProps>(
  function SunburstChartLegend(props, ref) {
    const { className } = props;
    const ctx = useSunburstChartCtx();
    const slot = getSlotProps('legend', legendStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const topLevel = ctx.arcs.filter((a) => a.depth === 0);

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="sunburst-chart-legend">
        {topLevel.map((a, i) => (
          <span key={i} className={legendItemStyle}>
            <span className={legendDotStyle} style={{ backgroundColor: a.color }} />
            {a.name}: {a.value}
          </span>
        ))}
      </div>
    );
  },
);

// ── Props ──

export interface SunburstChartComponentProps extends SlotStyleProps<SunburstChartSlot>, UseSunburstChartProps {
  showLabels?: boolean;
  showLegend?: boolean;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ──

export const SunburstChartBase = forwardRef<HTMLDivElement, SunburstChartComponentProps>(
  function SunburstChart(props, ref) {
    const {
      data, size = 200, innerRadius, maxDepth,
      showLabels = true, showLegend = true,
      children, className, style: styleProp, classNames, styles,
    } = props;

    const chart = useSunburstChart({ data, size, innerRadius, maxDepth });
    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue: SunburstChartCtxValue = { ...chart, size, classNames, styles };

    if (children) {
      return (
        <SunburstChartCtx.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="sunburst-chart-root">
            <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="Sunburst chart">{children}</svg>
          </div>
        </SunburstChartCtx.Provider>
      );
    }

    const aSlot = getSlotProps('arc', arcStyle, classNames, styles);
    const lSlot = getSlotProps('label', labelStyle, classNames, styles);

    return (
      <SunburstChartCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="sunburst-chart-root">
          <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="Sunburst chart">
            {chart.arcs.map((a, i) => (
              <g key={i}>
                <path
                  d={a.path}
                  fill={a.color}
                  className={aSlot.className}
                  style={aSlot.style}
                  data-testid="sunburst-chart-arc-path"
                />
                {showLabels && (
                  <text
                    x={a.labelPos.x}
                    y={a.labelPos.y}
                    className={lSlot.className}
                    style={lSlot.style}
                    data-testid="sunburst-chart-label-text"
                  >
                    {a.name}
                  </text>
                )}
              </g>
            ))}
          </svg>
          {showLegend && <SunburstChartLegend />}
        </div>
      </SunburstChartCtx.Provider>
    );
  },
);

/**
 * SunburstChart bilesen — Dual API (props-based + compound).
 */
export const SunburstChart = Object.assign(SunburstChartBase, {
  Arc: SunburstChartArc,
  Label: SunburstChartLabel,
  Legend: SunburstChartLegend,
});
