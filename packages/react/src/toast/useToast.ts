/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useToast — Toast React hook.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import {
  createToast,
  type ToastConfig,
  type ToastAPI,
  type ToastStatus,
  type ToastItem,
} from '@relteco/relui-core';

// ── Hook Props ──────────────────────────────────────

export type UseToastProps = ToastConfig;

// ── Hook Return ─────────────────────────────────────

export interface UseToastReturn {
  /** Aktif toastlar / Active toasts */
  toasts: ToastItem[];
  /** Toast ekle / Add toast */
  add: (options: {
    id?: string;
    status?: ToastStatus;
    title?: string;
    message: string;
    duration?: number;
    closable?: boolean;
  }) => string;
  /** Toast kaldir / Remove toast */
  remove: (id: string) => void;
  /** Tum toastlari kaldir / Remove all toasts */
  removeAll: () => void;
  /** Toast guncelle / Update toast */
  update: (id: string, updates: Partial<Pick<ToastItem, 'title' | 'message' | 'status' | 'duration'>>) => void;
  /** Toast duraklat / Pause toast */
  pause: (id: string) => void;
  /** Toast devam ettir / Resume toast */
  resume: (id: string) => void;
  /** Core API / Core API */
  api: ToastAPI;
}

let idCounter = 0;

/**
 * useToast — Toast yonetim hook.
 * useToast — Toast management hook.
 */
export function useToast(props: UseToastProps = {}): UseToastReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  const apiRef = useRef<ToastAPI | null>(null);
  if (!apiRef.current) {
    apiRef.current = createToast(props);
  }
  const api = apiRef.current;

  // ── Subscribe ──
  useEffect(() => {
    return api.subscribe(() => forceRender());
  }, [api]);

  // ── Auto-dismiss timers ──
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const startTimer = useCallback(
    (toast: ToastItem) => {
      if (toast.duration <= 0) return;

      // Mevcut timer'i temizle
      const existing = timersRef.current.get(toast.id);
      if (existing) clearTimeout(existing);

      const delay = toast.paused ? toast.remaining : toast.duration;
      if (delay <= 0) return;

      const timer = setTimeout(() => {
        api.send({ type: 'REMOVE', id: toast.id });
        timersRef.current.delete(toast.id);
      }, delay);

      timersRef.current.set(toast.id, timer);
    },
    [api],
  );

  const stopTimer = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  // Toastlar degistiginde timer'lari yonet
  useEffect(() => {
    const ctx = api.getContext();
    const activeIds = new Set(ctx.toasts.map((t) => t.id));

    // Kaldirilan toastlarin timer'larini temizle
    for (const [id] of timersRef.current) {
      if (!activeIds.has(id)) {
        stopTimer(id);
      }
    }

    // Aktif toastlar icin timer baslat
    for (const toast of ctx.toasts) {
      if (!toast.paused && toast.duration > 0 && !timersRef.current.has(toast.id)) {
        startTimer(toast);
      }
    }
  });

  // Cleanup
  useEffect(() => {
    return () => {
      for (const timer of timersRef.current.values()) {
        clearTimeout(timer);
      }
      timersRef.current.clear();
    };
  }, []);

  const add = useCallback(
    (options: {
      id?: string;
      status?: ToastStatus;
      title?: string;
      message: string;
      duration?: number;
      closable?: boolean;
    }): string => {
      const id = options.id || `toast-${++idCounter}`;
      api.send({
        type: 'ADD',
        toast: {
          id,
          status: options.status || 'info',
          title: options.title,
          message: options.message,
          duration: options.duration ?? props.defaultDuration ?? 5000,
          closable: options.closable ?? true,
        },
      });
      return id;
    },
    [api, props.defaultDuration],
  );

  const remove = useCallback(
    (id: string) => {
      stopTimer(id);
      api.send({ type: 'REMOVE', id });
    },
    [api, stopTimer],
  );

  const removeAll = useCallback(() => {
    for (const timer of timersRef.current.values()) {
      clearTimeout(timer);
    }
    timersRef.current.clear();
    api.send({ type: 'REMOVE_ALL' });
  }, [api]);

  const update = useCallback(
    (id: string, updates: Partial<Pick<ToastItem, 'title' | 'message' | 'status' | 'duration'>>) => {
      api.send({ type: 'UPDATE', id, updates });
    },
    [api],
  );

  const pauseToast = useCallback(
    (id: string) => {
      stopTimer(id);
      api.send({ type: 'PAUSE', id });
    },
    [api, stopTimer],
  );

  const resumeToast = useCallback(
    (id: string) => {
      api.send({ type: 'RESUME', id });
      const toast = api.getContext().toasts.find((t) => t.id === id);
      if (toast && !toast.paused && toast.duration > 0) {
        startTimer(toast);
      }
    },
    [api, startTimer],
  );

  return {
    toasts: api.getContext().toasts,
    add,
    remove,
    removeAll,
    update,
    pause: pauseToast,
    resume: resumeToast,
    api,
  };
}
