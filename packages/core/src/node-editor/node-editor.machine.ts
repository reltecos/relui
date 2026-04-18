/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * NodeEditor state machine — graph model.
 * NodeEditor state machine — graph model.
 *
 * @packageDocumentation
 */

import type {
  GraphNode,
  GraphEdge,
  GraphGroup,
  NodeEditorConfig,
  NodeEditorContext,
  NodeEditorEvent,
  NodeEditorAPI,
} from './node-editor.types';

// ── ID Counter ───────────────────────────────────────

let idCounter = 0;

function nextId(prefix: string): string {
  return `${prefix}-${++idCounter}`;
}

/** ID counter sifirla (test icin) / Reset ID counter */
export function resetNodeEditorIdCounter(): void {
  idCounter = 0;
}

// ── Helpers ──────────────────────────────────────────

function snapValue(val: number, gridSize: number, snap: boolean): number {
  if (!snap || gridSize <= 0) return val;
  return Math.round(val / gridSize) * gridSize;
}

function clampZoom(zoom: number): number {
  return Math.max(0.1, Math.min(5, zoom));
}

interface Snapshot {
  nodes: GraphNode[];
  edges: GraphEdge[];
  groups: GraphGroup[];
}

function cloneSnapshot(nodes: readonly GraphNode[], edges: readonly GraphEdge[], groups: readonly GraphGroup[]): Snapshot {
  return {
    nodes: nodes.map((n) => ({ ...n, ports: [...n.ports] })),
    edges: edges.map((e) => ({ ...e })),
    groups: groups.map((g) => ({ ...g, nodeIds: [...g.nodeIds] })),
  };
}

// ── State Machine ────────────────────────────────────

/**
 * NodeEditor state machine olusturur.
 * Creates a NodeEditor state machine.
 */
export function createNodeEditor(config: NodeEditorConfig = {}): NodeEditorAPI {
  const {
    defaultNodes = [],
    defaultEdges = [],
    defaultGroups = [],
    gridSize = 20,
    snapToGrid = false,
    onChange,
  } = config;

  // ── State ──
  let nodes: GraphNode[] = defaultNodes.map((n) => ({ ...n, ports: [...n.ports] }));
  let edges: GraphEdge[] = [...defaultEdges];
  let groups: GraphGroup[] = defaultGroups.map((g) => ({ ...g, nodeIds: [...g.nodeIds] }));
  const selectedIds = new Set<string>();
  let zoom = 1;
  let panX = 0;
  let panY = 0;

  const undoStack: Snapshot[] = [];
  const redoStack: Snapshot[] = [];

  const listeners = new Set<() => void>();

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  function pushUndo(): void {
    undoStack.push(cloneSnapshot(nodes, edges, groups));
    redoStack.length = 0;
  }

  function emitChange(): void {
    onChange?.(nodes, edges);
  }

  // ── Send ──
  function send(event: NodeEditorEvent): void {
    switch (event.type) {
      case 'ADD_NODE': {
        pushUndo();
        const node = {
          ...event.node,
          x: snapValue(event.node.x, gridSize, snapToGrid),
          y: snapValue(event.node.y, gridSize, snapToGrid),
        };
        nodes = [...nodes, node];
        emitChange();
        notify();
        break;
      }
      case 'DELETE_NODE': {
        if (!nodes.some((n) => n.id === event.nodeId)) return;
        pushUndo();
        nodes = nodes.filter((n) => n.id !== event.nodeId);
        edges = edges.filter(
          (e) => e.sourceNodeId !== event.nodeId && e.targetNodeId !== event.nodeId,
        );
        groups = groups.map((g) => ({
          ...g,
          nodeIds: g.nodeIds.filter((id) => id !== event.nodeId),
        }));
        selectedIds.delete(event.nodeId);
        emitChange();
        notify();
        break;
      }
      case 'MOVE_NODE': {
        const idx = nodes.findIndex((n) => n.id === event.nodeId);
        if (idx === -1) return;
        pushUndo();
        const x = snapValue(event.x, gridSize, snapToGrid);
        const y = snapValue(event.y, gridSize, snapToGrid);
        nodes = nodes.map((n, i) => (i === idx ? { ...n, x, y } : n));
        emitChange();
        notify();
        break;
      }
      case 'TOGGLE_COLLAPSE': {
        const idx = nodes.findIndex((n) => n.id === event.nodeId);
        if (idx === -1) return;
        nodes = nodes.map((n, i) =>
          i === idx ? { ...n, collapsed: !n.collapsed } : n,
        );
        notify();
        break;
      }
      case 'CONNECT': {
        // Ayni baglanti zaten var mi kontrol et
        const exists = edges.some(
          (e) =>
            e.sourceNodeId === event.edge.sourceNodeId &&
            e.sourcePortId === event.edge.sourcePortId &&
            e.targetNodeId === event.edge.targetNodeId &&
            e.targetPortId === event.edge.targetPortId,
        );
        if (exists) return;
        // Self-connection engelle
        if (event.edge.sourceNodeId === event.edge.targetNodeId) return;
        pushUndo();
        const edge: GraphEdge = {
          id: nextId('edge'),
          ...event.edge,
        };
        edges = [...edges, edge];
        emitChange();
        notify();
        break;
      }
      case 'DISCONNECT': {
        if (!edges.some((e) => e.id === event.edgeId)) return;
        pushUndo();
        edges = edges.filter((e) => e.id !== event.edgeId);
        emitChange();
        notify();
        break;
      }
      case 'ADD_GROUP': {
        pushUndo();
        const group: GraphGroup = {
          id: nextId('group'),
          ...event.group,
        };
        groups = [...groups, group];
        notify();
        break;
      }
      case 'DELETE_GROUP': {
        if (!groups.some((g) => g.id === event.groupId)) return;
        pushUndo();
        groups = groups.filter((g) => g.id !== event.groupId);
        selectedIds.delete(event.groupId);
        notify();
        break;
      }
      case 'SELECT': {
        for (const id of event.ids) {
          selectedIds.add(id);
        }
        notify();
        break;
      }
      case 'DESELECT_ALL': {
        if (selectedIds.size === 0) return;
        selectedIds.clear();
        notify();
        break;
      }
      case 'SET_ZOOM': {
        const newZoom = clampZoom(event.zoom);
        if (newZoom === zoom) return;
        zoom = newZoom;
        notify();
        break;
      }
      case 'SET_PAN': {
        panX = event.panX;
        panY = event.panY;
        notify();
        break;
      }
      case 'UNDO': {
        if (undoStack.length === 0) return;
        redoStack.push(cloneSnapshot(nodes, edges, groups));
        const prev = undoStack.pop();
        if (prev) {
          nodes = prev.nodes;
          edges = prev.edges;
          groups = prev.groups;
          emitChange();
        }
        notify();
        break;
      }
      case 'REDO': {
        if (redoStack.length === 0) return;
        undoStack.push(cloneSnapshot(nodes, edges, groups));
        const next = redoStack.pop();
        if (next) {
          nodes = next.nodes;
          edges = next.edges;
          groups = next.groups;
          emitChange();
        }
        notify();
        break;
      }
    }
  }

  // ── Serialize ──
  function serialize(): string {
    return JSON.stringify({ nodes, edges, groups }, null, 2);
  }

  return {
    getContext(): NodeEditorContext {
      return {
        nodes,
        edges,
        groups,
        selectedIds,
        zoom,
        panX,
        panY,
        canUndo: undoStack.length > 0,
        canRedo: redoStack.length > 0,
      };
    },
    send,
    subscribe(callback: () => void): () => void {
      listeners.add(callback);
      return () => { listeners.delete(callback); };
    },
    destroy(): void {
      listeners.clear();
    },
    serialize,
  };
}
