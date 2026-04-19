/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { WaterfallChartConfig, WaterfallChartContext, WaterfallChartEvent, WaterfallChartAPI, ComputedWaterfallBar } from './waterfall-chart.types';

function computeBars(config: WaterfallChartConfig): ComputedWaterfallBar[] {
  const bars: ComputedWaterfallBar[] = [];
  let runningTotal = 0;
  for (const d of config.data) {
    if (d.type === 'total') {
      bars.push({ label: d.label, value: runningTotal, type: 'total', start: 0, end: runningTotal });
    } else {
      const start = runningTotal;
      runningTotal += d.type === 'increase' ? d.value : -d.value;
      bars.push({ label: d.label, value: d.value, type: d.type, start, end: runningTotal });
    }
  }
  return bars;
}

export function createWaterfallChart(config: WaterfallChartConfig): WaterfallChartAPI {
  const bars = computeBars(config);
  let tooltipIndex: number | null = null;
  let tooltipX = 0;
  let tooltipY = 0;
  const listeners = new Set<() => void>();
  function notify(): void { for (const fn of listeners) fn(); }

  return {
    getContext(): WaterfallChartContext { return { bars, tooltipIndex, tooltipX, tooltipY }; },
    send(event: WaterfallChartEvent) {
      switch (event.type) {
        case 'SET_TOOLTIP': tooltipIndex = event.index; tooltipX = event.x; tooltipY = event.y; notify(); break;
        case 'CLEAR_TOOLTIP': if (tooltipIndex === null) return; tooltipIndex = null; notify(); break;
      }
    },
    subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; },
    destroy() { listeners.clear(); },
  };
}
