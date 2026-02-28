/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * CurrencyInput state machine — framework-agnostic headless currency input logic.
 * CurrencyInput state machine — framework bağımsız headless para birimi input mantığı.
 *
 * Locale-aware formatlama (binlik/ondalık ayracı, para birimi sembolü),
 * ham sayısal değer yönetimi, min/max, clampOnBlur.
 *
 * @packageDocumentation
 */

import type {
  CurrencyInputProps,
  CurrencyInputMachineContext,
  CurrencyInputEvent,
  CurrencyInputDOMProps,
  CurrencyInputInteractionState,
  CurrencyLocaleInfo,
  CurrencyDisplay,
} from './currency-input.types';

// ── Yardımcılar / Helpers ───────────────────────────────────────────

/**
 * Değeri precision'a göre yuvarla.
 * Round value to given precision.
 */
function roundToPrecision(value: number, precision: number): number {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

/**
 * Değeri min/max sınırlarına clamp et.
 * Clamp value to min/max boundaries.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Intl.NumberFormat ile locale bilgisini çıkar.
 * Extract locale info using Intl.NumberFormat.
 */
export function resolveLocaleInfo(
  locale: string,
  currency: string,
  currencyDisplay: CurrencyDisplay,
): CurrencyLocaleInfo {
  // Binlik ve ondalık ayracını bul
  const partFormatter = new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  });

  const parts = partFormatter.formatToParts(1234567.89);
  let groupSeparator = '.';
  let decimalSeparator = ',';

  for (const part of parts) {
    if (part.type === 'group') {
      groupSeparator = part.value;
    }
    if (part.type === 'decimal') {
      decimalSeparator = part.value;
    }
  }

  // Para birimi sembolünü ve konumunu bul
  let currencySymbol = '';
  let symbolPosition: 'prefix' | 'suffix' = 'prefix';

  if (currencyDisplay !== 'none') {
    const currFormatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      currencyDisplay: currencyDisplay === 'symbol'
        ? 'symbol'
        : currencyDisplay === 'code'
          ? 'code'
          : 'name',
    });

    const currParts = currFormatter.formatToParts(1);
    let foundCurrency = false;
    let currencyBeforeInteger = true;

    for (const part of currParts) {
      if (part.type === 'currency') {
        currencySymbol = part.value;
        foundCurrency = true;
      }
      if (part.type === 'integer' && !foundCurrency) {
        currencyBeforeInteger = false;
      }
    }

    symbolPosition = currencyBeforeInteger ? 'prefix' : 'suffix';
  }

  return {
    groupSeparator,
    decimalSeparator,
    currencySymbol,
    symbolPosition,
  };
}

/**
 * Ham sayısal değeri locale-aware formatlı string'e çevir.
 * Format raw numeric value to locale-aware formatted string.
 */
export function formatCurrencyValue(
  value: number | null,
  precision: number,
  localeInfo: CurrencyLocaleInfo,
  currencyDisplay: CurrencyDisplay,
): string {
  if (value === null) return '';

  const absValue = Math.abs(value);
  const fixed = absValue.toFixed(precision);

  // Tam kısım ve ondalık kısım ayır
  const dotIdx = fixed.indexOf('.');
  const intPart = dotIdx === -1 ? fixed : fixed.slice(0, dotIdx);
  const decPart = dotIdx === -1 ? '' : fixed.slice(dotIdx + 1);

  // Binlik ayracı ekle
  let formattedInt = '';
  for (let i = 0; i < intPart.length; i++) {
    if (i > 0 && (intPart.length - i) % 3 === 0) {
      formattedInt += localeInfo.groupSeparator;
    }
    formattedInt += intPart[i];
  }

  // Ondalık kısım
  let result = precision > 0
    ? `${formattedInt}${localeInfo.decimalSeparator}${decPart}`
    : formattedInt;

  // Negatif işareti
  if (value < 0) {
    result = `-${result}`;
  }

  // Para birimi sembolü
  if (currencyDisplay !== 'none' && localeInfo.currencySymbol) {
    if (localeInfo.symbolPosition === 'prefix') {
      result = `${localeInfo.currencySymbol}${result}`;
    } else {
      result = `${result} ${localeInfo.currencySymbol}`;
    }
  }

  return result;
}

/**
 * Formatlı string'i ham sayıya çevir (parse et).
 * Parse formatted string to raw number.
 *
 * Binlik ayracını kaldırır, ondalık ayracını '.' ye çevirir, parseFloat yapar.
 */
export function parseCurrencyString(
  str: string,
  localeInfo: CurrencyLocaleInfo,
  allowNegative: boolean,
): number | null {
  if (!str || str.trim() === '') return null;

  let cleaned = str.trim();

  // Para birimi sembolünü kaldır
  if (localeInfo.currencySymbol) {
    cleaned = cleaned.replace(new RegExp(escapeRegex(localeInfo.currencySymbol), 'g'), '');
  }

  cleaned = cleaned.trim();

  // Negatif işareti
  const isNegative = cleaned.startsWith('-');
  if (isNegative) {
    cleaned = cleaned.slice(1);
  }

  // Binlik ayracını kaldır
  if (localeInfo.groupSeparator) {
    cleaned = cleaned.replace(new RegExp(escapeRegex(localeInfo.groupSeparator), 'g'), '');
  }

  // Ondalık ayracını '.' ye çevir
  if (localeInfo.decimalSeparator !== '.') {
    cleaned = cleaned.replace(localeInfo.decimalSeparator, '.');
  }

  // Sayı olmayanları kaldır (. ve - hariç)
  cleaned = cleaned.replace(/[^0-9.]/g, '');

  if (cleaned === '' || cleaned === '.') return null;

  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return null;

  return allowNegative && isNegative ? -parsed : parsed;
}

/**
 * Regex özel karakterlerini escape et.
 * Escape regex special characters.
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── Context oluşturucu / Context creator ────────────────────────────

function createInitialContext(props: CurrencyInputProps): CurrencyInputMachineContext {
  const precision = props.precision ?? 2;
  const min = props.min ?? (props.allowNegative ? -Infinity : 0);
  const max = props.max ?? Infinity;
  const locale = props.locale ?? 'tr-TR';
  const currency = props.currency ?? 'TRY';
  const currencyDisplay = props.currencyDisplay ?? 'symbol';

  const localeInfo = resolveLocaleInfo(locale, currency, currencyDisplay);

  let value = props.value ?? null;
  if (value !== null) {
    value = roundToPrecision(value, precision);
  }

  return {
    interactionState: 'idle',
    value,
    min,
    max,
    precision,
    allowNegative: props.allowNegative ?? false,
    allowEmpty: props.allowEmpty ?? true,
    clampOnBlur: props.clampOnBlur ?? true,
    locale,
    currency,
    currencyDisplay,
    localeInfo,
    disabled: props.disabled ?? false,
    readOnly: props.readOnly ?? false,
    invalid: props.invalid ?? false,
    required: props.required ?? false,
  };
}

// ── Transition ──────────────────────────────────────────────────────

function transition(
  ctx: CurrencyInputMachineContext,
  event: CurrencyInputEvent,
): CurrencyInputMachineContext {
  // ── Prop güncellemeleri her zaman uygulanır ──
  if (event.type === 'SET_DISABLED') {
    if (event.value === ctx.disabled) return ctx;
    return {
      ...ctx,
      disabled: event.value,
      interactionState: event.value ? 'idle' : ctx.interactionState,
    };
  }

  if (event.type === 'SET_READ_ONLY') {
    if (event.value === ctx.readOnly) return ctx;
    return { ...ctx, readOnly: event.value };
  }

  if (event.type === 'SET_INVALID') {
    if (event.value === ctx.invalid) return ctx;
    return { ...ctx, invalid: event.value };
  }

  // ── SET_VALUE — dışarıdan kontrollü değer set etme ──
  if (event.type === 'SET_VALUE') {
    const newVal = event.value === null
      ? null
      : roundToPrecision(event.value, ctx.precision);
    if (newVal === ctx.value) return ctx;
    return { ...ctx, value: newVal };
  }

  // ── SET_VALUE_FROM_STRING — input'tan gelen metin ──
  if (event.type === 'SET_VALUE_FROM_STRING') {
    const str = event.value.trim();

    // Boş string → null (allowEmpty ise)
    if (str === '' || str === '-') {
      if (ctx.allowEmpty && ctx.value === null) return ctx;
      if (ctx.allowEmpty) return { ...ctx, value: null };
      return ctx;
    }

    const parsed = parseCurrencyString(event.value, ctx.localeInfo, ctx.allowNegative);

    // Geçersiz string → mevcut değeri koru
    if (parsed === null) return ctx;

    const rounded = roundToPrecision(parsed, ctx.precision);
    if (rounded === ctx.value) return ctx;
    return { ...ctx, value: rounded };
  }

  // ── Disabled durumda etkileşim engellenir ──
  if (ctx.disabled) return ctx;

  // ── Etkileşim state geçişleri ──
  const { interactionState } = ctx;
  let nextState: CurrencyInputInteractionState = interactionState;

  switch (event.type) {
    case 'POINTER_ENTER':
      if (interactionState === 'idle') {
        nextState = 'hover';
      }
      break;

    case 'POINTER_LEAVE':
      if (interactionState === 'hover') {
        nextState = 'idle';
      }
      break;

    case 'FOCUS':
      nextState = 'focused';
      break;

    case 'BLUR': {
      nextState = 'idle';

      // clampOnBlur: focus kaybedince min/max'a clamp et
      if (ctx.clampOnBlur && ctx.value !== null) {
        const clamped = clamp(ctx.value, ctx.min, ctx.max);
        if (clamped !== ctx.value) {
          return { ...ctx, interactionState: nextState, value: clamped };
        }
      }

      if (nextState === interactionState) return ctx;
      return { ...ctx, interactionState: nextState };
    }
  }

  if (nextState === interactionState) return ctx;
  return { ...ctx, interactionState: nextState };
}

// ── DOM Props üreticisi / DOM Props generator ───────────────────────

function getInputProps(ctx: CurrencyInputMachineContext): CurrencyInputDOMProps {
  return {
    type: 'text',
    inputMode: 'decimal',
    disabled: ctx.disabled ? true : undefined,
    readOnly: ctx.readOnly ? true : undefined,
    required: ctx.required ? true : undefined,
    'aria-invalid': ctx.invalid ? true : undefined,
    'aria-required': ctx.required ? true : undefined,
    'aria-readonly': ctx.readOnly ? true : undefined,
    'data-state': ctx.interactionState,
    'data-disabled': ctx.disabled ? '' : undefined,
    'data-readonly': ctx.readOnly ? '' : undefined,
    'data-invalid': ctx.invalid ? '' : undefined,
  };
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * CurrencyInput API — state machine, format/parse ve durum sorgulama.
 * CurrencyInput API — state machine, format/parse and state queries.
 */
export interface CurrencyInputAPI {
  /** Mevcut context / Current context */
  getContext(): CurrencyInputMachineContext;

  /** Event gönder, yeni context döner / Send event, returns new context */
  send(event: CurrencyInputEvent): CurrencyInputMachineContext;

  /** Input element DOM attribute'ları / Input element DOM attributes */
  getInputProps(): CurrencyInputDOMProps;

  /** Etkileşim engellenmiş mi / Is interaction blocked */
  isInteractionBlocked(): boolean;

  /**
   * Değeri formatlı string olarak döndür (para birimi sembolü dahil).
   * Return value as formatted string (including currency symbol).
   */
  getFormattedValue(): string;

  /**
   * Değeri ham sayısal string olarak döndür (düzenleme modu için).
   * Return value as raw numeric string (for editing mode).
   *
   * Focus anında kullanıcıya binlik ayracısız, locale ondalık ayracıyla gösterilir.
   */
  getRawDisplayValue(): string;

  /** Locale bilgisi / Locale info */
  getLocaleInfo(): CurrencyLocaleInfo;
}

/**
 * CurrencyInput state machine oluştur.
 * Create a currency input state machine.
 *
 * @example
 * ```ts
 * const currencyInput = createCurrencyInput({
 *   locale: 'tr-TR',
 *   currency: 'TRY',
 *   precision: 2,
 * });
 *
 * currencyInput.send({ type: 'SET_VALUE', value: 1234.56 });
 * currencyInput.getFormattedValue(); // '₺1.234,56'
 * ```
 */
export function createCurrencyInput(props: CurrencyInputProps = {}): CurrencyInputAPI {
  let ctx = createInitialContext(props);

  return {
    getContext() {
      return ctx;
    },

    send(event: CurrencyInputEvent) {
      ctx = transition(ctx, event);
      return ctx;
    },

    getInputProps() {
      return getInputProps(ctx);
    },

    isInteractionBlocked() {
      return ctx.disabled;
    },

    getFormattedValue() {
      return formatCurrencyValue(ctx.value, ctx.precision, ctx.localeInfo, ctx.currencyDisplay);
    },

    getRawDisplayValue() {
      if (ctx.value === null) return '';
      const fixed = ctx.value.toFixed(ctx.precision);
      // Ondalık ayracını locale'e uygun göster
      if (ctx.localeInfo.decimalSeparator !== '.') {
        return fixed.replace('.', ctx.localeInfo.decimalSeparator);
      }
      return fixed;
    },

    getLocaleInfo() {
      return ctx.localeInfo;
    },
  };
}
