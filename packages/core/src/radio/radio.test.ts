/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createRadio } from './radio.machine';

describe('createRadio', () => {
  // ──────────────────────────────────────────
  // Varsayılan değerler / Default values
  // ──────────────────────────────────────────

  it('varsayılan context döner / returns default context', () => {
    const radio = createRadio();
    const ctx = radio.getContext();

    expect(ctx.interactionState).toBe('idle');
    expect(ctx.checked).toBe(false);
    expect(ctx.disabled).toBe(false);
    expect(ctx.readOnly).toBe(false);
    expect(ctx.invalid).toBe(false);
    expect(ctx.required).toBe(false);
  });

  it('props ile context oluşturur / creates context from props', () => {
    const radio = createRadio({
      checked: true,
      disabled: true,
      invalid: true,
      required: true,
    });
    const ctx = radio.getContext();

    expect(ctx.checked).toBe(true);
    expect(ctx.disabled).toBe(true);
    expect(ctx.invalid).toBe(true);
    expect(ctx.required).toBe(true);
  });

  // ──────────────────────────────────────────
  // DOM props
  // ──────────────────────────────────────────

  describe('getRadioProps', () => {
    it('varsayılan attribute döner / returns default attributes', () => {
      const radio = createRadio();
      const props = radio.getRadioProps();

      expect(props.role).toBe('radio');
      expect(props.tabIndex).toBe(-1);
      expect(props['aria-checked']).toBe(false);
      expect(props['aria-disabled']).toBeUndefined();
      expect(props['data-state']).toBe('unchecked');
    });

    it('checked durumda doğru attribute döner', () => {
      const radio = createRadio({ checked: true });
      const props = radio.getRadioProps();

      expect(props['aria-checked']).toBe(true);
      expect(props['data-state']).toBe('checked');
      expect(props.tabIndex).toBe(0);
    });

    it('roving tabindex — unchecked -1, checked 0', () => {
      const unchecked = createRadio({ checked: false });
      expect(unchecked.getRadioProps().tabIndex).toBe(-1);

      const checked = createRadio({ checked: true });
      expect(checked.getRadioProps().tabIndex).toBe(0);
    });

    it('disabled durumda doğru attribute döner', () => {
      const radio = createRadio({ disabled: true });
      const props = radio.getRadioProps();

      expect(props['aria-disabled']).toBe(true);
      expect(props['data-disabled']).toBe('');
    });

    it('readOnly durumda doğru attribute döner', () => {
      const radio = createRadio({ readOnly: true });
      const props = radio.getRadioProps();

      expect(props['aria-readonly']).toBe(true);
      expect(props['data-readonly']).toBe('');
    });

    it('invalid durumda doğru attribute döner', () => {
      const radio = createRadio({ invalid: true });
      const props = radio.getRadioProps();

      expect(props['aria-invalid']).toBe(true);
      expect(props['data-invalid']).toBe('');
    });

    it('required durumda doğru attribute döner', () => {
      const radio = createRadio({ required: true });
      const props = radio.getRadioProps();

      expect(props['aria-required']).toBe(true);
    });

    it('hover durumda data-hover set edilir', () => {
      const radio = createRadio();
      radio.send({ type: 'POINTER_ENTER' });

      expect(radio.getRadioProps()['data-hover']).toBe('');
    });

    it('focused durumda data-focus set edilir', () => {
      const radio = createRadio();
      radio.send({ type: 'FOCUS' });

      expect(radio.getRadioProps()['data-focus']).toBe('');
    });
  });

  // ──────────────────────────────────────────
  // SELECT — single select semantiği
  // ──────────────────────────────────────────

  describe('SELECT', () => {
    it('unchecked → checked', () => {
      const radio = createRadio();
      radio.send({ type: 'SELECT' });

      expect(radio.getContext().checked).toBe(true);
    });

    it('checked kalır (toggle yok)', () => {
      const radio = createRadio({ checked: true });
      radio.send({ type: 'SELECT' });

      expect(radio.getContext().checked).toBe(true);
    });

    it('zaten checked ise aynı referans döner', () => {
      const radio = createRadio({ checked: true });
      const ctxBefore = radio.getContext();
      const ctxAfter = radio.send({ type: 'SELECT' });

      expect(ctxAfter).toBe(ctxBefore);
    });
  });

  // ──────────────────────────────────────────
  // State transitions — pointer
  // ──────────────────────────────────────────

  describe('state transitions — pointer', () => {
    it('idle → hover (POINTER_ENTER)', () => {
      const radio = createRadio();
      radio.send({ type: 'POINTER_ENTER' });

      expect(radio.getContext().interactionState).toBe('hover');
    });

    it('hover → idle (POINTER_LEAVE)', () => {
      const radio = createRadio();
      radio.send({ type: 'POINTER_ENTER' });
      radio.send({ type: 'POINTER_LEAVE' });

      expect(radio.getContext().interactionState).toBe('idle');
    });

    it('hover → active (POINTER_DOWN)', () => {
      const radio = createRadio();
      radio.send({ type: 'POINTER_ENTER' });
      radio.send({ type: 'POINTER_DOWN' });

      expect(radio.getContext().interactionState).toBe('active');
    });

    it('active → hover (POINTER_UP)', () => {
      const radio = createRadio();
      radio.send({ type: 'POINTER_ENTER' });
      radio.send({ type: 'POINTER_DOWN' });
      radio.send({ type: 'POINTER_UP' });

      expect(radio.getContext().interactionState).toBe('hover');
    });
  });

  // ──────────────────────────────────────────
  // State transitions — focus
  // ──────────────────────────────────────────

  describe('state transitions — focus', () => {
    it('idle → focused (FOCUS)', () => {
      const radio = createRadio();
      radio.send({ type: 'FOCUS' });

      expect(radio.getContext().interactionState).toBe('focused');
    });

    it('focused → idle (BLUR)', () => {
      const radio = createRadio();
      radio.send({ type: 'FOCUS' });
      radio.send({ type: 'BLUR' });

      expect(radio.getContext().interactionState).toBe('idle');
    });
  });

  // ──────────────────────────────────────────
  // Disabled — etkileşim engelleme
  // ──────────────────────────────────────────

  describe('disabled — interaction blocking', () => {
    it('disabled durumda SELECT yoksayılır', () => {
      const radio = createRadio({ disabled: true });
      radio.send({ type: 'SELECT' });

      expect(radio.getContext().checked).toBe(false);
    });

    it('disabled durumda pointer event yoksayılır', () => {
      const radio = createRadio({ disabled: true });
      radio.send({ type: 'POINTER_ENTER' });

      expect(radio.getContext().interactionState).toBe('idle');
    });

    it('SET_DISABLED ile runtime disable', () => {
      const radio = createRadio();
      radio.send({ type: 'POINTER_ENTER' });
      radio.send({ type: 'SET_DISABLED', value: true });

      expect(radio.getContext().interactionState).toBe('idle');
      expect(radio.getContext().disabled).toBe(true);
    });

    it('isInteractionBlocked doğru döner', () => {
      expect(createRadio({ disabled: true }).isInteractionBlocked()).toBe(true);
      expect(createRadio().isInteractionBlocked()).toBe(false);
    });
  });

  // ──────────────────────────────────────────
  // ReadOnly — SELECT engellenir ama etkileşim çalışır
  // ──────────────────────────────────────────

  describe('readOnly — SELECT blocked, interaction works', () => {
    it('readOnly durumda SELECT yoksayılır', () => {
      const radio = createRadio({ readOnly: true });
      radio.send({ type: 'SELECT' });

      expect(radio.getContext().checked).toBe(false);
    });

    it('readOnly durumda hover çalışır', () => {
      const radio = createRadio({ readOnly: true });
      radio.send({ type: 'POINTER_ENTER' });

      expect(radio.getContext().interactionState).toBe('hover');
    });

    it('readOnly isInteractionBlocked false döner', () => {
      expect(createRadio({ readOnly: true }).isInteractionBlocked()).toBe(false);
    });
  });

  // ──────────────────────────────────────────
  // SET_CHECKED — controlled mode
  // ──────────────────────────────────────────

  describe('SET_CHECKED — controlled mode', () => {
    it('SET_CHECKED ile checked set edilir', () => {
      const radio = createRadio();
      radio.send({ type: 'SET_CHECKED', value: true });

      expect(radio.getContext().checked).toBe(true);
    });

    it('SET_CHECKED false ile deselect', () => {
      const radio = createRadio({ checked: true });
      radio.send({ type: 'SET_CHECKED', value: false });

      expect(radio.getContext().checked).toBe(false);
    });
  });

  // ──────────────────────────────────────────
  // Referans eşitliği
  // ──────────────────────────────────────────

  describe('reference equality', () => {
    it('aynı değerle SET_DISABLED aynı referans', () => {
      const radio = createRadio({ disabled: true });
      const before = radio.getContext();
      expect(radio.send({ type: 'SET_DISABLED', value: true })).toBe(before);
    });

    it('aynı değerle SET_CHECKED aynı referans', () => {
      const radio = createRadio({ checked: true });
      const before = radio.getContext();
      expect(radio.send({ type: 'SET_CHECKED', value: true })).toBe(before);
    });

    it('aynı değerle SET_INVALID aynı referans', () => {
      const radio = createRadio();
      const before = radio.getContext();
      expect(radio.send({ type: 'SET_INVALID', value: false })).toBe(before);
    });

    it('durum değişmezse aynı referans (idle → POINTER_LEAVE)', () => {
      const radio = createRadio();
      const before = radio.getContext();
      expect(radio.send({ type: 'POINTER_LEAVE' })).toBe(before);
    });

    it('readOnly durumda SELECT aynı referans', () => {
      const radio = createRadio({ readOnly: true });
      const before = radio.getContext();
      expect(radio.send({ type: 'SELECT' })).toBe(before);
    });
  });
});
