/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface TreemapNode {
  name: string;
  value: number;
  children?: TreemapNode[];
  color?: string;
}

export interface TreemapCell {
  name: string;
  value: number;
  percentage: number;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  labelPos: { x: number; y: number };
}

export interface TreemapChartContext {
  readonly cells: ReadonlyArray<TreemapCell>;
  readonly total: number;
}

export type TreemapChartEvent =
  | { type: 'SET_DATA'; data: TreemapNode[] };

export interface TreemapChartConfig {
  data?: TreemapNode[];
  width?: number;
  height?: number;
  padding?: number;
}

export interface TreemapChartAPI {
  getContext(): TreemapChartContext;
  send(event: TreemapChartEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}
