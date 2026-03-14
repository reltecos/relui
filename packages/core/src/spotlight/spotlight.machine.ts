/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * createSpotlight — macOS Spotlight tarzi global arama state machine.
 * createSpotlight — macOS Spotlight-style global search state machine.
 *
 * Async arama, kategorize sonuclar, son aramalar, klavye navigasyon.
 * Async search, categorized results, recent searches, keyboard navigation.
 *
 * @packageDocumentation
 */

import type {
  SpotlightProps,
  SpotlightItem,
  SpotlightEvent,
  SpotlightMachineContext,
  SpotlightDOMProps,
  SpotlightInputDOMProps,
  SpotlightListDOMProps,
  SpotlightItemDOMProps,
  SpotlightAPI,
} from './spotlight.types';

// ── Fuzzy / Filter ──────────────────────────────────────────

/** Fuzzy match — karakter sirasi korunarak eslestir. */
function fuzzyMatch(text: string, query: string): boolean {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  let ti = 0;
  for (let qi = 0; qi < lowerQuery.length; qi++) {
    const ch = lowerQuery[qi];
    if (ch === undefined) continue;
    const found = lowerText.indexOf(ch, ti);
    if (found < 0) return false;
    ti = found + 1;
  }
  return true;
}

/** Eslestirme puani hesapla / Calculate match score. */
function scoreMatch(item: SpotlightItem, query: string): number {
  const q = query.toLowerCase();
  const label = item.label.toLowerCase();

  // Tam eslesme / Exact match
  if (label === q) return 100;

  // Basindan baslar / Starts with
  if (label.startsWith(q)) return 80;

  // Icerir / Contains
  if (label.includes(q)) return 60;

  // Aciklama icerir / Description contains
  if (item.description && item.description.toLowerCase().includes(q)) return 40;

  // Anahtar kelimeler / Keywords
  if (item.keywords) {
    for (const kw of item.keywords) {
      if (kw.toLowerCase().includes(q)) return 30;
    }
  }

  // Fuzzy
  if (fuzzyMatch(label, q)) return 20;

  return 0;
}

/** Varsayilan filtre / Default filter. */
function defaultFilter(item: SpotlightItem, query: string): boolean {
  return scoreMatch(item, query) > 0;
}

/** Filtrele ve sirala / Filter and sort. */
function filterAndSort(
  items: SpotlightItem[],
  query: string,
  filter?: (item: SpotlightItem, query: string) => boolean,
): SpotlightItem[] {
  if (!query) return items;

  const filterFn = filter ?? defaultFilter;
  const matched = items.filter((item) => filterFn(item, query));

  // Ozel filtre varsa siralama yapma
  if (filter) return matched;

  // Varsayilan: puana gore sirala
  return matched.sort((a, b) => scoreMatch(b, query) - scoreMatch(a, query));
}

/** Sonraki aktif (disabled olmayan) indeksi bul / Find next enabled index. */
function findNextEnabled(
  items: SpotlightItem[],
  startIndex: number,
  direction: 1 | -1,
): number {
  if (items.length === 0) return -1;

  const len = items.length;
  for (let i = 0; i < len; i++) {
    const idx = ((startIndex + direction * i) % len + len) % len;
    const item = items[idx];
    if (item && !item.disabled) return idx;
  }
  return -1;
}

// ── Machine ─────────────────────────────────────────────────

/**
 * createSpotlight — Spotlight state machine olustur.
 * createSpotlight — Create Spotlight state machine.
 */
export function createSpotlight(props: SpotlightProps = {}): SpotlightAPI {
  const config: SpotlightMachineContext = {
    items: props.items ?? [],
    query: '',
    filteredItems: props.items ?? [],
    highlightedIndex: -1,
    open: false,
    loading: false,
    recentSearches: props.recentSearches ? [...props.recentSearches] : [],
    maxRecentSearches: props.maxRecentSearches ?? 5,
    placeholder: props.placeholder ?? 'Search...',
    emptyMessage: props.emptyMessage ?? 'No results found',
    loadingMessage: props.loadingMessage ?? 'Searching...',
    filter: props.filter,
  };

  /** Ilk aktif ogeyi bul / Find first enabled item. */
  function autoHighlightFirst(): void {
    config.highlightedIndex = findNextEnabled(config.filteredItems, 0, 1);
  }

  /** Son aramalara ekle / Add to recent searches. */
  function addRecentSearch(query: string): void {
    const trimmed = query.trim();
    if (!trimmed) return;

    // Zaten varsa kaldir (tekrar en basa eklenecek)
    config.recentSearches = config.recentSearches.filter((s) => s !== trimmed);

    // Basa ekle
    config.recentSearches.unshift(trimmed);

    // Limit
    if (config.recentSearches.length > config.maxRecentSearches) {
      config.recentSearches = config.recentSearches.slice(0, config.maxRecentSearches);
    }
  }

  const api: SpotlightAPI = {
    getContext() {
      return config;
    },

    send(event: SpotlightEvent) {
      switch (event.type) {
        case 'OPEN':
          config.open = true;
          config.query = '';
          config.filteredItems = config.items;
          config.highlightedIndex = -1;
          config.loading = false;
          break;

        case 'CLOSE':
          config.open = false;
          config.query = '';
          config.filteredItems = config.items;
          config.highlightedIndex = -1;
          config.loading = false;
          break;

        case 'SET_QUERY':
          config.query = event.query;
          config.filteredItems = filterAndSort(config.items, event.query, config.filter);
          autoHighlightFirst();
          break;

        case 'HIGHLIGHT_NEXT': {
          if (config.filteredItems.length === 0) break;
          const start = config.highlightedIndex < 0 ? 0 : config.highlightedIndex + 1;
          config.highlightedIndex = findNextEnabled(config.filteredItems, start, 1);
          break;
        }

        case 'HIGHLIGHT_PREV': {
          if (config.filteredItems.length === 0) break;
          const start = config.highlightedIndex < 0
            ? config.filteredItems.length - 1
            : config.highlightedIndex - 1;
          config.highlightedIndex = findNextEnabled(
            config.filteredItems,
            (start % config.filteredItems.length + config.filteredItems.length) % config.filteredItems.length,
            -1,
          );
          break;
        }

        case 'SELECT': {
          if (config.highlightedIndex < 0) break;
          const item = config.filteredItems[config.highlightedIndex];
          if (item && !item.disabled) {
            if (config.query) addRecentSearch(config.query);
            config.open = false;
            config.query = '';
            config.filteredItems = config.items;
            config.highlightedIndex = -1;
            config.loading = false;
          }
          break;
        }

        case 'SELECT_INDEX': {
          const item = config.filteredItems[event.index];
          if (item && !item.disabled) {
            if (config.query) addRecentSearch(config.query);
            config.open = false;
            config.query = '';
            config.filteredItems = config.items;
            config.highlightedIndex = -1;
            config.loading = false;
          }
          break;
        }

        case 'SET_ITEMS':
          config.items = event.items;
          config.filteredItems = filterAndSort(event.items, config.query, config.filter);
          autoHighlightFirst();
          break;

        case 'SET_LOADING':
          config.loading = event.loading;
          break;

        case 'ADD_RECENT_SEARCH':
          addRecentSearch(event.query);
          break;

        case 'CLEAR_RECENT_SEARCHES':
          config.recentSearches = [];
          break;

        case 'REMOVE_RECENT_SEARCH':
          config.recentSearches = config.recentSearches.filter((s) => s !== event.query);
          break;
      }
    },

    getContainerProps(): SpotlightDOMProps {
      return {
        role: 'dialog',
        'aria-label': 'Spotlight Search',
        'aria-modal': 'true',
      };
    },

    getInputProps(): SpotlightInputDOMProps {
      return {
        role: 'combobox',
        'aria-expanded': 'true',
        'aria-autocomplete': 'list',
        'aria-controls': 'spotlight-listbox',
        'aria-activedescendant':
          config.highlightedIndex >= 0
            ? `spotlight-item-${config.highlightedIndex}`
            : '',
        id: 'spotlight-input',
      };
    },

    getListProps(): SpotlightListDOMProps {
      return {
        role: 'listbox',
        id: 'spotlight-listbox',
        'aria-label': 'Search results',
      };
    },

    getItemProps(index: number): SpotlightItemDOMProps {
      const item = config.filteredItems[index];
      const isHighlighted = index === config.highlightedIndex;
      const isDisabled = item?.disabled ?? false;

      const props: SpotlightItemDOMProps = {
        role: 'option',
        id: `spotlight-item-${index}`,
        'aria-selected': isHighlighted ? 'true' : 'false',
        'data-index': String(index),
      };

      if (isHighlighted) {
        props['data-highlighted'] = '';
      }

      if (isDisabled) {
        props['aria-disabled'] = 'true';
        props['data-disabled'] = '';
      }

      return props;
    },

    findItem(key: string): SpotlightItem | null {
      return config.items.find((i) => i.key === key) ?? null;
    },
  };

  return api;
}
