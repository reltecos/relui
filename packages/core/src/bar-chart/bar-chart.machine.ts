/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * BarChart state machine — cubuk grafik hesaplamalari.
 * BarChart state machine — bar chart calculations.
 *
 * @packageDocumentation
 */

import type {
  BarChartConfig,
  BarChartContext,
  BarChartEvent,
  BarChartAPI,
  BarSeries,
  BarChartMode,
  BarChartOrientation,
  ComputedBar,
} from './bar-chart.types';
import { linearScale, bandScale } from '../chart-utils/scales';
import { generateTicks } from '../chart-utils/ticks';
import { getChartColor } from '../chart-utils/colors';

const MARGIN = { top: 20, right: 20, bottom: 30, left: 40 };

function computeBars(
  series: readonly BarSeries[],
  categories: readonly string[],
  mode: BarChartMode,
  orientation: BarChartOrientation,
  width: number,
  height: number,
): Omit<BarChartContext, 'series' | 'mode' | 'orientation' | 'width' | 'height'> {
  const plotX = MARGIN.left;
  const plotY = MARGIN.top;
  const plotW = width - MARGIN.left - MARGIN.right;
  const plotH = height - MARGIN.top - MARGIN.bottom;
  const plotArea = { x: plotX, y: plotY, width: plotW, height: plotH };

  if (categories.length === 0 || series.length === 0) {
    return { bars: [], categories, xTicks: [], yTicks: [], yMax: 0, plotArea };
  }

  // Calculate yMax
  let yMax = 0;
  if (mode === 'stacked') {
    for (let ci = 0; ci < categories.length; ci++) {
      let stack = 0;
      for (const s of series) {
        stack += s.data[ci] ?? 0;
      }
      if (stack > yMax) yMax = stack;
    }
  } else {
    for (const s of series) {
      for (const v of s.data) {
        if (v > yMax) yMax = v;
      }
    }
  }
  if (yMax === 0) yMax = 1;

  const catScale = bandScale(categories as string[], plotX, plotX + plotW, 0.2);
  const valScale = linearScale(0, yMax, plotY + plotH, plotY);
  const yTicks = generateTicks(0, yMax, 5);

  const bars: ComputedBar[] = [];
  const seriesCount = series.length;

  for (let ci = 0; ci < categories.length; ci++) {
    const cat = categories[ci] ?? '';
    const band = catScale(cat);
    let stackY = plotY + plotH;

    for (let si = 0; si < seriesCount; si++) {
      const s = series[si];
      if (!s) continue;
      const value = s.data[ci] ?? 0;
      const color = s.color ?? getChartColor(si);

      if (orientation === 'vertical') {
        if (mode === 'grouped') {
          const groupWidth = band.width / seriesCount;
          const barX = band.x + si * groupWidth;
          const barH = (plotY + plotH) - valScale(value);
          bars.push({
            x: barX,
            y: valScale(value),
            width: groupWidth,
            height: barH,
            color,
            value,
            seriesName: s.name,
            category: cat,
          });
        } else {
          const barH = (plotY + plotH) - valScale(value);
          bars.push({
            x: band.x,
            y: stackY - barH,
            width: band.width,
            height: barH,
            color,
            value,
            seriesName: s.name,
            category: cat,
          });
          stackY -= barH;
        }
      } else {
        // Horizontal
        const hScale = linearScale(0, yMax, plotX, plotX + plotW);
        const hCatScale = bandScale(categories as string[], plotY, plotY + plotH, 0.2);
        const hBand = hCatScale(cat);

        if (mode === 'grouped') {
          const groupH = hBand.width / seriesCount;
          bars.push({
            x: plotX,
            y: hBand.x + si * groupH,
            width: hScale(value) - plotX,
            height: groupH,
            color,
            value,
            seriesName: s.name,
            category: cat,
          });
        } else {
          const barW = hScale(value) - plotX;
          bars.push({
            x: stackY === plotY + plotH ? plotX : stackY,
            y: hBand.x,
            width: barW,
            height: hBand.width,
            color,
            value,
            seriesName: s.name,
            category: cat,
          });
        }
      }
    }
  }

  return {
    bars,
    categories,
    xTicks: [...categories],
    yTicks,
    yMax,
    plotArea,
  };
}

/**
 * BarChart state machine olusturur.
 * Creates a BarChart state machine.
 */
export function createBarChart(config: BarChartConfig = {}): BarChartAPI {
  let series: BarSeries[] = config.series ? [...config.series] : [];
  let categories: string[] = config.categories ? [...config.categories] : [];
  let mode: BarChartMode = config.mode ?? 'grouped';
  const orientation: BarChartOrientation = config.orientation ?? 'vertical';
  let width = config.width ?? 400;
  let height = config.height ?? 300;

  const listeners = new Set<() => void>();
  function notify(): void { listeners.forEach((fn) => fn()); }

  function send(event: BarChartEvent): void {
    switch (event.type) {
      case 'SET_SERIES': { series = [...event.series]; notify(); break; }
      case 'SET_CATEGORIES': { categories = [...event.categories]; notify(); break; }
      case 'SET_SIZE': {
        if (event.width === width && event.height === height) return;
        width = event.width; height = event.height; notify(); break;
      }
      case 'SET_MODE': {
        if (event.mode === mode) return;
        mode = event.mode; notify(); break;
      }
    }
  }

  return {
    getContext: () => ({
      ...computeBars(series, categories, mode, orientation, width, height),
      series,
      mode,
      orientation,
      width,
      height,
    }),
    send,
    subscribe(cb) { listeners.add(cb); return () => { listeners.delete(cb); }; },
    destroy() { listeners.clear(); },
  };
}
