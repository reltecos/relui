/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createOrgChart, computeOrgLayout } from './org-chart.machine';
import type { OrgNode } from './org-chart.types';

const CEO: OrgNode = { id: 'ceo', name: 'Ali', title: 'CEO', parentId: null, collapsed: false };
const CTO: OrgNode = { id: 'cto', name: 'Veli', title: 'CTO', parentId: 'ceo', collapsed: false };
const CFO: OrgNode = { id: 'cfo', name: 'Ayse', title: 'CFO', parentId: 'ceo', collapsed: false };
const DEV: OrgNode = { id: 'dev', name: 'Can', title: 'Dev', parentId: 'cto', collapsed: false };

const NODES = [CEO, CTO, CFO, DEV];

describe('computeOrgLayout', () => {
  it('bos nodes bos layout doner', () => {
    expect(computeOrgLayout([], 'vertical', 180, 80, 30, 40)).toEqual([]);
  });

  it('tek node dogrudan yerlesir', () => {
    const layout = computeOrgLayout([CEO], 'vertical', 180, 80, 30, 40);
    expect(layout).toHaveLength(1);
    expect(layout[0]?.id).toBe('ceo');
    expect(layout[0]?.x).toBe(0);
    expect(layout[0]?.y).toBe(0);
  });

  it('hiyerarsi layout uretir', () => {
    const layout = computeOrgLayout(NODES, 'vertical', 180, 80, 30, 40);
    expect(layout).toHaveLength(4);
    const ceo = layout.find((l) => l.id === 'ceo');
    const cto = layout.find((l) => l.id === 'cto');
    expect(cto && ceo ? cto.y > ceo.y : false).toBe(true);
  });

  it('collapsed node children gizler', () => {
    const nodesWithCollapse = NODES.map((n) => n.id === 'cto' ? { ...n, collapsed: true } : n);
    const layout = computeOrgLayout(nodesWithCollapse, 'vertical', 180, 80, 30, 40);
    const devLayout = layout.find((l) => l.id === 'dev');
    expect(devLayout).toBeUndefined();
  });
});

describe('createOrgChart', () => {
  it('varsayilan degerle olusturulur', () => {
    const oc = createOrgChart();
    expect(oc.getContext().nodes).toHaveLength(0);
    expect(oc.getContext().orientation).toBe('vertical');
  });

  it('defaultNodes ile olusturulur', () => {
    const oc = createOrgChart({ defaultNodes: NODES });
    expect(oc.getContext().nodes).toHaveLength(4);
    expect(oc.getContext().layout.length).toBeGreaterThan(0);
  });

  it('SET_NODES ile node lar guncellenir', () => {
    const oc = createOrgChart();
    oc.send({ type: 'SET_NODES', nodes: [CEO, CTO] });
    expect(oc.getContext().nodes).toHaveLength(2);
  });

  it('TOGGLE_COLLAPSE ile node acilir/kapanir', () => {
    const oc = createOrgChart({ defaultNodes: NODES });
    expect(oc.getContext().nodes.find((n) => n.id === 'cto')?.collapsed).toBe(false);
    oc.send({ type: 'TOGGLE_COLLAPSE', nodeId: 'cto' });
    expect(oc.getContext().nodes.find((n) => n.id === 'cto')?.collapsed).toBe(true);
  });

  it('EXPAND_ALL ile tum node lar acilir', () => {
    const oc = createOrgChart({ defaultNodes: NODES });
    oc.send({ type: 'COLLAPSE_ALL' });
    oc.send({ type: 'EXPAND_ALL' });
    oc.getContext().nodes.forEach((n) => expect(n.collapsed).toBe(false));
  });

  it('COLLAPSE_ALL ile root haric hepsi kapanir', () => {
    const oc = createOrgChart({ defaultNodes: NODES });
    oc.send({ type: 'COLLAPSE_ALL' });
    expect(oc.getContext().nodes.find((n) => n.id === 'ceo')?.collapsed).toBe(false);
    expect(oc.getContext().nodes.find((n) => n.id === 'cto')?.collapsed).toBe(true);
  });

  it('MOVE_NODE ile node reparent edilir', () => {
    const oc = createOrgChart({ defaultNodes: NODES });
    oc.send({ type: 'MOVE_NODE', nodeId: 'dev', newParentId: 'cfo' });
    expect(oc.getContext().nodes.find((n) => n.id === 'dev')?.parentId).toBe('cfo');
  });

  it('MOVE_NODE self-parent engellenir', () => {
    const oc = createOrgChart({ defaultNodes: NODES });
    const listener = vi.fn();
    oc.subscribe(listener);
    oc.send({ type: 'MOVE_NODE', nodeId: 'dev', newParentId: 'dev' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('SELECT ile node secilir', () => {
    const oc = createOrgChart({ defaultNodes: NODES });
    oc.send({ type: 'SELECT', nodeId: 'cto' });
    expect(oc.getContext().selectedNodeId).toBe('cto');
  });

  it('SET_ORIENTATION ile yon degisir', () => {
    const oc = createOrgChart({ defaultNodes: NODES });
    oc.send({ type: 'SET_ORIENTATION', orientation: 'horizontal' });
    expect(oc.getContext().orientation).toBe('horizontal');
  });

  it('onChange callback cagirilir', () => {
    const onChange = vi.fn();
    const oc = createOrgChart({ onChange });
    oc.send({ type: 'SET_NODES', nodes: [CEO] });
    expect(onChange).toHaveBeenCalled();
  });

  it('subscribe calisiyor', () => {
    const oc = createOrgChart();
    const listener = vi.fn();
    oc.subscribe(listener);
    oc.send({ type: 'SET_NODES', nodes: [CEO] });
    expect(listener).toHaveBeenCalled();
  });

  it('destroy calisiyor', () => {
    const oc = createOrgChart();
    const listener = vi.fn();
    oc.subscribe(listener);
    oc.destroy();
    oc.send({ type: 'SET_NODES', nodes: [CEO] });
    expect(listener).not.toHaveBeenCalled();
  });
});
