/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Toast tipleri / Toast types.
 *
 * @packageDocumentation
 */

// ── Types ───────────────────────────────────────────

/** Toast durumu / Toast status. */
export type ToastStatus = 'info' | 'success' | 'warning' | 'error';

/** Toast pozisyonu / Toast position. */
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

// ── Toast item ──────────────────────────────────────

export interface ToastItem {
  /** Benzersiz id / Unique id */
  id: string;
  /** Durum / Status */
  status: ToastStatus;
  /** Baslik / Title */
  title?: string;
  /** Mesaj / Message */
  message: string;
  /** Otomatik kapanma suresi (ms) / Auto-dismiss duration (ms). 0 = kapanmaz */
  duration: number;
  /** Kapatilabilir mi / Closable */
  closable: boolean;
  /** Olusturulma zamani / Created at */
  createdAt: number;
  /** Duraklatilmis mi / Is paused */
  paused: boolean;
  /** Kalan sure (ms) / Remaining time (ms) */
  remaining: number;
}

// ── Events ──────────────────────────────────────────

export type ToastEvent =
  | { type: 'ADD'; toast: Omit<ToastItem, 'createdAt' | 'paused' | 'remaining'> }
  | { type: 'REMOVE'; id: string }
  | { type: 'REMOVE_ALL' }
  | { type: 'PAUSE'; id: string }
  | { type: 'RESUME'; id: string }
  | { type: 'UPDATE'; id: string; updates: Partial<Pick<ToastItem, 'title' | 'message' | 'status' | 'duration'>> };

// ── Context ─────────────────────────────────────────

export interface ToastContext {
  /** Aktif toast listesi / Active toast list */
  toasts: ToastItem[];
  /** Maksimum gorunen sayi / Max visible count */
  maxVisible: number;
}

// ── Config ──────────────────────────────────────────

export interface ToastConfig {
  /** Maksimum gorunen toast sayisi / Max visible toast count */
  maxVisible?: number;
  /** Varsayilan sure (ms) / Default duration (ms) */
  defaultDuration?: number;
  /** Toast kaldirilinca callback / On toast removed callback */
  onRemove?: (id: string) => void;
}

// ── API ─────────────────────────────────────────────

export interface ToastAPI {
  getContext(): ToastContext;
  send(event: ToastEvent): void;
  subscribe(fn: () => void): () => void;
}
