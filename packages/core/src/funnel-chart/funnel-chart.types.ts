/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface FunnelLayer {
  name: string;
  value: number;
  color?: string;
}

export interface FunnelLayerData {
  name: string;
  value: number;
  percentage: number;
  conversionRate: number;
  color: string;
  topWidth: number;
  bottomWidth: number;
  y: number;
  height: number;
  path: string;
  labelPos: { x: number; y: number };
}

export interface FunnelChartContext {
  readonly layers: ReadonlyArray<FunnelLayerData>;
  readonly maxValue: number;
}

export type FunnelChartEvent =
  | { type: 'SET_LAYERS'; layers: FunnelLayer[] };

export interface FunnelChartConfig {
  layers?: FunnelLayer[];
  width?: number;
  height?: number;
  padding?: number;
}

export interface FunnelChartAPI {
  getContext(): FunnelChartContext;
  send(event: FunnelChartEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}
