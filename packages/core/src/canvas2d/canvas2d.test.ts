/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createCanvas2D } from './canvas2d.machine';
import type { CanvasShape } from './canvas2d.types';

const RECT: CanvasShape = {
  id: 'r1', type: 'rect', x: 10, y: 20, width: 100, height: 50,
  rotation: 0, fill: '#ff0000', stroke: '#000', strokeWidth: 1,
  zIndex: 0, visible: true, locked: false,
};

const ELLIPSE: CanvasShape = {
  id: 'e1', type: 'ellipse', x: 200, y: 100, width: 80, height: 60,
  rotation: 0, fill: '#00ff00', stroke: '#000', strokeWidth: 1,
  zIndex: 1, visible: true, locked: false,
};

describe('createCanvas2D', () => {
  it('varsayilan degerle olusturulur', () => {
    const c = createCanvas2D();
    expect(c.getContext().shapes).toHaveLength(0);
    expect(c.getContext().zoom).toBe(1);
  });

  it('defaultShapes ile olusturulur', () => {
    const c = createCanvas2D({ defaultShapes: [RECT, ELLIPSE] });
    expect(c.getContext().shapes).toHaveLength(2);
  });

  it('ADD_SHAPE ile sekil eklenir', () => {
    const c = createCanvas2D();
    c.send({ type: 'ADD_SHAPE', shape: RECT });
    expect(c.getContext().shapes).toHaveLength(1);
  });

  it('DELETE_SHAPE ile sekil silinir', () => {
    const c = createCanvas2D({ defaultShapes: [RECT, ELLIPSE] });
    c.send({ type: 'DELETE_SHAPE', shapeId: 'r1' });
    expect(c.getContext().shapes).toHaveLength(1);
  });

  it('DELETE_SHAPE olmayan id icin notify etmez', () => {
    const c = createCanvas2D();
    const listener = vi.fn();
    c.subscribe(listener);
    c.send({ type: 'DELETE_SHAPE', shapeId: 'nope' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('UPDATE_SHAPE ile sekil guncellenir', () => {
    const c = createCanvas2D({ defaultShapes: [RECT] });
    c.send({ type: 'UPDATE_SHAPE', shapeId: 'r1', updates: { fill: '#0000ff' } });
    expect(c.getContext().shapes[0]?.fill).toBe('#0000ff');
  });

  it('MOVE_SHAPE ile sekil tasinir', () => {
    const c = createCanvas2D({ defaultShapes: [RECT] });
    c.send({ type: 'MOVE_SHAPE', shapeId: 'r1', x: 50, y: 60 });
    expect(c.getContext().shapes[0]?.x).toBe(50);
    expect(c.getContext().shapes[0]?.y).toBe(60);
  });

  it('MOVE_SHAPE locked sekil tasinmaz', () => {
    const locked = { ...RECT, locked: true };
    const c = createCanvas2D({ defaultShapes: [locked] });
    const listener = vi.fn();
    c.subscribe(listener);
    c.send({ type: 'MOVE_SHAPE', shapeId: 'r1', x: 999, y: 999 });
    expect(listener).not.toHaveBeenCalled();
  });

  it('MOVE_SHAPE snapToGrid ile yuvarlanir', () => {
    const c = createCanvas2D({ defaultShapes: [RECT], gridSize: 10, snapToGrid: true });
    c.send({ type: 'MOVE_SHAPE', shapeId: 'r1', x: 13, y: 27 });
    expect(c.getContext().shapes[0]?.x).toBe(10);
    expect(c.getContext().shapes[0]?.y).toBe(30);
  });

  it('RESIZE_SHAPE ile boyut degisir', () => {
    const c = createCanvas2D({ defaultShapes: [RECT] });
    c.send({ type: 'RESIZE_SHAPE', shapeId: 'r1', width: 200, height: 100 });
    expect(c.getContext().shapes[0]?.width).toBe(200);
    expect(c.getContext().shapes[0]?.height).toBe(100);
  });

  it('RESIZE_SHAPE minimum 1', () => {
    const c = createCanvas2D({ defaultShapes: [RECT] });
    c.send({ type: 'RESIZE_SHAPE', shapeId: 'r1', width: -5, height: 0 });
    expect(c.getContext().shapes[0]?.width).toBe(1);
    expect(c.getContext().shapes[0]?.height).toBe(1);
  });

  it('SELECT ile sekil secilir', () => {
    const c = createCanvas2D({ defaultShapes: [RECT] });
    c.send({ type: 'SELECT', ids: ['r1'] });
    expect(c.getContext().selectedIds.has('r1')).toBe(true);
  });

  it('DESELECT_ALL ile secim temizlenir', () => {
    const c = createCanvas2D({ defaultShapes: [RECT] });
    c.send({ type: 'SELECT', ids: ['r1'] });
    c.send({ type: 'DESELECT_ALL' });
    expect(c.getContext().selectedIds.size).toBe(0);
  });

  it('BRING_FORWARD ile zIndex artar', () => {
    const c = createCanvas2D({ defaultShapes: [RECT, ELLIPSE] });
    c.send({ type: 'BRING_FORWARD', shapeId: 'r1' });
    expect(c.getContext().shapes.find((s) => s.id === 'r1')?.zIndex).toBe(2);
  });

  it('SEND_BACKWARD ile zIndex azalir', () => {
    const c = createCanvas2D({ defaultShapes: [RECT, ELLIPSE] });
    c.send({ type: 'SEND_BACKWARD', shapeId: 'e1' });
    expect(c.getContext().shapes.find((s) => s.id === 'e1')?.zIndex).toBe(-1);
  });

  it('SET_ZOOM ile zum ayarlanir', () => {
    const c = createCanvas2D();
    c.send({ type: 'SET_ZOOM', zoom: 2 });
    expect(c.getContext().zoom).toBe(2);
  });

  it('SET_PAN ile pan ayarlanir', () => {
    const c = createCanvas2D();
    c.send({ type: 'SET_PAN', panX: 100, panY: -50 });
    expect(c.getContext().panX).toBe(100);
  });

  it('UNDO son islemi geri alir', () => {
    const c = createCanvas2D();
    c.send({ type: 'ADD_SHAPE', shape: RECT });
    c.send({ type: 'UNDO' });
    expect(c.getContext().shapes).toHaveLength(0);
  });

  it('REDO geri alinan islemi yineler', () => {
    const c = createCanvas2D();
    c.send({ type: 'ADD_SHAPE', shape: RECT });
    c.send({ type: 'UNDO' });
    c.send({ type: 'REDO' });
    expect(c.getContext().shapes).toHaveLength(1);
  });

  it('canUndo / canRedo dogru set edilir', () => {
    const c = createCanvas2D();
    expect(c.getContext().canUndo).toBe(false);
    c.send({ type: 'ADD_SHAPE', shape: RECT });
    expect(c.getContext().canUndo).toBe(true);
  });

  it('exportJSON JSON uretir', () => {
    const c = createCanvas2D({ defaultShapes: [RECT] });
    const json = c.exportJSON();
    const parsed = JSON.parse(json) as CanvasShape[];
    expect(parsed).toHaveLength(1);
    expect(parsed[0]?.id).toBe('r1');
  });

  it('onChange callback cagirilir', () => {
    const onChange = vi.fn();
    const c = createCanvas2D({ onChange });
    c.send({ type: 'ADD_SHAPE', shape: RECT });
    expect(onChange).toHaveBeenCalled();
  });

  it('subscribe calisiyor', () => {
    const c = createCanvas2D();
    const listener = vi.fn();
    c.subscribe(listener);
    c.send({ type: 'ADD_SHAPE', shape: RECT });
    expect(listener).toHaveBeenCalled();
  });

  it('destroy calisiyor', () => {
    const c = createCanvas2D();
    const listener = vi.fn();
    c.subscribe(listener);
    c.destroy();
    c.send({ type: 'ADD_SHAPE', shape: RECT });
    expect(listener).not.toHaveBeenCalled();
  });
});
