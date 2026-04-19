/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * PyramidChart — katmanli ucgen grafik bilesen (Dual API).
 * PyramidChart — layered pyramid chart component (Dual API).
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { PyramidSegment, ComputedPyramidSegment } from '@relteco/relui-core';
import { getChartColor } from '@relteco/relui-core';
import { rootStyle, segmentStyle, labelStyle } from './pyramid-chart.css';
import { usePyramidChart } from './usePyramidChart';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type PyramidChartSlot = 'root' | 'segment' | 'label';

interface PyramidChartCtxValue {
  segments: ReadonlyArray<ComputedPyramidSegment>;
  width: number;
  height: number;
  classNames: ClassNames<PyramidChartSlot> | undefined;
  styles: Styles<PyramidChartSlot> | undefined;
}

const PyramidChartCtx = createContext<PyramidChartCtxValue | null>(null);
function usePyramidChartContext(): PyramidChartCtxValue {
  const c = useContext(PyramidChartCtx);
  if (!c) throw new Error('PyramidChart compound sub-components must be used within <PyramidChart>.');
  return c;
}

export interface PyramidChartSegmentsProps { className?: string }
const PyramidChartSegments = forwardRef<SVGGElement, PyramidChartSegmentsProps>(
  function PyramidChartSegments(props, ref) {
    const { className } = props;
    const ctx = usePyramidChartContext();
    const sSlot = getSlotProps('segment', segmentStyle, ctx.classNames, ctx.styles);
    const sCls = className ? `${sSlot.className} ${className}` : sSlot.className;
    const w = ctx.width;
    const h = ctx.height;
    const cx = w / 2;

    return (
      <g ref={ref} data-testid="pyramidchart-segments">
        {ctx.segments.map((seg, i) => {
          const y1 = seg.y * h;
          const y2 = (seg.y + seg.height) * h;
          const tw = seg.topWidth * w * 0.45;
          const bw = seg.bottomWidth * w * 0.45;

          const points = `${cx - tw},${y1} ${cx + tw},${y1} ${cx + bw},${y2} ${cx - bw},${y2}`;

          return (
            <polygon key={i} points={points} fill={getChartColor(i)}
              className={sCls} style={sSlot.style} data-testid="pyramidchart-segment" />
          );
        })}
      </g>
    );
  },
);

export interface PyramidChartLabelsProps { className?: string }
const PyramidChartLabels = forwardRef<SVGGElement, PyramidChartLabelsProps>(
  function PyramidChartLabels(props, ref) {
    const { className } = props;
    const ctx = usePyramidChartContext();
    const lSlot = getSlotProps('label', labelStyle, ctx.classNames, ctx.styles);
    const lCls = className ? `${lSlot.className} ${className}` : lSlot.className;
    const h = ctx.height;
    const rightX = ctx.width * 0.78;

    return (
      <g ref={ref} data-testid="pyramidchart-labels">
        {ctx.segments.map((seg, i) => (
          <text key={i} x={rightX} y={seg.y * h + (seg.height * h) / 2 + 4}
            className={lCls} style={lSlot.style} data-testid="pyramidchart-label">
            {seg.label} ({seg.percentage.toFixed(1)}%)
          </text>
        ))}
      </g>
    );
  },
);

export interface PyramidChartComponentProps extends SlotStyleProps<PyramidChartSlot> {
  data: PyramidSegment[];
  width?: number;
  height?: number;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const PyramidChartBase = forwardRef<HTMLDivElement, PyramidChartComponentProps>(
  function PyramidChart(props, ref) {
    const { data, width = 400, height = 300, children, className, style: styleProp, classNames, styles } = props;
    const { context } = usePyramidChart({ data });

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue: PyramidChartCtxValue = { segments: context.segments, width, height, classNames, styles };

    if (children) {
      return (<PyramidChartCtx.Provider value={ctxValue}><div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="pyramidchart-root">{children}</div></PyramidChartCtx.Provider>);
    }

    return (
      <PyramidChartCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="pyramidchart-root">
          <svg viewBox={`0 0 ${width} ${height}`} width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Pyramid chart" data-testid="pyramidchart-svg">
            <PyramidChartSegments />
            <PyramidChartLabels />
          </svg>
        </div>
      </PyramidChartCtx.Provider>
    );
  },
);

export const PyramidChart = Object.assign(PyramidChartBase, { Segments: PyramidChartSegments, Labels: PyramidChartLabels });
