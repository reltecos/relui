/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createFormEngine } from './form-engine.machine';
import type { FormFieldDef } from './form-engine.types';

const FIELDS: FormFieldDef[] = [
  { name: 'name', type: 'text', label: 'Isim', required: true, min: 2 },
  { name: 'email', type: 'email', label: 'E-posta', required: true },
  { name: 'age', type: 'number', label: 'Yas', min: 0, max: 150 },
  { name: 'bio', type: 'textarea', label: 'Hakkinda' },
];

describe('createFormEngine', () => {
  it('varsayilan context', () => { const api = createFormEngine({ fields: FIELDS }); const ctx = api.getContext(); expect(ctx.fields).toHaveLength(4); expect(ctx.dirty).toBe(false); expect(ctx.isValid).toBe(true); expect(ctx.errors).toHaveLength(0); api.destroy(); });
  it('SET_VALUE deger ayarlar', () => { const api = createFormEngine({ fields: FIELDS }); api.send({ type: 'SET_VALUE', field: 'name', value: 'Ali' }); expect(api.getContext().values['name']).toBe('Ali'); expect(api.getContext().dirty).toBe(true); api.destroy(); });
  it('SET_VALUE onChange cagirir', () => { const onChange = vi.fn(); const api = createFormEngine({ fields: FIELDS, onChange }); api.send({ type: 'SET_VALUE', field: 'name', value: 'X' }); expect(onChange).toHaveBeenCalled(); api.destroy(); });
  it('SET_TOUCHED alani isaretler', () => { const api = createFormEngine({ fields: FIELDS }); api.send({ type: 'SET_TOUCHED', field: 'name' }); expect(api.getContext().touched['name']).toBe(true); api.destroy(); });
  it('required validation', () => { const api = createFormEngine({ fields: FIELDS }); api.send({ type: 'SET_TOUCHED', field: 'name' }); expect(api.getContext().errors.some((e) => e.field === 'name')).toBe(true); api.destroy(); });
  it('min length validation', () => { const api = createFormEngine({ fields: FIELDS }); api.send({ type: 'SET_VALUE', field: 'name', value: 'A' }); api.send({ type: 'SET_TOUCHED', field: 'name' }); expect(api.getContext().errors.some((e) => e.field === 'name')).toBe(true); api.destroy(); });
  it('email validation', () => { const api = createFormEngine({ fields: FIELDS }); api.send({ type: 'SET_VALUE', field: 'email', value: 'invalid' }); api.send({ type: 'SET_TOUCHED', field: 'email' }); expect(api.getContext().errors.some((e) => e.field === 'email')).toBe(true); api.destroy(); });
  it('gecerli email validation', () => { const api = createFormEngine({ fields: FIELDS }); api.send({ type: 'SET_VALUE', field: 'email', value: 'a@b.com' }); api.send({ type: 'SET_TOUCHED', field: 'email' }); expect(api.getContext().errors.some((e) => e.field === 'email')).toBe(false); api.destroy(); });
  it('number min validation', () => { const api = createFormEngine({ fields: FIELDS }); api.send({ type: 'SET_VALUE', field: 'age', value: -5 }); api.send({ type: 'SET_TOUCHED', field: 'age' }); expect(api.getContext().errors.some((e) => e.field === 'age')).toBe(true); api.destroy(); });
  it('number max validation', () => { const api = createFormEngine({ fields: FIELDS }); api.send({ type: 'SET_VALUE', field: 'age', value: 200 }); api.send({ type: 'SET_TOUCHED', field: 'age' }); expect(api.getContext().errors.some((e) => e.field === 'age')).toBe(true); api.destroy(); });
  it('VALIDATE tum alanlari kontrol eder', () => { const api = createFormEngine({ fields: FIELDS }); api.send({ type: 'VALIDATE' }); expect(api.getContext().errors.length).toBeGreaterThan(0); api.destroy(); });
  it('SUBMIT gecerli formda onSubmit cagirir', () => { const onSubmit = vi.fn(); const api = createFormEngine({ fields: [{ name: 'x', type: 'text', label: 'X' }], onSubmit }); api.send({ type: 'SET_VALUE', field: 'x', value: 'hi' }); api.send({ type: 'SUBMIT' }); expect(onSubmit).toHaveBeenCalled(); api.destroy(); });
  it('SUBMIT gecersiz formda onSubmit cagirilmaz', () => { const onSubmit = vi.fn(); const api = createFormEngine({ fields: FIELDS, onSubmit }); api.send({ type: 'SUBMIT' }); expect(onSubmit).not.toHaveBeenCalled(); expect(api.getContext().errors.length).toBeGreaterThan(0); api.destroy(); });
  it('SUBMIT tum alanlari touched yapar', () => { const api = createFormEngine({ fields: FIELDS }); api.send({ type: 'SUBMIT' }); for (const f of FIELDS) expect(api.getContext().touched[f.name]).toBe(true); api.destroy(); });
  it('RESET sifirlar', () => { const api = createFormEngine({ fields: FIELDS }); api.send({ type: 'SET_VALUE', field: 'name', value: 'Ali' }); api.send({ type: 'RESET' }); expect(api.getContext().values['name']).toBeUndefined(); expect(api.getContext().dirty).toBe(false); api.destroy(); });
  it('defaultValue ile baslar', () => { const api = createFormEngine({ fields: [{ name: 'x', type: 'text', label: 'X', defaultValue: 'hi' }] }); expect(api.getContext().values['x']).toBe('hi'); api.destroy(); });
  it('SET_SCHEMA semayi degistirir', () => { const api = createFormEngine({ fields: FIELDS }); api.send({ type: 'SET_SCHEMA', fields: [{ name: 'a', type: 'text', label: 'A' }] }); expect(api.getContext().fields).toHaveLength(1); api.destroy(); });
  it('pattern validation', () => { const api = createFormEngine({ fields: [{ name: 'code', type: 'text', label: 'Kod', pattern: '^[A-Z]{3}$' }] }); api.send({ type: 'SET_VALUE', field: 'code', value: 'ab' }); api.send({ type: 'SET_TOUCHED', field: 'code' }); expect(api.getContext().errors.some((e) => e.field === 'code')).toBe(true); api.destroy(); });
  it('customValidate destekler', () => { const api = createFormEngine({ fields: [{ name: 'x', type: 'text', label: 'X', customValidate: (v) => v === 'bad' ? 'Hata' : null }] }); api.send({ type: 'SET_VALUE', field: 'x', value: 'bad' }); api.send({ type: 'SET_TOUCHED', field: 'x' }); expect(api.getContext().errors.some((e) => e.message === 'Hata')).toBe(true); api.destroy(); });
  it('subscribe/destroy', () => { const api = createFormEngine(); const l = vi.fn(); api.subscribe(l); api.send({ type: 'SET_VALUE', field: 'x', value: '1' }); expect(l).toHaveBeenCalledTimes(1); api.destroy(); api.send({ type: 'SET_VALUE', field: 'x', value: '2' }); expect(l).toHaveBeenCalledTimes(1); });
  it('isValid hata olmadikca true', () => { const api = createFormEngine({ fields: [{ name: 'x', type: 'text', label: 'X' }] }); expect(api.getContext().isValid).toBe(true); api.destroy(); });
});
