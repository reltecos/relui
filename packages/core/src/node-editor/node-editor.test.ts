/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createNodeEditor, resetNodeEditorIdCounter } from './node-editor.machine';
import type { GraphNode, GraphEdge } from './node-editor.types';

const makeNode = (id: string, x = 0, y = 0): GraphNode => ({
  id,
  type: 'default',
  label: `Node ${id}`,
  x,
  y,
  width: 200,
  height: 100,
  ports: [
    { id: `${id}-out`, name: 'output', direction: 'output', dataType: 'number' },
    { id: `${id}-in`, name: 'input', direction: 'input', dataType: 'number' },
  ],
  collapsed: false,
});

const makeEdge = (id: string, src: string, srcPort: string, tgt: string, tgtPort: string): GraphEdge => ({
  id,
  sourceNodeId: src,
  sourcePortId: srcPort,
  targetNodeId: tgt,
  targetPortId: tgtPort,
});

beforeEach(() => {
  resetNodeEditorIdCounter();
});

describe('createNodeEditor', () => {
  // ── Create ──

  it('varsayilan degerle olusturulur', () => {
    const editor = createNodeEditor();
    const ctx = editor.getContext();
    expect(ctx.nodes).toHaveLength(0);
    expect(ctx.edges).toHaveLength(0);
    expect(ctx.zoom).toBe(1);
    expect(ctx.panX).toBe(0);
  });

  it('defaultNodes ile olusturulur', () => {
    const editor = createNodeEditor({ defaultNodes: [makeNode('n1')] });
    expect(editor.getContext().nodes).toHaveLength(1);
    expect(editor.getContext().nodes[0]?.id).toBe('n1');
  });

  it('defaultEdges ile olusturulur', () => {
    const editor = createNodeEditor({
      defaultNodes: [makeNode('n1'), makeNode('n2')],
      defaultEdges: [makeEdge('e1', 'n1', 'n1-out', 'n2', 'n2-in')],
    });
    expect(editor.getContext().edges).toHaveLength(1);
  });

  // ── ADD_NODE ──

  it('ADD_NODE ile node eklenir', () => {
    const editor = createNodeEditor();
    editor.send({ type: 'ADD_NODE', node: makeNode('n1', 100, 200) });
    expect(editor.getContext().nodes).toHaveLength(1);
    expect(editor.getContext().nodes[0]?.x).toBe(100);
  });

  it('ADD_NODE snapToGrid ile yuvarlanir', () => {
    const editor = createNodeEditor({ gridSize: 20, snapToGrid: true });
    editor.send({ type: 'ADD_NODE', node: makeNode('n1', 15, 33) });
    expect(editor.getContext().nodes[0]?.x).toBe(20);
    expect(editor.getContext().nodes[0]?.y).toBe(40);
  });

  // ── DELETE_NODE ──

  it('DELETE_NODE ile node silinir', () => {
    const editor = createNodeEditor({ defaultNodes: [makeNode('n1'), makeNode('n2')] });
    editor.send({ type: 'DELETE_NODE', nodeId: 'n1' });
    expect(editor.getContext().nodes).toHaveLength(1);
    expect(editor.getContext().nodes[0]?.id).toBe('n2');
  });

  it('DELETE_NODE iliskili edge leri de siler', () => {
    const editor = createNodeEditor({
      defaultNodes: [makeNode('n1'), makeNode('n2')],
      defaultEdges: [makeEdge('e1', 'n1', 'n1-out', 'n2', 'n2-in')],
    });
    editor.send({ type: 'DELETE_NODE', nodeId: 'n1' });
    expect(editor.getContext().edges).toHaveLength(0);
  });

  it('DELETE_NODE olmayan node icin notify etmez', () => {
    const editor = createNodeEditor();
    const listener = vi.fn();
    editor.subscribe(listener);
    editor.send({ type: 'DELETE_NODE', nodeId: 'nonexistent' });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── MOVE_NODE ──

  it('MOVE_NODE ile node tasinir', () => {
    const editor = createNodeEditor({ defaultNodes: [makeNode('n1', 0, 0)] });
    editor.send({ type: 'MOVE_NODE', nodeId: 'n1', x: 150, y: 250 });
    expect(editor.getContext().nodes[0]?.x).toBe(150);
    expect(editor.getContext().nodes[0]?.y).toBe(250);
  });

  it('MOVE_NODE snapToGrid ile yuvarlanir', () => {
    const editor = createNodeEditor({
      defaultNodes: [makeNode('n1', 0, 0)],
      gridSize: 10,
      snapToGrid: true,
    });
    editor.send({ type: 'MOVE_NODE', nodeId: 'n1', x: 13, y: 27 });
    expect(editor.getContext().nodes[0]?.x).toBe(10);
    expect(editor.getContext().nodes[0]?.y).toBe(30);
  });

  // ── TOGGLE_COLLAPSE ──

  it('TOGGLE_COLLAPSE ile node kapanir/acilir', () => {
    const editor = createNodeEditor({ defaultNodes: [makeNode('n1')] });
    expect(editor.getContext().nodes[0]?.collapsed).toBe(false);
    editor.send({ type: 'TOGGLE_COLLAPSE', nodeId: 'n1' });
    expect(editor.getContext().nodes[0]?.collapsed).toBe(true);
    editor.send({ type: 'TOGGLE_COLLAPSE', nodeId: 'n1' });
    expect(editor.getContext().nodes[0]?.collapsed).toBe(false);
  });

  // ── CONNECT ──

  it('CONNECT ile edge eklenir', () => {
    const editor = createNodeEditor({ defaultNodes: [makeNode('n1'), makeNode('n2')] });
    editor.send({
      type: 'CONNECT',
      edge: { sourceNodeId: 'n1', sourcePortId: 'n1-out', targetNodeId: 'n2', targetPortId: 'n2-in' },
    });
    expect(editor.getContext().edges).toHaveLength(1);
  });

  it('CONNECT ayni baglanti tekrar eklenmez', () => {
    const editor = createNodeEditor({ defaultNodes: [makeNode('n1'), makeNode('n2')] });
    const edge = { sourceNodeId: 'n1', sourcePortId: 'n1-out', targetNodeId: 'n2', targetPortId: 'n2-in' };
    editor.send({ type: 'CONNECT', edge });
    editor.send({ type: 'CONNECT', edge });
    expect(editor.getContext().edges).toHaveLength(1);
  });

  it('CONNECT self-connection engellenir', () => {
    const editor = createNodeEditor({ defaultNodes: [makeNode('n1')] });
    editor.send({
      type: 'CONNECT',
      edge: { sourceNodeId: 'n1', sourcePortId: 'n1-out', targetNodeId: 'n1', targetPortId: 'n1-in' },
    });
    expect(editor.getContext().edges).toHaveLength(0);
  });

  // ── DISCONNECT ──

  it('DISCONNECT ile edge silinir', () => {
    const editor = createNodeEditor({
      defaultNodes: [makeNode('n1'), makeNode('n2')],
      defaultEdges: [makeEdge('e1', 'n1', 'n1-out', 'n2', 'n2-in')],
    });
    editor.send({ type: 'DISCONNECT', edgeId: 'e1' });
    expect(editor.getContext().edges).toHaveLength(0);
  });

  // ── ADD_GROUP / DELETE_GROUP ──

  it('ADD_GROUP ile grup eklenir', () => {
    const editor = createNodeEditor({ defaultNodes: [makeNode('n1'), makeNode('n2')] });
    editor.send({
      type: 'ADD_GROUP',
      group: { label: 'Group 1', nodeIds: ['n1', 'n2'], x: 0, y: 0, width: 400, height: 300 },
    });
    expect(editor.getContext().groups).toHaveLength(1);
  });

  it('DELETE_GROUP ile grup silinir', () => {
    const editor = createNodeEditor({
      defaultGroups: [{ id: 'g1', label: 'G', nodeIds: [], x: 0, y: 0, width: 100, height: 100 }],
    });
    editor.send({ type: 'DELETE_GROUP', groupId: 'g1' });
    expect(editor.getContext().groups).toHaveLength(0);
  });

  // ── SELECT / DESELECT ──

  it('SELECT ile node secilir', () => {
    const editor = createNodeEditor({ defaultNodes: [makeNode('n1')] });
    editor.send({ type: 'SELECT', ids: ['n1'] });
    expect(editor.getContext().selectedIds.has('n1')).toBe(true);
  });

  it('DESELECT_ALL ile secim temizlenir', () => {
    const editor = createNodeEditor({ defaultNodes: [makeNode('n1')] });
    editor.send({ type: 'SELECT', ids: ['n1'] });
    editor.send({ type: 'DESELECT_ALL' });
    expect(editor.getContext().selectedIds.size).toBe(0);
  });

  // ── ZOOM / PAN ──

  it('SET_ZOOM ile zum ayarlanir', () => {
    const editor = createNodeEditor();
    editor.send({ type: 'SET_ZOOM', zoom: 1.5 });
    expect(editor.getContext().zoom).toBe(1.5);
  });

  it('SET_ZOOM clamp edilir', () => {
    const editor = createNodeEditor();
    editor.send({ type: 'SET_ZOOM', zoom: 10 });
    expect(editor.getContext().zoom).toBe(5);
    editor.send({ type: 'SET_ZOOM', zoom: 0.01 });
    expect(editor.getContext().zoom).toBe(0.1);
  });

  it('SET_PAN ile pan ayarlanir', () => {
    const editor = createNodeEditor();
    editor.send({ type: 'SET_PAN', panX: 100, panY: -50 });
    expect(editor.getContext().panX).toBe(100);
    expect(editor.getContext().panY).toBe(-50);
  });

  // ── UNDO / REDO ──

  it('UNDO son islemi geri alir', () => {
    const editor = createNodeEditor();
    editor.send({ type: 'ADD_NODE', node: makeNode('n1') });
    expect(editor.getContext().nodes).toHaveLength(1);
    editor.send({ type: 'UNDO' });
    expect(editor.getContext().nodes).toHaveLength(0);
  });

  it('REDO geri alinan islemi yineler', () => {
    const editor = createNodeEditor();
    editor.send({ type: 'ADD_NODE', node: makeNode('n1') });
    editor.send({ type: 'UNDO' });
    editor.send({ type: 'REDO' });
    expect(editor.getContext().nodes).toHaveLength(1);
  });

  it('canUndo / canRedo dogru set edilir', () => {
    const editor = createNodeEditor();
    expect(editor.getContext().canUndo).toBe(false);
    editor.send({ type: 'ADD_NODE', node: makeNode('n1') });
    expect(editor.getContext().canUndo).toBe(true);
    editor.send({ type: 'UNDO' });
    expect(editor.getContext().canRedo).toBe(true);
  });

  // ── Serialize ──

  it('serialize JSON uretir', () => {
    const editor = createNodeEditor({ defaultNodes: [makeNode('n1')] });
    const json = editor.serialize();
    const parsed = JSON.parse(json) as { nodes: GraphNode[] };
    expect(parsed.nodes).toHaveLength(1);
    expect(parsed.nodes[0]?.id).toBe('n1');
  });

  // ── onChange ──

  it('onChange callback cagirilir', () => {
    const onChange = vi.fn();
    const editor = createNodeEditor({ onChange });
    editor.send({ type: 'ADD_NODE', node: makeNode('n1') });
    expect(onChange).toHaveBeenCalled();
  });

  // ── Subscribe / Destroy ──

  it('subscribe calisiyor', () => {
    const editor = createNodeEditor();
    const listener = vi.fn();
    editor.subscribe(listener);
    editor.send({ type: 'ADD_NODE', node: makeNode('n1') });
    expect(listener).toHaveBeenCalled();
  });

  it('destroy calisiyor', () => {
    const editor = createNodeEditor();
    const listener = vi.fn();
    editor.subscribe(listener);
    editor.destroy();
    editor.send({ type: 'ADD_NODE', node: makeNode('n1') });
    expect(listener).not.toHaveBeenCalled();
  });
});
