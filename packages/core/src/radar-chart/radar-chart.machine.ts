/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * RadarChart state machine — polar chart hesaplamalari.
 *
 * @packageDocumentation
 */

import type {
  RadarChartConfig, RadarChartContext, RadarChartEvent, RadarChartAPI,
  RadarAxis, RadarSeries, RadarSeriesData, RadarGridLine, RadarAxisLine, RadarPoint,
} from './radar-chart.types';
import { polarToCartesian, getChartColor } from '../chart-utils';

export function createRadarChart(config: RadarChartConfig = {}): RadarChartAPI {
  let axes: RadarAxis[] = [...(config.axes ?? [])];
  let seriesData: RadarSeries[] = [...(config.series ?? [])];
  let gridLevels = config.gridLevels ?? 5;
  const size = config.size ?? 200;
  const padding = config.padding ?? 30;

  const cx = size / 2;
  const cy = size / 2;
  const radius = (size / 2) - padding;

  const listeners = new Set<() => void>();
  function notify(): void { for (const fn of listeners) fn(); }

  function computeAxisLines(): RadarAxisLine[] {
    const n = axes.length;
    if (n === 0) return [];
    const angleStep = 360 / n;

    return axes.map((axis, i) => {
      const angle = i * angleStep;
      const lineEnd = polarToCartesian(cx, cy, radius, angle);
      const labelPos = polarToCartesian(cx, cy, radius + 14, angle);
      return { key: axis.key, label: axis.label, angle, lineEnd, labelPos };
    });
  }

  function computeGridLines(): RadarGridLine[] {
    const n = axes.length;
    if (n === 0) return [];
    const angleStep = 360 / n;
    const lines: RadarGridLine[] = [];

    for (let level = 1; level <= gridLevels; level++) {
      const r = (radius * level) / gridLevels;
      const points: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < n; i++) {
        points.push(polarToCartesian(cx, cy, r, i * angleStep));
      }
      // Close polygon
      const pathParts = points.map((p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`));
      pathParts.push('Z');
      lines.push({ level: level / gridLevels, points, path: pathParts.join(' ') });
    }

    return lines;
  }

  function computeSeries(): RadarSeriesData[] {
    const n = axes.length;
    if (n === 0) return [];
    const angleStep = 360 / n;

    return seriesData.map((s, si) => {
      const color = s.color ?? getChartColor(si);
      const points: RadarPoint[] = axes.map((axis, ai) => {
        const rawValue = s.values[axis.key] ?? 0;
        const maxVal = axis.max ?? getMaxForAxis(axis.key);
        const normalized = maxVal > 0 ? Math.min(1, rawValue / maxVal) : 0;
        const r = radius * normalized;
        const angle = ai * angleStep;
        const pos = polarToCartesian(cx, cy, r, angle);
        return { x: pos.x, y: pos.y, value: rawValue, normalizedValue: normalized, axisKey: axis.key };
      });

      const pathParts = points.map((p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`));
      pathParts.push('Z');

      return { name: s.name, color, points, path: pathParts.join(' ') };
    });
  }

  function getMaxForAxis(key: string): number {
    let max = 0;
    for (const s of seriesData) {
      const v = s.values[key] ?? 0;
      if (v > max) max = v;
    }
    return max > 0 ? max : 1;
  }

  function getContext(): RadarChartContext {
    return {
      series: computeSeries(),
      gridLines: computeGridLines(),
      axisLines: computeAxisLines(),
      center: { x: cx, y: cy },
      radius,
    };
  }

  function send(event: RadarChartEvent): void {
    switch (event.type) {
      case 'SET_DATA':
        axes = [...event.axes];
        seriesData = [...event.series];
        notify();
        break;
      case 'SET_GRID_LEVELS':
        gridLevels = Math.max(1, event.levels);
        notify();
        break;
    }
  }

  function subscribe(callback: () => void): () => void {
    listeners.add(callback);
    return () => { listeners.delete(callback); };
  }

  function destroy(): void { listeners.clear(); }

  return { getContext, send, subscribe, destroy };
}
