/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Rating state machine.
 *
 * @packageDocumentation
 */

import type { RatingConfig, RatingContext, RatingEvent, RatingAPI } from './rating.types';

/**
 * Rating state machine olusturur.
 * Creates a rating state machine.
 */
export function createRating(config: RatingConfig = {}): RatingAPI {
  const {
    defaultValue = 0,
    count = 5,
    allowHalf = false,
    readOnly = false,
    onChange,
  } = config;

  // ── State ──
  let value = defaultValue;
  let hoveredValue: number | null = null;
  let isHovering = false;

  // ── Subscribers ──
  const listeners = new Set<() => void>();

  function notify(): void {
    for (const fn of listeners) fn();
  }

  // ── Helpers ──

  function clampValue(v: number): number {
    const clamped = Math.max(0, Math.min(v, count));
    if (allowHalf) {
      return Math.round(clamped * 2) / 2;
    }
    return Math.round(clamped);
  }

  // ── Send ──
  function send(event: RatingEvent): void {
    switch (event.type) {
      case 'SET_VALUE': {
        if (readOnly) return;
        const newValue = clampValue(event.value);
        value = newValue;
        onChange?.(value);
        notify();
        break;
      }
      case 'HOVER': {
        if (readOnly) return;
        hoveredValue = event.value;
        isHovering = true;
        notify();
        break;
      }
      case 'HOVER_END': {
        hoveredValue = null;
        isHovering = false;
        notify();
        break;
      }
      case 'CLEAR': {
        if (readOnly) return;
        value = 0;
        onChange?.(0);
        notify();
        break;
      }
    }
  }

  // ── API ──
  function getContext(): RatingContext {
    return { value, hoveredValue, isHovering };
  }

  function subscribe(callback: () => void): () => void {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  }

  function destroy(): void {
    listeners.clear();
  }

  return { getContext, send, subscribe, destroy };
}
