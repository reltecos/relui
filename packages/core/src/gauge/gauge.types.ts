/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Gauge tipleri.
 * Gauge types.
 *
 * @packageDocumentation
 */

/** Gauge segment tanimi / Gauge segment definition */
export interface GaugeSegment {
  /** Baslangic degeri / Start value */
  readonly from: number;
  /** Bitis degeri / End value */
  readonly to: number;
  /** Renk / Color */
  readonly color: string;
}

/** Gauge arc verisi / Gauge arc data */
export interface GaugeArcData {
  /** SVG path / SVG path */
  readonly path: string;
  /** Renk / Color */
  readonly color: string;
  /** Baslangic aci / Start angle */
  readonly startAngle: number;
  /** Bitis aci / End angle */
  readonly endAngle: number;
}

// ── Events ───────────────────────────────────────────

/** Gauge event'leri / Gauge events */
export type GaugeEvent =
  | { type: 'SET_VALUE'; value: number }
  | { type: 'SET_MIN'; min: number }
  | { type: 'SET_MAX'; max: number };

// ── Context ──────────────────────────────────────────

/** Gauge context */
export interface GaugeContext {
  /** Deger / Value */
  readonly value: number;
  /** Min / Min */
  readonly min: number;
  /** Max / Max */
  readonly max: number;
  /** Normalize deger (0-1) / Normalized value */
  readonly normalizedValue: number;
  /** Ibre acisi (derece) / Needle angle (degrees) */
  readonly needleAngle: number;
  /** Arc yollar / Arc paths */
  readonly arcs: readonly GaugeArcData[];
  /** Arka plan arc path / Background arc path */
  readonly backgroundArc: string;
  /** Baslangic acisi / Start angle */
  readonly startAngle: number;
  /** Bitis acisi / End angle */
  readonly endAngle: number;
}

// ── Config ───────────────────────────────────────────

/** Gauge yapilandirmasi / Gauge configuration */
export interface GaugeConfig {
  /** Deger / Value */
  value?: number;
  /** Min / Min */
  min?: number;
  /** Max / Max */
  max?: number;
  /** Baslangic acisi / Start angle (degrees, default -135) */
  startAngle?: number;
  /** Bitis acisi / End angle (degrees, default 135) */
  endAngle?: number;
  /** Renk segmentleri / Color segments */
  segments?: GaugeSegment[];
  /** Degisim callback / Change callback */
  onChange?: (value: number) => void;
}

// ── API ──────────────────────────────────────────────

/** Gauge API */
export interface GaugeAPI {
  /** Guncel context / Get current context */
  getContext(): GaugeContext;
  /** Event gonder / Send event */
  send(event: GaugeEvent): void;
  /** Abone ol / Subscribe */
  subscribe(callback: () => void): () => void;
  /** Temizlik / Cleanup */
  destroy(): void;
}
