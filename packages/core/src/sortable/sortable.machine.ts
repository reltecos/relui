/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  SortableConfig, SortableContext, SortableEvent, SortableAPI,
} from './sortable.types';

export function createSortable(config: SortableConfig): SortableAPI {
  const { onReorder } = config;

  let items = [...config.items];
  let activeId: string | null = null;
  let overIndex: number | null = null;

  const listeners = new Set<() => void>();
  function notify(): void { for (const fn of listeners) fn(); }

  function getContext(): SortableContext {
    return { items: [...items], activeId, overIndex, isDragging: activeId !== null };
  }

  function send(event: SortableEvent): void {
    switch (event.type) {
      case 'DRAG_START': {
        if (!items.includes(event.itemId)) return;
        activeId = event.itemId;
        overIndex = items.indexOf(event.itemId);
        notify();
        break;
      }
      case 'DRAG_OVER': {
        if (!activeId) return;
        if (event.overIndex < 0 || event.overIndex >= items.length) return;
        overIndex = event.overIndex;
        notify();
        break;
      }
      case 'DRAG_END': {
        if (!activeId) return;
        if (overIndex !== null) {
          const fromIndex = items.indexOf(activeId);
          if (fromIndex !== -1 && fromIndex !== overIndex) {
            const next = [...items];
            const moved = next.splice(fromIndex, 1)[0];
            if (moved !== undefined) {
              next.splice(overIndex, 0, moved);
              items = next;
              onReorder?.(items);
            }
          }
        }
        activeId = null;
        overIndex = null;
        notify();
        break;
      }
      case 'REORDER': {
        if (event.fromIndex < 0 || event.fromIndex >= items.length) return;
        if (event.toIndex < 0 || event.toIndex >= items.length) return;
        if (event.fromIndex === event.toIndex) return;
        const next = [...items];
        const moved = next.splice(event.fromIndex, 1)[0];
        if (moved !== undefined) {
          next.splice(event.toIndex, 0, moved);
          items = next;
          onReorder?.(items);
          notify();
        }
        break;
      }
    }
  }

  function subscribe(fn: () => void): () => void {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }

  function destroy(): void { listeners.clear(); }

  return { getContext, send, subscribe, destroy };
}
