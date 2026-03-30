/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DatePicker bilesen tip tanimlari.
 * DatePicker component type definitions.
 *
 * @packageDocumentation
 */

// ── Events ──────────────────────────────────────────────────────────

/**
 * DatePicker state machine event tipleri.
 * DatePicker state machine event types.
 */
export type DatePickerEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'SELECT_DATE'; date: string }
  | { type: 'PREV_MONTH' }
  | { type: 'NEXT_MONTH' }
  | { type: 'SET_MONTH'; month: number }
  | { type: 'SET_YEAR'; year: number }
  | { type: 'SET_VIEW_DATE'; date: string }
  | { type: 'SET_VALUE'; value: string | null }
  | { type: 'SET_MIN'; date: string | null }
  | { type: 'SET_MAX'; date: string | null };

// ── Context ─────────────────────────────────────────────────────────

/**
 * DatePicker state machine context'i.
 * DatePicker state machine context.
 */
export interface DatePickerContext {
  /**
   * Secili tarih degeri (ISO "YYYY-MM-DD" formati, null ise secim yok).
   * Selected date value (ISO "YYYY-MM-DD" format, null means no selection).
   */
  value: string | null;

  /**
   * Gorunen takvim yili.
   * Displayed calendar year.
   */
  viewYear: number;

  /**
   * Gorunen takvim ayi (0-11, 0=Ocak/January).
   * Displayed calendar month (0-11, 0=January).
   */
  viewMonth: number;

  /**
   * Takvim popup'i acik mi.
   * Is the calendar popup open.
   */
  isOpen: boolean;
}

// ── Config ──────────────────────────────────────────────────────────

/**
 * DatePicker yapilandirma secenekleri.
 * DatePicker configuration options.
 */
export interface DatePickerConfig {
  /**
   * Varsayilan tarih degeri (ISO "YYYY-MM-DD").
   * Default date value (ISO "YYYY-MM-DD").
   */
  defaultValue?: string;

  /**
   * Minimum secilecek tarih (ISO "YYYY-MM-DD").
   * Minimum selectable date (ISO "YYYY-MM-DD").
   */
  minDate?: string;

  /**
   * Maksimum secilecek tarih (ISO "YYYY-MM-DD").
   * Maximum selectable date (ISO "YYYY-MM-DD").
   */
  maxDate?: string;

  /**
   * Devre disi tarihleri belirleyen fonksiyon.
   * Function that determines disabled dates.
   *
   * @param date - ISO "YYYY-MM-DD" formati / ISO "YYYY-MM-DD" format
   * @returns true ise tarih devre disi / true if date is disabled
   */
  disabledDates?: (date: string) => boolean;

  /**
   * Haftanin ilk gunu (0=Pazar, 1=Pazartesi).
   * First day of the week (0=Sunday, 1=Monday).
   */
  firstDayOfWeek?: 0 | 1;

  /**
   * Deger degisince cagrilir.
   * Called when the value changes.
   *
   * @param value - Yeni tarih degeri / New date value
   */
  onChange?: (value: string) => void;

  /**
   * Popup acilma/kapanma durumu degisince cagrilir.
   * Called when the popup open state changes.
   *
   * @param isOpen - Acik mi / Is open
   */
  onOpenChange?: (isOpen: boolean) => void;
}

// ── API ─────────────────────────────────────────────────────────────

/**
 * DatePicker public API'si.
 * DatePicker public API.
 */
export interface DatePickerAPI {
  /**
   * Mevcut context'i dondurur.
   * Returns the current context.
   */
  getContext(): DatePickerContext;

  /**
   * State machine'e event gonderir.
   * Sends an event to the state machine.
   *
   * @param event - Gonderilecek event / Event to send
   */
  send(event: DatePickerEvent): void;

  /**
   * Durum degisikliklerini dinler.
   * Subscribes to state changes.
   *
   * @param fn - Dinleyici fonksiyon / Listener function
   * @returns Aboneligi iptal eden fonksiyon / Unsubscribe function
   */
  subscribe(fn: () => void): () => void;

  /**
   * State machine'i temizler, tum dinleyicileri kaldirir.
   * Cleans up the state machine, removes all listeners.
   */
  destroy(): void;
}
