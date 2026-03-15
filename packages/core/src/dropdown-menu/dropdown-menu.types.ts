/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DropdownMenu tipleri.
 * DropdownMenu types.
 *
 * @packageDocumentation
 */

import type { ContextMenuItem, ContextMenuItemType } from '../context-menu/context-menu.types';

// Re-export item type
export type { ContextMenuItem as DropdownMenuItem };
export type { ContextMenuItemType as DropdownMenuItemType };

// ── Placement ────────────────────────────────────────

/** DropdownMenu yerlesim yonu / DropdownMenu placement */
export type DropdownMenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

// ── Events ───────────────────────────────────────────

/** DropdownMenu event'leri / DropdownMenu events */
export type DropdownMenuEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'SELECT'; itemId: string }
  | { type: 'HIGHLIGHT'; itemId: string | null }
  | { type: 'OPEN_SUBMENU'; itemId: string }
  | { type: 'CLOSE_SUBMENU' };

// ── Context ──────────────────────────────────────────

/** DropdownMenu state / DropdownMenu context */
export interface DropdownMenuContext {
  /** Acik mi / Is open */
  open: boolean;
  /** Vurgulanan oge id / Highlighted item id */
  highlightedId: string | null;
  /** Acik alt menu id / Open submenu id */
  openSubmenuId: string | null;
}

// ── Config ───────────────────────────────────────────

/** DropdownMenu yapilandirmasi / DropdownMenu configuration */
export interface DropdownMenuConfig {
  /** Menu ogeleri / Menu items */
  items: ContextMenuItem[];
  /** Oge secilince callback / On item select callback */
  onSelect?: (itemId: string) => void;
  /** Acik/kapali degisince callback / On open change callback */
  onOpenChange?: (open: boolean) => void;
}

// ── API ──────────────────────────────────────────────

/** DropdownMenu API / DropdownMenu API */
export interface DropdownMenuAPI {
  /** Guncel context / Get current context */
  getContext(): DropdownMenuContext;
  /** Event gonder / Send event */
  send(event: DropdownMenuEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
  /** Menu ogelerini getir / Get menu items */
  getItems(): ContextMenuItem[];
}
