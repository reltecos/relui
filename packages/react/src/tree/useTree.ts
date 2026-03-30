/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useTree — Tree core binding hook.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect, useCallback, useMemo } from 'react';
import { createTree } from '@relteco/relui-core';
import type { TreeConfig, TreeContext, TreeEvent, TreeAPI, TreeNodeDef, TreeStructureMap } from '@relteco/relui-core';

export interface UseTreeProps extends TreeConfig {
  /** Agac dugumleri (indeterminate hesabi icin) / Tree nodes (for indeterminate calc) */
  nodes?: TreeNodeDef[];
}

export interface UseTreeReturn {
  /** Mevcut context / Current context */
  context: TreeContext;
  /** Event gonder / Send event */
  send: (event: TreeEvent) => void;
  /** Core API / Core API */
  api: TreeAPI;
}

/** Bir dugumun tum alt dugumlerinin id listesini dondurur / Get all descendant ids */
export function getAllDescendantIds(node: TreeNodeDef): string[] {
  const ids: string[] = [];
  if (node.children) {
    for (const child of node.children) {
      ids.push(child.id);
      ids.push(...getAllDescendantIds(child));
    }
  }
  return ids;
}

/** Tum branch (children olan) dugumlerin id listesi / Get all branch node ids */
export function getAllBranchIds(nodes: TreeNodeDef[]): string[] {
  const ids: string[] = [];
  for (const node of nodes) {
    if (node.children && node.children.length > 0) {
      ids.push(node.id);
      ids.push(...getAllBranchIds(node.children));
    }
  }
  return ids;
}

/** TreeNodeDef[] den parent-child map olusturur / Build parent-child maps from nodes */
export function buildTreeStructureMap(nodes: TreeNodeDef[]): TreeStructureMap {
  const parentToChildren = new Map<string, string[]>();
  const childToParent = new Map<string, string>();

  function walk(list: TreeNodeDef[], parentId?: string): void {
    for (const node of list) {
      if (parentId !== undefined) {
        childToParent.set(node.id, parentId);
      }
      if (node.children && node.children.length > 0) {
        parentToChildren.set(node.id, node.children.map((c) => c.id));
        walk(node.children, node.id);
      }
    }
  }

  walk(nodes);
  return { parentToChildren, childToParent };
}

/** Gorunur (expanded) dugumlerin siralanmis id listesi / Ordered visible node ids */
export function getVisibleNodeIds(
  nodes: TreeNodeDef[],
  expandedIds: ReadonlySet<string>,
): string[] {
  const result: string[] = [];
  function walk(list: TreeNodeDef[]): void {
    for (const node of list) {
      result.push(node.id);
      if (node.children && node.children.length > 0 && expandedIds.has(node.id)) {
        walk(node.children);
      }
    }
  }
  walk(nodes);
  return result;
}

export function useTree(props: UseTreeProps): UseTreeReturn {
  const { nodes, ...coreConfig } = props;
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<TreeAPI | null>(null);
  const prevRef = useRef<UseTreeProps | undefined>(undefined);

  // Build tree structure map from nodes (synchronously)
  const treeMap = useMemo(() => {
    if (!nodes) return undefined;
    return buildTreeStructureMap(nodes);
  }, [nodes]);

  if (apiRef.current === null) {
    apiRef.current = createTree(coreConfig);
    // Send tree map synchronously on first render
    if (treeMap) {
      apiRef.current.send({ type: 'SET_TREE_MAP', map: treeMap });
    }
  }
  const api = apiRef.current;

  // Update tree map when nodes change
  const prevMapRef = useRef<TreeStructureMap | undefined>(undefined);
  if (treeMap !== prevMapRef.current && treeMap) {
    if (prevMapRef.current !== undefined) {
      api.send({ type: 'SET_TREE_MAP', map: treeMap });
    }
    prevMapRef.current = treeMap;
  }

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }
    prevRef.current = props;
  });

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const send = useCallback(
    (event: TreeEvent) => { api.send(event); },
    [api],
  );

  return {
    context: api.getContext(),
    send,
    api,
  };
}
