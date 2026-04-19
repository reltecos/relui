/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createOrgChart, type OrgChartConfig, type OrgChartAPI, type OrgNode, type OrgChartOrientation } from '@relteco/relui-core';

export type UseOrgChartProps = OrgChartConfig;
export interface UseOrgChartReturn {
  nodes: ReturnType<OrgChartAPI['getContext']>['nodes'];
  layout: ReturnType<OrgChartAPI['getContext']>['layout'];
  selectedNodeId: string | null;
  orientation: OrgChartOrientation;
  setNodes: (nodes: OrgNode[]) => void;
  toggleCollapse: (nodeId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  moveNode: (nodeId: string, newParentId: string) => void;
  select: (nodeId: string | null) => void;
  setOrientation: (o: OrgChartOrientation) => void;
  api: OrgChartAPI;
}

export function useOrgChart(props: UseOrgChartProps = {}): UseOrgChartReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<OrgChartAPI | null>(null);
  if (apiRef.current === null) { apiRef.current = createOrgChart(props); }
  const api = apiRef.current;

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const ctx = api.getContext();
  return {
    ...ctx,
    setNodes: useCallback((n: OrgNode[]) => api.send({ type: 'SET_NODES', nodes: n }), [api]),
    toggleCollapse: useCallback((id: string) => api.send({ type: 'TOGGLE_COLLAPSE', nodeId: id }), [api]),
    expandAll: useCallback(() => api.send({ type: 'EXPAND_ALL' }), [api]),
    collapseAll: useCallback(() => api.send({ type: 'COLLAPSE_ALL' }), [api]),
    moveNode: useCallback((id: string, pid: string) => api.send({ type: 'MOVE_NODE', nodeId: id, newParentId: pid }), [api]),
    select: useCallback((id: string | null) => api.send({ type: 'SELECT', nodeId: id }), [api]),
    setOrientation: useCallback((o: OrgChartOrientation) => api.send({ type: 'SET_ORIENTATION', orientation: o }), [api]),
    api,
  };
}
