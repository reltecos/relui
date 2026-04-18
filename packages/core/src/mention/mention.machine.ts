/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Mention state machine.
 *
 * @packageDocumentation
 */

import type { MentionConfig, MentionContext, MentionEvent, MentionAPI, MentionItem } from './mention.types';

export function createMention(config: MentionConfig = {}): MentionAPI {
  const { onSelect } = config;

  let isOpen = false;
  let query = '';
  let items: MentionItem[] = [...(config.items ?? [])];
  let filteredItems: MentionItem[] = [];
  let highlightedIndex = 0;
  let triggerPosition: number | null = null;

  const listeners = new Set<() => void>();
  function notify(): void { for (const fn of listeners) fn(); }

  function filterItems(): void {
    if (query.length === 0) {
      filteredItems = [...items];
    } else {
      const q = query.toLowerCase();
      filteredItems = items.filter((item) => item.label.toLowerCase().includes(q));
    }
    if (highlightedIndex >= filteredItems.length) {
      highlightedIndex = Math.max(0, filteredItems.length - 1);
    }
  }

  function getContext(): MentionContext {
    return {
      isOpen,
      query,
      filteredItems: [...filteredItems],
      highlightedIndex,
      triggerPosition,
    };
  }

  function send(event: MentionEvent): void {
    switch (event.type) {
      case 'OPEN':
        isOpen = true;
        query = '';
        highlightedIndex = 0;
        triggerPosition = event.triggerPosition;
        filterItems();
        notify();
        break;
      case 'CLOSE':
        isOpen = false;
        query = '';
        highlightedIndex = 0;
        triggerPosition = null;
        notify();
        break;
      case 'SET_QUERY':
        query = event.query;
        highlightedIndex = 0;
        filterItems();
        notify();
        break;
      case 'HIGHLIGHT_NEXT':
        if (!isOpen || filteredItems.length === 0) break;
        highlightedIndex = (highlightedIndex + 1) % filteredItems.length;
        notify();
        break;
      case 'HIGHLIGHT_PREV':
        if (!isOpen || filteredItems.length === 0) break;
        highlightedIndex = (highlightedIndex - 1 + filteredItems.length) % filteredItems.length;
        notify();
        break;
      case 'SELECT_ITEM': {
        const idx = event.index ?? highlightedIndex;
        const item = filteredItems[idx];
        if (item) {
          onSelect?.(item);
          isOpen = false;
          query = '';
          highlightedIndex = 0;
          triggerPosition = null;
          notify();
        }
        break;
      }
      case 'SET_ITEMS':
        items = [...event.items];
        filterItems();
        notify();
        break;
      case 'RESET':
        isOpen = false;
        query = '';
        highlightedIndex = 0;
        triggerPosition = null;
        filteredItems = [...items];
        notify();
        break;
    }
  }

  function subscribe(callback: () => void): () => void {
    listeners.add(callback);
    return () => { listeners.delete(callback); };
  }

  function destroy(): void { listeners.clear(); }

  // Initial filter
  filterItems();

  return { getContext, send, subscribe, destroy };
}
