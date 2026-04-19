/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createFunnelChart } from './funnel-chart.machine';

const layers = [
  { name: 'Visitors', value: 1000 },
  { name: 'Leads', value: 600 },
  { name: 'Opportunities', value: 300 },
  { name: 'Sales', value: 100 },
];

describe('createFunnelChart', () => {
  it('layers hesaplanir', () => {
    const api = createFunnelChart({ layers });
    expect(api.getContext().layers).toHaveLength(4);
  });

  it('maxValue dogru', () => {
    const api = createFunnelChart({ layers });
    expect(api.getContext().maxValue).toBe(1000);
  });

  it('ilk layer percentage 100', () => {
    const api = createFunnelChart({ layers });
    expect(api.getContext().layers[0]?.percentage).toBe(100);
  });

  it('son layer percentage dogru', () => {
    const api = createFunnelChart({ layers });
    expect(api.getContext().layers[3]?.percentage).toBe(10);
  });

  it('conversionRate dogru', () => {
    const api = createFunnelChart({ layers });
    // Leads/Visitors = 600/1000 = 60%
    expect(api.getContext().layers[1]?.conversionRate).toBeCloseTo(60);
  });

  it('her layer path iceriyor', () => {
    const api = createFunnelChart({ layers });
    for (const l of api.getContext().layers) {
      expect(l.path).toContain('M');
      expect(l.path).toContain('Z');
    }
  });

  it('her layer labelPos iceriyor', () => {
    const api = createFunnelChart({ layers });
    for (const l of api.getContext().layers) {
      expect(l.labelPos.x).toBeDefined();
      expect(l.labelPos.y).toBeDefined();
    }
  });

  it('her layer renk iceriyor', () => {
    const api = createFunnelChart({ layers });
    for (const l of api.getContext().layers) {
      expect(l.color).toBeDefined();
    }
  });

  it('ozel renk kullanilir', () => {
    const api = createFunnelChart({ layers: [{ name: 'A', value: 100, color: '#ff0000' }] });
    expect(api.getContext().layers[0]?.color).toBe('#ff0000');
  });

  it('topWidth >= bottomWidth (huni sekli)', () => {
    const api = createFunnelChart({ layers });
    const ctx = api.getContext();
    for (let i = 0; i < ctx.layers.length - 1; i++) {
      const cur = ctx.layers[i];
      const next = ctx.layers[i + 1];
      if (cur && next) {
        expect(cur.bottomWidth).toBeGreaterThanOrEqual(next.bottomWidth);
      }
    }
  });

  it('bos layers ile bos context', () => {
    const api = createFunnelChart({ layers: [] });
    expect(api.getContext().layers).toHaveLength(0);
  });

  it('SET_LAYERS veriyi gunceller', () => {
    const api = createFunnelChart({ layers });
    api.send({ type: 'SET_LAYERS', layers: layers.slice(0, 2) });
    expect(api.getContext().layers).toHaveLength(2);
  });

  it('subscribe bildirim alir', () => {
    const api = createFunnelChart({ layers });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'SET_LAYERS', layers: [] });
    expect(fn).toHaveBeenCalledOnce();
  });

  it('destroy listener temizler', () => {
    const api = createFunnelChart({ layers });
    const fn = vi.fn();
    api.subscribe(fn);
    api.destroy();
    api.send({ type: 'SET_LAYERS', layers: [] });
    expect(fn).not.toHaveBeenCalled();
  });
});
