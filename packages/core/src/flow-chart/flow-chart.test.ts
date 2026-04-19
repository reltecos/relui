/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createFlowChart, autoLayoutNodes, resetFlowChartIdCounter } from './flow-chart.machine';
import type { FlowNode, FlowEdge } from './flow-chart.types';

beforeEach(() => { resetFlowChartIdCounter(); });

const START: FlowNode = { id: 's', type: 'start', label: 'Start', x: 0, y: 0, width: 120, height: 60 };
const PROC: FlowNode = { id: 'p', type: 'process', label: 'Process', x: 0, y: 100, width: 160, height: 80 };
const END: FlowNode = { id: 'e', type: 'end', label: 'End', x: 0, y: 200, width: 120, height: 60 };
const EDGE1: FlowEdge = { id: 'e1', sourceId: 's', targetId: 'p' };
const EDGE2: FlowEdge = { id: 'e2', sourceId: 'p', targetId: 'e' };

describe('autoLayoutNodes', () => {
  it('bos graf bos doner', () => {
    expect(autoLayoutNodes([], [])).toEqual([]);
  });

  it('katmanli layout uretir', () => {
    const result = autoLayoutNodes([START, PROC, END], [EDGE1, EDGE2]);
    expect(result).toHaveLength(3);
    const startY = result.find((n) => n.id === 's')?.y ?? 0;
    const procY = result.find((n) => n.id === 'p')?.y ?? 0;
    expect(procY).toBeGreaterThan(startY);
  });

  it('bagimsiz node lar da yerlesir', () => {
    const orphan: FlowNode = { id: 'o', type: 'data', label: 'Orphan', x: 0, y: 0, width: 120, height: 60 };
    const result = autoLayoutNodes([START, orphan], []);
    expect(result).toHaveLength(2);
  });
});

describe('createFlowChart', () => {
  it('varsayilan degerle olusturulur', () => {
    const fc = createFlowChart();
    const ctx = fc.getContext();
    expect(ctx.nodes).toHaveLength(0);
    expect(ctx.edges).toHaveLength(0);
    expect(ctx.zoom).toBe(1);
  });

  it('defaultNodes ile olusturulur', () => {
    const fc = createFlowChart({ defaultNodes: [START, PROC], defaultEdges: [EDGE1] });
    expect(fc.getContext().nodes).toHaveLength(2);
    expect(fc.getContext().edges).toHaveLength(1);
  });

  it('ADD_NODE ile node eklenir', () => {
    const fc = createFlowChart();
    fc.send({ type: 'ADD_NODE', node: START });
    expect(fc.getContext().nodes).toHaveLength(1);
  });

  it('ADD_NODE snapToGrid ile yuvarlanir', () => {
    const fc = createFlowChart({ gridSize: 20, snapToGrid: true });
    fc.send({ type: 'ADD_NODE', node: { ...START, x: 15, y: 33 } });
    expect(fc.getContext().nodes[0]?.x).toBe(20);
    expect(fc.getContext().nodes[0]?.y).toBe(40);
  });

  it('DELETE_NODE ile node silinir', () => {
    const fc = createFlowChart({ defaultNodes: [START, PROC], defaultEdges: [EDGE1] });
    fc.send({ type: 'DELETE_NODE', nodeId: 's' });
    expect(fc.getContext().nodes).toHaveLength(1);
    expect(fc.getContext().edges).toHaveLength(0);
  });

  it('DELETE_NODE olmayan id icin notify etmez', () => {
    const fc = createFlowChart();
    const listener = vi.fn();
    fc.subscribe(listener);
    fc.send({ type: 'DELETE_NODE', nodeId: 'nope' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('MOVE_NODE ile node tasinir', () => {
    const fc = createFlowChart({ defaultNodes: [START] });
    fc.send({ type: 'MOVE_NODE', nodeId: 's', x: 100, y: 200 });
    expect(fc.getContext().nodes[0]?.x).toBe(100);
    expect(fc.getContext().nodes[0]?.y).toBe(200);
  });

  it('ADD_EDGE ile baglanti eklenir', () => {
    const fc = createFlowChart({ defaultNodes: [START, PROC] });
    fc.send({ type: 'ADD_EDGE', edge: { sourceId: 's', targetId: 'p' } });
    expect(fc.getContext().edges).toHaveLength(1);
  });

  it('ADD_EDGE self-connection engellenir', () => {
    const fc = createFlowChart({ defaultNodes: [START] });
    fc.send({ type: 'ADD_EDGE', edge: { sourceId: 's', targetId: 's' } });
    expect(fc.getContext().edges).toHaveLength(0);
  });

  it('ADD_EDGE duplicate engellenir', () => {
    const fc = createFlowChart({ defaultNodes: [START, PROC] });
    fc.send({ type: 'ADD_EDGE', edge: { sourceId: 's', targetId: 'p' } });
    fc.send({ type: 'ADD_EDGE', edge: { sourceId: 's', targetId: 'p' } });
    expect(fc.getContext().edges).toHaveLength(1);
  });

  it('DELETE_EDGE ile baglanti silinir', () => {
    const fc = createFlowChart({ defaultNodes: [START, PROC], defaultEdges: [EDGE1] });
    fc.send({ type: 'DELETE_EDGE', edgeId: 'e1' });
    expect(fc.getContext().edges).toHaveLength(0);
  });

  it('SET_ZOOM ile zum ayarlanir', () => {
    const fc = createFlowChart();
    fc.send({ type: 'SET_ZOOM', zoom: 1.5 });
    expect(fc.getContext().zoom).toBe(1.5);
  });

  it('SET_ZOOM clamp edilir', () => {
    const fc = createFlowChart();
    fc.send({ type: 'SET_ZOOM', zoom: 10 });
    expect(fc.getContext().zoom).toBe(5);
  });

  it('SET_PAN ile pan ayarlanir', () => {
    const fc = createFlowChart();
    fc.send({ type: 'SET_PAN', panX: 50, panY: -30 });
    expect(fc.getContext().panX).toBe(50);
  });

  it('SELECT ile node secilir', () => {
    const fc = createFlowChart({ defaultNodes: [START] });
    fc.send({ type: 'SELECT', ids: ['s'] });
    expect(fc.getContext().selectedIds.has('s')).toBe(true);
  });

  it('DESELECT_ALL ile secim temizlenir', () => {
    const fc = createFlowChart({ defaultNodes: [START] });
    fc.send({ type: 'SELECT', ids: ['s'] });
    fc.send({ type: 'DESELECT_ALL' });
    expect(fc.getContext().selectedIds.size).toBe(0);
  });

  it('AUTO_LAYOUT ile node lar yeniden yerlesir', () => {
    const fc = createFlowChart({ defaultNodes: [START, PROC, END], defaultEdges: [EDGE1, EDGE2] });
    fc.send({ type: 'AUTO_LAYOUT' });
    const startNode = fc.getContext().nodes.find((n) => n.id === 's');
    const procNode = fc.getContext().nodes.find((n) => n.id === 'p');
    expect(procNode && startNode ? procNode.y > startNode.y : false).toBe(true);
  });

  it('UNDO son islemi geri alir', () => {
    const fc = createFlowChart();
    fc.send({ type: 'ADD_NODE', node: START });
    fc.send({ type: 'UNDO' });
    expect(fc.getContext().nodes).toHaveLength(0);
  });

  it('REDO geri alinan islemi yineler', () => {
    const fc = createFlowChart();
    fc.send({ type: 'ADD_NODE', node: START });
    fc.send({ type: 'UNDO' });
    fc.send({ type: 'REDO' });
    expect(fc.getContext().nodes).toHaveLength(1);
  });

  it('onChange callback cagirilir', () => {
    const onChange = vi.fn();
    const fc = createFlowChart({ onChange });
    fc.send({ type: 'ADD_NODE', node: START });
    expect(onChange).toHaveBeenCalled();
  });

  it('subscribe calisiyor', () => {
    const fc = createFlowChart();
    const listener = vi.fn();
    fc.subscribe(listener);
    fc.send({ type: 'ADD_NODE', node: START });
    expect(listener).toHaveBeenCalled();
  });

  it('destroy calisiyor', () => {
    const fc = createFlowChart();
    const listener = vi.fn();
    fc.subscribe(listener);
    fc.destroy();
    fc.send({ type: 'ADD_NODE', node: START });
    expect(listener).not.toHaveBeenCalled();
  });
});
