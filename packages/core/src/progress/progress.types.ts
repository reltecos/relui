/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Progress tipleri / Progress types.
 *
 * @packageDocumentation
 */

// ── Size ─────────────────────────────────────────────

/** Progress boyutu / Progress size. */
export type ProgressSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// ── Events ──────────────────────────────────────────

export type ProgressEvent =
  | { type: 'SET_VALUE'; value: number }
  | { type: 'SET_INDETERMINATE'; indeterminate: boolean };

// ── Context ─────────────────────────────────────────

export interface ProgressContext {
  /** Mevcut deger / Current value (0–max arasi) */
  value: number;
  /** Minimum deger / Minimum value */
  min: number;
  /** Maksimum deger / Maximum value */
  max: number;
  /** Belirsiz mod / Indeterminate mode */
  indeterminate: boolean;
}

// ── Config ──────────────────────────────────────────

export interface ProgressConfig {
  /** Baslangic degeri / Initial value */
  value?: number;
  /** Minimum deger / Minimum value (varsayilan 0) */
  min?: number;
  /** Maksimum deger / Maximum value (varsayilan 100) */
  max?: number;
  /** Belirsiz mod / Indeterminate mode */
  indeterminate?: boolean;
}

// ── API ─────────────────────────────────────────────

export interface ProgressAPI {
  getContext(): ProgressContext;
  send(event: ProgressEvent): void;
  subscribe(fn: () => void): () => void;
  /** Yuzde hesapla / Calculate percentage (0–100) */
  getPercent(): number;
  /** Root element props (role, aria-*) */
  getRootProps(): Record<string, string | number | undefined>;
}
