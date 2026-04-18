/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Hucre tipi / Cell type */
export type CellType = 'text' | 'number' | 'boolean' | 'formula' | 'empty';

/** Hucre degeri / Cell value */
export type CellValue = string | number | boolean | null;

/** Hucre adresi / Cell address */
export interface CellAddress {
  row: number;
  col: number;
}

/** Hucre verisi / Cell data */
export interface CellData {
  /** Ham girdi / Raw input */
  raw: string;
  /** Hesaplanmis deger / Computed value */
  value: CellValue;
  /** Formul (= ile basliyorsa) / Formula */
  formula?: string;
  /** Hucre tipi / Cell type */
  type: CellType;
}

/** Hucre secimi / Cell selection */
export interface CellSelection {
  /** Aktif hucre / Active cell */
  active: CellAddress;
  /** Secim araligi (range) / Selection range */
  range?: { start: CellAddress; end: CellAddress };
}

/** Sheet tanimi / Sheet definition */
export interface SheetData {
  /** Benzersiz id / Unique id */
  id: string;
  /** Sheet adi / Sheet name */
  name: string;
  /** Hucre verileri (key: "row,col") / Cell data */
  cells: Map<string, CellData>;
  /** Donmus satir sayisi / Frozen row count */
  frozenRows: number;
  /** Donmus sutun sayisi / Frozen column count */
  frozenCols: number;
}

/** Undo entry */
export interface UndoEntry {
  sheetId: string;
  cellKey: string;
  oldData: CellData | undefined;
  newData: CellData;
}

/** Spreadsheet event tipleri / Spreadsheet event types */
export type SpreadsheetEvent =
  | { type: 'SET_CELL'; row: number; col: number; raw: string }
  | { type: 'SELECT_CELL'; row: number; col: number }
  | { type: 'SELECT_RANGE'; startRow: number; startCol: number; endRow: number; endCol: number }
  | { type: 'START_EDIT'; row: number; col: number }
  | { type: 'COMMIT_EDIT'; value: string }
  | { type: 'CANCEL_EDIT' }
  | { type: 'ADD_SHEET'; name: string }
  | { type: 'REMOVE_SHEET'; sheetId: string }
  | { type: 'SWITCH_SHEET'; sheetId: string }
  | { type: 'RENAME_SHEET'; sheetId: string; name: string }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_FROZEN'; rows: number; cols: number };

/** Spreadsheet context / Spreadsheet context */
export interface SpreadsheetContext {
  readonly activeSheetId: string;
  readonly sheets: ReadonlyArray<{ id: string; name: string }>;
  readonly selection: CellSelection;
  readonly editingCell: CellAddress | null;
  readonly editingValue: string;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly frozenRows: number;
  readonly frozenCols: number;
}

/** Spreadsheet yapilandirma / Spreadsheet config */
export interface SpreadsheetConfig {
  /** Baslangic sheet sayisi / Initial sheet count */
  initialSheets?: number;
  /** Hucre degisince / On cell change */
  onCellChange?: (sheetId: string, row: number, col: number, value: CellValue) => void;
}

/** Spreadsheet API / Spreadsheet API */
export interface SpreadsheetAPI {
  getContext(): SpreadsheetContext;
  send(event: SpreadsheetEvent): void;
  subscribe(fn: () => void): () => void;
  destroy(): void;
  /** Hucre degerini oku / Read cell value */
  getCellData(row: number, col: number): CellData | undefined;
  /** Belirli sheet in hucre degerini oku */
  getSheetCellData(sheetId: string, row: number, col: number): CellData | undefined;
}
