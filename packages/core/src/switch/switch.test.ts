/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createSwitch } from './switch.machine';

describe('createSwitch', () => {
  // ──────────────────────────────────────────
  // Başlangıç durumu / Initial state
  // ──────────────────────────────────────────

  it('varsayılan değerlerle oluşturulur / creates with default values', () => {
    const sw = createSwitch();
    const ctx = sw.getContext();

    expect(ctx.interactionState).toBe('idle');
    expect(ctx.checked).toBe(false);
    expect(ctx.disabled).toBe(false);
    expect(ctx.readOnly).toBe(false);
    expect(ctx.invalid).toBe(false);
    expect(ctx.required).toBe(false);
  });

  it('props ile oluşturulur / creates with given props', () => {
    const sw = createSwitch({
      checked: true,
      disabled: true,
      readOnly: true,
      invalid: true,
      required: true,
    });
    const ctx = sw.getContext();

    expect(ctx.checked).toBe(true);
    expect(ctx.disabled).toBe(true);
    expect(ctx.readOnly).toBe(true);
    expect(ctx.invalid).toBe(true);
    expect(ctx.required).toBe(true);
  });

  // ──────────────────────────────────────────
  // Toggle
  // ──────────────────────────────────────────

  it('TOGGLE — unchecked → checked', () => {
    const sw = createSwitch();
    sw.send({ type: 'TOGGLE' });

    expect(sw.getContext().checked).toBe(true);
  });

  it('TOGGLE — checked → unchecked', () => {
    const sw = createSwitch({ checked: true });
    sw.send({ type: 'TOGGLE' });

    expect(sw.getContext().checked).toBe(false);
  });

  it('TOGGLE — çift toggle başa döner', () => {
    const sw = createSwitch();
    sw.send({ type: 'TOGGLE' });
    sw.send({ type: 'TOGGLE' });

    expect(sw.getContext().checked).toBe(false);
  });

  // ──────────────────────────────────────────
  // Disabled
  // ──────────────────────────────────────────

  it('disabled durumda TOGGLE yoksayılır', () => {
    const sw = createSwitch({ disabled: true });
    sw.send({ type: 'TOGGLE' });

    expect(sw.getContext().checked).toBe(false);
  });

  it('disabled durumda etkileşim yoksayılır', () => {
    const sw = createSwitch({ disabled: true });
    const prev = sw.getContext();
    const next = sw.send({ type: 'POINTER_ENTER' });

    expect(next).toBe(prev);
  });

  it('isInteractionBlocked — disabled true döner', () => {
    const sw = createSwitch({ disabled: true });

    expect(sw.isInteractionBlocked()).toBe(true);
  });

  it('isInteractionBlocked — normal false döner', () => {
    const sw = createSwitch();

    expect(sw.isInteractionBlocked()).toBe(false);
  });

  // ──────────────────────────────────────────
  // ReadOnly
  // ──────────────────────────────────────────

  it('readOnly durumda TOGGLE yoksayılır', () => {
    const sw = createSwitch({ readOnly: true });
    sw.send({ type: 'TOGGLE' });

    expect(sw.getContext().checked).toBe(false);
  });

  it('readOnly durumda etkileşim (hover) çalışır', () => {
    const sw = createSwitch({ readOnly: true });
    sw.send({ type: 'POINTER_ENTER' });

    expect(sw.getContext().interactionState).toBe('hover');
  });

  // ──────────────────────────────────────────
  // Interaction state geçişleri
  // ──────────────────────────────────────────

  it('POINTER_ENTER → hover', () => {
    const sw = createSwitch();
    sw.send({ type: 'POINTER_ENTER' });

    expect(sw.getContext().interactionState).toBe('hover');
  });

  it('POINTER_LEAVE → idle', () => {
    const sw = createSwitch();
    sw.send({ type: 'POINTER_ENTER' });
    sw.send({ type: 'POINTER_LEAVE' });

    expect(sw.getContext().interactionState).toBe('idle');
  });

  it('POINTER_DOWN → active (hover sonrası)', () => {
    const sw = createSwitch();
    sw.send({ type: 'POINTER_ENTER' });
    sw.send({ type: 'POINTER_DOWN' });

    expect(sw.getContext().interactionState).toBe('active');
  });

  it('POINTER_UP → hover (active sonrası)', () => {
    const sw = createSwitch();
    sw.send({ type: 'POINTER_ENTER' });
    sw.send({ type: 'POINTER_DOWN' });
    sw.send({ type: 'POINTER_UP' });

    expect(sw.getContext().interactionState).toBe('hover');
  });

  it('FOCUS → focused', () => {
    const sw = createSwitch();
    sw.send({ type: 'FOCUS' });

    expect(sw.getContext().interactionState).toBe('focused');
  });

  it('BLUR → idle', () => {
    const sw = createSwitch();
    sw.send({ type: 'FOCUS' });
    sw.send({ type: 'BLUR' });

    expect(sw.getContext().interactionState).toBe('idle');
  });

  // ──────────────────────────────────────────
  // Referans eşitliği / Reference equality
  // ──────────────────────────────────────────

  it('değişiklik yoksa aynı referans döner', () => {
    const sw = createSwitch();
    const prev = sw.getContext();
    const next = sw.send({ type: 'POINTER_LEAVE' });

    expect(next).toBe(prev);
  });

  it('SET_CHECKED — aynı değer aynı referans', () => {
    const sw = createSwitch({ checked: false });
    const prev = sw.getContext();
    const next = sw.send({ type: 'SET_CHECKED', value: false });

    expect(next).toBe(prev);
  });

  it('SET_DISABLED — aynı değer aynı referans', () => {
    const sw = createSwitch();
    const prev = sw.getContext();
    const next = sw.send({ type: 'SET_DISABLED', value: false });

    expect(next).toBe(prev);
  });

  it('SET_INVALID — aynı değer aynı referans', () => {
    const sw = createSwitch();
    const prev = sw.getContext();
    const next = sw.send({ type: 'SET_INVALID', value: false });

    expect(next).toBe(prev);
  });

  // ──────────────────────────────────────────
  // Prop güncellemeleri / Prop updates
  // ──────────────────────────────────────────

  it('SET_CHECKED — checked günceller', () => {
    const sw = createSwitch();
    sw.send({ type: 'SET_CHECKED', value: true });

    expect(sw.getContext().checked).toBe(true);
  });

  it('SET_DISABLED — disabled günceller ve interaction sıfırlar', () => {
    const sw = createSwitch();
    sw.send({ type: 'POINTER_ENTER' });
    sw.send({ type: 'SET_DISABLED', value: true });

    expect(sw.getContext().disabled).toBe(true);
    expect(sw.getContext().interactionState).toBe('idle');
  });

  it('SET_INVALID — invalid günceller', () => {
    const sw = createSwitch();
    sw.send({ type: 'SET_INVALID', value: true });

    expect(sw.getContext().invalid).toBe(true);
  });

  // ──────────────────────────────────────────
  // getSwitchProps — DOM attribute'ları
  // ──────────────────────────────────────────

  it('varsayılan DOM props doğru üretilir', () => {
    const sw = createSwitch();
    const props = sw.getSwitchProps();

    expect(props.role).toBe('switch');
    expect(props.tabIndex).toBe(0);
    expect(props['aria-checked']).toBe(false);
    expect(props['aria-disabled']).toBeUndefined();
    expect(props['data-state']).toBe('unchecked');
    expect(props['data-disabled']).toBeUndefined();
    expect(props['data-focus']).toBeUndefined();
    expect(props['data-hover']).toBeUndefined();
    expect(props['data-active']).toBeUndefined();
  });

  it('checked DOM props doğru üretilir', () => {
    const sw = createSwitch({ checked: true });
    const props = sw.getSwitchProps();

    expect(props['aria-checked']).toBe(true);
    expect(props['data-state']).toBe('checked');
  });

  it('disabled DOM props doğru üretilir', () => {
    const sw = createSwitch({ disabled: true });
    const props = sw.getSwitchProps();

    expect(props['aria-disabled']).toBe(true);
    expect(props['data-disabled']).toBe('');
  });

  it('invalid DOM props doğru üretilir', () => {
    const sw = createSwitch({ invalid: true });
    const props = sw.getSwitchProps();

    expect(props['aria-invalid']).toBe(true);
    expect(props['data-invalid']).toBe('');
  });

  it('required DOM props doğru üretilir', () => {
    const sw = createSwitch({ required: true });
    const props = sw.getSwitchProps();

    expect(props['aria-required']).toBe(true);
  });

  it('readOnly DOM props doğru üretilir', () => {
    const sw = createSwitch({ readOnly: true });
    const props = sw.getSwitchProps();

    expect(props['aria-readonly']).toBe(true);
    expect(props['data-readonly']).toBe('');
  });

  it('hover state data-hover set eder', () => {
    const sw = createSwitch();
    sw.send({ type: 'POINTER_ENTER' });
    const props = sw.getSwitchProps();

    expect(props['data-hover']).toBe('');
  });

  it('focus state data-focus set eder', () => {
    const sw = createSwitch();
    sw.send({ type: 'FOCUS' });
    const props = sw.getSwitchProps();

    expect(props['data-focus']).toBe('');
  });

  it('active state data-active set eder', () => {
    const sw = createSwitch();
    sw.send({ type: 'POINTER_ENTER' });
    sw.send({ type: 'POINTER_DOWN' });
    const props = sw.getSwitchProps();

    expect(props['data-active']).toBe('');
  });
});
