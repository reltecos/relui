/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Rating tipleri.
 * Rating types.
 *
 * @packageDocumentation
 */

// ── Events ───────────────────────────────────────────

/** Rating event'leri / Rating events */
export type RatingEvent =
  | { type: 'SET_VALUE'; value: number }
  | { type: 'HOVER'; value: number }
  | { type: 'HOVER_END' }
  | { type: 'CLEAR' };

// ── Context ──────────────────────────────────────────

/** Rating state / Rating context */
export interface RatingContext {
  /** Secili deger / Selected value */
  readonly value: number;
  /** Hover edilen deger / Hovered value */
  readonly hoveredValue: number | null;
  /** Hover durumunda mi / Is hovering */
  readonly isHovering: boolean;
}

// ── Config ───────────────────────────────────────────

/** Rating yapilandirmasi / Rating configuration */
export interface RatingConfig {
  /** Varsayilan deger / Default value */
  defaultValue?: number;
  /** Yildiz sayisi / Star count */
  count?: number;
  /** Yarim yildiz destegi / Allow half star */
  allowHalf?: boolean;
  /** Salt okunur mu / Read only */
  readOnly?: boolean;
  /** Deger degistiginde callback / On change callback */
  onChange?: (value: number) => void;
}

// ── API ──────────────────────────────────────────────

/** Rating API / Rating API */
export interface RatingAPI {
  /** Guncel context / Get current context */
  getContext(): RatingContext;
  /** Event gonder / Send event */
  send(event: RatingEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
  /** Temizle / Destroy */
  destroy(): void;
}
