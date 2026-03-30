/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DataGrid tipleri.
 * DataGrid types.
 *
 * @packageDocumentation
 */

// ── Filter ──────────────────────────────────────────

/** Filtre operatorleri / Filter operators */
export type FilterOperator =
  | 'contains'
  | 'equals'
  | 'startsWith'
  | 'endsWith'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte';

/** Filtre durumu / Filter state */
export interface FilterState {
  /** Sutun anahtari / Column key */
  columnKey: string;
  /** Filtre degeri / Filter value */
  value: string;
  /** Filtre operatoru / Filter operator */
  operator: FilterOperator;
}

// ── Sort ────────────────────────────────────────────

/** Siralama yonu / Sort direction */
export type SortDirection = 'asc' | 'desc';

/** Siralama durumu / Sort state */
export interface SortState {
  /** Sutun anahtari / Column key */
  columnKey: string;
  /** Siralama yonu / Sort direction */
  direction: SortDirection;
}

// ── Column ──────────────────────────────────────────

/** Sutun hizalama / Column alignment */
export type ColumnAlign = 'left' | 'center' | 'right';

/** Sutun sabitleme / Column pin position */
export type ColumnPin = 'left' | 'right' | false;

/** Sutun tanimlari / Column definition */
export interface ColumnDef {
  /** Benzersiz anahtar / Unique key */
  key: string;
  /** Baslik / Title */
  title: string;
  /** Genislik (px) / Width in pixels */
  width?: number;
  /** Minimum genislik / Minimum width */
  minWidth?: number;
  /** Maksimum genislik / Maximum width */
  maxWidth?: number;
  /** Siralanabilir mi / Is sortable */
  sortable?: boolean;
  /** Filtrelenebilir mi / Is filterable */
  filterable?: boolean;
  /** Yeniden boyutlanabilir mi / Is resizable */
  resizable?: boolean;
  /** Sabitlenme pozisyonu / Pin position */
  pinned?: ColumnPin;
  /** Gorunur mu / Is visible */
  visible?: boolean;
  /** Duzenlenebilir mi / Is editable */
  editable?: boolean;
  /** Hizalama / Alignment */
  align?: ColumnAlign;
}

// ── Edit ────────────────────────────────────────────

/** Duzenleme durumu / Editing state */
export interface EditingCell {
  /** Satir id / Row ID */
  rowId: string;
  /** Sutun anahtari / Column key */
  columnKey: string;
  /** Duzenlenen deger / Editing value */
  value: string;
}

// ── Context ─────────────────────────────────────────

/** DataGrid state / DataGrid context */
export interface DataGridContext {
  /** Siralama durumu / Sort state */
  readonly sort: ReadonlyArray<SortState>;
  /** Filtre durumlari / Filter states */
  readonly filters: ReadonlyArray<FilterState>;
  /** Secili satir id leri / Selected row IDs */
  readonly selectedIds: ReadonlySet<string>;
  /** Genisletilmis satir id leri / Expanded row IDs */
  readonly expandedIds: ReadonlySet<string>;
  /** Sayfa numarasi (0-based) / Page number (0-based) */
  readonly page: number;
  /** Sayfa boyutu / Page size */
  readonly pageSize: number;
  /** Sutun sirasi / Column order (keys) */
  readonly columnOrder: ReadonlyArray<string>;
  /** Sutun genislikleri / Column widths */
  readonly columnWidths: ReadonlyMap<string, number>;
  /** Gizli sutunlar / Hidden column keys */
  readonly hiddenColumns: ReadonlySet<string>;
  /** Sabitlenmis sutunlar / Pinned columns */
  readonly pinnedColumns: ReadonlyMap<string, ColumnPin>;
  /** Duzenlenen hucre / Currently editing cell */
  readonly editingCell: EditingCell | null;
}

// ── Events ──────────────────────────────────────────

/** DataGrid event leri / DataGrid events */
export type DataGridEvent =
  | { type: 'SORT'; columnKey: string }
  | { type: 'CLEAR_SORT' }
  | { type: 'SET_FILTER'; columnKey: string; value: string; operator: FilterOperator }
  | { type: 'CLEAR_FILTER'; columnKey: string }
  | { type: 'CLEAR_ALL_FILTERS' }
  | { type: 'SELECT_ROW'; rowId: string }
  | { type: 'DESELECT_ROW'; rowId: string }
  | { type: 'TOGGLE_ROW'; rowId: string }
  | { type: 'SELECT_ALL'; rowIds: string[] }
  | { type: 'DESELECT_ALL' }
  | { type: 'SET_PAGE'; page: number }
  | { type: 'SET_PAGE_SIZE'; pageSize: number }
  | { type: 'TOGGLE_COLUMN_VISIBILITY'; columnKey: string }
  | { type: 'REORDER_COLUMNS'; columnOrder: string[] }
  | { type: 'RESIZE_COLUMN'; columnKey: string; width: number }
  | { type: 'PIN_COLUMN'; columnKey: string; pin: ColumnPin }
  | { type: 'TOGGLE_ROW_EXPANSION'; rowId: string }
  | { type: 'EXPAND_ROW'; rowId: string }
  | { type: 'COLLAPSE_ROW'; rowId: string }
  | { type: 'COLLAPSE_ALL_ROWS' }
  | { type: 'START_EDIT'; rowId: string; columnKey: string; value: string }
  | { type: 'UPDATE_EDIT'; value: string }
  | { type: 'COMMIT_EDIT' }
  | { type: 'CANCEL_EDIT' };

// ── Config ──────────────────────────────────────────

/** DataGrid yapilandirmasi / DataGrid configuration */
export interface DataGridConfig {
  /** Sutun tanimlari / Column definitions */
  columns: ColumnDef[];
  /** Secim modu / Selection mode */
  selectionMode?: 'none' | 'single' | 'multiple';
  /** Varsayilan sayfa boyutu / Default page size */
  defaultPageSize?: number;
  /** Coklu siralama / Allow multi-sort */
  multiSort?: boolean;
  /** Siralama degisince / On sort change */
  onSortChange?: (sort: SortState[]) => void;
  /** Filtre degisince / On filter change */
  onFilterChange?: (filters: FilterState[]) => void;
  /** Secim degisince / On selection change */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Sayfa degisince / On page change */
  onPageChange?: (page: number) => void;
  /** Duzenleme tamamlaninca / On edit commit */
  onEditCommit?: (rowId: string, columnKey: string, value: string) => void;
  /** Satir genisletme degisince / On row expansion change */
  onRowExpansionChange?: (expandedIds: string[]) => void;
}

// ── API ─────────────────────────────────────────────

/** DataGrid API / DataGrid API */
export interface DataGridAPI {
  /** Guncel context / Get current context */
  getContext(): DataGridContext;
  /** Event gonder / Send event */
  send(event: DataGridEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
  /** Temizle / Destroy */
  destroy(): void;
}
