/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createRating } from './rating.machine';

describe('createRating', () => {
  // ── Baslangic durumu ──

  it('varsayilan context degerleri dogru', () => {
    const api = createRating();
    const ctx = api.getContext();
    expect(ctx.value).toBe(0);
    expect(ctx.hoveredValue).toBeNull();
    expect(ctx.isHovering).toBe(false);
  });

  it('defaultValue ile baslangic degeri atanir', () => {
    const api = createRating({ defaultValue: 3 });
    expect(api.getContext().value).toBe(3);
  });

  it('defaultValue 0 ile baslangic degeri 0', () => {
    const api = createRating({ defaultValue: 0 });
    expect(api.getContext().value).toBe(0);
  });

  // ── SET_VALUE ──

  it('SET_VALUE degeri gunceller', () => {
    const api = createRating();
    api.send({ type: 'SET_VALUE', value: 4 });
    expect(api.getContext().value).toBe(4);
  });

  it('SET_VALUE readOnly modda degeri degistirmez', () => {
    const api = createRating({ readOnly: true, defaultValue: 2 });
    api.send({ type: 'SET_VALUE', value: 4 });
    expect(api.getContext().value).toBe(2);
  });

  it('SET_VALUE count ustundeki degeri clamp eder', () => {
    const api = createRating({ count: 5 });
    api.send({ type: 'SET_VALUE', value: 8 });
    expect(api.getContext().value).toBe(5);
  });

  it('SET_VALUE negatif degeri 0 olarak clamp eder', () => {
    const api = createRating();
    api.send({ type: 'SET_VALUE', value: -3 });
    expect(api.getContext().value).toBe(0);
  });

  it('SET_VALUE allowHalf false ise tam sayiya yuvarlar', () => {
    const api = createRating({ allowHalf: false });
    api.send({ type: 'SET_VALUE', value: 3.7 });
    expect(api.getContext().value).toBe(4);
  });

  it('SET_VALUE allowHalf true ise 0.5 katina yuvarlar', () => {
    const api = createRating({ allowHalf: true });
    api.send({ type: 'SET_VALUE', value: 3.3 });
    expect(api.getContext().value).toBe(3.5);
  });

  it('SET_VALUE allowHalf true ise 0.5 e tam yuvarlar', () => {
    const api = createRating({ allowHalf: true });
    api.send({ type: 'SET_VALUE', value: 2.5 });
    expect(api.getContext().value).toBe(2.5);
  });

  it('SET_VALUE allowHalf true ise 2.8 i 3 e yuvarlar', () => {
    const api = createRating({ allowHalf: true });
    api.send({ type: 'SET_VALUE', value: 2.8 });
    expect(api.getContext().value).toBe(3);
  });

  it('SET_VALUE onChange callback cagirir', () => {
    const onChange = vi.fn();
    const api = createRating({ onChange });
    api.send({ type: 'SET_VALUE', value: 3 });
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('SET_VALUE readOnly modda onChange cagirmaz', () => {
    const onChange = vi.fn();
    const api = createRating({ readOnly: true, onChange });
    api.send({ type: 'SET_VALUE', value: 3 });
    expect(onChange).not.toHaveBeenCalled();
  });

  // ── HOVER ──

  it('HOVER hoveredValue ve isHovering gunceller', () => {
    const api = createRating();
    api.send({ type: 'HOVER', value: 3 });
    const ctx = api.getContext();
    expect(ctx.hoveredValue).toBe(3);
    expect(ctx.isHovering).toBe(true);
  });

  it('HOVER readOnly modda degistirmez', () => {
    const api = createRating({ readOnly: true });
    api.send({ type: 'HOVER', value: 3 });
    const ctx = api.getContext();
    expect(ctx.hoveredValue).toBeNull();
    expect(ctx.isHovering).toBe(false);
  });

  // ── HOVER_END ──

  it('HOVER_END hoveredValue null ve isHovering false yapar', () => {
    const api = createRating();
    api.send({ type: 'HOVER', value: 3 });
    api.send({ type: 'HOVER_END' });
    const ctx = api.getContext();
    expect(ctx.hoveredValue).toBeNull();
    expect(ctx.isHovering).toBe(false);
  });

  // ── CLEAR ──

  it('CLEAR degeri 0 yapar', () => {
    const api = createRating({ defaultValue: 4 });
    api.send({ type: 'CLEAR' });
    expect(api.getContext().value).toBe(0);
  });

  it('CLEAR onChange callback cagirir', () => {
    const onChange = vi.fn();
    const api = createRating({ defaultValue: 3, onChange });
    api.send({ type: 'CLEAR' });
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('CLEAR readOnly modda degistirmez', () => {
    const api = createRating({ readOnly: true, defaultValue: 3 });
    api.send({ type: 'CLEAR' });
    expect(api.getContext().value).toBe(3);
  });

  // ── Subscribe ──

  it('subscribe ile degisiklikler dinlenir', () => {
    const api = createRating();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_VALUE', value: 3 });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe sonrasi listener cagirilmaz', () => {
    const api = createRating();
    const listener = vi.fn();
    const unsub = api.subscribe(listener);
    unsub();
    api.send({ type: 'SET_VALUE', value: 3 });
    expect(listener).not.toHaveBeenCalled();
  });

  it('birden fazla subscriber desteklenir', () => {
    const api = createRating();
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    api.subscribe(listener1);
    api.subscribe(listener2);
    api.send({ type: 'SET_VALUE', value: 2 });
    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
  });

  // ── Destroy ──

  it('destroy sonrasi listener cagirilmaz', () => {
    const api = createRating();
    const listener = vi.fn();
    api.subscribe(listener);
    api.destroy();
    api.send({ type: 'SET_VALUE', value: 3 });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── Custom count ──

  it('count 10 ile clamp 10 a kadar calisir', () => {
    const api = createRating({ count: 10 });
    api.send({ type: 'SET_VALUE', value: 7 });
    expect(api.getContext().value).toBe(7);
  });

  it('count 3 ile clamp 3 ustunu keser', () => {
    const api = createRating({ count: 3 });
    api.send({ type: 'SET_VALUE', value: 5 });
    expect(api.getContext().value).toBe(3);
  });
});
