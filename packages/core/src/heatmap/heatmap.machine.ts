/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Heatmap state machine — isi haritasi hesaplamalari.
 * Heatmap state machine — heatmap calculations.
 *
 * @packageDocumentation
 */

import type {
  HeatmapConfig,
  HeatmapContext,
  HeatmapEvent,
  HeatmapAPI,
  HeatmapCell,
} from './heatmap.types';
import { heatmapColorScale } from '../chart-utils/colors';

const MARGIN = { top: 20, right: 20, bottom: 30, left: 50 };

function computeCells(
  data: readonly (readonly number[])[],
  rowLabels: readonly string[],
  colLabels: readonly string[],
  width: number,
  height: number,
  lowColor: string,
  highColor: string,
): Omit<HeatmapContext, 'width' | 'height'> {
  const rowCount = data.length;
  const colCount = rowCount > 0 ? (data[0]?.length ?? 0) : 0;

  const plotX = MARGIN.left;
  const plotY = MARGIN.top;
  const plotW = width - MARGIN.left - MARGIN.right;
  const plotH = height - MARGIN.top - MARGIN.bottom;
  const plotArea = { x: plotX, y: plotY, width: plotW, height: plotH };

  if (rowCount === 0 || colCount === 0) {
    return { cells: [], rowLabels, colLabels, min: 0, max: 0, rowCount, colCount, plotArea };
  }

  let min = Infinity;
  let max = -Infinity;
  for (const row of data) {
    for (const v of row) {
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  if (!isFinite(min)) { min = 0; max = 1; }

  const colorScale = heatmapColorScale(min, max, lowColor, highColor);
  const cellW = plotW / colCount;
  const cellH = plotH / rowCount;

  const cells: HeatmapCell[] = [];
  for (let r = 0; r < rowCount; r++) {
    const row = data[r];
    if (!row) continue;
    for (let c = 0; c < colCount; c++) {
      const value = row[c] ?? 0;
      cells.push({
        row: r,
        col: c,
        x: plotX + c * cellW,
        y: plotY + r * cellH,
        width: cellW,
        height: cellH,
        value,
        color: colorScale(value),
        rowLabel: rowLabels[r] ?? `${r}`,
        colLabel: colLabels[c] ?? `${c}`,
      });
    }
  }

  return { cells, rowLabels, colLabels, min, max, rowCount, colCount, plotArea };
}

/**
 * Heatmap state machine olusturur.
 * Creates a heatmap state machine.
 */
export function createHeatmap(config: HeatmapConfig = {}): HeatmapAPI {
  let data: number[][] = config.data ? config.data.map((r) => [...r]) : [];
  let rowLabels: string[] = config.rowLabels ? [...config.rowLabels] : [];
  let colLabels: string[] = config.colLabels ? [...config.colLabels] : [];
  let width = config.width ?? 400;
  let height = config.height ?? 300;
  const lowColor = config.lowColor ?? '#dbeafe';
  const highColor = config.highColor ?? '#1e40af';

  const listeners = new Set<() => void>();
  function notify(): void { listeners.forEach((fn) => fn()); }

  function send(event: HeatmapEvent): void {
    switch (event.type) {
      case 'SET_DATA': { data = event.data.map((r) => [...r]); notify(); break; }
      case 'SET_ROW_LABELS': { rowLabels = [...event.labels]; notify(); break; }
      case 'SET_COL_LABELS': { colLabels = [...event.labels]; notify(); break; }
      case 'SET_SIZE': {
        if (event.width === width && event.height === height) return;
        width = event.width; height = event.height; notify(); break;
      }
    }
  }

  return {
    getContext: () => ({ ...computeCells(data, rowLabels, colLabels, width, height, lowColor, highColor), width, height }),
    send,
    subscribe(cb) { listeners.add(cb); return () => { listeners.delete(cb); }; },
    destroy() { listeners.clear(); },
  };
}
