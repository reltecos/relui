/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * CommandPalette state machine — framework-agnostic arama-tabanli komut calistiricisi.
 * CommandPalette state machine — framework-agnostic search-driven command launcher.
 *
 * VS Code Ctrl+K / Ctrl+P tarzi — fuzzy search, grup destegi, klavye navigasyon.
 *
 * @packageDocumentation
 */

import type {
  CommandPaletteItem,
  CommandPaletteProps,
  CommandPaletteMachineContext,
  CommandPaletteEvent,
  CommandPaletteDOMProps,
  CommandPaletteInputDOMProps,
  CommandPaletteListDOMProps,
  CommandPaletteItemDOMProps,
  CommandPaletteAPI,
} from './command-palette.types';

// ── Fuzzy search ─────────────────────────────────────────────

/**
 * Fuzzy match — query'deki tum karakterler text'te sirasyla var mi?
 * Fuzzy match — do all query chars appear in text in order?
 */
function fuzzyMatch(text: string, query: string): boolean {
  let qi = 0;
  for (let i = 0; i < text.length && qi < query.length; i++) {
    if (text[i] === query[qi]) qi++;
  }
  return qi === query.length;
}

/**
 * Esleme skoru — sonuclari siralama icin.
 * Match score — for sorting results.
 *
 * 100: tam eslesme, 80: baslar, 60: icerir, 40: aciklama,
 * 30: keyword, 20: fuzzy, 0: eslesmez.
 */
function scoreMatch(item: CommandPaletteItem, query: string): number {
  const q = query.toLowerCase();
  const label = item.label.toLowerCase();

  if (label === q) return 100;
  if (label.startsWith(q)) return 80;
  if (label.includes(q)) return 60;

  if (item.description && item.description.toLowerCase().includes(q)) return 40;
  if (item.keywords && item.keywords.some((k) => k.toLowerCase().includes(q))) return 30;

  if (fuzzyMatch(label, q)) return 20;

  return 0;
}

/**
 * Varsayilan filtre — substring + fuzzy match.
 * Default filter — substring + fuzzy match.
 */
function defaultFilter(item: CommandPaletteItem, query: string): boolean {
  if (!query) return true;
  return scoreMatch(item, query) > 0;
}

/**
 * Filtreleme ve siralama — yuksek skor once gelir.
 * Filter and sort — higher score items come first.
 */
function filterAndSort(
  items: CommandPaletteItem[],
  query: string,
  customFilter?: (item: CommandPaletteItem, query: string) => boolean,
): CommandPaletteItem[] {
  const filterFn = customFilter ?? defaultFilter;
  const matched = items.filter((item) => filterFn(item, query));

  if (!query) return matched;

  return matched
    .map((item) => ({ item, score: scoreMatch(item, query) }))
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);
}

// ── Machine ──────────────────────────────────────────────────

const LISTBOX_ID = 'command-palette-listbox';

function itemId(index: number): string {
  return `command-palette-item-${index}`;
}

/**
 * CommandPalette state machine olustur.
 * Create CommandPalette state machine.
 *
 * @param props - Olusturma secenekleri / Creation options
 * @returns CommandPaletteAPI
 */
export function createCommandPalette(props: CommandPaletteProps): CommandPaletteAPI {
  const customFilter = props.filter;

  // ── Mutable context ──
  const ctx: CommandPaletteMachineContext = {
    items: props.items,
    query: '',
    filteredItems: filterAndSort(props.items, '', customFilter),
    highlightedIndex: -1,
    open: false,
    placeholder: props.placeholder ?? 'Type a command...',
    emptyMessage: props.emptyMessage ?? 'No results found.',
  };

  // ── Yardimci fonksiyonlar ──

  function refilter(): void {
    ctx.filteredItems = filterAndSort(ctx.items, ctx.query, customFilter);
    // Vurgulamayi sinirla
    if (ctx.highlightedIndex >= ctx.filteredItems.length) {
      ctx.highlightedIndex = ctx.filteredItems.length > 0 ? 0 : -1;
    }
  }

  function findNextEnabled(startIndex: number, direction: 1 | -1): number {
    const len = ctx.filteredItems.length;
    if (len === 0) return -1;

    for (let i = 0; i < len; i++) {
      const idx = ((startIndex + direction * (i + 1)) % len + len) % len;
      const item = ctx.filteredItems[idx];
      if (item && !item.disabled) return idx;
    }
    return -1;
  }

  // ── Event handler ──

  function send(event: CommandPaletteEvent): void {
    switch (event.type) {
      case 'OPEN': {
        ctx.open = true;
        ctx.query = '';
        ctx.highlightedIndex = -1;
        refilter();
        break;
      }

      case 'CLOSE': {
        ctx.open = false;
        ctx.query = '';
        ctx.highlightedIndex = -1;
        break;
      }

      case 'SET_QUERY': {
        ctx.query = event.query;
        refilter();
        // Query degisince ilk enabled item'i vurgula
        if (ctx.filteredItems.length > 0) {
          const firstEnabled = findNextEnabled(-1, 1);
          ctx.highlightedIndex = firstEnabled;
        } else {
          ctx.highlightedIndex = -1;
        }
        break;
      }

      case 'HIGHLIGHT_NEXT': {
        if (ctx.filteredItems.length === 0) break;
        const next = findNextEnabled(ctx.highlightedIndex, 1);
        if (next >= 0) ctx.highlightedIndex = next;
        break;
      }

      case 'HIGHLIGHT_PREV': {
        if (ctx.filteredItems.length === 0) break;
        // -1'den geriye gidince sondan basla
        const start = ctx.highlightedIndex < 0 ? ctx.filteredItems.length : ctx.highlightedIndex;
        const prev = findNextEnabled(start, -1);
        if (prev >= 0) ctx.highlightedIndex = prev;
        break;
      }

      case 'SELECT': {
        if (ctx.highlightedIndex < 0) break;
        const item = ctx.filteredItems[ctx.highlightedIndex];
        if (item && !item.disabled) {
          // Secim sonrasi kapat
          ctx.open = false;
          ctx.query = '';
          ctx.highlightedIndex = -1;
        }
        break;
      }

      case 'SELECT_INDEX': {
        const item = ctx.filteredItems[event.index];
        if (item && !item.disabled) {
          ctx.highlightedIndex = event.index;
          ctx.open = false;
          ctx.query = '';
          ctx.highlightedIndex = -1;
        }
        break;
      }

      case 'SET_ITEMS': {
        ctx.items = event.items;
        refilter();
        break;
      }
    }
  }

  // ── DOM props ──

  function getContainerProps(): CommandPaletteDOMProps {
    return {
      role: 'dialog',
      'aria-label': 'Command Palette',
      'aria-modal': true,
    };
  }

  function getInputProps(): CommandPaletteInputDOMProps {
    return {
      role: 'combobox',
      'aria-expanded': ctx.open && ctx.filteredItems.length > 0,
      'aria-autocomplete': 'list',
      'aria-controls': LISTBOX_ID,
      'aria-activedescendant':
        ctx.highlightedIndex >= 0 ? itemId(ctx.highlightedIndex) : undefined,
    };
  }

  function getListProps(): CommandPaletteListDOMProps {
    return {
      role: 'listbox',
      id: LISTBOX_ID,
      'aria-label': 'Results',
    };
  }

  function getItemProps(index: number): CommandPaletteItemDOMProps {
    const item = ctx.filteredItems[index];
    const isHighlighted = ctx.highlightedIndex === index;
    const isDisabled = item ? !!item.disabled : false;

    return {
      role: 'option',
      id: itemId(index),
      'aria-selected': isHighlighted,
      'aria-disabled': isDisabled ? true : undefined,
      'data-highlighted': isHighlighted ? '' : undefined,
      'data-disabled': isDisabled ? '' : undefined,
      'data-index': index,
    };
  }

  function findItem(key: string): CommandPaletteItem | null {
    return ctx.items.find((item) => item.key === key) ?? null;
  }

  // ── API ──

  return {
    getContext: () => ctx,
    send,
    getContainerProps,
    getInputProps,
    getListProps,
    getItemProps,
    findItem,
  };
}
