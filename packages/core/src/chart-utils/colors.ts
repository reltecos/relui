/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Chart renk paleti ve yardimci fonksiyonlar.
 * Chart color palette and helper functions.
 *
 * @packageDocumentation
 */

/**
 * Varsayilan chart renk paleti (10 renk, token-uyumlu).
 * Default chart color palette (10 colors, token-compatible).
 */
export const CHART_COLORS: readonly string[] = [
  'var(--rel-color-primary, #3b82f6)',
  'var(--rel-color-success, #10b981)',
  'var(--rel-color-warning, #f59e0b)',
  'var(--rel-color-error, #ef4444)',
  'var(--rel-color-info, #8b5cf6)',
  'var(--rel-color-secondary, #ec4899)',
  'var(--rel-color-info-light, #06b6d4)',
  'var(--rel-color-primary-light, #6366f1)',
  'var(--rel-color-success-light, #14b8a6)',
  'var(--rel-color-warning-light, #f97316)',
];

/**
 * Index ile renk dondurur (modulo ile tekrar eder).
 * Returns color by index (wraps with modulo).
 */
export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length] ?? CHART_COLORS[0] ?? '#3b82f6';
}

/**
 * Iki renk arasinda interpolasyon yapar (hex renk).
 * Interpolates between two hex colors.
 */
export function interpolateColor(color1: string, color2: string, t: number): string {
  const c1 = parseHex(color1);
  const c2 = parseHex(color2);
  if (!c1 || !c2) return color1;

  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);

  return `rgb(${r}, ${g}, ${b})`;
}

function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return { r, g, b };
}

/**
 * Heatmap icin renk skalasi uretir.
 * Generates color scale for heatmap.
 */
export function heatmapColorScale(
  min: number,
  max: number,
  lowColor: string = '#dbeafe',
  highColor: string = '#1e40af',
): (value: number) => string {
  return (value: number) => {
    if (max === min) return lowColor;
    const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return interpolateColor(lowColor, highColor, t);
  };
}
