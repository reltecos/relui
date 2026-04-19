/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createTreemapChart } from './treemap-chart.machine';

const data = [
  { name: 'A', value: 100 },
  { name: 'B', value: 200 },
  { name: 'C', value: 300 },
];

describe('createTreemapChart', () => {
  it('cells hesaplanir', () => {
    const api = createTreemapChart({ data });
    expect(api.getContext().cells).toHaveLength(3);
  });

  it('total dogru', () => {
    const api = createTreemapChart({ data });
    expect(api.getContext().total).toBe(600);
  });

  it('her cell pozisyon iceriyor', () => {
    const api = createTreemapChart({ data });
    for (const c of api.getContext().cells) {
      expect(c.x).toBeDefined();
      expect(c.y).toBeDefined();
      expect(c.width).toBeGreaterThan(0);
      expect(c.height).toBeGreaterThan(0);
    }
  });

  it('her cell percentage iceriyor', () => {
    const api = createTreemapChart({ data });
    const percentSum = api.getContext().cells.reduce((s, c) => s + c.percentage, 0);
    expect(percentSum).toBeCloseTo(100, 0);
  });

  it('her cell renk iceriyor', () => {
    const api = createTreemapChart({ data });
    for (const c of api.getContext().cells) {
      expect(c.color).toBeDefined();
    }
  });

  it('ozel renk kullanilir', () => {
    const api = createTreemapChart({ data: [{ name: 'X', value: 50, color: '#ff0000' }] });
    expect(api.getContext().cells[0]?.color).toBe('#ff0000');
  });

  it('labelPos iceriyor', () => {
    const api = createTreemapChart({ data });
    for (const c of api.getContext().cells) {
      expect(c.labelPos.x).toBeDefined();
      expect(c.labelPos.y).toBeDefined();
    }
  });

  it('nested data ile depth artar', () => {
    const nested = [
      { name: 'Parent', value: 100, children: [
        { name: 'Child1', value: 60 },
        { name: 'Child2', value: 40 },
      ] },
    ];
    const api = createTreemapChart({ data: nested });
    const cells = api.getContext().cells;
    expect(cells.length).toBeGreaterThan(1);
    const childCell = cells.find((c) => c.name === 'Child1');
    expect(childCell?.depth).toBe(1);
  });

  it('bos data ile bos cells', () => {
    const api = createTreemapChart({ data: [] });
    expect(api.getContext().cells).toHaveLength(0);
  });

  it('SET_DATA veriyi gunceller', () => {
    const api = createTreemapChart({ data });
    api.send({ type: 'SET_DATA', data: data.slice(0, 1) });
    expect(api.getContext().cells).toHaveLength(1);
  });

  it('subscribe bildirim alir', () => {
    const api = createTreemapChart({ data });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'SET_DATA', data: [] });
    expect(fn).toHaveBeenCalledOnce();
  });

  it('destroy listener temizler', () => {
    const api = createTreemapChart({ data });
    const fn = vi.fn();
    api.subscribe(fn);
    api.destroy();
    api.send({ type: 'SET_DATA', data: [] });
    expect(fn).not.toHaveBeenCalled();
  });
});
