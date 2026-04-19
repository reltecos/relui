/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createFlowChart, type FlowChartConfig, type FlowChartAPI, type FlowNode, type FlowEdge } from '@relteco/relui-core';

export type UseFlowChartProps = FlowChartConfig;
export interface UseFlowChartReturn {
  nodes: readonly FlowNode[]; edges: readonly FlowEdge[]; selectedIds: ReadonlySet<string>;
  zoom: number; panX: number; panY: number; canUndo: boolean; canRedo: boolean;
  addNode: (n: FlowNode) => void; deleteNode: (id: string) => void;
  moveNode: (id: string, x: number, y: number) => void;
  addEdge: (e: Omit<FlowEdge, 'id'>) => void; deleteEdge: (id: string) => void;
  setZoom: (z: number) => void; setPan: (px: number, py: number) => void;
  select: (ids: string[]) => void; deselectAll: () => void;
  autoLayout: () => void; undo: () => void; redo: () => void;
  api: FlowChartAPI;
}

export function useFlowChart(props: UseFlowChartProps = {}): UseFlowChartReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<FlowChartAPI | null>(null);
  if (apiRef.current === null) { apiRef.current = createFlowChart(props); }
  const api = apiRef.current;
  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);
  const ctx = api.getContext();
  return {
    ...ctx,
    addNode: useCallback((n: FlowNode) => api.send({ type: 'ADD_NODE', node: n }), [api]),
    deleteNode: useCallback((id: string) => api.send({ type: 'DELETE_NODE', nodeId: id }), [api]),
    moveNode: useCallback((id: string, x: number, y: number) => api.send({ type: 'MOVE_NODE', nodeId: id, x, y }), [api]),
    addEdge: useCallback((e: Omit<FlowEdge, 'id'>) => api.send({ type: 'ADD_EDGE', edge: e }), [api]),
    deleteEdge: useCallback((id: string) => api.send({ type: 'DELETE_EDGE', edgeId: id }), [api]),
    setZoom: useCallback((z: number) => api.send({ type: 'SET_ZOOM', zoom: z }), [api]),
    setPan: useCallback((px: number, py: number) => api.send({ type: 'SET_PAN', panX: px, panY: py }), [api]),
    select: useCallback((ids: string[]) => api.send({ type: 'SELECT', ids }), [api]),
    deselectAll: useCallback(() => api.send({ type: 'DESELECT_ALL' }), [api]),
    autoLayout: useCallback(() => api.send({ type: 'AUTO_LAYOUT' }), [api]),
    undo: useCallback(() => api.send({ type: 'UNDO' }), [api]),
    redo: useCallback(() => api.send({ type: 'REDO' }), [api]),
    api,
  };
}
