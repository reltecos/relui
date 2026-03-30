/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Agac dugumu tanimi / Tree node definition */
export interface TreeNodeDef {
  /** Benzersiz id / Unique id */
  id: string;
  /** Etiket / Label */
  label: string;
  /** Alt dugumler / Children nodes */
  children?: TreeNodeDef[];
  /** Devre disi / Disabled */
  disabled?: boolean;
}

/** Secim modu / Selection mode */
export type TreeSelectionMode = 'single' | 'multiple' | 'none';

/** Ust-alt dugum iliskileri / Parent-child relationship maps */
export interface TreeStructureMap {
  /** Her parent in dogrudan children id listesi / Direct children per parent */
  parentToChildren: ReadonlyMap<string, readonly string[]>;
  /** Her child in parent id si / Parent of each child */
  childToParent: ReadonlyMap<string, string>;
}

/** Tree event tipleri / Tree event types */
export type TreeEvent =
  | { type: 'TOGGLE_EXPAND'; nodeId: string }
  | { type: 'EXPAND'; nodeId: string }
  | { type: 'COLLAPSE'; nodeId: string }
  | { type: 'EXPAND_ALL'; nodeIds: string[] }
  | { type: 'COLLAPSE_ALL' }
  | { type: 'SELECT'; nodeId: string }
  | { type: 'DESELECT'; nodeId: string }
  | { type: 'CHECK'; nodeId: string; allDescendants: string[] }
  | { type: 'UNCHECK'; nodeId: string; allDescendants: string[] }
  | { type: 'SET_TREE_MAP'; map: TreeStructureMap };

/** Tree context / Tree context */
export interface TreeContext {
  readonly expandedIds: ReadonlySet<string>;
  readonly selectedIds: ReadonlySet<string>;
  readonly checkedIds: ReadonlySet<string>;
  readonly indeterminateIds: ReadonlySet<string>;
}

/** Tree yapilandirma / Tree config */
export interface TreeConfig {
  /** Varsayilan acik dugumler / Default expanded node ids */
  defaultExpanded?: string[];
  /** Varsayilan secili dugumler / Default selected node ids */
  defaultSelected?: string[];
  /** Varsayilan isaretli dugumler / Default checked node ids */
  defaultChecked?: string[];
  /** Secim modu / Selection mode */
  selectionMode?: TreeSelectionMode;
  /** Checkbox aktif / Checkable */
  checkable?: boolean;
  /** Expand degisim callback / Expand change callback */
  onExpandChange?: (ids: string[]) => void;
  /** Secim degisim callback / Selection change callback */
  onSelectChange?: (ids: string[]) => void;
  /** Check degisim callback / Check change callback */
  onCheckChange?: (ids: string[]) => void;
}

/** Tree API / Tree API */
export interface TreeAPI {
  getContext(): TreeContext;
  send(event: TreeEvent): void;
  subscribe(fn: () => void): () => void;
  destroy(): void;
}
