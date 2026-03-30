/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DataGrid state machine.
 *
 * @packageDocumentation
 */

import type {
  DataGridConfig,
  DataGridContext,
  DataGridEvent,
  DataGridAPI,
  SortState,
  FilterState,
  EditingCell,
  ColumnPin,
} from './data-grid.types';

/**
 * DataGrid state machine olusturur.
 * Creates a DataGrid state machine.
 */
export function createDataGrid(config: DataGridConfig): DataGridAPI {
  const {
    columns,
    selectionMode = 'none',
    defaultPageSize = 50,
    multiSort = false,
    onSortChange,
    onFilterChange,
    onSelectionChange,
    onPageChange,
    onEditCommit,
    onRowExpansionChange,
  } = config;

  // ── State ──
  let sort: SortState[] = [];
  let filters: FilterState[] = [];
  let selectedIds = new Set<string>();
  let expandedIds = new Set<string>();
  let page = 0;
  let pageSize = defaultPageSize;
  let columnOrder: string[] = columns.map((c) => c.key);
  let columnWidths = new Map<string, number>();
  let hiddenColumns = new Set<string>();
  let pinnedColumns = new Map<string, ColumnPin>();
  let editingCell: EditingCell | null = null;

  // Init widths & visibility & pin from column defs
  for (const col of columns) {
    if (col.width !== undefined) columnWidths.set(col.key, col.width);
    if (col.visible === false) hiddenColumns.add(col.key);
    if (col.pinned === 'left' || col.pinned === 'right') pinnedColumns.set(col.key, col.pinned);
  }

  // ── Subscribers ──
  const listeners = new Set<() => void>();

  function notify(): void {
    for (const fn of listeners) fn();
  }

  // ── Context ──
  function getContext(): DataGridContext {
    return {
      sort: [...sort],
      filters: [...filters],
      selectedIds: new Set(selectedIds),
      expandedIds: new Set(expandedIds),
      page,
      pageSize,
      columnOrder: [...columnOrder],
      columnWidths: new Map(columnWidths),
      hiddenColumns: new Set(hiddenColumns),
      pinnedColumns: new Map(pinnedColumns),
      editingCell,
    };
  }

  // ── Sort helpers ──
  function handleSort(columnKey: string): void {
    const col = columns.find((c) => c.key === columnKey);
    if (!col?.sortable) return;

    const existing = sort.findIndex((s) => s.columnKey === columnKey);
    if (existing !== -1) {
      const current = sort[existing] as SortState;
      if (current.direction === 'asc') {
        sort = multiSort
          ? sort.map((s, i) => (i === existing ? { ...s, direction: 'desc' as const } : s))
          : [{ columnKey, direction: 'desc' }];
      } else {
        sort = multiSort ? sort.filter((_, i) => i !== existing) : [];
      }
    } else {
      const newSort: SortState = { columnKey, direction: 'asc' };
      sort = multiSort ? [...sort, newSort] : [newSort];
    }
    page = 0;
    onSortChange?.(sort);
  }

  // ── Filter helpers ──
  function handleSetFilter(columnKey: string, value: string, operator: FilterState['operator']): void {
    const idx = filters.findIndex((f) => f.columnKey === columnKey);
    if (value === '') {
      filters = filters.filter((f) => f.columnKey !== columnKey);
    } else if (idx !== -1) {
      filters = filters.map((f, i) => (i === idx ? { columnKey, value, operator } : f));
    } else {
      filters = [...filters, { columnKey, value, operator }];
    }
    page = 0;
    onFilterChange?.(filters);
  }

  // ── Selection helpers ──
  function handleSelectRow(rowId: string): void {
    if (selectionMode === 'none') return;
    if (selectionMode === 'single') {
      selectedIds = new Set([rowId]);
    } else {
      selectedIds = new Set(selectedIds);
      selectedIds.add(rowId);
    }
    onSelectionChange?.(Array.from(selectedIds));
  }

  function handleDeselectRow(rowId: string): void {
    if (selectionMode === 'none') return;
    selectedIds = new Set(selectedIds);
    selectedIds.delete(rowId);
    onSelectionChange?.(Array.from(selectedIds));
  }

  function handleToggleRow(rowId: string): void {
    if (selectedIds.has(rowId)) {
      handleDeselectRow(rowId);
    } else {
      handleSelectRow(rowId);
    }
  }

  // ── Send ──
  function send(event: DataGridEvent): void {
    switch (event.type) {
      // ── Sort ──
      case 'SORT':
        handleSort(event.columnKey);
        notify();
        break;
      case 'CLEAR_SORT':
        sort = [];
        onSortChange?.([]);
        notify();
        break;

      // ── Filter ──
      case 'SET_FILTER':
        handleSetFilter(event.columnKey, event.value, event.operator);
        notify();
        break;
      case 'CLEAR_FILTER':
        filters = filters.filter((f) => f.columnKey !== event.columnKey);
        page = 0;
        onFilterChange?.(filters);
        notify();
        break;
      case 'CLEAR_ALL_FILTERS':
        filters = [];
        page = 0;
        onFilterChange?.([]);
        notify();
        break;

      // ── Selection ──
      case 'SELECT_ROW':
        handleSelectRow(event.rowId);
        notify();
        break;
      case 'DESELECT_ROW':
        handleDeselectRow(event.rowId);
        notify();
        break;
      case 'TOGGLE_ROW':
        handleToggleRow(event.rowId);
        notify();
        break;
      case 'SELECT_ALL':
        if (selectionMode !== 'multiple') break;
        selectedIds = new Set(event.rowIds);
        onSelectionChange?.(event.rowIds);
        notify();
        break;
      case 'DESELECT_ALL':
        selectedIds = new Set();
        onSelectionChange?.([]);
        notify();
        break;

      // ── Pagination ──
      case 'SET_PAGE':
        if (event.page < 0) break;
        page = event.page;
        onPageChange?.(page);
        notify();
        break;
      case 'SET_PAGE_SIZE':
        if (event.pageSize < 1) break;
        pageSize = event.pageSize;
        page = 0;
        notify();
        break;

      // ── Column operations ──
      case 'TOGGLE_COLUMN_VISIBILITY': {
        hiddenColumns = new Set(hiddenColumns);
        if (hiddenColumns.has(event.columnKey)) {
          hiddenColumns.delete(event.columnKey);
        } else {
          hiddenColumns.add(event.columnKey);
        }
        notify();
        break;
      }
      case 'REORDER_COLUMNS':
        columnOrder = [...event.columnOrder];
        notify();
        break;
      case 'RESIZE_COLUMN': {
        const col = columns.find((c) => c.key === event.columnKey);
        if (!col) break;
        let w = event.width;
        if (col.minWidth !== undefined && w < col.minWidth) w = col.minWidth;
        if (col.maxWidth !== undefined && w > col.maxWidth) w = col.maxWidth;
        columnWidths = new Map(columnWidths);
        columnWidths.set(event.columnKey, w);
        notify();
        break;
      }
      case 'PIN_COLUMN':
        pinnedColumns = new Map(pinnedColumns);
        if (event.pin === false) {
          pinnedColumns.delete(event.columnKey);
        } else {
          pinnedColumns.set(event.columnKey, event.pin);
        }
        notify();
        break;

      // ── Row expansion ──
      case 'TOGGLE_ROW_EXPANSION': {
        expandedIds = new Set(expandedIds);
        if (expandedIds.has(event.rowId)) {
          expandedIds.delete(event.rowId);
        } else {
          expandedIds.add(event.rowId);
        }
        onRowExpansionChange?.(Array.from(expandedIds));
        notify();
        break;
      }
      case 'EXPAND_ROW':
        if (expandedIds.has(event.rowId)) break;
        expandedIds = new Set(expandedIds);
        expandedIds.add(event.rowId);
        onRowExpansionChange?.(Array.from(expandedIds));
        notify();
        break;
      case 'COLLAPSE_ROW':
        if (!expandedIds.has(event.rowId)) break;
        expandedIds = new Set(expandedIds);
        expandedIds.delete(event.rowId);
        onRowExpansionChange?.(Array.from(expandedIds));
        notify();
        break;
      case 'COLLAPSE_ALL_ROWS':
        expandedIds = new Set();
        onRowExpansionChange?.([]);
        notify();
        break;

      // ── Editing ──
      case 'START_EDIT':
        editingCell = {
          rowId: event.rowId,
          columnKey: event.columnKey,
          value: event.value,
        };
        notify();
        break;
      case 'UPDATE_EDIT':
        if (!editingCell) break;
        editingCell = { ...editingCell, value: event.value };
        notify();
        break;
      case 'COMMIT_EDIT':
        if (!editingCell) break;
        onEditCommit?.(editingCell.rowId, editingCell.columnKey, editingCell.value);
        editingCell = null;
        notify();
        break;
      case 'CANCEL_EDIT':
        editingCell = null;
        notify();
        break;
    }
  }

  // ── Subscribe ──
  function subscribe(callback: () => void): () => void {
    listeners.add(callback);
    return () => { listeners.delete(callback); };
  }

  function destroy(): void {
    listeners.clear();
  }

  return { getContext, send, subscribe, destroy };
}
