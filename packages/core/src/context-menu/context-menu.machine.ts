/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ContextMenu state machine.
 *
 * @packageDocumentation
 */

import type {
  ContextMenuConfig,
  ContextMenuContext,
  ContextMenuEvent,
  ContextMenuAPI,
  ContextMenuItem,
} from './context-menu.types';

/**
 * ContextMenu state machine olusturur.
 * Creates a context menu state machine.
 */
export function createContextMenu(config: ContextMenuConfig): ContextMenuAPI {
  const { items, onSelect, onOpenChange } = config;

  // ── State ──
  const ctx: ContextMenuContext = {
    open: false,
    x: 0,
    y: 0,
    highlightedId: null,
    openSubmenuId: null,
  };

  // ── Subscribers ──
  const listeners = new Set<() => void>();

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  // ── Helpers ──
  function findItem(id: string, list: ContextMenuItem[] = items): ContextMenuItem | null {
    for (const item of list) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findItem(id, item.children);
        if (found) return found;
      }
    }
    return null;
  }

  // ── Send ──
  function send(event: ContextMenuEvent): void {
    switch (event.type) {
      case 'OPEN': {
        ctx.open = true;
        ctx.x = event.x;
        ctx.y = event.y;
        ctx.highlightedId = null;
        ctx.openSubmenuId = null;
        onOpenChange?.(true);
        notify();
        break;
      }
      case 'CLOSE': {
        if (!ctx.open) return;
        ctx.open = false;
        ctx.highlightedId = null;
        ctx.openSubmenuId = null;
        onOpenChange?.(false);
        notify();
        break;
      }
      case 'SELECT': {
        const item = findItem(event.itemId);
        if (!item || item.disabled || item.type === 'separator' || item.type === 'submenu') return;
        onSelect?.(event.itemId);
        ctx.open = false;
        ctx.highlightedId = null;
        ctx.openSubmenuId = null;
        onOpenChange?.(false);
        notify();
        break;
      }
      case 'HIGHLIGHT': {
        if (ctx.highlightedId === event.itemId) return;
        ctx.highlightedId = event.itemId;
        notify();
        break;
      }
      case 'OPEN_SUBMENU': {
        const item = findItem(event.itemId);
        if (!item || item.type !== 'submenu' || !item.children) return;
        if (ctx.openSubmenuId === event.itemId) return;
        ctx.openSubmenuId = event.itemId;
        notify();
        break;
      }
      case 'CLOSE_SUBMENU': {
        if (!ctx.openSubmenuId) return;
        ctx.openSubmenuId = null;
        notify();
        break;
      }
    }
  }

  // ── API ──
  return {
    getContext(): ContextMenuContext {
      return ctx;
    },
    send,
    subscribe(callback: () => void): () => void {
      listeners.add(callback);
      return () => {
        listeners.delete(callback);
      };
    },
    getItems(): ContextMenuItem[] {
      return items;
    },
  };
}
