/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createPropertyGrid } from './property-grid.machine';
import type { PropertyDef } from './property-grid.types';

const props: PropertyDef[] = [
  { key: 'name', label: 'Name', type: 'string', category: 'General', value: 'Widget' },
  { key: 'width', label: 'Width', type: 'number', category: 'Layout', value: 100 },
  { key: 'height', label: 'Height', type: 'number', category: 'Layout', value: 50 },
  { key: 'visible', label: 'Visible', type: 'boolean', category: 'General', value: true },
  { key: 'bg', label: 'Background', type: 'color', category: 'Appearance', value: '#ffffff' },
  { key: 'align', label: 'Align', type: 'enum', category: 'Layout', value: 'left', options: ['left', 'center', 'right'] },
  { key: 'id', label: 'ID', type: 'string', category: 'General', value: 'w1', readonly: true },
];

describe('createPropertyGrid', () => {
  // ── Initial state ──

  it('baslangic degerleri properties den alinir', () => {
    const api = createPropertyGrid({ properties: props });
    const ctx = api.getContext();
    expect(ctx.values.get('name')).toBe('Widget');
    expect(ctx.values.get('width')).toBe(100);
    expect(ctx.values.get('visible')).toBe(true);
  });

  it('baslangicta kategoriler acik', () => {
    const api = createPropertyGrid({ properties: props });
    expect(api.getContext().collapsedCategories.size).toBe(0);
  });

  it('baslangicta filtre bos', () => {
    const api = createPropertyGrid({ properties: props });
    expect(api.getContext().filter).toBe('');
  });

  // ── SET_VALUE ──

  it('SET_VALUE ile deger degisir', () => {
    const api = createPropertyGrid({ properties: props });
    api.send({ type: 'SET_VALUE', key: 'name', value: 'Updated' });
    expect(api.getContext().values.get('name')).toBe('Updated');
  });

  it('SET_VALUE number tip icin calisir', () => {
    const api = createPropertyGrid({ properties: props });
    api.send({ type: 'SET_VALUE', key: 'width', value: 200 });
    expect(api.getContext().values.get('width')).toBe(200);
  });

  it('SET_VALUE boolean tip icin calisir', () => {
    const api = createPropertyGrid({ properties: props });
    api.send({ type: 'SET_VALUE', key: 'visible', value: false });
    expect(api.getContext().values.get('visible')).toBe(false);
  });

  it('SET_VALUE color tip icin calisir', () => {
    const api = createPropertyGrid({ properties: props });
    api.send({ type: 'SET_VALUE', key: 'bg', value: '#ff0000' });
    expect(api.getContext().values.get('bg')).toBe('#ff0000');
  });

  it('SET_VALUE enum tip icin calisir', () => {
    const api = createPropertyGrid({ properties: props });
    api.send({ type: 'SET_VALUE', key: 'align', value: 'center' });
    expect(api.getContext().values.get('align')).toBe('center');
  });

  it('SET_VALUE readonly ozellik degistirilemez', () => {
    const api = createPropertyGrid({ properties: props });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'SET_VALUE', key: 'id', value: 'new-id' });
    expect(fn).not.toHaveBeenCalled();
    expect(api.getContext().values.get('id')).toBe('w1');
  });

  it('SET_VALUE olmayan key icin islem yapmaz', () => {
    const api = createPropertyGrid({ properties: props });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'SET_VALUE', key: 'nonexistent', value: 'x' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('onValueChange callback cagirilir', () => {
    const onValueChange = vi.fn();
    const api = createPropertyGrid({ properties: props, onValueChange });
    api.send({ type: 'SET_VALUE', key: 'name', value: 'New' });
    expect(onValueChange).toHaveBeenCalledWith('name', 'New');
  });

  // ── Category ──

  it('TOGGLE_CATEGORY kategoriyi kapatir', () => {
    const api = createPropertyGrid({ properties: props });
    api.send({ type: 'TOGGLE_CATEGORY', category: 'Layout' });
    expect(api.getContext().collapsedCategories.has('Layout')).toBe(true);
  });

  it('TOGGLE_CATEGORY kapali kategoriyi acar', () => {
    const api = createPropertyGrid({ properties: props });
    api.send({ type: 'TOGGLE_CATEGORY', category: 'Layout' });
    api.send({ type: 'TOGGLE_CATEGORY', category: 'Layout' });
    expect(api.getContext().collapsedCategories.has('Layout')).toBe(false);
  });

  it('EXPAND_ALL tum kategorileri acar', () => {
    const api = createPropertyGrid({ properties: props });
    api.send({ type: 'TOGGLE_CATEGORY', category: 'Layout' });
    api.send({ type: 'TOGGLE_CATEGORY', category: 'General' });
    api.send({ type: 'EXPAND_ALL' });
    expect(api.getContext().collapsedCategories.size).toBe(0);
  });

  it('EXPAND_ALL zaten aciksa notify olmaz', () => {
    const api = createPropertyGrid({ properties: props });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'EXPAND_ALL' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('COLLAPSE_ALL tum kategorileri kapatir', () => {
    const api = createPropertyGrid({ properties: props });
    api.send({ type: 'COLLAPSE_ALL', categories: ['General', 'Layout', 'Appearance'] });
    expect(api.getContext().collapsedCategories.size).toBe(3);
  });

  // ── Filter ──

  it('SET_FILTER filtre ayarlar', () => {
    const api = createPropertyGrid({ properties: props });
    api.send({ type: 'SET_FILTER', filter: 'width' });
    expect(api.getContext().filter).toBe('width');
  });

  it('SET_FILTER bos string ile filtre temizlenir', () => {
    const api = createPropertyGrid({ properties: props });
    api.send({ type: 'SET_FILTER', filter: 'test' });
    api.send({ type: 'SET_FILTER', filter: '' });
    expect(api.getContext().filter).toBe('');
  });

  // ── Subscribe / Destroy ──

  it('subscribe calisir', () => {
    const api = createPropertyGrid({ properties: props });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'SET_VALUE', key: 'name', value: 'X' });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe calisir', () => {
    const api = createPropertyGrid({ properties: props });
    const fn = vi.fn();
    const unsub = api.subscribe(fn);
    unsub();
    api.send({ type: 'SET_VALUE', key: 'name', value: 'X' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('destroy tum listener lari temizler', () => {
    const api = createPropertyGrid({ properties: props });
    const fn = vi.fn();
    api.subscribe(fn);
    api.destroy();
    api.send({ type: 'SET_VALUE', key: 'name', value: 'X' });
    expect(fn).not.toHaveBeenCalled();
  });
});
