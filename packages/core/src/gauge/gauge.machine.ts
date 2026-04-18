/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Gauge state machine — radial gosterge hesaplamalari.
 * Gauge state machine — radial indicator calculations.
 *
 * @packageDocumentation
 */

import type {
  GaugeConfig,
  GaugeContext,
  GaugeEvent,
  GaugeAPI,
  GaugeSegment,
  GaugeArcData,
} from './gauge.types';
import { describeArc } from '../chart-utils/geometry';

const CX = 50;
const CY = 50;
const RADIUS = 40;

function buildArcs(
  segments: GaugeSegment[],
  min: number,
  max: number,
  startAngle: number,
  endAngle: number,
): GaugeArcData[] {
  const range = max - min;
  if (range <= 0) return [];
  const totalArc = endAngle - startAngle;

  return segments.map((seg) => {
    const segStart = startAngle + ((seg.from - min) / range) * totalArc;
    const segEnd = startAngle + ((seg.to - min) / range) * totalArc;
    return {
      path: describeArc(CX, CY, RADIUS, segStart, segEnd),
      color: seg.color,
      startAngle: segStart,
      endAngle: segEnd,
    };
  });
}

/**
 * Gauge state machine olusturur.
 * Creates a gauge state machine.
 */
export function createGauge(config: GaugeConfig = {}): GaugeAPI {
  let value = config.value ?? 0;
  let min = config.min ?? 0;
  let max = config.max ?? 100;
  const startAngle = config.startAngle ?? -135;
  const endAngle = config.endAngle ?? 135;
  const segments: GaugeSegment[] = config.segments ?? [];
  const onChange = config.onChange;

  const listeners = new Set<() => void>();

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  function clamp(v: number): number {
    return Math.max(min, Math.min(max, v));
  }

  function buildContext(): GaugeContext {
    const clamped = clamp(value);
    const range = max - min;
    const normalizedValue = range > 0 ? (clamped - min) / range : 0;
    const totalArc = endAngle - startAngle;
    const needleAngle = startAngle + normalizedValue * totalArc;
    const arcs = buildArcs(segments, min, max, startAngle, endAngle);
    const backgroundArc = describeArc(CX, CY, RADIUS, startAngle, endAngle);

    return {
      value: clamped,
      min,
      max,
      normalizedValue,
      needleAngle,
      arcs,
      backgroundArc,
      startAngle,
      endAngle,
    };
  }

  function send(event: GaugeEvent): void {
    switch (event.type) {
      case 'SET_VALUE': {
        const newVal = clamp(event.value);
        if (newVal === value) return;
        value = newVal;
        onChange?.(value);
        notify();
        break;
      }
      case 'SET_MIN': {
        if (event.min === min) return;
        min = event.min;
        notify();
        break;
      }
      case 'SET_MAX': {
        if (event.max === max) return;
        max = event.max;
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
    destroy(): void {
      listeners.clear();
    },
  };
}
