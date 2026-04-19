/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { SankeyConfig, SankeyContext, SankeyEvent, SankeyAPI, SankeyNodeDef, SankeyLinkDef, SankeyNodeData, SankeyLinkData } from './sankey.types';
import { getChartColor } from '../chart-utils';

export function createSankey(config: SankeyConfig = {}): SankeyAPI {
  let nodeDefs: SankeyNodeDef[] = [...(config.nodes ?? [])];
  let linkDefs: SankeyLinkDef[] = [...(config.links ?? [])];
  const width = config.width ?? 500;
  const height = config.height ?? 300;
  const nodeWidth = config.nodeWidth ?? 20;
  const nodePadding = config.nodePadding ?? 10;

  const listeners = new Set<() => void>();
  function notify(): void { for (const fn of listeners) fn(); }

  function compute(): { nodes: SankeyNodeData[]; links: SankeyLinkData[] } {
    if (nodeDefs.length === 0) return { nodes: [], links: [] };

    // Assign depths via topological sort
    const depthMap = new Map<string, number>();
    const targetSet = new Set(linkDefs.map((l) => l.target));

    // Roots: sources that are not targets
    const roots = nodeDefs.filter((n) => !targetSet.has(n.id));
    const queue = roots.map((n) => n.id);
    for (const id of queue) depthMap.set(id, 0);

    const processed = new Set<string>();
    while (queue.length > 0) {
      const id = queue.shift();
      if (!id || processed.has(id)) continue;
      processed.add(id);
      const d = depthMap.get(id) ?? 0;
      for (const link of linkDefs) {
        if (link.source === id) {
          const existingD = depthMap.get(link.target) ?? 0;
          depthMap.set(link.target, Math.max(existingD, d + 1));
          if (!processed.has(link.target)) queue.push(link.target);
        }
      }
    }

    // Nodes not in depthMap (orphans)
    for (const n of nodeDefs) {
      if (!depthMap.has(n.id)) depthMap.set(n.id, 0);
    }

    const maxDepth = Math.max(0, ...Array.from(depthMap.values()));
    const columnWidth = maxDepth > 0 ? (width - nodeWidth) / maxDepth : 0;

    // Node values
    const nodeValueMap = new Map<string, number>();
    for (const n of nodeDefs) {
      const outVal = linkDefs.filter((l) => l.source === n.id).reduce((s, l) => s + l.value, 0);
      const inVal = linkDefs.filter((l) => l.target === n.id).reduce((s, l) => s + l.value, 0);
      nodeValueMap.set(n.id, Math.max(outVal, inVal, 1));
    }

    // Group by depth
    const depthGroups = new Map<number, SankeyNodeDef[]>();
    for (const n of nodeDefs) {
      const d = depthMap.get(n.id) ?? 0;
      if (!depthGroups.has(d)) depthGroups.set(d, []);
      depthGroups.get(d)?.push(n);
    }

    // Position nodes
    const nodeDataMap = new Map<string, SankeyNodeData>();

    for (const [depth, group] of depthGroups) {
      const totalValue = group.reduce((s, n) => s + (nodeValueMap.get(n.id) ?? 1), 0);
      const totalPadding = (group.length - 1) * nodePadding;
      const availableHeight = height - totalPadding;
      const scale = availableHeight / Math.max(totalValue, 1);

      let yOffset = 0;
      for (let i = 0; i < group.length; i++) {
        const n = group[i];
        if (!n) continue;
        const val = nodeValueMap.get(n.id) ?? 1;
        const h = Math.max(val * scale, 4);
        const x = depth * columnWidth;
        const color = n.color ?? getChartColor(i);

        nodeDataMap.set(n.id, {
          id: n.id, name: n.name, color, x, y: yOffset,
          width: nodeWidth, height: h, value: val, depth,
        });

        yOffset += h + nodePadding;
      }
    }

    const nodes = Array.from(nodeDataMap.values());

    // Build links with bezier paths
    const sourceYOffsets = new Map<string, number>();
    const targetYOffsets = new Map<string, number>();

    const links: SankeyLinkData[] = linkDefs.map((link) => {
      const sourceNode = nodeDataMap.get(link.source);
      const targetNode = nodeDataMap.get(link.target);
      if (!sourceNode || !targetNode) {
        return { source: link.source, target: link.target, value: link.value, color: 'transparent', path: '', width: 0 };
      }

      const totalSourceOut = linkDefs.filter((l) => l.source === link.source).reduce((s, l) => s + l.value, 0);
      const totalTargetIn = linkDefs.filter((l) => l.target === link.target).reduce((s, l) => s + l.value, 0);

      const linkWidth = Math.max(1, (link.value / Math.max(totalSourceOut, 1)) * sourceNode.height);

      const sYOff = sourceYOffsets.get(link.source) ?? 0;
      const tYOff = targetYOffsets.get(link.target) ?? 0;

      const x0 = sourceNode.x + sourceNode.width;
      const y0 = sourceNode.y + sYOff + linkWidth / 2;
      const x1 = targetNode.x;
      const y1 = targetNode.y + tYOff + linkWidth / 2;
      const midX = (x0 + x1) / 2;

      const path = `M ${x0} ${y0} C ${midX} ${y0}, ${midX} ${y1}, ${x1} ${y1}`;

      sourceYOffsets.set(link.source, sYOff + linkWidth);
      targetYOffsets.set(link.target, tYOff + (link.value / Math.max(totalTargetIn, 1)) * targetNode.height);

      return { source: link.source, target: link.target, value: link.value, color: sourceNode.color, path, width: linkWidth };
    });

    return { nodes, links };
  }

  function getContext(): SankeyContext {
    return compute();
  }

  function send(event: SankeyEvent): void {
    switch (event.type) {
      case 'SET_DATA':
        nodeDefs = [...event.nodes];
        linkDefs = [...event.links];
        notify();
        break;
    }
  }

  function subscribe(cb: () => void): () => void { listeners.add(cb); return () => { listeners.delete(cb); }; }
  function destroy(): void { listeners.clear(); }

  return { getContext, send, subscribe, destroy };
}
