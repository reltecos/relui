/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * BoxPlotChart — istatistiksel dagilim grafik bilesen (Dual API).
 * BoxPlotChart — statistical distribution chart component (Dual API).
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { BoxPlotData } from '@relteco/relui-core';
import { linearScale, bandScale } from '@relteco/relui-core';
import { rootStyle, boxStyle, whiskerStyle, medianStyle, outlierStyle, axisStyle } from './box-plot-chart.css';
import { useBoxPlotChart } from './useBoxPlotChart';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type BoxPlotChartSlot = 'root' | 'box' | 'whisker' | 'median' | 'outlier' | 'axis';

interface BoxPlotChartCtxValue {
  data: BoxPlotData[];
  width: number;
  height: number;
  padding: { top: number; right: number; bottom: number; left: number };
  classNames: ClassNames<BoxPlotChartSlot> | undefined;
  styles: Styles<BoxPlotChartSlot> | undefined;
}

const BoxPlotChartCtx = createContext<BoxPlotChartCtxValue | null>(null);
function useBoxPlotChartContext(): BoxPlotChartCtxValue {
  const c = useContext(BoxPlotChartCtx);
  if (!c) throw new Error('BoxPlotChart compound sub-components must be used within <BoxPlotChart>.');
  return c;
}

export interface BoxPlotChartBoxesProps { className?: string }
const BoxPlotChartBoxes = forwardRef<SVGGElement, BoxPlotChartBoxesProps>(
  function BoxPlotChartBoxes(props, ref) {
    const { className } = props;
    const ctx = useBoxPlotChartContext();
    const bSlot = getSlotProps('box', boxStyle, ctx.classNames, ctx.styles);
    const wSlot = getSlotProps('whisker', whiskerStyle, ctx.classNames, ctx.styles);
    const mSlot = getSlotProps('median', medianStyle, ctx.classNames, ctx.styles);
    const oSlot = getSlotProps('outlier', outlierStyle, ctx.classNames, ctx.styles);
    const bCls = className ? `${bSlot.className} ${className}` : bSlot.className;
    const pa = ctx.padding;
    const plotW = ctx.width - pa.left - pa.right;
    const plotH = ctx.height - pa.top - pa.bottom;

    const allVals = ctx.data.flatMap((d) => [d.min, d.max, ...(d.outliers ?? [])]);
    const minVal = Math.min(...allVals);
    const maxVal = Math.max(...allVals);
    const yScale = linearScale(minVal, maxVal, pa.top + plotH, pa.top);
    const labels = ctx.data.map((d) => d.label);
    const xScale = bandScale(labels, pa.left, pa.left + plotW, 0.3);

    return (
      <g ref={ref} data-testid="boxplotchart-boxes">
        {ctx.data.map((d, i) => {
          const band = xScale(d.label);
          const cx = band.x + band.width / 2;
          const bw = band.width * 0.6;

          return (
            <g key={i}>
              {/* Whisker lines */}
              <line x1={cx} y1={yScale(d.max)} x2={cx} y2={yScale(d.q3)}
                className={wSlot.className} style={wSlot.style} data-testid="boxplotchart-whisker" />
              <line x1={cx} y1={yScale(d.q1)} x2={cx} y2={yScale(d.min)}
                className={wSlot.className} style={wSlot.style} data-testid="boxplotchart-whisker" />
              {/* Whisker caps */}
              <line x1={cx - bw / 3} y1={yScale(d.max)} x2={cx + bw / 3} y2={yScale(d.max)}
                className={wSlot.className} style={wSlot.style} />
              <line x1={cx - bw / 3} y1={yScale(d.min)} x2={cx + bw / 3} y2={yScale(d.min)}
                className={wSlot.className} style={wSlot.style} />
              {/* Box */}
              <rect x={cx - bw / 2} y={yScale(d.q3)} width={bw} height={yScale(d.q1) - yScale(d.q3)}
                className={bCls} style={bSlot.style} data-testid="boxplotchart-box" />
              {/* Median */}
              <line x1={cx - bw / 2} y1={yScale(d.median)} x2={cx + bw / 2} y2={yScale(d.median)}
                className={mSlot.className} style={mSlot.style} data-testid="boxplotchart-median" />
              {/* Outliers */}
              {(d.outliers ?? []).map((o, oi) => (
                <circle key={oi} cx={cx} cy={yScale(o)} r={3}
                  className={oSlot.className} style={oSlot.style} data-testid="boxplotchart-outlier" />
              ))}
            </g>
          );
        })}
      </g>
    );
  },
);

export interface BoxPlotChartAxisProps { className?: string }
const BoxPlotChartAxis = forwardRef<SVGGElement, BoxPlotChartAxisProps>(
  function BoxPlotChartAxis(props, ref) {
    const { className } = props;
    const ctx = useBoxPlotChartContext();
    const aSlot = getSlotProps('axis', axisStyle, ctx.classNames, ctx.styles);
    const aCls = className ? `${aSlot.className} ${className}` : aSlot.className;
    const pa = ctx.padding;
    const plotW = ctx.width - pa.left - pa.right;
    const labels = ctx.data.map((d) => d.label);
    const xScale = bandScale(labels, pa.left, pa.left + plotW, 0.3);

    return (
      <g ref={ref} data-testid="boxplotchart-axis">
        {labels.map((l) => {
          const band = xScale(l);
          return <text key={l} x={band.x + band.width / 2} y={ctx.height - 4} textAnchor="middle"
            className={aCls} style={aSlot.style} data-testid="boxplotchart-axisLabel">{l}</text>;
        })}
      </g>
    );
  },
);

export interface BoxPlotChartComponentProps extends SlotStyleProps<BoxPlotChartSlot> {
  data: BoxPlotData[];
  width?: number;
  height?: number;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const BoxPlotChartBase = forwardRef<HTMLDivElement, BoxPlotChartComponentProps>(
  function BoxPlotChart(props, ref) {
    const { data, width = 500, height = 300, children, className, style: styleProp, classNames, styles } = props;
    useBoxPlotChart({ data });
    const padding = { top: 20, right: 20, bottom: 30, left: 20 };

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue: BoxPlotChartCtxValue = { data, width, height, padding, classNames, styles };

    if (children) {
      return (<BoxPlotChartCtx.Provider value={ctxValue}><div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="boxplotchart-root">{children}</div></BoxPlotChartCtx.Provider>);
    }

    return (
      <BoxPlotChartCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="boxplotchart-root">
          <svg viewBox={`0 0 ${width} ${height}`} width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Box plot chart" data-testid="boxplotchart-svg">
            <BoxPlotChartBoxes />
            <BoxPlotChartAxis />
          </svg>
        </div>
      </BoxPlotChartCtx.Provider>
    );
  },
);

export const BoxPlotChart = Object.assign(BoxPlotChartBase, { Boxes: BoxPlotChartBoxes, Axis: BoxPlotChartAxis });
