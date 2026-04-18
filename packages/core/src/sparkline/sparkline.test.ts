/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createSparkline } from './sparkline.machine';

describe('createSparkline', () => {
  it('varsayilan context doner', () => {
    const api = createSparkline();
    const ctx = api.getContext();
    expect(ctx.data).toHaveLength(0);
    expect(ctx.points).toHaveLength(0);
    expect(ctx.bars).toHaveLength(0);
    expect(ctx.width).toBe(100);
    expect(ctx.height).toBe(32);
    api.destroy();
  });

  it('config.data ile baslar', () => {
    const api = createSparkline({ data: [10, 20, 30] });
    const ctx = api.getContext();
    expect(ctx.data).toHaveLength(3);
    expect(ctx.points).toHaveLength(3);
    api.destroy();
  });

  it('config.width ve height ile baslar', () => {
    const api = createSparkline({ width: 200, height: 50 });
    const ctx = api.getContext();
    expect(ctx.width).toBe(200);
    expect(ctx.height).toBe(50);
    api.destroy();
  });

  // ── Points ──

  it('noktalar dogru hesaplanir', () => {
    const api = createSparkline({ data: [0, 50, 100], width: 100, height: 32 });
    const ctx = api.getContext();
    expect(ctx.points).toHaveLength(3);
    const first = ctx.points[0];
    const last = ctx.points[2];
    expect(first).toBeDefined();
    expect(last).toBeDefined();
    if (first && last) {
      expect(first.x).toBeLessThan(last.x);
    }
    api.destroy();
  });

  it('min ve max dogru hesaplanir', () => {
    const api = createSparkline({ data: [5, 15, 10] });
    const ctx = api.getContext();
    expect(ctx.min).toBe(5);
    expect(ctx.max).toBe(15);
    api.destroy();
  });

  it('tek deger min max esit yapilmaz', () => {
    const api = createSparkline({ data: [42] });
    const ctx = api.getContext();
    expect(ctx.points).toHaveLength(1);
    api.destroy();
  });

  // ── Bars ──

  it('barlar dogru hesaplanir', () => {
    const api = createSparkline({ data: [10, 20, 30] });
    const ctx = api.getContext();
    expect(ctx.bars).toHaveLength(3);
    const firstBar = ctx.bars[0];
    expect(firstBar).toBeDefined();
    if (firstBar) {
      expect(firstBar.width).toBeGreaterThan(0);
      expect(firstBar.height).toBeGreaterThanOrEqual(0);
    }
    api.destroy();
  });

  // ── Paths ──

  it('linePath SVG path string icerir', () => {
    const api = createSparkline({ data: [10, 20, 30] });
    const ctx = api.getContext();
    expect(ctx.linePath).toContain('M');
    expect(ctx.linePath).toContain('L');
    api.destroy();
  });

  it('areaPath kapali path icerir', () => {
    const api = createSparkline({ data: [10, 20, 30] });
    const ctx = api.getContext();
    expect(ctx.areaPath).toContain('Z');
    api.destroy();
  });

  it('bos data icin bos path doner', () => {
    const api = createSparkline({ data: [] });
    const ctx = api.getContext();
    expect(ctx.linePath).toBe('');
    expect(ctx.areaPath).toBe('');
    api.destroy();
  });

  // ── SET_DATA ──

  it('SET_DATA veriyi gunceller', () => {
    const api = createSparkline({ data: [1, 2] });
    api.send({ type: 'SET_DATA', data: [5, 10, 15, 20] });
    const ctx = api.getContext();
    expect(ctx.data).toHaveLength(4);
    expect(ctx.points).toHaveLength(4);
    api.destroy();
  });

  // ── SET_SIZE ──

  it('SET_SIZE boyutu gunceller', () => {
    const api = createSparkline();
    api.send({ type: 'SET_SIZE', width: 200, height: 60 });
    const ctx = api.getContext();
    expect(ctx.width).toBe(200);
    expect(ctx.height).toBe(60);
    api.destroy();
  });

  it('SET_SIZE ayni boyut icin notify etmez', () => {
    const api = createSparkline({ width: 100, height: 32 });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_SIZE', width: 100, height: 32 });
    expect(listener).not.toHaveBeenCalled();
    api.destroy();
  });

  // ── Subscribe ──

  it('subscribe listener cagirilir', () => {
    const api = createSparkline();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_DATA', data: [1] });
    expect(listener).toHaveBeenCalledTimes(1);
    api.destroy();
  });

  it('unsubscribe listener kaldirilir', () => {
    const api = createSparkline();
    const listener = vi.fn();
    const unsub = api.subscribe(listener);
    unsub();
    api.send({ type: 'SET_DATA', data: [1] });
    expect(listener).not.toHaveBeenCalled();
    api.destroy();
  });

  it('destroy listeners temizler', () => {
    const api = createSparkline();
    const listener = vi.fn();
    api.subscribe(listener);
    api.destroy();
    api.send({ type: 'SET_DATA', data: [1] });
    expect(listener).not.toHaveBeenCalled();
  });
});
