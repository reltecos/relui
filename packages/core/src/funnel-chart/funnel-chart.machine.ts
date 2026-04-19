/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { FunnelChartConfig, FunnelChartContext, FunnelChartEvent, FunnelChartAPI, FunnelLayer, FunnelLayerData } from './funnel-chart.types';
import { getChartColor } from '../chart-utils';

export function createFunnelChart(config: FunnelChartConfig = {}): FunnelChartAPI {
  let rawLayers: FunnelLayer[] = [...(config.layers ?? [])];
  const width = config.width ?? 300;
  const height = config.height ?? 300;
  const padding = config.padding ?? 20;

  const listeners = new Set<() => void>();
  function notify(): void { for (const fn of listeners) fn(); }

  function compute(): { layers: FunnelLayerData[]; maxValue: number } {
    if (rawLayers.length === 0) return { layers: [], maxValue: 0 };

    const maxValue = Math.max(...rawLayers.map((l) => l.value));
    if (maxValue === 0) return { layers: [], maxValue: 0 };

    const usableW = width - padding * 2;
    const usableH = height - padding * 2;
    const layerH = usableH / rawLayers.length;
    const gap = 2;

    const layers: FunnelLayerData[] = rawLayers.map((layer, i) => {
      const percentage = (layer.value / maxValue) * 100;
      const prevValue = i > 0 ? (rawLayers[i - 1]?.value ?? maxValue) : maxValue;
      const conversionRate = prevValue > 0 ? (layer.value / prevValue) * 100 : 100;

      const topWidth = i === 0 ? usableW : (usableW * (rawLayers[i - 1]?.value ?? maxValue)) / maxValue;
      const bottomWidth = (usableW * layer.value) / maxValue;
      const y = padding + i * layerH;
      const h = layerH - gap;

      const cx = width / 2;
      const topLeft = cx - topWidth / 2;
      const topRight = cx + topWidth / 2;
      const botLeft = cx - bottomWidth / 2;
      const botRight = cx + bottomWidth / 2;

      const path = `M ${topLeft} ${y} L ${topRight} ${y} L ${botRight} ${y + h} L ${botLeft} ${y + h} Z`;
      const labelPos = { x: cx, y: y + h / 2 };
      const color = layer.color ?? getChartColor(i);

      return { name: layer.name, value: layer.value, percentage, conversionRate, color, topWidth, bottomWidth, y, height: h, path, labelPos };
    });

    return { layers, maxValue };
  }

  function getContext(): FunnelChartContext {
    const { layers, maxValue } = compute();
    return { layers, maxValue };
  }

  function send(event: FunnelChartEvent): void {
    switch (event.type) {
      case 'SET_LAYERS':
        rawLayers = [...event.layers];
        notify();
        break;
    }
  }

  function subscribe(cb: () => void): () => void { listeners.add(cb); return () => { listeners.delete(cb); }; }
  function destroy(): void { listeners.clear(); }

  return { getContext, send, subscribe, destroy };
}
