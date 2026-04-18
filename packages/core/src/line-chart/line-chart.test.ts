/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createLineChart } from './line-chart.machine';
import type { LineSeries } from './line-chart.types';

const DEMO_SERIES: LineSeries[] = [
  { name: 'Gelir', data: [{ x: 0, y: 10 }, { x: 1, y: 20 }, { x: 2, y: 15 }, { x: 3, y: 30 }] },
  { name: 'Gider', data: [{ x: 0, y: 5 }, { x: 1, y: 12 }, { x: 2, y: 8 }, { x: 3, y: 18 }] },
];

describe('createLineChart', () => {
  it('varsayilan context doner', () => {
    const api = createLineChart();
    const ctx = api.getContext();
    expect(ctx.computedSeries).toHaveLength(0);
    expect(ctx.width).toBe(400);
    expect(ctx.height).toBe(300);
    api.destroy();
  });

  it('series ile baslar', () => {
    const api = createLineChart({ series: DEMO_SERIES });
    const ctx = api.getContext();
    expect(ctx.computedSeries).toHaveLength(2);
    api.destroy();
  });

  it('computed series path icerir', () => {
    const api = createLineChart({ series: DEMO_SERIES });
    const cs = api.getContext().computedSeries[0];
    expect(cs?.path).toContain('M');
    expect(cs?.path).toContain('L');
    api.destroy();
  });

  it('computed series areaPath icerir', () => {
    const api = createLineChart({ series: DEMO_SERIES });
    const cs = api.getContext().computedSeries[0];
    expect(cs?.areaPath).toContain('Z');
    api.destroy();
  });

  it('computed series points hesaplanir', () => {
    const api = createLineChart({ series: DEMO_SERIES });
    const cs = api.getContext().computedSeries[0];
    expect(cs?.points).toHaveLength(4);
    api.destroy();
  });

  it('custom color kullanilir', () => {
    const api = createLineChart({
      series: [{ name: 'A', data: [{ x: 0, y: 0 }], color: '#ff0000' }],
    });
    expect(api.getContext().computedSeries[0]?.color).toBe('#ff0000');
    api.destroy();
  });

  // ── Domain ──

  it('xDomain dogru hesaplanir', () => {
    const api = createLineChart({ series: DEMO_SERIES });
    const [xMin, xMax] = api.getContext().xDomain;
    expect(xMin).toBe(0);
    expect(xMax).toBe(3);
    api.destroy();
  });

  it('yDomain 0 dan baslar', () => {
    const api = createLineChart({ series: DEMO_SERIES });
    const [yMin] = api.getContext().yDomain;
    expect(yMin).toBe(0);
    api.destroy();
  });

  // ── Ticks ──

  it('xTicks uretilir', () => {
    const api = createLineChart({ series: DEMO_SERIES });
    expect(api.getContext().xTicks.length).toBeGreaterThan(0);
    api.destroy();
  });

  it('yTicks uretilir', () => {
    const api = createLineChart({ series: DEMO_SERIES });
    expect(api.getContext().yTicks.length).toBeGreaterThan(0);
    api.destroy();
  });

  // ── PlotArea ──

  it('plotArea hesaplanir', () => {
    const api = createLineChart({ width: 400, height: 300 });
    const pa = api.getContext().plotArea;
    expect(pa.x).toBe(40);
    expect(pa.y).toBe(20);
    expect(pa.width).toBe(340);
    expect(pa.height).toBe(250);
    api.destroy();
  });

  // ── SET_SERIES ──

  it('SET_SERIES serileri gunceller', () => {
    const api = createLineChart();
    api.send({ type: 'SET_SERIES', series: DEMO_SERIES });
    expect(api.getContext().computedSeries).toHaveLength(2);
    api.destroy();
  });

  // ── SET_SIZE ──

  it('SET_SIZE boyutu gunceller', () => {
    const api = createLineChart();
    api.send({ type: 'SET_SIZE', width: 600, height: 400 });
    const ctx = api.getContext();
    expect(ctx.width).toBe(600);
    expect(ctx.height).toBe(400);
    api.destroy();
  });

  it('SET_SIZE ayni boyut icin notify etmez', () => {
    const api = createLineChart({ width: 400, height: 300 });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_SIZE', width: 400, height: 300 });
    expect(listener).not.toHaveBeenCalled();
    api.destroy();
  });

  // ── Subscribe ──

  it('subscribe listener cagirilir', () => {
    const api = createLineChart();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_SERIES', series: DEMO_SERIES });
    expect(listener).toHaveBeenCalledTimes(1);
    api.destroy();
  });

  it('destroy listeners temizler', () => {
    const api = createLineChart();
    const listener = vi.fn();
    api.subscribe(listener);
    api.destroy();
    api.send({ type: 'SET_SERIES', series: [] });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── Edge cases ──

  it('tek nokta ile calisir', () => {
    const api = createLineChart({
      series: [{ name: 'A', data: [{ x: 5, y: 10 }] }],
    });
    expect(api.getContext().computedSeries).toHaveLength(1);
    api.destroy();
  });

  it('bos seri ile calisir', () => {
    const api = createLineChart({ series: [{ name: 'A', data: [] }] });
    expect(api.getContext().computedSeries[0]?.path).toBe('');
    api.destroy();
  });
});
