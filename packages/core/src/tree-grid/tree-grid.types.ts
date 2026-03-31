/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Siralama yonu / Sort direction */
export type TreeGridSortDirection = 'asc' | 'desc';

/** Siralama durumu / Sort state */
export interface TreeGridSortState {
  columnKey: string;
  direction: TreeGridSortDirection;
}

/** Sutun hizalama / Column alignment */
export type TreeGridColumnAlign = 'left' | 'center' | 'right';

/** TreeGrid sutun tanimi / TreeGrid column definition */
export interface TreeGridColumnDef {
  /** Benzersiz anahtar / Unique key */
  key: string;
  /** Baslik / Title */
  title: string;
  /** Genislik (px) / Width in pixels */
  width?: number;
  /** Siralanabilir mi / Is sortable */
  sortable?: boolean;
  /** Hizalama / Alignment */
  align?: TreeGridColumnAlign;
}

/** TreeGrid satir tanimi / TreeGrid row definition */
export interface TreeGridRowDef {
  /** Benzersiz id / Unique id */
  id: string;
  /** Hucre verileri / Cell data */
  cells: Record<string, string | number>;
  /** Alt satirlar / Child rows */
  children?: TreeGridRowDef[];
}

/** TreeGrid event tipleri / TreeGrid event types */
export type TreeGridEvent =
  | { type: 'SORT'; columnKey: string }
  | { type: 'CLEAR_SORT' }
  | { type: 'TOGGLE_EXPAND'; rowId: string }
  | { type: 'EXPAND'; rowId: string }
  | { type: 'COLLAPSE'; rowId: string }
  | { type: 'EXPAND_ALL'; rowIds: string[] }
  | { type: 'COLLAPSE_ALL' }
  | { type: 'SELECT_ROW'; rowId: string }
  | { type: 'TOGGLE_ROW'; rowId: string }
  | { type: 'DESELECT_ALL' };

/** TreeGrid context / TreeGrid context */
export interface TreeGridContext {
  readonly sort: TreeGridSortState | null;
  readonly expandedIds: ReadonlySet<string>;
  readonly selectedIds: ReadonlySet<string>;
}

/** TreeGrid yapilandirma / TreeGrid config */
export interface TreeGridConfig {
  /** Sutun tanimlari / Column definitions */
  columns: TreeGridColumnDef[];
  /** Secim modu / Selection mode */
  selectionMode?: 'none' | 'single' | 'multiple';
  /** Varsayilan acik satirlar / Default expanded row ids */
  defaultExpanded?: string[];
  /** Siralama degisince / On sort change */
  onSortChange?: (sort: TreeGridSortState | null) => void;
  /** Expand degisince / On expand change */
  onExpandChange?: (ids: string[]) => void;
  /** Secim degisince / On selection change */
  onSelectionChange?: (ids: string[]) => void;
}

/** TreeGrid API / TreeGrid API */
export interface TreeGridAPI {
  getContext(): TreeGridContext;
  send(event: TreeGridEvent): void;
  subscribe(fn: () => void): () => void;
  destroy(): void;
}
