/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createGauge } from './gauge.machine';

describe('createGauge', () => {
  it('varsayilan context doner', () => {
    const api = createGauge();
    const ctx = api.getContext();
    expect(ctx.value).toBe(0);
    expect(ctx.min).toBe(0);
    expect(ctx.max).toBe(100);
    expect(ctx.normalizedValue).toBe(0);
    api.destroy();
  });

  it('config.value ile baslar', () => {
    const api = createGauge({ value: 50 });
    expect(api.getContext().value).toBe(50);
    expect(api.getContext().normalizedValue).toBe(0.5);
    api.destroy();
  });

  it('config.min ve max ile baslar', () => {
    const api = createGauge({ min: 10, max: 110, value: 60 });
    expect(api.getContext().normalizedValue).toBe(0.5);
    api.destroy();
  });

  // ── SET_VALUE ──

  it('SET_VALUE degeri gunceller', () => {
    const api = createGauge();
    api.send({ type: 'SET_VALUE', value: 75 });
    expect(api.getContext().value).toBe(75);
    expect(api.getContext().normalizedValue).toBe(0.75);
    api.destroy();
  });

  it('SET_VALUE max ustune clamp eder', () => {
    const api = createGauge({ max: 100 });
    api.send({ type: 'SET_VALUE', value: 150 });
    expect(api.getContext().value).toBe(100);
    api.destroy();
  });

  it('SET_VALUE min altina clamp eder', () => {
    const api = createGauge({ min: 0 });
    api.send({ type: 'SET_VALUE', value: -10 });
    expect(api.getContext().value).toBe(0);
    api.destroy();
  });

  it('SET_VALUE onChange callback cagirir', () => {
    const onChange = vi.fn();
    const api = createGauge({ onChange });
    api.send({ type: 'SET_VALUE', value: 42 });
    expect(onChange).toHaveBeenCalledWith(42);
    api.destroy();
  });

  it('SET_VALUE ayni deger icin notify etmez', () => {
    const api = createGauge({ value: 50 });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_VALUE', value: 50 });
    expect(listener).not.toHaveBeenCalled();
    api.destroy();
  });

  // ── Needle angle ──

  it('needle angle min de startAngle olur', () => {
    const api = createGauge({ value: 0, startAngle: -135, endAngle: 135 });
    expect(api.getContext().needleAngle).toBe(-135);
    api.destroy();
  });

  it('needle angle max da endAngle olur', () => {
    const api = createGauge({ value: 100, startAngle: -135, endAngle: 135 });
    expect(api.getContext().needleAngle).toBe(135);
    api.destroy();
  });

  it('needle angle ortada ortalamadir', () => {
    const api = createGauge({ value: 50, startAngle: -135, endAngle: 135 });
    expect(api.getContext().needleAngle).toBe(0);
    api.destroy();
  });

  // ── Background arc ──

  it('backgroundArc SVG path icerir', () => {
    const api = createGauge();
    expect(api.getContext().backgroundArc).toContain('A');
    api.destroy();
  });

  // ── Segments ──

  it('segments arc verileri uretir', () => {
    const api = createGauge({
      segments: [
        { from: 0, to: 50, color: '#green' },
        { from: 50, to: 100, color: '#red' },
      ],
    });
    const arcs = api.getContext().arcs;
    expect(arcs).toHaveLength(2);
    expect(arcs[0]?.path).toContain('A');
    api.destroy();
  });

  // ── SET_MIN / SET_MAX ──

  it('SET_MIN gunceller', () => {
    const api = createGauge();
    api.send({ type: 'SET_MIN', min: 10 });
    expect(api.getContext().min).toBe(10);
    api.destroy();
  });

  it('SET_MAX gunceller', () => {
    const api = createGauge();
    api.send({ type: 'SET_MAX', max: 200 });
    expect(api.getContext().max).toBe(200);
    api.destroy();
  });

  // ── Subscribe ──

  it('subscribe listener cagirilir', () => {
    const api = createGauge();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_VALUE', value: 10 });
    expect(listener).toHaveBeenCalledTimes(1);
    api.destroy();
  });

  it('unsubscribe listener kaldirilir', () => {
    const api = createGauge();
    const listener = vi.fn();
    const unsub = api.subscribe(listener);
    unsub();
    api.send({ type: 'SET_VALUE', value: 10 });
    expect(listener).not.toHaveBeenCalled();
    api.destroy();
  });

  it('destroy listeners temizler', () => {
    const api = createGauge();
    const listener = vi.fn();
    api.subscribe(listener);
    api.destroy();
    api.send({ type: 'SET_VALUE', value: 10 });
    expect(listener).not.toHaveBeenCalled();
  });
});
