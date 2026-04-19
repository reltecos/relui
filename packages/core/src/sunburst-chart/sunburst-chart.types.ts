/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface SunburstNode {
  name: string;
  value: number;
  children?: SunburstNode[];
  color?: string;
}

export interface SunburstArc {
  name: string;
  value: number;
  percentage: number;
  color: string;
  depth: number;
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
  path: string;
  labelPos: { x: number; y: number };
}

export interface SunburstChartContext {
  readonly arcs: ReadonlyArray<SunburstArc>;
  readonly total: number;
  readonly center: { x: number; y: number };
}

export type SunburstChartEvent =
  | { type: 'SET_DATA'; data: SunburstNode[] };

export interface SunburstChartConfig {
  data?: SunburstNode[];
  size?: number;
  innerRadius?: number;
  maxDepth?: number;
}

export interface SunburstChartAPI {
  getContext(): SunburstChartContext;
  send(event: SunburstChartEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}
