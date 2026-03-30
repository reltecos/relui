/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DataGrid React hook — core state machine binding.
 *
 * @packageDocumentation
 */

import type React from 'react';
import { useRef, useReducer, useEffect, useMemo, useState, useCallback } from 'react';
import {
  createDataGrid,
  type DataGridConfig,
  type DataGridAPI,
  type DataGridContext,
  type ColumnDef,
  type SortState,
  type FilterState,
  type FilterOperator,
} from '@relteco/relui-core';

// ── Types ──────────────────────────────────────────

/** Row tipi (generic olmayan, Record tabanli) / Row type */
export type DataGridRow = Record<string, unknown>;

/** useDataGrid hook props */
export interface UseDataGridProps {
  /** Sutun tanimlari / Column definitions */
  columns: ColumnDef[];
  /** Veri / Data rows */
  data: DataGridRow[];
  /** Satir id alma fonksiyonu / Row ID getter */
  getRowId?: (row: DataGridRow, index: number) => string;
  /** Secim modu / Selection mode */
  selectionMode?: DataGridConfig['selectionMode'];
  /** Varsayilan sayfa boyutu / Default page size */
  pageSize?: number;
  /** Coklu siralama / Allow multi-sort */
  multiSort?: boolean;
  /** Sanal scroll aktif mi / Enable virtual scroll */
  virtualScroll?: boolean;
  /** Satir yuksekligi (px, sanal scroll icin) / Row height for virtual scroll */
  rowHeight?: number;
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
  /** Genisletme degisince / On row expansion change */
  onRowExpansionChange?: (expandedIds: string[]) => void;
  /** Sayfalama aktif mi / Enable pagination */
  paginated?: boolean;
  /** Detay render / Render detail row */
  renderDetail?: (row: DataGridRow) => React.ReactNode;
}

/** Virtual scroll range bilgisi / Virtual scroll range info */
export interface VirtualRange {
  startIndex: number;
  endIndex: number;
  offsetTop: number;
  totalHeight: number;
}

/** useDataGrid hook return tipi / Return type */
export interface UseDataGridReturn {
  /** Core API */
  api: DataGridAPI;
  /** Guncel context / Current context */
  ctx: DataGridContext;
  /** Islenmis veri (siralama + filtreleme sonrasi) / Processed data */
  processedData: DataGridRow[];
  /** Gorunen satirlar (sayfalama sonrasi) / Visible rows */
  visibleRows: DataGridRow[];
  /** Toplam sayfa / Total pages */
  totalPages: number;
  /** Toplam satir (filtreleme sonrasi) / Total rows after filtering */
  totalRows: number;
  /** Gorunen sutunlar (gizli olmayanlar, sirali) / Visible columns in order */
  visibleColumns: ColumnDef[];
  /** Satir id al / Get row ID */
  getRowId: (row: DataGridRow, index: number) => string;
  /** Virtual scroll range / Virtual scroll range */
  virtualRange: VirtualRange | null;
  /** Body scroll handler / Body scroll handler */
  onBodyScroll: ((e: React.UIEvent<HTMLDivElement>) => void) | undefined;
}

// ── Hook ──────────────────────────────────────────

export function useDataGrid(props: UseDataGridProps): UseDataGridReturn {
  const {
    columns,
    data,
    getRowId: getRowIdProp,
    selectionMode = 'none',
    pageSize = 50,
    multiSort = false,
    paginated = false,
    onSortChange,
    onFilterChange,
    onSelectionChange,
    onPageChange,
    onEditCommit,
    onRowExpansionChange,
  } = props;

  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<DataGridAPI | null>(null);
  const prevRef = useRef<UseDataGridProps | undefined>(undefined);

  // Row ID helper
  const getRowId = useMemo(() => {
    return getRowIdProp ?? ((row: DataGridRow, index: number) => {
      const id = row['id'];
      if (id !== undefined && id !== null) return String(id);
      return String(index);
    });
  }, [getRowIdProp]);

  // Create API
  if (apiRef.current === null) {
    apiRef.current = createDataGrid({
      columns,
      selectionMode,
      defaultPageSize: pageSize,
      multiSort,
      onSortChange,
      onFilterChange,
      onSelectionChange,
      onPageChange,
      onEditCommit,
      onRowExpansionChange,
    });
  }
  const api = apiRef.current;

  // Subscribe
  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  // Prop sync
  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }
    if (prev.pageSize !== props.pageSize && props.pageSize !== undefined) {
      api.send({ type: 'SET_PAGE_SIZE', pageSize: props.pageSize });
      forceRender();
    }
    prevRef.current = props;
  });

  const ctx = api.getContext();

  // ── Data processing ──
  const processedData = useMemo(() => {
    let result = [...data];

    // Filter
    for (const filter of ctx.filters) {
      result = result.filter((row) => {
        const cellValue = String(row[filter.columnKey] ?? '').toLowerCase();
        const filterValue = filter.value.toLowerCase();
        return applyFilter(cellValue, filterValue, filter.operator);
      });
    }

    // Sort
    if (ctx.sort.length > 0) {
      result.sort((a, b) => {
        for (const s of ctx.sort) {
          const aVal = a[s.columnKey];
          const bVal = b[s.columnKey];
          const cmp = compareValues(aVal, bVal);
          if (cmp !== 0) return s.direction === 'asc' ? cmp : -cmp;
        }
        return 0;
      });
    }

    return result;
  }, [data, ctx.filters, ctx.sort]);

  const totalRows = processedData.length;
  const totalPages = paginated ? Math.max(1, Math.ceil(totalRows / ctx.pageSize)) : 1;

  // Paginate
  const visibleRows = useMemo(() => {
    if (!paginated) return processedData;
    const start = ctx.page * ctx.pageSize;
    return processedData.slice(start, start + ctx.pageSize);
  }, [processedData, paginated, ctx.page, ctx.pageSize]);

  // Visible columns
  const visibleColumns = useMemo(() => {
    return ctx.columnOrder
      .filter((key) => !ctx.hiddenColumns.has(key))
      .map((key) => columns.find((c) => c.key === key))
      .filter((c): c is ColumnDef => c !== undefined);
  }, [ctx.columnOrder, ctx.hiddenColumns, columns]);

  // ── Virtual scroll ──
  const {
    virtualScroll = false,
    rowHeight = 40,
  } = props;

  const [scrollTop, setScrollTop] = useState(0);
  const overscan = 5;

  const onBodyScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const virtualRange = useMemo<VirtualRange | null>(() => {
    if (!virtualScroll) return null;
    const viewportHeight = props.rowHeight !== undefined ? props.rowHeight * 15 : 600;
    const totalHeight = visibleRows.length * rowHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const visibleCount = Math.ceil(viewportHeight / rowHeight) + overscan * 2;
    const endIndex = Math.min(visibleRows.length, startIndex + visibleCount);
    const offsetTop = startIndex * rowHeight;
    return { startIndex, endIndex, offsetTop, totalHeight };
  }, [virtualScroll, visibleRows.length, rowHeight, scrollTop, props.rowHeight, overscan]);

  return {
    api,
    ctx,
    processedData,
    visibleRows,
    totalPages,
    totalRows,
    visibleColumns,
    getRowId,
    virtualRange,
    onBodyScroll: virtualScroll ? onBodyScroll : undefined,
  };
}

// ── Helpers ──────────────────────────────────────────

function applyFilter(cellValue: string, filterValue: string, operator: FilterOperator): boolean {
  switch (operator) {
    case 'contains': return cellValue.includes(filterValue);
    case 'equals': return cellValue === filterValue;
    case 'startsWith': return cellValue.startsWith(filterValue);
    case 'endsWith': return cellValue.endsWith(filterValue);
    case 'gt': return Number(cellValue) > Number(filterValue);
    case 'gte': return Number(cellValue) >= Number(filterValue);
    case 'lt': return Number(cellValue) < Number(filterValue);
    case 'lte': return Number(cellValue) <= Number(filterValue);
    default: return true;
  }
}

function compareValues(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return -1;
  if (b === null || b === undefined) return 1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b));
}
