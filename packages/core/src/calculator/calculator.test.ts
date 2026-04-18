/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createCalculator } from './calculator.machine';

describe('createCalculator', () => {
  it('baslangic display 0', () => {
    const api = createCalculator();
    expect(api.getContext().display).toBe('0');
  });

  it('DIGIT display a eklenir', () => {
    const api = createCalculator();
    api.send({ type: 'DIGIT', digit: '5' });
    expect(api.getContext().display).toBe('5');
  });

  it('coklu digit birlestir', () => {
    const api = createCalculator();
    api.send({ type: 'DIGIT', digit: '1' });
    api.send({ type: 'DIGIT', digit: '2' });
    api.send({ type: 'DIGIT', digit: '3' });
    expect(api.getContext().display).toBe('123');
  });

  it('DECIMAL nokta ekler', () => {
    const api = createCalculator();
    api.send({ type: 'DIGIT', digit: '3' });
    api.send({ type: 'DECIMAL' });
    api.send({ type: 'DIGIT', digit: '5' });
    expect(api.getContext().display).toBe('3.5');
  });

  it('DECIMAL iki kez calistirilmaz', () => {
    const api = createCalculator();
    api.send({ type: 'DECIMAL' });
    api.send({ type: 'DECIMAL' });
    expect(api.getContext().display).toBe('0.');
  });

  it('toplama islemi', () => {
    const api = createCalculator();
    api.send({ type: 'DIGIT', digit: '5' });
    api.send({ type: 'OPERATOR', operator: '+' });
    api.send({ type: 'DIGIT', digit: '3' });
    api.send({ type: 'EQUALS' });
    expect(api.getContext().display).toBe('8');
  });

  it('cikarma islemi', () => {
    const api = createCalculator();
    api.send({ type: 'DIGIT', digit: '9' });
    api.send({ type: 'OPERATOR', operator: '-' });
    api.send({ type: 'DIGIT', digit: '4' });
    api.send({ type: 'EQUALS' });
    expect(api.getContext().display).toBe('5');
  });

  it('carpma islemi', () => {
    const api = createCalculator();
    api.send({ type: 'DIGIT', digit: '6' });
    api.send({ type: 'OPERATOR', operator: '*' });
    api.send({ type: 'DIGIT', digit: '7' });
    api.send({ type: 'EQUALS' });
    expect(api.getContext().display).toBe('42');
  });

  it('bolme islemi', () => {
    const api = createCalculator();
    api.send({ type: 'DIGIT', digit: '8' });
    api.send({ type: 'OPERATOR', operator: '/' });
    api.send({ type: 'DIGIT', digit: '2' });
    api.send({ type: 'EQUALS' });
    expect(api.getContext().display).toBe('4');
  });

  it('sifira bolme Error doner', () => {
    const api = createCalculator();
    api.send({ type: 'DIGIT', digit: '5' });
    api.send({ type: 'OPERATOR', operator: '/' });
    api.send({ type: 'DIGIT', digit: '0' });
    api.send({ type: 'EQUALS' });
    expect(api.getContext().display).toBe('Error');
  });

  it('CLEAR display ve expression sifirlar', () => {
    const api = createCalculator();
    api.send({ type: 'DIGIT', digit: '5' });
    api.send({ type: 'CLEAR' });
    expect(api.getContext().display).toBe('0');
    expect(api.getContext().expression).toBe('');
  });

  it('CLEAR_ENTRY sadece display sifirlar', () => {
    const api = createCalculator();
    api.send({ type: 'DIGIT', digit: '5' });
    api.send({ type: 'OPERATOR', operator: '+' });
    api.send({ type: 'DIGIT', digit: '3' });
    api.send({ type: 'CLEAR_ENTRY' });
    expect(api.getContext().display).toBe('0');
  });

  it('BACKSPACE son karakter siler', () => {
    const api = createCalculator();
    api.send({ type: 'DIGIT', digit: '1' });
    api.send({ type: 'DIGIT', digit: '2' });
    api.send({ type: 'BACKSPACE' });
    expect(api.getContext().display).toBe('1');
  });

  it('BACKSPACE tek karakter 0 yapar', () => {
    const api = createCalculator();
    api.send({ type: 'DIGIT', digit: '5' });
    api.send({ type: 'BACKSPACE' });
    expect(api.getContext().display).toBe('0');
  });

  it('NEGATE isaret degistirir', () => {
    const api = createCalculator();
    api.send({ type: 'DIGIT', digit: '5' });
    api.send({ type: 'NEGATE' });
    expect(api.getContext().display).toBe('-5');
    api.send({ type: 'NEGATE' });
    expect(api.getContext().display).toBe('5');
  });

  it('PERCENT yuzde hesaplar', () => {
    const api = createCalculator();
    api.send({ type: 'DIGIT', digit: '5' });
    api.send({ type: 'DIGIT', digit: '0' });
    api.send({ type: 'PERCENT' });
    expect(api.getContext().display).toBe('0.5');
  });

  it('MEMORY_ADD ve MEMORY_RECALL', () => {
    const api = createCalculator();
    api.send({ type: 'DIGIT', digit: '5' });
    api.send({ type: 'MEMORY_ADD' });
    api.send({ type: 'CLEAR' });
    api.send({ type: 'MEMORY_RECALL' });
    expect(api.getContext().display).toBe('5');
  });

  it('MEMORY_SUBTRACT', () => {
    const api = createCalculator();
    api.send({ type: 'DIGIT', digit: '5' });
    api.send({ type: 'MEMORY_ADD' });
    api.send({ type: 'CLEAR_ENTRY' });
    api.send({ type: 'DIGIT', digit: '3' });
    api.send({ type: 'MEMORY_SUBTRACT' });
    expect(api.getContext().memory).toBe(2);
  });

  it('MEMORY_CLEAR', () => {
    const api = createCalculator();
    api.send({ type: 'DIGIT', digit: '5' });
    api.send({ type: 'MEMORY_ADD' });
    api.send({ type: 'MEMORY_CLEAR' });
    expect(api.getContext().memory).toBe(0);
  });

  it('history kaydedilir', () => {
    const api = createCalculator();
    api.send({ type: 'DIGIT', digit: '2' });
    api.send({ type: 'OPERATOR', operator: '+' });
    api.send({ type: 'DIGIT', digit: '3' });
    api.send({ type: 'EQUALS' });
    expect(api.getContext().history).toHaveLength(1);
    expect(api.getContext().history[0]).toContain('5');
  });

  it('onResult callback cagrilir', () => {
    const onResult = vi.fn();
    const api = createCalculator({ onResult });
    api.send({ type: 'DIGIT', digit: '4' });
    api.send({ type: 'OPERATOR', operator: '+' });
    api.send({ type: 'DIGIT', digit: '6' });
    api.send({ type: 'EQUALS' });
    expect(onResult).toHaveBeenCalledWith(10);
  });

  it('subscribe bildirim alir', () => {
    const api = createCalculator();
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'DIGIT', digit: '1' });
    expect(fn).toHaveBeenCalledOnce();
  });

  it('destroy listener temizler', () => {
    const api = createCalculator();
    const fn = vi.fn();
    api.subscribe(fn);
    api.destroy();
    api.send({ type: 'DIGIT', digit: '1' });
    expect(fn).not.toHaveBeenCalled();
  });
});
