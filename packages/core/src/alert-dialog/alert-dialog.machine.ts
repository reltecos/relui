/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * createAlertDialog — AlertDialog state machine.
 *
 * Onay diyalogu icin acma/kapama, onay/iptal yonetimi.
 * Manages open/close, confirm/cancel for alert dialog.
 *
 * @packageDocumentation
 */

import type {
  AlertDialogConfig,
  AlertDialogContext,
  AlertDialogEvent,
  AlertDialogAPI,
} from './alert-dialog.types';

export function createAlertDialog(config: AlertDialogConfig = {}): AlertDialogAPI {
  const listeners = new Set<() => void>();

  const ctx: AlertDialogContext = {
    open: config.open ?? false,
    loading: false,
  };

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  function close(): void {
    if (!ctx.open) return;
    ctx.open = false;
    ctx.loading = false;
    config.onOpenChange?.(false);
    notify();
  }

  function send(event: AlertDialogEvent): void {
    switch (event.type) {
      case 'OPEN': {
        if (ctx.open) return;
        ctx.open = true;
        ctx.loading = false;
        config.onOpenChange?.(true);
        notify();
        break;
      }
      case 'CLOSE': {
        close();
        break;
      }
      case 'CONFIRM': {
        if (!ctx.open || ctx.loading) return;
        const result = config.onConfirm?.();
        if (result instanceof Promise) {
          ctx.loading = true;
          notify();
          result.then(() => close()).catch(() => {
            ctx.loading = false;
            notify();
          });
        } else {
          close();
        }
        break;
      }
      case 'CANCEL': {
        if (!ctx.open || ctx.loading) return;
        config.onCancel?.();
        close();
        break;
      }
      case 'SET_LOADING': {
        if (ctx.loading === event.loading) return;
        ctx.loading = event.loading;
        notify();
        break;
      }
    }
  }

  return {
    getContext(): AlertDialogContext {
      return ctx;
    },
    send,
    subscribe(fn: () => void): () => void {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}
