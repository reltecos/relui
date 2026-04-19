/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  CanvasShape,
  Canvas2DConfig,
  Canvas2DContext,
  Canvas2DEvent,
  Canvas2DAPI,
} from './canvas2d.types';

function snapVal(v: number, grid: number, snap: boolean): number {
  return snap && grid > 0 ? Math.round(v / grid) * grid : v;
}

interface Snapshot { shapes: CanvasShape[]; }

export function createCanvas2D(config: Canvas2DConfig = {}): Canvas2DAPI {
  const { defaultShapes = [], gridSize = 10, snapToGrid = false, onChange } = config;

  let shapes: CanvasShape[] = [...defaultShapes];
  const selectedIds = new Set<string>();
  let zoom = 1;
  let panX = 0;
  let panY = 0;
  const undoStack: Snapshot[] = [];
  const redoStack: Snapshot[] = [];

  const listeners = new Set<() => void>();
  function notify(): void { listeners.forEach((fn) => fn()); }
  function pushUndo(): void { undoStack.push({ shapes: shapes.map((s) => ({ ...s })) }); redoStack.length = 0; }

  function send(event: Canvas2DEvent): void {
    switch (event.type) {
      case 'ADD_SHAPE': {
        pushUndo();
        shapes = [...shapes, event.shape];
        onChange?.(shapes);
        notify();
        break;
      }
      case 'DELETE_SHAPE': {
        if (!shapes.some((s) => s.id === event.shapeId)) return;
        pushUndo();
        shapes = shapes.filter((s) => s.id !== event.shapeId);
        selectedIds.delete(event.shapeId);
        onChange?.(shapes);
        notify();
        break;
      }
      case 'UPDATE_SHAPE': {
        const idx = shapes.findIndex((s) => s.id === event.shapeId);
        if (idx === -1) return;
        pushUndo();
        shapes = shapes.map((s) => s.id === event.shapeId ? { ...s, ...event.updates } : s);
        onChange?.(shapes);
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
      case 'MOVE_SHAPE': {
        const idx = shapes.findIndex((s) => s.id === event.shapeId);
        if (idx === -1) return;
        const s = shapes[idx];
        if (!s || s.locked) return;
        pushUndo();
        shapes = shapes.map((sh) => sh.id === event.shapeId
          ? { ...sh, x: snapVal(event.x, gridSize, snapToGrid), y: snapVal(event.y, gridSize, snapToGrid) }
          : sh);
        onChange?.(shapes);
        notify();
        break;
      }
      case 'RESIZE_SHAPE': {
        const idx = shapes.findIndex((s) => s.id === event.shapeId);
        if (idx === -1) return;
        pushUndo();
        shapes = shapes.map((s) => s.id === event.shapeId
          ? { ...s, width: Math.max(1, event.width), height: Math.max(1, event.height) }
          : s);
        onChange?.(shapes);
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
      case 'BRING_FORWARD': {
        const idx = shapes.findIndex((s) => s.id === event.shapeId);
        if (idx === -1) return;
        pushUndo();
        const maxZ = Math.max(...shapes.map((s) => s.zIndex));
        shapes = shapes.map((s) => s.id === event.shapeId ? { ...s, zIndex: maxZ + 1 } : s);
        onChange?.(shapes);
        notify();
        break;
      }
      case 'SEND_BACKWARD': {
        const idx = shapes.findIndex((s) => s.id === event.shapeId);
        if (idx === -1) return;
        pushUndo();
        const minZ = Math.min(...shapes.map((s) => s.zIndex));
        shapes = shapes.map((s) => s.id === event.shapeId ? { ...s, zIndex: minZ - 1 } : s);
        onChange?.(shapes);
        notify();
        break;
      }
      case 'UNDO': {
        if (undoStack.length === 0) return;
        redoStack.push({ shapes: shapes.map((s) => ({ ...s })) });
        const prev = undoStack.pop();
        if (prev) { shapes = prev.shapes; onChange?.(shapes); }
        notify();
        break;
      }
      case 'REDO': {
        if (redoStack.length === 0) return;
        undoStack.push({ shapes: shapes.map((s) => ({ ...s })) });
        const next = redoStack.pop();
        if (next) { shapes = next.shapes; onChange?.(shapes); }
        notify();
        break;
      }
    }
  }

  return {
    getContext(): Canvas2DContext {
      return { shapes, selectedIds, zoom, panX, panY, canUndo: undoStack.length > 0, canRedo: redoStack.length > 0 };
    },
    send,
    subscribe(cb: () => void): () => void { listeners.add(cb); return () => { listeners.delete(cb); }; },
    destroy(): void { listeners.clear(); },
    exportJSON(): string { return JSON.stringify(shapes, null, 2); },
  };
}
