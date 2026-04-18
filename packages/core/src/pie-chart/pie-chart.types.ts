/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * PieChart tipleri.
 * PieChart types.
 *
 * @packageDocumentation
 */

/** Dilim tanimi / Slice definition */
export interface PieSliceDef {
  /** Isim / Name */
  readonly name: string;
  /** Deger / Value */
  readonly value: number;
  /** Renk (opsiyonel) / Color (optional) */
  readonly color?: string;
}

/** Hesaplanmis dilim / Computed arc */
export interface PieArc {
  /** SVG path / SVG path */
  readonly path: string;
  /** Isim / Name */
  readonly name: string;
  /** Deger / Value */
  readonly value: number;
  /** Yuzde / Percentage */
  readonly percentage: number;
  /** Renk / Color */
  readonly color: string;
  /** Baslangic acisi / Start angle */
  readonly startAngle: number;
  /** Bitis acisi / End angle */
  readonly endAngle: number;
  /** Orta aci / Mid angle */
  readonly midAngle: number;
  /** Etiket pozisyonu / Label position */
  readonly labelPos: { x: number; y: number };
}

// ── Events ───────────────────────────────────────────

/** PieChart event'leri / PieChart events */
export type PieChartEvent =
  | { type: 'SET_SLICES'; slices: PieSliceDef[] }
  | { type: 'SET_DONUT'; donut: boolean }
  | { type: 'SET_INNER_RADIUS'; innerRadius: number };

// ── Context ──────────────────────────────────────────

/** PieChart context */
export interface PieChartContext {
  /** Hesaplanmis arclar / Computed arcs */
  readonly arcs: readonly PieArc[];
  /** Toplam deger / Total value */
  readonly total: number;
  /** Donut modu / Donut mode */
  readonly donut: boolean;
  /** Ic yaricap / Inner radius */
  readonly innerRadius: number;
}

// ── Config ───────────────────────────────────────────

/** PieChart yapilandirmasi / PieChart configuration */
export interface PieChartConfig {
  /** Dilimler / Slices */
  slices?: PieSliceDef[];
  /** Donut modu / Donut mode */
  donut?: boolean;
  /** Ic yaricap / Inner radius (0-1 oran) */
  innerRadius?: number;
}

// ── API ──────────────────────────────────────────────

/** PieChart API */
export interface PieChartAPI {
  /** Guncel context */
  getContext(): PieChartContext;
  /** Event gonder */
  send(event: PieChartEvent): void;
  /** Abone ol */
  subscribe(callback: () => void): () => void;
  /** Temizlik */
  destroy(): void;
}
