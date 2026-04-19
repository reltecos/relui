/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Piramit segment */
export interface PyramidSegment {
  label: string;
  value: number;
}

/** Hesaplanan piramit segment */
export interface ComputedPyramidSegment {
  label: string;
  value: number;
  percentage: number;
  topWidth: number;
  bottomWidth: number;
  y: number;
  height: number;
}

export type PyramidChartEvent =
  | { type: 'SET_TOOLTIP'; index: number; x: number; y: number }
  | { type: 'CLEAR_TOOLTIP' };

export interface PyramidChartContext {
  readonly segments: ReadonlyArray<ComputedPyramidSegment>;
  readonly tooltipIndex: number | null;
  readonly tooltipX: number;
  readonly tooltipY: number;
}

export interface PyramidChartConfig { data: PyramidSegment[] }
export interface PyramidChartAPI {
  getContext(): PyramidChartContext;
  send(event: PyramidChartEvent): void;
  subscribe(fn: () => void): () => void;
  destroy(): void;
}
