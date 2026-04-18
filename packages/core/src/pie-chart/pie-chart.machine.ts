/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * PieChart state machine — pasta grafik hesaplamalari.
 * PieChart state machine — pie chart calculations.
 *
 * @packageDocumentation
 */

import type {
  PieChartConfig,
  PieChartContext,
  PieChartEvent,
  PieChartAPI,
  PieSliceDef,
  PieArc,
} from './pie-chart.types';
import { describePieSlice, polarToCartesian } from '../chart-utils/geometry';
import { getChartColor } from '../chart-utils/colors';

const CX = 50;
const CY = 50;
const OUTER_R = 45;
const LABEL_R = 35;

function computeArcs(
  slices: readonly PieSliceDef[],
  innerRadiusRatio: number,
): { arcs: PieArc[]; total: number } {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) return { arcs: [], total: 0 };

  const innerR = OUTER_R * innerRadiusRatio;
  let currentAngle = -90;
  const arcs: PieArc[] = [];

  for (let i = 0; i < slices.length; i++) {
    const slice = slices[i];
    if (!slice) continue;
    const percentage = (slice.value / total) * 100;
    const sweepAngle = (slice.value / total) * 360;
    const endAngle = currentAngle + sweepAngle;
    const midAngle = currentAngle + sweepAngle / 2;

    const clampedSweep = Math.min(sweepAngle, 359.99);
    const path = describePieSlice(CX, CY, OUTER_R, innerR, currentAngle, currentAngle + clampedSweep);
    const labelPos = polarToCartesian(CX, CY, LABEL_R, midAngle + 90);
    const color = slice.color ?? getChartColor(i);

    arcs.push({
      path,
      name: slice.name,
      value: slice.value,
      percentage,
      color,
      startAngle: currentAngle,
      endAngle,
      midAngle,
      labelPos,
    });

    currentAngle = endAngle;
  }

  return { arcs, total };
}

/**
 * PieChart state machine olusturur.
 * Creates a PieChart state machine.
 */
export function createPieChart(config: PieChartConfig = {}): PieChartAPI {
  let slices: PieSliceDef[] = config.slices ? [...config.slices] : [];
  let donut = config.donut ?? false;
  let innerRadius = config.innerRadius ?? 0.6;

  const listeners = new Set<() => void>();

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  function buildContext(): PieChartContext {
    const ratio = donut ? innerRadius : 0;
    const { arcs, total } = computeArcs(slices, ratio);
    return { arcs, total, donut, innerRadius: ratio };
  }

  function send(event: PieChartEvent): void {
    switch (event.type) {
      case 'SET_SLICES': {
        slices = [...event.slices];
        notify();
        break;
      }
      case 'SET_DONUT': {
        if (event.donut === donut) return;
        donut = event.donut;
        notify();
        break;
      }
      case 'SET_INNER_RADIUS': {
        if (event.innerRadius === innerRadius) return;
        innerRadius = event.innerRadius;
        notify();
        break;
      }
    }
  }

  return {
    getContext: buildContext,
    send,
    subscribe(callback: () => void): () => void {
      listeners.add(callback);
      return () => { listeners.delete(callback); };
    },
    destroy(): void { listeners.clear(); },
  };
}
