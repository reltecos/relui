/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { BoxPlotChartConfig, BoxPlotChartContext, BoxPlotChartEvent, BoxPlotChartAPI } from './box-plot-chart.types';

export function createBoxPlotChart(_config: BoxPlotChartConfig): BoxPlotChartAPI {
  let tooltipIndex: number | null = null;
  let tooltipX = 0;
  let tooltipY = 0;
  const listeners = new Set<() => void>();
  function notify(): void { for (const fn of listeners) fn(); }

  return {
    getContext(): BoxPlotChartContext { return { tooltipIndex, tooltipX, tooltipY }; },
    send(event: BoxPlotChartEvent) {
      switch (event.type) {
        case 'SET_TOOLTIP': tooltipIndex = event.index; tooltipX = event.x; tooltipY = event.y; notify(); break;
        case 'CLEAR_TOOLTIP': if (tooltipIndex === null) return; tooltipIndex = null; notify(); break;
      }
    },
    subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; },
    destroy() { listeners.clear(); },
  };
}
