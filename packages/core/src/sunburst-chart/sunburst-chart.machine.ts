/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { SunburstChartConfig, SunburstChartContext, SunburstChartEvent, SunburstChartAPI, SunburstNode, SunburstArc } from './sunburst-chart.types';
import { describePieSlice, polarToCartesian, getChartColor } from '../chart-utils';

export function createSunburstChart(config: SunburstChartConfig = {}): SunburstChartAPI {
  let data: SunburstNode[] = [...(config.data ?? [])];
  const size = config.size ?? 200;
  const baseInnerRadius = config.innerRadius ?? 20;
  const maxDepth = config.maxDepth ?? 3;

  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = (size / 2) - 10;

  const listeners = new Set<() => void>();
  function notify(): void { for (const fn of listeners) fn(); }

  function getNodeValue(node: SunburstNode): number {
    if (node.children && node.children.length > 0) {
      return node.children.reduce((s, c) => s + getNodeValue(c), 0);
    }
    return node.value;
  }

  function buildArcs(nodes: SunburstNode[], startAngle: number, endAngle: number, depth: number, total: number, colorIdx: number): SunburstArc[] {
    if (depth >= maxDepth || nodes.length === 0) return [];

    const ringWidth = (maxRadius - baseInnerRadius) / maxDepth;
    const innerR = baseInnerRadius + depth * ringWidth;
    const outerR = baseInnerRadius + (depth + 1) * ringWidth;

    const arcs: SunburstArc[] = [];
    let currentAngle = startAngle;
    const angleRange = endAngle - startAngle;
    const nodeTotal = nodes.reduce((s, n) => s + getNodeValue(n), 0);

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (!node) continue;
      const nodeVal = getNodeValue(node);
      const sliceAngle = nodeTotal > 0 ? (nodeVal / nodeTotal) * angleRange : 0;
      const sAngle = currentAngle;
      const eAngle = currentAngle + sliceAngle;

      if (sliceAngle > 0.5) {
        const color = node.color ?? getChartColor(colorIdx + i);
        const path = describePieSlice(cx, cy, outerR, innerR, sAngle, eAngle);
        const midAngle = (sAngle + eAngle) / 2;
        const midR = (innerR + outerR) / 2;
        const labelPos = polarToCartesian(cx, cy, midR, midAngle);
        const percentage = total > 0 ? (nodeVal / total) * 100 : 0;

        arcs.push({ name: node.name, value: nodeVal, percentage, color, depth, startAngle: sAngle, endAngle: eAngle, innerRadius: innerR, outerRadius: outerR, path, labelPos });

        if (node.children && node.children.length > 0) {
          arcs.push(...buildArcs(node.children, sAngle, eAngle, depth + 1, total, colorIdx + i * 10));
        }
      }

      currentAngle = eAngle;
    }

    return arcs;
  }

  function getContext(): SunburstChartContext {
    const total = data.reduce((s, n) => s + getNodeValue(n), 0);
    const arcs = buildArcs(data, 0, 360, 0, total, 0);
    return { arcs, total, center: { x: cx, y: cy } };
  }

  function send(event: SunburstChartEvent): void {
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
