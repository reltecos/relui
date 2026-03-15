/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Popover state machine.
 *
 * @packageDocumentation
 */

import type { PopoverConfig, PopoverContext, PopoverEvent, PopoverAPI } from './popover.types';

/**
 * Popover state machine olusturur.
 * Creates a popover state machine.
 */
export function createPopover(config: PopoverConfig = {}): PopoverAPI {
  const { open: initialOpen = false, onOpenChange } = config;

  // ── State ──
  const ctx: PopoverContext = {
    open: initialOpen,
  };

  // ── Subscribers ──
  const listeners = new Set<() => void>();

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  // ── Send ──
  function send(event: PopoverEvent): void {
    switch (event.type) {
      case 'OPEN': {
        if (ctx.open) return;
        ctx.open = true;
        onOpenChange?.(true);
        notify();
        break;
      }
      case 'CLOSE': {
        if (!ctx.open) return;
        ctx.open = false;
        onOpenChange?.(false);
        notify();
        break;
      }
      case 'TOGGLE': {
        ctx.open = !ctx.open;
        onOpenChange?.(ctx.open);
        notify();
        break;
      }
    }
  }

  // ── API ──
  return {
    getContext(): PopoverContext {
      return ctx;
    },
    send,
    subscribe(callback: () => void): () => void {
      listeners.add(callback);
      return () => {
        listeners.delete(callback);
      };
    },
  };
}
