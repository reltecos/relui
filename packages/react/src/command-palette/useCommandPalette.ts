/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useCommandPalette — React hook, core machine'i sarmalar.
 * useCommandPalette — React hook wrapping the core machine.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useCallback } from 'react';
import {
  createCommandPalette,
  type CommandPaletteProps,
  type CommandPaletteItem,
  type CommandPaletteEvent,
  type CommandPaletteDOMProps,
  type CommandPaletteInputDOMProps,
  type CommandPaletteListDOMProps,
  type CommandPaletteItemDOMProps,
} from '@relteco/relui-core';

// ── Hook props ───────────────────────────────────────────────

/**
 * useCommandPalette hook secenekleri / Hook options.
 */
export interface UseCommandPaletteProps extends CommandPaletteProps {
  /** Kontrol edilen acik durumu / Controlled open state */
  open?: boolean;

  /** Kontrol edilen sorgu / Controlled query */
  query?: string;

  /** Secim callback / Selection callback */
  onSelect?: (key: string, item: CommandPaletteItem) => void;

  /** Acik durum degisim callback / Open state change callback */
  onOpenChange?: (open: boolean) => void;

  /** Sorgu degisim callback / Query change callback */
  onQueryChange?: (query: string) => void;
}

/**
 * useCommandPalette donus tipi / Return type.
 */
export interface UseCommandPaletteReturn {
  /** Container DOM props */
  containerProps: CommandPaletteDOMProps;

  /** Input DOM props */
  inputProps: CommandPaletteInputDOMProps;

  /** List DOM props */
  listProps: CommandPaletteListDOMProps;

  /** Item DOM props getter */
  getItemProps: (index: number) => CommandPaletteItemDOMProps;

  /** Filtrelenmis ogeler / Filtered items */
  filteredItems: CommandPaletteItem[];

  /** Vurgulanan indeks / Highlighted index */
  highlightedIndex: number;

  /** Arama sorgusu / Search query */
  queryValue: string;

  /** Acik mi / Is open */
  isOpen: boolean;

  /** Placeholder */
  placeholder: string;

  /** Bos mesaj / Empty message */
  emptyMessage: string;

  /** Ac / Open */
  openPalette: () => void;

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

  /** Oge bul / Find item */
  findItem: (key: string) => CommandPaletteItem | null;
}

// ── Hook ─────────────────────────────────────────────────────

/**
 * useCommandPalette — core machine'i sarmalayan React hook.
 * useCommandPalette — React hook wrapping the core machine.
 */
export function useCommandPalette(props: UseCommandPaletteProps): UseCommandPaletteReturn {
  const {
    items,
    placeholder,
    emptyMessage,
    filter,
    open: openProp,
    query: queryProp,
    onSelect,
    onOpenChange,
    onQueryChange,
  } = props;

  // ── Machine singleton ──
  const machineRef = useRef<ReturnType<typeof createCommandPalette> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createCommandPalette({ items, placeholder, emptyMessage, filter });
  }
  const machine = machineRef.current;

  // ── Force render ──
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  // ── Items prop sync ──
  const prevItemsRef = useRef(items);
  if (items !== prevItemsRef.current) {
    machine.send({ type: 'SET_ITEMS', items });
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
    (event: CommandPaletteEvent) => {
      machine.send(event);
      forceRender();
    },
    [machine],
  );

  // ── Actions ──

  const openPalette = useCallback(() => {
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
    placeholder: ctx.placeholder,
    emptyMessage: ctx.emptyMessage,
    openPalette,
    close,
    setQuery,
    highlightNext,
    highlightPrev,
    select,
    selectIndex,
    findItem,
  };
}
