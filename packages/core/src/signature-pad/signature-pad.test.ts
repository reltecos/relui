/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createSignaturePad } from './signature-pad.machine';

describe('createSignaturePad', () => {
  it('baslangicta bos', () => {
    const api = createSignaturePad();
    const ctx = api.getContext();
    expect(ctx.isEmpty).toBe(true);
    expect(ctx.paths.length).toBe(0);
    expect(ctx.currentPath).toBeNull();
  });

  it('varsayilan stroke width 2', () => {
    const api = createSignaturePad();
    expect(api.getContext().strokeWidth).toBe(2);
  });

  it('varsayilan stroke color #000000', () => {
    const api = createSignaturePad();
    expect(api.getContext().strokeColor).toBe('#000000');
  });

  it('DRAW_START currentPath olusturur', () => {
    const api = createSignaturePad();
    api.send({ type: 'DRAW_START', x: 10, y: 20 });
    const ctx = api.getContext();
    expect(ctx.currentPath).not.toBeNull();
    expect(ctx.currentPath?.points.length).toBe(1);
    expect(ctx.currentPath?.points[0]?.x).toBe(10);
  });

  it('DRAW_MOVE nokta ekler', () => {
    const api = createSignaturePad();
    api.send({ type: 'DRAW_START', x: 0, y: 0 });
    api.send({ type: 'DRAW_MOVE', x: 10, y: 10 });
    api.send({ type: 'DRAW_MOVE', x: 20, y: 20 });
    expect(api.getContext().currentPath?.points.length).toBe(3);
  });

  it('DRAW_MOVE currentPath yoksa islem yapmaz', () => {
    const api = createSignaturePad();
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'DRAW_MOVE', x: 10, y: 10 });
    expect(fn).not.toHaveBeenCalled();
  });

  it('DRAW_END path i paths e ekler', () => {
    const api = createSignaturePad();
    api.send({ type: 'DRAW_START', x: 0, y: 0 });
    api.send({ type: 'DRAW_MOVE', x: 10, y: 10 });
    api.send({ type: 'DRAW_END' });
    const ctx = api.getContext();
    expect(ctx.paths.length).toBe(1);
    expect(ctx.currentPath).toBeNull();
    expect(ctx.isEmpty).toBe(false);
  });

  it('DRAW_END currentPath yoksa islem yapmaz', () => {
    const api = createSignaturePad();
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'DRAW_END' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('birden fazla path cizilebilir', () => {
    const api = createSignaturePad();
    api.send({ type: 'DRAW_START', x: 0, y: 0 });
    api.send({ type: 'DRAW_END' });
    api.send({ type: 'DRAW_START', x: 50, y: 50 });
    api.send({ type: 'DRAW_END' });
    expect(api.getContext().paths.length).toBe(2);
  });

  it('UNDO son path i kaldirir', () => {
    const api = createSignaturePad();
    api.send({ type: 'DRAW_START', x: 0, y: 0 });
    api.send({ type: 'DRAW_END' });
    api.send({ type: 'DRAW_START', x: 50, y: 50 });
    api.send({ type: 'DRAW_END' });
    api.send({ type: 'UNDO' });
    expect(api.getContext().paths.length).toBe(1);
  });

  it('UNDO paths bos ise islem yapmaz', () => {
    const api = createSignaturePad();
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'UNDO' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('canUndo paths varsa true', () => {
    const api = createSignaturePad();
    expect(api.getContext().canUndo).toBe(false);
    api.send({ type: 'DRAW_START', x: 0, y: 0 });
    api.send({ type: 'DRAW_END' });
    expect(api.getContext().canUndo).toBe(true);
  });

  it('CLEAR tum path leri temizler', () => {
    const api = createSignaturePad();
    api.send({ type: 'DRAW_START', x: 0, y: 0 });
    api.send({ type: 'DRAW_END' });
    api.send({ type: 'CLEAR' });
    expect(api.getContext().paths.length).toBe(0);
    expect(api.getContext().isEmpty).toBe(true);
  });

  it('CLEAR bos iken islem yapmaz', () => {
    const api = createSignaturePad();
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'CLEAR' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('SET_STROKE_WIDTH kalinlik degistirir', () => {
    const api = createSignaturePad();
    api.send({ type: 'SET_STROKE_WIDTH', width: 5 });
    expect(api.getContext().strokeWidth).toBe(5);
  });

  it('SET_STROKE_COLOR renk degistirir', () => {
    const api = createSignaturePad();
    api.send({ type: 'SET_STROKE_COLOR', color: '#ff0000' });
    expect(api.getContext().strokeColor).toBe('#ff0000');
  });

  it('yeni path mevcut stroke ayarlarini kullanir', () => {
    const api = createSignaturePad();
    api.send({ type: 'SET_STROKE_WIDTH', width: 4 });
    api.send({ type: 'SET_STROKE_COLOR', color: '#0000ff' });
    api.send({ type: 'DRAW_START', x: 0, y: 0 });
    api.send({ type: 'DRAW_END' });
    const path = api.getContext().paths[0];
    expect(path?.strokeWidth).toBe(4);
    expect(path?.strokeColor).toBe('#0000ff');
  });

  it('pressure degeri kaydedilir', () => {
    const api = createSignaturePad();
    api.send({ type: 'DRAW_START', x: 0, y: 0, pressure: 0.8 });
    expect(api.getContext().currentPath?.points[0]?.pressure).toBe(0.8);
  });

  it('config ile varsayilan degerler ayarlanir', () => {
    const api = createSignaturePad({ defaultStrokeWidth: 3, defaultStrokeColor: '#00ff00' });
    expect(api.getContext().strokeWidth).toBe(3);
    expect(api.getContext().strokeColor).toBe('#00ff00');
  });

  it('onChange callback cagirilir', () => {
    const onChange = vi.fn();
    const api = createSignaturePad({ onChange });
    api.send({ type: 'DRAW_START', x: 0, y: 0 });
    api.send({ type: 'DRAW_END' });
    expect(onChange).toHaveBeenCalled();
  });

  it('subscribe ve destroy calisir', () => {
    const api = createSignaturePad();
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'DRAW_START', x: 0, y: 0 });
    expect(fn).toHaveBeenCalledTimes(1);
    api.destroy();
    api.send({ type: 'DRAW_END' });
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
