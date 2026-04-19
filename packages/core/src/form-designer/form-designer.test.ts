/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createFormDesigner, resetDesignerIdCounter } from './form-designer.machine';

beforeEach(() => { resetDesignerIdCounter(); });

describe('createFormDesigner', () => {
  it('varsayilan context', () => { const api = createFormDesigner(); expect(api.getContext().fields).toHaveLength(0); expect(api.getContext().selectedFieldId).toBeNull(); expect(api.getContext().fieldCount).toBe(0); api.destroy(); });
  it('ADD_FIELD alan ekler', () => { const api = createFormDesigner(); api.send({ type: 'ADD_FIELD', fieldType: 'text', label: 'Isim' }); expect(api.getContext().fields).toHaveLength(1); expect(api.getContext().fields[0]?.label).toBe('Isim'); expect(api.getContext().fields[0]?.type).toBe('text'); api.destroy(); });
  it('ADD_FIELD selectedFieldId gunceller', () => { const api = createFormDesigner(); api.send({ type: 'ADD_FIELD', fieldType: 'text' }); expect(api.getContext().selectedFieldId).toBe('field-1'); api.destroy(); });
  it('ADD_FIELD order arttirir', () => { const api = createFormDesigner(); api.send({ type: 'ADD_FIELD', fieldType: 'text' }); api.send({ type: 'ADD_FIELD', fieldType: 'number' }); expect(api.getContext().fields[0]?.order).toBe(0); expect(api.getContext().fields[1]?.order).toBe(1); api.destroy(); });
  it('REMOVE_FIELD alan siler', () => { const api = createFormDesigner(); api.send({ type: 'ADD_FIELD', fieldType: 'text' }); api.send({ type: 'REMOVE_FIELD', id: 'field-1' }); expect(api.getContext().fields).toHaveLength(0); api.destroy(); });
  it('REMOVE_FIELD selected temizler', () => { const api = createFormDesigner(); api.send({ type: 'ADD_FIELD', fieldType: 'text' }); api.send({ type: 'REMOVE_FIELD', id: 'field-1' }); expect(api.getContext().selectedFieldId).toBeNull(); api.destroy(); });
  it('REMOVE_FIELD order yeniden hesaplar', () => { const api = createFormDesigner(); api.send({ type: 'ADD_FIELD', fieldType: 'text' }); api.send({ type: 'ADD_FIELD', fieldType: 'number' }); api.send({ type: 'ADD_FIELD', fieldType: 'email' }); api.send({ type: 'REMOVE_FIELD', id: 'field-2' }); expect(api.getContext().fields[1]?.order).toBe(1); api.destroy(); });
  it('UPDATE_FIELD alani gunceller', () => { const api = createFormDesigner(); api.send({ type: 'ADD_FIELD', fieldType: 'text' }); api.send({ type: 'UPDATE_FIELD', id: 'field-1', updates: { label: 'Yeni Label', required: true } }); expect(api.getContext().fields[0]?.label).toBe('Yeni Label'); expect(api.getContext().fields[0]?.required).toBe(true); api.destroy(); });
  it('REORDER alani tasir', () => { const api = createFormDesigner(); api.send({ type: 'ADD_FIELD', fieldType: 'text', label: 'A' }); api.send({ type: 'ADD_FIELD', fieldType: 'number', label: 'B' }); api.send({ type: 'ADD_FIELD', fieldType: 'email', label: 'C' }); api.send({ type: 'REORDER', id: 'field-3', newOrder: 0 }); expect(api.getContext().fields[0]?.label).toBe('C'); api.destroy(); });
  it('REORDER clamp eder', () => { const api = createFormDesigner(); api.send({ type: 'ADD_FIELD', fieldType: 'text' }); api.send({ type: 'REORDER', id: 'field-1', newOrder: 10 }); expect(api.getContext().fields[0]?.order).toBe(0); api.destroy(); });
  it('SELECT_FIELD alan secer', () => { const api = createFormDesigner(); api.send({ type: 'ADD_FIELD', fieldType: 'text' }); api.send({ type: 'SELECT_FIELD', id: null }); expect(api.getContext().selectedFieldId).toBeNull(); api.destroy(); });
  it('SET_FIELDS listeyi degistirir', () => { const api = createFormDesigner(); api.send({ type: 'SET_FIELDS', fields: [{ id: 'x', order: 0, name: 'x', type: 'text', label: 'X' }] }); expect(api.getContext().fields).toHaveLength(1); api.destroy(); });
  it('schema ciktisi dogru', () => { const api = createFormDesigner(); api.send({ type: 'ADD_FIELD', fieldType: 'text', label: 'Isim' }); api.send({ type: 'ADD_FIELD', fieldType: 'email', label: 'E-posta' }); const schema = api.getContext().schema; expect(schema).toHaveLength(2); expect(schema[0]?.type).toBe('text'); expect(schema[1]?.type).toBe('email'); api.destroy(); });
  it('schema id ve order icermez', () => { const api = createFormDesigner(); api.send({ type: 'ADD_FIELD', fieldType: 'text' }); const schema = api.getContext().schema; const first = schema[0]; expect(first).toBeDefined(); if (first) { expect('id' in first).toBe(false); expect('order' in first).toBe(false); } api.destroy(); });
  it('onChange callback cagirilir', () => { const onChange = vi.fn(); const api = createFormDesigner({ onChange }); api.send({ type: 'ADD_FIELD', fieldType: 'text' }); expect(onChange).toHaveBeenCalled(); api.destroy(); });
  it('subscribe/destroy', () => { const api = createFormDesigner(); const l = vi.fn(); api.subscribe(l); api.send({ type: 'ADD_FIELD', fieldType: 'text' }); expect(l).toHaveBeenCalledTimes(1); api.destroy(); api.send({ type: 'ADD_FIELD', fieldType: 'number' }); expect(l).toHaveBeenCalledTimes(1); });
  it('config.fields ile baslar', () => { const api = createFormDesigner({ fields: [{ id: 'a', order: 0, name: 'a', type: 'text', label: 'A' }] }); expect(api.getContext().fieldCount).toBe(1); api.destroy(); });
});
