/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createSankey } from './sankey.machine';

const nodes = [
  { id: 'a', name: 'Source A' },
  { id: 'b', name: 'Source B' },
  { id: 'c', name: 'Middle' },
  { id: 'd', name: 'Target' },
];

const links = [
  { source: 'a', target: 'c', value: 50 },
  { source: 'b', target: 'c', value: 30 },
  { source: 'c', target: 'd', value: 80 },
];

describe('createSankey', () => {
  it('nodes hesaplanir', () => {
    const api = createSankey({ nodes, links });
    expect(api.getContext().nodes).toHaveLength(4);
  });

  it('links hesaplanir', () => {
    const api = createSankey({ nodes, links });
    expect(api.getContext().links).toHaveLength(3);
  });

  it('her node pozisyon iceriyor', () => {
    const api = createSankey({ nodes, links });
    for (const n of api.getContext().nodes) {
      expect(n.x).toBeDefined();
      expect(n.y).toBeDefined();
      expect(n.width).toBeGreaterThan(0);
      expect(n.height).toBeGreaterThan(0);
    }
  });

  it('her node renk iceriyor', () => {
    const api = createSankey({ nodes, links });
    for (const n of api.getContext().nodes) {
      expect(n.color).toBeDefined();
    }
  });

  it('node depth atanir', () => {
    const api = createSankey({ nodes, links });
    const ctx = api.getContext();
    const nodeA = ctx.nodes.find((n) => n.id === 'a');
    const nodeD = ctx.nodes.find((n) => n.id === 'd');
    expect(nodeA?.depth).toBe(0);
    expect(nodeD?.depth).toBeGreaterThan(0);
  });

  it('her link path iceriyor', () => {
    const api = createSankey({ nodes, links });
    for (const l of api.getContext().links) {
      expect(l.path).toContain('M');
      expect(l.path).toContain('C');
    }
  });

  it('her link width > 0', () => {
    const api = createSankey({ nodes, links });
    for (const l of api.getContext().links) {
      expect(l.width).toBeGreaterThan(0);
    }
  });

  it('ozel renk kullanilir', () => {
    const colored = [{ id: 'x', name: 'X', color: '#ff0000' }];
    const api = createSankey({ nodes: colored, links: [] });
    expect(api.getContext().nodes[0]?.color).toBe('#ff0000');
  });

  it('bos data ile bos context', () => {
    const api = createSankey({ nodes: [], links: [] });
    expect(api.getContext().nodes).toHaveLength(0);
    expect(api.getContext().links).toHaveLength(0);
  });

  it('SET_DATA veriyi gunceller', () => {
    const api = createSankey({ nodes, links });
    api.send({ type: 'SET_DATA', nodes: nodes.slice(0, 2), links: [] });
    expect(api.getContext().nodes).toHaveLength(2);
  });

  it('subscribe bildirim alir', () => {
    const api = createSankey({ nodes, links });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'SET_DATA', nodes: [], links: [] });
    expect(fn).toHaveBeenCalledOnce();
  });

  it('destroy listener temizler', () => {
    const api = createSankey({ nodes, links });
    const fn = vi.fn();
    api.subscribe(fn);
    api.destroy();
    api.send({ type: 'SET_DATA', nodes: [], links: [] });
    expect(fn).not.toHaveBeenCalled();
  });
});
