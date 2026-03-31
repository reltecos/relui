/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * PivotTable state machine — alan yerlestirme ve agregasyon yonetimi.
 * PivotTable state machine — field placement and aggregation management.
 *
 * @packageDocumentation
 */

import type {
  PivotTableConfig,
  PivotTableContext,
  PivotTableEvent,
  PivotPlacement,
  PivotValueField,
  PivotResult,
  PivotAggregateType,
  PivotTableAPI,
} from './pivot-table.types';

// ── Pivot Computation ─────────────────────────────────

function aggregateValues(values: number[], type: PivotAggregateType): number | null {
  if (values.length === 0) return null;
  switch (type) {
    case 'sum': return values.reduce((a, b) => a + b, 0);
    case 'count': return values.length;
    case 'average': return values.reduce((a, b) => a + b, 0) / values.length;
    case 'min': return Math.min(...values);
    case 'max': return Math.max(...values);
  }
}

/**
 * Pivot hesaplama — raw data + placement → PivotResult.
 * Pivot computation — raw data + placement → PivotResult.
 */
export function computePivot(
  data: Record<string, string | number>[],
  placement: PivotPlacement,
): PivotResult {
  const { rowFields, columnFields, valueFields } = placement;

  if (valueFields.length === 0 || data.length === 0) {
    return { rowHeaders: [], columnHeaders: [], values: [], rowTotals: [], columnTotals: [], grandTotal: null };
  }

  const vf = valueFields[0] as PivotValueField;

  // Build unique row/col header combinations
  const rowKeySet = new Map<string, string[]>();
  const colKeySet = new Map<string, string[]>();

  for (const row of data) {
    const rKey = rowFields.map((f) => String(row[f] ?? '')).join('\x00');
    if (!rowKeySet.has(rKey)) {
      rowKeySet.set(rKey, rowFields.map((f) => String(row[f] ?? '')));
    }
    const cKey = columnFields.map((f) => String(row[f] ?? '')).join('\x00');
    if (!colKeySet.has(cKey)) {
      colKeySet.set(cKey, columnFields.map((f) => String(row[f] ?? '')));
    }
  }

  const rowHeaders = Array.from(rowKeySet.values());
  const columnHeaders = Array.from(colKeySet.values());
  const rowKeys = Array.from(rowKeySet.keys());
  const colKeys = Array.from(colKeySet.keys());

  // Group data into buckets
  const buckets = new Map<string, number[]>();

  for (const row of data) {
    const rKey = rowFields.map((f) => String(row[f] ?? '')).join('\x00');
    const cKey = columnFields.map((f) => String(row[f] ?? '')).join('\x00');
    const bucketKey = `${rKey}\x01${cKey}`;
    const val = Number(row[vf.key] ?? 0);
    const arr = buckets.get(bucketKey);
    if (arr) {
      arr.push(val);
    } else {
      buckets.set(bucketKey, [val]);
    }
  }

  // Build value matrix
  const values: (number | null)[][] = rowKeys.map((rk) =>
    colKeys.map((ck) => {
      const bucket = buckets.get(`${rk}\x01${ck}`);
      return bucket ? aggregateValues(bucket, vf.aggregate) : null;
    }),
  );

  // Row totals
  const rowTotals: (number | null)[] = rowKeys.map((rk) => {
    const allVals: number[] = [];
    for (const ck of colKeys) {
      const bucket = buckets.get(`${rk}\x01${ck}`);
      if (bucket) allVals.push(...bucket);
    }
    return aggregateValues(allVals, vf.aggregate);
  });

  // Column totals
  const columnTotals: (number | null)[] = colKeys.map((ck) => {
    const allVals: number[] = [];
    for (const rk of rowKeys) {
      const bucket = buckets.get(`${rk}\x01${ck}`);
      if (bucket) allVals.push(...bucket);
    }
    return aggregateValues(allVals, vf.aggregate);
  });

  // Grand total
  const allValues: number[] = [];
  for (const arr of buckets.values()) allValues.push(...arr);
  const grandTotal = aggregateValues(allValues, vf.aggregate);

  return { rowHeaders, columnHeaders, values, rowTotals, columnTotals, grandTotal };
}

// ── State Machine ─────────────────────────────────────

/**
 * PivotTable state machine olusturur.
 * Creates a PivotTable state machine.
 */
export function createPivotTable(config: PivotTableConfig): PivotTableAPI {
  const {
    defaultPlacement = { rowFields: [], columnFields: [], valueFields: [] },
    onPlacementChange,
  } = config;

  let placement: PivotPlacement = { ...defaultPlacement };

  const listeners = new Set<() => void>();

  function notify(): void {
    for (const fn of listeners) fn();
  }

  function getContext(): PivotTableContext {
    return { placement };
  }

  function send(event: PivotTableEvent): void {
    switch (event.type) {
      case 'SET_PLACEMENT': {
        placement = { ...event.placement };
        onPlacementChange?.(placement);
        notify();
        break;
      }
      case 'MOVE_FIELD': {
        const nextRow = placement.rowFields.filter((k) => k !== event.fieldKey);
        const nextCol = placement.columnFields.filter((k) => k !== event.fieldKey);

        if (event.to === 'row') nextRow.push(event.fieldKey);
        else if (event.to === 'column') nextCol.push(event.fieldKey);

        placement = { ...placement, rowFields: nextRow, columnFields: nextCol };
        onPlacementChange?.(placement);
        notify();
        break;
      }
      case 'SET_AGGREGATE': {
        const nextVf = placement.valueFields.map((vf) =>
          vf.key === event.fieldKey ? { ...vf, aggregate: event.aggregate } : vf,
        );
        placement = { ...placement, valueFields: nextVf };
        onPlacementChange?.(placement);
        notify();
        break;
      }
      case 'ADD_VALUE_FIELD': {
        if (placement.valueFields.some((vf) => vf.key === event.field.key)) return;
        placement = { ...placement, valueFields: [...placement.valueFields, event.field] };
        onPlacementChange?.(placement);
        notify();
        break;
      }
      case 'REMOVE_VALUE_FIELD': {
        const filtered = placement.valueFields.filter((vf) => vf.key !== event.fieldKey);
        if (filtered.length === placement.valueFields.length) return;
        placement = { ...placement, valueFields: filtered };
        onPlacementChange?.(placement);
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

  return { getContext, send, subscribe, destroy };
}
