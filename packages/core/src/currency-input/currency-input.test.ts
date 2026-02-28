/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import {
  createCurrencyInput,
  formatCurrencyValue,
  parseCurrencyString,
  resolveLocaleInfo,
} from './currency-input.machine';

// ── resolveLocaleInfo ───────────────────────────────────────────────

describe('resolveLocaleInfo', () => {
  it('tr-TR locale bilgisini doğru çözer / resolves tr-TR locale correctly', () => {
    const info = resolveLocaleInfo('tr-TR', 'TRY', 'symbol');
    expect(info.groupSeparator).toBe('.');
    expect(info.decimalSeparator).toBe(',');
    expect(info.currencySymbol).toBe('₺');
  });

  it('en-US locale bilgisini doğru çözer / resolves en-US locale correctly', () => {
    const info = resolveLocaleInfo('en-US', 'USD', 'symbol');
    expect(info.groupSeparator).toBe(',');
    expect(info.decimalSeparator).toBe('.');
    expect(info.currencySymbol).toBe('$');
    expect(info.symbolPosition).toBe('prefix');
  });

  it('de-DE locale bilgisini doğru çözer / resolves de-DE locale correctly', () => {
    const info = resolveLocaleInfo('de-DE', 'EUR', 'symbol');
    expect(info.groupSeparator).toBe('.');
    expect(info.decimalSeparator).toBe(',');
    expect(info.currencySymbol).toBe('€');
  });

  it('currencyDisplay code desteklenir / currencyDisplay code is supported', () => {
    const info = resolveLocaleInfo('en-US', 'USD', 'code');
    expect(info.currencySymbol).toBe('USD');
  });

  it('currencyDisplay none ise sembol boş / none display has empty symbol', () => {
    const info = resolveLocaleInfo('tr-TR', 'TRY', 'none');
    expect(info.currencySymbol).toBe('');
  });
});

// ── formatCurrencyValue ─────────────────────────────────────────────

describe('formatCurrencyValue', () => {
  const trInfo = resolveLocaleInfo('tr-TR', 'TRY', 'symbol');
  const enInfo = resolveLocaleInfo('en-US', 'USD', 'symbol');

  it('null değer boş string döner / null returns empty string', () => {
    expect(formatCurrencyValue(null, 2, trInfo, 'symbol')).toBe('');
  });

  it('tr-TR formatı doğru / tr-TR format is correct', () => {
    expect(formatCurrencyValue(1234.56, 2, trInfo, 'symbol')).toBe('₺1.234,56');
  });

  it('en-US formatı doğru / en-US format is correct', () => {
    expect(formatCurrencyValue(1234.56, 2, enInfo, 'symbol')).toBe('$1,234.56');
  });

  it('küçük değer binlik ayracısız / small value without group separator', () => {
    expect(formatCurrencyValue(42.50, 2, trInfo, 'symbol')).toBe('₺42,50');
  });

  it('sıfır değer / zero value', () => {
    expect(formatCurrencyValue(0, 2, trInfo, 'symbol')).toBe('₺0,00');
  });

  it('büyük sayı doğru formatlanır / large number formats correctly', () => {
    expect(formatCurrencyValue(1000000, 2, trInfo, 'symbol')).toBe('₺1.000.000,00');
  });

  it('negatif değer / negative value', () => {
    expect(formatCurrencyValue(-50.25, 2, trInfo, 'symbol')).toBe('₺-50,25');
  });

  it('precision 0 / zero precision', () => {
    expect(formatCurrencyValue(1234, 0, trInfo, 'symbol')).toBe('₺1.234');
  });

  it('precision 3 / precision 3', () => {
    expect(formatCurrencyValue(1234.567, 3, trInfo, 'symbol')).toBe('₺1.234,567');
  });

  it('currencyDisplay none ise sembol yok / no symbol when display is none', () => {
    expect(formatCurrencyValue(1234.56, 2, trInfo, 'none')).toBe('1.234,56');
  });

  it('suffix konumlu para birimi / suffix position currency', () => {
    const suffixInfo = { ...trInfo, symbolPosition: 'suffix' as const };
    expect(formatCurrencyValue(1234.56, 2, suffixInfo, 'symbol')).toBe('1.234,56 ₺');
  });
});

// ── parseCurrencyString ─────────────────────────────────────────────

describe('parseCurrencyString', () => {
  const trInfo = resolveLocaleInfo('tr-TR', 'TRY', 'symbol');
  const enInfo = resolveLocaleInfo('en-US', 'USD', 'symbol');

  it('boş string null döner / empty string returns null', () => {
    expect(parseCurrencyString('', trInfo, false)).toBe(null);
  });

  it('whitespace null döner / whitespace returns null', () => {
    expect(parseCurrencyString('   ', trInfo, false)).toBe(null);
  });

  it('tr-TR formatlı string parse edilir / tr-TR formatted string is parsed', () => {
    expect(parseCurrencyString('1.234,56', trInfo, false)).toBe(1234.56);
  });

  it('en-US formatlı string parse edilir / en-US formatted string is parsed', () => {
    expect(parseCurrencyString('1,234.56', enInfo, false)).toBe(1234.56);
  });

  it('para birimi sembolü ile parse edilir / parsed with currency symbol', () => {
    expect(parseCurrencyString('₺1.234,56', trInfo, false)).toBe(1234.56);
  });

  it('dolar sembolü ile parse edilir / parsed with dollar symbol', () => {
    expect(parseCurrencyString('$1,234.56', enInfo, false)).toBe(1234.56);
  });

  it('sadece sayı parse edilir / plain number is parsed', () => {
    expect(parseCurrencyString('42', trInfo, false)).toBe(42);
  });

  it('ondalık ile parse edilir / parsed with decimal', () => {
    expect(parseCurrencyString('42,50', trInfo, false)).toBe(42.5);
  });

  it('negatif izin verilmezse pozitif döner / no negative when not allowed', () => {
    expect(parseCurrencyString('-100', trInfo, false)).toBe(100);
  });

  it('negatif izin verilirse negatif döner / negative when allowed', () => {
    expect(parseCurrencyString('-100', trInfo, true)).toBe(-100);
  });

  it('geçersiz string null döner / invalid string returns null', () => {
    expect(parseCurrencyString('abc', trInfo, false)).toBe(null);
  });

  it('boşluk trim edilir / whitespace is trimmed', () => {
    expect(parseCurrencyString('  1.234,56  ', trInfo, false)).toBe(1234.56);
  });
});

// ── createCurrencyInput ─────────────────────────────────────────────

describe('createCurrencyInput', () => {
  // ── Defaults ──────────────────────────────────────────────────────

  it('varsayılan context / default context', () => {
    const ci = createCurrencyInput();
    const ctx = ci.getContext();
    expect(ctx.value).toBe(null);
    expect(ctx.precision).toBe(2);
    expect(ctx.locale).toBe('tr-TR');
    expect(ctx.currency).toBe('TRY');
    expect(ctx.currencyDisplay).toBe('symbol');
    expect(ctx.allowNegative).toBe(false);
    expect(ctx.allowEmpty).toBe(true);
    expect(ctx.clampOnBlur).toBe(true);
    expect(ctx.min).toBe(0); // allowNegative=false → min=0
    expect(ctx.max).toBe(Infinity);
    expect(ctx.disabled).toBe(false);
    expect(ctx.readOnly).toBe(false);
    expect(ctx.invalid).toBe(false);
    expect(ctx.interactionState).toBe('idle');
  });

  it('allowNegative=true iken min=-Infinity / min is -Infinity when allowNegative', () => {
    const ci = createCurrencyInput({ allowNegative: true });
    expect(ci.getContext().min).toBe(-Infinity);
  });

  it('başlangıç değeri precision ile yuvarlanır / initial value rounded to precision', () => {
    const ci = createCurrencyInput({ value: 12.345, precision: 2 });
    expect(ci.getContext().value).toBe(12.35);
  });

  // ── Format ────────────────────────────────────────────────────────

  it('getFormattedValue tr-TR / getFormattedValue for tr-TR', () => {
    const ci = createCurrencyInput({ value: 1234.56 });
    expect(ci.getFormattedValue()).toBe('₺1.234,56');
  });

  it('getFormattedValue en-US / getFormattedValue for en-US', () => {
    const ci = createCurrencyInput({ value: 1234.56, locale: 'en-US', currency: 'USD' });
    expect(ci.getFormattedValue()).toBe('$1,234.56');
  });

  it('getFormattedValue null ise boş / empty when null', () => {
    const ci = createCurrencyInput();
    expect(ci.getFormattedValue()).toBe('');
  });

  it('getRawDisplayValue tr-TR / getRawDisplayValue for tr-TR', () => {
    const ci = createCurrencyInput({ value: 1234.56 });
    expect(ci.getRawDisplayValue()).toBe('1234,56');
  });

  it('getRawDisplayValue en-US / getRawDisplayValue for en-US', () => {
    const ci = createCurrencyInput({ value: 1234.56, locale: 'en-US', currency: 'USD' });
    expect(ci.getRawDisplayValue()).toBe('1234.56');
  });

  it('getRawDisplayValue null ise boş / empty when null', () => {
    const ci = createCurrencyInput();
    expect(ci.getRawDisplayValue()).toBe('');
  });

  // ── SET_VALUE ─────────────────────────────────────────────────────

  it('SET_VALUE değer günceller / SET_VALUE updates value', () => {
    const ci = createCurrencyInput();
    ci.send({ type: 'SET_VALUE', value: 100 });
    expect(ci.getContext().value).toBe(100);
  });

  it('SET_VALUE null ile temizler / SET_VALUE with null clears', () => {
    const ci = createCurrencyInput({ value: 100 });
    ci.send({ type: 'SET_VALUE', value: null });
    expect(ci.getContext().value).toBe(null);
  });

  it('SET_VALUE precision ile yuvarlar / SET_VALUE rounds to precision', () => {
    const ci = createCurrencyInput({ precision: 2 });
    ci.send({ type: 'SET_VALUE', value: 12.345 });
    expect(ci.getContext().value).toBe(12.35);
  });

  it('SET_VALUE aynı değerde referans aynı / same value same reference', () => {
    const ci = createCurrencyInput({ value: 100 });
    const before = ci.getContext();
    ci.send({ type: 'SET_VALUE', value: 100 });
    expect(ci.getContext()).toBe(before);
  });

  // ── SET_VALUE_FROM_STRING ─────────────────────────────────────────

  it('SET_VALUE_FROM_STRING tr-TR formatlı parse / parses tr-TR formatted string', () => {
    const ci = createCurrencyInput();
    ci.send({ type: 'SET_VALUE_FROM_STRING', value: '1.234,56' });
    expect(ci.getContext().value).toBe(1234.56);
  });

  it('SET_VALUE_FROM_STRING sembol ile parse / parses with symbol', () => {
    const ci = createCurrencyInput();
    ci.send({ type: 'SET_VALUE_FROM_STRING', value: '₺500,00' });
    expect(ci.getContext().value).toBe(500);
  });

  it('SET_VALUE_FROM_STRING en-US parse / parses en-US string', () => {
    const ci = createCurrencyInput({ locale: 'en-US', currency: 'USD' });
    ci.send({ type: 'SET_VALUE_FROM_STRING', value: '$1,234.56' });
    expect(ci.getContext().value).toBe(1234.56);
  });

  it('SET_VALUE_FROM_STRING boş → null / empty string → null', () => {
    const ci = createCurrencyInput({ value: 100 });
    ci.send({ type: 'SET_VALUE_FROM_STRING', value: '' });
    expect(ci.getContext().value).toBe(null);
  });

  it('SET_VALUE_FROM_STRING geçersiz → aynı / invalid string → same', () => {
    const ci = createCurrencyInput({ value: 100 });
    const before = ci.getContext();
    ci.send({ type: 'SET_VALUE_FROM_STRING', value: 'abc' });
    expect(ci.getContext()).toBe(before);
  });

  it('SET_VALUE_FROM_STRING negatif engellenirse pozitif / positive when negative not allowed', () => {
    const ci = createCurrencyInput({ allowNegative: false });
    ci.send({ type: 'SET_VALUE_FROM_STRING', value: '-50' });
    expect(ci.getContext().value).toBe(50);
  });

  it('SET_VALUE_FROM_STRING negatif izinliyse negatif / negative when allowed', () => {
    const ci = createCurrencyInput({ allowNegative: true });
    ci.send({ type: 'SET_VALUE_FROM_STRING', value: '-50' });
    expect(ci.getContext().value).toBe(-50);
  });

  // ── Interaction state transitions ─────────────────────────────────

  it('POINTER_ENTER → hover / POINTER_ENTER transitions to hover', () => {
    const ci = createCurrencyInput();
    ci.send({ type: 'POINTER_ENTER' });
    expect(ci.getContext().interactionState).toBe('hover');
  });

  it('POINTER_LEAVE → idle / POINTER_LEAVE transitions to idle', () => {
    const ci = createCurrencyInput();
    ci.send({ type: 'POINTER_ENTER' });
    ci.send({ type: 'POINTER_LEAVE' });
    expect(ci.getContext().interactionState).toBe('idle');
  });

  it('FOCUS → focused / FOCUS transitions to focused', () => {
    const ci = createCurrencyInput();
    ci.send({ type: 'FOCUS' });
    expect(ci.getContext().interactionState).toBe('focused');
  });

  it('BLUR → idle / BLUR transitions to idle', () => {
    const ci = createCurrencyInput();
    ci.send({ type: 'FOCUS' });
    ci.send({ type: 'BLUR' });
    expect(ci.getContext().interactionState).toBe('idle');
  });

  it('disabled durumda etkileşim engellenir / interaction blocked when disabled', () => {
    const ci = createCurrencyInput({ disabled: true });
    ci.send({ type: 'POINTER_ENTER' });
    expect(ci.getContext().interactionState).toBe('idle');
  });

  // ── clampOnBlur ───────────────────────────────────────────────────

  it('BLUR clampOnBlur min/max sınırına getirir / BLUR clamps to min/max', () => {
    const ci = createCurrencyInput({ min: 0, max: 100 });
    ci.send({ type: 'SET_VALUE', value: 150 });
    ci.send({ type: 'FOCUS' });
    ci.send({ type: 'BLUR' });
    expect(ci.getContext().value).toBe(100);
  });

  it('BLUR clampOnBlur alt sınır / BLUR clamps to min', () => {
    const ci = createCurrencyInput({ min: 10, max: 100, allowNegative: true });
    ci.send({ type: 'SET_VALUE', value: 5 });
    ci.send({ type: 'FOCUS' });
    ci.send({ type: 'BLUR' });
    expect(ci.getContext().value).toBe(10);
  });

  it('clampOnBlur false ise clamp yapılmaz / no clamp when clampOnBlur is false', () => {
    const ci = createCurrencyInput({ min: 0, max: 100, clampOnBlur: false });
    ci.send({ type: 'SET_VALUE', value: 150 });
    ci.send({ type: 'FOCUS' });
    ci.send({ type: 'BLUR' });
    expect(ci.getContext().value).toBe(150);
  });

  // ── SET_DISABLED / SET_READ_ONLY / SET_INVALID ────────────────────

  it('SET_DISABLED günceller / SET_DISABLED updates', () => {
    const ci = createCurrencyInput();
    ci.send({ type: 'SET_DISABLED', value: true });
    expect(ci.getContext().disabled).toBe(true);
  });

  it('SET_DISABLED aynı değerde referans aynı / same value same reference', () => {
    const ci = createCurrencyInput({ disabled: true });
    const before = ci.getContext();
    ci.send({ type: 'SET_DISABLED', value: true });
    expect(ci.getContext()).toBe(before);
  });

  it('SET_DISABLED idle sıfırlar / SET_DISABLED resets to idle', () => {
    const ci = createCurrencyInput();
    ci.send({ type: 'FOCUS' });
    ci.send({ type: 'SET_DISABLED', value: true });
    expect(ci.getContext().interactionState).toBe('idle');
  });

  it('SET_READ_ONLY günceller / SET_READ_ONLY updates', () => {
    const ci = createCurrencyInput();
    ci.send({ type: 'SET_READ_ONLY', value: true });
    expect(ci.getContext().readOnly).toBe(true);
  });

  it('SET_INVALID günceller / SET_INVALID updates', () => {
    const ci = createCurrencyInput();
    ci.send({ type: 'SET_INVALID', value: true });
    expect(ci.getContext().invalid).toBe(true);
  });

  // ── DOM Props ─────────────────────────────────────────────────────

  it('getInputProps varsayılan / default getInputProps', () => {
    const ci = createCurrencyInput();
    const props = ci.getInputProps();
    expect(props.type).toBe('text');
    expect(props.inputMode).toBe('decimal');
    expect(props['data-state']).toBe('idle');
    expect(props.disabled).toBeUndefined();
    expect(props.readOnly).toBeUndefined();
  });

  it('getInputProps disabled / getInputProps when disabled', () => {
    const ci = createCurrencyInput({ disabled: true });
    const props = ci.getInputProps();
    expect(props.disabled).toBe(true);
    expect(props['data-disabled']).toBe('');
  });

  it('getInputProps invalid / getInputProps when invalid', () => {
    const ci = createCurrencyInput({ invalid: true });
    const props = ci.getInputProps();
    expect(props['aria-invalid']).toBe(true);
    expect(props['data-invalid']).toBe('');
  });

  it('getInputProps readOnly / getInputProps when readOnly', () => {
    const ci = createCurrencyInput({ readOnly: true });
    const props = ci.getInputProps();
    expect(props.readOnly).toBe(true);
    expect(props['data-readonly']).toBe('');
  });

  it('getInputProps required / getInputProps when required', () => {
    const ci = createCurrencyInput({ required: true });
    const props = ci.getInputProps();
    expect(props.required).toBe(true);
    expect(props['aria-required']).toBe(true);
  });

  // ── isInteractionBlocked ──────────────────────────────────────────

  it('isInteractionBlocked disabled / blocked when disabled', () => {
    const ci = createCurrencyInput({ disabled: true });
    expect(ci.isInteractionBlocked()).toBe(true);
  });

  it('isInteractionBlocked normal / not blocked normally', () => {
    const ci = createCurrencyInput();
    expect(ci.isInteractionBlocked()).toBe(false);
  });

  // ── getLocaleInfo ─────────────────────────────────────────────────

  it('getLocaleInfo locale bilgisi döner / returns locale info', () => {
    const ci = createCurrencyInput({ locale: 'tr-TR', currency: 'TRY' });
    const info = ci.getLocaleInfo();
    expect(info.groupSeparator).toBe('.');
    expect(info.decimalSeparator).toBe(',');
    expect(info.currencySymbol).toBe('₺');
  });

  // ── Referans eşitliği / Reference equality ────────────────────────

  it('aynı event sonucu referans eşit / same event returns same reference', () => {
    const ci = createCurrencyInput();
    const ctx1 = ci.getContext();
    ci.send({ type: 'POINTER_LEAVE' }); // idle→idle, aynı
    expect(ci.getContext()).toBe(ctx1);
  });
});
