/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * WaterfallChart — kumulatif artis/azalis grafik bilesen (Dual API).
 * WaterfallChart — cumulative increase/decrease chart component (Dual API).
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { WaterfallDataPoint, ComputedWaterfallBar } from '@relteco/relui-core';
import { linearScale, bandScale } from '@relteco/relui-core';
import { rootStyle, barStyle, connectorStyle, axisStyle } from './waterfall-chart.css';
import { useWaterfallChart } from './useWaterfallChart';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type WaterfallChartSlot = 'root' | 'bar' | 'connector' | 'axis';

interface WaterfallChartCtxValue {
  bars: ReadonlyArray<ComputedWaterfallBar>;
  width: number;
  height: number;
  padding: { top: number; right: number; bottom: number; left: number };
  classNames: ClassNames<WaterfallChartSlot> | undefined;
  styles: Styles<WaterfallChartSlot> | undefined;
}

const WaterfallChartCtx = createContext<WaterfallChartCtxValue | null>(null);
function useWaterfallChartContext(): WaterfallChartCtxValue {
  const c = useContext(WaterfallChartCtx);
  if (!c) throw new Error('WaterfallChart compound sub-components must be used within <WaterfallChart>.');
  return c;
}

const TYPE_COLORS: Record<string, string> = {
  increase: 'var(--rel-color-success, #10b981)',
  decrease: 'var(--rel-color-error, #ef4444)',
  total: 'var(--rel-color-primary, #3b82f6)',
};

export interface WaterfallChartBarsProps { className?: string }
const WaterfallChartBars = forwardRef<SVGGElement, WaterfallChartBarsProps>(
  function WaterfallChartBars(props, ref) {
    const { className } = props;
    const ctx = useWaterfallChartContext();
    const bSlot = getSlotProps('bar', barStyle, ctx.classNames, ctx.styles);
    const cSlot = getSlotProps('connector', connectorStyle, ctx.classNames, ctx.styles);
    const bCls = className ? `${bSlot.className} ${className}` : bSlot.className;
    const pa = ctx.padding;
    const plotW = ctx.width - pa.left - pa.right;
    const plotH = ctx.height - pa.top - pa.bottom;

    const allVals = ctx.bars.flatMap((b) => [b.start, b.end]);
    const minVal = Math.min(0, ...allVals);
    const maxVal = Math.max(0, ...allVals);
    const yScale = linearScale(minVal, maxVal, pa.top + plotH, pa.top);
    const labels = ctx.bars.map((b) => b.label);
    const xScale = bandScale(labels, pa.left, pa.left + plotW, 0.2);

    return (
      <g ref={ref} data-testid="waterfallchart-bar">
        {ctx.bars.map((b, i) => {
          const band = xScale(b.label);
          const y1 = yScale(Math.max(b.start, b.end));
          const y2 = yScale(Math.min(b.start, b.end));
          const barH = Math.max(y2 - y1, 1);
          const fill = TYPE_COLORS[b.type] ?? TYPE_COLORS['total'];

          return (
            <g key={i}>
              <rect x={band.x} y={y1} width={band.width} height={barH} fill={fill}
                rx={2} className={bCls} style={bSlot.style} data-testid="waterfallchart-rect" />
              {/* Connector line */}
              {i < ctx.bars.length - 1 && (
                <line x1={band.x + band.width} y1={yScale(b.end)}
                  x2={xScale(ctx.bars[i + 1]?.label ?? '').x} y2={yScale(b.end)}
                  stroke="var(--rel-color-border, #d1d5db)" strokeWidth={1}
                  className={cSlot.className} style={cSlot.style} data-testid="waterfallchart-connector" />
              )}
            </g>
          );
        })}
      </g>
    );
  },
);

export interface WaterfallChartAxisProps { className?: string }
const WaterfallChartAxis = forwardRef<SVGGElement, WaterfallChartAxisProps>(
  function WaterfallChartAxis(props, ref) {
    const { className } = props;
    const ctx = useWaterfallChartContext();
    const aSlot = getSlotProps('axis', axisStyle, ctx.classNames, ctx.styles);
    const aCls = className ? `${aSlot.className} ${className}` : aSlot.className;
    const pa = ctx.padding;
    const plotW = ctx.width - pa.left - pa.right;
    const labels = ctx.bars.map((b) => b.label);
    const xScale = bandScale(labels, pa.left, pa.left + plotW, 0.2);

    return (
      <g ref={ref} data-testid="waterfallchart-axis">
        {labels.map((l) => {
          const band = xScale(l);
          return (
            <text key={l} x={band.x + band.width / 2} y={ctx.height - 4}
              textAnchor="middle" className={aCls} style={aSlot.style} data-testid="waterfallchart-axisLabel">
              {l}
            </text>
          );
        })}
      </g>
    );
  },
);

export interface WaterfallChartComponentProps extends SlotStyleProps<WaterfallChartSlot> {
  data: WaterfallDataPoint[];
  width?: number;
  height?: number;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const WaterfallChartBase = forwardRef<HTMLDivElement, WaterfallChartComponentProps>(
  function WaterfallChart(props, ref) {
    const { data, width = 500, height = 300, children, className, style: styleProp, classNames, styles } = props;
    const { context } = useWaterfallChart({ data });
    const padding = { top: 20, right: 20, bottom: 30, left: 20 };

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue: WaterfallChartCtxValue = { bars: context.bars, width, height, padding, classNames, styles };

    if (children) {
      return (<WaterfallChartCtx.Provider value={ctxValue}><div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="waterfallchart-root">{children}</div></WaterfallChartCtx.Provider>);
    }

    return (
      <WaterfallChartCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="waterfallchart-root">
          <svg viewBox={`0 0 ${width} ${height}`} width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Waterfall chart" data-testid="waterfallchart-svg">
            <WaterfallChartBars />
            <WaterfallChartAxis />
          </svg>
        </div>
      </WaterfallChartCtx.Provider>
    );
  },
);

export const WaterfallChart = Object.assign(WaterfallChartBase, { Bars: WaterfallChartBars, Axis: WaterfallChartAxis });
