/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * PinInput state machine.
 *
 * @packageDocumentation
 */

import type {
  PinInputConfig,
  PinInputContext,
  PinInputEvent,
  PinInputAPI,
} from './pin-input.types';

/**
 * PinInput state machine olusturur.
 * Creates a PinInput state machine.
 */
export function createPinInput(config: PinInputConfig = {}): PinInputAPI {
  const {
    length = 4,
    defaultValue = '',
    type = 'number',
    onComplete,
    onChange,
  } = config;

  // ── Validation ──
  const numberPattern = /^[0-9]$/;
  const alphanumericPattern = /^[a-zA-Z0-9]$/;

  function isValidChar(char: string): boolean {
    if (type === 'number') return numberPattern.test(char);
    return alphanumericPattern.test(char);
  }

  // ── State ──
  const values: string[] = new Array<string>(length).fill('');
  let focusIndex = 0;

  // Initialize from defaultValue
  if (defaultValue) {
    for (let i = 0; i < Math.min(defaultValue.length, length); i++) {
      const ch = defaultValue[i] ?? '';
      if (ch && isValidChar(ch)) {
        values[i] = ch;
      }
    }
  }

  // ── Subscribers ──
  const listeners = new Set<() => void>();

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  // ── Derived ──
  function getIsComplete(): boolean {
    return values.every((v) => v !== '');
  }

  function getJoinedValue(): string {
    return values.join('');
  }

  // ── getContext ──
  function getContext(): PinInputContext {
    return {
      values: [...values],
      focusIndex,
      isComplete: getIsComplete(),
      value: getJoinedValue(),
    };
  }

  // ── Send ──
  function send(event: PinInputEvent): void {
    switch (event.type) {
      case 'SET_CHAR': {
        const { index, char } = event;
        if (index < 0 || index >= length) return;
        if (!isValidChar(char)) return;
        values[index] = char;
        focusIndex = Math.min(index + 1, length - 1);
        const joined = getJoinedValue();
        onChange?.(joined);
        if (getIsComplete()) {
          onComplete?.(joined);
        }
        notify();
        break;
      }
      case 'BACKSPACE': {
        const { index } = event;
        if (index < 0 || index >= length) return;
        values[index] = '';
        focusIndex = Math.max(index - 1, 0);
        onChange?.(getJoinedValue());
        notify();
        break;
      }
      case 'PASTE': {
        const { value } = event;
        let idx = focusIndex;
        for (let i = 0; i < value.length && idx < length; i++) {
          const ch = value[i] ?? '';
          if (ch && isValidChar(ch)) {
            values[idx] = ch;
            idx++;
          }
        }
        focusIndex = Math.min(idx, length - 1);
        const joined = getJoinedValue();
        onChange?.(joined);
        if (getIsComplete()) {
          onComplete?.(joined);
        }
        notify();
        break;
      }
      case 'FOCUS_INDEX': {
        const clamped = Math.max(0, Math.min(event.index, length - 1));
        focusIndex = clamped;
        notify();
        break;
      }
      case 'CLEAR': {
        for (let i = 0; i < length; i++) {
          values[i] = '';
        }
        focusIndex = 0;
        onChange?.(getJoinedValue());
        notify();
        break;
      }
      case 'SET_VALUE': {
        const { value } = event;
        for (let i = 0; i < length; i++) {
          const ch = value[i];
          if (ch !== undefined && isValidChar(ch)) {
            values[i] = ch;
          } else {
            values[i] = '';
          }
        }
        const joined = getJoinedValue();
        onChange?.(joined);
        if (getIsComplete()) {
          onComplete?.(joined);
        }
        notify();
        break;
      }
    }
  }

  // ── API ──
  return {
    getContext,
    send,
    subscribe(callback: () => void): () => void {
      listeners.add(callback);
      return () => {
        listeners.delete(callback);
      };
    },
    destroy(): void {
      listeners.clear();
    },
  };
}
