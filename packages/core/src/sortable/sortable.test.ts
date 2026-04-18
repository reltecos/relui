/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createSortable } from './sortable.machine';

const baseItems = ['a', 'b', 'c', 'd', 'e'];

describe('createSortable', () => {
  it('baslangic items ayarlanir', () => {
    const api = createSortable({ items: baseItems });
    expect(api.getContext().items).toEqual(baseItems);
  });

  it('baslangicta isDragging false', () => {
    expect(createSortable({ items: baseItems }).getContext().isDragging).toBe(false);
  });

  it('baslangicta activeId null', () => {
    expect(createSortable({ items: baseItems }).getContext().activeId).toBeNull();
  });

  it('DRAG_START suruklemeyi baslatir', () => {
    const api = createSortable({ items: baseItems });
    api.send({ type: 'DRAG_START', itemId: 'b' });
    expect(api.getContext().activeId).toBe('b');
    expect(api.getContext().isDragging).toBe(true);
    expect(api.getContext().overIndex).toBe(1);
  });

  it('DRAG_START olmayan item icin islem yapmaz', () => {
    const api = createSortable({ items: baseItems });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'DRAG_START', itemId: 'nonexistent' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('DRAG_OVER overIndex gunceller', () => {
    const api = createSortable({ items: baseItems });
    api.send({ type: 'DRAG_START', itemId: 'a' });
    api.send({ type: 'DRAG_OVER', overIndex: 3 });
    expect(api.getContext().overIndex).toBe(3);
  });

  it('DRAG_OVER aktif surukleme yoksa islem yapmaz', () => {
    const api = createSortable({ items: baseItems });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'DRAG_OVER', overIndex: 2 });
    expect(fn).not.toHaveBeenCalled();
  });

  it('DRAG_OVER gecersiz index icin islem yapmaz', () => {
    const api = createSortable({ items: baseItems });
    api.send({ type: 'DRAG_START', itemId: 'a' });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'DRAG_OVER', overIndex: -1 });
    expect(fn).not.toHaveBeenCalled();
    api.send({ type: 'DRAG_OVER', overIndex: 99 });
    expect(fn).not.toHaveBeenCalled();
  });

  it('DRAG_END ile oge tasinir', () => {
    const api = createSortable({ items: baseItems });
    api.send({ type: 'DRAG_START', itemId: 'a' });
    api.send({ type: 'DRAG_OVER', overIndex: 3 });
    api.send({ type: 'DRAG_END' });
    expect(api.getContext().items).toEqual(['b', 'c', 'd', 'a', 'e']);
    expect(api.getContext().isDragging).toBe(false);
  });

  it('DRAG_END ayni pozisyona tasima items degistirmez', () => {
    const api = createSortable({ items: baseItems });
    api.send({ type: 'DRAG_START', itemId: 'c' });
    api.send({ type: 'DRAG_OVER', overIndex: 2 });
    api.send({ type: 'DRAG_END' });
    expect(api.getContext().items).toEqual(baseItems);
  });

  it('DRAG_END surukleme yoksa islem yapmaz', () => {
    const api = createSortable({ items: baseItems });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'DRAG_END' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('REORDER dogrudan siralama degistirir', () => {
    const api = createSortable({ items: baseItems });
    api.send({ type: 'REORDER', fromIndex: 0, toIndex: 4 });
    expect(api.getContext().items).toEqual(['b', 'c', 'd', 'e', 'a']);
  });

  it('REORDER ayni index icin islem yapmaz', () => {
    const api = createSortable({ items: baseItems });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'REORDER', fromIndex: 2, toIndex: 2 });
    expect(fn).not.toHaveBeenCalled();
  });

  it('REORDER gecersiz index icin islem yapmaz', () => {
    const api = createSortable({ items: baseItems });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'REORDER', fromIndex: -1, toIndex: 2 });
    expect(fn).not.toHaveBeenCalled();
  });

  it('onReorder callback cagirilir', () => {
    const fn = vi.fn();
    const api = createSortable({ items: baseItems, onReorder: fn });
    api.send({ type: 'DRAG_START', itemId: 'a' });
    api.send({ type: 'DRAG_OVER', overIndex: 2 });
    api.send({ type: 'DRAG_END' });
    expect(fn).toHaveBeenCalledWith(['b', 'c', 'a', 'd', 'e']);
  });

  it('onReorder REORDER ile de cagirilir', () => {
    const fn = vi.fn();
    const api = createSortable({ items: baseItems, onReorder: fn });
    api.send({ type: 'REORDER', fromIndex: 4, toIndex: 0 });
    expect(fn).toHaveBeenCalledWith(['e', 'a', 'b', 'c', 'd']);
  });

  it('subscribe ve destroy calisir', () => {
    const api = createSortable({ items: baseItems });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'DRAG_START', itemId: 'a' });
    expect(fn).toHaveBeenCalledTimes(1);
    api.destroy();
    api.send({ type: 'DRAG_END' });
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
