/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ContextMenu tipleri.
 * ContextMenu types.
 *
 * @packageDocumentation
 */

// ── Menu Item ────────────────────────────────────────

/** Menu ogesi turu / Menu item type */
export type ContextMenuItemType = 'item' | 'separator' | 'submenu';

/** Menu ogesi / Menu item */
export interface ContextMenuItem {
  /** Benzersiz id / Unique id */
  id: string;
  /** Etiket / Label */
  label?: string;
  /** Tur / Type */
  type?: ContextMenuItemType;
  /** Devre disi / Disabled */
  disabled?: boolean;
  /** Ikon / Icon (ReactNode olarak kullanilir) */
  icon?: unknown;
  /** Kisayol / Shortcut text */
  shortcut?: string;
  /** Alt menu ogeleri / Submenu items */
  children?: ContextMenuItem[];
}

// ── Events ───────────────────────────────────────────

/** ContextMenu event'leri / ContextMenu events */
export type ContextMenuEvent =
  | { type: 'OPEN'; x: number; y: number }
  | { type: 'CLOSE' }
  | { type: 'SELECT'; itemId: string }
  | { type: 'HIGHLIGHT'; itemId: string | null }
  | { type: 'OPEN_SUBMENU'; itemId: string }
  | { type: 'CLOSE_SUBMENU' };

// ── Context ──────────────────────────────────────────

/** ContextMenu state / ContextMenu context */
export interface ContextMenuContext {
  /** Acik mi / Is open */
  open: boolean;
  /** Pozisyon X / Position X */
  x: number;
  /** Pozisyon Y / Position Y */
  y: number;
  /** Vurgulanan oge id / Highlighted item id */
  highlightedId: string | null;
  /** Acik alt menu id / Open submenu id */
  openSubmenuId: string | null;
}

// ── Config ───────────────────────────────────────────

/** ContextMenu yapilandirmasi / ContextMenu configuration */
export interface ContextMenuConfig {
  /** Menu ogeleri / Menu items */
  items: ContextMenuItem[];
  /** Oge secilince callback / On item select callback */
  onSelect?: (itemId: string) => void;
  /** Acik/kapali degisince callback / On open change callback */
  onOpenChange?: (open: boolean) => void;
}

// ── API ──────────────────────────────────────────────

/** ContextMenu API / ContextMenu API */
export interface ContextMenuAPI {
  /** Guncel context / Get current context */
  getContext(): ContextMenuContext;
  /** Event gonder / Send event */
  send(event: ContextMenuEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
  /** Menu ogelerini getir / Get menu items */
  getItems(): ContextMenuItem[];
}
