/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * LineChart tipleri.
 * LineChart types.
 *
 * @packageDocumentation
 */

/** Veri noktasi / Data point */
export interface LineDataPoint {
  /** X degeri / X value */
  readonly x: number;
  /** Y degeri / Y value */
  readonly y: number;
}

/** Seri tanimi / Series definition */
export interface LineSeries {
  /** Seri adi / Series name */
  readonly name: string;
  /** Veri noktalari / Data points */
  readonly data: readonly LineDataPoint[];
  /** Renk (opsiyonel) / Color (optional) */
  readonly color?: string;
}

/** Hesaplanmis seri / Computed series */
export interface LineComputedSeries {
  /** Seri adi / Series name */
  readonly name: string;
  /** SVG path / SVG path */
  readonly path: string;
  /** Area path / Area path */
  readonly areaPath: string;
  /** Olceklenmis noktalar / Scaled points */
  readonly points: readonly { x: number; y: number; dataX: number; dataY: number }[];
  /** Renk / Color */
  readonly color: string;
}

/** Margin / Margin */
export interface ChartMargin {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

// ── Events ───────────────────────────────────────────

export type LineChartEvent =
  | { type: 'SET_SERIES'; series: LineSeries[] }
  | { type: 'SET_SIZE'; width: number; height: number };

// ── Context ──────────────────────────────────────────

export interface LineChartContext {
  readonly computedSeries: readonly LineComputedSeries[];
  readonly xTicks: readonly number[];
  readonly yTicks: readonly number[];
  readonly xDomain: readonly [number, number];
  readonly yDomain: readonly [number, number];
  readonly width: number;
  readonly height: number;
  readonly plotArea: { x: number; y: number; width: number; height: number };
}

// ── Config ───────────────────────────────────────────

export interface LineChartConfig {
  series?: LineSeries[];
  width?: number;
  height?: number;
  margin?: Partial<ChartMargin>;
  showGrid?: boolean;
}

// ── API ──────────────────────────────────────────────

export interface LineChartAPI {
  getContext(): LineChartContext;
  send(event: LineChartEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}
