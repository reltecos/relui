/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * CurrencyInput type definitions — framework-agnostic.
 * CurrencyInput tip tanımları — framework bağımsız.
 *
 * @packageDocumentation
 */

/**
 * CurrencyInput görsel varyantı / CurrencyInput visual variant.
 */
export type CurrencyInputVariant = 'outline' | 'filled' | 'flushed';

/**
 * CurrencyInput boyutu / CurrencyInput size.
 */
export type CurrencyInputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * CurrencyInput etkileşim durumu / CurrencyInput interaction state.
 */
export type CurrencyInputInteractionState = 'idle' | 'hover' | 'focused';

/**
 * Para birimi gösterim modu / Currency display mode.
 *
 * - `symbol` — ₺, $, €
 * - `code` — TRY, USD, EUR
 * - `name` — Türk lirası, US Dollar, Euro
 * - `none` — sembol gösterme
 */
export type CurrencyDisplay = 'symbol' | 'code' | 'name' | 'none';

/**
 * Locale bilgisi — binlik ve ondalık ayracı belirler.
 * Locale info — determines thousands and decimal separator.
 */
export interface CurrencyLocaleInfo {
  /** Binlik ayracı / Thousands separator — ör. '.' (TR), ',' (EN) */
  groupSeparator: string;

  /** Ondalık ayracı / Decimal separator — ör. ',' (TR), '.' (EN) */
  decimalSeparator: string;

  /** Para birimi sembolü / Currency symbol — ör. '₺', '$' */
  currencySymbol: string;

  /** Para birimi sembol konumu / Currency symbol position */
  symbolPosition: 'prefix' | 'suffix';
}

/**
 * Core currency input props — framework-agnostic yapılandırma.
 * Core currency input props — framework-agnostic configuration.
 */
export interface CurrencyInputProps {
  /** Görsel varyant / Visual variant */
  variant?: CurrencyInputVariant;

  /** Boyut / Size */
  size?: CurrencyInputSize;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

  /** Salt okunur durumu / Read-only state */
  readOnly?: boolean;

  /** Geçersiz durumu / Invalid state */
  invalid?: boolean;

  /** Zorunlu alan / Required field */
  required?: boolean;

  /** Başlangıç değeri / Initial value (ham sayısal değer / raw numeric value) */
  value?: number | null;

  /** Minimum değer / Minimum value */
  min?: number;

  /** Maksimum değer / Maximum value */
  max?: number;

  /**
   * Ondalık basamak hassasiyeti / Decimal precision.
   *
   * @default 2
   */
  precision?: number;

  /**
   * Negatif değere izin ver / Allow negative values.
   *
   * @default false
   */
  allowNegative?: boolean;

  /**
   * Kullanıcının boş bırakmasına izin ver.
   * Allow user to leave the input empty.
   *
   * @default true
   */
  allowEmpty?: boolean;

  /**
   * Focus kaybedince min/max sınırına clamp et.
   * Clamp to min/max boundary on blur.
   *
   * @default true
   */
  clampOnBlur?: boolean;

  /**
   * Locale kodu / Locale code.
   * Intl.NumberFormat ile binlik/ondalık ayracı ve sembol belirlenir.
   *
   * @default 'tr-TR'
   */
  locale?: string;

  /**
   * ISO 4217 para birimi kodu / ISO 4217 currency code.
   *
   * @default 'TRY'
   */
  currency?: string;

  /**
   * Para birimi gösterim modu / Currency display mode.
   *
   * @default 'symbol'
   */
  currencyDisplay?: CurrencyDisplay;
}

/**
 * CurrencyInput machine context — iç durum.
 * CurrencyInput machine context — internal state.
 */
export interface CurrencyInputMachineContext {
  /** Mevcut etkileşim durumu / Current interaction state */
  interactionState: CurrencyInputInteractionState;

  /** Ham değer / Raw numeric value */
  value: number | null;

  /** Minimum değer / Minimum value */
  min: number;

  /** Maksimum değer / Maximum value */
  max: number;

  /** Ondalık hassasiyet / Decimal precision */
  precision: number;

  /** Negatife izin / Allow negative */
  allowNegative: boolean;

  /** Boş değere izin / Allow empty */
  allowEmpty: boolean;

  /** Focus kaybedince clamp / Clamp on blur */
  clampOnBlur: boolean;

  /** Locale kodu / Locale code */
  locale: string;

  /** Para birimi kodu / Currency code */
  currency: string;

  /** Para birimi gösterim modu / Currency display mode */
  currencyDisplay: CurrencyDisplay;

  /** Locale bilgisi (cache) / Locale info (cached) */
  localeInfo: CurrencyLocaleInfo;

  /** Pasif mi / Is disabled */
  disabled: boolean;

  /** Salt okunur mu / Is read-only */
  readOnly: boolean;

  /** Geçersiz mi / Is invalid */
  invalid: boolean;

  /** Zorunlu mu / Is required */
  required: boolean;
}

/**
 * State machine'e gönderilebilecek event'ler.
 * Events that can be sent to the state machine.
 */
export type CurrencyInputEvent =
  | { type: 'POINTER_ENTER' }
  | { type: 'POINTER_LEAVE' }
  | { type: 'FOCUS' }
  | { type: 'BLUR' }
  | { type: 'SET_VALUE'; value: number | null }
  | { type: 'SET_VALUE_FROM_STRING'; value: string }
  | { type: 'SET_DISABLED'; value: boolean }
  | { type: 'SET_READ_ONLY'; value: boolean }
  | { type: 'SET_INVALID'; value: boolean };

/**
 * getInputProps() dönüş tipi — input element DOM attribute'ları.
 * Return type of getInputProps() — input element DOM attributes.
 */
export interface CurrencyInputDOMProps {
  type: 'text';
  inputMode: 'decimal';
  disabled: boolean | undefined;
  readOnly: boolean | undefined;
  required: boolean | undefined;
  'aria-invalid': boolean | undefined;
  'aria-required': boolean | undefined;
  'aria-readonly': boolean | undefined;
  'data-state': CurrencyInputInteractionState;
  'data-disabled': '' | undefined;
  'data-readonly': '' | undefined;
  'data-invalid': '' | undefined;
}
