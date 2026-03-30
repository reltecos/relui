/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DateRangePicker state machine.
 *
 * @packageDocumentation
 */

import type {
  DateRangePickerConfig,
  DateRangePickerContext,
  DateRangePickerEvent,
  DateRangePickerAPI,
  SelectingField,
} from './date-range-picker.types';

/**
 * Tarih ISO formatinda mi kontrol eder.
 * Checks if date is in ISO format.
 */
function isValidDate(dateStr: string): boolean {
  const d = new Date(dateStr + 'T00:00:00');
  return !isNaN(d.getTime());
}

/**
 * ISO tarih stringinden yil/ay cikarir.
 * Extracts year/month from ISO date string.
 */
function parseDate(dateStr: string): { year: number; month: number } {
  const d = new Date(dateStr + 'T00:00:00');
  return { year: d.getFullYear(), month: d.getMonth() };
}

/**
 * DateRangePicker state machine olusturur.
 * Creates a DateRangePicker state machine.
 */
export function createDateRangePicker(config: DateRangePickerConfig = {}): DateRangePickerAPI {
  const {
    defaultStartDate = null,
    defaultEndDate = null,
    minDate,
    maxDate,
    disabledDates,
    onChange,
    onOpenChange,
  } = config;

  // ── State ──
  let startDate: string | null = defaultStartDate && isValidDate(defaultStartDate) ? defaultStartDate : null;
  let endDate: string | null = defaultEndDate && isValidDate(defaultEndDate) ? defaultEndDate : null;
  let isOpen = false;
  let selectingField: SelectingField = 'start';

  const now = new Date();
  let viewYear: number;
  let viewMonth: number;

  if (startDate) {
    const parsed = parseDate(startDate);
    viewYear = parsed.year;
    viewMonth = parsed.month;
  } else {
    viewYear = now.getFullYear();
    viewMonth = now.getMonth();
  }

  // ── Subscribers ──
  const listeners = new Set<() => void>();

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  // ── Helpers ──
  function isDateDisabled(dateStr: string): boolean {
    if (!isValidDate(dateStr)) return true;
    if (minDate && dateStr < minDate) return true;
    if (maxDate && dateStr > maxDate) return true;
    if (disabledDates && disabledDates(dateStr)) return true;
    return false;
  }

  function ensureOrder(start: string, end: string): { s: string; e: string } {
    return start <= end ? { s: start, e: end } : { s: end, e: start };
  }

  // ── Send ──
  function send(event: DateRangePickerEvent): void {
    switch (event.type) {
      case 'OPEN': {
        if (isOpen) return;
        isOpen = true;
        onOpenChange?.(true);
        notify();
        break;
      }
      case 'CLOSE': {
        if (!isOpen) return;
        isOpen = false;
        onOpenChange?.(false);
        notify();
        break;
      }
      case 'TOGGLE': {
        isOpen = !isOpen;
        onOpenChange?.(isOpen);
        notify();
        break;
      }
      case 'SELECT_DATE': {
        if (isDateDisabled(event.date)) return;

        if (selectingField === 'start') {
          startDate = event.date;
          endDate = null;
          selectingField = 'end';
        } else {
          if (startDate && event.date < startDate) {
            startDate = event.date;
            endDate = null;
            selectingField = 'end';
          } else {
            endDate = event.date;
            selectingField = 'start';
            if (startDate && endDate) {
              const ordered = ensureOrder(startDate, endDate);
              startDate = ordered.s;
              endDate = ordered.e;
              onChange?.(startDate, endDate);
              isOpen = false;
              onOpenChange?.(false);
            }
          }
        }
        notify();
        break;
      }
      case 'PREV_MONTH': {
        viewMonth -= 1;
        if (viewMonth < 0) {
          viewMonth = 11;
          viewYear -= 1;
        }
        notify();
        break;
      }
      case 'NEXT_MONTH': {
        viewMonth += 1;
        if (viewMonth > 11) {
          viewMonth = 0;
          viewYear += 1;
        }
        notify();
        break;
      }
      case 'SET_MONTH': {
        if (event.month === viewMonth) return;
        viewMonth = Math.max(0, Math.min(11, event.month));
        notify();
        break;
      }
      case 'SET_YEAR': {
        if (event.year === viewYear) return;
        viewYear = event.year;
        notify();
        break;
      }
      case 'SET_PRESET': {
        const { startDate: ps, endDate: pe } = event.preset;
        if (!isValidDate(ps) || !isValidDate(pe)) return;
        startDate = ps;
        endDate = pe;
        selectingField = 'start';
        const parsed = parseDate(ps);
        viewYear = parsed.year;
        viewMonth = parsed.month;
        onChange?.(startDate, endDate);
        isOpen = false;
        onOpenChange?.(false);
        notify();
        break;
      }
      case 'SET_VALUE': {
        startDate = event.startDate;
        endDate = event.endDate;
        if (startDate) {
          const parsed = parseDate(startDate);
          viewYear = parsed.year;
          viewMonth = parsed.month;
        }
        selectingField = 'start';
        notify();
        break;
      }
      case 'CLEAR': {
        startDate = null;
        endDate = null;
        selectingField = 'start';
        onChange?.(null, null);
        notify();
        break;
      }
    }
  }

  // ── API ──
  return {
    getContext(): DateRangePickerContext {
      return {
        startDate,
        endDate,
        viewYear,
        viewMonth,
        isOpen,
        selectingField,
      };
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
