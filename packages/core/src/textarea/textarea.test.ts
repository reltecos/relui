/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createTextarea } from './textarea.machine';

describe('createTextarea', () => {
  // ──────────────────────────────────────────
  // Varsayılan değerler / Default values
  // ──────────────────────────────────────────

  it('varsayılan context döner / returns default context', () => {
    const textarea = createTextarea();
    const ctx = textarea.getContext();

    expect(ctx.interactionState).toBe('idle');
    expect(ctx.disabled).toBe(false);
    expect(ctx.readOnly).toBe(false);
    expect(ctx.invalid).toBe(false);
    expect(ctx.required).toBe(false);
    expect(ctx.resize).toBe('vertical');
    expect(ctx.autoResize).toBe(false);
    expect(ctx.rows).toBe(3);
  });

  it('props ile context oluşturur / creates context from props', () => {
    const textarea = createTextarea({
      disabled: true,
      readOnly: false,
      invalid: true,
      required: true,
      resize: 'both',
      autoResize: true,
      rows: 5,
    });
    const ctx = textarea.getContext();

    expect(ctx.disabled).toBe(true);
    expect(ctx.invalid).toBe(true);
    expect(ctx.required).toBe(true);
    expect(ctx.resize).toBe('both');
    expect(ctx.autoResize).toBe(true);
    expect(ctx.rows).toBe(5);
  });

  // ──────────────────────────────────────────
  // DOM props
  // ──────────────────────────────────────────

  describe('getTextareaProps', () => {
    it('varsayılan attribute döner / returns default attributes', () => {
      const textarea = createTextarea();
      const props = textarea.getTextareaProps();

      expect(props.disabled).toBeUndefined();
      expect(props.readOnly).toBeUndefined();
      expect(props.required).toBeUndefined();
      expect(props.rows).toBe(3);
      expect(props['aria-invalid']).toBeUndefined();
      expect(props['aria-required']).toBeUndefined();
      expect(props['aria-readonly']).toBeUndefined();
      expect(props['data-state']).toBe('idle');
      expect(props['data-disabled']).toBeUndefined();
      expect(props['data-readonly']).toBeUndefined();
      expect(props['data-invalid']).toBeUndefined();
    });

    it('rows doğru döner / returns correct rows', () => {
      const textarea = createTextarea({ rows: 10 });
      expect(textarea.getTextareaProps().rows).toBe(10);
    });

    it('disabled durumda doğru attribute döner / returns correct attrs when disabled', () => {
      const textarea = createTextarea({ disabled: true });
      const props = textarea.getTextareaProps();

      expect(props.disabled).toBe(true);
      expect(props['data-disabled']).toBe('');
    });

    it('readOnly durumda doğru attribute döner / returns correct attrs when readOnly', () => {
      const textarea = createTextarea({ readOnly: true });
      const props = textarea.getTextareaProps();

      expect(props.readOnly).toBe(true);
      expect(props['aria-readonly']).toBe(true);
      expect(props['data-readonly']).toBe('');
    });

    it('invalid durumda doğru attribute döner / returns correct attrs when invalid', () => {
      const textarea = createTextarea({ invalid: true });
      const props = textarea.getTextareaProps();

      expect(props['aria-invalid']).toBe(true);
      expect(props['data-invalid']).toBe('');
    });

    it('required durumda doğru attribute döner / returns correct attrs when required', () => {
      const textarea = createTextarea({ required: true });
      const props = textarea.getTextareaProps();

      expect(props.required).toBe(true);
      expect(props['aria-required']).toBe(true);
    });
  });

  // ──────────────────────────────────────────
  // State transitions — pointer
  // ──────────────────────────────────────────

  describe('state transitions — pointer', () => {
    it('idle → hover (POINTER_ENTER)', () => {
      const textarea = createTextarea();
      textarea.send({ type: 'POINTER_ENTER' });

      expect(textarea.getContext().interactionState).toBe('hover');
    });

    it('hover → idle (POINTER_LEAVE)', () => {
      const textarea = createTextarea();
      textarea.send({ type: 'POINTER_ENTER' });
      textarea.send({ type: 'POINTER_LEAVE' });

      expect(textarea.getContext().interactionState).toBe('idle');
    });

    it('data-state güncellenir / data-state updates', () => {
      const textarea = createTextarea();

      expect(textarea.getTextareaProps()['data-state']).toBe('idle');

      textarea.send({ type: 'POINTER_ENTER' });
      expect(textarea.getTextareaProps()['data-state']).toBe('hover');
    });
  });

  // ──────────────────────────────────────────
  // State transitions — focus
  // ──────────────────────────────────────────

  describe('state transitions — focus', () => {
    it('idle → focused (FOCUS)', () => {
      const textarea = createTextarea();
      textarea.send({ type: 'FOCUS' });

      expect(textarea.getContext().interactionState).toBe('focused');
    });

    it('hover → focused (FOCUS)', () => {
      const textarea = createTextarea();
      textarea.send({ type: 'POINTER_ENTER' });
      textarea.send({ type: 'FOCUS' });

      expect(textarea.getContext().interactionState).toBe('focused');
    });

    it('focused → idle (BLUR)', () => {
      const textarea = createTextarea();
      textarea.send({ type: 'FOCUS' });
      textarea.send({ type: 'BLUR' });

      expect(textarea.getContext().interactionState).toBe('idle');
    });

    it('focused durumda POINTER_LEAVE state değiştirmez', () => {
      const textarea = createTextarea();
      textarea.send({ type: 'FOCUS' });
      textarea.send({ type: 'POINTER_LEAVE' });

      expect(textarea.getContext().interactionState).toBe('focused');
    });

    it('focused durumda POINTER_ENTER state değiştirmez', () => {
      const textarea = createTextarea();
      textarea.send({ type: 'FOCUS' });
      textarea.send({ type: 'POINTER_ENTER' });

      expect(textarea.getContext().interactionState).toBe('focused');
    });
  });

  // ──────────────────────────────────────────
  // Disabled — etkileşim engelleme
  // ──────────────────────────────────────────

  describe('disabled — interaction blocking', () => {
    it('disabled durumda pointer event yoksayılır', () => {
      const textarea = createTextarea({ disabled: true });
      textarea.send({ type: 'POINTER_ENTER' });

      expect(textarea.getContext().interactionState).toBe('idle');
    });

    it('disabled durumda focus event yoksayılır', () => {
      const textarea = createTextarea({ disabled: true });
      textarea.send({ type: 'FOCUS' });

      expect(textarea.getContext().interactionState).toBe('idle');
    });

    it('SET_DISABLED ile runtime disable', () => {
      const textarea = createTextarea();
      textarea.send({ type: 'POINTER_ENTER' });
      expect(textarea.getContext().interactionState).toBe('hover');

      textarea.send({ type: 'SET_DISABLED', value: true });
      expect(textarea.getContext().interactionState).toBe('idle');
      expect(textarea.getContext().disabled).toBe(true);
    });

    it('SET_DISABLED false ile tekrar aktif', () => {
      const textarea = createTextarea({ disabled: true });
      textarea.send({ type: 'SET_DISABLED', value: false });

      expect(textarea.getContext().disabled).toBe(false);
      textarea.send({ type: 'POINTER_ENTER' });
      expect(textarea.getContext().interactionState).toBe('hover');
    });

    it('isInteractionBlocked doğru döner / returns correctly', () => {
      const textarea = createTextarea({ disabled: true });
      expect(textarea.isInteractionBlocked()).toBe(true);

      const textarea2 = createTextarea();
      expect(textarea2.isInteractionBlocked()).toBe(false);
    });
  });

  // ──────────────────────────────────────────
  // ReadOnly — etkileşim engellenmez
  // ──────────────────────────────────────────

  describe('readOnly — interaction NOT blocked', () => {
    it('readOnly durumda hover çalışır', () => {
      const textarea = createTextarea({ readOnly: true });
      textarea.send({ type: 'POINTER_ENTER' });

      expect(textarea.getContext().interactionState).toBe('hover');
    });

    it('readOnly durumda focus çalışır', () => {
      const textarea = createTextarea({ readOnly: true });
      textarea.send({ type: 'FOCUS' });

      expect(textarea.getContext().interactionState).toBe('focused');
    });

    it('readOnly isInteractionBlocked false döner', () => {
      const textarea = createTextarea({ readOnly: true });
      expect(textarea.isInteractionBlocked()).toBe(false);
    });

    it('SET_READ_ONLY ile runtime toggle', () => {
      const textarea = createTextarea();
      textarea.send({ type: 'SET_READ_ONLY', value: true });

      expect(textarea.getContext().readOnly).toBe(true);
    });
  });

  // ──────────────────────────────────────────
  // Invalid — runtime toggle
  // ──────────────────────────────────────────

  describe('invalid — runtime toggle', () => {
    it('SET_INVALID ile runtime invalid', () => {
      const textarea = createTextarea();
      textarea.send({ type: 'SET_INVALID', value: true });

      expect(textarea.getContext().invalid).toBe(true);
      expect(textarea.getTextareaProps()['aria-invalid']).toBe(true);
      expect(textarea.getTextareaProps()['data-invalid']).toBe('');
    });

    it('SET_INVALID false ile temizle', () => {
      const textarea = createTextarea({ invalid: true });
      textarea.send({ type: 'SET_INVALID', value: false });

      expect(textarea.getContext().invalid).toBe(false);
      expect(textarea.getTextareaProps()['aria-invalid']).toBeUndefined();
    });
  });

  // ──────────────────────────────────────────
  // Resize / AutoResize
  // ──────────────────────────────────────────

  describe('resize / autoResize', () => {
    it('varsayılan resize vertical / default resize is vertical', () => {
      const textarea = createTextarea();
      expect(textarea.getContext().resize).toBe('vertical');
    });

    it('resize none doğru set edilir', () => {
      const textarea = createTextarea({ resize: 'none' });
      expect(textarea.getContext().resize).toBe('none');
    });

    it('resize both doğru set edilir', () => {
      const textarea = createTextarea({ resize: 'both' });
      expect(textarea.getContext().resize).toBe('both');
    });

    it('resize horizontal doğru set edilir', () => {
      const textarea = createTextarea({ resize: 'horizontal' });
      expect(textarea.getContext().resize).toBe('horizontal');
    });

    it('autoResize varsayılan false', () => {
      const textarea = createTextarea();
      expect(textarea.getContext().autoResize).toBe(false);
    });

    it('autoResize true doğru set edilir', () => {
      const textarea = createTextarea({ autoResize: true });
      expect(textarea.getContext().autoResize).toBe(true);
    });
  });

  // ──────────────────────────────────────────
  // Referans eşitliği — gereksiz re-render önleme
  // ──────────────────────────────────────────

  describe('reference equality — unnecessary re-render prevention', () => {
    it('aynı değerle SET_DISABLED aynı referansı döner', () => {
      const textarea = createTextarea({ disabled: true });
      const ctxBefore = textarea.getContext();
      const ctxAfter = textarea.send({ type: 'SET_DISABLED', value: true });

      expect(ctxAfter).toBe(ctxBefore);
    });

    it('aynı değerle SET_READ_ONLY aynı referansı döner', () => {
      const textarea = createTextarea({ readOnly: false });
      const ctxBefore = textarea.getContext();
      const ctxAfter = textarea.send({ type: 'SET_READ_ONLY', value: false });

      expect(ctxAfter).toBe(ctxBefore);
    });

    it('aynı değerle SET_INVALID aynı referansı döner', () => {
      const textarea = createTextarea({ invalid: false });
      const ctxBefore = textarea.getContext();
      const ctxAfter = textarea.send({ type: 'SET_INVALID', value: false });

      expect(ctxAfter).toBe(ctxBefore);
    });

    it('farklı değerle SET_DISABLED yeni referans döner', () => {
      const textarea = createTextarea({ disabled: false });
      const ctxBefore = textarea.getContext();
      const ctxAfter = textarea.send({ type: 'SET_DISABLED', value: true });

      expect(ctxAfter).not.toBe(ctxBefore);
    });

    it('durum değişmezse aynı referans döner (idle → POINTER_LEAVE)', () => {
      const textarea = createTextarea();
      const ctxBefore = textarea.getContext();
      const ctxAfter = textarea.send({ type: 'POINTER_LEAVE' });

      expect(ctxAfter).toBe(ctxBefore);
    });

    it('durum değişirse yeni referans döner (idle → hover)', () => {
      const textarea = createTextarea();
      const ctxBefore = textarea.getContext();
      const ctxAfter = textarea.send({ type: 'POINTER_ENTER' });

      expect(ctxAfter).not.toBe(ctxBefore);
    });
  });
});
