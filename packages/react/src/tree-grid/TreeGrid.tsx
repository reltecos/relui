/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * TreeGrid — Tree + DataGrid hibrit bilesen (Dual API).
 * TreeGrid — Tree + DataGrid hybrid component (Dual API).
 *
 * Props-based: `<TreeGrid columns={cols} rows={data} />`
 * Compound:    `<TreeGrid columns={cols}><TreeGrid.Header /><TreeGrid.Body rows={data} /></TreeGrid>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useCallback, type ReactNode } from 'react';
import { ChevronRightIcon, ChevronUpIcon, ChevronDownIcon } from '@relteco/relui-icons';
import type { TreeGridColumnDef, TreeGridRowDef, TreeGridSortState } from '@relteco/relui-core';
import {
  rootStyle, headerStyle, headerCellStyle, headerCellAlignStyles,
  bodyStyle, rowStyle, cellStyle, cellAlignStyles,
  expandButtonStyle, expandPlaceholderStyle, sortIndicatorStyle,
} from './tree-grid.css';
import { useTreeGrid, type UseTreeGridProps } from './useTreeGrid';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

export type TreeGridSlot = 'root' | 'header' | 'headerCell' | 'body' | 'row' | 'cell' | 'expandButton';

// ── Context ───────────────────────────────────────────

interface TreeGridContextValue {
  columns: TreeGridColumnDef[];
  sort: TreeGridSortState | null;
  expandedIds: ReadonlySet<string>;
  selectedIds: ReadonlySet<string>;
  selectionMode: 'none' | 'single' | 'multiple';
  onSort: (key: string) => void;
  onToggleExpand: (id: string) => void;
  onSelectRow: (id: string) => void;
  classNames: ClassNames<TreeGridSlot> | undefined;
  styles: Styles<TreeGridSlot> | undefined;
}

const TreeGridContext = createContext<TreeGridContextValue | null>(null);

function useTreeGridContext(): TreeGridContextValue {
  const ctx = useContext(TreeGridContext);
  if (!ctx) throw new Error('TreeGrid compound sub-components must be used within <TreeGrid>.');
  return ctx;
}

// ── Compound: TreeGrid.Header ─────────────────────────

export interface TreeGridHeaderProps { className?: string }

const TreeGridHeader = forwardRef<HTMLTableSectionElement, TreeGridHeaderProps>(
  function TreeGridHeader(props, ref) {
    const { className } = props;
    const ctx = useTreeGridContext();
    const slot = getSlotProps('header', headerStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <thead ref={ref} className={cls} style={slot.style} data-testid="treegrid-header">
        <tr>
          {ctx.columns.map((col) => {
            const align = col.align ?? 'left';
            const hcSlot = getSlotProps('headerCell', `${headerCellStyle} ${headerCellAlignStyles[align]}`, ctx.classNames, ctx.styles);
            const sortDir = ctx.sort?.columnKey === col.key ? ctx.sort.direction : null;
            return (
              <th
                key={col.key}
                className={hcSlot.className}
                style={{ ...hcSlot.style, width: col.width }}
                data-sortable={col.sortable || undefined}
                onClick={() => col.sortable && ctx.onSort(col.key)}
                data-testid="treegrid-headerCell"
                role="columnheader"
                aria-sort={sortDir === 'asc' ? 'ascending' : sortDir === 'desc' ? 'descending' : undefined}
              >
                {col.title}
                {sortDir && (
                  <span className={sortIndicatorStyle}>
                    {sortDir === 'asc' ? <ChevronUpIcon size={12} /> : <ChevronDownIcon size={12} />}
                  </span>
                )}
              </th>
            );
          })}
        </tr>
      </thead>
    );
  },
);

// ── Compound: TreeGrid.Body ───────────────────────────

export interface TreeGridBodyProps {
  rows?: TreeGridRowDef[];
  className?: string;
}

const TreeGridBody = forwardRef<HTMLTableSectionElement, TreeGridBodyProps>(
  function TreeGridBody(props, ref) {
    const { rows, className } = props;
    const ctx = useTreeGridContext();
    const slot = getSlotProps('body', bodyStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <tbody ref={ref} className={cls} style={slot.style} data-testid="treegrid-body">
        {rows && renderRows(rows, ctx, 0)}
      </tbody>
    );
  },
);

function renderRows(rows: TreeGridRowDef[], ctx: TreeGridContextValue, depth: number): ReactNode[] {
  const result: ReactNode[] = [];
  for (const row of rows) {
    const hasChildren = row.children !== undefined && row.children.length > 0;
    const isExpanded = ctx.expandedIds.has(row.id);
    const isSelected = ctx.selectedIds.has(row.id);
    const rSlot = getSlotProps('row', rowStyle, ctx.classNames, ctx.styles);
    const ebSlot = getSlotProps('expandButton', expandButtonStyle, ctx.classNames, ctx.styles);

    result.push(
      <tr
        key={row.id}
        className={rSlot.className}
        style={rSlot.style}
        data-selected={isSelected}
        data-testid="treegrid-row"
        data-row-id={row.id}
        role="row"
        aria-level={depth + 1}
        aria-expanded={hasChildren ? isExpanded : undefined}
        onClick={() => ctx.selectionMode !== 'none' && ctx.onSelectRow(row.id)}
      >
        {ctx.columns.map((col, colIdx) => {
          const align = col.align ?? 'left';
          const cSlot = getSlotProps('cell', `${cellStyle} ${cellAlignStyles[align]}`, ctx.classNames, ctx.styles);
          const cellValue = row.cells[col.key];
          const isFirst = colIdx === 0;

          return (
            <td
              key={col.key}
              className={cSlot.className}
              style={cSlot.style}
              data-testid="treegrid-cell"
              role="gridcell"
            >
              {isFirst && (
                <>
                  {/* Indent */}
                  {depth > 0 && <span style={{ display: 'inline-block', width: depth * 20 }} />}
                  {/* Expand button or placeholder */}
                  {hasChildren ? (
                    <button
                      type="button"
                      className={ebSlot.className}
                      style={ebSlot.style}
                      data-expanded={isExpanded}
                      onClick={(e) => { e.stopPropagation(); ctx.onToggleExpand(row.id); }}
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      data-testid="treegrid-expandButton"
                    >
                      <ChevronRightIcon size={14} />
                    </button>
                  ) : (
                    <span className={expandPlaceholderStyle} />
                  )}
                </>
              )}
              {cellValue !== undefined ? String(cellValue) : ''}
            </td>
          );
        })}
      </tr>,
    );

    if (hasChildren && isExpanded && row.children) {
      result.push(...renderRows(row.children, ctx, depth + 1));
    }
  }
  return result;
}

// ── Compound: TreeGrid.Row ────────────────────────────

export interface TreeGridRowProps {
  children: ReactNode;
  className?: string;
}

const TreeGridRow = forwardRef<HTMLTableRowElement, TreeGridRowProps>(
  function TreeGridRow(props, ref) {
    const { children, className } = props;
    const ctx = useTreeGridContext();
    const slot = getSlotProps('row', rowStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return (
      <tr ref={ref} className={cls} style={slot.style} role="row" data-testid="treegrid-row">
        {children}
      </tr>
    );
  },
);

// ── Compound: TreeGrid.Cell ───────────────────────────

export interface TreeGridCellProps {
  children?: ReactNode;
  className?: string;
}

const TreeGridCell = forwardRef<HTMLTableCellElement, TreeGridCellProps>(
  function TreeGridCell(props, ref) {
    const { children, className } = props;
    const ctx = useTreeGridContext();
    const slot = getSlotProps('cell', cellStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return (
      <td ref={ref} className={cls} style={slot.style} role="gridcell" data-testid="treegrid-cell">
        {children}
      </td>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface TreeGridComponentProps extends SlotStyleProps<TreeGridSlot> {
  /** Sutun tanimlari / Column definitions */
  columns: TreeGridColumnDef[];
  /** Props-based: satir verisi / Row data */
  rows?: TreeGridRowDef[];
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
  /** Compound API children */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const TreeGridBase = forwardRef<HTMLTableElement, TreeGridComponentProps>(
  function TreeGrid(props, ref) {
    const {
      columns,
      rows,
      selectionMode = 'none',
      defaultExpanded,
      onSortChange,
      onExpandChange,
      onSelectionChange,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const hookProps: UseTreeGridProps = {
      columns,
      selectionMode,
      defaultExpanded,
      onSortChange,
      onExpandChange,
      onSelectionChange,
    };

    const { context, send } = useTreeGrid(hookProps);

    const onSort = useCallback((key: string) => send({ type: 'SORT', columnKey: key }), [send]);
    const onToggleExpand = useCallback((id: string) => send({ type: 'TOGGLE_EXPAND', rowId: id }), [send]);
    const onSelectRow = useCallback((id: string) => send({ type: 'TOGGLE_ROW', rowId: id }), [send]);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: TreeGridContextValue = {
      columns,
      sort: context.sort,
      expandedIds: context.expandedIds,
      selectedIds: context.selectedIds,
      selectionMode,
      onSort,
      onToggleExpand,
      onSelectRow,
      classNames,
      styles,
    };

    if (children) {
      return (
        <TreeGridContext.Provider value={ctxValue}>
          <table ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} role="treegrid" data-testid="treegrid-root">
            {children}
          </table>
        </TreeGridContext.Provider>
      );
    }

    return (
      <TreeGridContext.Provider value={ctxValue}>
        <table ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} role="treegrid" data-testid="treegrid-root">
          <TreeGridHeader />
          <TreeGridBody rows={rows} />
        </table>
      </TreeGridContext.Provider>
    );
  },
);

/**
 * TreeGrid bilesen — Dual API (props-based + compound).
 */
export const TreeGrid = Object.assign(TreeGridBase, {
  Header: TreeGridHeader,
  Body: TreeGridBody,
  Row: TreeGridRow,
  Cell: TreeGridCell,
});
