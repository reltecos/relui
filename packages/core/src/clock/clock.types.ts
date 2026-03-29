/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Clock tipleri.
 * Clock types.
 *
 * @packageDocumentation
 */

// ── Events ───────────────────────────────────────────

/** Clock event'leri / Clock events */
export type ClockEvent =
  | { type: 'TICK' }
  | { type: 'SET_TIMEZONE'; timezone: string }
  | { type: 'SET_FORMAT'; is24h: boolean };

// ── Context ──────────────────────────────────────────

/** Clock state / Clock context */
export interface ClockContext {
  /** Saat (0-23 veya 1-12) / Hours */
  readonly hours: number;
  /** Dakika / Minutes */
  readonly minutes: number;
  /** Saniye / Seconds */
  readonly seconds: number;
  /** AM/PM (12h format icin) / Period for 12h format */
  readonly period: 'AM' | 'PM';
  /** 24 saat formati mi / Is 24h format */
  readonly is24h: boolean;
  /** Saat dilimi / Timezone */
  readonly timezone: string;
  /** Ham saat (24h) / Raw hours (24h) */
  readonly rawHours: number;
}

// ── Config ───────────────────────────────────────────

/** Clock yapilandirmasi / Clock configuration */
export interface ClockConfig {
  /** 24 saat formati / 24-hour format */
  is24h?: boolean;
  /** Saat dilimi (IANA) / Timezone (IANA) */
  timezone?: string;
  /** Tick callback */
  onTick?: (ctx: ClockContext) => void;
}

// ── API ──────────────────────────────────────────────

/** Clock API / Clock API */
export interface ClockAPI {
  /** Guncel context / Get current context */
  getContext(): ClockContext;
  /** Event gonder / Send event */
  send(event: ClockEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
  /** Temizlik / Cleanup */
  destroy(): void;
}
