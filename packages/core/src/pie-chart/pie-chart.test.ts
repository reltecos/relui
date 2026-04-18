/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createPieChart } from './pie-chart.machine';

describe('createPieChart', () => {
  it('varsayilan context doner', () => {
    const api = createPieChart();
    const ctx = api.getContext();
    expect(ctx.arcs).toHaveLength(0);
    expect(ctx.total).toBe(0);
    expect(ctx.donut).toBe(false);
    api.destroy();
  });

  it('slices ile arclar hesaplanir', () => {
    const api = createPieChart({
      slices: [
        { name: 'A', value: 30 },
        { name: 'B', value: 70 },
      ],
    });
    const ctx = api.getContext();
    expect(ctx.arcs).toHaveLength(2);
    expect(ctx.total).toBe(100);
    api.destroy();
  });

  it('percentage dogru hesaplanir', () => {
    const api = createPieChart({
      slices: [
        { name: 'A', value: 25 },
        { name: 'B', value: 75 },
      ],
    });
    const arcs = api.getContext().arcs;
    expect(arcs[0]?.percentage).toBe(25);
    expect(arcs[1]?.percentage).toBe(75);
    api.destroy();
  });

  it('arc path SVG path icerir', () => {
    const api = createPieChart({ slices: [{ name: 'A', value: 50 }] });
    expect(api.getContext().arcs[0]?.path).toContain('A');
    api.destroy();
  });

  it('custom color kullanilir', () => {
    const api = createPieChart({
      slices: [{ name: 'A', value: 100, color: '#ff0000' }],
    });
    expect(api.getContext().arcs[0]?.color).toBe('#ff0000');
    api.destroy();
  });

  it('labelPos hesaplanir', () => {
    const api = createPieChart({ slices: [{ name: 'A', value: 100 }] });
    const pos = api.getContext().arcs[0]?.labelPos;
    expect(pos).toBeDefined();
    if (pos) {
      expect(typeof pos.x).toBe('number');
      expect(typeof pos.y).toBe('number');
    }
    api.destroy();
  });

  // ── Donut ──

  it('donut mode innerRadius uygular', () => {
    const api = createPieChart({
      slices: [{ name: 'A', value: 100 }],
      donut: true,
      innerRadius: 0.5,
    });
    const ctx = api.getContext();
    expect(ctx.donut).toBe(true);
    expect(ctx.innerRadius).toBeGreaterThan(0);
    api.destroy();
  });

  it('donut false ise innerRadius 0', () => {
    const api = createPieChart({
      slices: [{ name: 'A', value: 100 }],
      donut: false,
    });
    expect(api.getContext().innerRadius).toBe(0);
    api.destroy();
  });

  // ── SET_SLICES ──

  it('SET_SLICES dilimleri gunceller', () => {
    const api = createPieChart();
    api.send({ type: 'SET_SLICES', slices: [{ name: 'X', value: 40 }] });
    expect(api.getContext().arcs).toHaveLength(1);
    api.destroy();
  });

  // ── SET_DONUT ──

  it('SET_DONUT donut modunu degistirir', () => {
    const api = createPieChart();
    api.send({ type: 'SET_DONUT', donut: true });
    expect(api.getContext().donut).toBe(true);
    api.destroy();
  });

  it('SET_DONUT ayni deger icin notify etmez', () => {
    const api = createPieChart({ donut: false });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_DONUT', donut: false });
    expect(listener).not.toHaveBeenCalled();
    api.destroy();
  });

  // ── Subscribe ──

  it('subscribe listener cagirilir', () => {
    const api = createPieChart();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_SLICES', slices: [{ name: 'A', value: 1 }] });
    expect(listener).toHaveBeenCalledTimes(1);
    api.destroy();
  });

  it('destroy listeners temizler', () => {
    const api = createPieChart();
    const listener = vi.fn();
    api.subscribe(listener);
    api.destroy();
    api.send({ type: 'SET_SLICES', slices: [] });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── Edge cases ──

  it('bos slices bos arclar doner', () => {
    const api = createPieChart({ slices: [] });
    expect(api.getContext().arcs).toHaveLength(0);
    api.destroy();
  });

  it('sifir toplamda bos arclar doner', () => {
    const api = createPieChart({ slices: [{ name: 'A', value: 0 }] });
    expect(api.getContext().arcs).toHaveLength(0);
    api.destroy();
  });
});
