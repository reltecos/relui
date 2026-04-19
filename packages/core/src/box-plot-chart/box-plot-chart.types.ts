/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Box plot veri noktasi */
export interface BoxPlotData {
  label: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers?: number[];
}

export type BoxPlotChartEvent =
  | { type: 'SET_TOOLTIP'; index: number; x: number; y: number }
  | { type: 'CLEAR_TOOLTIP' };

export interface BoxPlotChartContext {
  readonly tooltipIndex: number | null;
  readonly tooltipX: number;
  readonly tooltipY: number;
}

export interface BoxPlotChartConfig { data: BoxPlotData[] }
export interface BoxPlotChartAPI {
  getContext(): BoxPlotChartContext;
  send(event: BoxPlotChartEvent): void;
  subscribe(fn: () => void): () => void;
  destroy(): void;
}
