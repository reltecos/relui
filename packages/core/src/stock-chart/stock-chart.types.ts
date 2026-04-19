/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface StockDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface CandleData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  x: number;
  bodyY: number;
  bodyHeight: number;
  wickY: number;
  wickHeight: number;
  color: string;
  isBullish: boolean;
  width: number;
  volumeHeight: number;
  volumeY: number;
}

export interface StockChartContext {
  readonly candles: ReadonlyArray<CandleData>;
  readonly priceMin: number;
  readonly priceMax: number;
  readonly volumeMax: number;
  readonly chartWidth: number;
  readonly chartHeight: number;
}

export type StockChartEvent =
  | { type: 'SET_DATA'; data: StockDataPoint[] };

export interface StockChartConfig {
  data?: StockDataPoint[];
  width?: number;
  height?: number;
  volumeHeight?: number;
  padding?: number;
  bullishColor?: string;
  bearishColor?: string;
}

export interface StockChartAPI {
  getContext(): StockChartContext;
  send(event: StockChartEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}
