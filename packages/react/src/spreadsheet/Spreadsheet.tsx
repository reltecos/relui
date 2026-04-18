/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Spreadsheet — Google Sheets seviyesi tablo bilesen (Dual API).
 * Spreadsheet — Google Sheets level spreadsheet component (Dual API).
 *
 * Props-based: `<Spreadsheet columns={26} rows={100} />`
 * Compound:    `<Spreadsheet><Spreadsheet.Toolbar /><Spreadsheet.FormulaBar /><Spreadsheet.Grid /><Spreadsheet.SheetTabs /></Spreadsheet>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useCallback, useState, type ReactNode } from 'react';
import { toRef } from '@relteco/relui-core';
import type { CellData, CellValue, SpreadsheetContext as CoreContext } from '@relteco/relui-core';
import {
  rootStyle, toolbarStyle, formulaBarStyle, cellAddressStyle,
  formulaInputStyle, gridContainerStyle, gridTableStyle,
  headerCellStyle, rowHeaderCellStyle, cellStyle, cellEditInputStyle,
  sheetTabsStyle, sheetTabStyle, addSheetButtonStyle, toolbarButtonStyle,
} from './spreadsheet.css';
import { useSpreadsheet, type UseSpreadsheetProps } from './useSpreadsheet';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

export type SpreadsheetSlot = 'root' | 'toolbar' | 'formulaBar' | 'grid' | 'cell' | 'sheetTabs';

// ── Context ───────────────────────────────────────────

interface SpreadsheetContextValue {
  ctx: CoreContext;
  columns: number;
  rows: number;
  getCellData: (row: number, col: number) => CellData | undefined;
  onSelectCell: (row: number, col: number) => void;
  onStartEdit: (row: number, col: number) => void;
  onCommitEdit: (value: string) => void;
  onCancelEdit: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onAddSheet: () => void;
  onRemoveSheet: (id: string) => void;
  onSwitchSheet: (id: string) => void;
  onSetFormulaValue: (v: string) => void;
  formulaValue: string;
  classNames: ClassNames<SpreadsheetSlot> | undefined;
  styles: Styles<SpreadsheetSlot> | undefined;
}

const SpreadsheetContext = createContext<SpreadsheetContextValue | null>(null);

function useSpreadsheetContext(): SpreadsheetContextValue {
  const ctx = useContext(SpreadsheetContext);
  if (!ctx) throw new Error('Spreadsheet compound sub-components must be used within <Spreadsheet>.');
  return ctx;
}

// ── Column label helper ───────────────────────────────

function colLabel(col: number): string {
  let label = '';
  let c = col + 1;
  while (c > 0) {
    const r = (c - 1) % 26;
    label = String.fromCharCode(65 + r) + label;
    c = Math.floor((c - 1) / 26);
  }
  return label;
}

// ── Compound: Spreadsheet.Toolbar ─────────────────────

export interface SpreadsheetToolbarProps { className?: string }

const SpreadsheetToolbar = forwardRef<HTMLDivElement, SpreadsheetToolbarProps>(
  function SpreadsheetToolbar(props, ref) {
    const { className } = props;
    const sCtx = useSpreadsheetContext();
    const slot = getSlotProps('toolbar', toolbarStyle, sCtx.classNames, sCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="spreadsheet-toolbar">
        <button type="button" className={toolbarButtonStyle} onClick={sCtx.onUndo} disabled={!sCtx.ctx.canUndo} aria-label="Undo" data-testid="spreadsheet-undo">
          Geri Al
        </button>
        <button type="button" className={toolbarButtonStyle} onClick={sCtx.onRedo} disabled={!sCtx.ctx.canRedo} aria-label="Redo" data-testid="spreadsheet-redo">
          Yinele
        </button>
      </div>
    );
  },
);

// ── Compound: Spreadsheet.FormulaBar ──────────────────

export interface SpreadsheetFormulaBarProps { className?: string }

const SpreadsheetFormulaBar = forwardRef<HTMLDivElement, SpreadsheetFormulaBarProps>(
  function SpreadsheetFormulaBar(props, ref) {
    const { className } = props;
    const sCtx = useSpreadsheetContext();
    const slot = getSlotProps('formulaBar', formulaBarStyle, sCtx.classNames, sCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const activeRef = toRef(sCtx.ctx.selection.active.row, sCtx.ctx.selection.active.col);

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="spreadsheet-formulaBar">
        <span className={cellAddressStyle} data-testid="spreadsheet-cellAddress">{activeRef}</span>
        <input
          className={formulaInputStyle}
          value={sCtx.formulaValue}
          onChange={(e) => sCtx.onSetFormulaValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sCtx.onCommitEdit(sCtx.formulaValue);
            } else if (e.key === 'Escape') {
              sCtx.onCancelEdit();
            }
          }}
          data-testid="spreadsheet-formulaInput"
          aria-label="Formula input"
        />
      </div>
    );
  },
);

// ── Compound: Spreadsheet.Grid ────────────────────────

export interface SpreadsheetGridProps { className?: string }

const SpreadsheetGrid = forwardRef<HTMLDivElement, SpreadsheetGridProps>(
  function SpreadsheetGrid(props, ref) {
    const { className } = props;
    const sCtx = useSpreadsheetContext();
    const slot = getSlotProps('grid', gridContainerStyle, sCtx.classNames, sCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const cellSlot = getSlotProps('cell', cellStyle, sCtx.classNames, sCtx.styles);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      const { row, col } = sCtx.ctx.selection.active;
      if (sCtx.ctx.editingCell) return; // let edit input handle keys

      switch (e.key) {
        case 'ArrowDown': e.preventDefault(); sCtx.onSelectCell(row + 1, col); break;
        case 'ArrowUp': e.preventDefault(); if (row > 0) sCtx.onSelectCell(row - 1, col); break;
        case 'ArrowRight': e.preventDefault(); sCtx.onSelectCell(row, col + 1); break;
        case 'ArrowLeft': e.preventDefault(); if (col > 0) sCtx.onSelectCell(row, col - 1); break;
        case 'Enter':
        case 'F2':
          e.preventDefault();
          sCtx.onStartEdit(row, col);
          break;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          sCtx.onCommitEdit('');
          break;
      }

      // Ctrl shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); sCtx.onUndo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); sCtx.onRedo(); }
    }, [sCtx]);

    const renderCell = (row: number, col: number) => {
      const isActive = sCtx.ctx.selection.active.row === row && sCtx.ctx.selection.active.col === col;
      const isEditing = sCtx.ctx.editingCell?.row === row && sCtx.ctx.editingCell?.col === col;
      const cellData = sCtx.getCellData(row, col);
      const displayValue = formatCellValue(cellData?.value);

      if (isEditing) {
        return (
          <td
            key={col}
            className={cellSlot.className}
            style={cellSlot.style}
            data-selected="true"
            data-editing="true"
            data-testid="spreadsheet-cell"
            role="gridcell"
            aria-colindex={col + 2}
          >
            <input
              className={cellEditInputStyle}
              autoFocus
              defaultValue={cellData?.raw ?? ''}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sCtx.onCommitEdit((e.target as HTMLInputElement).value);
                } else if (e.key === 'Escape') {
                  sCtx.onCancelEdit();
                }
                e.stopPropagation();
              }}
              onBlur={(e) => sCtx.onCommitEdit(e.target.value)}
              data-testid="spreadsheet-cellEdit"
            />
          </td>
        );
      }

      return (
        <td
          key={col}
          className={cellSlot.className}
          style={cellSlot.style}
          data-selected={isActive}
          onClick={() => sCtx.onSelectCell(row, col)}
          onDoubleClick={() => sCtx.onStartEdit(row, col)}
          data-testid="spreadsheet-cell"
          role="gridcell"
          aria-colindex={col + 2}
          tabIndex={isActive ? 0 : -1}
        >
          {displayValue}
        </td>
      );
    };

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="spreadsheet-grid" onKeyDown={handleKeyDown} tabIndex={0}>
        <table className={gridTableStyle} role="grid">
          <thead>
            <tr>
              <th className={headerCellStyle} />
              {Array.from({ length: sCtx.columns }, (_, c) => (
                <th key={c} className={headerCellStyle} data-testid="spreadsheet-colHeader" role="columnheader">
                  {colLabel(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: sCtx.rows }, (_, r) => (
              <tr key={r} role="row" aria-rowindex={r + 2}>
                <td className={rowHeaderCellStyle} data-testid="spreadsheet-rowHeader" role="rowheader">
                  {r + 1}
                </td>
                {Array.from({ length: sCtx.columns }, (_, c) => renderCell(r, c))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
);

function formatCellValue(value: CellValue | undefined): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  return String(value);
}

// ── Compound: Spreadsheet.SheetTabs ───────────────────

export interface SpreadsheetSheetTabsProps { className?: string }

const SpreadsheetSheetTabs = forwardRef<HTMLDivElement, SpreadsheetSheetTabsProps>(
  function SpreadsheetSheetTabs(props, ref) {
    const { className } = props;
    const sCtx = useSpreadsheetContext();
    const slot = getSlotProps('sheetTabs', sheetTabsStyle, sCtx.classNames, sCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="spreadsheet-sheetTabs" role="tablist">
        {sCtx.ctx.sheets.map((sheet) => (
          <button
            key={sheet.id}
            type="button"
            className={sheetTabStyle}
            data-active={sheet.id === sCtx.ctx.activeSheetId}
            onClick={() => sCtx.onSwitchSheet(sheet.id)}
            role="tab"
            aria-selected={sheet.id === sCtx.ctx.activeSheetId}
            data-testid="spreadsheet-sheetTab"
          >
            {sheet.name}
          </button>
        ))}
        <button
          type="button"
          className={addSheetButtonStyle}
          onClick={sCtx.onAddSheet}
          aria-label="Add sheet"
          data-testid="spreadsheet-addSheet"
        >
          +
        </button>
      </div>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface SpreadsheetComponentProps extends SlotStyleProps<SpreadsheetSlot> {
  /** Sutun sayisi / Column count */
  columns?: number;
  /** Satir sayisi / Row count */
  rows?: number;
  /** Baslangic sheet sayisi / Initial sheet count */
  initialSheets?: number;
  /** Hucre degisince / On cell change */
  onCellChange?: (sheetId: string, row: number, col: number, value: CellValue) => void;
  /** Compound children */
  children?: ReactNode;
  /** Ek className */
  className?: string;
  /** Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const SpreadsheetBase = forwardRef<HTMLDivElement, SpreadsheetComponentProps>(
  function Spreadsheet(props, ref) {
    const {
      columns = 26,
      rows = 100,
      initialSheets = 1,
      onCellChange,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const hookProps: UseSpreadsheetProps = { initialSheets, onCellChange };
    const { context: ctx, send, getCellData } = useSpreadsheet(hookProps);
    const [formulaValue, setFormulaValue] = useState('');

    const onSelectCell = useCallback((row: number, col: number) => {
      send({ type: 'SELECT_CELL', row, col });
      const cell = getCellData(row, col);
      setFormulaValue(cell?.raw ?? '');
    }, [send, getCellData]);

    const onStartEdit = useCallback((row: number, col: number) => {
      send({ type: 'START_EDIT', row, col });
      const cell = getCellData(row, col);
      setFormulaValue(cell?.raw ?? '');
    }, [send, getCellData]);

    const onCommitEdit = useCallback((value: string) => {
      const { active } = ctx.selection;
      if (ctx.editingCell) {
        send({ type: 'COMMIT_EDIT', value });
      } else {
        send({ type: 'SET_CELL', row: active.row, col: active.col, raw: value });
      }
      setFormulaValue(value);
    }, [send, ctx.selection, ctx.editingCell]);

    const onCancelEdit = useCallback(() => { send({ type: 'CANCEL_EDIT' }); }, [send]);
    const onUndo = useCallback(() => { send({ type: 'UNDO' }); }, [send]);
    const onRedo = useCallback(() => { send({ type: 'REDO' }); }, [send]);
    const onAddSheet = useCallback(() => {
      send({ type: 'ADD_SHEET', name: `Sheet ${ctx.sheets.length + 1}` });
    }, [send, ctx.sheets.length]);
    const onRemoveSheet = useCallback((id: string) => { send({ type: 'REMOVE_SHEET', sheetId: id }); }, [send]);
    const onSwitchSheet = useCallback((id: string) => { send({ type: 'SWITCH_SHEET', sheetId: id }); }, [send]);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: SpreadsheetContextValue = {
      ctx, columns, rows, getCellData,
      onSelectCell, onStartEdit, onCommitEdit, onCancelEdit,
      onUndo, onRedo, onAddSheet, onRemoveSheet, onSwitchSheet,
      onSetFormulaValue: setFormulaValue,
      formulaValue,
      classNames, styles,
    };

    if (children) {
      return (
        <SpreadsheetContext.Provider value={ctxValue}>
          <div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="spreadsheet-root">
            {children}
          </div>
        </SpreadsheetContext.Provider>
      );
    }

    return (
      <SpreadsheetContext.Provider value={ctxValue}>
        <div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="spreadsheet-root">
          <SpreadsheetToolbar />
          <SpreadsheetFormulaBar />
          <SpreadsheetGrid />
          <SpreadsheetSheetTabs />
        </div>
      </SpreadsheetContext.Provider>
    );
  },
);

/**
 * Spreadsheet bilesen — Dual API (props-based + compound).
 */
export const Spreadsheet = Object.assign(SpreadsheetBase, {
  Toolbar: SpreadsheetToolbar,
  FormulaBar: SpreadsheetFormulaBar,
  Grid: SpreadsheetGrid,
  SheetTabs: SpreadsheetSheetTabs,
});
