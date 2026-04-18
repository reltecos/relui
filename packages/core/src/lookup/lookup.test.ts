/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createLookup } from './lookup.machine';
import type { LookupItem } from './lookup.types';

const items: LookupItem[] = [
  { id: '1', label: 'Apple' },
  { id: '2', label: 'Banana' },
  { id: '3', label: 'Cherry' },
];

describe('createLookup', () => {
  it('baslangic state kapali', () => {
    const api = createLookup();
    expect(api.getContext().isOpen).toBe(false);
    expect(api.getContext().query).toBe('');
  });

  it('SET_QUERY sorguyu ayarlar ve acar', () => {
    const api = createLookup();
    api.send({ type: 'SET_QUERY', query: 'ap' });
    expect(api.getContext().query).toBe('ap');
    expect(api.getContext().isOpen).toBe(true);
  });

  it('minChars altinda acilmaz', () => {
    const api = createLookup({ minChars: 3 });
    api.send({ type: 'SET_QUERY', query: 'ab' });
    expect(api.getContext().isOpen).toBe(false);
  });

  it('SET_ITEMS item lari ayarlar', () => {
    const api = createLookup();
    api.send({ type: 'SET_ITEMS', items });
    expect(api.getContext().items).toHaveLength(3);
  });

  it('SET_LOADING loading state degistirir', () => {
    const api = createLookup();
    api.send({ type: 'SET_LOADING', loading: true });
    expect(api.getContext().isLoading).toBe(true);
  });

  it('SET_ITEMS loading u false yapar', () => {
    const api = createLookup();
    api.send({ type: 'SET_LOADING', loading: true });
    api.send({ type: 'SET_ITEMS', items });
    expect(api.getContext().isLoading).toBe(false);
  });

  it('HIGHLIGHT_NEXT indeksi ilerletir', () => {
    const api = createLookup();
    api.send({ type: 'SET_QUERY', query: 'a' });
    api.send({ type: 'SET_ITEMS', items });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getContext().highlightedIndex).toBe(1);
  });

  it('HIGHLIGHT_PREV indeksi geriletir', () => {
    const api = createLookup();
    api.send({ type: 'SET_QUERY', query: 'a' });
    api.send({ type: 'SET_ITEMS', items });
    api.send({ type: 'HIGHLIGHT_PREV' });
    expect(api.getContext().highlightedIndex).toBe(2);
  });

  it('SELECT_ITEM secim yapar ve kapatir', () => {
    const onSelect = vi.fn();
    const api = createLookup({ onSelect });
    api.send({ type: 'SET_QUERY', query: 'a' });
    api.send({ type: 'SET_ITEMS', items });
    api.send({ type: 'SELECT_ITEM' });
    expect(onSelect).toHaveBeenCalledWith(items[0]);
    expect(api.getContext().isOpen).toBe(false);
    expect(api.getContext().selectedItem?.id).toBe('1');
  });

  it('SELECT_ITEM index ile secim', () => {
    const onSelect = vi.fn();
    const api = createLookup({ onSelect });
    api.send({ type: 'SET_QUERY', query: 'a' });
    api.send({ type: 'SET_ITEMS', items });
    api.send({ type: 'SELECT_ITEM', index: 2 });
    expect(onSelect).toHaveBeenCalledWith(items[2]);
  });

  it('SELECT_ITEM sonrasi query secilen label olur', () => {
    const api = createLookup();
    api.send({ type: 'SET_QUERY', query: 'a' });
    api.send({ type: 'SET_ITEMS', items });
    api.send({ type: 'SELECT_ITEM' });
    expect(api.getContext().query).toBe('Apple');
  });

  it('CLOSE kapatir', () => {
    const api = createLookup();
    api.send({ type: 'SET_QUERY', query: 'a' });
    api.send({ type: 'CLOSE' });
    expect(api.getContext().isOpen).toBe(false);
  });

  it('CLEAR tum state sifirlar', () => {
    const api = createLookup();
    api.send({ type: 'SET_QUERY', query: 'a' });
    api.send({ type: 'SET_ITEMS', items });
    api.send({ type: 'CLEAR' });
    expect(api.getContext().query).toBe('');
    expect(api.getContext().items).toHaveLength(0);
    expect(api.getContext().selectedItem).toBeNull();
  });

  it('subscribe bildirim alir', () => {
    const api = createLookup();
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'SET_QUERY', query: 'x' });
    expect(fn).toHaveBeenCalledOnce();
  });

  it('destroy listener temizler', () => {
    const api = createLookup();
    const fn = vi.fn();
    api.subscribe(fn);
    api.destroy();
    api.send({ type: 'SET_QUERY', query: 'x' });
    expect(fn).not.toHaveBeenCalled();
  });
});
