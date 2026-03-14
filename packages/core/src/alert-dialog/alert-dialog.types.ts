/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * AlertDialog tipleri / AlertDialog types.
 *
 * @packageDocumentation
 */

// ── Types ───────────────────────────────────────────

/** AlertDialog ciddiyet seviyesi / AlertDialog severity. */
export type AlertDialogSeverity = 'danger' | 'warning' | 'info';

// ── Events ─────────────────────────────────────────

export type AlertDialogEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'CONFIRM' }
  | { type: 'CANCEL' }
  | { type: 'SET_LOADING'; loading: boolean };

// ── Context ────────────────────────────────────────

export interface AlertDialogContext {
  /** Acik mi / Is open */
  open: boolean;
  /** Onay yukleniyor mu / Is confirm loading */
  loading: boolean;
}

// ── Config ─────────────────────────────────────────

export interface AlertDialogConfig {
  /** Baslangic durumu / Initial open state */
  open?: boolean;
  /** Overlay tiklaninca kapat / Close on overlay click */
  closeOnOverlay?: boolean;
  /** Escape tusuyla kapat / Close on escape key */
  closeOnEscape?: boolean;
  /** Onay callback / Confirm callback */
  onConfirm?: () => void | Promise<void>;
  /** Iptal callback / Cancel callback */
  onCancel?: () => void;
  /** Durum degisim callback / Open change callback */
  onOpenChange?: (open: boolean) => void;
}

// ── API ────────────────────────────────────────────

export interface AlertDialogAPI {
  getContext(): AlertDialogContext;
  send(event: AlertDialogEvent): void;
  subscribe(fn: () => void): () => void;
}
