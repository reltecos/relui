/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type React from 'react';
import { createContext, useContext, type ReactNode } from 'react';
import type { ColumnDef, DataGridAPI, DataGridContext } from '@relteco/relui-core';
import type { ClassNames, Styles } from '../utils/slot-styles';
import type { DataGridRow } from './useDataGrid';
import type { DataGridSlot } from './DataGrid';

/** Virtual scroll range bilgisi / Virtual scroll range info */
export interface VirtualRange {
  /** Baslangic indeksi / Start index */
  startIndex: number;
  /** Bitis indeksi / End index */
  endIndex: number;
  /** Ust bosluk (px) / Top offset in pixels */
  offsetTop: number;
  /** Toplam yukseklik (px) / Total height in pixels */
  totalHeight: number;
}

/** DataGrid Context icerigi / DataGrid context value */
export interface DataGridContextValue {
  api: DataGridAPI;
  ctx: DataGridContext;
  columns: ColumnDef[];
  visibleColumns: ColumnDef[];
  visibleRows: DataGridRow[];
  totalPages: number;
  totalRows: number;
  getRowId: (row: DataGridRow, index: number) => string;
  sortable: boolean;
  filterable: boolean;
  selectionMode: 'none' | 'single' | 'multiple';
  paginated: boolean;
  expandable: boolean;
  virtualScroll: boolean;
  rowHeight: number;
  virtualRange: VirtualRange | null;
  onBodyScroll: ((e: React.UIEvent<HTMLDivElement>) => void) | undefined;
  bodyHeight: number | undefined;
  renderDetail?: (row: DataGridRow) => ReactNode;
  renderCell?: (row: DataGridRow, column: ColumnDef) => ReactNode;
  classNames: ClassNames<DataGridSlot> | undefined;
  styles: Styles<DataGridSlot> | undefined;
}

export const DataGridCtx = createContext<DataGridContextValue | null>(null);

export function useDataGridContext(): DataGridContextValue {
  const ctx = useContext(DataGridCtx);
  if (!ctx) throw new Error('DataGrid compound sub-components must be used within <DataGrid>.');
  return ctx;
}
