/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Tooltip state machine.
 *
 * @packageDocumentation
 */

import type { TooltipConfig, TooltipContext, TooltipEvent, TooltipAPI } from './tooltip.types';

/**
 * Tooltip state machine olusturur.
 * Creates a tooltip state machine.
 */
export function createTooltip(config: TooltipConfig = {}): TooltipAPI {
  const { open: initialOpen = false, onOpenChange } = config;

  // ── State ──
  const ctx: TooltipContext = {
    open: initialOpen,
  };

  // ── Subscribers ──
  const listeners = new Set<() => void>();

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  // ── Send ──
  function send(event: TooltipEvent): void {
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
    }
  }

  // ── API ──
  return {
    getContext(): TooltipContext {
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
