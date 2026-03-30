/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * TimePicker type definitions — framework-agnostic.
 * TimePicker tip tanimlari — framework bagimsiz.
 *
 * Saat secici — 12h/24h, dakika step, min/max sinir.
 * Time picker — 12h/24h, minute step, min/max range.
 *
 * @packageDocumentation
 */

// ── Events ──────────────────────────────────────────────────────────

/**
 * TimePicker state machine event'leri.
 * TimePicker state machine events.
 */
export type TimePickerEvent =
  | { type: 'SET_HOUR'; hour: number }
  | { type: 'SET_MINUTE'; minute: number }
  | { type: 'SET_SECOND'; second: number }
  | { type: 'SET_PERIOD'; period: 'AM' | 'PM' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'INCREMENT_HOUR' }
  | { type: 'DECREMENT_HOUR' }
  | { type: 'INCREMENT_MINUTE' }
  | { type: 'DECREMENT_MINUTE' }
  | { type: 'SET_VALUE'; value: string | null };

// ── Context ─────────────────────────────────────────────────────────

/**
 * TimePicker state machine context'i.
 * TimePicker state machine context.
 */
export interface TimePickerContext {
  /** Goruntulenen saat (12h: 1-12, 24h: 0-23) / Displayed hours */
  hours: number;

  /** Dakika (0-59) / Minutes (0-59) */
  minutes: number;

  /** Saniye (0-59) / Seconds (0-59) */
  seconds: number;

  /** AM/PM gostergesi / AM/PM indicator */
  period: 'AM' | 'PM';

  /** 24 saat formati mi / Is 24-hour format */
  is24h: boolean;

  /** Dropdown acik mi / Is dropdown open */
  isOpen: boolean;

  /** Formatlanmis deger ("HH:mm" veya "HH:mm:ss") / Formatted value */
  value: string | null;
}

// ── Config ──────────────────────────────────────────────────────────

/**
 * TimePicker yapilandirmasi.
 * TimePicker configuration.
 */
export interface TimePickerConfig {
  /** Varsayilan deger ("HH:mm" veya "HH:mm:ss") / Default value */
  defaultValue?: string;

  /** 24 saat formati (varsayilan: false) / 24-hour format (default: false) */
  is24h?: boolean;

  /** Saniye gosterilsin mi (varsayilan: false) / Show seconds (default: false) */
  showSeconds?: boolean;

  /** Dakika adimi (varsayilan: 1) / Minute step (default: 1) */
  step?: number;

  /** Minimum zaman ("HH:mm" veya "HH:mm:ss") / Minimum time */
  minTime?: string;

  /** Maksimum zaman ("HH:mm" veya "HH:mm:ss") / Maximum time */
  maxTime?: string;

  /** Deger degistiginde / When value changes */
  onChange?: (value: string | null) => void;

  /** Dropdown acilip kapandiginda / When dropdown opens/closes */
  onOpenChange?: (isOpen: boolean) => void;
}

// ── API ─────────────────────────────────────────────────────────────

/**
 * TimePicker API — state machine, subscribe ve destroy.
 * TimePicker API — state machine, subscribe and destroy.
 */
export interface TimePickerAPI {
  /** Mevcut context / Current context */
  getContext(): TimePickerContext;

  /** Event gonder / Send event */
  send(event: TimePickerEvent): void;

  /** Degisiklik dinle, unsubscribe fonksiyonu doner / Subscribe to changes */
  subscribe(callback: () => void): () => void;

  /** Temizle / Cleanup */
  destroy(): void;
}
