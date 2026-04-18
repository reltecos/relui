/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Sparkline state machine — mini inline grafik hesaplamalari.
 * Sparkline state machine — mini inline chart calculations.
 *
 * @packageDocumentation
 */

import type {
  SparklineConfig,
  SparklineContext,
  SparklineEvent,
  SparklineAPI,
  SparklinePoint,
  SparklineBar,
} from './sparkline.types';
import { linearScale } from '../chart-utils/scales';
import { pointsToSvgPath, pointsToAreaPath } from '../chart-utils/geometry';

function computePoints(
  data: readonly number[],
  width: number,
  height: number,
  padding: number = 2,
): { points: SparklinePoint[]; min: number; max: number } {
  if (data.length === 0) return { points: [], min: 0, max: 0 };

  let min = data[0] ?? 0;
  let max = data[0] ?? 0;
  for (const v of data) {
    if (v < min) min = v;
    if (v > max) max = v;
  }

  if (min === max) {
    max = min + 1;
  }

  const xScale = linearScale(0, Math.max(data.length - 1, 1), padding, width - padding);
  const yScale = linearScale(min, max, height - padding, padding);

  const points: SparklinePoint[] = data.map((value, index) => ({
    x: xScale(index),
    y: yScale(value),
    value,
    index,
  }));

  return { points, min, max };
}

function computeBars(
  data: readonly number[],
  width: number,
  height: number,
  padding: number = 2,
  barGap: number = 1,
): { bars: SparklineBar[]; min: number; max: number } {
  if (data.length === 0) return { bars: [], min: 0, max: 0 };

  const min = 0;
  let max = data[0] ?? 0;
  for (const v of data) {
    if (v > max) max = v;
  }
  if (max === 0) max = 1;

  const usableWidth = width - padding * 2;
  const barWidth = Math.max(1, (usableWidth - barGap * (data.length - 1)) / data.length);
  const yScale = linearScale(0, max, 0, height - padding * 2);

  const bars: SparklineBar[] = data.map((value, index) => {
    const barH = yScale(value);
    return {
      x: padding + index * (barWidth + barGap),
      y: height - padding - barH,
      width: barWidth,
      height: barH,
      value,
      index,
    };
  });

  return { bars, min, max };
}

/**
 * Sparkline state machine olusturur.
 * Creates a sparkline state machine.
 */
export function createSparkline(config: SparklineConfig = {}): SparklineAPI {
  let data: number[] = config.data ? [...config.data] : [];
  let width = config.width ?? 100;
  let height = config.height ?? 32;

  const listeners = new Set<() => void>();

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  function buildContext(): SparklineContext {
    const { points, min, max } = computePoints(data, width, height);
    const { bars } = computeBars(data, width, height);
    const linePath = pointsToSvgPath(points);
    const areaPath = pointsToAreaPath(points, height - 2);

    return {
      data,
      points,
      bars,
      linePath,
      areaPath,
      min,
      max,
      width,
      height,
    };
  }

  function send(event: SparklineEvent): void {
    switch (event.type) {
      case 'SET_DATA': {
        data = [...event.data];
        notify();
        break;
      }
      case 'SET_SIZE': {
        if (event.width === width && event.height === height) return;
        width = event.width;
        height = event.height;
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
