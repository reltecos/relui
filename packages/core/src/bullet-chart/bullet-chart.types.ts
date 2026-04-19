/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Bullet chart aralik tanimi / Bullet chart range def */
export interface BulletRange {
  /** Etiket / Label */
  label: string;
  /** Deger / Value (upper bound) */
  value: number;
}

/** Bullet chart veri noktasi / Bullet chart data point */
export interface BulletDataPoint {
  /** Etiket / Label */
  label: string;
  /** Gerceklesen deger / Actual value */
  value: number;
  /** Hedef deger / Target value */
  target: number;
  /** Araliklar (kotu→iyi) / Ranges (poor→good) */
  ranges: BulletRange[];
}

/** BulletChart event tipleri */
export type BulletChartEvent =
  | { type: 'SET_TOOLTIP'; index: number; x: number; y: number }
  | { type: 'CLEAR_TOOLTIP' };

/** BulletChart context */
export interface BulletChartContext {
  readonly tooltipIndex: number | null;
  readonly tooltipX: number;
  readonly tooltipY: number;
}

/** BulletChart config */
export interface BulletChartConfig {
  data: BulletDataPoint[];
}

/** BulletChart API */
export interface BulletChartAPI {
  getContext(): BulletChartContext;
  send(event: BulletChartEvent): void;
  subscribe(fn: () => void): () => void;
  destroy(): void;
}
