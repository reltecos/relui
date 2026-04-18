/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Chart geometri yardimcilari (SVG path, polar koordinat).
 * Chart geometry helpers (SVG path, polar coordinate).
 *
 * @packageDocumentation
 */

/**
 * Polar koordinattan kartezyen koordinata donusturur.
 * Converts polar coordinate to cartesian.
 */
export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

/**
 * SVG arc path olusturur.
 * Creates SVG arc path descriptor.
 */
export function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
  ].join(' ');
}

/**
 * Kapali SVG pie dilimi path olusturur.
 * Creates closed SVG pie slice path.
 */
export function describePieSlice(
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  const outerStart = polarToCartesian(cx, cy, outerRadius, endAngle);
  const outerEnd = polarToCartesian(cx, cy, outerRadius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  if (innerRadius <= 0) {
    return [
      'M', outerStart.x, outerStart.y,
      'A', outerRadius, outerRadius, 0, largeArcFlag, 0, outerEnd.x, outerEnd.y,
      'L', cx, cy,
      'Z',
    ].join(' ');
  }

  const innerStart = polarToCartesian(cx, cy, innerRadius, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerRadius, startAngle);

  return [
    'M', outerStart.x, outerStart.y,
    'A', outerRadius, outerRadius, 0, largeArcFlag, 0, outerEnd.x, outerEnd.y,
    'L', innerEnd.x, innerEnd.y,
    'A', innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
    'Z',
  ].join(' ');
}

/**
 * Dereceyi radyana cevirir.
 * Converts degrees to radians.
 */
export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * SVG polyline icin point string olusturur.
 * Creates SVG polyline points string.
 */
export function pointsToSvgPath(points: readonly { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  const first = points[0];
  if (!first) return '';
  let d = `M ${first.x} ${first.y}`;
  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    if (p) d += ` L ${p.x} ${p.y}`;
  }
  return d;
}

/**
 * Area fill icin kapali path olusturur.
 * Creates closed path for area fill.
 */
export function pointsToAreaPath(
  points: readonly { x: number; y: number }[],
  baselineY: number,
): string {
  if (points.length === 0) return '';
  const first = points[0];
  const last = points[points.length - 1];
  if (!first || !last) return '';
  const linePath = pointsToSvgPath(points);
  return `${linePath} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
}
