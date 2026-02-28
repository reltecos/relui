/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createInput } from './input.machine';

describe('createInput', () => {
  // ──────────────────────────────────────────
  // Varsayılan değerler / Default values
  // ──────────────────────────────────────────

  it('varsayılan context döner / returns default context', () => {
    const input = createInput();
    const ctx = input.getContext();

    expect(ctx.interactionState).toBe('idle');
    expect(ctx.disabled).toBe(false);
    expect(ctx.readOnly).toBe(false);
    expect(ctx.invalid).toBe(false);
    expect(ctx.required).toBe(false);
    expect(ctx.type).toBe('text');
  });

  it('props ile context oluşturur / creates context from props', () => {
    const input = createInput({
      disabled: true,
      readOnly: false,
      invalid: true,
      required: true,
      type: 'email',
    });
    const ctx = input.getContext();

    expect(ctx.disabled).toBe(true);
    expect(ctx.invalid).toBe(true);
    expect(ctx.required).toBe(true);
    expect(ctx.type).toBe('email');
  });

  // ──────────────────────────────────────────
  // DOM props
  // ──────────────────────────────────────────

  describe('getInputProps', () => {
    it('varsayılan attribute döner / returns default attributes', () => {
      const input = createInput();
      const props = input.getInputProps();

      expect(props.type).toBe('text');
      expect(props.disabled).toBeUndefined();
      expect(props.readOnly).toBeUndefined();
      expect(props.required).toBeUndefined();
      expect(props['aria-invalid']).toBeUndefined();
      expect(props['aria-required']).toBeUndefined();
      expect(props['aria-readonly']).toBeUndefined();
      expect(props['data-state']).toBe('idle');
      expect(props['data-disabled']).toBeUndefined();
      expect(props['data-readonly']).toBeUndefined();
      expect(props['data-invalid']).toBeUndefined();
    });

    it('email type doğru döner / returns correct email type', () => {
      const input = createInput({ type: 'email' });
      expect(input.getInputProps().type).toBe('email');
    });

    it('password type doğru döner / returns correct password type', () => {
      const input = createInput({ type: 'password' });
      expect(input.getInputProps().type).toBe('password');
    });

    it('disabled durumda doğru attribute döner / returns correct attrs when disabled', () => {
      const input = createInput({ disabled: true });
      const props = input.getInputProps();

      expect(props.disabled).toBe(true);
      expect(props['data-disabled']).toBe('');
    });

    it('readOnly durumda doğru attribute döner / returns correct attrs when readOnly', () => {
      const input = createInput({ readOnly: true });
      const props = input.getInputProps();

      expect(props.readOnly).toBe(true);
      expect(props['aria-readonly']).toBe(true);
      expect(props['data-readonly']).toBe('');
    });

    it('invalid durumda doğru attribute döner / returns correct attrs when invalid', () => {
      const input = createInput({ invalid: true });
      const props = input.getInputProps();

      expect(props['aria-invalid']).toBe(true);
      expect(props['data-invalid']).toBe('');
    });

    it('required durumda doğru attribute döner / returns correct attrs when required', () => {
      const input = createInput({ required: true });
      const props = input.getInputProps();

      expect(props.required).toBe(true);
      expect(props['aria-required']).toBe(true);
    });
  });

  // ──────────────────────────────────────────
  // State transitions — pointer
  // ──────────────────────────────────────────

  describe('state transitions — pointer', () => {
    it('idle → hover (POINTER_ENTER)', () => {
      const input = createInput();
      input.send({ type: 'POINTER_ENTER' });

      expect(input.getContext().interactionState).toBe('hover');
    });

    it('hover → idle (POINTER_LEAVE)', () => {
      const input = createInput();
      input.send({ type: 'POINTER_ENTER' });
      input.send({ type: 'POINTER_LEAVE' });

      expect(input.getContext().interactionState).toBe('idle');
    });

    it('data-state güncellenir / data-state updates', () => {
      const input = createInput();

      expect(input.getInputProps()['data-state']).toBe('idle');

      input.send({ type: 'POINTER_ENTER' });
      expect(input.getInputProps()['data-state']).toBe('hover');
    });
  });

  // ──────────────────────────────────────────
  // State transitions — focus
  // ──────────────────────────────────────────

  describe('state transitions — focus', () => {
    it('idle → focused (FOCUS)', () => {
      const input = createInput();
      input.send({ type: 'FOCUS' });

      expect(input.getContext().interactionState).toBe('focused');
    });

    it('hover → focused (FOCUS)', () => {
      const input = createInput();
      input.send({ type: 'POINTER_ENTER' });
      input.send({ type: 'FOCUS' });

      expect(input.getContext().interactionState).toBe('focused');
    });

    it('focused → idle (BLUR)', () => {
      const input = createInput();
      input.send({ type: 'FOCUS' });
      input.send({ type: 'BLUR' });

      expect(input.getContext().interactionState).toBe('idle');
    });

    it('focused durumda POINTER_LEAVE state değiştirmez', () => {
      const input = createInput();
      input.send({ type: 'FOCUS' });
      input.send({ type: 'POINTER_LEAVE' });

      expect(input.getContext().interactionState).toBe('focused');
    });

    it('focused durumda POINTER_ENTER state değiştirmez', () => {
      const input = createInput();
      input.send({ type: 'FOCUS' });
      input.send({ type: 'POINTER_ENTER' });

      expect(input.getContext().interactionState).toBe('focused');
    });
  });

  // ──────────────────────────────────────────
  // Disabled — etkileşim engelleme
  // ──────────────────────────────────────────

  describe('disabled — interaction blocking', () => {
    it('disabled durumda pointer event yoksayılır', () => {
      const input = createInput({ disabled: true });
      input.send({ type: 'POINTER_ENTER' });

      expect(input.getContext().interactionState).toBe('idle');
    });

    it('disabled durumda focus event yoksayılır', () => {
      const input = createInput({ disabled: true });
      input.send({ type: 'FOCUS' });

      expect(input.getContext().interactionState).toBe('idle');
    });

    it('SET_DISABLED ile runtime disable', () => {
      const input = createInput();
      input.send({ type: 'POINTER_ENTER' });
      expect(input.getContext().interactionState).toBe('hover');

      input.send({ type: 'SET_DISABLED', value: true });
      expect(input.getContext().interactionState).toBe('idle');
      expect(input.getContext().disabled).toBe(true);
    });

    it('SET_DISABLED false ile tekrar aktif', () => {
      const input = createInput({ disabled: true });
      input.send({ type: 'SET_DISABLED', value: false });

      expect(input.getContext().disabled).toBe(false);
      input.send({ type: 'POINTER_ENTER' });
      expect(input.getContext().interactionState).toBe('hover');
    });

    it('isInteractionBlocked doğru döner / returns correctly', () => {
      const input = createInput({ disabled: true });
      expect(input.isInteractionBlocked()).toBe(true);

      const input2 = createInput();
      expect(input2.isInteractionBlocked()).toBe(false);
    });
  });

  // ──────────────────────────────────────────
  // ReadOnly — etkileşim engellenmez
  // ──────────────────────────────────────────

  describe('readOnly — interaction NOT blocked', () => {
    it('readOnly durumda hover çalışır', () => {
      const input = createInput({ readOnly: true });
      input.send({ type: 'POINTER_ENTER' });

      expect(input.getContext().interactionState).toBe('hover');
    });

    it('readOnly durumda focus çalışır', () => {
      const input = createInput({ readOnly: true });
      input.send({ type: 'FOCUS' });

      expect(input.getContext().interactionState).toBe('focused');
    });

    it('readOnly isInteractionBlocked false döner', () => {
      const input = createInput({ readOnly: true });
      expect(input.isInteractionBlocked()).toBe(false);
    });

    it('SET_READ_ONLY ile runtime toggle', () => {
      const input = createInput();
      input.send({ type: 'SET_READ_ONLY', value: true });

      expect(input.getContext().readOnly).toBe(true);
    });
  });

  // ──────────────────────────────────────────
  // Invalid — runtime toggle
  // ──────────────────────────────────────────

  describe('invalid — runtime toggle', () => {
    it('SET_INVALID ile runtime invalid', () => {
      const input = createInput();
      input.send({ type: 'SET_INVALID', value: true });

      expect(input.getContext().invalid).toBe(true);
      expect(input.getInputProps()['aria-invalid']).toBe(true);
      expect(input.getInputProps()['data-invalid']).toBe('');
    });

    it('SET_INVALID false ile temizle', () => {
      const input = createInput({ invalid: true });
      input.send({ type: 'SET_INVALID', value: false });

      expect(input.getContext().invalid).toBe(false);
      expect(input.getInputProps()['aria-invalid']).toBeUndefined();
    });
  });

  // ──────────────────────────────────────────
  // Referans eşitliği — gereksiz re-render önleme
  // ──────────────────────────────────────────

  describe('reference equality — unnecessary re-render prevention', () => {
    it('aynı değerle SET_DISABLED aynı referansı döner', () => {
      const input = createInput({ disabled: true });
      const ctxBefore = input.getContext();
      const ctxAfter = input.send({ type: 'SET_DISABLED', value: true });

      expect(ctxAfter).toBe(ctxBefore);
    });

    it('aynı değerle SET_READ_ONLY aynı referansı döner', () => {
      const input = createInput({ readOnly: false });
      const ctxBefore = input.getContext();
      const ctxAfter = input.send({ type: 'SET_READ_ONLY', value: false });

      expect(ctxAfter).toBe(ctxBefore);
    });

    it('aynı değerle SET_INVALID aynı referansı döner', () => {
      const input = createInput({ invalid: false });
      const ctxBefore = input.getContext();
      const ctxAfter = input.send({ type: 'SET_INVALID', value: false });

      expect(ctxAfter).toBe(ctxBefore);
    });

    it('farklı değerle SET_DISABLED yeni referans döner', () => {
      const input = createInput({ disabled: false });
      const ctxBefore = input.getContext();
      const ctxAfter = input.send({ type: 'SET_DISABLED', value: true });

      expect(ctxAfter).not.toBe(ctxBefore);
    });

    it('durum değişmezse aynı referans döner (idle → POINTER_LEAVE)', () => {
      const input = createInput();
      const ctxBefore = input.getContext();
      const ctxAfter = input.send({ type: 'POINTER_LEAVE' });

      expect(ctxAfter).toBe(ctxBefore);
    });

    it('durum değişirse yeni referans döner (idle → hover)', () => {
      const input = createInput();
      const ctxBefore = input.getContext();
      const ctxAfter = input.send({ type: 'POINTER_ENTER' });

      expect(ctxAfter).not.toBe(ctxBefore);
    });
  });
});
