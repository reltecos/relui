/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DigitalGauge tipleri.
 * DigitalGauge types.
 *
 * @packageDocumentation
 */

// ── Events ───────────────────────────────────────────

/** DigitalGauge event'leri / DigitalGauge events */
export type DigitalGaugeEvent =
  | { type: 'SET_VALUE'; value: number }
  | { type: 'SET_MIN'; min: number }
  | { type: 'SET_MAX'; max: number }
  | { type: 'RESET' };

// ── Context ──────────────────────────────────────────

/** DigitalGauge state / DigitalGauge context */
export interface DigitalGaugeContext {
  /** Guncel deger / Current value */
  readonly value: number;
  /** Minimum sinir / Minimum bound */
  readonly min: number;
  /** Maksimum sinir / Maximum bound */
  readonly max: number;
  /** Ondalik basamak sayisi / Decimal precision */
  readonly precision: number;
}

// ── Config ───────────────────────────────────────────

/** DigitalGauge yapilandirmasi / DigitalGauge configuration */
export interface DigitalGaugeConfig {
  /** Baslangic degeri / Initial value */
  defaultValue?: number;
  /** Minimum sinir / Minimum bound */
  min?: number;
  /** Maksimum sinir / Maximum bound */
  max?: number;
  /** Ondalik basamak sayisi / Decimal precision */
  precision?: number;
  /** Deger degisince callback / On value change callback */
  onChange?: (value: number) => void;
}

// ── API ──────────────────────────────────────────────

/** DigitalGauge API / DigitalGauge API */
export interface DigitalGaugeAPI {
  /** Guncel context / Get current context */
  getContext(): DigitalGaugeContext;
  /** Event gonder / Send event */
  send(event: DigitalGaugeEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
  /** Temizlik / Cleanup */
  destroy(): void;
}
