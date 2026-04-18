/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * TimeSpan state machine.
 *
 * @packageDocumentation
 */

import type { TimeSpanConfig, TimeSpanContext, TimeSpanEvent, TimeSpanAPI, TimeSpanField } from './time-span.types';

export function createTimeSpan(config: TimeSpanConfig = {}): TimeSpanAPI {
  const {
    defaultHours = 0,
    defaultMinutes = 0,
    defaultSeconds = 0,
    min = 0,
    max = 359999, // 99:59:59
    onChange,
  } = config;

  let hours = defaultHours;
  let minutes = defaultMinutes;
  let seconds = defaultSeconds;

  const listeners = new Set<() => void>();
  function notify(): void {
    onChange?.(hours * 3600 + minutes * 60 + seconds);
    for (const fn of listeners) fn();
  }

  function clampTotal(): void {
    let total = hours * 3600 + minutes * 60 + seconds;
    if (total < min) total = min;
    if (total > max) total = max;
    hours = Math.floor(total / 3600);
    minutes = Math.floor((total % 3600) / 60);
    seconds = total % 60;
  }

  function getContext(): TimeSpanContext {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    return { hours, minutes, seconds, totalSeconds, totalMs: totalSeconds * 1000 };
  }

  function setField(field: TimeSpanField, value: number): void {
    const clamped = Math.max(0, Math.floor(value));
    switch (field) {
      case 'hours': hours = clamped; break;
      case 'minutes': minutes = Math.min(59, clamped); break;
      case 'seconds': seconds = Math.min(59, clamped); break;
    }
    clampTotal();
  }

  function send(event: TimeSpanEvent): void {
    switch (event.type) {
      case 'SET_FIELD':
        setField(event.field, event.value);
        notify();
        break;
      case 'INCREMENT': {
        const step = event.step ?? 1;
        switch (event.field) {
          case 'hours': hours += step; break;
          case 'minutes': minutes += step; break;
          case 'seconds': seconds += step; break;
        }
        // Normalize overflow
        if (seconds >= 60) { minutes += Math.floor(seconds / 60); seconds = seconds % 60; }
        if (minutes >= 60) { hours += Math.floor(minutes / 60); minutes = minutes % 60; }
        clampTotal();
        notify();
        break;
      }
      case 'DECREMENT': {
        const step = event.step ?? 1;
        const total = Math.max(min, hours * 3600 + minutes * 60 + seconds - (
          event.field === 'hours' ? step * 3600 :
          event.field === 'minutes' ? step * 60 : step
        ));
        hours = Math.floor(total / 3600);
        minutes = Math.floor((total % 3600) / 60);
        seconds = total % 60;
        notify();
        break;
      }
      case 'SET_TOTAL_SECONDS': {
        const total = Math.max(min, Math.min(max, Math.floor(event.totalSeconds)));
        hours = Math.floor(total / 3600);
        minutes = Math.floor((total % 3600) / 60);
        seconds = total % 60;
        notify();
        break;
      }
      case 'RESET':
        hours = defaultHours;
        minutes = defaultMinutes;
        seconds = defaultSeconds;
        notify();
        break;
    }
  }

  function subscribe(callback: () => void): () => void {
    listeners.add(callback);
    return () => { listeners.delete(callback); };
  }

  function destroy(): void { listeners.clear(); }

  clampTotal();
  return { getContext, send, subscribe, destroy };
}
