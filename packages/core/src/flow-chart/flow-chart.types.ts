/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type FlowNodeType = 'process' | 'decision' | 'start' | 'end' | 'data';

export interface FlowNode {
  readonly id: string;
  readonly type: FlowNodeType;
  readonly label: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface FlowEdge {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
  readonly label?: string;
}

export type FlowChartEvent =
  | { type: 'ADD_NODE'; node: FlowNode }
  | { type: 'DELETE_NODE'; nodeId: string }
  | { type: 'MOVE_NODE'; nodeId: string; x: number; y: number }
  | { type: 'ADD_EDGE'; edge: Omit<FlowEdge, 'id'> }
  | { type: 'DELETE_EDGE'; edgeId: string }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'SET_PAN'; panX: number; panY: number }
  | { type: 'SELECT'; ids: string[] }
  | { type: 'DESELECT_ALL' }
  | { type: 'AUTO_LAYOUT' }
  | { type: 'UNDO' }
  | { type: 'REDO' };

export interface FlowChartContext {
  readonly nodes: readonly FlowNode[];
  readonly edges: readonly FlowEdge[];
  readonly selectedIds: ReadonlySet<string>;
  readonly zoom: number;
  readonly panX: number;
  readonly panY: number;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
}

export interface FlowChartConfig {
  defaultNodes?: FlowNode[];
  defaultEdges?: FlowEdge[];
  gridSize?: number;
  snapToGrid?: boolean;
  onChange?: (nodes: readonly FlowNode[], edges: readonly FlowEdge[]) => void;
}

export interface FlowChartAPI {
  getContext(): FlowChartContext;
  send(event: FlowChartEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}
