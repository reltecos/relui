/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  FlowNode,
  FlowEdge,
  FlowChartConfig,
  FlowChartContext,
  FlowChartEvent,
  FlowChartAPI,
} from './flow-chart.types';

let edgeIdCounter = 0;
function nextEdgeId(): string { return `fe-${++edgeIdCounter}`; }
export function resetFlowChartIdCounter(): void { edgeIdCounter = 0; }

function snapVal(v: number, grid: number, snap: boolean): number {
  return snap && grid > 0 ? Math.round(v / grid) * grid : v;
}

/** Basit topological auto-layout / Simple topological auto-layout */
export function autoLayoutNodes(nodes: readonly FlowNode[], edges: readonly FlowEdge[]): FlowNode[] {
  const inDeg = new Map<string, number>();
  const adj = new Map<string, string[]>();
  for (const n of nodes) { inDeg.set(n.id, 0); adj.set(n.id, []); }
  for (const e of edges) {
    inDeg.set(e.targetId, (inDeg.get(e.targetId) ?? 0) + 1);
    adj.get(e.sourceId)?.push(e.targetId);
  }

  const layers: string[][] = [];
  const visited = new Set<string>();
  let queue = nodes.filter((n) => (inDeg.get(n.id) ?? 0) === 0).map((n) => n.id);

  while (queue.length > 0) {
    layers.push([...queue]);
    for (const id of queue) visited.add(id);
    const next: string[] = [];
    for (const id of queue) {
      for (const tid of adj.get(id) ?? []) {
        inDeg.set(tid, (inDeg.get(tid) ?? 1) - 1);
        if ((inDeg.get(tid) ?? 0) <= 0 && !visited.has(tid)) {
          next.push(tid);
          visited.add(tid);
        }
      }
    }
    queue = next;
  }

  // Orphans
  for (const n of nodes) {
    if (!visited.has(n.id)) layers.push([n.id]);
  }

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const result: FlowNode[] = [];
  const hGap = 60;
  const vGap = 80;

  for (let li = 0; li < layers.length; li++) {
    const layer = layers[li] ?? [];
    const totalWidth = layer.reduce((s, id) => s + (nodeMap.get(id)?.width ?? 160), 0) + (layer.length - 1) * hGap;
    let x = -totalWidth / 2;
    for (const id of layer) {
      const n = nodeMap.get(id);
      if (!n) continue;
      result.push({ ...n, x, y: li * (n.height + vGap) });
      x += n.width + hGap;
    }
  }
  return result;
}

interface Snapshot { nodes: FlowNode[]; edges: FlowEdge[]; }

export function createFlowChart(config: FlowChartConfig = {}): FlowChartAPI {
  const { defaultNodes = [], defaultEdges = [], gridSize = 20, snapToGrid = false, onChange } = config;

  let nodes: FlowNode[] = [...defaultNodes];
  let edges: FlowEdge[] = [...defaultEdges];
  const selectedIds = new Set<string>();
  let zoom = 1;
  let panX = 0;
  let panY = 0;
  const undoStack: Snapshot[] = [];
  const redoStack: Snapshot[] = [];

  const listeners = new Set<() => void>();
  function notify(): void { listeners.forEach((fn) => fn()); }
  function pushUndo(): void { undoStack.push({ nodes: [...nodes], edges: [...edges] }); redoStack.length = 0; }

  function send(event: FlowChartEvent): void {
    switch (event.type) {
      case 'ADD_NODE': {
        pushUndo();
        const n = { ...event.node, x: snapVal(event.node.x, gridSize, snapToGrid), y: snapVal(event.node.y, gridSize, snapToGrid) };
        nodes = [...nodes, n];
        onChange?.(nodes, edges);
        notify();
        break;
      }
      case 'DELETE_NODE': {
        if (!nodes.some((n) => n.id === event.nodeId)) return;
        pushUndo();
        nodes = nodes.filter((n) => n.id !== event.nodeId);
        edges = edges.filter((e) => e.sourceId !== event.nodeId && e.targetId !== event.nodeId);
        selectedIds.delete(event.nodeId);
        onChange?.(nodes, edges);
        notify();
        break;
      }
      case 'MOVE_NODE': {
        const idx = nodes.findIndex((n) => n.id === event.nodeId);
        if (idx === -1) return;
        pushUndo();
        nodes = nodes.map((n) => n.id === event.nodeId ? { ...n, x: snapVal(event.x, gridSize, snapToGrid), y: snapVal(event.y, gridSize, snapToGrid) } : n);
        onChange?.(nodes, edges);
        notify();
        break;
      }
      case 'ADD_EDGE': {
        if (event.edge.sourceId === event.edge.targetId) return;
        if (edges.some((e) => e.sourceId === event.edge.sourceId && e.targetId === event.edge.targetId)) return;
        pushUndo();
        edges = [...edges, { id: nextEdgeId(), ...event.edge }];
        onChange?.(nodes, edges);
        notify();
        break;
      }
      case 'DELETE_EDGE': {
        if (!edges.some((e) => e.id === event.edgeId)) return;
        pushUndo();
        edges = edges.filter((e) => e.id !== event.edgeId);
        onChange?.(nodes, edges);
        notify();
        break;
      }
      case 'SET_ZOOM': {
        const z = Math.max(0.1, Math.min(5, event.zoom));
        if (z === zoom) return;
        zoom = z;
        notify();
        break;
      }
      case 'SET_PAN': {
        panX = event.panX;
        panY = event.panY;
        notify();
        break;
      }
      case 'SELECT': {
        for (const id of event.ids) selectedIds.add(id);
        notify();
        break;
      }
      case 'DESELECT_ALL': {
        if (selectedIds.size === 0) return;
        selectedIds.clear();
        notify();
        break;
      }
      case 'AUTO_LAYOUT': {
        pushUndo();
        nodes = autoLayoutNodes(nodes, edges);
        onChange?.(nodes, edges);
        notify();
        break;
      }
      case 'UNDO': {
        if (undoStack.length === 0) return;
        redoStack.push({ nodes: [...nodes], edges: [...edges] });
        const prev = undoStack.pop();
        if (prev) { nodes = prev.nodes; edges = prev.edges; onChange?.(nodes, edges); }
        notify();
        break;
      }
      case 'REDO': {
        if (redoStack.length === 0) return;
        undoStack.push({ nodes: [...nodes], edges: [...edges] });
        const next = redoStack.pop();
        if (next) { nodes = next.nodes; edges = next.edges; onChange?.(nodes, edges); }
        notify();
        break;
      }
    }
  }

  return {
    getContext(): FlowChartContext {
      return { nodes, edges, selectedIds, zoom, panX, panY, canUndo: undoStack.length > 0, canRedo: redoStack.length > 0 };
    },
    send,
    subscribe(cb: () => void): () => void { listeners.add(cb); return () => { listeners.delete(cb); }; },
    destroy(): void { listeners.clear(); },
  };
}
