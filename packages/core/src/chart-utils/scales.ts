/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Chart scale fonksiyonlari.
 * Chart scale functions.
 *
 * @packageDocumentation
 */

// ── Linear Scale ────────────────────────────────────

/**
 * Lineer olcek olusturur (domain → range mapping).
 * Creates a linear scale (domain → range mapping).
 */
export function linearScale(
  domainMin: number,
  domainMax: number,
  rangeMin: number,
  rangeMax: number,
): (value: number) => number {
  const domainSpan = domainMax - domainMin;
  const rangeSpan = rangeMax - rangeMin;
  if (domainSpan === 0) return () => rangeMin;
  return (value: number) => rangeMin + ((value - domainMin) / domainSpan) * rangeSpan;
}

/**
 * Ters lineer olcek (range → domain mapping).
 * Inverse linear scale (range → domain mapping).
 */
export function linearScaleInvert(
  domainMin: number,
  domainMax: number,
  rangeMin: number,
  rangeMax: number,
): (pixel: number) => number {
  const domainSpan = domainMax - domainMin;
  const rangeSpan = rangeMax - rangeMin;
  if (rangeSpan === 0) return () => domainMin;
  return (pixel: number) => domainMin + ((pixel - rangeMin) / rangeSpan) * domainSpan;
}

// ── Band Scale ──────────────────────────────────────

/** Band scale sonucu / Band scale result */
export interface BandScaleResult {
  /** Baslangic x / Start x */
  x: number;
  /** Genislik / Width */
  width: number;
}

/**
 * Kategorik band olcegi (bar chart icin).
 * Categorical band scale (for bar charts).
 */
export function bandScale(
  categories: readonly string[],
  rangeMin: number,
  rangeMax: number,
  padding: number = 0.1,
): (category: string) => BandScaleResult {
  const n = categories.length;
  if (n === 0) return () => ({ x: rangeMin, width: 0 });
  const totalRange = rangeMax - rangeMin;
  const step = totalRange / n;
  const bandWidth = step * (1 - padding);
  const offset = (step - bandWidth) / 2;

  return (category: string) => {
    const idx = categories.indexOf(category);
    if (idx === -1) return { x: rangeMin, width: 0 };
    return {
      x: rangeMin + idx * step + offset,
      width: bandWidth,
    };
  };
}

/**
 * Band genisligini hesaplar.
 * Calculates band width.
 */
export function getBandWidth(
  categoryCount: number,
  rangeMin: number,
  rangeMax: number,
  padding: number = 0.1,
): number {
  if (categoryCount === 0) return 0;
  const totalRange = rangeMax - rangeMin;
  const step = totalRange / categoryCount;
  return step * (1 - padding);
}
