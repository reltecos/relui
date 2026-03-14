/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * TableOfContents tipleri / TableOfContents types.
 *
 * @packageDocumentation
 */

// ── TOC Item ─────────────────────────────────────────────

/**
 * Tek bir baslik ogesi / A single heading item.
 */
export interface TocItem {
  /** Benzersiz id (genellikle heading'in id'si) / Unique id */
  id: string;

  /** Gorunen metin / Display label */
  label: string;

  /** Derinlik seviyesi (0 = en ust) / Depth level (0 = top) */
  depth: number;

  /** Devre disi mi / Disabled */
  disabled?: boolean;
}

// ── Events ──────────────────────────────────────────────

export interface TocSetItemsEvent {
  type: 'SET_ITEMS';
  items: TocItem[];
}

export interface TocSetActiveEvent {
  type: 'SET_ACTIVE';
  id: string | null;
}

export interface TocScrollToEvent {
  type: 'SCROLL_TO';
  id: string;
}

export interface TocSetOffsetEvent {
  type: 'SET_OFFSET';
  offset: number;
}

export type TocEvent =
  | TocSetItemsEvent
  | TocSetActiveEvent
  | TocScrollToEvent
  | TocSetOffsetEvent;

// ── Context ────────────────────────────────────────────

export interface TocContext {
  /** Baslik listesi / Heading items */
  items: TocItem[];

  /** Aktif baslik id'si / Active heading id */
  activeId: string | null;

  /** Scroll offset (px) / Scroll offset for detection */
  offset: number;

  /** Son scrollTo hedefi (null = yok) / Last scrollTo target */
  scrollTarget: string | null;
}

// ── Config ─────────────────────────────────────────────

export interface TocConfig {
  /** Baslangic baslik listesi / Initial heading items */
  items?: TocItem[];

  /** Baslangic aktif id / Initial active id */
  activeId?: string | null;

  /** Scroll offset (px, default: 0) / Scroll detection offset */
  offset?: number;

  /** Degisiklik callback / Change callback */
  onChange?: (activeId: string | null) => void;

  /** Scroll callback / Scroll to callback */
  onScrollTo?: (id: string) => void;
}

// ── API ────────────────────────────────────────────────

export interface TocAPI {
  getContext: () => TocContext;
  send: (event: TocEvent) => void;
  subscribe: (listener: () => void) => () => void;

  /** Nav element DOM props */
  getNavProps: () => Record<string, unknown>;

  /** Link element DOM props */
  getLinkProps: (id: string) => Record<string, unknown>;
}
