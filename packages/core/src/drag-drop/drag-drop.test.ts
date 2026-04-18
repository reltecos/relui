/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createDragDrop } from './drag-drop.machine';

const item = { id: 'item-1', type: 'card' };
const target = { id: 'zone-1', accepts: ['card'], rect: { x: 100, y: 100, width: 200, height: 200 } };

describe('createDragDrop', () => {
  it('baslangicta isDragging false', () => {
    expect(createDragDrop().getContext().isDragging).toBe(false);
  });

  it('baslangicta activeItem null', () => {
    expect(createDragDrop().getContext().activeItem).toBeNull();
  });

  it('DRAG_START suruklemeyi baslatir', () => {
    const api = createDragDrop();
    api.send({ type: 'DRAG_START', item, position: { x: 50, y: 50 } });
    const ctx = api.getContext();
    expect(ctx.isDragging).toBe(true);
    expect(ctx.activeItem?.id).toBe('item-1');
    expect(ctx.position).toEqual({ x: 50, y: 50 });
  });

  it('DRAG_MOVE pozisyonu gunceller', () => {
    const api = createDragDrop();
    api.send({ type: 'DRAG_START', item, position: { x: 0, y: 0 } });
    api.send({ type: 'DRAG_MOVE', position: { x: 100, y: 100 } });
    expect(api.getContext().position).toEqual({ x: 100, y: 100 });
  });

  it('DRAG_MOVE surukleme yoksa islem yapmaz', () => {
    const api = createDragDrop();
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'DRAG_MOVE', position: { x: 10, y: 10 } });
    expect(fn).not.toHaveBeenCalled();
  });

  it('DRAG_END suruklemeyi bitirir', () => {
    const api = createDragDrop();
    api.send({ type: 'DRAG_START', item, position: { x: 0, y: 0 } });
    api.send({ type: 'DRAG_END' });
    expect(api.getContext().isDragging).toBe(false);
    expect(api.getContext().activeItem).toBeNull();
  });

  it('DRAG_END surukleme yoksa islem yapmaz', () => {
    const api = createDragDrop();
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'DRAG_END' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('REGISTER_DROPPABLE hedef kaydeder', () => {
    const api = createDragDrop();
    api.send({ type: 'REGISTER_DROPPABLE', target });
    // Hedef uzerine surukleme yapildiginda overTargetId set edilmeli
    api.send({ type: 'DRAG_START', item, position: { x: 150, y: 150 } });
    expect(api.getContext().overTargetId).toBe('zone-1');
  });

  it('UNREGISTER_DROPPABLE hedef siler', () => {
    const api = createDragDrop();
    api.send({ type: 'REGISTER_DROPPABLE', target });
    api.send({ type: 'UNREGISTER_DROPPABLE', targetId: 'zone-1' });
    api.send({ type: 'DRAG_START', item, position: { x: 150, y: 150 } });
    expect(api.getContext().overTargetId).toBeNull();
  });

  it('collision detection hedefe girince overTargetId set edilir', () => {
    const api = createDragDrop();
    api.send({ type: 'REGISTER_DROPPABLE', target });
    api.send({ type: 'DRAG_START', item, position: { x: 50, y: 50 } });
    expect(api.getContext().overTargetId).toBeNull();
    api.send({ type: 'DRAG_MOVE', position: { x: 150, y: 150 } });
    expect(api.getContext().overTargetId).toBe('zone-1');
  });

  it('collision detection hedeften cikinca overTargetId null olur', () => {
    const api = createDragDrop();
    api.send({ type: 'REGISTER_DROPPABLE', target });
    api.send({ type: 'DRAG_START', item, position: { x: 150, y: 150 } });
    expect(api.getContext().overTargetId).toBe('zone-1');
    api.send({ type: 'DRAG_MOVE', position: { x: 50, y: 50 } });
    expect(api.getContext().overTargetId).toBeNull();
  });

  it('accepts ile uyusmeyen tip overTargetId null olur', () => {
    const api = createDragDrop();
    api.send({ type: 'REGISTER_DROPPABLE', target: { ...target, accepts: ['file'] } });
    api.send({ type: 'DRAG_START', item, position: { x: 150, y: 150 } });
    expect(api.getContext().overTargetId).toBeNull();
  });

  it('onDrop hedef uzerinde DRAG_END ile cagirilir', () => {
    const onDrop = vi.fn();
    const api = createDragDrop({ onDrop });
    api.send({ type: 'REGISTER_DROPPABLE', target });
    api.send({ type: 'DRAG_START', item, position: { x: 150, y: 150 } });
    api.send({ type: 'DRAG_END' });
    expect(onDrop).toHaveBeenCalledWith(item, 'zone-1');
  });

  it('onDrop hedef disinda DRAG_END ile cagirilmaz', () => {
    const onDrop = vi.fn();
    const api = createDragDrop({ onDrop });
    api.send({ type: 'REGISTER_DROPPABLE', target });
    api.send({ type: 'DRAG_START', item, position: { x: 50, y: 50 } });
    api.send({ type: 'DRAG_END' });
    expect(onDrop).not.toHaveBeenCalled();
  });

  it('onDragStart callback cagirilir', () => {
    const fn = vi.fn();
    const api = createDragDrop({ onDragStart: fn });
    api.send({ type: 'DRAG_START', item, position: { x: 0, y: 0 } });
    expect(fn).toHaveBeenCalledWith(item);
  });

  it('onDragEnd callback cagirilir', () => {
    const fn = vi.fn();
    const api = createDragDrop({ onDragEnd: fn });
    api.send({ type: 'DRAG_START', item, position: { x: 0, y: 0 } });
    api.send({ type: 'DRAG_END' });
    expect(fn).toHaveBeenCalled();
  });

  it('UPDATE_DROPPABLE_RECT rect gunceller', () => {
    const api = createDragDrop();
    api.send({ type: 'REGISTER_DROPPABLE', target: { id: 'z', accepts: ['card'] } });
    api.send({ type: 'UPDATE_DROPPABLE_RECT', targetId: 'z', rect: { x: 0, y: 0, width: 100, height: 100 } });
    api.send({ type: 'DRAG_START', item, position: { x: 50, y: 50 } });
    expect(api.getContext().overTargetId).toBe('z');
  });

  it('subscribe ve destroy calisir', () => {
    const api = createDragDrop();
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'DRAG_START', item, position: { x: 0, y: 0 } });
    expect(fn).toHaveBeenCalledTimes(1);
    api.destroy();
    api.send({ type: 'DRAG_END' });
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
