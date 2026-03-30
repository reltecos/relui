/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * TimePicker state machine — framework-agnostic headless time picker logic.
 * TimePicker state machine — framework bagimsiz headless saat secici mantigi.
 *
 * 12h/24h format, dakika step, min/max sinir, AM/PM donusumu.
 * 12h/24h format, minute step, min/max range, AM/PM conversion.
 *
 * @packageDocumentation
 */

import type {
  TimePickerConfig,
  TimePickerContext,
  TimePickerEvent,
  TimePickerAPI,
} from './time-picker.types';

// ── Helpers ─────────────────────────────────────────────────────────

/**
 * Zaman stringini parse eder ("HH:mm" veya "HH:mm:ss").
 * Parses a time string ("HH:mm" or "HH:mm:ss").
 */
export function parseTime(str: string): { hours: number; minutes: number; seconds: number } | null {
  const parts = str.split(':');
  if (parts.length < 2 || parts.length > 3) return null;

  const hours = parseInt(parts[0] ?? '0', 10);
  const minutes = parseInt(parts[1] ?? '0', 10);
  const seconds = parts.length === 3 ? parseInt(parts[2] ?? '0', 10) : 0;

  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return null;
  if (hours < 0 || hours > 23) return null;
  if (minutes < 0 || minutes > 59) return null;
  if (seconds < 0 || seconds > 59) return null;

  return { hours, minutes, seconds };
}

/**
 * Saati iki basamakli string yapar.
 * Pads a number to two digits.
 */
function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

/**
 * Deger stringi olusturur ("HH:mm" veya "HH:mm:ss").
 * Creates a value string ("HH:mm" or "HH:mm:ss").
 */
export function formatValue(hours: number, minutes: number, seconds: number, showSeconds: boolean): string {
  const base = `${pad(hours)}:${pad(minutes)}`;
  return showSeconds ? `${base}:${pad(seconds)}` : base;
}

/**
 * Dakikayi step'e snap eder.
 * Snaps minutes to the nearest step.
 */
function snapToStep(minutes: number, step: number): number {
  if (step <= 1) return minutes;
  return Math.round(minutes / step) * step;
}

/**
 * Zamanin min/max araliginda olup olmadigini kontrol eder.
 * Checks if time is within min/max range.
 */
export function isTimeInRange(
  hours: number,
  minutes: number,
  seconds: number,
  minTime: string | undefined,
  maxTime: string | undefined,
): boolean {
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  if (minTime) {
    const min = parseTime(minTime);
    if (min) {
      const minTotal = min.hours * 3600 + min.minutes * 60 + min.seconds;
      if (totalSeconds < minTotal) return false;
    }
  }

  if (maxTime) {
    const max = parseTime(maxTime);
    if (max) {
      const maxTotal = max.hours * 3600 + max.minutes * 60 + max.seconds;
      if (totalSeconds > maxTotal) return false;
    }
  }

  return true;
}

/**
 * 12h formatta goruntulenen saati hesaplar.
 * Calculates display hours for 12h format.
 */
function toDisplayHours(internalHours: number, is24h: boolean): number {
  if (is24h) return internalHours;
  return internalHours % 12 || 12;
}

/**
 * AM/PM period belirler.
 * Determines AM/PM period.
 */
function toPeriod(internalHours: number): 'AM' | 'PM' {
  return internalHours >= 12 ? 'PM' : 'AM';
}

// ── Context builder ─────────────────────────────────────────────────

function buildContext(
  internalHours: number,
  minutes: number,
  seconds: number,
  is24h: boolean,
  isOpen: boolean,
  showSeconds: boolean,
  hasValue: boolean,
): TimePickerContext {
  return {
    hours: toDisplayHours(internalHours, is24h),
    minutes,
    seconds,
    period: toPeriod(internalHours),
    is24h,
    isOpen,
    value: hasValue ? formatValue(internalHours, minutes, seconds, showSeconds) : null,
  };
}

// ── Factory ─────────────────────────────────────────────────────────

/**
 * TimePicker state machine olusturur.
 * Creates a TimePicker state machine.
 *
 * @example
 * ```ts
 * const tp = createTimePicker({ defaultValue: '14:30', is24h: true });
 * tp.getContext().hours; // 14
 * tp.send({ type: 'SET_HOUR', hour: 9 });
 * tp.getContext().value; // "09:30"
 * ```
 */
export function createTimePicker(config: TimePickerConfig = {}): TimePickerAPI {
  const is24h = config.is24h ?? false;
  const showSeconds = config.showSeconds ?? false;
  const step = config.step ?? 1;
  const minTime = config.minTime;
  const maxTime = config.maxTime;

  // Parse default value
  let internalHours = 0;
  let internalMinutes = 0;
  let internalSeconds = 0;

  if (config.defaultValue) {
    const parsed = parseTime(config.defaultValue);
    if (parsed) {
      internalHours = parsed.hours;
      internalMinutes = snapToStep(parsed.minutes, step);
      internalSeconds = parsed.seconds;
    }
  }

  let isOpen = false;
  let hasValue = config.defaultValue !== undefined;
  let ctx = buildContext(internalHours, internalMinutes, internalSeconds, is24h, isOpen, showSeconds, hasValue);

  const listeners = new Set<() => void>();

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  function rebuildAndNotify(prevValue: string | null): void {
    hasValue = true;
    ctx = buildContext(internalHours, internalMinutes, internalSeconds, is24h, isOpen, showSeconds, hasValue);
    if (ctx.value !== prevValue) {
      config.onChange?.(ctx.value);
    }
    notify();
  }

  function clampHour(h: number): number {
    return ((h % 24) + 24) % 24;
  }

  function clampMinute(m: number): number {
    return ((m % 60) + 60) % 60;
  }

  function send(event: TimePickerEvent): void {
    const prevValue = ctx.value;

    switch (event.type) {
      case 'SET_HOUR': {
        const clamped = Math.max(0, Math.min(23, event.hour));
        if (!isTimeInRange(clamped, internalMinutes, internalSeconds, minTime, maxTime)) return;
        if (clamped === internalHours) return;
        internalHours = clamped;
        rebuildAndNotify(prevValue);
        break;
      }

      case 'SET_MINUTE': {
        const snapped = snapToStep(Math.max(0, Math.min(59, event.minute)), step);
        if (!isTimeInRange(internalHours, snapped, internalSeconds, minTime, maxTime)) return;
        if (snapped === internalMinutes) return;
        internalMinutes = snapped;
        rebuildAndNotify(prevValue);
        break;
      }

      case 'SET_SECOND': {
        const clamped = Math.max(0, Math.min(59, event.second));
        if (!isTimeInRange(internalHours, internalMinutes, clamped, minTime, maxTime)) return;
        if (clamped === internalSeconds) return;
        internalSeconds = clamped;
        rebuildAndNotify(prevValue);
        break;
      }

      case 'SET_PERIOD': {
        const currentPeriod = toPeriod(internalHours);
        if (event.period === currentPeriod) return;

        let newHours: number;
        if (event.period === 'AM') {
          // PM -> AM: subtract 12
          newHours = internalHours >= 12 ? internalHours - 12 : internalHours;
        } else {
          // AM -> PM: add 12
          newHours = internalHours < 12 ? internalHours + 12 : internalHours;
        }

        if (!isTimeInRange(newHours, internalMinutes, internalSeconds, minTime, maxTime)) return;
        internalHours = newHours;
        rebuildAndNotify(prevValue);
        break;
      }

      case 'INCREMENT_HOUR': {
        const next = clampHour(internalHours + 1);
        if (!isTimeInRange(next, internalMinutes, internalSeconds, minTime, maxTime)) return;
        internalHours = next;
        rebuildAndNotify(prevValue);
        break;
      }

      case 'DECREMENT_HOUR': {
        const next = clampHour(internalHours - 1);
        if (!isTimeInRange(next, internalMinutes, internalSeconds, minTime, maxTime)) return;
        internalHours = next;
        rebuildAndNotify(prevValue);
        break;
      }

      case 'INCREMENT_MINUTE': {
        const next = clampMinute(internalMinutes + step);
        if (!isTimeInRange(internalHours, next, internalSeconds, minTime, maxTime)) return;
        internalMinutes = next;
        rebuildAndNotify(prevValue);
        break;
      }

      case 'DECREMENT_MINUTE': {
        const next = clampMinute(internalMinutes - step);
        if (!isTimeInRange(internalHours, next, internalSeconds, minTime, maxTime)) return;
        internalMinutes = next;
        rebuildAndNotify(prevValue);
        break;
      }

      case 'OPEN': {
        if (isOpen) return;
        isOpen = true;
        ctx = buildContext(internalHours, internalMinutes, internalSeconds, is24h, isOpen, showSeconds, hasValue);
        config.onOpenChange?.(true);
        notify();
        break;
      }

      case 'CLOSE': {
        if (!isOpen) return;
        isOpen = false;
        ctx = buildContext(internalHours, internalMinutes, internalSeconds, is24h, isOpen, showSeconds, hasValue);
        config.onOpenChange?.(false);
        notify();
        break;
      }

      case 'TOGGLE': {
        isOpen = !isOpen;
        ctx = buildContext(internalHours, internalMinutes, internalSeconds, is24h, isOpen, showSeconds, hasValue);
        config.onOpenChange?.(isOpen);
        notify();
        break;
      }

      case 'SET_VALUE': {
        if (event.value === null) {
          internalHours = 0;
          internalMinutes = 0;
          internalSeconds = 0;
          hasValue = false;
          ctx = buildContext(internalHours, internalMinutes, internalSeconds, is24h, isOpen, showSeconds, hasValue);
          config.onChange?.(null);
          notify();
          return;
        }

        const parsed = parseTime(event.value);
        if (!parsed) return;

        const snappedMinutes = snapToStep(parsed.minutes, step);
        if (!isTimeInRange(parsed.hours, snappedMinutes, parsed.seconds, minTime, maxTime)) return;

        internalHours = parsed.hours;
        internalMinutes = snappedMinutes;
        internalSeconds = parsed.seconds;
        rebuildAndNotify(prevValue);
        break;
      }
    }
  }

  return {
    getContext(): TimePickerContext {
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
