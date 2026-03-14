/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Progress state machine — deger izleme ve a11y props.
 * Progress state machine — value tracking and a11y props.
 *
 * @packageDocumentation
 */

import type { ProgressConfig, ProgressEvent, ProgressContext, ProgressAPI } from './progress.types';

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/**
 * Progress state machine olusturur.
 * Creates a progress state machine.
 */
export function createProgress(config: ProgressConfig = {}): ProgressAPI {
  const {
    value: initialValue = 0,
    min = 0,
    max = 100,
    indeterminate: initialIndeterminate = false,
  } = config;

  const listeners = new Set<() => void>();

  const ctx: ProgressContext = {
    value: clamp(initialValue, min, max),
    min,
    max,
    indeterminate: initialIndeterminate,
  };

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  function send(event: ProgressEvent): void {
    switch (event.type) {
      case 'SET_VALUE': {
        const clamped = clamp(event.value, ctx.min, ctx.max);
        if (clamped !== ctx.value) {
          ctx.value = clamped;
          notify();
        }
        break;
      }
      case 'SET_INDETERMINATE': {
        if (event.indeterminate !== ctx.indeterminate) {
          ctx.indeterminate = event.indeterminate;
          notify();
        }
        break;
      }
    }
  }

  function getPercent(): number {
    if (ctx.max === ctx.min) return 0;
    return ((ctx.value - ctx.min) / (ctx.max - ctx.min)) * 100;
  }

  function getRootProps(): Record<string, string | number | undefined> {
    const props: Record<string, string | number | undefined> = {
      role: 'progressbar',
      'aria-valuemin': ctx.min,
      'aria-valuemax': ctx.max,
    };

    if (!ctx.indeterminate) {
      props['aria-valuenow'] = ctx.value;
    }

    return props;
  }

  return {
    getContext(): ProgressContext {
      return ctx;
    },
    send,
    subscribe(fn: () => void): () => void {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    getPercent,
    getRootProps,
  };
}
