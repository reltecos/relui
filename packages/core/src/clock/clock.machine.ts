/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Clock state machine.
 *
 * @packageDocumentation
 */

import type {
  ClockConfig,
  ClockContext,
  ClockEvent,
  ClockAPI,
} from './clock.types';

/**
 * Saat dilimindeki zamani dondurur.
 * Returns the current time in the given timezone.
 */
function getTimeInTimezone(timezone: string): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  }).formatToParts(now);

  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  for (const part of parts) {
    if (part.type === 'hour') hours = parseInt(part.value, 10);
    if (part.type === 'minute') minutes = parseInt(part.value, 10);
    if (part.type === 'second') seconds = parseInt(part.value, 10);
  }

  // Intl may return 24 for midnight
  if (hours === 24) hours = 0;

  return { hours, minutes, seconds };
}

/**
 * Context olusturur.
 * Creates context from current time.
 */
function buildContext(is24h: boolean, timezone: string): ClockContext {
  const { hours, minutes, seconds } = getTimeInTimezone(timezone);
  const period: 'AM' | 'PM' = hours >= 12 ? 'PM' : 'AM';
  const displayHours = is24h ? hours : (hours % 12 || 12);

  return {
    hours: displayHours,
    minutes,
    seconds,
    period,
    is24h,
    timezone,
    rawHours: hours,
  };
}

/**
 * Clock state machine olusturur.
 * Creates a clock state machine.
 */
export function createClock(config: ClockConfig = {}): ClockAPI {
  let is24h = config.is24h ?? false;
  let timezone = config.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  let ctx = buildContext(is24h, timezone);

  const listeners = new Set<() => void>();

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  function updateTime(): void {
    ctx = buildContext(is24h, timezone);
    config.onTick?.(ctx);
    notify();
  }

  function send(event: ClockEvent): void {
    switch (event.type) {
      case 'TICK': {
        updateTime();
        break;
      }
      case 'SET_TIMEZONE': {
        if (event.timezone === timezone) return;
        timezone = event.timezone;
        updateTime();
        break;
      }
      case 'SET_FORMAT': {
        if (event.is24h === is24h) return;
        is24h = event.is24h;
        updateTime();
        break;
      }
    }
  }

  return {
    getContext(): ClockContext {
      return ctx;
    },
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
