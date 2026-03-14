/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Toast state machine — toast kuyruk yonetimi.
 * Toast state machine — toast queue management.
 *
 * @packageDocumentation
 */

import type { ToastConfig, ToastEvent, ToastContext, ToastItem, ToastAPI } from './toast.types';

/**
 * Toast state machine olusturur.
 * Creates a toast state machine.
 */
export function createToast(config: ToastConfig = {}): ToastAPI {
  const {
    maxVisible = 5,
    defaultDuration = 5000,
    onRemove,
  } = config;

  const listeners = new Set<() => void>();

  const ctx: ToastContext = {
    toasts: [],
    maxVisible,
  };

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  function findToast(id: string): ToastItem | undefined {
    return ctx.toasts.find((t) => t.id === id);
  }

  function send(event: ToastEvent): void {
    switch (event.type) {
      case 'ADD': {
        const newToast: ToastItem = {
          ...event.toast,
          duration: event.toast.duration ?? defaultDuration,
          createdAt: Date.now(),
          paused: false,
          remaining: event.toast.duration ?? defaultDuration,
        };

        // Ayni id varsa guncelle
        const existingIndex = ctx.toasts.findIndex((t) => t.id === newToast.id);
        if (existingIndex >= 0) {
          ctx.toasts[existingIndex] = newToast;
        } else {
          ctx.toasts.push(newToast);
        }

        // maxVisible asimi — en eski toast'i kaldir
        while (ctx.toasts.length > ctx.maxVisible) {
          const removed = ctx.toasts.shift();
          if (removed) onRemove?.(removed.id);
        }

        notify();
        break;
      }

      case 'REMOVE': {
        const index = ctx.toasts.findIndex((t) => t.id === event.id);
        if (index >= 0) {
          ctx.toasts.splice(index, 1);
          onRemove?.(event.id);
          notify();
        }
        break;
      }

      case 'REMOVE_ALL': {
        const ids = ctx.toasts.map((t) => t.id);
        ctx.toasts = [];
        ids.forEach((id) => onRemove?.(id));
        notify();
        break;
      }

      case 'PAUSE': {
        const toast = findToast(event.id);
        if (toast && !toast.paused) {
          toast.paused = true;
          // Kalan sureyi kaydet
          const elapsed = Date.now() - toast.createdAt;
          toast.remaining = Math.max(0, toast.duration - elapsed);
          notify();
        }
        break;
      }

      case 'RESUME': {
        const toast = findToast(event.id);
        if (toast && toast.paused) {
          toast.paused = false;
          // createdAt'i guncelle, kalan sureyi yansitacak sekilde
          toast.createdAt = Date.now() - (toast.duration - toast.remaining);
          notify();
        }
        break;
      }

      case 'UPDATE': {
        const toast = findToast(event.id);
        if (toast) {
          if (event.updates.title !== undefined) toast.title = event.updates.title;
          if (event.updates.message !== undefined) toast.message = event.updates.message;
          if (event.updates.status !== undefined) toast.status = event.updates.status;
          if (event.updates.duration !== undefined) {
            toast.duration = event.updates.duration;
            toast.remaining = event.updates.duration;
            toast.createdAt = Date.now();
          }
          notify();
        }
        break;
      }
    }
  }

  return {
    getContext(): ToastContext {
      return ctx;
    },
    send,
    subscribe(fn: () => void): () => void {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}
