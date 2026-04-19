/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FunnelChart — donusum hunisi bilesen (Dual API).
 * FunnelChart — funnel chart component (Dual API).
 *
 * Props-based: `<FunnelChart layers={layers} />`
 * Compound:    `<FunnelChart layers={layers}><FunnelChart.Layer /><FunnelChart.Legend /></FunnelChart>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { FunnelChartContext } from '@relteco/relui-core';
import {
  rootStyle, layerStyle, labelStyle, legendStyle, legendItemStyle, legendDotStyle,
} from './funnel-chart.css';
import { useFunnelChart, type UseFunnelChartProps } from './useFunnelChart';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type FunnelChartSlot = 'root' | 'layer' | 'label' | 'legend';

interface FunnelChartCtxValue extends FunnelChartContext {
  width: number;
  height: number;
  classNames: ClassNames<FunnelChartSlot> | undefined;
  styles: Styles<FunnelChartSlot> | undefined;
}

const FunnelChartCtx = createContext<FunnelChartCtxValue | null>(null);

function useFunnelChartCtx(): FunnelChartCtxValue {
  const c = useContext(FunnelChartCtx);
  if (!c) throw new Error('FunnelChart compound sub-components must be used within <FunnelChart>.');
  return c;
}

// ── Sub: Layer ──

export interface FunnelChartLayerProps { className?: string; }

export const FunnelChartLayer = forwardRef<SVGGElement, FunnelChartLayerProps>(
  function FunnelChartLayer(props, ref) {
    const { className } = props;
    const ctx = useFunnelChartCtx();
    const slot = getSlotProps('layer', layerStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <g ref={ref} data-testid="funnel-chart-layer">
        {ctx.layers.map((l, i) => (
          <path key={i} d={l.path} fill={l.color} className={cls} style={slot.style} data-testid="funnel-chart-layer-path" />
        ))}
      </g>
    );
  },
);

// ── Sub: Label ──

export interface FunnelChartLabelProps { className?: string; }

export const FunnelChartLabel = forwardRef<SVGGElement, FunnelChartLabelProps>(
  function FunnelChartLabel(props, ref) {
    const { className } = props;
    const ctx = useFunnelChartCtx();
    const slot = getSlotProps('label', labelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <g ref={ref} data-testid="funnel-chart-label">
        {ctx.layers.map((l, i) => (
          <text key={i} x={l.labelPos.x} y={l.labelPos.y} className={cls} style={slot.style} data-testid="funnel-chart-label-text">
            {l.name} ({l.percentage.toFixed(0)}%)
          </text>
        ))}
      </g>
    );
  },
);

// ── Sub: Legend ──

export interface FunnelChartLegendProps { className?: string; }

export const FunnelChartLegend = forwardRef<HTMLDivElement, FunnelChartLegendProps>(
  function FunnelChartLegend(props, ref) {
    const { className } = props;
    const ctx = useFunnelChartCtx();
    const slot = getSlotProps('legend', legendStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="funnel-chart-legend">
        {ctx.layers.map((l, i) => (
          <span key={i} className={legendItemStyle}>
            <span className={legendDotStyle} style={{ backgroundColor: l.color }} />
            {l.name}: {l.value}
          </span>
        ))}
      </div>
    );
  },
);

// ── Props ──

export interface FunnelChartComponentProps extends SlotStyleProps<FunnelChartSlot>, UseFunnelChartProps {
  showLabels?: boolean;
  showLegend?: boolean;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ──

export const FunnelChartBase = forwardRef<HTMLDivElement, FunnelChartComponentProps>(
  function FunnelChart(props, ref) {
    const {
      layers: layersProp, width = 300, height = 300, padding,
      showLabels = true, showLegend = true,
      children, className, style: styleProp, classNames, styles,
    } = props;

    const chart = useFunnelChart({ layers: layersProp, width, height, padding });
    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue: FunnelChartCtxValue = { ...chart, width, height, classNames, styles };

    if (children) {
      return (
        <FunnelChartCtx.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="funnel-chart-root">
            <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label="Funnel chart">{children}</svg>
          </div>
        </FunnelChartCtx.Provider>
      );
    }

    const lSlot = getSlotProps('layer', layerStyle, classNames, styles);
    const lbSlot = getSlotProps('label', labelStyle, classNames, styles);

    return (
      <FunnelChartCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="funnel-chart-root">
          <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label="Funnel chart">
            {chart.layers.map((l, i) => (
              <g key={i}>
                <path d={l.path} fill={l.color} className={lSlot.className} style={lSlot.style} data-testid="funnel-chart-layer-path" />
                {showLabels && (
                  <text x={l.labelPos.x} y={l.labelPos.y} className={lbSlot.className} style={lbSlot.style} data-testid="funnel-chart-label-text">
                    {l.name} ({l.percentage.toFixed(0)}%)
                  </text>
                )}
              </g>
            ))}
          </svg>
          {showLegend && <FunnelChartLegend />}
        </div>
      </FunnelChartCtx.Provider>
    );
  },
);

export const FunnelChart = Object.assign(FunnelChartBase, {
  Layer: FunnelChartLayer,
  Label: FunnelChartLabel,
  Legend: FunnelChartLegend,
});
