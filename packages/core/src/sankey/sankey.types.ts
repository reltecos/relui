/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface SankeyNodeDef {
  id: string;
  name: string;
  color?: string;
}

export interface SankeyLinkDef {
  source: string;
  target: string;
  value: number;
}

export interface SankeyNodeData {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  depth: number;
}

export interface SankeyLinkData {
  source: string;
  target: string;
  value: number;
  color: string;
  path: string;
  width: number;
}

export interface SankeyContext {
  readonly nodes: ReadonlyArray<SankeyNodeData>;
  readonly links: ReadonlyArray<SankeyLinkData>;
}

export type SankeyEvent =
  | { type: 'SET_DATA'; nodes: SankeyNodeDef[]; links: SankeyLinkDef[] };

export interface SankeyConfig {
  nodes?: SankeyNodeDef[];
  links?: SankeyLinkDef[];
  width?: number;
  height?: number;
  nodeWidth?: number;
  nodePadding?: number;
}

export interface SankeyAPI {
  getContext(): SankeyContext;
  send(event: SankeyEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}
