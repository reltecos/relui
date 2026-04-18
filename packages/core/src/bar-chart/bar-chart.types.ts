/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * BarChart tipleri.
 * BarChart types.
 *
 * @packageDocumentation
 */

/** Bar seri tanimi / Bar series definition */
export interface BarSeries {
  readonly name: string;
  readonly data: readonly number[];
  readonly color?: string;
}

/** Hesaplanmis bar / Computed bar */
export interface ComputedBar {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly color: string;
  readonly value: number;
  readonly seriesName: string;
  readonly category: string;
}

/** Bar chart modu / Bar chart mode */
export type BarChartMode = 'grouped' | 'stacked';

/** Bar chart yonu / Bar chart orientation */
export type BarChartOrientation = 'vertical' | 'horizontal';

// ── Events ───────────────────────────────────────────

export type BarChartEvent =
  | { type: 'SET_SERIES'; series: BarSeries[] }
  | { type: 'SET_CATEGORIES'; categories: string[] }
  | { type: 'SET_SIZE'; width: number; height: number }
  | { type: 'SET_MODE'; mode: BarChartMode };

// ── Context ──────────────────────────────────────────

export interface BarChartContext {
  readonly bars: readonly ComputedBar[];
  readonly categories: readonly string[];
  readonly series: readonly BarSeries[];
  readonly mode: BarChartMode;
  readonly orientation: BarChartOrientation;
  readonly xTicks: readonly string[];
  readonly yTicks: readonly number[];
  readonly yMax: number;
  readonly width: number;
  readonly height: number;
  readonly plotArea: { x: number; y: number; width: number; height: number };
}

// ── Config ───────────────────────────────────────────

export interface BarChartConfig {
  series?: BarSeries[];
  categories?: string[];
  mode?: BarChartMode;
  orientation?: BarChartOrientation;
  width?: number;
  height?: number;
}

// ── API ──────────────────────────────────────────────

export interface BarChartAPI {
  getContext(): BarChartContext;
  send(event: BarChartEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}
