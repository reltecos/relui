/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createValidationSummary } from './validation-summary.machine';
import type { ValidationError } from './validation-summary.types';

const sampleErrors: ValidationError[] = [
  { field: 'name', message: 'Ad zorunludur' },
  { field: 'email', message: 'Gecersiz e-posta', severity: 'error' },
  { field: 'age', message: 'Yas 0 dan buyuk olmali', severity: 'warning' },
];

describe('createValidationSummary', () => {
  // ── Baslangic durumu ──

  it('varsayilan olarak bos hata listesi', () => {
    const api = createValidationSummary();
    expect(api.getContext().errors).toEqual([]);
    expect(api.getContext().errorCount).toBe(0);
    expect(api.getContext().warningCount).toBe(0);
  });

  it('baslangic hatalariyla olusturulabilir', () => {
    const api = createValidationSummary({ errors: sampleErrors });
    expect(api.getContext().errors).toHaveLength(3);
    expect(api.getContext().errorCount).toBe(2);
    expect(api.getContext().warningCount).toBe(1);
  });

  // ── SET_ERRORS ──

  it('SET_ERRORS ile hata listesi atanir', () => {
    const api = createValidationSummary();
    api.send({ type: 'SET_ERRORS', errors: sampleErrors });
    expect(api.getContext().errors).toHaveLength(3);
  });

  it('SET_ERRORS onceki hatalari degistirir', () => {
    const api = createValidationSummary({ errors: sampleErrors });
    api.send({
      type: 'SET_ERRORS',
      errors: [{ field: 'password', message: 'Sifre cok kisa' }],
    });
    expect(api.getContext().errors).toHaveLength(1);
    const first = api.getContext().errors[0];
    expect(first).toBeDefined();
    expect(first?.field).toBe('password');
  });

  it('SET_ERRORS onErrorsChange cagirir', () => {
    const onErrorsChange = vi.fn();
    const api = createValidationSummary({ onErrorsChange });
    api.send({ type: 'SET_ERRORS', errors: sampleErrors });
    expect(onErrorsChange).toHaveBeenCalledTimes(1);
  });

  it('SET_ERRORS sayaclari gunceller', () => {
    const api = createValidationSummary();
    api.send({ type: 'SET_ERRORS', errors: sampleErrors });
    expect(api.getContext().errorCount).toBe(2);
    expect(api.getContext().warningCount).toBe(1);
  });

  // ── ADD_ERROR ──

  it('ADD_ERROR ile hata eklenir', () => {
    const api = createValidationSummary();
    api.send({ type: 'ADD_ERROR', error: { field: 'name', message: 'Ad zorunlu' } });
    expect(api.getContext().errors).toHaveLength(1);
    expect(api.getContext().errorCount).toBe(1);
  });

  it('ADD_ERROR ayni field varsa gunceller', () => {
    const api = createValidationSummary({
      errors: [{ field: 'name', message: 'Eski mesaj' }],
    });
    api.send({ type: 'ADD_ERROR', error: { field: 'name', message: 'Yeni mesaj' } });
    expect(api.getContext().errors).toHaveLength(1);
    const first = api.getContext().errors[0];
    expect(first?.message).toBe('Yeni mesaj');
  });

  it('ADD_ERROR ayni field ve ayni mesajda notify yapmaz', () => {
    const api = createValidationSummary({
      errors: [{ field: 'name', message: 'Test' }],
    });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'ADD_ERROR', error: { field: 'name', message: 'Test' } });
    expect(listener).not.toHaveBeenCalled();
  });

  it('ADD_ERROR warning severity ile sayaci gunceller', () => {
    const api = createValidationSummary();
    api.send({
      type: 'ADD_ERROR',
      error: { field: 'age', message: 'Dikkat', severity: 'warning' },
    });
    expect(api.getContext().warningCount).toBe(1);
    expect(api.getContext().errorCount).toBe(0);
  });

  it('ADD_ERROR onErrorsChange cagirir', () => {
    const onErrorsChange = vi.fn();
    const api = createValidationSummary({ onErrorsChange });
    api.send({ type: 'ADD_ERROR', error: { field: 'x', message: 'test' } });
    expect(onErrorsChange).toHaveBeenCalledTimes(1);
  });

  // ── REMOVE_ERROR ──

  it('REMOVE_ERROR ile hata silinir', () => {
    const api = createValidationSummary({ errors: sampleErrors });
    api.send({ type: 'REMOVE_ERROR', field: 'name' });
    expect(api.getContext().errors).toHaveLength(2);
  });

  it('olmayan field icin REMOVE_ERROR notify yapmaz', () => {
    const api = createValidationSummary({ errors: sampleErrors });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'REMOVE_ERROR', field: 'nonexistent' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('REMOVE_ERROR sayaclari gunceller', () => {
    const api = createValidationSummary({ errors: sampleErrors });
    api.send({ type: 'REMOVE_ERROR', field: 'age' }); // warning silinir
    expect(api.getContext().warningCount).toBe(0);
    expect(api.getContext().errorCount).toBe(2);
  });

  it('REMOVE_ERROR onErrorsChange cagirir', () => {
    const onErrorsChange = vi.fn();
    const api = createValidationSummary({ errors: sampleErrors, onErrorsChange });
    api.send({ type: 'REMOVE_ERROR', field: 'name' });
    expect(onErrorsChange).toHaveBeenCalledTimes(1);
  });

  // ── CLEAR_ERRORS ──

  it('CLEAR_ERRORS ile tum hatalar temizlenir', () => {
    const api = createValidationSummary({ errors: sampleErrors });
    api.send({ type: 'CLEAR_ERRORS' });
    expect(api.getContext().errors).toEqual([]);
    expect(api.getContext().errorCount).toBe(0);
    expect(api.getContext().warningCount).toBe(0);
  });

  it('bos listede CLEAR_ERRORS notify yapmaz', () => {
    const api = createValidationSummary();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'CLEAR_ERRORS' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('CLEAR_ERRORS onErrorsChange cagirir', () => {
    const onErrorsChange = vi.fn();
    const api = createValidationSummary({ errors: sampleErrors, onErrorsChange });
    api.send({ type: 'CLEAR_ERRORS' });
    expect(onErrorsChange).toHaveBeenCalledTimes(1);
  });

  // ── subscribe ──

  it('subscribe ile dinleyici eklenir', () => {
    const api = createValidationSummary();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'ADD_ERROR', error: { field: 'x', message: 'test' } });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe ile dinleyici kaldirilir', () => {
    const api = createValidationSummary();
    const listener = vi.fn();
    const unsub = api.subscribe(listener);
    unsub();
    api.send({ type: 'ADD_ERROR', error: { field: 'x', message: 'test' } });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── Varsayilan severity ──

  it('severity verilmezse error sayilir', () => {
    const api = createValidationSummary();
    api.send({ type: 'ADD_ERROR', error: { field: 'x', message: 'test' } });
    expect(api.getContext().errorCount).toBe(1);
    expect(api.getContext().warningCount).toBe(0);
  });
});
