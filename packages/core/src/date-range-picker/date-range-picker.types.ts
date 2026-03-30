/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DateRangePicker tipleri.
 * DateRangePicker types.
 *
 * @packageDocumentation
 */

// ── Preset ──────────────────────────────────────────

/** Tarih araligi on tanimi / Date range preset definition */
export interface DateRangePreset {
  /** Gosterim etiketi / Display label */
  label: string;
  /** Baslangic tarihi (ISO) / Start date (ISO) */
  startDate: string;
  /** Bitis tarihi (ISO) / End date (ISO) */
  endDate: string;
}

// ── Events ───────────────────────────────────────────

/** DateRangePicker event'leri / DateRangePicker events */
export type DateRangePickerEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'SELECT_DATE'; date: string }
  | { type: 'PREV_MONTH' }
  | { type: 'NEXT_MONTH' }
  | { type: 'SET_MONTH'; month: number }
  | { type: 'SET_YEAR'; year: number }
  | { type: 'SET_PRESET'; preset: DateRangePreset }
  | { type: 'SET_VALUE'; startDate: string | null; endDate: string | null }
  | { type: 'CLEAR' };

// ── Context ──────────────────────────────────────────

/** Secim alani / Which field is being selected */
export type SelectingField = 'start' | 'end';

/** DateRangePicker state / DateRangePicker context */
export interface DateRangePickerContext {
  /** Baslangic tarihi (ISO) / Start date (ISO) */
  readonly startDate: string | null;
  /** Bitis tarihi (ISO) / End date (ISO) */
  readonly endDate: string | null;
  /** Gorunum yili / View year */
  readonly viewYear: number;
  /** Gorunum ayi (0-11) / View month (0-11) */
  readonly viewMonth: number;
  /** Acik mi / Is open */
  readonly isOpen: boolean;
  /** Hangi alan seciliyor / Which field is being selected */
  readonly selectingField: SelectingField;
}

// ── Config ───────────────────────────────────────────

/** DateRangePicker yapilandirmasi / DateRangePicker configuration */
export interface DateRangePickerConfig {
  /** Varsayilan baslangic / Default start date */
  defaultStartDate?: string;
  /** Varsayilan bitis / Default end date */
  defaultEndDate?: string;
  /** On tanimli araliklar / Preset ranges */
  presets?: DateRangePreset[];
  /** Minimum tarih / Minimum date */
  minDate?: string;
  /** Maksimum tarih / Maximum date */
  maxDate?: string;
  /** Devre disi tarihler / Disabled dates */
  disabledDates?: (date: string) => boolean;
  /** Haftanin ilk gunu (0=Paz, 1=Pzt) / First day of week */
  firstDayOfWeek?: number;
  /** Degisim callback / Change callback */
  onChange?: (startDate: string | null, endDate: string | null) => void;
  /** Acilma callback / Open change callback */
  onOpenChange?: (isOpen: boolean) => void;
}

// ── API ──────────────────────────────────────────────

/** DateRangePicker API / DateRangePicker API */
export interface DateRangePickerAPI {
  /** Guncel context / Get current context */
  getContext(): DateRangePickerContext;
  /** Event gonder / Send event */
  send(event: DateRangePickerEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
  /** Temizlik / Cleanup */
  destroy(): void;
}
