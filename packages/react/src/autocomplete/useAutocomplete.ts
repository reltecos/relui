/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useAutocomplete — Autocomplete React hook.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import {
  createAutocomplete,
  type AutocompleteConfig,
  type AutocompleteAPI,
  type AutocompleteOption,
} from '@relteco/relui-core';

// ── Hook Props ──────────────────────────────────────

export interface UseAutocompleteProps extends AutocompleteConfig {
  /** Controlled deger / Controlled value */
  value?: string;
}

// ── Hook Return ─────────────────────────────────────

export interface UseAutocompleteReturn {
  /** Arama metni / Search query */
  query: string;
  /** Secili deger / Selected value */
  selectedValue: string;
  /** Secili etiket / Selected label */
  selectedLabel: string;
  /** Vurgulanan index / Highlighted index */
  highlightedIndex: number;
  /** Acik mi / Is open */
  isOpen: boolean;
  /** Filtrelenmis secenekler / Filtered options */
  filteredOptions: readonly AutocompleteOption[];
  /** Query ayarla / Set query */
  setQuery: (query: string) => void;
  /** Secenek sec / Select option */
  select: (value: string) => void;
  /** Sonraki vurgula / Highlight next */
  highlightNext: () => void;
  /** Onceki vurgula / Highlight previous */
  highlightPrev: () => void;
  /** Ac / Open */
  open: () => void;
  /** Kapat / Close */
  close: () => void;
  /** Temizle / Clear */
  clear: () => void;
  /** Core API / Core API */
  api: AutocompleteAPI;
}

/**
 * useAutocomplete — Autocomplete yonetim hook.
 * useAutocomplete — Autocomplete management hook.
 */
export function useAutocomplete(props: UseAutocompleteProps = {}): UseAutocompleteReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  const apiRef = useRef<AutocompleteAPI | null>(null);
  const prevRef = useRef<UseAutocompleteProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createAutocomplete({
      options: props.options,
      defaultValue: props.value ?? props.defaultValue,
      filterFn: props.filterFn,
      onChange: props.onChange,
      onQueryChange: props.onQueryChange,
    });
  }
  const api = apiRef.current;

  // ── Prop sync ──
  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }

    if (prev.value !== props.value && props.value !== undefined) {
      api.send({ type: 'SELECT', value: props.value });
      forceRender();
    }
    if (prev.options !== props.options && props.options !== undefined) {
      api.send({ type: 'SET_OPTIONS', options: props.options });
      forceRender();
    }

    prevRef.current = props;
  });

  // ── Subscribe ──
  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const ctx = api.getContext();

  const setQuery = useCallback((q: string) => api.send({ type: 'SET_QUERY', query: q }), [api]);
  const select = useCallback((v: string) => api.send({ type: 'SELECT', value: v }), [api]);
  const highlightNext = useCallback(() => api.send({ type: 'HIGHLIGHT_NEXT' }), [api]);
  const highlightPrev = useCallback(() => api.send({ type: 'HIGHLIGHT_PREV' }), [api]);
  const open = useCallback(() => api.send({ type: 'OPEN' }), [api]);
  const close = useCallback(() => api.send({ type: 'CLOSE' }), [api]);
  const clear = useCallback(() => api.send({ type: 'CLEAR' }), [api]);

  return {
    query: ctx.query,
    selectedValue: ctx.selectedValue,
    selectedLabel: ctx.selectedLabel,
    highlightedIndex: ctx.highlightedIndex,
    isOpen: ctx.isOpen,
    filteredOptions: ctx.filteredOptions,
    setQuery,
    select,
    highlightNext,
    highlightPrev,
    open,
    close,
    clear,
    api,
  };
}
