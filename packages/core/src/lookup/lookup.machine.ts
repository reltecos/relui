/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { LookupConfig, LookupContext, LookupEvent, LookupAPI, LookupItem } from './lookup.types';

export function createLookup(config: LookupConfig = {}): LookupAPI {
  const { minChars = 1, onSelect } = config;

  let isOpen = false;
  let query = '';
  let items: LookupItem[] = [];
  let highlightedIndex = 0;
  let selectedItem: LookupItem | null = null;
  let isLoading = false;

  const listeners = new Set<() => void>();
  function notify(): void { for (const fn of listeners) fn(); }

  function getContext(): LookupContext {
    return { isOpen, query, items: [...items], highlightedIndex, selectedItem, isLoading };
  }

  function send(event: LookupEvent): void {
    switch (event.type) {
      case 'SET_QUERY':
        query = event.query;
        highlightedIndex = 0;
        isOpen = query.length >= minChars;
        if (!isOpen) items = [];
        notify();
        break;
      case 'SET_ITEMS':
        items = [...event.items];
        highlightedIndex = 0;
        isLoading = false;
        notify();
        break;
      case 'SET_LOADING':
        isLoading = event.loading;
        notify();
        break;
      case 'HIGHLIGHT_NEXT':
        if (!isOpen || items.length === 0) break;
        highlightedIndex = (highlightedIndex + 1) % items.length;
        notify();
        break;
      case 'HIGHLIGHT_PREV':
        if (!isOpen || items.length === 0) break;
        highlightedIndex = (highlightedIndex - 1 + items.length) % items.length;
        notify();
        break;
      case 'SELECT_ITEM': {
        const idx = event.index ?? highlightedIndex;
        const item = items[idx];
        if (item) {
          selectedItem = item;
          query = item.label;
          isOpen = false;
          onSelect?.(item);
        }
        notify();
        break;
      }
      case 'OPEN':
        if (query.length >= minChars) isOpen = true;
        notify();
        break;
      case 'CLOSE':
        isOpen = false;
        notify();
        break;
      case 'CLEAR':
        query = '';
        items = [];
        selectedItem = null;
        isOpen = false;
        highlightedIndex = 0;
        isLoading = false;
        notify();
        break;
    }
  }

  function subscribe(callback: () => void): () => void {
    listeners.add(callback);
    return () => { listeners.delete(callback); };
  }

  function destroy(): void { listeners.clear(); }

  return { getContext, send, subscribe, destroy };
}
