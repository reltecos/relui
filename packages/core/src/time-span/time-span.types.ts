/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * TimeSpan tipleri.
 * TimeSpan types.
 *
 * @packageDocumentation
 */

/** TimeSpan alani / TimeSpan field */
export type TimeSpanField = 'hours' | 'minutes' | 'seconds';

/** TimeSpan context */
export interface TimeSpanContext {
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly totalSeconds: number;
  readonly totalMs: number;
}

/** TimeSpan event leri */
export type TimeSpanEvent =
  | { type: 'SET_FIELD'; field: TimeSpanField; value: number }
  | { type: 'INCREMENT'; field: TimeSpanField; step?: number }
  | { type: 'DECREMENT'; field: TimeSpanField; step?: number }
  | { type: 'SET_TOTAL_SECONDS'; totalSeconds: number }
  | { type: 'RESET' };

/** TimeSpan yapilandirmasi */
export interface TimeSpanConfig {
  defaultHours?: number;
  defaultMinutes?: number;
  defaultSeconds?: number;
  min?: number;
  max?: number;
  onChange?: (totalSeconds: number) => void;
}

/** TimeSpan API */
export interface TimeSpanAPI {
  getContext(): TimeSpanContext;
  send(event: TimeSpanEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}
