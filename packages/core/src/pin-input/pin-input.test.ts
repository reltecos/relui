/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createPinInput } from './pin-input.machine';

describe('createPinInput', () => {
  // ── Baslangic durumu ──

  it('varsayilan context dogru baslar', () => {
    const api = createPinInput();
    const ctx = api.getContext();
    expect(ctx.values).toEqual(['', '', '', '']);
    expect(ctx.focusIndex).toBe(0);
    expect(ctx.isComplete).toBe(false);
    expect(ctx.value).toBe('');
  });

  it('defaultValue ile baslangic degeri set edilir', () => {
    const api = createPinInput({ defaultValue: '1234' });
    const ctx = api.getContext();
    expect(ctx.values).toEqual(['1', '2', '3', '4']);
    expect(ctx.isComplete).toBe(true);
    expect(ctx.value).toBe('1234');
  });

  it('custom length ile alan sayisi ayarlanir', () => {
    const api = createPinInput({ length: 6 });
    const ctx = api.getContext();
    expect(ctx.values).toHaveLength(6);
    expect(ctx.values).toEqual(['', '', '', '', '', '']);
  });

  // ── SET_CHAR ──

  it('SET_CHAR gecerli rakami set eder', () => {
    const api = createPinInput();
    api.send({ type: 'SET_CHAR', index: 0, char: '5' });
    expect(api.getContext().values[0]).toBe('5');
  });

  it('SET_CHAR gecersiz karakteri number modunda reddeder', () => {
    const api = createPinInput({ type: 'number' });
    api.send({ type: 'SET_CHAR', index: 0, char: 'a' });
    expect(api.getContext().values[0]).toBe('');
  });

  it('SET_CHAR alphanumeric modda harf kabul eder', () => {
    const api = createPinInput({ type: 'alphanumeric' });
    api.send({ type: 'SET_CHAR', index: 0, char: 'A' });
    expect(api.getContext().values[0]).toBe('A');
  });

  it('SET_CHAR alphanumeric modda rakam kabul eder', () => {
    const api = createPinInput({ type: 'alphanumeric' });
    api.send({ type: 'SET_CHAR', index: 0, char: '7' });
    expect(api.getContext().values[0]).toBe('7');
  });

  it('SET_CHAR alphanumeric modda ozel karakter reddeder', () => {
    const api = createPinInput({ type: 'alphanumeric' });
    api.send({ type: 'SET_CHAR', index: 0, char: '@' });
    expect(api.getContext().values[0]).toBe('');
  });

  it('SET_CHAR sonrasi focusIndex bir sonrakine ilerler', () => {
    const api = createPinInput();
    api.send({ type: 'SET_CHAR', index: 0, char: '1' });
    expect(api.getContext().focusIndex).toBe(1);
  });

  it('SET_CHAR son alanda focusIndex length-1 de kalir', () => {
    const api = createPinInput({ length: 4 });
    api.send({ type: 'SET_CHAR', index: 3, char: '9' });
    expect(api.getContext().focusIndex).toBe(3);
  });

  it('SET_CHAR gecersiz index icin no-op', () => {
    const api = createPinInput();
    api.send({ type: 'SET_CHAR', index: -1, char: '1' });
    api.send({ type: 'SET_CHAR', index: 10, char: '1' });
    expect(api.getContext().values).toEqual(['', '', '', '']);
  });

  // ── BACKSPACE ──

  it('BACKSPACE alani temizler ve geri gider', () => {
    const api = createPinInput({ defaultValue: '12' });
    api.send({ type: 'BACKSPACE', index: 1 });
    expect(api.getContext().values[1]).toBe('');
    expect(api.getContext().focusIndex).toBe(0);
  });

  it('BACKSPACE ilk alanda focusIndex 0 da kalir', () => {
    const api = createPinInput({ defaultValue: '1' });
    api.send({ type: 'BACKSPACE', index: 0 });
    expect(api.getContext().focusIndex).toBe(0);
    expect(api.getContext().values[0]).toBe('');
  });

  // ── PASTE ──

  it('PASTE karakterleri dagitur', () => {
    const api = createPinInput();
    api.send({ type: 'PASTE', value: '1234' });
    expect(api.getContext().values).toEqual(['1', '2', '3', '4']);
    expect(api.getContext().isComplete).toBe(true);
  });

  it('PASTE focusIndex konumundan baslar', () => {
    const api = createPinInput({ length: 4 });
    api.send({ type: 'FOCUS_INDEX', index: 2 });
    api.send({ type: 'PASTE', value: '56' });
    expect(api.getContext().values).toEqual(['', '', '5', '6']);
  });

  it('PASTE gecersiz karakterleri atlar (number)', () => {
    const api = createPinInput({ type: 'number' });
    api.send({ type: 'PASTE', value: '1a2b' });
    expect(api.getContext().values).toEqual(['1', '2', '', '']);
  });

  it('PASTE tasinma sonrasi isComplete kontrol edilir', () => {
    const onComplete = vi.fn();
    const api = createPinInput({ onComplete });
    api.send({ type: 'PASTE', value: '1234' });
    expect(onComplete).toHaveBeenCalledWith('1234');
  });

  // ── CLEAR ──

  it('CLEAR tum degerleri sifirlar', () => {
    const api = createPinInput({ defaultValue: '1234' });
    api.send({ type: 'CLEAR' });
    const ctx = api.getContext();
    expect(ctx.values).toEqual(['', '', '', '']);
    expect(ctx.focusIndex).toBe(0);
    expect(ctx.isComplete).toBe(false);
  });

  // ── SET_VALUE ──

  it('SET_VALUE degeri parse edip alanlara doldurur', () => {
    const api = createPinInput();
    api.send({ type: 'SET_VALUE', value: '5678' });
    expect(api.getContext().values).toEqual(['5', '6', '7', '8']);
  });

  it('SET_VALUE kisa deger icin kalan alanlari bosaltir', () => {
    const api = createPinInput({ defaultValue: '1234' });
    api.send({ type: 'SET_VALUE', value: '56' });
    expect(api.getContext().values).toEqual(['5', '6', '', '']);
  });

  // ── isComplete ──

  it('isComplete tum alanlar doluyken true doner', () => {
    const api = createPinInput({ defaultValue: '1234' });
    expect(api.getContext().isComplete).toBe(true);
  });

  it('isComplete eksik alan varken false doner', () => {
    const api = createPinInput({ defaultValue: '12' });
    expect(api.getContext().isComplete).toBe(false);
  });

  // ── onComplete ──

  it('onComplete tum alanlar dolunca cagirilir', () => {
    const onComplete = vi.fn();
    const api = createPinInput({ onComplete });
    api.send({ type: 'SET_CHAR', index: 0, char: '1' });
    api.send({ type: 'SET_CHAR', index: 1, char: '2' });
    api.send({ type: 'SET_CHAR', index: 2, char: '3' });
    api.send({ type: 'SET_CHAR', index: 3, char: '4' });
    expect(onComplete).toHaveBeenCalledWith('1234');
  });

  it('onComplete eksik alanlar varken cagirilmaz', () => {
    const onComplete = vi.fn();
    const api = createPinInput({ onComplete });
    api.send({ type: 'SET_CHAR', index: 0, char: '1' });
    expect(onComplete).not.toHaveBeenCalled();
  });

  // ── onChange ──

  it('onChange her deger degisiminde cagirilir', () => {
    const onChange = vi.fn();
    const api = createPinInput({ onChange });
    api.send({ type: 'SET_CHAR', index: 0, char: '1' });
    expect(onChange).toHaveBeenCalledWith('1');
    api.send({ type: 'SET_CHAR', index: 1, char: '2' });
    expect(onChange).toHaveBeenCalledWith('12');
  });

  it('onChange BACKSPACE sonrasi cagirilir', () => {
    const onChange = vi.fn();
    const api = createPinInput({ defaultValue: '12', onChange });
    api.send({ type: 'BACKSPACE', index: 1 });
    expect(onChange).toHaveBeenCalledWith('1');
  });

  it('onChange CLEAR sonrasi cagirilir', () => {
    const onChange = vi.fn();
    const api = createPinInput({ defaultValue: '1234', onChange });
    api.send({ type: 'CLEAR' });
    expect(onChange).toHaveBeenCalledWith('');
  });

  // ── FOCUS_INDEX ──

  it('FOCUS_INDEX odak indeksini set eder', () => {
    const api = createPinInput();
    api.send({ type: 'FOCUS_INDEX', index: 2 });
    expect(api.getContext().focusIndex).toBe(2);
  });

  it('FOCUS_INDEX negatif degeri 0 a clamp eder', () => {
    const api = createPinInput();
    api.send({ type: 'FOCUS_INDEX', index: -5 });
    expect(api.getContext().focusIndex).toBe(0);
  });

  it('FOCUS_INDEX buyuk degeri length-1 e clamp eder', () => {
    const api = createPinInput({ length: 4 });
    api.send({ type: 'FOCUS_INDEX', index: 99 });
    expect(api.getContext().focusIndex).toBe(3);
  });

  // ── Subscribe ──

  it('subscribe ile degisiklikler dinlenir', () => {
    const api = createPinInput();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_CHAR', index: 0, char: '1' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe sonrasi listener cagirilmaz', () => {
    const api = createPinInput();
    const listener = vi.fn();
    const unsub = api.subscribe(listener);
    unsub();
    api.send({ type: 'SET_CHAR', index: 0, char: '1' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('birden fazla subscriber desteklenir', () => {
    const api = createPinInput();
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    api.subscribe(listener1);
    api.subscribe(listener2);
    api.send({ type: 'SET_CHAR', index: 0, char: '5' });
    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
  });

  // ── Destroy ──

  it('destroy sonrasi listener cagirilmaz', () => {
    const api = createPinInput();
    const listener = vi.fn();
    api.subscribe(listener);
    api.destroy();
    api.send({ type: 'SET_CHAR', index: 0, char: '1' });
    expect(listener).not.toHaveBeenCalled();
  });
});
