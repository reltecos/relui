/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DropdownMenu state machine.
 *
 * @packageDocumentation
 */

import type { ContextMenuItem } from '../context-menu/context-menu.types';
import type {
  DropdownMenuConfig,
  DropdownMenuContext,
  DropdownMenuEvent,
  DropdownMenuAPI,
} from './dropdown-menu.types';

/**
 * DropdownMenu state machine olusturur.
 * Creates a dropdown menu state machine.
 */
export function createDropdownMenu(config: DropdownMenuConfig): DropdownMenuAPI {
  const { items, onSelect, onOpenChange } = config;

  // ── State ──
  const ctx: DropdownMenuContext = {
    open: false,
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
  function send(event: DropdownMenuEvent): void {
    switch (event.type) {
      case 'OPEN': {
        if (ctx.open) return;
        ctx.open = true;
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
      case 'TOGGLE': {
        if (ctx.open) {
          ctx.open = false;
          ctx.highlightedId = null;
          ctx.openSubmenuId = null;
          onOpenChange?.(false);
        } else {
          ctx.open = true;
          ctx.highlightedId = null;
          ctx.openSubmenuId = null;
          onOpenChange?.(true);
        }
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
    getContext(): DropdownMenuContext {
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
