/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * PinInput tipleri.
 * PinInput types.
 *
 * @packageDocumentation
 */

// ── PinInputType ────────────────────────────────────

/** Giris tipi / Input type */
export type PinInputType = 'alphanumeric' | 'number';

// ── Events ──────────────────────────────────────────

/** PinInput event'leri / PinInput events */
export type PinInputEvent =
  | { type: 'SET_CHAR'; index: number; char: string }
  | { type: 'BACKSPACE'; index: number }
  | { type: 'PASTE'; value: string }
  | { type: 'FOCUS_INDEX'; index: number }
  | { type: 'CLEAR' }
  | { type: 'SET_VALUE'; value: string };

// ── Context ─────────────────────────────────────────

/** PinInput state / PinInput context */
export interface PinInputContext {
  /** Her alana girilen degerler / Values entered in each field */
  readonly values: readonly string[];
  /** Suanda odaklanmis alan indeksi / Currently focused field index */
  readonly focusIndex: number;
  /** Tum alanlar dolu mu / Are all fields filled */
  readonly isComplete: boolean;
  /** Birlesmis deger / Joined value */
  readonly value: string;
}

// ── Config ──────────────────────────────────────────

/** PinInput yapilandirmasi / PinInput configuration */
export interface PinInputConfig {
  /** Alan sayisi / Number of fields (default: 4) */
  length?: number;
  /** Baslangic degeri / Default value */
  defaultValue?: string;
  /** Giris tipi / Input type (default: 'number') */
  type?: PinInputType;
  /** Karakterleri gizle / Mask characters */
  mask?: boolean;
  /** Tum alanlar dolunca callback / Callback when all fields are filled */
  onComplete?: (value: string) => void;
  /** Deger degisince callback / Callback when value changes */
  onChange?: (value: string) => void;
}

// ── API ─────────────────────────────────────────────

/** PinInput API / PinInput API */
export interface PinInputAPI {
  /** Guncel context / Get current context */
  getContext(): PinInputContext;
  /** Event gonder / Send event */
  send(event: PinInputEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
  /** Temizle / Destroy */
  destroy(): void;
}
