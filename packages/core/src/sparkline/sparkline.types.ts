/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Sparkline tipleri.
 * Sparkline types.
 *
 * @packageDocumentation
 */

/** Sparkline modu / Sparkline mode */
export type SparklineMode = 'line' | 'bar' | 'area';

/** Hesaplanmis nokta / Computed point */
export interface SparklinePoint {
  /** X konumu / X position */
  readonly x: number;
  /** Y konumu / Y position */
  readonly y: number;
  /** Orijinal deger / Original value */
  readonly value: number;
  /** Index */
  readonly index: number;
}

/** Hesaplanmis bar / Computed bar */
export interface SparklineBar {
  /** X konumu / X position */
  readonly x: number;
  /** Y konumu / Y position */
  readonly y: number;
  /** Genislik / Width */
  readonly width: number;
  /** Yukseklik / Height */
  readonly height: number;
  /** Orijinal deger / Original value */
  readonly value: number;
  /** Index */
  readonly index: number;
}

// ── Events ───────────────────────────────────────────

/** Sparkline event'leri / Sparkline events */
export type SparklineEvent =
  | { type: 'SET_DATA'; data: number[] }
  | { type: 'SET_SIZE'; width: number; height: number };

// ── Context ──────────────────────────────────────────

/** Sparkline context */
export interface SparklineContext {
  /** Data degerleri / Data values */
  readonly data: readonly number[];
  /** Hesaplanmis noktalar / Computed points */
  readonly points: readonly SparklinePoint[];
  /** Hesaplanmis barlar / Computed bars */
  readonly bars: readonly SparklineBar[];
  /** SVG line path / SVG line path */
  readonly linePath: string;
  /** SVG area path / SVG area path */
  readonly areaPath: string;
  /** Minimum deger / Min value */
  readonly min: number;
  /** Maksimum deger / Max value */
  readonly max: number;
  /** Genislik / Width */
  readonly width: number;
  /** Yukseklik / Height */
  readonly height: number;
}

// ── Config ───────────────────────────────────────────

/** Sparkline yapilandirmasi / Sparkline configuration */
export interface SparklineConfig {
  /** Veri / Data */
  data?: number[];
  /** Genislik / Width */
  width?: number;
  /** Yukseklik / Height */
  height?: number;
}

// ── API ──────────────────────────────────────────────

/** Sparkline API */
export interface SparklineAPI {
  /** Guncel context / Get current context */
  getContext(): SparklineContext;
  /** Event gonder / Send event */
  send(event: SparklineEvent): void;
  /** Abone ol / Subscribe */
  subscribe(callback: () => void): () => void;
  /** Temizlik / Cleanup */
  destroy(): void;
}
