/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * LineChart state machine — cizgi grafik hesaplamalari.
 * LineChart state machine — line chart calculations.
 *
 * @packageDocumentation
 */

import type {
  LineChartConfig,
  LineChartContext,
  LineChartEvent,
  LineChartAPI,
  LineSeries,
  LineComputedSeries,
  ChartMargin,
} from './line-chart.types';
import { linearScale } from '../chart-utils/scales';
import { generateTicks } from '../chart-utils/ticks';
import { pointsToSvgPath, pointsToAreaPath } from '../chart-utils/geometry';
import { getChartColor } from '../chart-utils/colors';

const DEFAULT_MARGIN: ChartMargin = { top: 20, right: 20, bottom: 30, left: 40 };

function computeSeries(
  series: readonly LineSeries[],
  width: number,
  height: number,
  margin: ChartMargin,
): LineChartContext {
  // Find domains
  let xMin = Infinity;
  let xMax = -Infinity;
  let yMin = Infinity;
  let yMax = -Infinity;

  for (const s of series) {
    for (const p of s.data) {
      if (p.x < xMin) xMin = p.x;
      if (p.x > xMax) xMax = p.x;
      if (p.y < yMin) yMin = p.y;
      if (p.y > yMax) yMax = p.y;
    }
  }

  if (!isFinite(xMin)) { xMin = 0; xMax = 1; yMin = 0; yMax = 1; }
  if (xMin === xMax) xMax = xMin + 1;
  if (yMin === yMax) yMax = yMin + 1;
  if (yMin > 0) yMin = 0;

  const plotX = margin.left;
  const plotY = margin.top;
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;

  const xScale = linearScale(xMin, xMax, plotX, plotX + plotW);
  const yScale = linearScale(yMin, yMax, plotY + plotH, plotY);

  const xTicks = generateTicks(xMin, xMax, 5);
  const yTicks = generateTicks(yMin, yMax, 5);

  const computedSeries: LineComputedSeries[] = series.map((s, i) => {
    const scaled = s.data.map((p) => ({
      x: xScale(p.x),
      y: yScale(p.y),
      dataX: p.x,
      dataY: p.y,
    }));
    const path = pointsToSvgPath(scaled);
    const areaPath = pointsToAreaPath(scaled, plotY + plotH);
    const color = s.color ?? getChartColor(i);
    return { name: s.name, path, areaPath, points: scaled, color };
  });

  return {
    computedSeries,
    xTicks,
    yTicks,
    xDomain: [xMin, xMax],
    yDomain: [yMin, yMax],
    width,
    height,
    plotArea: { x: plotX, y: plotY, width: plotW, height: plotH },
  };
}

/**
 * LineChart state machine olusturur.
 * Creates a LineChart state machine.
 */
export function createLineChart(config: LineChartConfig = {}): LineChartAPI {
  let series: LineSeries[] = config.series ? [...config.series] : [];
  let width = config.width ?? 400;
  let height = config.height ?? 300;
  const margin: ChartMargin = { ...DEFAULT_MARGIN, ...config.margin };

  const listeners = new Set<() => void>();
  function notify(): void { listeners.forEach((fn) => fn()); }

  function send(event: LineChartEvent): void {
    switch (event.type) {
      case 'SET_SERIES': {
        series = [...event.series];
        notify();
        break;
      }
      case 'SET_SIZE': {
        if (event.width === width && event.height === height) return;
        width = event.width;
        height = event.height;
        notify();
        break;
      }
    }
  }

  return {
    getContext: () => computeSeries(series, width, height, margin),
    send,
    subscribe(cb: () => void) { listeners.add(cb); return () => { listeners.delete(cb); }; },
    destroy() { listeners.clear(); },
  };
}
