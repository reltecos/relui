/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * createAlert — alert state machine.
 *
 * Basit acik/kapali durumu, kapanabilir alert icin.
 *
 * @packageDocumentation
 */

import type {
  AlertEvent,
  AlertContext,
  AlertConfig,
  AlertAPI,
} from './alert.types';

// ── Factory ────────────────────────────────────────────

export function createAlert(config: AlertConfig = {}): AlertAPI {
  const ctx: AlertContext = {
    open: config.open ?? true,
  };

  const listeners = new Set<() => void>();

  function notify() {
    listeners.forEach((fn) => fn());
  }

  function send(event: AlertEvent): void {
    switch (event.type) {
      case 'CLOSE': {
        if (ctx.open) {
          ctx.open = false;
          config.onClose?.();
          notify();
        }
        break;
      }

      case 'SET_OPEN': {
        if (ctx.open !== event.open) {
          ctx.open = event.open;
          if (!event.open) {
            config.onClose?.();
          }
          notify();
        }
        break;
      }
    }
  }

  function getRootProps(): Record<string, unknown> {
    return {
      role: 'alert',
    };
  }

  return {
    getContext: () => ctx,
    send,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    getRootProps,
  };
}
