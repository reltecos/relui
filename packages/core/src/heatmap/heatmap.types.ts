/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Heatmap tipleri.
 * Heatmap types.
 *
 * @packageDocumentation
 */

/** Hesaplanmis hucre / Computed cell */
export interface HeatmapCell {
  readonly row: number;
  readonly col: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly value: number;
  readonly color: string;
  readonly rowLabel: string;
  readonly colLabel: string;
}

// ── Events ───────────────────────────────────────────

export type HeatmapEvent =
  | { type: 'SET_DATA'; data: number[][] }
  | { type: 'SET_ROW_LABELS'; labels: string[] }
  | { type: 'SET_COL_LABELS'; labels: string[] }
  | { type: 'SET_SIZE'; width: number; height: number };

// ── Context ──────────────────────────────────────────

export interface HeatmapContext {
  readonly cells: readonly HeatmapCell[];
  readonly rowLabels: readonly string[];
  readonly colLabels: readonly string[];
  readonly min: number;
  readonly max: number;
  readonly rowCount: number;
  readonly colCount: number;
  readonly width: number;
  readonly height: number;
  readonly plotArea: { x: number; y: number; width: number; height: number };
}

// ── Config ───────────────────────────────────────────

export interface HeatmapConfig {
  data?: number[][];
  rowLabels?: string[];
  colLabels?: string[];
  width?: number;
  height?: number;
  lowColor?: string;
  highColor?: string;
}

// ── API ──────────────────────────────────────────────

export interface HeatmapAPI {
  getContext(): HeatmapContext;
  send(event: HeatmapEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}
