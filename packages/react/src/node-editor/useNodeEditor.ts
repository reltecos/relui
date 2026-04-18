/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useNodeEditor — NodeEditor React hook.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import {
  createNodeEditor,
  type NodeEditorConfig,
  type NodeEditorAPI,
  type GraphNode,
  type GraphEdge,
  type GraphGroup,
} from '@relteco/relui-core';

export type UseNodeEditorProps = NodeEditorConfig;

export interface UseNodeEditorReturn {
  nodes: readonly GraphNode[];
  edges: readonly GraphEdge[];
  groups: readonly GraphGroup[];
  selectedIds: ReadonlySet<string>;
  zoom: number;
  panX: number;
  panY: number;
  canUndo: boolean;
  canRedo: boolean;
  addNode: (node: GraphNode) => void;
  deleteNode: (nodeId: string) => void;
  moveNode: (nodeId: string, x: number, y: number) => void;
  toggleCollapse: (nodeId: string) => void;
  connect: (edge: Omit<GraphEdge, 'id'>) => void;
  disconnect: (edgeId: string) => void;
  addGroup: (group: Omit<GraphGroup, 'id'>) => void;
  deleteGroup: (groupId: string) => void;
  select: (ids: string[]) => void;
  deselectAll: () => void;
  setZoom: (zoom: number) => void;
  setPan: (panX: number, panY: number) => void;
  undo: () => void;
  redo: () => void;
  serialize: () => string;
  api: NodeEditorAPI;
}

export function useNodeEditor(props: UseNodeEditorProps = {}): UseNodeEditorReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<NodeEditorAPI | null>(null);

  if (apiRef.current === null) {
    apiRef.current = createNodeEditor(props);
  }
  const api = apiRef.current;

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const ctx = api.getContext();

  return {
    ...ctx,
    addNode: useCallback((n: GraphNode) => api.send({ type: 'ADD_NODE', node: n }), [api]),
    deleteNode: useCallback((id: string) => api.send({ type: 'DELETE_NODE', nodeId: id }), [api]),
    moveNode: useCallback((id: string, x: number, y: number) => api.send({ type: 'MOVE_NODE', nodeId: id, x, y }), [api]),
    toggleCollapse: useCallback((id: string) => api.send({ type: 'TOGGLE_COLLAPSE', nodeId: id }), [api]),
    connect: useCallback((e: Omit<GraphEdge, 'id'>) => api.send({ type: 'CONNECT', edge: e }), [api]),
    disconnect: useCallback((id: string) => api.send({ type: 'DISCONNECT', edgeId: id }), [api]),
    addGroup: useCallback((g: Omit<GraphGroup, 'id'>) => api.send({ type: 'ADD_GROUP', group: g }), [api]),
    deleteGroup: useCallback((id: string) => api.send({ type: 'DELETE_GROUP', groupId: id }), [api]),
    select: useCallback((ids: string[]) => api.send({ type: 'SELECT', ids }), [api]),
    deselectAll: useCallback(() => api.send({ type: 'DESELECT_ALL' }), [api]),
    setZoom: useCallback((z: number) => api.send({ type: 'SET_ZOOM', zoom: z }), [api]),
    setPan: useCallback((px: number, py: number) => api.send({ type: 'SET_PAN', panX: px, panY: py }), [api]),
    undo: useCallback(() => api.send({ type: 'UNDO' }), [api]),
    redo: useCallback(() => api.send({ type: 'REDO' }), [api]),
    serialize: useCallback(() => api.serialize(), [api]),
    api,
  };
}
