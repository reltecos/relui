/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Drawer state machine — kenardan kayan panel.
 * Drawer state machine — slide-in panel from edge.
 *
 * @packageDocumentation
 */

import type {
  DrawerEvent,
  DrawerContext,
  DrawerConfig,
  DrawerAPI,
} from './drawer.types';

/**
 * Drawer state machine olusturur.
 * Creates a Drawer state machine.
 */
export function createDrawer(config: DrawerConfig = {}): DrawerAPI {
  const {
    open: initialOpen = false,
    onOpenChange,
  } = config;

  const ctx: DrawerContext = {
    open: initialOpen,
  };

  const listeners = new Set<() => void>();

  function notify() {
    listeners.forEach((fn) => fn());
  }

  function send(event: DrawerEvent): void {
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

  function getContext(): DrawerContext {
    return ctx;
  }

  function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  return { getContext, send, subscribe };
}
