/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * PivotTable — OLAP capraz tablo bilesen (Dual API).
 * PivotTable — OLAP cross table component (Dual API).
 *
 * Props-based: `<PivotTable data={rawData} fields={defs} defaultPlacement={...} />`
 * Compound:    `<PivotTable ...><PivotTable.FieldChooser /><PivotTable.Grid /></PivotTable>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { PivotField, PivotPlacement, PivotResult } from '@relteco/relui-core';
import {
  rootStyle, fieldChooserStyle, fieldZoneStyle, fieldZoneLabelStyle,
  fieldTagStyle, gridStyle, headerCellStyle, dataCellStyle, totalCellStyle,
} from './pivot-table.css';
import { usePivotTable, type UsePivotTableProps } from './usePivotTable';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

export type PivotTableSlot = 'root' | 'fieldChooser' | 'grid' | 'headerCell' | 'dataCell' | 'totalCell';

// ── Context ───────────────────────────────────────────

interface PivotTableContextValue {
  fields: PivotField[];
  placement: PivotPlacement;
  result: PivotResult;
  onMoveField: (fieldKey: string, from: 'row' | 'column' | 'unused', to: 'row' | 'column' | 'unused') => void;
  classNames: ClassNames<PivotTableSlot> | undefined;
  styles: Styles<PivotTableSlot> | undefined;
}

const PivotTableContext = createContext<PivotTableContextValue | null>(null);

function usePivotTableContext(): PivotTableContextValue {
  const ctx = useContext(PivotTableContext);
  if (!ctx) throw new Error('PivotTable compound sub-components must be used within <PivotTable>.');
  return ctx;
}

// ── Compound: PivotTable.FieldChooser ─────────────────

export interface PivotTableFieldChooserProps { className?: string }

const PivotTableFieldChooser = forwardRef<HTMLDivElement, PivotTableFieldChooserProps>(
  function PivotTableFieldChooser(props, ref) {
    const { className } = props;
    const ctx = usePivotTableContext();
    const slot = getSlotProps('fieldChooser', fieldChooserStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const usedKeys = new Set([...ctx.placement.rowFields, ...ctx.placement.columnFields]);
    const unusedFields = ctx.fields.filter((f) => !usedKeys.has(f.key));

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="pivottable-fieldChooser">
        <div className={fieldZoneStyle}>
          <span className={fieldZoneLabelStyle}>Satir / Rows</span>
          {ctx.placement.rowFields.map((key) => {
            const f = ctx.fields.find((fl) => fl.key === key);
            return (
              <span
                key={key}
                className={fieldTagStyle}
                onClick={() => ctx.onMoveField(key, 'row', 'unused')}
                data-testid="pivottable-field-tag"
              >
                {f?.label ?? key}
              </span>
            );
          })}
        </div>
        <div className={fieldZoneStyle}>
          <span className={fieldZoneLabelStyle}>Sutun / Columns</span>
          {ctx.placement.columnFields.map((key) => {
            const f = ctx.fields.find((fl) => fl.key === key);
            return (
              <span
                key={key}
                className={fieldTagStyle}
                onClick={() => ctx.onMoveField(key, 'column', 'unused')}
                data-testid="pivottable-field-tag"
              >
                {f?.label ?? key}
              </span>
            );
          })}
        </div>
        <div className={fieldZoneStyle}>
          <span className={fieldZoneLabelStyle}>Kullanilmayan / Unused</span>
          {unusedFields.map((f) => (
            <span
              key={f.key}
              className={fieldTagStyle}
              onClick={() => ctx.onMoveField(f.key, 'unused', 'row')}
              data-testid="pivottable-field-tag"
            >
              {f.label}
            </span>
          ))}
        </div>
      </div>
    );
  },
);

// ── Compound: PivotTable.Grid ─────────────────────────

export interface PivotTableGridProps { className?: string }

const PivotTableGrid = forwardRef<HTMLTableElement, PivotTableGridProps>(
  function PivotTableGrid(props, ref) {
    const { className } = props;
    const ctx = usePivotTableContext();
    const slot = getSlotProps('grid', gridStyle, ctx.classNames, ctx.styles);
    const hcSlot = getSlotProps('headerCell', headerCellStyle, ctx.classNames, ctx.styles);
    const dcSlot = getSlotProps('dataCell', dataCellStyle, ctx.classNames, ctx.styles);
    const tcSlot = getSlotProps('totalCell', totalCellStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const { rowHeaders, columnHeaders, values, rowTotals, columnTotals, grandTotal } = ctx.result;
    const hasData = rowHeaders.length > 0 && columnHeaders.length > 0;

    if (!hasData) {
      return (
        <table ref={ref} className={cls} style={slot.style} role="grid" data-testid="pivottable-grid">
          <tbody>
            <tr>
              <td className={dcSlot.className} style={dcSlot.style} data-testid="pivottable-dataCell">
                Alan yerlestirin / Place fields
              </td>
            </tr>
          </tbody>
        </table>
      );
    }

    return (
      <table ref={ref} className={cls} style={slot.style} role="grid" data-testid="pivottable-grid">
        <thead>
          <tr>
            <th className={hcSlot.className} style={hcSlot.style} data-testid="pivottable-headerCell" role="columnheader" />
            {columnHeaders.map((ch, ci) => (
              <th key={ci} className={hcSlot.className} style={hcSlot.style} data-testid="pivottable-headerCell" role="columnheader">
                {ch.join(' / ')}
              </th>
            ))}
            <th className={tcSlot.className} style={tcSlot.style} data-testid="pivottable-totalCell" role="columnheader">
              Toplam
            </th>
          </tr>
        </thead>
        <tbody>
          {rowHeaders.map((rh, ri) => (
            <tr key={ri} role="row">
              <th className={hcSlot.className} style={{ ...hcSlot.style, textAlign: 'left' }} data-testid="pivottable-headerCell" role="rowheader">
                {rh.join(' / ')}
              </th>
              {(values[ri] ?? []).map((val, ci) => (
                <td key={ci} className={dcSlot.className} style={dcSlot.style} data-testid="pivottable-dataCell" role="gridcell">
                  {val !== null ? val.toLocaleString() : '-'}
                </td>
              ))}
              <td className={tcSlot.className} style={tcSlot.style} data-testid="pivottable-totalCell">
                {rowTotals[ri] !== null && rowTotals[ri] !== undefined ? (rowTotals[ri] as number).toLocaleString() : '-'}
              </td>
            </tr>
          ))}
          <tr role="row">
            <th className={tcSlot.className} style={{ ...tcSlot.style, textAlign: 'left' }} data-testid="pivottable-totalCell">
              Toplam
            </th>
            {columnTotals.map((ct, ci) => (
              <td key={ci} className={tcSlot.className} style={tcSlot.style} data-testid="pivottable-totalCell">
                {ct !== null ? ct.toLocaleString() : '-'}
              </td>
            ))}
            <td className={tcSlot.className} style={tcSlot.style} data-testid="pivottable-totalCell">
              {grandTotal !== null ? grandTotal.toLocaleString() : '-'}
            </td>
          </tr>
        </tbody>
      </table>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface PivotTableComponentProps extends SlotStyleProps<PivotTableSlot> {
  /** Ham veri / Raw data */
  data: Record<string, string | number>[];
  /** Alan tanimlari / Field definitions */
  fields: PivotField[];
  /** Baslangic yerlestirme / Default placement */
  defaultPlacement?: PivotPlacement;
  /** Yerlestirme degisince / On placement change */
  onPlacementChange?: (placement: PivotPlacement) => void;
  /** Compound children */
  children?: ReactNode;
  /** Ek className */
  className?: string;
  /** Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const PivotTableBase = forwardRef<HTMLDivElement, PivotTableComponentProps>(
  function PivotTable(props, ref) {
    const {
      data,
      fields,
      defaultPlacement,
      onPlacementChange,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const hookProps: UsePivotTableProps = { data, fields, defaultPlacement, onPlacementChange };
    const { result, send, context } = usePivotTable(hookProps);

    const onMoveField = (fieldKey: string, from: 'row' | 'column' | 'unused', to: 'row' | 'column' | 'unused') => {
      send({ type: 'MOVE_FIELD', fieldKey, from, to });
    };

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: PivotTableContextValue = {
      fields,
      placement: context.placement,
      result,
      onMoveField,
      classNames,
      styles,
    };

    if (children) {
      return (
        <PivotTableContext.Provider value={ctxValue}>
          <div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="pivottable-root">
            {children}
          </div>
        </PivotTableContext.Provider>
      );
    }

    return (
      <PivotTableContext.Provider value={ctxValue}>
        <div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="pivottable-root">
          <PivotTableFieldChooser />
          <PivotTableGrid />
        </div>
      </PivotTableContext.Provider>
    );
  },
);

/**
 * PivotTable bilesen — Dual API (props-based + compound).
 */
export const PivotTable = Object.assign(PivotTableBase, {
  FieldChooser: PivotTableFieldChooser,
  Grid: PivotTableGrid,
});
