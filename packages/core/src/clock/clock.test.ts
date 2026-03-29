/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createClock } from './clock.machine';

describe('createClock', () => {
  // ── Init ──

  it('varsayilan context doner', () => {
    const api = createClock();
    const ctx = api.getContext();
    expect(typeof ctx.hours).toBe('number');
    expect(typeof ctx.minutes).toBe('number');
    expect(typeof ctx.seconds).toBe('number');
    expect(ctx.is24h).toBe(false);
    expect(ctx.period === 'AM' || ctx.period === 'PM').toBe(true);
    api.destroy();
  });

  it('is24h true ile 24 saat formati kullanilir', () => {
    const api = createClock({ is24h: true });
    const ctx = api.getContext();
    expect(ctx.is24h).toBe(true);
    api.destroy();
  });

  it('timezone ile belirli saat dilimi kullanilir', () => {
    const api = createClock({ timezone: 'UTC' });
    const ctx = api.getContext();
    expect(ctx.timezone).toBe('UTC');
    api.destroy();
  });

  // ── TICK ──

  it('TICK zamani gunceller', () => {
    const api = createClock();
    api.send({ type: 'TICK' });
    const after = api.getContext();
    expect(typeof after.hours).toBe('number');
    expect(typeof after.minutes).toBe('number');
    expect(typeof after.seconds).toBe('number');
    api.destroy();
  });

  it('onTick callback TICK ile cagirilir', () => {
    const onTick = vi.fn();
    const api = createClock({ onTick });
    api.send({ type: 'TICK' });
    expect(onTick).toHaveBeenCalledTimes(1);
    expect(onTick.mock.calls[0][0]).toHaveProperty('hours');
    api.destroy();
  });

  // ── SET_TIMEZONE ──

  it('SET_TIMEZONE saat dilimini degistirir', () => {
    const api = createClock({ timezone: 'UTC' });
    api.send({ type: 'SET_TIMEZONE', timezone: 'America/New_York' });
    expect(api.getContext().timezone).toBe('America/New_York');
    api.destroy();
  });

  it('SET_TIMEZONE ayni timezone ise notify etmez', () => {
    const listener = vi.fn();
    const api = createClock({ timezone: 'UTC' });
    api.subscribe(listener);
    api.send({ type: 'SET_TIMEZONE', timezone: 'UTC' });
    expect(listener).not.toHaveBeenCalled();
    api.destroy();
  });

  // ── SET_FORMAT ──

  it('SET_FORMAT 24h formatina gecer', () => {
    const api = createClock({ is24h: false });
    api.send({ type: 'SET_FORMAT', is24h: true });
    expect(api.getContext().is24h).toBe(true);
    api.destroy();
  });

  it('SET_FORMAT 12h formatina gecer', () => {
    const api = createClock({ is24h: true });
    api.send({ type: 'SET_FORMAT', is24h: false });
    expect(api.getContext().is24h).toBe(false);
    api.destroy();
  });

  it('SET_FORMAT ayni format ise notify etmez', () => {
    const listener = vi.fn();
    const api = createClock({ is24h: true });
    api.subscribe(listener);
    api.send({ type: 'SET_FORMAT', is24h: true });
    expect(listener).not.toHaveBeenCalled();
    api.destroy();
  });

  // ── 12h format ──

  it('12h formatta hours 1-12 arasinda', () => {
    const api = createClock({ is24h: false });
    const ctx = api.getContext();
    expect(ctx.hours).toBeGreaterThanOrEqual(1);
    expect(ctx.hours).toBeLessThanOrEqual(12);
    api.destroy();
  });

  it('rawHours her zaman 0-23 arasinda', () => {
    const api = createClock();
    const ctx = api.getContext();
    expect(ctx.rawHours).toBeGreaterThanOrEqual(0);
    expect(ctx.rawHours).toBeLessThanOrEqual(23);
    api.destroy();
  });

  // ── Subscribe ──

  it('subscribe listener TICK ile cagirilir', () => {
    const api = createClock();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'TICK' });
    expect(listener).toHaveBeenCalledTimes(1);
    api.destroy();
  });

  it('unsubscribe listener kaldirilir', () => {
    const api = createClock();
    const listener = vi.fn();
    const unsub = api.subscribe(listener);
    unsub();
    api.send({ type: 'TICK' });
    expect(listener).not.toHaveBeenCalled();
    api.destroy();
  });

  // ── Destroy ──

  it('destroy listeners temizler', () => {
    const api = createClock();
    const listener = vi.fn();
    api.subscribe(listener);
    api.destroy();
    api.send({ type: 'TICK' });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── Period ──

  it('period AM veya PM doner', () => {
    const api = createClock();
    const ctx = api.getContext();
    expect(['AM', 'PM']).toContain(ctx.period);
    api.destroy();
  });
});
