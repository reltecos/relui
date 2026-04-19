/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  OrgNode,
  OrgNodeLayout,
  OrgChartOrientation,
  OrgChartConfig,
  OrgChartContext,
  OrgChartEvent,
  OrgChartAPI,
} from './org-chart.types';

/** Tree layout hesaplama / Compute tree layout */
export function computeOrgLayout(
  nodes: readonly OrgNode[],
  orientation: OrgChartOrientation,
  nodeWidth: number,
  nodeHeight: number,
  hGap: number,
  vGap: number,
): OrgNodeLayout[] {
  const childrenMap = new Map<string | null, OrgNode[]>();
  for (const node of nodes) {
    const pid = node.parentId;
    if (!childrenMap.has(pid)) childrenMap.set(pid, []);
    childrenMap.get(pid)?.push(node);
  }

  const layouts: OrgNodeLayout[] = [];

  function getVisibleChildren(nodeId: string): OrgNode[] {
    const node = nodes.find((n) => n.id === nodeId);
    if (node?.collapsed) return [];
    return childrenMap.get(nodeId) ?? [];
  }

  function getSubtreeWidth(nodeId: string): number {
    const children = getVisibleChildren(nodeId);
    if (children.length === 0) return nodeWidth;
    const childWidths = children.map((c) => getSubtreeWidth(c.id));
    const totalChildWidth = childWidths.reduce((s, w) => s + w, 0) + (children.length - 1) * hGap;
    return Math.max(nodeWidth, totalChildWidth);
  }

  function layoutNode(nodeId: string, x: number, y: number): void {
    const subtreeW = getSubtreeWidth(nodeId);
    const nodeX = x + (subtreeW - nodeWidth) / 2;

    if (orientation === 'vertical') {
      layouts.push({ id: nodeId, x: nodeX, y, width: nodeWidth, height: nodeHeight });
    } else {
      layouts.push({ id: nodeId, x: y, y: nodeX, width: nodeHeight, height: nodeWidth });
    }

    const children = getVisibleChildren(nodeId);
    if (children.length === 0) return;

    const childWidths = children.map((c) => getSubtreeWidth(c.id));
    const totalChildWidth = childWidths.reduce((s, w) => s + w, 0) + (children.length - 1) * hGap;
    let childX = x + (subtreeW - totalChildWidth) / 2;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (!child) continue;
      layoutNode(child.id, childX, y + nodeHeight + vGap);
      childX += (childWidths[i] ?? 0) + hGap;
    }
  }

  const roots = childrenMap.get(null) ?? [];
  let startX = 0;
  for (const root of roots) {
    layoutNode(root.id, startX, 0);
    startX += getSubtreeWidth(root.id) + hGap;
  }

  return layouts;
}

export function createOrgChart(config: OrgChartConfig = {}): OrgChartAPI {
  const {
    defaultNodes = [],
    defaultOrientation = 'vertical',
    nodeWidth = 180,
    nodeHeight = 80,
    horizontalGap = 30,
    verticalGap = 40,
    onChange,
  } = config;

  let nodes: OrgNode[] = [...defaultNodes];
  let orientation: OrgChartOrientation = defaultOrientation;
  let selectedNodeId: string | null = null;
  let layout: OrgNodeLayout[] = computeOrgLayout(nodes, orientation, nodeWidth, nodeHeight, horizontalGap, verticalGap);

  const listeners = new Set<() => void>();
  function notify(): void { listeners.forEach((fn) => fn()); }

  function recompute(): void {
    layout = computeOrgLayout(nodes, orientation, nodeWidth, nodeHeight, horizontalGap, verticalGap);
  }

  function send(event: OrgChartEvent): void {
    switch (event.type) {
      case 'SET_NODES': {
        nodes = [...event.nodes];
        recompute();
        onChange?.(nodes);
        notify();
        break;
      }
      case 'TOGGLE_COLLAPSE': {
        nodes = nodes.map((n) => n.id === event.nodeId ? { ...n, collapsed: !n.collapsed } : n);
        recompute();
        notify();
        break;
      }
      case 'EXPAND_ALL': {
        nodes = nodes.map((n) => ({ ...n, collapsed: false }));
        recompute();
        notify();
        break;
      }
      case 'COLLAPSE_ALL': {
        const rootIds = new Set(nodes.filter((n) => n.parentId === null).map((n) => n.id));
        nodes = nodes.map((n) => ({ ...n, collapsed: !rootIds.has(n.id) }));
        recompute();
        notify();
        break;
      }
      case 'MOVE_NODE': {
        if (event.nodeId === event.newParentId) return;
        nodes = nodes.map((n) => n.id === event.nodeId ? { ...n, parentId: event.newParentId } : n);
        recompute();
        onChange?.(nodes);
        notify();
        break;
      }
      case 'SELECT': {
        if (selectedNodeId === event.nodeId) return;
        selectedNodeId = event.nodeId;
        notify();
        break;
      }
      case 'SET_ORIENTATION': {
        if (orientation === event.orientation) return;
        orientation = event.orientation;
        recompute();
        notify();
        break;
      }
    }
  }

  return {
    getContext(): OrgChartContext { return { nodes, layout, selectedNodeId, orientation }; },
    send,
    subscribe(cb: () => void): () => void {
      listeners.add(cb);
      return () => { listeners.delete(cb); };
    },
    destroy(): void { listeners.clear(); },
  };
}
