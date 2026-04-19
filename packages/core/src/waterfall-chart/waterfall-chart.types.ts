/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Waterfall veri tipi / Waterfall data type */
export type WaterfallType = 'increase' | 'decrease' | 'total';

/** Waterfall veri noktasi / Waterfall data point */
export interface WaterfallDataPoint {
  label: string;
  value: number;
  type: WaterfallType;
}

/** Hesaplanan waterfall bar / Computed waterfall bar */
export interface ComputedWaterfallBar {
  label: string;
  value: number;
  type: WaterfallType;
  start: number;
  end: number;
}

/** WaterfallChart event */
export type WaterfallChartEvent =
  | { type: 'SET_TOOLTIP'; index: number; x: number; y: number }
  | { type: 'CLEAR_TOOLTIP' };

/** WaterfallChart context */
export interface WaterfallChartContext {
  readonly bars: ReadonlyArray<ComputedWaterfallBar>;
  readonly tooltipIndex: number | null;
  readonly tooltipX: number;
  readonly tooltipY: number;
}

export interface WaterfallChartConfig { data: WaterfallDataPoint[] }
export interface WaterfallChartAPI {
  getContext(): WaterfallChartContext;
  send(event: WaterfallChartEvent): void;
  subscribe(fn: () => void): () => void;
  destroy(): void;
}
