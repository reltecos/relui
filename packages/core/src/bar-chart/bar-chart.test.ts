/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createBarChart } from './bar-chart.machine';

const SERIES = [
  { name: 'Gelir', data: [30, 50, 20] },
  { name: 'Gider', data: [20, 30, 15] },
];
const CATEGORIES = ['Ock', 'Sub', 'Mar'];

describe('createBarChart', () => {
  it('varsayilan context doner', () => {
    const api = createBarChart();
    const ctx = api.getContext();
    expect(ctx.bars).toHaveLength(0);
    expect(ctx.mode).toBe('grouped');
    expect(ctx.orientation).toBe('vertical');
    api.destroy();
  });

  it('series ve categories ile baslar', () => {
    const api = createBarChart({ series: SERIES, categories: CATEGORIES });
    const ctx = api.getContext();
    expect(ctx.bars.length).toBeGreaterThan(0);
    api.destroy();
  });

  it('grouped modda her seri icin ayri bar uretilir', () => {
    const api = createBarChart({ series: SERIES, categories: CATEGORIES, mode: 'grouped' });
    expect(api.getContext().bars).toHaveLength(6);
    api.destroy();
  });

  it('stacked modda her kategori icin seri sayisi kadar bar uretilir', () => {
    const api = createBarChart({ series: SERIES, categories: CATEGORIES, mode: 'stacked' });
    expect(api.getContext().bars).toHaveLength(6);
    api.destroy();
  });

  it('bar pozisyonlari hesaplanir', () => {
    const api = createBarChart({ series: SERIES, categories: CATEGORIES });
    const bar = api.getContext().bars[0];
    expect(bar).toBeDefined();
    if (bar) {
      expect(bar.width).toBeGreaterThan(0);
      expect(bar.height).toBeGreaterThanOrEqual(0);
    }
    api.destroy();
  });

  it('bar color hesaplanir', () => {
    const api = createBarChart({ series: SERIES, categories: CATEGORIES });
    const bar = api.getContext().bars[0];
    expect(bar?.color).toBeDefined();
    api.destroy();
  });

  it('custom color kullanilir', () => {
    const api = createBarChart({
      series: [{ name: 'A', data: [10], color: '#ff0000' }],
      categories: ['X'],
    });
    expect(api.getContext().bars[0]?.color).toBe('#ff0000');
    api.destroy();
  });

  it('yMax dogru hesaplanir', () => {
    const api = createBarChart({ series: SERIES, categories: CATEGORIES });
    expect(api.getContext().yMax).toBeGreaterThan(0);
    api.destroy();
  });

  it('xTicks kategoriler icin uretilir', () => {
    const api = createBarChart({ series: SERIES, categories: CATEGORIES });
    expect(api.getContext().xTicks).toEqual(CATEGORIES);
    api.destroy();
  });

  it('yTicks uretilir', () => {
    const api = createBarChart({ series: SERIES, categories: CATEGORIES });
    expect(api.getContext().yTicks.length).toBeGreaterThan(0);
    api.destroy();
  });

  // ── Events ──

  it('SET_SERIES gunceller', () => {
    const api = createBarChart({ categories: CATEGORIES });
    api.send({ type: 'SET_SERIES', series: SERIES });
    expect(api.getContext().bars.length).toBeGreaterThan(0);
    api.destroy();
  });

  it('SET_CATEGORIES gunceller', () => {
    const api = createBarChart({ series: SERIES });
    api.send({ type: 'SET_CATEGORIES', categories: CATEGORIES });
    expect(api.getContext().categories).toEqual(CATEGORIES);
    api.destroy();
  });

  it('SET_MODE modu degistirir', () => {
    const api = createBarChart({ mode: 'grouped' });
    api.send({ type: 'SET_MODE', mode: 'stacked' });
    expect(api.getContext().mode).toBe('stacked');
    api.destroy();
  });

  it('SET_MODE ayni mod icin notify etmez', () => {
    const api = createBarChart({ mode: 'grouped' });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_MODE', mode: 'grouped' });
    expect(listener).not.toHaveBeenCalled();
    api.destroy();
  });

  it('SET_SIZE boyutu degistirir', () => {
    const api = createBarChart();
    api.send({ type: 'SET_SIZE', width: 600, height: 400 });
    expect(api.getContext().width).toBe(600);
    api.destroy();
  });

  // ── Subscribe ──

  it('subscribe listener cagirilir', () => {
    const api = createBarChart();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_SERIES', series: SERIES });
    expect(listener).toHaveBeenCalledTimes(1);
    api.destroy();
  });

  it('destroy listeners temizler', () => {
    const api = createBarChart();
    const listener = vi.fn();
    api.subscribe(listener);
    api.destroy();
    api.send({ type: 'SET_SERIES', series: [] });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── Edge cases ──

  it('bos series bos bars doner', () => {
    const api = createBarChart({ series: [], categories: CATEGORIES });
    expect(api.getContext().bars).toHaveLength(0);
    api.destroy();
  });

  it('bos categories bos bars doner', () => {
    const api = createBarChart({ series: SERIES, categories: [] });
    expect(api.getContext().bars).toHaveLength(0);
    api.destroy();
  });

  it('horizontal orientation desteklenir', () => {
    const api = createBarChart({
      series: SERIES,
      categories: CATEGORIES,
      orientation: 'horizontal',
    });
    expect(api.getContext().orientation).toBe('horizontal');
    expect(api.getContext().bars.length).toBeGreaterThan(0);
    api.destroy();
  });
});
