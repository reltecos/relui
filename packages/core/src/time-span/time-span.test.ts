/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createTimeSpan } from './time-span.machine';

describe('createTimeSpan', () => {
  it('baslangic state sifir', () => {
    const api = createTimeSpan();
    const ctx = api.getContext();
    expect(ctx.hours).toBe(0);
    expect(ctx.minutes).toBe(0);
    expect(ctx.seconds).toBe(0);
    expect(ctx.totalSeconds).toBe(0);
    expect(ctx.totalMs).toBe(0);
  });

  it('default degerlerle baslar', () => {
    const api = createTimeSpan({ defaultHours: 1, defaultMinutes: 30, defaultSeconds: 15 });
    const ctx = api.getContext();
    expect(ctx.hours).toBe(1);
    expect(ctx.minutes).toBe(30);
    expect(ctx.seconds).toBe(15);
    expect(ctx.totalSeconds).toBe(5415);
  });

  it('SET_FIELD hours ayarlar', () => {
    const api = createTimeSpan();
    api.send({ type: 'SET_FIELD', field: 'hours', value: 5 });
    expect(api.getContext().hours).toBe(5);
  });

  it('SET_FIELD minutes 59 ile sinirlar', () => {
    const api = createTimeSpan();
    api.send({ type: 'SET_FIELD', field: 'minutes', value: 75 });
    expect(api.getContext().minutes).toBe(59);
  });

  it('SET_FIELD seconds 59 ile sinirlar', () => {
    const api = createTimeSpan();
    api.send({ type: 'SET_FIELD', field: 'seconds', value: 90 });
    expect(api.getContext().seconds).toBe(59);
  });

  it('SET_FIELD negatif degeri sifirlar', () => {
    const api = createTimeSpan();
    api.send({ type: 'SET_FIELD', field: 'hours', value: -5 });
    expect(api.getContext().hours).toBe(0);
  });

  it('INCREMENT seconds arttirir', () => {
    const api = createTimeSpan();
    api.send({ type: 'INCREMENT', field: 'seconds' });
    expect(api.getContext().seconds).toBe(1);
  });

  it('INCREMENT minutes arttirir', () => {
    const api = createTimeSpan();
    api.send({ type: 'INCREMENT', field: 'minutes', step: 5 });
    expect(api.getContext().minutes).toBe(5);
  });

  it('INCREMENT seconds 60 da minute e tasir', () => {
    const api = createTimeSpan({ defaultSeconds: 59 });
    api.send({ type: 'INCREMENT', field: 'seconds' });
    expect(api.getContext().seconds).toBe(0);
    expect(api.getContext().minutes).toBe(1);
  });

  it('DECREMENT seconds azaltir', () => {
    const api = createTimeSpan({ defaultSeconds: 10 });
    api.send({ type: 'DECREMENT', field: 'seconds' });
    expect(api.getContext().seconds).toBe(9);
  });

  it('DECREMENT sifirin altina inmez', () => {
    const api = createTimeSpan();
    api.send({ type: 'DECREMENT', field: 'seconds' });
    expect(api.getContext().totalSeconds).toBe(0);
  });

  it('DECREMENT minutes azaltir', () => {
    const api = createTimeSpan({ defaultMinutes: 5 });
    api.send({ type: 'DECREMENT', field: 'minutes', step: 2 });
    expect(api.getContext().minutes).toBe(3);
  });

  it('SET_TOTAL_SECONDS toplam saniyeden bolme yapar', () => {
    const api = createTimeSpan();
    api.send({ type: 'SET_TOTAL_SECONDS', totalSeconds: 3661 });
    expect(api.getContext().hours).toBe(1);
    expect(api.getContext().minutes).toBe(1);
    expect(api.getContext().seconds).toBe(1);
  });

  it('SET_TOTAL_SECONDS max ile sinirlar', () => {
    const api = createTimeSpan({ max: 3600 });
    api.send({ type: 'SET_TOTAL_SECONDS', totalSeconds: 9999 });
    expect(api.getContext().totalSeconds).toBe(3600);
  });

  it('SET_TOTAL_SECONDS min ile sinirlar', () => {
    const api = createTimeSpan({ min: 60 });
    api.send({ type: 'SET_TOTAL_SECONDS', totalSeconds: 10 });
    expect(api.getContext().totalSeconds).toBe(60);
  });

  it('RESET varsayilana doner', () => {
    const api = createTimeSpan({ defaultHours: 1 });
    api.send({ type: 'SET_FIELD', field: 'hours', value: 5 });
    api.send({ type: 'RESET' });
    expect(api.getContext().hours).toBe(1);
  });

  it('totalMs dogru hesaplanir', () => {
    const api = createTimeSpan({ defaultSeconds: 5 });
    expect(api.getContext().totalMs).toBe(5000);
  });

  it('onChange callback cagrilir', () => {
    const onChange = vi.fn();
    const api = createTimeSpan({ onChange });
    api.send({ type: 'SET_FIELD', field: 'hours', value: 1 });
    expect(onChange).toHaveBeenCalledWith(3600);
  });

  it('subscribe bildirim alir', () => {
    const api = createTimeSpan();
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'INCREMENT', field: 'seconds' });
    expect(fn).toHaveBeenCalledOnce();
  });

  it('destroy listener temizler', () => {
    const api = createTimeSpan();
    const fn = vi.fn();
    api.subscribe(fn);
    api.destroy();
    api.send({ type: 'INCREMENT', field: 'seconds' });
    expect(fn).not.toHaveBeenCalled();
  });
});
