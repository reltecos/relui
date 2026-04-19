/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * BulletChart — kompakt performans gosterge bilesen (Dual API).
 * BulletChart — compact performance indicator component (Dual API).
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { BulletDataPoint } from '@relteco/relui-core';
import { linearScale } from '@relteco/relui-core';
import { rootStyle, barStyle, targetStyle, rangeStyle, labelStyle } from './bullet-chart.css';
import { useBulletChart } from './useBulletChart';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type BulletChartSlot = 'root' | 'bar' | 'target' | 'range' | 'label';

interface BulletChartCtxValue {
  data: BulletDataPoint[];
  width: number;
  height: number;
  classNames: ClassNames<BulletChartSlot> | undefined;
  styles: Styles<BulletChartSlot> | undefined;
}

const BulletChartCtx = createContext<BulletChartCtxValue | null>(null);
function useBulletChartContext(): BulletChartCtxValue {
  const c = useContext(BulletChartCtx);
  if (!c) throw new Error('BulletChart compound sub-components must be used within <BulletChart>.');
  return c;
}

const RANGE_OPACITIES = [0.25, 0.45, 0.65];

// ── Sub: Bars ──

export interface BulletChartBarsProps { className?: string }
const BulletChartBars = forwardRef<SVGGElement, BulletChartBarsProps>(
  function BulletChartBars(props, ref) {
    const { className } = props;
    const ctx = useBulletChartContext();
    const bSlot = getSlotProps('bar', barStyle, ctx.classNames, ctx.styles);
    const rSlot = getSlotProps('range', rangeStyle, ctx.classNames, ctx.styles);
    const tSlot = getSlotProps('target', targetStyle, ctx.classNames, ctx.styles);
    const lSlot = getSlotProps('label', labelStyle, ctx.classNames, ctx.styles);
    const bCls = className ? `${bSlot.className} ${className}` : bSlot.className;
    const barH = 24;
    const rowH = barH + 30;

    return (
      <g ref={ref} data-testid="bulletchart-bar">
        {ctx.data.map((d, i) => {
          const maxVal = Math.max(d.target, d.value, ...(d.ranges.map((r) => r.value)));
          const xScale = linearScale(0, maxVal, 0, ctx.width);
          const y = i * rowH;

          return (
            <g key={i}>
              {/* Ranges */}
              {d.ranges.map((r, ri) => (
                <rect key={ri} x={0} y={y} width={xScale(r.value)} height={barH}
                  fill="var(--rel-color-primary, #3b82f6)" opacity={RANGE_OPACITIES[ri] ?? 0.3}
                  className={rSlot.className} style={rSlot.style} data-testid="bulletchart-range" />
              ))}
              {/* Value bar */}
              <rect x={0} y={y + barH * 0.25} width={xScale(d.value)} height={barH * 0.5}
                fill="var(--rel-color-text, #374151)" className={bCls} style={bSlot.style} />
              {/* Target line */}
              <line x1={xScale(d.target)} y1={y + 2} x2={xScale(d.target)} y2={y + barH - 2}
                stroke="var(--rel-color-error, #ef4444)" className={tSlot.className} style={tSlot.style}
                strokeWidth={2} data-testid="bulletchart-target" />
              {/* Label */}
              <text x={0} y={y + barH + 16} className={lSlot.className} style={lSlot.style} data-testid="bulletchart-label">
                {d.label}
              </text>
            </g>
          );
        })}
      </g>
    );
  },
);

// ── Props ──

export interface BulletChartComponentProps extends SlotStyleProps<BulletChartSlot> {
  data: BulletDataPoint[];
  width?: number;
  height?: number;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const BulletChartBase = forwardRef<HTMLDivElement, BulletChartComponentProps>(
  function BulletChart(props, ref) {
    const { data, width = 400, height: heightProp, children, className, style: styleProp, classNames, styles } = props;
    useBulletChart({ data });
    const h = heightProp ?? Math.max(data.length * 54, 60);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue: BulletChartCtxValue = { data, width, height: h, classNames, styles };

    if (children) {
      return (<BulletChartCtx.Provider value={ctxValue}><div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="bulletchart-root">{children}</div></BulletChartCtx.Provider>);
    }

    return (
      <BulletChartCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="bulletchart-root">
          <svg viewBox={`0 0 ${width} ${h}`} width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Bullet chart" data-testid="bulletchart-svg">
            <BulletChartBars />
          </svg>
        </div>
      </BulletChartCtx.Provider>
    );
  },
);

export const BulletChart = Object.assign(BulletChartBase, { Bars: BulletChartBars });
