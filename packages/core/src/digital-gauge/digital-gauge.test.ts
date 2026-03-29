/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createDigitalGauge } from './digital-gauge.machine';

describe('createDigitalGauge', () => {
  // ── Create ──

  it('varsayilan degerlerle olusturulur', () => {
    const gauge = createDigitalGauge();
    const ctx = gauge.getContext();
    expect(ctx.value).toBe(0);
    expect(ctx.min).toBe(-Infinity);
    expect(ctx.max).toBe(Infinity);
    expect(ctx.precision).toBe(0);
  });

  it('config ile olusturulur', () => {
    const gauge = createDigitalGauge({ defaultValue: 50, min: 0, max: 100, precision: 2 });
    const ctx = gauge.getContext();
    expect(ctx.value).toBe(50);
    expect(ctx.min).toBe(0);
    expect(ctx.max).toBe(100);
    expect(ctx.precision).toBe(2);
  });

  it('defaultValue min/max arasinda clamp edilir', () => {
    const gauge = createDigitalGauge({ defaultValue: 200, min: 0, max: 100 });
    expect(gauge.getContext().value).toBe(100);
  });

  it('defaultValue min altinda clamp edilir', () => {
    const gauge = createDigitalGauge({ defaultValue: -50, min: 0, max: 100 });
    expect(gauge.getContext().value).toBe(0);
  });

  // ── SET_VALUE ──

  it('SET_VALUE ile deger guncellenir', () => {
    const gauge = createDigitalGauge({ min: 0, max: 100 });
    gauge.send({ type: 'SET_VALUE', value: 42 });
    expect(gauge.getContext().value).toBe(42);
  });

  it('SET_VALUE min/max arasinda clamp edilir', () => {
    const gauge = createDigitalGauge({ min: 0, max: 100 });
    gauge.send({ type: 'SET_VALUE', value: 150 });
    expect(gauge.getContext().value).toBe(100);
  });

  it('SET_VALUE min altinda clamp edilir', () => {
    const gauge = createDigitalGauge({ min: 0, max: 100 });
    gauge.send({ type: 'SET_VALUE', value: -10 });
    expect(gauge.getContext().value).toBe(0);
  });

  it('SET_VALUE ayni degerle notify etmez', () => {
    const onChange = vi.fn();
    const gauge = createDigitalGauge({ defaultValue: 50, onChange });
    gauge.send({ type: 'SET_VALUE', value: 50 });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('SET_VALUE farkli degerle onChange cagrilir', () => {
    const onChange = vi.fn();
    const gauge = createDigitalGauge({ defaultValue: 0, onChange });
    gauge.send({ type: 'SET_VALUE', value: 75 });
    expect(onChange).toHaveBeenCalledWith(75);
  });

  // ── SET_MIN ──

  it('SET_MIN ile minimum guncellenir', () => {
    const gauge = createDigitalGauge({ defaultValue: 50, min: 0, max: 100 });
    gauge.send({ type: 'SET_MIN', min: 10 });
    expect(gauge.getContext().min).toBe(10);
    expect(gauge.getContext().value).toBe(50);
  });

  it('SET_MIN value yi re-clamp eder', () => {
    const gauge = createDigitalGauge({ defaultValue: 5, min: 0, max: 100 });
    gauge.send({ type: 'SET_MIN', min: 20 });
    expect(gauge.getContext().value).toBe(20);
  });

  // ── SET_MAX ──

  it('SET_MAX ile maximum guncellenir', () => {
    const gauge = createDigitalGauge({ defaultValue: 50, min: 0, max: 100 });
    gauge.send({ type: 'SET_MAX', max: 200 });
    expect(gauge.getContext().max).toBe(200);
    expect(gauge.getContext().value).toBe(50);
  });

  it('SET_MAX value yi re-clamp eder', () => {
    const gauge = createDigitalGauge({ defaultValue: 80, min: 0, max: 100 });
    gauge.send({ type: 'SET_MAX', max: 50 });
    expect(gauge.getContext().value).toBe(50);
  });

  // ── RESET ──

  it('RESET ile varsayilan degere donulur', () => {
    const gauge = createDigitalGauge({ defaultValue: 25, min: 0, max: 100 });
    gauge.send({ type: 'SET_VALUE', value: 75 });
    gauge.send({ type: 'RESET' });
    expect(gauge.getContext().value).toBe(25);
  });

  it('RESET ayni degerdeyken notify etmez', () => {
    const onChange = vi.fn();
    const gauge = createDigitalGauge({ defaultValue: 25, onChange });
    gauge.send({ type: 'RESET' });
    expect(onChange).not.toHaveBeenCalled();
  });

  // ── Subscribe ──

  it('subscribe ile degisiklik bildirilir', () => {
    const gauge = createDigitalGauge();
    const listener = vi.fn();
    gauge.subscribe(listener);
    gauge.send({ type: 'SET_VALUE', value: 10 });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe calisiyor', () => {
    const gauge = createDigitalGauge();
    const listener = vi.fn();
    const unsub = gauge.subscribe(listener);
    unsub();
    gauge.send({ type: 'SET_VALUE', value: 10 });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── Destroy ──

  it('destroy tum listener lari temizler', () => {
    const gauge = createDigitalGauge();
    const listener = vi.fn();
    gauge.subscribe(listener);
    gauge.destroy();
    gauge.send({ type: 'SET_VALUE', value: 10 });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── Precision ──

  it('negatif precision 0 a yuvarlanir', () => {
    const gauge = createDigitalGauge({ precision: -3 });
    expect(gauge.getContext().precision).toBe(0);
  });
});
