/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createCanvas2D, type Canvas2DConfig, type Canvas2DAPI, type CanvasShape } from '@relteco/relui-core';

export type UseCanvas2DProps = Canvas2DConfig;
export interface UseCanvas2DReturn {
  shapes: readonly CanvasShape[]; selectedIds: ReadonlySet<string>;
  zoom: number; panX: number; panY: number; canUndo: boolean; canRedo: boolean;
  addShape: (s: CanvasShape) => void; deleteShape: (id: string) => void;
  updateShape: (id: string, u: Partial<Omit<CanvasShape, 'id'>>) => void;
  moveShape: (id: string, x: number, y: number) => void;
  resizeShape: (id: string, w: number, h: number) => void;
  select: (ids: string[]) => void; deselectAll: () => void;
  setZoom: (z: number) => void; setPan: (px: number, py: number) => void;
  bringForward: (id: string) => void; sendBackward: (id: string) => void;
  undo: () => void; redo: () => void; exportJSON: () => string;
  api: Canvas2DAPI;
}

export function useCanvas2D(props: UseCanvas2DProps = {}): UseCanvas2DReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<Canvas2DAPI | null>(null);
  if (apiRef.current === null) { apiRef.current = createCanvas2D(props); }
  const api = apiRef.current;
  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);
  const ctx = api.getContext();
  return {
    ...ctx,
    addShape: useCallback((s: CanvasShape) => api.send({ type: 'ADD_SHAPE', shape: s }), [api]),
    deleteShape: useCallback((id: string) => api.send({ type: 'DELETE_SHAPE', shapeId: id }), [api]),
    updateShape: useCallback((id: string, u: Partial<Omit<CanvasShape, 'id'>>) => api.send({ type: 'UPDATE_SHAPE', shapeId: id, updates: u }), [api]),
    moveShape: useCallback((id: string, x: number, y: number) => api.send({ type: 'MOVE_SHAPE', shapeId: id, x, y }), [api]),
    resizeShape: useCallback((id: string, w: number, h: number) => api.send({ type: 'RESIZE_SHAPE', shapeId: id, width: w, height: h }), [api]),
    select: useCallback((ids: string[]) => api.send({ type: 'SELECT', ids }), [api]),
    deselectAll: useCallback(() => api.send({ type: 'DESELECT_ALL' }), [api]),
    setZoom: useCallback((z: number) => api.send({ type: 'SET_ZOOM', zoom: z }), [api]),
    setPan: useCallback((px: number, py: number) => api.send({ type: 'SET_PAN', panX: px, panY: py }), [api]),
    bringForward: useCallback((id: string) => api.send({ type: 'BRING_FORWARD', shapeId: id }), [api]),
    sendBackward: useCallback((id: string) => api.send({ type: 'SEND_BACKWARD', shapeId: id }), [api]),
    undo: useCallback(() => api.send({ type: 'UNDO' }), [api]),
    redo: useCallback(() => api.send({ type: 'REDO' }), [api]),
    exportJSON: useCallback(() => api.exportJSON(), [api]),
    api,
  };
}
