/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useSpotlight — React hook, core machine'i sarmalar.
 * useSpotlight — React hook wrapping the core machine.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useCallback } from 'react';
import {
  createSpotlight,
  type SpotlightProps,
  type SpotlightItem,
  type SpotlightEvent,
  type SpotlightDOMProps,
  type SpotlightInputDOMProps,
  type SpotlightListDOMProps,
  type SpotlightItemDOMProps,
} from '@relteco/relui-core';

// ── Hook props ───────────────────────────────────────────────

/**
 * useSpotlight hook secenekleri / Hook options.
 */
export interface UseSpotlightProps extends SpotlightProps {
  /** Kontrol edilen acik durumu / Controlled open state */
  open?: boolean;

  /** Kontrol edilen sorgu / Controlled query */
  query?: string;

  /** Secim callback / Selection callback */
  onSelect?: (key: string, item: SpotlightItem) => void;

  /** Acik durum degisim callback / Open state change callback */
  onOpenChange?: (open: boolean) => void;

  /** Sorgu degisim callback / Query change callback */
  onQueryChange?: (query: string) => void;
}

/**
 * useSpotlight donus tipi / Return type.
 */
export interface UseSpotlightReturn {
  /** Container DOM props */
  containerProps: SpotlightDOMProps;

  /** Input DOM props */
  inputProps: SpotlightInputDOMProps;

  /** List DOM props */
  listProps: SpotlightListDOMProps;

  /** Item DOM props getter */
  getItemProps: (index: number) => SpotlightItemDOMProps;

  /** Filtrelenmis ogeler / Filtered items */
  filteredItems: SpotlightItem[];

  /** Vurgulanan indeks / Highlighted index */
  highlightedIndex: number;

  /** Arama sorgusu / Search query */
  queryValue: string;

  /** Acik mi / Is open */
  isOpen: boolean;

  /** Yukleniyor mu / Is loading */
  isLoading: boolean;

  /** Son aramalar / Recent searches */
  recentSearches: string[];

  /** Placeholder */
  placeholder: string;

  /** Bos mesaj / Empty message */
  emptyMessage: string;

  /** Yukleniyor mesaji / Loading message */
  loadingMessage: string;

  /** Ac / Open */
  openSpotlight: () => void;

  /** Kapat / Close */
  close: () => void;

  /** Sorgu ayarla / Set query */
  setQuery: (query: string) => void;

  /** Sonraki vurgula / Highlight next */
  highlightNext: () => void;

  /** Onceki vurgula / Highlight prev */
  highlightPrev: () => void;

  /** Sec / Select */
  select: () => void;

  /** Indeksle sec / Select by index */
  selectIndex: (index: number) => void;

  /** Loading ayarla / Set loading */
  setLoading: (loading: boolean) => void;

  /** Son arama ekle / Add recent search */
  addRecentSearch: (query: string) => void;

  /** Son aramalari temizle / Clear recent searches */
  clearRecentSearches: () => void;

  /** Son arama sil / Remove recent search */
  removeRecentSearch: (query: string) => void;

  /** Oge bul / Find item */
  findItem: (key: string) => SpotlightItem | null;
}

// ── Hook ─────────────────────────────────────────────────────

/**
 * useSpotlight — core machine'i sarmalayan React hook.
 * useSpotlight — React hook wrapping the core machine.
 */
export function useSpotlight(props: UseSpotlightProps): UseSpotlightReturn {
  const {
    items,
    placeholder,
    emptyMessage,
    loadingMessage,
    filter,
    recentSearches: recentSearchesProp,
    maxRecentSearches,
    open: openProp,
    query: queryProp,
    onSelect,
    onOpenChange,
    onQueryChange,
  } = props;

  // ── Machine singleton ──
  const machineRef = useRef<ReturnType<typeof createSpotlight> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createSpotlight({
      items,
      placeholder,
      emptyMessage,
      loadingMessage,
      filter,
      recentSearches: recentSearchesProp,
      maxRecentSearches,
    });
  }
  const machine = machineRef.current;

  // ── Force render ──
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  // ── Items prop sync ──
  const prevItemsRef = useRef(items);
  if (items !== prevItemsRef.current) {
    machine.send({ type: 'SET_ITEMS', items: items ?? [] });
    prevItemsRef.current = items;
    forceRender();
  }

  // ── Open prop sync ──
  const prevOpenRef = useRef<boolean | undefined>(undefined);
  if (openProp !== undefined && openProp !== prevOpenRef.current) {
    if (openProp) {
      machine.send({ type: 'OPEN' });
    } else {
      machine.send({ type: 'CLOSE' });
    }
    prevOpenRef.current = openProp;
    forceRender();
  }

  // ── Query prop sync ──
  const prevQueryRef = useRef<string | undefined>(undefined);
  if (queryProp !== undefined && queryProp !== prevQueryRef.current) {
    machine.send({ type: 'SET_QUERY', query: queryProp });
    prevQueryRef.current = queryProp;
    forceRender();
  }

  // ── Send wrapper ──
  const send = useCallback(
    (event: SpotlightEvent) => {
      machine.send(event);
      forceRender();
    },
    [machine],
  );

  // ── Actions ──

  const openSpotlight = useCallback(() => {
    send({ type: 'OPEN' });
    onOpenChange?.(true);
  }, [send, onOpenChange]);

  const close = useCallback(() => {
    send({ type: 'CLOSE' });
    onOpenChange?.(false);
  }, [send, onOpenChange]);

  const setQuery = useCallback(
    (query: string) => {
      send({ type: 'SET_QUERY', query });
      onQueryChange?.(query);
    },
    [send, onQueryChange],
  );

  const highlightNext = useCallback(() => {
    send({ type: 'HIGHLIGHT_NEXT' });
  }, [send]);

  const highlightPrev = useCallback(() => {
    send({ type: 'HIGHLIGHT_PREV' });
  }, [send]);

  const select = useCallback(() => {
    const ctx = machine.getContext();
    const item = ctx.filteredItems[ctx.highlightedIndex];
    if (item && !item.disabled) {
      onSelect?.(item.key, item);
    }
    send({ type: 'SELECT' });
    if (item && !item.disabled) {
      onOpenChange?.(false);
    }
  }, [machine, send, onSelect, onOpenChange]);

  const selectIndex = useCallback(
    (index: number) => {
      const ctx = machine.getContext();
      const item = ctx.filteredItems[index];
      if (item && !item.disabled) {
        onSelect?.(item.key, item);
      }
      send({ type: 'SELECT_INDEX', index });
      if (item && !item.disabled) {
        onOpenChange?.(false);
      }
    },
    [machine, send, onSelect, onOpenChange],
  );

  const setLoading = useCallback(
    (loading: boolean) => {
      send({ type: 'SET_LOADING', loading });
    },
    [send],
  );

  const addRecentSearch = useCallback(
    (query: string) => {
      send({ type: 'ADD_RECENT_SEARCH', query });
    },
    [send],
  );

  const clearRecentSearches = useCallback(() => {
    send({ type: 'CLEAR_RECENT_SEARCHES' });
  }, [send]);

  const removeRecentSearch = useCallback(
    (query: string) => {
      send({ type: 'REMOVE_RECENT_SEARCH', query });
    },
    [send],
  );

  const findItem = useCallback(
    (key: string) => machine.findItem(key),
    [machine],
  );

  // ── Context ──
  const ctx = machine.getContext();

  return {
    containerProps: machine.getContainerProps(),
    inputProps: machine.getInputProps(),
    listProps: machine.getListProps(),
    getItemProps: machine.getItemProps.bind(machine),
    filteredItems: ctx.filteredItems,
    highlightedIndex: ctx.highlightedIndex,
    queryValue: ctx.query,
    isOpen: ctx.open,
    isLoading: ctx.loading,
    recentSearches: ctx.recentSearches,
    placeholder: ctx.placeholder,
    emptyMessage: ctx.emptyMessage,
    loadingMessage: ctx.loadingMessage,
    openSpotlight,
    close,
    setQuery,
    highlightNext,
    highlightPrev,
    select,
    selectIndex,
    setLoading,
    addRecentSearch,
    clearRecentSearches,
    removeRecentSearch,
    findItem,
  };
}
