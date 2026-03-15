/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * SplashScreen state machine — uygulama acilis ekrani.
 * SplashScreen state machine — application splash screen.
 *
 * @packageDocumentation
 */

import type {
  SplashScreenEvent,
  SplashScreenContext,
  SplashScreenConfig,
  SplashScreenAPI,
} from './splash-screen.types';

/**
 * SplashScreen state machine olusturur.
 * Creates a SplashScreen state machine.
 */
export function createSplashScreen(config: SplashScreenConfig = {}): SplashScreenAPI {
  const {
    visible: initialVisible = false,
    message: initialMessage = '',
    autoClose = true,
    autoCloseDelay = 500,
    onComplete,
    onVisibleChange,
  } = config;

  // ── State ──
  const ctx: SplashScreenContext = {
    visible: initialVisible,
    progress: 0,
    message: initialMessage,
  };

  const listeners = new Set<() => void>();
  let autoCloseTimer: ReturnType<typeof setTimeout> | null = null;

  function notify() {
    listeners.forEach((fn) => fn());
  }

  function clearAutoCloseTimer() {
    if (autoCloseTimer !== null) {
      clearTimeout(autoCloseTimer);
      autoCloseTimer = null;
    }
  }

  function scheduleAutoClose() {
    clearAutoCloseTimer();
    if (autoCloseDelay > 0) {
      autoCloseTimer = setTimeout(() => {
        ctx.visible = false;
        onVisibleChange?.(false);
        onComplete?.();
        notify();
      }, autoCloseDelay);
    } else {
      ctx.visible = false;
      onVisibleChange?.(false);
      onComplete?.();
      notify();
    }
  }

  // ── API ──
  function send(event: SplashScreenEvent): void {
    switch (event.type) {
      case 'OPEN': {
        if (ctx.visible) return;
        ctx.visible = true;
        onVisibleChange?.(true);
        notify();
        break;
      }
      case 'CLOSE': {
        if (!ctx.visible) return;
        clearAutoCloseTimer();
        ctx.visible = false;
        onVisibleChange?.(false);
        notify();
        break;
      }
      case 'SET_PROGRESS': {
        const clamped = Math.max(0, Math.min(100, event.value));
        if (clamped === ctx.progress) return;
        ctx.progress = clamped;
        notify();

        if (autoClose && clamped >= 100) {
          scheduleAutoClose();
        }
        break;
      }
      case 'SET_MESSAGE': {
        if (event.message === ctx.message) return;
        ctx.message = event.message;
        notify();
        break;
      }
    }
  }

  function getContext(): SplashScreenContext {
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
