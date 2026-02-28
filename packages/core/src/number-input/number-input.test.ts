/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createNumberInput } from './number-input.machine';

describe('createNumberInput', () => {
  // ──────────────────────────────────────────
  // Varsayılan değerler / Default values
  // ──────────────────────────────────────────

  it('varsayılan context döner / returns default context', () => {
    const ni = createNumberInput();
    const ctx = ni.getContext();

    expect(ctx.interactionState).toBe('idle');
    expect(ctx.value).toBeNull();
    expect(ctx.min).toBe(-Infinity);
    expect(ctx.max).toBe(Infinity);
    expect(ctx.step).toBe(1);
    expect(ctx.precision).toBe(0);
    expect(ctx.clampOnBlur).toBe(true);
    expect(ctx.allowEmpty).toBe(true);
    expect(ctx.disabled).toBe(false);
    expect(ctx.readOnly).toBe(false);
    expect(ctx.invalid).toBe(false);
    expect(ctx.required).toBe(false);
    expect(ctx.spinning).toBe(false);
  });

  it('props ile context oluşturur / creates context from props', () => {
    const ni = createNumberInput({
      value: 5,
      min: 0,
      max: 100,
      step: 2,
      precision: 1,
      clampOnBlur: false,
      allowEmpty: false,
      disabled: true,
      readOnly: false,
      invalid: true,
      required: true,
    });
    const ctx = ni.getContext();

    expect(ctx.value).toBe(5);
    expect(ctx.min).toBe(0);
    expect(ctx.max).toBe(100);
    expect(ctx.step).toBe(2);
    expect(ctx.precision).toBe(1);
    expect(ctx.clampOnBlur).toBe(false);
    expect(ctx.allowEmpty).toBe(false);
    expect(ctx.disabled).toBe(true);
    expect(ctx.invalid).toBe(true);
    expect(ctx.required).toBe(true);
  });

  it('precision belirtilmezse step\'ten hesaplar / auto-calculates precision from step', () => {
    const ni1 = createNumberInput({ step: 0.01 });
    expect(ni1.getContext().precision).toBe(2);

    const ni2 = createNumberInput({ step: 0.5 });
    expect(ni2.getContext().precision).toBe(1);

    const ni3 = createNumberInput({ step: 1 });
    expect(ni3.getContext().precision).toBe(0);

    const ni4 = createNumberInput({ step: 0.001 });
    expect(ni4.getContext().precision).toBe(3);
  });

  it('başlangıç değerini precision\'a göre yuvarlar / rounds initial value to precision', () => {
    const ni = createNumberInput({ value: 3.14159, precision: 2 });
    expect(ni.getContext().value).toBe(3.14);
  });

  // ──────────────────────────────────────────
  // INCREMENT / DECREMENT
  // ──────────────────────────────────────────

  describe('increment / decrement', () => {
    it('null değerden INCREMENT → 0 + step', () => {
      const ni = createNumberInput({ step: 5 });
      ni.send({ type: 'INCREMENT' });
      expect(ni.getContext().value).toBe(5);
    });

    it('null değerden DECREMENT → 0 - step', () => {
      const ni = createNumberInput({ step: 5 });
      ni.send({ type: 'DECREMENT' });
      expect(ni.getContext().value).toBe(-5);
    });

    it('mevcut değerden INCREMENT', () => {
      const ni = createNumberInput({ value: 10, step: 3 });
      ni.send({ type: 'INCREMENT' });
      expect(ni.getContext().value).toBe(13);
    });

    it('mevcut değerden DECREMENT', () => {
      const ni = createNumberInput({ value: 10, step: 3 });
      ni.send({ type: 'DECREMENT' });
      expect(ni.getContext().value).toBe(7);
    });

    it('increment max sınırında durur / stops at max', () => {
      const ni = createNumberInput({ value: 9, max: 10, step: 5 });
      ni.send({ type: 'INCREMENT' });
      expect(ni.getContext().value).toBe(10);
    });

    it('decrement min sınırında durur / stops at min', () => {
      const ni = createNumberInput({ value: 2, min: 0, step: 5 });
      ni.send({ type: 'DECREMENT' });
      expect(ni.getContext().value).toBe(0);
    });

    it('zaten max\'ta iken INCREMENT değiştirmez / no change when at max', () => {
      const ni = createNumberInput({ value: 100, max: 100 });
      const ctxBefore = ni.getContext();
      ni.send({ type: 'INCREMENT' });
      expect(ni.getContext()).toBe(ctxBefore);
    });

    it('zaten min\'de iken DECREMENT değiştirmez / no change when at min', () => {
      const ni = createNumberInput({ value: 0, min: 0 });
      const ctxBefore = ni.getContext();
      ni.send({ type: 'DECREMENT' });
      expect(ni.getContext()).toBe(ctxBefore);
    });

    it('ondalıklı step doğru çalışır / decimal step works correctly', () => {
      const ni = createNumberInput({ value: 0.1, step: 0.1 });
      ni.send({ type: 'INCREMENT' });
      expect(ni.getContext().value).toBe(0.2);
    });

    it('ondalıklı step floating point hatası üretmez / no floating point error', () => {
      const ni = createNumberInput({ value: 0, step: 0.1, precision: 1 });
      for (let i = 0; i < 3; i++) {
        ni.send({ type: 'INCREMENT' });
      }
      expect(ni.getContext().value).toBe(0.3);
    });
  });

  // ──────────────────────────────────────────
  // SET_VALUE
  // ──────────────────────────────────────────

  describe('SET_VALUE', () => {
    it('değeri direkt set eder / sets value directly', () => {
      const ni = createNumberInput();
      ni.send({ type: 'SET_VALUE', value: 42 });
      expect(ni.getContext().value).toBe(42);
    });

    it('null değer set eder / sets null value', () => {
      const ni = createNumberInput({ value: 5 });
      ni.send({ type: 'SET_VALUE', value: null });
      expect(ni.getContext().value).toBeNull();
    });

    it('precision\'a göre yuvarlar / rounds to precision', () => {
      const ni = createNumberInput({ precision: 2 });
      ni.send({ type: 'SET_VALUE', value: 3.14159 });
      expect(ni.getContext().value).toBe(3.14);
    });

    it('aynı değerle aynı referans döner / same value returns same reference', () => {
      const ni = createNumberInput({ value: 5 });
      const ctxBefore = ni.getContext();
      ni.send({ type: 'SET_VALUE', value: 5 });
      expect(ni.getContext()).toBe(ctxBefore);
    });
  });

  // ──────────────────────────────────────────
  // SET_VALUE_FROM_STRING
  // ──────────────────────────────────────────

  describe('SET_VALUE_FROM_STRING', () => {
    it('geçerli sayı string\'i parse eder / parses valid number string', () => {
      const ni = createNumberInput();
      ni.send({ type: 'SET_VALUE_FROM_STRING', value: '42' });
      expect(ni.getContext().value).toBe(42);
    });

    it('ondalıklı sayı parse eder / parses decimal number', () => {
      const ni = createNumberInput({ precision: 2 });
      ni.send({ type: 'SET_VALUE_FROM_STRING', value: '3.14' });
      expect(ni.getContext().value).toBe(3.14);
    });

    it('negatif sayı parse eder / parses negative number', () => {
      const ni = createNumberInput();
      ni.send({ type: 'SET_VALUE_FROM_STRING', value: '-5' });
      expect(ni.getContext().value).toBe(-5);
    });

    it('boş string → null (allowEmpty true) / empty string → null', () => {
      const ni = createNumberInput({ value: 5, allowEmpty: true });
      ni.send({ type: 'SET_VALUE_FROM_STRING', value: '' });
      expect(ni.getContext().value).toBeNull();
    });

    it('boş string allowEmpty false ise değiştirmez / empty string when allowEmpty false', () => {
      const ni = createNumberInput({ value: 5, allowEmpty: false });
      const ctxBefore = ni.getContext();
      ni.send({ type: 'SET_VALUE_FROM_STRING', value: '' });
      expect(ni.getContext()).toBe(ctxBefore);
    });

    it('geçersiz string değiştirmez / invalid string does not change', () => {
      const ni = createNumberInput({ value: 5 });
      const ctxBefore = ni.getContext();
      ni.send({ type: 'SET_VALUE_FROM_STRING', value: 'abc' });
      expect(ni.getContext()).toBe(ctxBefore);
    });

    it('sadece tire işareti değiştirmez (allowEmpty true) / only dash does not change', () => {
      const ni = createNumberInput({ allowEmpty: true });
      const ctxBefore = ni.getContext();
      ni.send({ type: 'SET_VALUE_FROM_STRING', value: '-' });
      expect(ni.getContext()).toBe(ctxBefore);
    });

    it('boşluklu string trim eder / trims whitespace', () => {
      const ni = createNumberInput();
      ni.send({ type: 'SET_VALUE_FROM_STRING', value: '  42  ' });
      expect(ni.getContext().value).toBe(42);
    });
  });

  // ──────────────────────────────────────────
  // clampOnBlur
  // ──────────────────────────────────────────

  describe('clampOnBlur', () => {
    it('blur\'da değeri min\'e clamp eder / clamps to min on blur', () => {
      const ni = createNumberInput({ min: 0, max: 100, clampOnBlur: true });
      ni.send({ type: 'SET_VALUE', value: -5 });
      ni.send({ type: 'FOCUS' });
      ni.send({ type: 'BLUR' });
      expect(ni.getContext().value).toBe(0);
    });

    it('blur\'da değeri max\'a clamp eder / clamps to max on blur', () => {
      const ni = createNumberInput({ min: 0, max: 100, clampOnBlur: true });
      ni.send({ type: 'SET_VALUE', value: 150 });
      ni.send({ type: 'FOCUS' });
      ni.send({ type: 'BLUR' });
      expect(ni.getContext().value).toBe(100);
    });

    it('clampOnBlur false ise clamp yapmaz / no clamp when clampOnBlur is false', () => {
      const ni = createNumberInput({ min: 0, max: 100, clampOnBlur: false });
      ni.send({ type: 'SET_VALUE', value: 150 });
      ni.send({ type: 'FOCUS' });
      ni.send({ type: 'BLUR' });
      expect(ni.getContext().value).toBe(150);
    });

    it('null değerde clamp yapmaz / no clamp on null value', () => {
      const ni = createNumberInput({ min: 0, max: 100, clampOnBlur: true });
      ni.send({ type: 'FOCUS' });
      ni.send({ type: 'BLUR' });
      expect(ni.getContext().value).toBeNull();
    });
  });

  // ──────────────────────────────────────────
  // SPIN_START / SPIN_STOP
  // ──────────────────────────────────────────

  describe('spin', () => {
    it('SPIN_START spinning true yapar / sets spinning to true', () => {
      const ni = createNumberInput();
      ni.send({ type: 'SPIN_START', direction: 'increment' });
      expect(ni.getContext().spinning).toBe(true);
    });

    it('SPIN_STOP spinning false yapar / sets spinning to false', () => {
      const ni = createNumberInput();
      ni.send({ type: 'SPIN_START', direction: 'increment' });
      ni.send({ type: 'SPIN_STOP' });
      expect(ni.getContext().spinning).toBe(false);
    });

    it('zaten spinning iken SPIN_START aynı referans döner', () => {
      const ni = createNumberInput();
      ni.send({ type: 'SPIN_START', direction: 'increment' });
      const ctxBefore = ni.getContext();
      ni.send({ type: 'SPIN_START', direction: 'increment' });
      expect(ni.getContext()).toBe(ctxBefore);
    });

    it('spinning değilken SPIN_STOP aynı referans döner', () => {
      const ni = createNumberInput();
      const ctxBefore = ni.getContext();
      ni.send({ type: 'SPIN_STOP' });
      expect(ni.getContext()).toBe(ctxBefore);
    });

    it('blur spinning\'i durdurur / blur stops spinning', () => {
      const ni = createNumberInput();
      ni.send({ type: 'FOCUS' });
      ni.send({ type: 'SPIN_START', direction: 'increment' });
      ni.send({ type: 'BLUR' });
      expect(ni.getContext().spinning).toBe(false);
    });

    it('readOnly durumda SPIN_START çalışmaz / no spin when readOnly', () => {
      const ni = createNumberInput({ readOnly: true });
      const ctxBefore = ni.getContext();
      ni.send({ type: 'SPIN_START', direction: 'increment' });
      expect(ni.getContext()).toBe(ctxBefore);
    });
  });

  // ──────────────────────────────────────────
  // State transitions — pointer
  // ──────────────────────────────────────────

  describe('state transitions — pointer', () => {
    it('idle → hover (POINTER_ENTER)', () => {
      const ni = createNumberInput();
      ni.send({ type: 'POINTER_ENTER' });
      expect(ni.getContext().interactionState).toBe('hover');
    });

    it('hover → idle (POINTER_LEAVE)', () => {
      const ni = createNumberInput();
      ni.send({ type: 'POINTER_ENTER' });
      ni.send({ type: 'POINTER_LEAVE' });
      expect(ni.getContext().interactionState).toBe('idle');
    });
  });

  // ──────────────────────────────────────────
  // State transitions — focus
  // ──────────────────────────────────────────

  describe('state transitions — focus', () => {
    it('idle → focused (FOCUS)', () => {
      const ni = createNumberInput();
      ni.send({ type: 'FOCUS' });
      expect(ni.getContext().interactionState).toBe('focused');
    });

    it('hover → focused (FOCUS)', () => {
      const ni = createNumberInput();
      ni.send({ type: 'POINTER_ENTER' });
      ni.send({ type: 'FOCUS' });
      expect(ni.getContext().interactionState).toBe('focused');
    });

    it('focused → idle (BLUR)', () => {
      const ni = createNumberInput();
      ni.send({ type: 'FOCUS' });
      ni.send({ type: 'BLUR' });
      expect(ni.getContext().interactionState).toBe('idle');
    });

    it('focused durumda POINTER_LEAVE state değiştirmez', () => {
      const ni = createNumberInput();
      ni.send({ type: 'FOCUS' });
      ni.send({ type: 'POINTER_LEAVE' });
      expect(ni.getContext().interactionState).toBe('focused');
    });

    it('focused durumda POINTER_ENTER state değiştirmez', () => {
      const ni = createNumberInput();
      ni.send({ type: 'FOCUS' });
      ni.send({ type: 'POINTER_ENTER' });
      expect(ni.getContext().interactionState).toBe('focused');
    });
  });

  // ──────────────────────────────────────────
  // Disabled — etkileşim engelleme
  // ──────────────────────────────────────────

  describe('disabled — interaction blocking', () => {
    it('disabled durumda pointer event yoksayılır', () => {
      const ni = createNumberInput({ disabled: true });
      ni.send({ type: 'POINTER_ENTER' });
      expect(ni.getContext().interactionState).toBe('idle');
    });

    it('disabled durumda focus event yoksayılır', () => {
      const ni = createNumberInput({ disabled: true });
      ni.send({ type: 'FOCUS' });
      expect(ni.getContext().interactionState).toBe('idle');
    });

    it('disabled durumda INCREMENT yoksayılır', () => {
      const ni = createNumberInput({ value: 5, disabled: true });
      ni.send({ type: 'INCREMENT' });
      expect(ni.getContext().value).toBe(5);
    });

    it('disabled durumda DECREMENT yoksayılır', () => {
      const ni = createNumberInput({ value: 5, disabled: true });
      ni.send({ type: 'DECREMENT' });
      expect(ni.getContext().value).toBe(5);
    });

    it('SET_DISABLED ile runtime disable + spinning durur', () => {
      const ni = createNumberInput();
      ni.send({ type: 'SPIN_START', direction: 'increment' });
      ni.send({ type: 'SET_DISABLED', value: true });
      expect(ni.getContext().disabled).toBe(true);
      expect(ni.getContext().spinning).toBe(false);
      expect(ni.getContext().interactionState).toBe('idle');
    });

    it('SET_DISABLED false ile tekrar aktif', () => {
      const ni = createNumberInput({ disabled: true });
      ni.send({ type: 'SET_DISABLED', value: false });
      expect(ni.getContext().disabled).toBe(false);
      ni.send({ type: 'INCREMENT' });
      expect(ni.getContext().value).toBe(1);
    });

    it('isInteractionBlocked doğru döner / returns correctly', () => {
      const ni = createNumberInput({ disabled: true });
      expect(ni.isInteractionBlocked()).toBe(true);

      const ni2 = createNumberInput();
      expect(ni2.isInteractionBlocked()).toBe(false);
    });
  });

  // ──────────────────────────────────────────
  // ReadOnly — increment/decrement engellenir
  // ──────────────────────────────────────────

  describe('readOnly — increment/decrement blocked', () => {
    it('readOnly durumda INCREMENT yoksayılır', () => {
      const ni = createNumberInput({ value: 5, readOnly: true });
      const ctxBefore = ni.getContext();
      ni.send({ type: 'INCREMENT' });
      expect(ni.getContext()).toBe(ctxBefore);
    });

    it('readOnly durumda DECREMENT yoksayılır', () => {
      const ni = createNumberInput({ value: 5, readOnly: true });
      const ctxBefore = ni.getContext();
      ni.send({ type: 'DECREMENT' });
      expect(ni.getContext()).toBe(ctxBefore);
    });

    it('readOnly durumda hover çalışır', () => {
      const ni = createNumberInput({ readOnly: true });
      ni.send({ type: 'POINTER_ENTER' });
      expect(ni.getContext().interactionState).toBe('hover');
    });

    it('readOnly durumda focus çalışır', () => {
      const ni = createNumberInput({ readOnly: true });
      ni.send({ type: 'FOCUS' });
      expect(ni.getContext().interactionState).toBe('focused');
    });

    it('readOnly isInteractionBlocked false döner', () => {
      const ni = createNumberInput({ readOnly: true });
      expect(ni.isInteractionBlocked()).toBe(false);
    });

    it('SET_READ_ONLY ile runtime toggle', () => {
      const ni = createNumberInput();
      ni.send({ type: 'SET_READ_ONLY', value: true });
      expect(ni.getContext().readOnly).toBe(true);
    });
  });

  // ──────────────────────────────────────────
  // Invalid — runtime toggle
  // ──────────────────────────────────────────

  describe('invalid — runtime toggle', () => {
    it('SET_INVALID ile runtime invalid', () => {
      const ni = createNumberInput();
      ni.send({ type: 'SET_INVALID', value: true });
      expect(ni.getContext().invalid).toBe(true);
    });

    it('SET_INVALID false ile temizle', () => {
      const ni = createNumberInput({ invalid: true });
      ni.send({ type: 'SET_INVALID', value: false });
      expect(ni.getContext().invalid).toBe(false);
    });
  });

  // ──────────────────────────────────────────
  // DOM Props
  // ──────────────────────────────────────────

  describe('getInputProps', () => {
    it('varsayılan attribute döner / returns default attributes', () => {
      const ni = createNumberInput();
      const props = ni.getInputProps();

      expect(props.type).toBe('text');
      expect(props.inputMode).toBe('decimal');
      expect(props.role).toBe('spinbutton');
      expect(props.disabled).toBeUndefined();
      expect(props.readOnly).toBeUndefined();
      expect(props.required).toBeUndefined();
      expect(props['aria-invalid']).toBeUndefined();
      expect(props['aria-valuemin']).toBe(-Infinity);
      expect(props['aria-valuemax']).toBe(Infinity);
      expect(props['aria-valuenow']).toBeUndefined();
      expect(props['aria-valuetext']).toBeUndefined();
      expect(props['data-state']).toBe('idle');
    });

    it('değeri olan input doğru ARIA döner / input with value returns correct ARIA', () => {
      const ni = createNumberInput({ value: 42, min: 0, max: 100 });
      const props = ni.getInputProps();

      expect(props['aria-valuenow']).toBe(42);
      expect(props['aria-valuetext']).toBe('42');
      expect(props['aria-valuemin']).toBe(0);
      expect(props['aria-valuemax']).toBe(100);
    });

    it('precision ile valuetext formatlanır / valuetext formatted with precision', () => {
      const ni = createNumberInput({ value: 3.1, precision: 2 });
      const props = ni.getInputProps();
      expect(props['aria-valuetext']).toBe('3.10');
    });

    it('disabled durumda doğru attribute döner', () => {
      const ni = createNumberInput({ disabled: true });
      const props = ni.getInputProps();
      expect(props.disabled).toBe(true);
      expect(props['data-disabled']).toBe('');
    });

    it('readOnly durumda doğru attribute döner', () => {
      const ni = createNumberInput({ readOnly: true });
      const props = ni.getInputProps();
      expect(props.readOnly).toBe(true);
      expect(props['aria-readonly']).toBe(true);
      expect(props['data-readonly']).toBe('');
    });

    it('invalid durumda doğru attribute döner', () => {
      const ni = createNumberInput({ invalid: true });
      const props = ni.getInputProps();
      expect(props['aria-invalid']).toBe(true);
      expect(props['data-invalid']).toBe('');
    });

    it('required durumda doğru attribute döner', () => {
      const ni = createNumberInput({ required: true });
      const props = ni.getInputProps();
      expect(props.required).toBe(true);
      expect(props['aria-required']).toBe(true);
    });
  });

  describe('getRootProps', () => {
    it('varsayılan root props döner / returns default root props', () => {
      const ni = createNumberInput();
      const props = ni.getRootProps();

      expect(props['data-state']).toBe('idle');
      expect(props['data-disabled']).toBeUndefined();
      expect(props['data-readonly']).toBeUndefined();
      expect(props['data-invalid']).toBeUndefined();
    });

    it('disabled durumda doğru root props döner', () => {
      const ni = createNumberInput({ disabled: true });
      const props = ni.getRootProps();
      expect(props['data-disabled']).toBe('');
    });
  });

  describe('getIncrementProps', () => {
    it('varsayılan increment props döner', () => {
      const ni = createNumberInput();
      const props = ni.getIncrementProps();

      expect(props.role).toBe('button');
      expect(props.tabIndex).toBe(-1);
      expect(props['aria-label']).toBe('Artır / Increment');
      expect(props['aria-disabled']).toBeUndefined();
      expect(props['data-disabled']).toBeUndefined();
    });

    it('max\'ta iken disabled döner / returns disabled at max', () => {
      const ni = createNumberInput({ value: 100, max: 100 });
      const props = ni.getIncrementProps();
      expect(props['aria-disabled']).toBe(true);
      expect(props['data-disabled']).toBe('');
    });

    it('disabled durumda disabled döner', () => {
      const ni = createNumberInput({ disabled: true });
      const props = ni.getIncrementProps();
      expect(props['aria-disabled']).toBe(true);
    });

    it('readOnly durumda disabled döner', () => {
      const ni = createNumberInput({ readOnly: true });
      const props = ni.getIncrementProps();
      expect(props['aria-disabled']).toBe(true);
    });
  });

  describe('getDecrementProps', () => {
    it('varsayılan decrement props döner', () => {
      const ni = createNumberInput();
      const props = ni.getDecrementProps();

      expect(props.role).toBe('button');
      expect(props.tabIndex).toBe(-1);
      expect(props['aria-label']).toBe('Azalt / Decrement');
      expect(props['aria-disabled']).toBeUndefined();
    });

    it('min\'de iken disabled döner / returns disabled at min', () => {
      const ni = createNumberInput({ value: 0, min: 0 });
      const props = ni.getDecrementProps();
      expect(props['aria-disabled']).toBe(true);
      expect(props['data-disabled']).toBe('');
    });

    it('disabled durumda disabled döner', () => {
      const ni = createNumberInput({ disabled: true });
      const props = ni.getDecrementProps();
      expect(props['aria-disabled']).toBe(true);
    });
  });

  // ──────────────────────────────────────────
  // getFormattedValue
  // ──────────────────────────────────────────

  describe('getFormattedValue', () => {
    it('null değer boş string döner / null value returns empty string', () => {
      const ni = createNumberInput();
      expect(ni.getFormattedValue()).toBe('');
    });

    it('tam sayıyı formatlar / formats integer', () => {
      const ni = createNumberInput({ value: 42 });
      expect(ni.getFormattedValue()).toBe('42');
    });

    it('precision\'a göre formatlar / formats with precision', () => {
      const ni = createNumberInput({ value: 3.1, precision: 2 });
      expect(ni.getFormattedValue()).toBe('3.10');
    });

    it('increment sonrası formatlanmış değer döner', () => {
      const ni = createNumberInput({ value: 0, step: 0.01 });
      ni.send({ type: 'INCREMENT' });
      expect(ni.getFormattedValue()).toBe('0.01');
    });
  });

  // ──────────────────────────────────────────
  // Referans eşitliği — gereksiz re-render önleme
  // ──────────────────────────────────────────

  describe('reference equality — unnecessary re-render prevention', () => {
    it('aynı değerle SET_DISABLED aynı referansı döner', () => {
      const ni = createNumberInput({ disabled: true });
      const ctxBefore = ni.getContext();
      const ctxAfter = ni.send({ type: 'SET_DISABLED', value: true });
      expect(ctxAfter).toBe(ctxBefore);
    });

    it('aynı değerle SET_READ_ONLY aynı referansı döner', () => {
      const ni = createNumberInput({ readOnly: false });
      const ctxBefore = ni.getContext();
      const ctxAfter = ni.send({ type: 'SET_READ_ONLY', value: false });
      expect(ctxAfter).toBe(ctxBefore);
    });

    it('aynı değerle SET_INVALID aynı referansı döner', () => {
      const ni = createNumberInput({ invalid: false });
      const ctxBefore = ni.getContext();
      const ctxAfter = ni.send({ type: 'SET_INVALID', value: false });
      expect(ctxAfter).toBe(ctxBefore);
    });

    it('durum değişmezse aynı referans döner (idle → POINTER_LEAVE)', () => {
      const ni = createNumberInput();
      const ctxBefore = ni.getContext();
      const ctxAfter = ni.send({ type: 'POINTER_LEAVE' });
      expect(ctxAfter).toBe(ctxBefore);
    });

    it('durum değişirse yeni referans döner (idle → hover)', () => {
      const ni = createNumberInput();
      const ctxBefore = ni.getContext();
      const ctxAfter = ni.send({ type: 'POINTER_ENTER' });
      expect(ctxAfter).not.toBe(ctxBefore);
    });
  });
});
