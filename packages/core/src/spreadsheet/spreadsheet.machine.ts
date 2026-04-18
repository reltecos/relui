/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Spreadsheet state machine — hucre yonetimi, sheet yonetimi, undo/redo.
 * Spreadsheet state machine — cell management, sheet management, undo/redo.
 *
 * @packageDocumentation
 */

import type {
  SpreadsheetConfig,
  SpreadsheetContext,
  SpreadsheetEvent,
  SpreadsheetAPI,
  CellData,
  CellValue,
  CellSelection,
  CellAddress,
  SheetData,
  UndoEntry,
} from './spreadsheet.types';
import { evaluateFormula } from './formula';

function makeCellKey(row: number, col: number): string {
  return `${row},${col}`;
}

function detectType(raw: string): CellData {
  if (raw === '') return { raw, value: null, type: 'empty' };
  if (raw.startsWith('=')) return { raw, value: null, formula: raw.slice(1), type: 'formula' };
  if (raw === 'true' || raw === 'false') return { raw, value: raw === 'true', type: 'boolean' };
  const num = Number(raw);
  if (!isNaN(num) && raw.trim() !== '') return { raw, value: num, type: 'number' };
  return { raw, value: raw, type: 'text' };
}

/**
 * Spreadsheet state machine olusturur.
 * Creates a Spreadsheet state machine.
 */
export function createSpreadsheet(config: SpreadsheetConfig = {}): SpreadsheetAPI {
  const { initialSheets = 1, onCellChange } = config;

  // ── State ──
  const sheets: SheetData[] = [];
  for (let i = 0; i < initialSheets; i++) {
    sheets.push({
      id: `sheet-${i}`,
      name: `Sheet ${i + 1}`,
      cells: new Map(),
      frozenRows: 0,
      frozenCols: 0,
    });
  }

  let activeSheetId = sheets[0]?.id ?? 'sheet-0';
  let selection: CellSelection = { active: { row: 0, col: 0 } };
  let editingCell: CellAddress | null = null;
  let editingValue = '';
  const undoStack: UndoEntry[] = [];
  const redoStack: UndoEntry[] = [];

  const listeners = new Set<() => void>();

  function notify(): void {
    for (const fn of listeners) fn();
  }

  function getActiveSheet(): SheetData | undefined {
    return sheets.find((s) => s.id === activeSheetId);
  }

  // ── Formula evaluation ──

  function createLookup(sheet: SheetData): (row: number, col: number) => CellValue {
    return (row: number, col: number): CellValue => {
      const cell = sheet.cells.get(makeCellKey(row, col));
      if (!cell) return null;
      if (cell.type === 'formula' && cell.formula) {
        return evaluateFormula(cell.formula, createLookup(sheet));
      }
      return cell.value;
    };
  }

  function evaluateCell(sheet: SheetData, cell: CellData): CellData {
    if (cell.type !== 'formula' || !cell.formula) return cell;
    const lookup = createLookup(sheet);
    const value = evaluateFormula(cell.formula, lookup);
    return { ...cell, value };
  }

  // ── Context ──

  function getContext(): SpreadsheetContext {
    const sheet = getActiveSheet();
    return {
      activeSheetId,
      sheets: sheets.map((s) => ({ id: s.id, name: s.name })),
      selection,
      editingCell,
      editingValue,
      canUndo: undoStack.length > 0,
      canRedo: redoStack.length > 0,
      frozenRows: sheet?.frozenRows ?? 0,
      frozenCols: sheet?.frozenCols ?? 0,
    };
  }

  function getCellData(row: number, col: number): CellData | undefined {
    const sheet = getActiveSheet();
    if (!sheet) return undefined;
    const cell = sheet.cells.get(makeCellKey(row, col));
    if (!cell) return undefined;
    return evaluateCell(sheet, cell);
  }

  function getSheetCellData(sheetId: string, row: number, col: number): CellData | undefined {
    const sheet = sheets.find((s) => s.id === sheetId);
    if (!sheet) return undefined;
    const cell = sheet.cells.get(makeCellKey(row, col));
    if (!cell) return undefined;
    return evaluateCell(sheet, cell);
  }

  function send(event: SpreadsheetEvent): void {
    switch (event.type) {
      case 'SET_CELL': {
        const sheet = getActiveSheet();
        if (!sheet) return;
        const key = makeCellKey(event.row, event.col);
        const oldData = sheet.cells.get(key);
        const newData = detectType(event.raw);

        // Evaluate formula
        const evaluated = evaluateCell(sheet, newData);

        sheet.cells.set(key, evaluated);

        // Undo
        undoStack.push({ sheetId: sheet.id, cellKey: key, oldData, newData: evaluated });
        redoStack.length = 0;

        onCellChange?.(sheet.id, event.row, event.col, evaluated.value);
        notify();
        break;
      }
      case 'SELECT_CELL': {
        selection = { active: { row: event.row, col: event.col } };
        notify();
        break;
      }
      case 'SELECT_RANGE': {
        selection = {
          active: { row: event.startRow, col: event.startCol },
          range: {
            start: { row: event.startRow, col: event.startCol },
            end: { row: event.endRow, col: event.endCol },
          },
        };
        notify();
        break;
      }
      case 'START_EDIT': {
        editingCell = { row: event.row, col: event.col };
        const sheet = getActiveSheet();
        const cell = sheet?.cells.get(makeCellKey(event.row, event.col));
        editingValue = cell?.raw ?? '';
        notify();
        break;
      }
      case 'COMMIT_EDIT': {
        if (!editingCell) return;
        const sheet = getActiveSheet();
        if (!sheet) return;
        const key = makeCellKey(editingCell.row, editingCell.col);
        const oldData = sheet.cells.get(key);
        const newData = detectType(event.value);
        const evaluated = evaluateCell(sheet, newData);
        sheet.cells.set(key, evaluated);

        undoStack.push({ sheetId: sheet.id, cellKey: key, oldData, newData: evaluated });
        redoStack.length = 0;

        onCellChange?.(sheet.id, editingCell.row, editingCell.col, evaluated.value);
        editingCell = null;
        editingValue = '';
        notify();
        break;
      }
      case 'CANCEL_EDIT': {
        if (!editingCell) return;
        editingCell = null;
        editingValue = '';
        notify();
        break;
      }
      case 'ADD_SHEET': {
        const id = `sheet-${Date.now()}`;
        sheets.push({ id, name: event.name, cells: new Map(), frozenRows: 0, frozenCols: 0 });
        activeSheetId = id;
        selection = { active: { row: 0, col: 0 } };
        notify();
        break;
      }
      case 'REMOVE_SHEET': {
        if (sheets.length <= 1) return;
        const idx = sheets.findIndex((s) => s.id === event.sheetId);
        if (idx === -1) return;
        sheets.splice(idx, 1);
        if (activeSheetId === event.sheetId) {
          activeSheetId = sheets[0]?.id ?? '';
        }
        notify();
        break;
      }
      case 'SWITCH_SHEET': {
        if (!sheets.find((s) => s.id === event.sheetId)) return;
        activeSheetId = event.sheetId;
        selection = { active: { row: 0, col: 0 } };
        editingCell = null;
        editingValue = '';
        notify();
        break;
      }
      case 'RENAME_SHEET': {
        const sheet = sheets.find((s) => s.id === event.sheetId);
        if (!sheet) return;
        sheet.name = event.name;
        notify();
        break;
      }
      case 'UNDO': {
        const entry = undoStack.pop();
        if (!entry) return;
        const sheet = sheets.find((s) => s.id === entry.sheetId);
        if (!sheet) return;
        if (entry.oldData) {
          sheet.cells.set(entry.cellKey, entry.oldData);
        } else {
          sheet.cells.delete(entry.cellKey);
        }
        redoStack.push(entry);
        notify();
        break;
      }
      case 'REDO': {
        const entry = redoStack.pop();
        if (!entry) return;
        const sheet = sheets.find((s) => s.id === entry.sheetId);
        if (!sheet) return;
        sheet.cells.set(entry.cellKey, entry.newData);
        undoStack.push(entry);
        notify();
        break;
      }
      case 'SET_FROZEN': {
        const sheet = getActiveSheet();
        if (!sheet) return;
        sheet.frozenRows = event.rows;
        sheet.frozenCols = event.cols;
        notify();
        break;
      }
    }
  }

  function subscribe(fn: () => void): () => void {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }

  function destroy(): void { listeners.clear(); }

  return { getContext, send, subscribe, destroy, getCellData, getSheetCellData };
}
