/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createButton, shouldTriggerClick, shouldTriggerClickOnKeyUp } from './button.machine';

describe('createButton', () => {
  // ──────────────────────────────────────────
  // Varsayılan değerler / Default values
  // ──────────────────────────────────────────

  it('varsayılan context döner / returns default context', () => {
    const button = createButton();
    const ctx = button.getContext();

    expect(ctx.interactionState).toBe('idle');
    expect(ctx.disabled).toBe(false);
    expect(ctx.loading).toBe(false);
    expect(ctx.elementType).toBe('button');
    expect(ctx.type).toBe('button');
  });

  it('props ile context oluşturur / creates context from props', () => {
    const button = createButton({
      disabled: true,
      loading: false,
      elementType: 'a',
      type: 'submit',
    });
    const ctx = button.getContext();

    expect(ctx.disabled).toBe(true);
    expect(ctx.elementType).toBe('a');
    expect(ctx.type).toBe('submit');
  });

  // ──────────────────────────────────────────
  // DOM props — native button
  // ──────────────────────────────────────────

  describe('getButtonProps — native button', () => {
    it('varsayılan attribute döner / returns default attributes', () => {
      const button = createButton();
      const props = button.getButtonProps();

      expect(props.role).toBeUndefined();
      expect(props.type).toBe('button');
      expect(props.tabIndex).toBeUndefined();
      expect(props.disabled).toBeUndefined();
      expect(props['aria-disabled']).toBeUndefined();
      expect(props['aria-busy']).toBeUndefined();
      expect(props['data-state']).toBe('idle');
      expect(props['data-disabled']).toBeUndefined();
      expect(props['data-loading']).toBeUndefined();
    });

    it('submit type doğru döner / returns correct submit type', () => {
      const button = createButton({ type: 'submit' });
      expect(button.getButtonProps().type).toBe('submit');
    });

    it('disabled durumda doğru attribute döner / returns correct attrs when disabled', () => {
      const button = createButton({ disabled: true });
      const props = button.getButtonProps();

      expect(props.disabled).toBe(true);
      expect(props['aria-disabled']).toBe(true);
      expect(props['data-disabled']).toBe('');
    });

    it('loading durumda doğru attribute döner / returns correct attrs when loading', () => {
      const button = createButton({ loading: true });
      const props = button.getButtonProps();

      expect(props.disabled).toBe(true);
      expect(props['aria-disabled']).toBe(true);
      expect(props['aria-busy']).toBe(true);
      expect(props['data-loading']).toBe('');
    });
  });

  // ──────────────────────────────────────────
  // DOM props — non-native element (div, a, span)
  // ──────────────────────────────────────────

  describe('getButtonProps — non-native element', () => {
    it('div için role=button ve tabIndex=0 döner', () => {
      const button = createButton({ elementType: 'div' });
      const props = button.getButtonProps();

      expect(props.role).toBe('button');
      expect(props.tabIndex).toBe(0);
      expect(props.type).toBeUndefined();
    });

    it('a için role=button ve tabIndex=0 döner', () => {
      const button = createButton({ elementType: 'a' });
      const props = button.getButtonProps();

      expect(props.role).toBe('button');
      expect(props.tabIndex).toBe(0);
    });

    it('span için role=button ve tabIndex=0 döner', () => {
      const button = createButton({ elementType: 'span' });
      const props = button.getButtonProps();

      expect(props.role).toBe('button');
      expect(props.tabIndex).toBe(0);
    });

    it('disabled non-native element tabIndex korur (aria-disabled pattern)', () => {
      const button = createButton({ elementType: 'div', disabled: true });
      const props = button.getButtonProps();

      expect(props.tabIndex).toBe(0);
      expect(props.disabled).toBeUndefined(); // native disabled yok
      expect(props['aria-disabled']).toBe(true);
    });
  });

  // ──────────────────────────────────────────
  // State transitions — pointer
  // ──────────────────────────────────────────

  describe('state transitions — pointer', () => {
    it('idle → hover (POINTER_ENTER)', () => {
      const button = createButton();
      button.send({ type: 'POINTER_ENTER' });

      expect(button.getContext().interactionState).toBe('hover');
    });

    it('hover → idle (POINTER_LEAVE)', () => {
      const button = createButton();
      button.send({ type: 'POINTER_ENTER' });
      button.send({ type: 'POINTER_LEAVE' });

      expect(button.getContext().interactionState).toBe('idle');
    });

    it('hover → active (POINTER_DOWN)', () => {
      const button = createButton();
      button.send({ type: 'POINTER_ENTER' });
      button.send({ type: 'POINTER_DOWN' });

      expect(button.getContext().interactionState).toBe('active');
    });

    it('active → hover (POINTER_UP)', () => {
      const button = createButton();
      button.send({ type: 'POINTER_ENTER' });
      button.send({ type: 'POINTER_DOWN' });
      button.send({ type: 'POINTER_UP' });

      expect(button.getContext().interactionState).toBe('hover');
    });

    it('active → idle (POINTER_LEAVE — drag out)', () => {
      const button = createButton();
      button.send({ type: 'POINTER_ENTER' });
      button.send({ type: 'POINTER_DOWN' });
      button.send({ type: 'POINTER_LEAVE' });

      expect(button.getContext().interactionState).toBe('idle');
    });

    it('data-state güncellenir / data-state updates', () => {
      const button = createButton();

      expect(button.getButtonProps()['data-state']).toBe('idle');

      button.send({ type: 'POINTER_ENTER' });
      expect(button.getButtonProps()['data-state']).toBe('hover');

      button.send({ type: 'POINTER_DOWN' });
      expect(button.getButtonProps()['data-state']).toBe('active');
    });
  });

  // ──────────────────────────────────────────
  // State transitions — focus
  // ──────────────────────────────────────────

  describe('state transitions — focus', () => {
    it('idle → focused (FOCUS)', () => {
      const button = createButton();
      button.send({ type: 'FOCUS' });

      expect(button.getContext().interactionState).toBe('focused');
    });

    it('focused → idle (BLUR)', () => {
      const button = createButton();
      button.send({ type: 'FOCUS' });
      button.send({ type: 'BLUR' });

      expect(button.getContext().interactionState).toBe('idle');
    });

    it('focused → hover (POINTER_ENTER)', () => {
      const button = createButton();
      button.send({ type: 'FOCUS' });
      button.send({ type: 'POINTER_ENTER' });

      expect(button.getContext().interactionState).toBe('hover');
    });
  });

  // ──────────────────────────────────────────
  // State transitions — keyboard
  // ──────────────────────────────────────────

  describe('state transitions — keyboard', () => {
    it('focused → active (KEY_DOWN Enter)', () => {
      const button = createButton();
      button.send({ type: 'FOCUS' });
      button.send({ type: 'KEY_DOWN', key: 'Enter' });

      expect(button.getContext().interactionState).toBe('active');
    });

    it('focused → active (KEY_DOWN Space)', () => {
      const button = createButton();
      button.send({ type: 'FOCUS' });
      button.send({ type: 'KEY_DOWN', key: ' ' });

      expect(button.getContext().interactionState).toBe('active');
    });

    it('active → focused (KEY_UP Enter)', () => {
      const button = createButton();
      button.send({ type: 'FOCUS' });
      button.send({ type: 'KEY_DOWN', key: 'Enter' });
      button.send({ type: 'KEY_UP', key: 'Enter' });

      expect(button.getContext().interactionState).toBe('focused');
    });

    it('active → focused (KEY_UP Space)', () => {
      const button = createButton();
      button.send({ type: 'FOCUS' });
      button.send({ type: 'KEY_DOWN', key: ' ' });
      button.send({ type: 'KEY_UP', key: ' ' });

      expect(button.getContext().interactionState).toBe('focused');
    });

    it('alakasız tuş durumu değiştirmez / irrelevant key does not change state', () => {
      const button = createButton();
      button.send({ type: 'FOCUS' });
      button.send({ type: 'KEY_DOWN', key: 'Tab' });

      expect(button.getContext().interactionState).toBe('focused');
    });
  });

  // ──────────────────────────────────────────
  // Disabled — etkileşim engelleme
  // ──────────────────────────────────────────

  describe('disabled — interaction blocking', () => {
    it('disabled durumda pointer event yoksayılır', () => {
      const button = createButton({ disabled: true });
      button.send({ type: 'POINTER_ENTER' });

      expect(button.getContext().interactionState).toBe('idle');
    });

    it('disabled durumda focus event yoksayılır', () => {
      const button = createButton({ disabled: true });
      button.send({ type: 'FOCUS' });

      expect(button.getContext().interactionState).toBe('idle');
    });

    it('disabled durumda keyboard event yoksayılır', () => {
      const button = createButton({ disabled: true });
      button.send({ type: 'KEY_DOWN', key: 'Enter' });

      expect(button.getContext().interactionState).toBe('idle');
    });

    it('SET_DISABLED ile runtime disable', () => {
      const button = createButton();
      button.send({ type: 'POINTER_ENTER' });
      expect(button.getContext().interactionState).toBe('hover');

      button.send({ type: 'SET_DISABLED', value: true });
      expect(button.getContext().interactionState).toBe('idle');
      expect(button.getContext().disabled).toBe(true);
    });

    it('SET_DISABLED false ile tekrar aktif', () => {
      const button = createButton({ disabled: true });
      button.send({ type: 'SET_DISABLED', value: false });

      expect(button.getContext().disabled).toBe(false);
      button.send({ type: 'POINTER_ENTER' });
      expect(button.getContext().interactionState).toBe('hover');
    });

    it('isInteractionBlocked doğru döner / returns correctly', () => {
      const button = createButton({ disabled: true });
      expect(button.isInteractionBlocked()).toBe(true);

      const button2 = createButton();
      expect(button2.isInteractionBlocked()).toBe(false);
    });
  });

  // ──────────────────────────────────────────
  // Loading — etkileşim engelleme
  // ──────────────────────────────────────────

  describe('loading — interaction blocking', () => {
    it('loading durumda pointer event yoksayılır', () => {
      const button = createButton({ loading: true });
      button.send({ type: 'POINTER_ENTER' });

      expect(button.getContext().interactionState).toBe('idle');
    });

    it('SET_LOADING ile runtime loading', () => {
      const button = createButton();
      button.send({ type: 'POINTER_ENTER' });
      expect(button.getContext().interactionState).toBe('hover');

      button.send({ type: 'SET_LOADING', value: true });
      expect(button.getContext().interactionState).toBe('idle');
      expect(button.getContext().loading).toBe(true);
    });

    it('loading + disabled = her ikisi de engeller', () => {
      const button = createButton({ loading: true, disabled: true });
      expect(button.isInteractionBlocked()).toBe(true);
      expect(button.getButtonProps()['aria-busy']).toBe(true);
      expect(button.getButtonProps()['aria-disabled']).toBe(true);
    });
  });

  // ──────────────────────────────────────────
  // Referans eşitliği — gereksiz re-render önleme
  // ──────────────────────────────────────────

  describe('reference equality — unnecessary re-render prevention', () => {
    it('aynı değerle SET_DISABLED aynı referansı döner', () => {
      const button = createButton({ disabled: true });
      const ctxBefore = button.getContext();
      const ctxAfter = button.send({ type: 'SET_DISABLED', value: true });

      expect(ctxAfter).toBe(ctxBefore);
    });

    it('aynı değerle SET_LOADING aynı referansı döner', () => {
      const button = createButton({ loading: false });
      const ctxBefore = button.getContext();
      const ctxAfter = button.send({ type: 'SET_LOADING', value: false });

      expect(ctxAfter).toBe(ctxBefore);
    });

    it('farklı değerle SET_DISABLED yeni referans döner', () => {
      const button = createButton({ disabled: false });
      const ctxBefore = button.getContext();
      const ctxAfter = button.send({ type: 'SET_DISABLED', value: true });

      expect(ctxAfter).not.toBe(ctxBefore);
    });

    it('durum değişmezse aynı referans döner (idle → POINTER_LEAVE)', () => {
      const button = createButton();
      const ctxBefore = button.getContext();
      // idle durumda POINTER_LEAVE geçersiz — aynı referans dönmeli
      const ctxAfter = button.send({ type: 'POINTER_LEAVE' });

      expect(ctxAfter).toBe(ctxBefore);
    });

    it('durum değişirse yeni referans döner (idle → hover)', () => {
      const button = createButton();
      const ctxBefore = button.getContext();
      const ctxAfter = button.send({ type: 'POINTER_ENTER' });

      expect(ctxAfter).not.toBe(ctxBefore);
    });
  });
});

// ──────────────────────────────────────────
// Keyboard click helpers
// ──────────────────────────────────────────

describe('shouldTriggerClick', () => {
  it('native button için false döner / returns false for native button', () => {
    expect(shouldTriggerClick('Enter', 'button')).toBe(false);
    expect(shouldTriggerClick(' ', 'button')).toBe(false);
  });

  it('non-native element Enter ile true döner', () => {
    expect(shouldTriggerClick('Enter', 'div')).toBe(true);
    expect(shouldTriggerClick('Enter', 'a')).toBe(true);
    expect(shouldTriggerClick('Enter', 'span')).toBe(true);
  });

  it('non-native element Space ile false döner (keyup bekler)', () => {
    expect(shouldTriggerClick(' ', 'div')).toBe(false);
  });

  it('alakasız tuş false döner', () => {
    expect(shouldTriggerClick('Tab', 'div')).toBe(false);
  });
});

describe('shouldTriggerClickOnKeyUp', () => {
  it('native button için false döner', () => {
    expect(shouldTriggerClickOnKeyUp(' ', 'button')).toBe(false);
  });

  it('non-native element Space ile true döner', () => {
    expect(shouldTriggerClickOnKeyUp(' ', 'div')).toBe(true);
    expect(shouldTriggerClickOnKeyUp(' ', 'a')).toBe(true);
  });

  it('Enter ile false döner (keydown handles it)', () => {
    expect(shouldTriggerClickOnKeyUp('Enter', 'div')).toBe(false);
  });
});
