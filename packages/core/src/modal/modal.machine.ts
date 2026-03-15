/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Modal state machine — genel amacli dialog/modal.
 * Modal state machine — general purpose dialog/modal.
 *
 * @packageDocumentation
 */

import type {
  ModalEvent,
  ModalContext,
  ModalConfig,
  ModalAPI,
} from './modal.types';

/**
 * Modal state machine olusturur.
 * Creates a Modal state machine.
 */
export function createModal(config: ModalConfig = {}): ModalAPI {
  const {
    open: initialOpen = false,
    onOpenChange,
  } = config;

  // ── State ──
  const ctx: ModalContext = {
    open: initialOpen,
  };

  const listeners = new Set<() => void>();

  function notify() {
    listeners.forEach((fn) => fn());
  }

  // ── API ──
  function send(event: ModalEvent): void {
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

  function getContext(): ModalContext {
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
