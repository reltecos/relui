/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createCheckbox } from './checkbox.machine';

describe('createCheckbox', () => {
  // ──────────────────────────────────────────
  // Varsayılan değerler / Default values
  // ──────────────────────────────────────────

  it('varsayılan context döner / returns default context', () => {
    const cb = createCheckbox();
    const ctx = cb.getContext();

    expect(ctx.interactionState).toBe('idle');
    expect(ctx.checked).toBe(false);
    expect(ctx.disabled).toBe(false);
    expect(ctx.readOnly).toBe(false);
    expect(ctx.invalid).toBe(false);
    expect(ctx.required).toBe(false);
  });

  it('props ile context oluşturur / creates context from props', () => {
    const cb = createCheckbox({
      checked: true,
      disabled: true,
      invalid: true,
      required: true,
    });
    const ctx = cb.getContext();

    expect(ctx.checked).toBe(true);
    expect(ctx.disabled).toBe(true);
    expect(ctx.invalid).toBe(true);
    expect(ctx.required).toBe(true);
  });

  it('indeterminate checked state ile oluşturulur', () => {
    const cb = createCheckbox({ checked: 'indeterminate' });
    expect(cb.getContext().checked).toBe('indeterminate');
  });

  // ──────────────────────────────────────────
  // DOM props
  // ──────────────────────────────────────────

  describe('getCheckboxProps', () => {
    it('varsayılan attribute döner / returns default attributes', () => {
      const cb = createCheckbox();
      const props = cb.getCheckboxProps();

      expect(props.role).toBe('checkbox');
      expect(props.tabIndex).toBe(0);
      expect(props['aria-checked']).toBe(false);
      expect(props['aria-disabled']).toBeUndefined();
      expect(props['aria-invalid']).toBeUndefined();
      expect(props['aria-required']).toBeUndefined();
      expect(props['aria-readonly']).toBeUndefined();
      expect(props['data-state']).toBe('unchecked');
      expect(props['data-disabled']).toBeUndefined();
      expect(props['data-readonly']).toBeUndefined();
      expect(props['data-invalid']).toBeUndefined();
      expect(props['data-focus']).toBeUndefined();
      expect(props['data-hover']).toBeUndefined();
      expect(props['data-active']).toBeUndefined();
    });

    it('checked durumda doğru attribute döner', () => {
      const cb = createCheckbox({ checked: true });
      const props = cb.getCheckboxProps();

      expect(props['aria-checked']).toBe(true);
      expect(props['data-state']).toBe('checked');
    });

    it('indeterminate durumda doğru attribute döner', () => {
      const cb = createCheckbox({ checked: 'indeterminate' });
      const props = cb.getCheckboxProps();

      expect(props['aria-checked']).toBe('mixed');
      expect(props['data-state']).toBe('indeterminate');
    });

    it('disabled durumda doğru attribute döner', () => {
      const cb = createCheckbox({ disabled: true });
      const props = cb.getCheckboxProps();

      expect(props['aria-disabled']).toBe(true);
      expect(props['data-disabled']).toBe('');
    });

    it('readOnly durumda doğru attribute döner', () => {
      const cb = createCheckbox({ readOnly: true });
      const props = cb.getCheckboxProps();

      expect(props['aria-readonly']).toBe(true);
      expect(props['data-readonly']).toBe('');
    });

    it('invalid durumda doğru attribute döner', () => {
      const cb = createCheckbox({ invalid: true });
      const props = cb.getCheckboxProps();

      expect(props['aria-invalid']).toBe(true);
      expect(props['data-invalid']).toBe('');
    });

    it('required durumda doğru attribute döner', () => {
      const cb = createCheckbox({ required: true });
      const props = cb.getCheckboxProps();

      expect(props['aria-required']).toBe(true);
    });

    it('hover durumda data-hover set edilir', () => {
      const cb = createCheckbox();
      cb.send({ type: 'POINTER_ENTER' });

      expect(cb.getCheckboxProps()['data-hover']).toBe('');
    });

    it('focused durumda data-focus set edilir', () => {
      const cb = createCheckbox();
      cb.send({ type: 'FOCUS' });

      expect(cb.getCheckboxProps()['data-focus']).toBe('');
    });

    it('active durumda data-active set edilir', () => {
      const cb = createCheckbox();
      cb.send({ type: 'POINTER_ENTER' });
      cb.send({ type: 'POINTER_DOWN' });

      expect(cb.getCheckboxProps()['data-active']).toBe('');
    });
  });

  // ──────────────────────────────────────────
  // Toggle
  // ──────────────────────────────────────────

  describe('toggle', () => {
    it('unchecked → checked', () => {
      const cb = createCheckbox();
      cb.send({ type: 'TOGGLE' });

      expect(cb.getContext().checked).toBe(true);
    });

    it('checked → unchecked', () => {
      const cb = createCheckbox({ checked: true });
      cb.send({ type: 'TOGGLE' });

      expect(cb.getContext().checked).toBe(false);
    });

    it('indeterminate → checked', () => {
      const cb = createCheckbox({ checked: 'indeterminate' });
      cb.send({ type: 'TOGGLE' });

      expect(cb.getContext().checked).toBe(true);
    });

    it('çoklu toggle döngüsü / multiple toggle cycle', () => {
      const cb = createCheckbox();

      cb.send({ type: 'TOGGLE' });
      expect(cb.getContext().checked).toBe(true);

      cb.send({ type: 'TOGGLE' });
      expect(cb.getContext().checked).toBe(false);

      cb.send({ type: 'TOGGLE' });
      expect(cb.getContext().checked).toBe(true);
    });
  });

  // ──────────────────────────────────────────
  // State transitions — pointer
  // ──────────────────────────────────────────

  describe('state transitions — pointer', () => {
    it('idle → hover (POINTER_ENTER)', () => {
      const cb = createCheckbox();
      cb.send({ type: 'POINTER_ENTER' });

      expect(cb.getContext().interactionState).toBe('hover');
    });

    it('hover → idle (POINTER_LEAVE)', () => {
      const cb = createCheckbox();
      cb.send({ type: 'POINTER_ENTER' });
      cb.send({ type: 'POINTER_LEAVE' });

      expect(cb.getContext().interactionState).toBe('idle');
    });

    it('hover → active (POINTER_DOWN)', () => {
      const cb = createCheckbox();
      cb.send({ type: 'POINTER_ENTER' });
      cb.send({ type: 'POINTER_DOWN' });

      expect(cb.getContext().interactionState).toBe('active');
    });

    it('active → hover (POINTER_UP)', () => {
      const cb = createCheckbox();
      cb.send({ type: 'POINTER_ENTER' });
      cb.send({ type: 'POINTER_DOWN' });
      cb.send({ type: 'POINTER_UP' });

      expect(cb.getContext().interactionState).toBe('hover');
    });

    it('active → idle (POINTER_LEAVE)', () => {
      const cb = createCheckbox();
      cb.send({ type: 'POINTER_ENTER' });
      cb.send({ type: 'POINTER_DOWN' });
      cb.send({ type: 'POINTER_LEAVE' });

      expect(cb.getContext().interactionState).toBe('idle');
    });

    it('focused → hover (POINTER_ENTER)', () => {
      const cb = createCheckbox();
      cb.send({ type: 'FOCUS' });
      cb.send({ type: 'POINTER_ENTER' });

      expect(cb.getContext().interactionState).toBe('hover');
    });
  });

  // ──────────────────────────────────────────
  // State transitions — focus
  // ──────────────────────────────────────────

  describe('state transitions — focus', () => {
    it('idle → focused (FOCUS)', () => {
      const cb = createCheckbox();
      cb.send({ type: 'FOCUS' });

      expect(cb.getContext().interactionState).toBe('focused');
    });

    it('focused → idle (BLUR)', () => {
      const cb = createCheckbox();
      cb.send({ type: 'FOCUS' });
      cb.send({ type: 'BLUR' });

      expect(cb.getContext().interactionState).toBe('idle');
    });

    it('hover durumda FOCUS state değiştirmez', () => {
      const cb = createCheckbox();
      cb.send({ type: 'POINTER_ENTER' });
      cb.send({ type: 'FOCUS' });

      expect(cb.getContext().interactionState).toBe('hover');
    });
  });

  // ──────────────────────────────────────────
  // Disabled — etkileşim engelleme
  // ──────────────────────────────────────────

  describe('disabled — interaction blocking', () => {
    it('disabled durumda pointer event yoksayılır', () => {
      const cb = createCheckbox({ disabled: true });
      cb.send({ type: 'POINTER_ENTER' });

      expect(cb.getContext().interactionState).toBe('idle');
    });

    it('disabled durumda focus event yoksayılır', () => {
      const cb = createCheckbox({ disabled: true });
      cb.send({ type: 'FOCUS' });

      expect(cb.getContext().interactionState).toBe('idle');
    });

    it('disabled durumda TOGGLE yoksayılır', () => {
      const cb = createCheckbox({ disabled: true });
      cb.send({ type: 'TOGGLE' });

      expect(cb.getContext().checked).toBe(false);
    });

    it('SET_DISABLED ile runtime disable', () => {
      const cb = createCheckbox();
      cb.send({ type: 'POINTER_ENTER' });
      expect(cb.getContext().interactionState).toBe('hover');

      cb.send({ type: 'SET_DISABLED', value: true });
      expect(cb.getContext().interactionState).toBe('idle');
      expect(cb.getContext().disabled).toBe(true);
    });

    it('SET_DISABLED false ile tekrar aktif', () => {
      const cb = createCheckbox({ disabled: true });
      cb.send({ type: 'SET_DISABLED', value: false });

      expect(cb.getContext().disabled).toBe(false);
      cb.send({ type: 'POINTER_ENTER' });
      expect(cb.getContext().interactionState).toBe('hover');
    });

    it('isInteractionBlocked doğru döner', () => {
      const cb = createCheckbox({ disabled: true });
      expect(cb.isInteractionBlocked()).toBe(true);

      const cb2 = createCheckbox();
      expect(cb2.isInteractionBlocked()).toBe(false);
    });
  });

  // ──────────────────────────────────────────
  // ReadOnly — toggle engellenir ama etkileşim çalışır
  // ──────────────────────────────────────────

  describe('readOnly — toggle blocked, interaction works', () => {
    it('readOnly durumda hover çalışır', () => {
      const cb = createCheckbox({ readOnly: true });
      cb.send({ type: 'POINTER_ENTER' });

      expect(cb.getContext().interactionState).toBe('hover');
    });

    it('readOnly durumda focus çalışır', () => {
      const cb = createCheckbox({ readOnly: true });
      cb.send({ type: 'FOCUS' });

      expect(cb.getContext().interactionState).toBe('focused');
    });

    it('readOnly durumda TOGGLE yoksayılır', () => {
      const cb = createCheckbox({ readOnly: true, checked: true });
      cb.send({ type: 'TOGGLE' });

      expect(cb.getContext().checked).toBe(true);
    });

    it('readOnly isInteractionBlocked false döner', () => {
      const cb = createCheckbox({ readOnly: true });
      expect(cb.isInteractionBlocked()).toBe(false);
    });
  });

  // ──────────────────────────────────────────
  // SET_CHECKED — controlled mode
  // ──────────────────────────────────────────

  describe('SET_CHECKED — controlled mode', () => {
    it('SET_CHECKED ile checked set edilir', () => {
      const cb = createCheckbox();
      cb.send({ type: 'SET_CHECKED', value: true });

      expect(cb.getContext().checked).toBe(true);
    });

    it('SET_CHECKED ile indeterminate set edilir', () => {
      const cb = createCheckbox();
      cb.send({ type: 'SET_CHECKED', value: 'indeterminate' });

      expect(cb.getContext().checked).toBe('indeterminate');
    });

    it('SET_CHECKED false ile temizle', () => {
      const cb = createCheckbox({ checked: true });
      cb.send({ type: 'SET_CHECKED', value: false });

      expect(cb.getContext().checked).toBe(false);
    });
  });

  // ──────────────────────────────────────────
  // Invalid — runtime toggle
  // ──────────────────────────────────────────

  describe('invalid — runtime toggle', () => {
    it('SET_INVALID ile runtime invalid', () => {
      const cb = createCheckbox();
      cb.send({ type: 'SET_INVALID', value: true });

      expect(cb.getContext().invalid).toBe(true);
      expect(cb.getCheckboxProps()['aria-invalid']).toBe(true);
      expect(cb.getCheckboxProps()['data-invalid']).toBe('');
    });

    it('SET_INVALID false ile temizle', () => {
      const cb = createCheckbox({ invalid: true });
      cb.send({ type: 'SET_INVALID', value: false });

      expect(cb.getContext().invalid).toBe(false);
      expect(cb.getCheckboxProps()['aria-invalid']).toBeUndefined();
    });
  });

  // ──────────────────────────────────────────
  // Referans eşitliği — gereksiz re-render önleme
  // ──────────────────────────────────────────

  describe('reference equality — unnecessary re-render prevention', () => {
    it('aynı değerle SET_DISABLED aynı referansı döner', () => {
      const cb = createCheckbox({ disabled: true });
      const ctxBefore = cb.getContext();
      const ctxAfter = cb.send({ type: 'SET_DISABLED', value: true });

      expect(ctxAfter).toBe(ctxBefore);
    });

    it('aynı değerle SET_CHECKED aynı referansı döner', () => {
      const cb = createCheckbox({ checked: true });
      const ctxBefore = cb.getContext();
      const ctxAfter = cb.send({ type: 'SET_CHECKED', value: true });

      expect(ctxAfter).toBe(ctxBefore);
    });

    it('aynı değerle SET_INVALID aynı referansı döner', () => {
      const cb = createCheckbox({ invalid: false });
      const ctxBefore = cb.getContext();
      const ctxAfter = cb.send({ type: 'SET_INVALID', value: false });

      expect(ctxAfter).toBe(ctxBefore);
    });

    it('farklı değerle SET_DISABLED yeni referans döner', () => {
      const cb = createCheckbox({ disabled: false });
      const ctxBefore = cb.getContext();
      const ctxAfter = cb.send({ type: 'SET_DISABLED', value: true });

      expect(ctxAfter).not.toBe(ctxBefore);
    });

    it('TOGGLE yeni referans döner', () => {
      const cb = createCheckbox();
      const ctxBefore = cb.getContext();
      const ctxAfter = cb.send({ type: 'TOGGLE' });

      expect(ctxAfter).not.toBe(ctxBefore);
    });

    it('durum değişmezse aynı referans döner (idle → POINTER_LEAVE)', () => {
      const cb = createCheckbox();
      const ctxBefore = cb.getContext();
      const ctxAfter = cb.send({ type: 'POINTER_LEAVE' });

      expect(ctxAfter).toBe(ctxBefore);
    });

    it('readOnly durumda TOGGLE aynı referansı döner', () => {
      const cb = createCheckbox({ readOnly: true });
      const ctxBefore = cb.getContext();
      const ctxAfter = cb.send({ type: 'TOGGLE' });

      expect(ctxAfter).toBe(ctxBefore);
    });
  });
});
