/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type OrgChartOrientation = 'vertical' | 'horizontal';

export interface OrgNode {
  readonly id: string;
  readonly name: string;
  readonly title: string;
  readonly avatar?: string;
  readonly parentId: string | null;
  readonly collapsed: boolean;
}

/** Hesaplanmis layout pozisyonu / Computed layout position */
export interface OrgNodeLayout {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export type OrgChartEvent =
  | { type: 'SET_NODES'; nodes: OrgNode[] }
  | { type: 'TOGGLE_COLLAPSE'; nodeId: string }
  | { type: 'EXPAND_ALL' }
  | { type: 'COLLAPSE_ALL' }
  | { type: 'MOVE_NODE'; nodeId: string; newParentId: string }
  | { type: 'SELECT'; nodeId: string | null }
  | { type: 'SET_ORIENTATION'; orientation: OrgChartOrientation };

export interface OrgChartContext {
  readonly nodes: readonly OrgNode[];
  readonly layout: readonly OrgNodeLayout[];
  readonly selectedNodeId: string | null;
  readonly orientation: OrgChartOrientation;
}

export interface OrgChartConfig {
  defaultNodes?: OrgNode[];
  defaultOrientation?: OrgChartOrientation;
  nodeWidth?: number;
  nodeHeight?: number;
  horizontalGap?: number;
  verticalGap?: number;
  onChange?: (nodes: readonly OrgNode[]) => void;
}

export interface OrgChartAPI {
  getContext(): OrgChartContext;
  send(event: OrgChartEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}
