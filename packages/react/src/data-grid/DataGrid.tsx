/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DataGrid — enterprise veri tablosu bilesen (Dual API).
 * DataGrid — enterprise data grid component (Dual API).
 *
 * Props-based: `<DataGrid columns={cols} data={rows} sortable filterable />`
 * Compound:    `<DataGrid columns={cols} data={rows}><DataGrid.Toolbar /><DataGrid.Header /><DataGrid.Body /><DataGrid.Footer><DataGrid.Pagination /></DataGrid.Footer></DataGrid>`
 *
 * @packageDocumentation
 */

import { forwardRef, useCallback, useState, useRef, type ReactNode } from 'react';
import type { ColumnDef, SortState, FilterState } from '@relteco/relui-core';
import { ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon } from '@relteco/relui-icons';
import {
  rootStyle, toolbarStyle, headerStyle, headerRowStyle, headerCellStyle,
  bodyStyle, rowStyle, selectedRowStyle, cellStyle, cellAlignStyles,
  footerStyle, paginationStyle, pageButtonStyle, emptyStateStyle,
  checkboxStyle, resizeHandleStyle, sortIconStyle, editCellStyle,
  expandButtonStyle, detailRowStyle, filterInputStyle,
  columnChooserStyle, columnChooserItemStyle,
} from './data-grid.css';
import { useDataGrid, type UseDataGridProps, type DataGridRow as DataGridRowData } from './useDataGrid';
import { DataGridCtx, useDataGridContext, type DataGridContextValue } from './data-grid-context';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** DataGrid slot isimleri / DataGrid slot names. */
export type DataGridSlot = 'root' | 'toolbar' | 'header' | 'headerRow' | 'headerCell' | 'body' | 'row' | 'cell' | 'footer' | 'pagination' | 'emptyState' | 'checkbox' | 'resizeHandle' | 'expandButton' | 'editCell';

// ── Compound: DataGrid.Toolbar ──────────────────────

/** DataGrid.Toolbar props */
export interface DataGridToolbarProps {
  children?: ReactNode;
  className?: string;
}

export const DataGridToolbar = forwardRef<HTMLDivElement, DataGridToolbarProps>(
  function DataGridToolbar(props, ref) {
    const { children, className } = props;
    const dgCtx = useDataGridContext();
    const slot = getSlotProps('toolbar', toolbarStyle, dgCtx.classNames, dgCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="data-grid-toolbar">
        {children}
      </div>
    );
  },
);

// ── Compound: DataGrid.Header ───────────────────────

/** DataGrid.Header props */
export interface DataGridHeaderProps {
  className?: string;
}

export const DataGridHeader = forwardRef<HTMLDivElement, DataGridHeaderProps>(
  function DataGridHeader(props, ref) {
    const { className } = props;
    const dgCtx = useDataGridContext();
    const slot = getSlotProps('header', headerStyle, dgCtx.classNames, dgCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const headerRowSlot = getSlotProps('headerRow', headerRowStyle, dgCtx.classNames, dgCtx.styles);
    const headerCellSlotBase = getSlotProps('headerCell', headerCellStyle, dgCtx.classNames, dgCtx.styles);

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="data-grid-header" role="rowgroup">
        <div className={headerRowSlot.className} style={headerRowSlot.style} role="row" data-testid="data-grid-header-row">
          {dgCtx.selectionMode === 'multiple' && (
            <div className={headerCellSlotBase.className} style={{ ...headerCellSlotBase.style, width: 48, minWidth: 48 }}>
              <input
                type="checkbox"
                className={checkboxStyle}
                checked={dgCtx.visibleRows.length > 0 && dgCtx.visibleRows.every((row, i) => dgCtx.ctx.selectedIds.has(dgCtx.getRowId(row, i)))}
                onChange={(e) => {
                  if (e.target.checked) {
                    dgCtx.api.send({ type: 'SELECT_ALL', rowIds: dgCtx.visibleRows.map((row, i) => dgCtx.getRowId(row, i)) });
                  } else {
                    dgCtx.api.send({ type: 'DESELECT_ALL' });
                  }
                }}
                data-testid="data-grid-select-all"
                aria-label="Select all rows"
              />
            </div>
          )}
          {dgCtx.expandable && (
            <div className={headerCellSlotBase.className} style={{ ...headerCellSlotBase.style, width: 40, minWidth: 40 }} />
          )}
          {dgCtx.visibleColumns.map((col) => {
            const w = dgCtx.ctx.columnWidths.get(col.key) ?? col.width ?? 150;
            const sortState = dgCtx.ctx.sort.find((s: SortState) => s.columnKey === col.key);
            return (
              <div
                key={col.key}
                className={headerCellSlotBase.className}
                style={{ ...headerCellSlotBase.style, width: w, minWidth: col.minWidth ?? 50 }}
                data-testid="data-grid-header-cell"
                data-column={col.key}
                role="columnheader"
                onClick={col.sortable && dgCtx.sortable ? () => dgCtx.api.send({ type: 'SORT', columnKey: col.key }) : undefined}
                aria-sort={sortState ? (sortState.direction === 'asc' ? 'ascending' : 'descending') : undefined}
              >
                <span>{col.title}</span>
                {sortState && (
                  <span className={sortIconStyle} data-testid="data-grid-sort-icon">
                    {sortState.direction === 'asc' ? <ChevronUpIcon size={12} /> : <ChevronDownIcon size={12} />}
                  </span>
                )}
                {col.resizable !== false && <ResizeHandle columnKey={col.key} />}
              </div>
            );
          })}
        </div>
        {dgCtx.filterable && (
          <div className={headerRowSlot.className} style={headerRowSlot.style} data-testid="data-grid-filter-row">
            {dgCtx.selectionMode === 'multiple' && <div style={{ width: 48, minWidth: 48, flexShrink: 0 }} />}
            {dgCtx.expandable && <div style={{ width: 40, minWidth: 40, flexShrink: 0 }} />}
            {dgCtx.visibleColumns.map((col) => {
              const w = dgCtx.ctx.columnWidths.get(col.key) ?? col.width ?? 150;
              const currentFilter = dgCtx.ctx.filters.find((f: FilterState) => f.columnKey === col.key);
              return (
                <div key={col.key} style={{ width: w, minWidth: col.minWidth ?? 50, padding: '4px 12px', flexShrink: 0 }}>
                  {col.filterable !== false && (
                    <input
                      type="text"
                      className={filterInputStyle}
                      placeholder={`Filter ${col.title}...`}
                      value={currentFilter?.value ?? ''}
                      onChange={(e) => dgCtx.api.send({ type: 'SET_FILTER', columnKey: col.key, value: e.target.value, operator: 'contains' })}
                      data-testid="data-grid-filter-input"
                      aria-label={`Filter ${col.title}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);

// ── Resize Handle ───────────────────────────────────

function ResizeHandle({ columnKey }: { columnKey: string }) {
  const dgCtx = useDataGridContext();
  const startX = useRef(0);
  const startWidth = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    startX.current = e.clientX;
    startWidth.current = dgCtx.ctx.columnWidths.get(columnKey) ?? 150;
    const onMouseMove = (ev: MouseEvent) => {
      const diff = ev.clientX - startX.current;
      dgCtx.api.send({ type: 'RESIZE_COLUMN', columnKey, width: startWidth.current + diff });
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [dgCtx.api, dgCtx.ctx.columnWidths, columnKey]);

  return <div className={resizeHandleStyle} onMouseDown={onMouseDown} data-testid="data-grid-resize-handle" />;
}

// ── Internal: BodyRow ────────────────────────────────

interface BodyRowInternalProps {
  row: DataGridRowData;
  rowIdx: number;
  dgCtx: DataGridContextValue;
  rowSlotBase: { className: string; style: React.CSSProperties | undefined };
  cellSlotBase: { className: string; style: React.CSSProperties | undefined };
}

function BodyRow({ row, rowIdx, dgCtx, rowSlotBase, cellSlotBase }: BodyRowInternalProps) {
  const rowId = dgCtx.getRowId(row, rowIdx);
  const isSelected = dgCtx.ctx.selectedIds.has(rowId);
  const isExpanded = dgCtx.ctx.expandedIds.has(rowId);
  const rowCls = isSelected ? `${rowSlotBase.className} ${selectedRowStyle}` : rowSlotBase.className;
  return (
    <div key={rowId}>
      <div className={rowCls} style={{ ...rowSlotBase.style, height: dgCtx.virtualScroll ? dgCtx.rowHeight : undefined }} data-testid="data-grid-row" data-row-id={rowId} data-selected={isSelected} role="row">
        {dgCtx.selectionMode !== 'none' && (
          <div style={{ width: dgCtx.selectionMode === 'multiple' ? 48 : 0, minWidth: dgCtx.selectionMode === 'multiple' ? 48 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {dgCtx.selectionMode === 'multiple' && (
              <input type="checkbox" className={checkboxStyle} checked={isSelected} onChange={() => dgCtx.api.send({ type: 'TOGGLE_ROW', rowId })} data-testid="data-grid-row-checkbox" aria-label={`Select row ${rowId}`} />
            )}
          </div>
        )}
        {dgCtx.expandable && (
          <div style={{ width: 40, minWidth: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <button className={expandButtonStyle} onClick={() => dgCtx.api.send({ type: 'TOGGLE_ROW_EXPANSION', rowId })} data-testid="data-grid-expand-btn" aria-expanded={isExpanded} aria-label={isExpanded ? 'Collapse row' : 'Expand row'} type="button">
              {isExpanded ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
            </button>
          </div>
        )}
        {dgCtx.visibleColumns.map((col) => {
          const w = dgCtx.ctx.columnWidths.get(col.key) ?? col.width ?? 150;
          const alignCls = cellAlignStyles[col.align ?? 'left'];
          const isEditing = dgCtx.ctx.editingCell?.rowId === rowId && dgCtx.ctx.editingCell?.columnKey === col.key;
          const cellValue = row[col.key];
          return (
            <div
              key={col.key}
              className={`${cellSlotBase.className} ${alignCls}`}
              style={{ ...cellSlotBase.style, width: w, minWidth: col.minWidth ?? 50 }}
              data-testid="data-grid-cell"
              data-column={col.key}
              role="gridcell"
              onDoubleClick={col.editable ? () => dgCtx.api.send({ type: 'START_EDIT', rowId, columnKey: col.key, value: String(cellValue ?? '') }) : undefined}
            >
              {isEditing ? (
                <input
                  className={editCellStyle}
                  value={dgCtx.ctx.editingCell?.value ?? ''}
                  onChange={(e) => dgCtx.api.send({ type: 'UPDATE_EDIT', value: e.target.value })}
                  onKeyDown={(e) => { if (e.key === 'Enter') dgCtx.api.send({ type: 'COMMIT_EDIT' }); if (e.key === 'Escape') dgCtx.api.send({ type: 'CANCEL_EDIT' }); }}
                  onBlur={() => dgCtx.api.send({ type: 'COMMIT_EDIT' })}
                  data-testid="data-grid-edit-input"
                  autoFocus
                />
              ) : dgCtx.renderCell ? dgCtx.renderCell(row, col) : (
                <span>{cellValue !== undefined && cellValue !== null ? String(cellValue) : ''}</span>
              )}
            </div>
          );
        })}
      </div>
      {dgCtx.expandable && isExpanded && dgCtx.renderDetail && (
        <div className={detailRowStyle} data-testid="data-grid-detail">{dgCtx.renderDetail(row)}</div>
      )}
    </div>
  );
}

// ── Compound: DataGrid.Body ─────────────────────────

/** DataGrid.Body props */
export interface DataGridBodyProps { className?: string; }

export const DataGridBody = forwardRef<HTMLDivElement, DataGridBodyProps>(
  function DataGridBody(props, ref) {
    const { className } = props;
    const dgCtx = useDataGridContext();
    const slot = getSlotProps('body', bodyStyle, dgCtx.classNames, dgCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const rowSlotBase = getSlotProps('row', rowStyle, dgCtx.classNames, dgCtx.styles);
    const cellSlotBase = getSlotProps('cell', cellStyle, dgCtx.classNames, dgCtx.styles);

    if (dgCtx.visibleRows.length === 0) {
      const emptySlot = getSlotProps('emptyState', emptyStateStyle, dgCtx.classNames, dgCtx.styles);
      return (
        <div ref={ref} className={cls} style={slot.style} data-testid="data-grid-body" role="rowgroup">
          <div className={emptySlot.className} style={emptySlot.style} data-testid="data-grid-empty">Gosterilecek veri yok</div>
        </div>
      );
    }

    // Virtual scroll: sadece gorunen satirlari render et
    const isVirtual = dgCtx.virtualScroll && dgCtx.virtualRange !== null;
    const vr = dgCtx.virtualRange;
    const rowsToRender = isVirtual && vr
      ? dgCtx.visibleRows.slice(vr.startIndex, vr.endIndex)
      : dgCtx.visibleRows;
    const startIdx = isVirtual && vr ? vr.startIndex : 0;

    const bodyStyle2: React.CSSProperties = isVirtual
      ? { ...slot.style, height: dgCtx.bodyHeight ?? 400, overflow: 'auto' }
      : { ...slot.style };

    return (
      <div ref={ref} className={cls} style={bodyStyle2} data-testid="data-grid-body" role="rowgroup" onScroll={dgCtx.onBodyScroll}>
        {isVirtual && vr && (
          <div style={{ height: vr.totalHeight, position: 'relative' }} data-testid="data-grid-virtual-spacer">
            <div style={{ position: 'absolute', top: vr.offsetTop, left: 0, right: 0 }}>
              {rowsToRender.map((row, i) => {
                const rowIdx = startIdx + i;
                return <BodyRow key={dgCtx.getRowId(row, rowIdx)} row={row} rowIdx={rowIdx} dgCtx={dgCtx} rowSlotBase={rowSlotBase} cellSlotBase={cellSlotBase} />;
              })}
            </div>
          </div>
        )}
        {!isVirtual && dgCtx.visibleRows.map((row, rowIdx) => {
          const rowId = dgCtx.getRowId(row, rowIdx);
          const isSelected = dgCtx.ctx.selectedIds.has(rowId);
          const isExpanded = dgCtx.ctx.expandedIds.has(rowId);
          const rowCls = isSelected ? `${rowSlotBase.className} ${selectedRowStyle}` : rowSlotBase.className;
          return (
            <div key={rowId}>
              <div className={rowCls} style={rowSlotBase.style} data-testid="data-grid-row" data-row-id={rowId} data-selected={isSelected} role="row">
                {dgCtx.selectionMode !== 'none' && (
                  <div style={{ width: dgCtx.selectionMode === 'multiple' ? 48 : 0, minWidth: dgCtx.selectionMode === 'multiple' ? 48 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {dgCtx.selectionMode === 'multiple' && (
                      <input type="checkbox" className={checkboxStyle} checked={isSelected} onChange={() => dgCtx.api.send({ type: 'TOGGLE_ROW', rowId })} data-testid="data-grid-row-checkbox" aria-label={`Select row ${rowId}`} />
                    )}
                  </div>
                )}
                {dgCtx.expandable && (
                  <div style={{ width: 40, minWidth: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <button className={expandButtonStyle} onClick={() => dgCtx.api.send({ type: 'TOGGLE_ROW_EXPANSION', rowId })} data-testid="data-grid-expand-btn" aria-expanded={isExpanded} aria-label={isExpanded ? 'Collapse row' : 'Expand row'} type="button">
                      {isExpanded ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
                    </button>
                  </div>
                )}
                {dgCtx.visibleColumns.map((col) => {
                  const w = dgCtx.ctx.columnWidths.get(col.key) ?? col.width ?? 150;
                  const alignCls = cellAlignStyles[col.align ?? 'left'];
                  const isEditing = dgCtx.ctx.editingCell?.rowId === rowId && dgCtx.ctx.editingCell?.columnKey === col.key;
                  const cellValue = row[col.key];
                  return (
                    <div
                      key={col.key}
                      className={`${cellSlotBase.className} ${alignCls}`}
                      style={{ ...cellSlotBase.style, width: w, minWidth: col.minWidth ?? 50 }}
                      data-testid="data-grid-cell"
                      data-column={col.key}
                      role="gridcell"
                      onDoubleClick={col.editable ? () => dgCtx.api.send({ type: 'START_EDIT', rowId, columnKey: col.key, value: String(cellValue ?? '') }) : undefined}
                    >
                      {isEditing ? (
                        <input
                          className={editCellStyle}
                          value={dgCtx.ctx.editingCell?.value ?? ''}
                          onChange={(e) => dgCtx.api.send({ type: 'UPDATE_EDIT', value: e.target.value })}
                          onKeyDown={(e) => { if (e.key === 'Enter') dgCtx.api.send({ type: 'COMMIT_EDIT' }); if (e.key === 'Escape') dgCtx.api.send({ type: 'CANCEL_EDIT' }); }}
                          onBlur={() => dgCtx.api.send({ type: 'COMMIT_EDIT' })}
                          data-testid="data-grid-edit-input"
                          autoFocus
                        />
                      ) : dgCtx.renderCell ? dgCtx.renderCell(row, col) : (
                        <span>{cellValue !== undefined && cellValue !== null ? String(cellValue) : ''}</span>
                      )}
                    </div>
                  );
                })}
              </div>
              {dgCtx.expandable && isExpanded && dgCtx.renderDetail && (
                <div className={detailRowStyle} data-testid="data-grid-detail">{dgCtx.renderDetail(row)}</div>
              )}
            </div>
          );
        })}
      </div>
    );
  },
);

// ── Compound: DataGrid.Footer ───────────────────────

/** DataGrid.Footer props */
export interface DataGridFooterProps { children?: ReactNode; className?: string; }

export const DataGridFooter = forwardRef<HTMLDivElement, DataGridFooterProps>(
  function DataGridFooter(props, ref) {
    const { children, className } = props;
    const dgCtx = useDataGridContext();
    const slot = getSlotProps('footer', footerStyle, dgCtx.classNames, dgCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="data-grid-footer">
        {children ?? <span>{dgCtx.totalRows} satir</span>}
      </div>
    );
  },
);

// ── Compound: DataGrid.Pagination ───────────────────

/** DataGrid.Pagination props */
export interface DataGridPaginationProps { className?: string; }

export const DataGridPagination = forwardRef<HTMLDivElement, DataGridPaginationProps>(
  function DataGridPagination(props, ref) {
    const { className } = props;
    const dgCtx = useDataGridContext();
    const slot = getSlotProps('pagination', paginationStyle, dgCtx.classNames, dgCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const { page, pageSize } = dgCtx.ctx;
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, dgCtx.totalRows);
    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="data-grid-pagination">
        <span data-testid="data-grid-page-info">{dgCtx.totalRows > 0 ? `${start}-${end} / ${dgCtx.totalRows}` : '0 satir'}</span>
        <button className={pageButtonStyle} disabled={page === 0} onClick={() => dgCtx.api.send({ type: 'SET_PAGE', page: page - 1 })} data-testid="data-grid-prev-page" aria-label="Previous page" type="button"><ChevronLeftIcon size={14} /></button>
        <span data-testid="data-grid-page-number">{page + 1} / {dgCtx.totalPages}</span>
        <button className={pageButtonStyle} disabled={page >= dgCtx.totalPages - 1} onClick={() => dgCtx.api.send({ type: 'SET_PAGE', page: page + 1 })} data-testid="data-grid-next-page" aria-label="Next page" type="button"><ChevronRightIcon size={14} /></button>
      </div>
    );
  },
);

// ── Compound: DataGrid.ColumnChooser ────────────────

/** DataGrid.ColumnChooser props */
export interface DataGridColumnChooserProps { className?: string; }

export const DataGridColumnChooser = forwardRef<HTMLDivElement, DataGridColumnChooserProps>(
  function DataGridColumnChooser(props, ref) {
    const { className } = props;
    const dgCtx = useDataGridContext();
    const [open, setOpen] = useState(false);
    const cls = className ?? '';
    return (
      <div ref={ref} style={{ position: 'relative' }} data-testid="data-grid-column-chooser">
        <button className={pageButtonStyle} onClick={() => setOpen(!open)} type="button" aria-label="Column chooser" data-testid="data-grid-column-chooser-btn">Sutunlar</button>
        {open && (
          <div className={`${columnChooserStyle} ${cls}`} data-testid="data-grid-column-chooser-panel">
            {dgCtx.columns.map((col) => (
              <label key={col.key} className={columnChooserItemStyle}>
                <input type="checkbox" className={checkboxStyle} checked={!dgCtx.ctx.hiddenColumns.has(col.key)} onChange={() => dgCtx.api.send({ type: 'TOGGLE_COLUMN_VISIBILITY', columnKey: col.key })} />
                {col.title}
              </label>
            ))}
          </div>
        )}
      </div>
    );
  },
);

// ── Compound: DataGrid.ExportButton ─────────────────

/** DataGrid.ExportButton props */
export interface DataGridExportButtonProps { format?: 'csv' | 'json'; filename?: string; className?: string; }

export const DataGridExportButton = forwardRef<HTMLButtonElement, DataGridExportButtonProps>(
  function DataGridExportButton(props, ref) {
    const { format = 'csv', filename = 'export', className } = props;
    const dgCtx = useDataGridContext();
    const handleExport = useCallback(() => {
      const cols = dgCtx.visibleColumns;
      const rows = dgCtx.visibleRows;
      if (format === 'json') {
        const d = rows.map((row) => { const obj: Record<string, unknown> = {}; for (const col of cols) { obj[col.key] = row[col.key]; } return obj; });
        downloadFile(JSON.stringify(d, null, 2), `${filename}.json`, 'application/json');
      } else {
        const header = cols.map((c) => c.title).join(',');
        const body = rows.map((row) => cols.map((col) => { const val = row[col.key]; const str = val !== undefined && val !== null ? String(val) : ''; return str.includes(',') ? `"${str}"` : str; }).join(',')).join('\n');
        downloadFile(`${header}\n${body}`, `${filename}.csv`, 'text/csv');
      }
    }, [dgCtx.visibleColumns, dgCtx.visibleRows, format, filename]);
    const cls = className ? `${pageButtonStyle} ${className}` : pageButtonStyle;
    return <button ref={ref} className={cls} onClick={handleExport} type="button" data-testid="data-grid-export-btn" aria-label={`Export as ${format.toUpperCase()}`}>Export {format.toUpperCase()}</button>;
  },
);

function downloadFile(content: string, fn: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fn;
  link.click();
  URL.revokeObjectURL(url);
}

// ── Compound: DataGrid.Row ──────────────────────────

/** DataGrid.Row props */
export interface DataGridRowProps { children?: ReactNode; className?: string; }

export const DataGridRow = forwardRef<HTMLDivElement, DataGridRowProps>(
  function DataGridRow(props, ref) {
    const { children, className } = props;
    const dgCtx = useDataGridContext();
    const slot = getSlotProps('row', rowStyle, dgCtx.classNames, dgCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return <div ref={ref} className={cls} style={slot.style} data-testid="data-grid-row" role="row">{children}</div>;
  },
);

// ── Compound: DataGrid.Cell ─────────────────────────

/** DataGrid.Cell props */
export interface DataGridCellProps { children?: ReactNode; className?: string; }

export const DataGridCell = forwardRef<HTMLDivElement, DataGridCellProps>(
  function DataGridCell(props, ref) {
    const { children, className } = props;
    const dgCtx = useDataGridContext();
    const slot = getSlotProps('cell', cellStyle, dgCtx.classNames, dgCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return <div ref={ref} className={cls} style={slot.style} data-testid="data-grid-cell" role="gridcell">{children}</div>;
  },
);

// ── Component Props ──────────────────────────────────

export interface DataGridComponentProps extends SlotStyleProps<DataGridSlot> {
  columns: ColumnDef[];
  data: DataGridRowData[];
  getRowId?: (row: DataGridRowData, index: number) => string;
  sortable?: boolean;
  filterable?: boolean;
  selectionMode?: 'none' | 'single' | 'multiple';
  multiSort?: boolean;
  paginated?: boolean;
  pageSize?: number;
  /** Sanal scroll aktif mi / Enable virtual scroll */
  virtualScroll?: boolean;
  /** Satir yuksekligi (px) / Row height in pixels */
  rowHeight?: number;
  /** Body yuksekligi (px) / Body viewport height in pixels */
  bodyHeight?: number;
  renderDetail?: (row: DataGridRowData) => ReactNode;
  renderCell?: (row: DataGridRowData, column: ColumnDef) => ReactNode;
  onSortChange?: (sort: SortState[]) => void;
  onFilterChange?: (filters: FilterState[]) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  onPageChange?: (page: number) => void;
  onEditCommit?: (rowId: string, columnKey: string, value: string) => void;
  onRowExpansionChange?: (expandedIds: string[]) => void;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────

export const DataGridBase = forwardRef<HTMLDivElement, DataGridComponentProps>(
  function DataGrid(props, ref) {
    const {
      columns, data, getRowId: getRowIdProp,
      sortable = false, filterable = false, selectionMode = 'none',
      multiSort = false, paginated = false, pageSize = 50,
      virtualScroll = false, rowHeight = 40, bodyHeight,
      renderDetail, renderCell,
      onSortChange, onFilterChange, onSelectionChange, onPageChange, onEditCommit, onRowExpansionChange,
      children, className, style: styleProp, classNames, styles,
    } = props;

    const hookProps: UseDataGridProps = {
      columns, data, getRowId: getRowIdProp, selectionMode, pageSize, multiSort, paginated,
      virtualScroll, rowHeight,
      onSortChange, onFilterChange, onSelectionChange, onPageChange, onEditCommit, onRowExpansionChange, renderDetail,
    };

    const { api, ctx, visibleRows, totalPages, totalRows, visibleColumns, getRowId, virtualRange, onBodyScroll } = useDataGrid(hookProps);
    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const expandable = renderDetail !== undefined;

    const ctxValue: DataGridContextValue = {
      api, ctx, columns, visibleColumns, visibleRows, totalPages, totalRows, getRowId,
      sortable, filterable, selectionMode, paginated, expandable,
      virtualScroll, rowHeight, virtualRange, onBodyScroll, bodyHeight,
      renderDetail, renderCell, classNames, styles,
    };

    if (children) {
      return (
        <DataGridCtx.Provider value={ctxValue}>
          <div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="data-grid-root" role="grid">{children}</div>
        </DataGridCtx.Provider>
      );
    }

    return (
      <DataGridCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="data-grid-root" role="grid">
          <DataGridHeader />
          <DataGridBody />
          {paginated ? <FooterWithPagination totalRows={totalRows} /> : <DataGridFooter />}
        </div>
      </DataGridCtx.Provider>
    );
  },
);

function FooterWithPagination({ totalRows }: { totalRows: number }) {
  const dgCtx = useDataGridContext();
  const slot = getSlotProps('footer', footerStyle, dgCtx.classNames, dgCtx.styles);
  return (
    <div className={slot.className} style={slot.style} data-testid="data-grid-footer">
      <span>{totalRows} satir</span>
      <DataGridPagination />
    </div>
  );
}

/**
 * DataGrid bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <DataGrid columns={columns} data={data} sortable filterable paginated />
 * ```
 *
 * @example Compound
 * ```tsx
 * <DataGrid columns={columns} data={data}>
 *   <DataGrid.Toolbar><DataGrid.ColumnChooser /><DataGrid.ExportButton format="csv" /></DataGrid.Toolbar>
 *   <DataGrid.Header />
 *   <DataGrid.Body />
 *   <DataGrid.Footer><DataGrid.Pagination /></DataGrid.Footer>
 * </DataGrid>
 * ```
 */
export const DataGrid = Object.assign(DataGridBase, {
  Toolbar: DataGridToolbar,
  Header: DataGridHeader,
  Body: DataGridBody,
  Footer: DataGridFooter,
  Pagination: DataGridPagination,
  ColumnChooser: DataGridColumnChooser,
  ExportButton: DataGridExportButton,
  Row: DataGridRow,
  Cell: DataGridCell,
});
