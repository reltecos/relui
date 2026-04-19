/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * RadarChart tipleri.
 * RadarChart types.
 *
 * @packageDocumentation
 */

/** Radar ekseni / Radar axis */
export interface RadarAxis {
  /** Anahtar / Key */
  key: string;
  /** Etiket / Label */
  label: string;
  /** Maksimum deger / Maximum value */
  max?: number;
}

/** Radar serisi / Radar series */
export interface RadarSeries {
  /** Seri ismi / Series name */
  name: string;
  /** Degerler (axis key → value) / Values */
  values: Record<string, number>;
  /** Renk / Color */
  color?: string;
}

/** Hesaplanmis radar noktasi / Computed radar point */
export interface RadarPoint {
  x: number;
  y: number;
  value: number;
  normalizedValue: number;
  axisKey: string;
}

/** Hesaplanmis radar seri verisi / Computed radar series data */
export interface RadarSeriesData {
  name: string;
  color: string;
  points: RadarPoint[];
  path: string;
}

/** Hesaplanmis grid cizgisi / Computed grid line */
export interface RadarGridLine {
  level: number;
  points: Array<{ x: number; y: number }>;
  path: string;
}

/** Hesaplanmis eksen cizgisi / Computed axis line */
export interface RadarAxisLine {
  key: string;
  label: string;
  angle: number;
  lineEnd: { x: number; y: number };
  labelPos: { x: number; y: number };
}

/** RadarChart context */
export interface RadarChartContext {
  readonly series: ReadonlyArray<RadarSeriesData>;
  readonly gridLines: ReadonlyArray<RadarGridLine>;
  readonly axisLines: ReadonlyArray<RadarAxisLine>;
  readonly center: { x: number; y: number };
  readonly radius: number;
}

/** RadarChart event leri */
export type RadarChartEvent =
  | { type: 'SET_DATA'; axes: RadarAxis[]; series: RadarSeries[] }
  | { type: 'SET_GRID_LEVELS'; levels: number };

/** RadarChart yapilandirmasi */
export interface RadarChartConfig {
  axes?: RadarAxis[];
  series?: RadarSeries[];
  gridLevels?: number;
  size?: number;
  padding?: number;
}

/** RadarChart API */
export interface RadarChartAPI {
  getContext(): RadarChartContext;
  send(event: RadarChartEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}
