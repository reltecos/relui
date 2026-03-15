/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ValidationSummary state machine — form hatalarinin toplu gosterimi.
 * ValidationSummary state machine — form errors summary display.
 *
 * @packageDocumentation
 */

import type {
  ValidationError,
  ValidationSummaryEvent,
  ValidationSummaryContext,
  ValidationSummaryConfig,
  ValidationSummaryAPI,
} from './validation-summary.types';

function countBySeverity(errors: ValidationError[]): { errorCount: number; warningCount: number } {
  let errorCount = 0;
  let warningCount = 0;
  for (const e of errors) {
    if (e.severity === 'warning') {
      warningCount++;
    } else {
      errorCount++;
    }
  }
  return { errorCount, warningCount };
}

/**
 * ValidationSummary state machine olusturur.
 * Creates a ValidationSummary state machine.
 */
export function createValidationSummary(config: ValidationSummaryConfig = {}): ValidationSummaryAPI {
  const {
    errors: initialErrors = [],
    onErrorsChange,
  } = config;

  // ── State ──
  const counts = countBySeverity(initialErrors);
  const ctx: ValidationSummaryContext = {
    errors: [...initialErrors],
    errorCount: counts.errorCount,
    warningCount: counts.warningCount,
  };

  const listeners = new Set<() => void>();

  function notify() {
    listeners.forEach((fn) => fn());
  }

  function updateCounts() {
    const c = countBySeverity(ctx.errors);
    ctx.errorCount = c.errorCount;
    ctx.warningCount = c.warningCount;
  }

  // ── API ──
  function send(event: ValidationSummaryEvent): void {
    switch (event.type) {
      case 'SET_ERRORS': {
        ctx.errors = [...event.errors];
        updateCounts();
        onErrorsChange?.(ctx.errors);
        notify();
        break;
      }
      case 'ADD_ERROR': {
        // Ayni field varsa guncelle / Update if same field exists
        const idx = ctx.errors.findIndex((e) => e.field === event.error.field);
        if (idx >= 0) {
          const existing = ctx.errors[idx];
          if (
            existing &&
            existing.message === event.error.message &&
            (existing.severity ?? 'error') === (event.error.severity ?? 'error')
          ) {
            return; // Degisiklik yok / No change
          }
          ctx.errors[idx] = { ...event.error };
        } else {
          ctx.errors.push({ ...event.error });
        }
        updateCounts();
        onErrorsChange?.(ctx.errors);
        notify();
        break;
      }
      case 'REMOVE_ERROR': {
        const prevLen = ctx.errors.length;
        ctx.errors = ctx.errors.filter((e) => e.field !== event.field);
        if (ctx.errors.length === prevLen) return; // Bulunamadi / Not found
        updateCounts();
        onErrorsChange?.(ctx.errors);
        notify();
        break;
      }
      case 'CLEAR_ERRORS': {
        if (ctx.errors.length === 0) return;
        ctx.errors = [];
        ctx.errorCount = 0;
        ctx.warningCount = 0;
        onErrorsChange?.(ctx.errors);
        notify();
        break;
      }
    }
  }

  function getContext(): ValidationSummaryContext {
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
