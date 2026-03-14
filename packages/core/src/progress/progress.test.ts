/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createProgress } from './progress.machine';

describe('createProgress', () => {
  // ── Defaults ──────────────────────────────────────
  it('varsayilan context olusturur', () => {
    const api = createProgress();
    const ctx = api.getContext();
    expect(ctx.value).toBe(0);
    expect(ctx.min).toBe(0);
    expect(ctx.max).toBe(100);
    expect(ctx.indeterminate).toBe(false);
  });

  it('config ile baslangic degerleri alir', () => {
    const api = createProgress({ value: 50, min: 10, max: 200 });
    const ctx = api.getContext();
    expect(ctx.value).toBe(50);
    expect(ctx.min).toBe(10);
    expect(ctx.max).toBe(200);
  });

  it('indeterminate mode ile baslar', () => {
    const api = createProgress({ indeterminate: true });
    expect(api.getContext().indeterminate).toBe(true);
  });

  // ── Value clamping ────────────────────────────────
  it('baslangic degerini min-max arasinda clamp eder', () => {
    const api = createProgress({ value: 150, max: 100 });
    expect(api.getContext().value).toBe(100);
  });

  it('negatif baslangic degerini min a clamp eder', () => {
    const api = createProgress({ value: -10, min: 0 });
    expect(api.getContext().value).toBe(0);
  });

  // ── SET_VALUE ─────────────────────────────────────
  it('SET_VALUE ile degeri gunceller', () => {
    const api = createProgress();
    api.send({ type: 'SET_VALUE', value: 75 });
    expect(api.getContext().value).toBe(75);
  });

  it('SET_VALUE max asimi clamp eder', () => {
    const api = createProgress({ max: 100 });
    api.send({ type: 'SET_VALUE', value: 200 });
    expect(api.getContext().value).toBe(100);
  });

  it('SET_VALUE min alti clamp eder', () => {
    const api = createProgress({ min: 0 });
    api.send({ type: 'SET_VALUE', value: -5 });
    expect(api.getContext().value).toBe(0);
  });

  it('SET_VALUE ayni deger olunca notify etmez', () => {
    const api = createProgress({ value: 50 });
    const cb = vi.fn();
    api.subscribe(cb);
    api.send({ type: 'SET_VALUE', value: 50 });
    expect(cb).not.toHaveBeenCalled();
  });

  it('SET_VALUE farkli deger olunca notify eder', () => {
    const api = createProgress({ value: 50 });
    const cb = vi.fn();
    api.subscribe(cb);
    api.send({ type: 'SET_VALUE', value: 60 });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  // ── SET_INDETERMINATE ─────────────────────────────
  it('SET_INDETERMINATE ile mod degistirir', () => {
    const api = createProgress();
    api.send({ type: 'SET_INDETERMINATE', indeterminate: true });
    expect(api.getContext().indeterminate).toBe(true);
  });

  it('SET_INDETERMINATE ayni deger olunca notify etmez', () => {
    const api = createProgress({ indeterminate: true });
    const cb = vi.fn();
    api.subscribe(cb);
    api.send({ type: 'SET_INDETERMINATE', indeterminate: true });
    expect(cb).not.toHaveBeenCalled();
  });

  it('SET_INDETERMINATE farkli deger olunca notify eder', () => {
    const api = createProgress();
    const cb = vi.fn();
    api.subscribe(cb);
    api.send({ type: 'SET_INDETERMINATE', indeterminate: true });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  // ── getPercent ────────────────────────────────────
  it('getPercent yuzde hesaplar', () => {
    const api = createProgress({ value: 50, min: 0, max: 100 });
    expect(api.getPercent()).toBe(50);
  });

  it('getPercent ozel min-max ile hesaplar', () => {
    const api = createProgress({ value: 30, min: 20, max: 120 });
    expect(api.getPercent()).toBe(10);
  });

  it('getPercent 0 deger icin 0 doner', () => {
    const api = createProgress({ value: 0, min: 0, max: 100 });
    expect(api.getPercent()).toBe(0);
  });

  it('getPercent tam deger icin 100 doner', () => {
    const api = createProgress({ value: 100, min: 0, max: 100 });
    expect(api.getPercent()).toBe(100);
  });

  it('getPercent min === max ise 0 doner (division by zero koruması)', () => {
    const api = createProgress({ value: 50, min: 50, max: 50 });
    expect(api.getPercent()).toBe(0);
  });

  // ── getRootProps ──────────────────────────────────
  it('getRootProps role=progressbar doner', () => {
    const api = createProgress({ value: 30 });
    const props = api.getRootProps();
    expect(props.role).toBe('progressbar');
    expect(props['aria-valuemin']).toBe(0);
    expect(props['aria-valuemax']).toBe(100);
    expect(props['aria-valuenow']).toBe(30);
  });

  it('getRootProps indeterminate modda aria-valuenow vermez', () => {
    const api = createProgress({ value: 30, indeterminate: true });
    const props = api.getRootProps();
    expect(props.role).toBe('progressbar');
    expect(props['aria-valuenow']).toBeUndefined();
  });

  it('getRootProps ozel min-max doner', () => {
    const api = createProgress({ value: 50, min: 10, max: 200 });
    const props = api.getRootProps();
    expect(props['aria-valuemin']).toBe(10);
    expect(props['aria-valuemax']).toBe(200);
    expect(props['aria-valuenow']).toBe(50);
  });

  // ── Subscribe ─────────────────────────────────────
  it('subscribe ile dinler, unsubscribe ile iptal', () => {
    const api = createProgress();
    const cb = vi.fn();
    const unsub = api.subscribe(cb);
    api.send({ type: 'SET_VALUE', value: 10 });
    expect(cb).toHaveBeenCalledTimes(1);
    unsub();
    api.send({ type: 'SET_VALUE', value: 20 });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('birden fazla listener destekler', () => {
    const api = createProgress();
    const cb1 = vi.fn();
    const cb2 = vi.fn();
    api.subscribe(cb1);
    api.subscribe(cb2);
    api.send({ type: 'SET_VALUE', value: 40 });
    expect(cb1).toHaveBeenCalledTimes(1);
    expect(cb2).toHaveBeenCalledTimes(1);
  });

  // ── SET_VALUE sonrasi getPercent guncellenmis ─────
  it('SET_VALUE sonrasi getPercent dogru hesaplar', () => {
    const api = createProgress();
    api.send({ type: 'SET_VALUE', value: 75 });
    expect(api.getPercent()).toBe(75);
  });

  // ── Edge case: float values ───────────────────────
  it('float degerler clamp ile korunur', () => {
    const api = createProgress({ value: 33.33, max: 100 });
    expect(api.getContext().value).toBe(33.33);
    expect(api.getPercent()).toBeCloseTo(33.33, 1);
  });
});
