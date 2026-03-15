/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Drawer tipleri / Drawer types.
 *
 * @packageDocumentation
 */

// ── Placement ───────────────────────────────────────────

/** Drawer yerlesimi / Drawer placement. */
export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

// ── Size ────────────────────────────────────────────────

/** Drawer boyutu / Drawer size. */
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

// ── Events ──────────────────────────────────────────────

/** Drawer event tipleri / Drawer event types. */
export type DrawerEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' };

// ── Context ─────────────────────────────────────────────

/** Drawer durumu / Drawer state. */
export interface DrawerContext {
  /** Acik mi / Is open */
  open: boolean;
}

// ── Config ──────────────────────────────────────────────

/** Drawer yapilandirmasi / Drawer configuration. */
export interface DrawerConfig {
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

/** Drawer API'si / Drawer API. */
export interface DrawerAPI {
  /** Mevcut durumu al / Get current context */
  getContext(): DrawerContext;
  /** Event gonder / Send event */
  send(event: DrawerEvent): void;
  /** Dinleyici ekle / Subscribe to changes */
  subscribe(listener: () => void): () => void;
}
