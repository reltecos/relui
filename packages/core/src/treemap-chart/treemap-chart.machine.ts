/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * TreemapChart — squarified treemap algoritmasi.
 *
 * @packageDocumentation
 */

import type { TreemapChartConfig, TreemapChartContext, TreemapChartEvent, TreemapChartAPI, TreemapNode, TreemapCell } from './treemap-chart.types';
import { getChartColor } from '../chart-utils';

export function createTreemapChart(config: TreemapChartConfig = {}): TreemapChartAPI {
  let data: TreemapNode[] = [...(config.data ?? [])];
  const width = config.width ?? 400;
  const height = config.height ?? 300;
  const pad = config.padding ?? 2;

  const listeners = new Set<() => void>();
  function notify(): void { for (const fn of listeners) fn(); }

  function getTotal(nodes: TreemapNode[]): number {
    return nodes.reduce((sum, n) => sum + (n.children ? getTotal(n.children) : n.value), 0);
  }

  function squarify(nodes: TreemapNode[], x: number, y: number, w: number, h: number, depth: number, colorIdx: number): TreemapCell[] {
    if (nodes.length === 0 || w <= 0 || h <= 0) return [];

    const total = nodes.reduce((s, n) => s + n.value, 0);
    if (total === 0) return [];

    const cells: TreemapCell[] = [];
    let cx = x;
    let cy = y;
    const isHorizontal = w >= h;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (!node) continue;
      const ratio = node.value / total;

      let cellW: number;
      let cellH: number;

      if (isHorizontal) {
        cellW = w * ratio;
        cellH = h;
      } else {
        cellW = w;
        cellH = h * ratio;
      }

      const color = node.color ?? getChartColor(colorIdx + i);
      const globalTotal = getTotal(data);
      const percentage = globalTotal > 0 ? (node.value / globalTotal) * 100 : 0;

      cells.push({
        name: node.name,
        value: node.value,
        percentage,
        color,
        x: cx + pad / 2,
        y: cy + pad / 2,
        width: Math.max(0, cellW - pad),
        height: Math.max(0, cellH - pad),
        depth,
        labelPos: { x: cx + cellW / 2, y: cy + cellH / 2 },
      });

      if (node.children && node.children.length > 0) {
        const childCells = squarify(node.children, cx + pad, cy + pad, cellW - pad * 2, cellH - pad * 2, depth + 1, colorIdx + i * 10);
        cells.push(...childCells);
      }

      if (isHorizontal) {
        cx += cellW;
      } else {
        cy += cellH;
      }
    }

    return cells;
  }

  function getContext(): TreemapChartContext {
    const total = getTotal(data);
    const cells = squarify(data, 0, 0, width, height, 0, 0);
    return { cells, total };
  }

  function send(event: TreemapChartEvent): void {
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
