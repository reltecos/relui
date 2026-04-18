/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Chart tick hesaplama fonksiyonlari.
 * Chart tick calculation functions.
 *
 * @packageDocumentation
 */

/**
 * Guzel yuvarlama (nice number algorithm).
 * Nice number rounding for axis ticks.
 */
export function niceNum(range: number, round: boolean): number {
  const exponent = Math.floor(Math.log10(range));
  const fraction = range / Math.pow(10, exponent);
  let nice: number;

  if (round) {
    if (fraction < 1.5) nice = 1;
    else if (fraction < 3) nice = 2;
    else if (fraction < 7) nice = 5;
    else nice = 10;
  } else {
    if (fraction <= 1) nice = 1;
    else if (fraction <= 2) nice = 2;
    else if (fraction <= 5) nice = 5;
    else nice = 10;
  }

  return nice * Math.pow(10, exponent);
}

/**
 * Tick degerleri uretir.
 * Generates tick values for an axis.
 */
export function generateTicks(min: number, max: number, desiredCount: number = 5): number[] {
  if (min === max) return [min];
  if (desiredCount <= 0) return [];

  const range = niceNum(max - min, false);
  const tickSpacing = niceNum(range / (desiredCount - 1), true);

  if (tickSpacing === 0) return [min];

  const niceMin = Math.floor(min / tickSpacing) * tickSpacing;
  const niceMax = Math.ceil(max / tickSpacing) * tickSpacing;

  const ticks: number[] = [];
  for (let t = niceMin; t <= niceMax + tickSpacing * 0.5; t += tickSpacing) {
    const rounded = Math.round(t * 1e10) / 1e10;
    ticks.push(rounded);
  }

  return ticks;
}

/**
 * Deger formatlar (1000 → "1K", 1000000 → "1M").
 * Formats values (1000 → "1K", 1000000 → "1M").
 */
export function formatTickValue(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(1);
}
