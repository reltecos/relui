/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Spotlight tipleri / Spotlight types.
 *
 * macOS Spotlight tarzi global arama bilesen tipleri.
 * macOS Spotlight-style global search component types.
 *
 * @packageDocumentation
 */

// ── Boyutlar / Sizes ─────────────────────────────────────────

/** Spotlight boyutlari / Spotlight sizes. */
export type SpotlightSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// ── Item / Sonuc ─────────────────────────────────────────────

/** Spotlight arama sonucu ogesi / Spotlight search result item. */
export interface SpotlightItem {
  /** Benzersiz anahtar / Unique key */
  key: string;

  /** Gorunen etiket / Display label */
  label: string;

  /** Aciklama / Description */
  description?: string;

  /** Ikon adi / Icon name */
  icon?: string;

  /** Grup/kategori / Group/category */
  group?: string;

  /** Devre disi / Disabled */
  disabled?: boolean;

  /** Anahtar kelimeler (arama icin) / Keywords (for search) */
  keywords?: string[];
}

// ── Props ────────────────────────────────────────────────────

/** Spotlight olusturma secenekleri / Spotlight creation options. */
export interface SpotlightProps {
  /** Arama sonuclari / Search results */
  items?: SpotlightItem[];

  /** Son aramalar / Recent searches */
  recentSearches?: string[];

  /** Maksimum son arama sayisi / Max recent searches */
  maxRecentSearches?: number;

  /** Placeholder metni / Placeholder text */
  placeholder?: string;

  /** Bos mesaj / Empty message */
  emptyMessage?: string;

  /** Yukleniyor mesaji / Loading message */
  loadingMessage?: string;

  /** Ozel filtre fonksiyonu / Custom filter function */
  filter?: (item: SpotlightItem, query: string) => boolean;
}

// ── Context ──────────────────────────────────────────────────

/** Spotlight state machine baglami / Spotlight state machine context. */
export interface SpotlightMachineContext {
  /** Ogeler / Items */
  items: SpotlightItem[];

  /** Arama sorgusu / Search query */
  query: string;

  /** Filtrelenmis ogeler / Filtered items */
  filteredItems: SpotlightItem[];

  /** Vurgulanan indeks / Highlighted index */
  highlightedIndex: number;

  /** Acik mi / Is open */
  open: boolean;

  /** Yukleniyor mu / Is loading */
  loading: boolean;

  /** Son aramalar / Recent searches */
  recentSearches: string[];

  /** Maksimum son arama sayisi / Max recent searches */
  maxRecentSearches: number;

  /** Placeholder */
  placeholder: string;

  /** Bos mesaj / Empty message */
  emptyMessage: string;

  /** Yukleniyor mesaji / Loading message */
  loadingMessage: string;

  /** Ozel filtre / Custom filter */
  filter?: (item: SpotlightItem, query: string) => boolean;
}

// ── Events ───────────────────────────────────────────────────

/** Spotlight event tipleri / Spotlight event types. */
export type SpotlightEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'SET_QUERY'; query: string }
  | { type: 'HIGHLIGHT_NEXT' }
  | { type: 'HIGHLIGHT_PREV' }
  | { type: 'SELECT' }
  | { type: 'SELECT_INDEX'; index: number }
  | { type: 'SET_ITEMS'; items: SpotlightItem[] }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'ADD_RECENT_SEARCH'; query: string }
  | { type: 'CLEAR_RECENT_SEARCHES' }
  | { type: 'REMOVE_RECENT_SEARCH'; query: string };

// ── DOM Props ────────────────────────────────────────────────

/** Spotlight container DOM props. */
export interface SpotlightDOMProps {
  role: 'dialog';
  'aria-label': string;
  'aria-modal': 'true';
}

/** Spotlight input DOM props. */
export interface SpotlightInputDOMProps {
  role: 'combobox';
  'aria-expanded': 'true';
  'aria-autocomplete': 'list';
  'aria-controls': string;
  'aria-activedescendant': string;
  id: string;
}

/** Spotlight listbox DOM props. */
export interface SpotlightListDOMProps {
  role: 'listbox';
  id: string;
  'aria-label': string;
}

/** Spotlight option DOM props. */
export interface SpotlightItemDOMProps {
  role: 'option';
  id: string;
  'aria-selected': 'true' | 'false';
  'aria-disabled'?: 'true';
  'data-index': string;
  'data-highlighted'?: '';
  'data-disabled'?: '';
}

// ── API ──────────────────────────────────────────────────────

/** Spotlight API. */
export interface SpotlightAPI {
  /** Baglami al / Get context */
  getContext: () => SpotlightMachineContext;

  /** Event gonder / Send event */
  send: (event: SpotlightEvent) => void;

  /** Container DOM props al / Get container DOM props */
  getContainerProps: () => SpotlightDOMProps;

  /** Input DOM props al / Get input DOM props */
  getInputProps: () => SpotlightInputDOMProps;

  /** List DOM props al / Get list DOM props */
  getListProps: () => SpotlightListDOMProps;

  /** Item DOM props al / Get item DOM props */
  getItemProps: (index: number) => SpotlightItemDOMProps;

  /** Oge bul / Find item */
  findItem: (key: string) => SpotlightItem | null;
}
