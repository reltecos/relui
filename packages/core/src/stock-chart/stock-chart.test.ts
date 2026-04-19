/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createStockChart } from './stock-chart.machine';

const data = [
  { date: '2025-01-01', open: 100, high: 110, low: 95, close: 105, volume: 1000 },
  { date: '2025-01-02', open: 105, high: 115, low: 100, close: 98, volume: 1200 },
  { date: '2025-01-03', open: 98, high: 108, low: 90, close: 107, volume: 800 },
  { date: '2025-01-04', open: 107, high: 120, low: 105, close: 118, volume: 1500 },
  { date: '2025-01-05', open: 118, high: 125, low: 110, close: 112, volume: 900 },
];

describe('createStockChart', () => {
  it('candles hesaplanir', () => {
    const api = createStockChart({ data });
    expect(api.getContext().candles).toHaveLength(5);
  });

  it('priceMin dogru', () => {
    const api = createStockChart({ data });
    expect(api.getContext().priceMin).toBe(90);
  });

  it('priceMax dogru', () => {
    const api = createStockChart({ data });
    expect(api.getContext().priceMax).toBe(125);
  });

  it('volumeMax dogru', () => {
    const api = createStockChart({ data });
    expect(api.getContext().volumeMax).toBe(1500);
  });

  it('bullish candle dogru renk', () => {
    const api = createStockChart({ data });
    // First candle: open=100, close=105 → bullish
    expect(api.getContext().candles[0]?.isBullish).toBe(true);
  });

  it('bearish candle dogru renk', () => {
    const api = createStockChart({ data });
    // Second candle: open=105, close=98 → bearish
    expect(api.getContext().candles[1]?.isBullish).toBe(false);
  });

  it('her candle pozisyon iceriyor', () => {
    const api = createStockChart({ data });
    for (const c of api.getContext().candles) {
      expect(c.x).toBeDefined();
      expect(c.bodyY).toBeDefined();
      expect(c.bodyHeight).toBeGreaterThan(0);
      expect(c.wickHeight).toBeGreaterThan(0);
      expect(c.width).toBeGreaterThan(0);
    }
  });

  it('volume height hesaplanir', () => {
    const api = createStockChart({ data });
    for (const c of api.getContext().candles) {
      expect(c.volumeHeight).toBeGreaterThanOrEqual(0);
    }
  });

  it('ozel bullish/bearish renk', () => {
    const api = createStockChart({ data, bullishColor: '#00ff00', bearishColor: '#ff0000' });
    expect(api.getContext().candles[0]?.color).toBe('#00ff00');
    expect(api.getContext().candles[1]?.color).toBe('#ff0000');
  });

  it('bos data ile bos context', () => {
    const api = createStockChart({ data: [] });
    expect(api.getContext().candles).toHaveLength(0);
  });

  it('SET_DATA veriyi gunceller', () => {
    const api = createStockChart({ data });
    api.send({ type: 'SET_DATA', data: data.slice(0, 2) });
    expect(api.getContext().candles).toHaveLength(2);
  });

  it('subscribe bildirim alir', () => {
    const api = createStockChart({ data });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'SET_DATA', data: [] });
    expect(fn).toHaveBeenCalledOnce();
  });

  it('destroy listener temizler', () => {
    const api = createStockChart({ data });
    const fn = vi.fn();
    api.subscribe(fn);
    api.destroy();
    api.send({ type: 'SET_DATA', data: [] });
    expect(fn).not.toHaveBeenCalled();
  });
});
