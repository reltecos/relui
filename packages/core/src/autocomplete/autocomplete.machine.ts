/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Autocomplete state machine.
 *
 * @packageDocumentation
 */

import type {
  AutocompleteOption,
  AutocompleteConfig,
  AutocompleteContext,
  AutocompleteEvent,
  AutocompleteAPI,
} from './autocomplete.types';

/** Varsayilan filtreleme fonksiyonu / Default filter function */
export function defaultFilterFn(option: AutocompleteOption, query: string): boolean {
  return option.label.toLowerCase().includes(query.toLowerCase());
}

/**
 * Autocomplete state machine olusturur.
 * Creates an Autocomplete state machine.
 */
export function createAutocomplete(config: AutocompleteConfig = {}): AutocompleteAPI {
  const {
    options: initOptions = [],
    defaultValue = '',
    filterFn = defaultFilterFn,
    onChange,
    onQueryChange,
  } = config;

  // ── State ──
  let options: AutocompleteOption[] = [...initOptions];
  let query = '';
  let selectedValue = defaultValue;
  let selectedLabel = '';
  let highlightedIndex = -1;
  let isOpen = false;
  let filteredOptions: AutocompleteOption[] = [];

  // Resolve initial label
  if (defaultValue) {
    const found = options.find((o) => o.value === defaultValue);
    if (found) {
      selectedLabel = found.label;
      query = found.label;
    }
  }

  // Initial filter
  filteredOptions = options.filter((o) => defaultFilterFn(o, query));

  const listeners = new Set<() => void>();

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  function applyFilter(): void {
    filteredOptions = options.filter((o) => filterFn(o, query));
    // Clamp highlighted index
    if (highlightedIndex >= filteredOptions.length) {
      highlightedIndex = filteredOptions.length - 1;
    }
  }

  function findNextEnabled(startIdx: number, direction: 1 | -1): number {
    const len = filteredOptions.length;
    if (len === 0) return -1;

    let idx = startIdx;
    for (let i = 0; i < len; i++) {
      idx = ((idx + direction) % len + len) % len;
      const opt = filteredOptions[idx];
      if (opt && !opt.disabled) return idx;
    }
    return -1;
  }

  // ── Send ──
  function send(event: AutocompleteEvent): void {
    switch (event.type) {
      case 'SET_QUERY': {
        query = event.query;
        applyFilter();
        highlightedIndex = -1;
        isOpen = query.length > 0 && filteredOptions.length > 0;
        onQueryChange?.(query);
        notify();
        break;
      }
      case 'SELECT': {
        const opt = filteredOptions.find((o) => o.value === event.value);
        if (!opt || opt.disabled) return;
        selectedValue = opt.value;
        selectedLabel = opt.label;
        query = opt.label;
        isOpen = false;
        highlightedIndex = -1;
        onChange?.(selectedValue, selectedLabel);
        notify();
        break;
      }
      case 'HIGHLIGHT_NEXT': {
        if (!isOpen) {
          isOpen = filteredOptions.length > 0;
          if (!isOpen) return;
        }
        highlightedIndex = findNextEnabled(highlightedIndex, 1);
        notify();
        break;
      }
      case 'HIGHLIGHT_PREV': {
        if (!isOpen) {
          isOpen = filteredOptions.length > 0;
          if (!isOpen) return;
        }
        highlightedIndex = findNextEnabled(highlightedIndex, -1);
        notify();
        break;
      }
      case 'OPEN': {
        if (isOpen) return;
        applyFilter();
        isOpen = filteredOptions.length > 0;
        notify();
        break;
      }
      case 'CLOSE': {
        if (!isOpen) return;
        isOpen = false;
        highlightedIndex = -1;
        notify();
        break;
      }
      case 'SET_OPTIONS': {
        options = [...event.options];
        applyFilter();
        notify();
        break;
      }
      case 'CLEAR': {
        query = '';
        selectedValue = '';
        selectedLabel = '';
        highlightedIndex = -1;
        isOpen = false;
        applyFilter();
        onChange?.('', '');
        notify();
        break;
      }
    }
  }

  // ── API ──
  return {
    getContext(): AutocompleteContext {
      return {
        query,
        selectedValue,
        selectedLabel,
        highlightedIndex,
        isOpen,
        filteredOptions,
        options,
      };
    },
    send,
    subscribe(callback: () => void): () => void {
      listeners.add(callback);
      return () => { listeners.delete(callback); };
    },
    destroy(): void {
      listeners.clear();
    },
  };
}
