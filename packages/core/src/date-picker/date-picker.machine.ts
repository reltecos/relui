/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DatePicker state machine — framework-agnostic headless date picker logic.
 * DatePicker state machine — framework bagimsiz headless tarih secici mantigi.
 *
 * Takvim navigasyonu, tarih secimi, min/max dogrulama, devre disi tarihler.
 * Calendar navigation, date selection, min/max validation, disabled dates.
 *
 * @packageDocumentation
 */

import type {
  DatePickerConfig,
  DatePickerContext,
  DatePickerEvent,
  DatePickerAPI,
} from './date-picker.types';

// ── Yardimci — ISO tarih ayristirma / ISO date parsing ──────────────

/**
 * ISO "YYYY-MM-DD" tarih string'inden yil, ay, gun cikarir.
 * Extracts year, month, day from ISO "YYYY-MM-DD" date string.
 */
function parseISO(dateStr: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1; // 0-indexed
  const day = Number(match[3]);
  // Basit gecerlilik kontrolu / Simple validity check
  if (month < 0 || month > 11 || day < 1 || day > 31) return null;
  return { year, month, day };
}

/**
 * Tarihin devre disi olup olmadigini kontrol eder.
 * Checks whether a date is disabled.
 *
 * @param dateStr - ISO "YYYY-MM-DD" formati / ISO "YYYY-MM-DD" format
 * @param minDate - Minimum tarih / Minimum date
 * @param maxDate - Maksimum tarih / Maximum date
 * @param disabledDates - Devre disi tarih fonksiyonu / Disabled dates function
 * @returns true ise tarih devre disi / true if date is disabled
 */
function isDateDisabled(
  dateStr: string,
  minDate: string | null,
  maxDate: string | null,
  disabledDates?: (date: string) => boolean,
): boolean {
  if (minDate && dateStr < minDate) return true;
  if (maxDate && dateStr > maxDate) return true;
  if (disabledDates && disabledDates(dateStr)) return true;
  return false;
}

// ── Factory ─────────────────────────────────────────────────────────

/**
 * DatePicker state machine olusturur.
 * Creates a DatePicker state machine.
 *
 * @example
 * ```ts
 * const picker = createDatePicker({
 *   defaultValue: '2025-06-15',
 *   minDate: '2025-01-01',
 *   maxDate: '2025-12-31',
 *   onChange: (value) => { },
 * });
 *
 * picker.send({ type: 'OPEN' });
 * picker.send({ type: 'SELECT_DATE', date: '2025-06-20' });
 * picker.getContext().value; // '2025-06-20'
 * ```
 */
export function createDatePicker(config: DatePickerConfig = {}): DatePickerAPI {
  const {
    defaultValue,
    onChange,
    onOpenChange,
    disabledDates,
  } = config;

  let minDate: string | null = config.minDate ?? null;
  let maxDate: string | null = config.maxDate ?? null;

  // ── Baslangic view date hesaplama / Initial view date calculation ──
  let initialViewYear: number;
  let initialViewMonth: number;
  let initialValue: string | null = null;

  if (defaultValue) {
    const parsed = parseISO(defaultValue);
    if (parsed) {
      initialViewYear = parsed.year;
      initialViewMonth = parsed.month;
      initialValue = defaultValue;
    } else {
      const now = new Date();
      initialViewYear = now.getFullYear();
      initialViewMonth = now.getMonth();
    }
  } else {
    const now = new Date();
    initialViewYear = now.getFullYear();
    initialViewMonth = now.getMonth();
  }

  const ctx: DatePickerContext = {
    value: initialValue,
    viewYear: initialViewYear,
    viewMonth: initialViewMonth,
    isOpen: false,
  };

  const listeners = new Set<() => void>();

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  function send(event: DatePickerEvent): void {
    switch (event.type) {
      // ── Acma/Kapama / Open/Close ──
      case 'OPEN': {
        if (ctx.isOpen) return;
        ctx.isOpen = true;
        onOpenChange?.(true);
        notify();
        break;
      }

      case 'CLOSE': {
        if (!ctx.isOpen) return;
        ctx.isOpen = false;
        onOpenChange?.(false);
        notify();
        break;
      }

      case 'TOGGLE': {
        ctx.isOpen = !ctx.isOpen;
        onOpenChange?.(ctx.isOpen);
        notify();
        break;
      }

      // ── Tarih secimi / Date selection ──
      case 'SELECT_DATE': {
        if (isDateDisabled(event.date, minDate, maxDate, disabledDates)) {
          return;
        }
        ctx.value = event.date;
        ctx.isOpen = false;
        onOpenChange?.(false);
        onChange?.(event.date);

        // View'i secilen tarihe senkronla / Sync view to selected date
        const parsed = parseISO(event.date);
        if (parsed) {
          ctx.viewYear = parsed.year;
          ctx.viewMonth = parsed.month;
        }
        notify();
        break;
      }

      // ── Ay navigasyonu / Month navigation ──
      case 'PREV_MONTH': {
        if (ctx.viewMonth === 0) {
          ctx.viewMonth = 11;
          ctx.viewYear -= 1;
        } else {
          ctx.viewMonth -= 1;
        }
        notify();
        break;
      }

      case 'NEXT_MONTH': {
        if (ctx.viewMonth === 11) {
          ctx.viewMonth = 0;
          ctx.viewYear += 1;
        } else {
          ctx.viewMonth += 1;
        }
        notify();
        break;
      }

      // ── Dogrudan ay/yil ayarlama / Direct month/year setting ──
      case 'SET_MONTH': {
        const month = Math.max(0, Math.min(11, event.month));
        if (ctx.viewMonth === month) return;
        ctx.viewMonth = month;
        notify();
        break;
      }

      case 'SET_YEAR': {
        if (ctx.viewYear === event.year) return;
        ctx.viewYear = event.year;
        notify();
        break;
      }

      // ── View tarihini ayarla / Set view date ──
      case 'SET_VIEW_DATE': {
        const parsed = parseISO(event.date);
        if (!parsed) return;
        const changed = ctx.viewYear !== parsed.year || ctx.viewMonth !== parsed.month;
        if (!changed) return;
        ctx.viewYear = parsed.year;
        ctx.viewMonth = parsed.month;
        notify();
        break;
      }

      // ── Degeri disaridan ayarla / Set value externally ──
      case 'SET_VALUE': {
        if (ctx.value === event.value) return;
        ctx.value = event.value;
        if (event.value) {
          const parsed = parseISO(event.value);
          if (parsed) {
            ctx.viewYear = parsed.year;
            ctx.viewMonth = parsed.month;
          }
        }
        notify();
        break;
      }

      // ── Min/Max sinir guncelleme / Min/Max bounds update ──
      case 'SET_MIN': {
        if (minDate === event.date) return;
        minDate = event.date;
        notify();
        break;
      }

      case 'SET_MAX': {
        if (maxDate === event.date) return;
        maxDate = event.date;
        notify();
        break;
      }
    }
  }

  return {
    getContext(): DatePickerContext {
      return ctx;
    },

    send,

    subscribe(fn: () => void): () => void {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },

    destroy(): void {
      listeners.clear();
    },
  };
}
