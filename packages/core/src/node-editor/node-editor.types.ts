/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * NodeEditor tipleri.
 * NodeEditor types.
 *
 * @packageDocumentation
 */

// ── Port ─────────────────────────────────────────────

/** Port yonu / Port direction */
export type PortDirection = 'input' | 'output';

/** Node portu / Node port */
export interface NodePort {
  /** Benzersiz id / Unique id */
  readonly id: string;
  /** Port adi / Port name */
  readonly name: string;
  /** Yon / Direction */
  readonly direction: PortDirection;
  /** Veri tipi / Data type (renk kodlama icin) */
  readonly dataType: string;
}

// ── Node ─────────────────────────────────────────────

/** Graph dugumu / Graph node */
export interface GraphNode {
  /** Benzersiz id / Unique id */
  readonly id: string;
  /** Node tipi / Node type */
  readonly type: string;
  /** Etiket / Label */
  readonly label: string;
  /** X pozisyonu / X position */
  readonly x: number;
  /** Y pozisyonu / Y position */
  readonly y: number;
  /** Genislik / Width */
  readonly width: number;
  /** Yukseklik / Height */
  readonly height: number;
  /** Portlar / Ports */
  readonly ports: readonly NodePort[];
  /** Kapali mi / Is collapsed */
  readonly collapsed: boolean;
}

// ── Edge ─────────────────────────────────────────────

/** Graph baglantisi / Graph edge */
export interface GraphEdge {
  /** Benzersiz id / Unique id */
  readonly id: string;
  /** Kaynak node id / Source node id */
  readonly sourceNodeId: string;
  /** Kaynak port id / Source port id */
  readonly sourcePortId: string;
  /** Hedef node id / Target node id */
  readonly targetNodeId: string;
  /** Hedef port id / Target port id */
  readonly targetPortId: string;
}

// ── Group ────────────────────────────────────────────

/** Node grubu / Node group */
export interface GraphGroup {
  /** Benzersiz id / Unique id */
  readonly id: string;
  /** Etiket / Label */
  readonly label: string;
  /** Grup icindeki node id'leri / Node ids in group */
  readonly nodeIds: readonly string[];
  /** X pozisyonu / X position */
  readonly x: number;
  /** Y pozisyonu / Y position */
  readonly y: number;
  /** Genislik / Width */
  readonly width: number;
  /** Yukseklik / Height */
  readonly height: number;
}

// ── Events ───────────────────────────────────────────

/** NodeEditor event'leri / NodeEditor events */
export type NodeEditorEvent =
  | { type: 'ADD_NODE'; node: GraphNode }
  | { type: 'DELETE_NODE'; nodeId: string }
  | { type: 'MOVE_NODE'; nodeId: string; x: number; y: number }
  | { type: 'TOGGLE_COLLAPSE'; nodeId: string }
  | { type: 'CONNECT'; edge: Omit<GraphEdge, 'id'> }
  | { type: 'DISCONNECT'; edgeId: string }
  | { type: 'ADD_GROUP'; group: Omit<GraphGroup, 'id'> }
  | { type: 'DELETE_GROUP'; groupId: string }
  | { type: 'SELECT'; ids: string[] }
  | { type: 'DESELECT_ALL' }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'SET_PAN'; panX: number; panY: number }
  | { type: 'UNDO' }
  | { type: 'REDO' };

// ── Context ──────────────────────────────────────────

/** NodeEditor state / NodeEditor context */
export interface NodeEditorContext {
  /** Dugumler / Nodes */
  readonly nodes: readonly GraphNode[];
  /** Baglantilar / Edges */
  readonly edges: readonly GraphEdge[];
  /** Gruplar / Groups */
  readonly groups: readonly GraphGroup[];
  /** Secili id'ler / Selected ids */
  readonly selectedIds: ReadonlySet<string>;
  /** Zum seviyesi / Zoom level */
  readonly zoom: number;
  /** Pan X / Pan X */
  readonly panX: number;
  /** Pan Y / Pan Y */
  readonly panY: number;
  /** Geri alinabilir mi / Can undo */
  readonly canUndo: boolean;
  /** Yinelenebilir mi / Can redo */
  readonly canRedo: boolean;
}

// ── Config ───────────────────────────────────────────

/** NodeEditor yapilandirmasi / NodeEditor configuration */
export interface NodeEditorConfig {
  /** Varsayilan dugumler / Default nodes */
  defaultNodes?: GraphNode[];
  /** Varsayilan baglantilar / Default edges */
  defaultEdges?: GraphEdge[];
  /** Varsayilan gruplar / Default groups */
  defaultGroups?: GraphGroup[];
  /** Grid boyutu / Grid size */
  gridSize?: number;
  /** Grid'e yapisma / Snap to grid */
  snapToGrid?: boolean;
  /** Degisince callback / On change callback */
  onChange?: (nodes: readonly GraphNode[], edges: readonly GraphEdge[]) => void;
}

// ── API ──────────────────────────────────────────────

/** NodeEditor API / NodeEditor API */
export interface NodeEditorAPI {
  /** Guncel context / Get current context */
  getContext(): NodeEditorContext;
  /** Event gonder / Send event */
  send(event: NodeEditorEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
  /** Temizlik / Cleanup */
  destroy(): void;
  /** JSON'a serialize et / Serialize to JSON */
  serialize(): string;
}
