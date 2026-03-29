/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DigitalGauge state machine.
 *
 * @packageDocumentation
 */

import type {
  DigitalGaugeConfig,
  DigitalGaugeContext,
  DigitalGaugeEvent,
  DigitalGaugeAPI,
} from './digital-gauge.types';

/**
 * DigitalGauge state machine olusturur.
 * Creates a DigitalGauge state machine.
 */
export function createDigitalGauge(config: DigitalGaugeConfig = {}): DigitalGaugeAPI {
  const {
    defaultValue = 0,
    min: initMin = -Infinity,
    max: initMax = Infinity,
    precision: initPrecision = 0,
    onChange,
  } = config;

  // ── State ──
  let min = initMin;
  let max = initMax;
  const precision = Math.max(0, Math.round(initPrecision));
  let value = clamp(defaultValue, min, max);
  const defaultVal = value;

  // ── Subscribers ──
  const listeners = new Set<() => void>();

  function notify(): void {
    onChange?.(value);
    listeners.forEach((fn) => fn());
  }

  function clamp(v: number, lo: number, hi: number): number {
    return Math.min(Math.max(v, lo), hi);
  }

  // ── Send ──
  function send(event: DigitalGaugeEvent): void {
    switch (event.type) {
      case 'SET_VALUE': {
        const next = clamp(event.value, min, max);
        if (next === value) return;
        value = next;
        notify();
        break;
      }
      case 'SET_MIN': {
        min = event.min;
        const clamped = clamp(value, min, max);
        if (clamped !== value) {
          value = clamped;
        }
        notify();
        break;
      }
      case 'SET_MAX': {
        max = event.max;
        const clamped = clamp(value, min, max);
        if (clamped !== value) {
          value = clamped;
        }
        notify();
        break;
      }
      case 'RESET': {
        const resetVal = clamp(defaultVal, min, max);
        if (resetVal === value) return;
        value = resetVal;
        notify();
        break;
      }
    }
  }

  // ── API ──
  return {
    getContext(): DigitalGaugeContext {
      return { value, min, max, precision };
    },
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
