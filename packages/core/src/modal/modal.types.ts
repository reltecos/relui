/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Modal tipleri / Modal types.
 *
 * @packageDocumentation
 */

// ── Size ────────────────────────────────────────────────

/** Modal boyutu / Modal size. */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

// ── Events ──────────────────────────────────────────────

/** Modal event tipleri / Modal event types. */
export type ModalEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' };

// ── Context ─────────────────────────────────────────────

/** Modal durumu / Modal state. */
export interface ModalContext {
  /** Acik mi / Is open */
  open: boolean;
}

// ── Config ──────────────────────────────────────────────

/** Modal yapilandirmasi / Modal configuration. */
export interface ModalConfig {
  /** Baslangicta acik mi / Initially open */
  open?: boolean;
  /** Overlay'e tiklaninca kapat / Close on overlay click (default: true) */
  closeOnOverlay?: boolean;
  /** Escape ile kapat / Close on Escape (default: true) */
  closeOnEscape?: boolean;
  /** Aciklik degisince callback / On open change callback */
  onOpenChange?: (open: boolean) => void;
}

// ── API ─────────────────────────────────────────────────

/** Modal API'si / Modal API. */
export interface ModalAPI {
  /** Mevcut durumu al / Get current context */
  getContext(): ModalContext;
  /** Event gonder / Send event */
  send(event: ModalEvent): void;
  /** Dinleyici ekle / Subscribe to changes */
  subscribe(listener: () => void): () => void;
}
