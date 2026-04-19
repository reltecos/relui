/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createSunburstChart } from './sunburst-chart.machine';

const data = [
  { name: 'A', value: 100, children: [
    { name: 'A1', value: 60 },
    { name: 'A2', value: 40 },
  ] },
  { name: 'B', value: 200 },
];

describe('createSunburstChart', () => {
  it('arcs hesaplanir', () => {
    const api = createSunburstChart({ data });
    expect(api.getContext().arcs.length).toBeGreaterThan(0);
  });

  it('total dogru', () => {
    const api = createSunburstChart({ data });
    expect(api.getContext().total).toBe(300);
  });

  it('center dogru', () => {
    const api = createSunburstChart({ data, size: 200 });
    expect(api.getContext().center).toEqual({ x: 100, y: 100 });
  });

  it('her arc path iceriyor', () => {
    const api = createSunburstChart({ data });
    for (const a of api.getContext().arcs) {
      expect(a.path).toContain('M');
    }
  });

  it('her arc renk iceriyor', () => {
    const api = createSunburstChart({ data });
    for (const a of api.getContext().arcs) {
      expect(a.color).toBeDefined();
    }
  });

  it('child arc lar depth 1', () => {
    const api = createSunburstChart({ data });
    const childArcs = api.getContext().arcs.filter((a) => a.depth === 1);
    expect(childArcs.length).toBeGreaterThan(0);
  });

  it('parent arc depth 0', () => {
    const api = createSunburstChart({ data });
    const parentArcs = api.getContext().arcs.filter((a) => a.depth === 0);
    expect(parentArcs.length).toBeGreaterThan(0);
  });

  it('percentage dogru', () => {
    const api = createSunburstChart({ data });
    const bArc = api.getContext().arcs.find((a) => a.name === 'B');
    // B=200, total=300, ~66.7%
    expect(bArc?.percentage).toBeCloseTo(66.67, 0);
  });

  it('labelPos iceriyor', () => {
    const api = createSunburstChart({ data });
    for (const a of api.getContext().arcs) {
      expect(a.labelPos.x).toBeDefined();
      expect(a.labelPos.y).toBeDefined();
    }
  });

  it('bos data ile bos arcs', () => {
    const api = createSunburstChart({ data: [] });
    expect(api.getContext().arcs).toHaveLength(0);
  });

  it('SET_DATA veriyi gunceller', () => {
    const api = createSunburstChart({ data });
    api.send({ type: 'SET_DATA', data: [{ name: 'X', value: 50 }] });
    const ctx = api.getContext();
    expect(ctx.arcs.find((a) => a.name === 'X')).toBeDefined();
  });

  it('subscribe bildirim alir', () => {
    const api = createSunburstChart({ data });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'SET_DATA', data: [] });
    expect(fn).toHaveBeenCalledOnce();
  });

  it('destroy listener temizler', () => {
    const api = createSunburstChart({ data });
    const fn = vi.fn();
    api.subscribe(fn);
    api.destroy();
    api.send({ type: 'SET_DATA', data: [] });
    expect(fn).not.toHaveBeenCalled();
  });
});
