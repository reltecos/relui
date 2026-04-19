/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { StockChartConfig, StockChartContext, StockChartEvent, StockChartAPI, StockDataPoint, CandleData } from './stock-chart.types';
import { linearScale } from '../chart-utils';

export function createStockChart(config: StockChartConfig = {}): StockChartAPI {
  let data: StockDataPoint[] = [...(config.data ?? [])];
  const width = config.width ?? 600;
  const height = config.height ?? 400;
  const volumeRatio = (config.volumeHeight ?? 80) / height;
  const padding = config.padding ?? 10;
  const bullishColor = config.bullishColor ?? 'var(--rel-color-success, #16a34a)';
  const bearishColor = config.bearishColor ?? 'var(--rel-color-error, #dc2626)';

  const listeners = new Set<() => void>();
  function notify(): void { for (const fn of listeners) fn(); }

  function compute(): StockChartContext {
    if (data.length === 0) {
      return { candles: [], priceMin: 0, priceMax: 0, volumeMax: 0, chartWidth: width, chartHeight: height };
    }

    const priceMin = Math.min(...data.map((d) => d.low));
    const priceMax = Math.max(...data.map((d) => d.high));
    const volumeMax = Math.max(...data.map((d) => d.volume ?? 0), 1);

    const priceAreaHeight = height * (1 - volumeRatio) - padding * 2;
    const volumeAreaHeight = height * volumeRatio - padding;
    const volumeAreaTop = height - volumeAreaHeight - padding;

    const priceScale = linearScale(priceMin, priceMax, priceAreaHeight + padding, padding);
    const volumeScale = linearScale(0, volumeMax, 0, volumeAreaHeight);

    const n = data.length;
    const candleStep = (width - padding * 2) / n;
    const candleWidth = Math.max(1, candleStep * 0.7);
    const candleGap = (candleStep - candleWidth) / 2;

    const candles: CandleData[] = data.map((d, i) => {
      const isBullish = d.close >= d.open;
      const bodyTop = isBullish ? d.close : d.open;
      const bodyBottom = isBullish ? d.open : d.close;

      const x = padding + i * candleStep + candleGap;
      const bodyY = priceScale(bodyTop);
      const bodyH = Math.max(1, priceScale(bodyBottom) - priceScale(bodyTop));
      const wickY = priceScale(d.high);
      const wickH = priceScale(d.low) - priceScale(d.high);

      const vol = d.volume ?? 0;
      const vH = volumeScale(vol);
      const vY = volumeAreaTop + volumeAreaHeight - vH;

      return {
        date: d.date, open: d.open, high: d.high, low: d.low, close: d.close,
        volume: vol, x, bodyY, bodyHeight: bodyH, wickY, wickHeight: wickH,
        color: isBullish ? bullishColor : bearishColor,
        isBullish, width: candleWidth, volumeHeight: vH, volumeY: vY,
      };
    });

    return { candles, priceMin, priceMax, volumeMax, chartWidth: width, chartHeight: height };
  }

  function getContext(): StockChartContext { return compute(); }

  function send(event: StockChartEvent): void {
    switch (event.type) {
      case 'SET_DATA':
        data = [...event.data];
        notify();
        break;
    }
  }

  function subscribe(cb: () => void): () => void { listeners.add(cb); return () => { listeners.delete(cb); }; }
  function destroy(): void { listeners.clear(); }

  return { getContext, send, subscribe, destroy };
}
