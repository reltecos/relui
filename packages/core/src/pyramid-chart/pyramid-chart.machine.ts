/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { PyramidChartConfig, PyramidChartContext, PyramidChartEvent, PyramidChartAPI, ComputedPyramidSegment } from './pyramid-chart.types';

function computeSegments(config: PyramidChartConfig): ComputedPyramidSegment[] {
  const total = config.data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return [];
  const n = config.data.length;
  const segHeight = 1 / n;
  return config.data.map((d, i) => ({
    label: d.label,
    value: d.value,
    percentage: (d.value / total) * 100,
    topWidth: 1 - (i / n),
    bottomWidth: 1 - ((i + 1) / n),
    y: i * segHeight,
    height: segHeight,
  }));
}

export function createPyramidChart(config: PyramidChartConfig): PyramidChartAPI {
  const segments = computeSegments(config);
  let tooltipIndex: number | null = null;
  let tooltipX = 0;
  let tooltipY = 0;
  const listeners = new Set<() => void>();
  function notify(): void { for (const fn of listeners) fn(); }

  return {
    getContext(): PyramidChartContext { return { segments, tooltipIndex, tooltipX, tooltipY }; },
    send(event: PyramidChartEvent) {
      switch (event.type) {
        case 'SET_TOOLTIP': tooltipIndex = event.index; tooltipX = event.x; tooltipY = event.y; notify(); break;
        case 'CLEAR_TOOLTIP': if (tooltipIndex === null) return; tooltipIndex = null; notify(); break;
      }
    },
    subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; },
    destroy() { listeners.clear(); },
  };
}
