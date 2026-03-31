/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * TreeGrid state machine — Tree + DataGrid hibrit yonetimi.
 * TreeGrid state machine — Tree + DataGrid hybrid management.
 *
 * @packageDocumentation
 */

import type {
  TreeGridConfig,
  TreeGridContext,
  TreeGridEvent,
  TreeGridSortState,
  TreeGridAPI,
} from './tree-grid.types';

/**
 * TreeGrid state machine olusturur.
 * Creates a TreeGrid state machine.
 */
export function createTreeGrid(config: TreeGridConfig): TreeGridAPI {
  const {
    columns,
    selectionMode = 'none',
    defaultExpanded = [],
    onSortChange,
    onExpandChange,
    onSelectionChange,
  } = config;

  // ── State ──
  let sort: TreeGridSortState | null = null;
  let expandedIds = new Set<string>(defaultExpanded);
  let selectedIds = new Set<string>();

  const listeners = new Set<() => void>();

  function notify(): void {
    for (const fn of listeners) fn();
  }

  function getContext(): TreeGridContext {
    return { sort, expandedIds, selectedIds };
  }

  function send(event: TreeGridEvent): void {
    switch (event.type) {
      case 'SORT': {
        const col = columns.find((c) => c.key === event.columnKey);
        if (!col?.sortable) return;
        if (sort && sort.columnKey === event.columnKey) {
          if (sort.direction === 'asc') {
            sort = { columnKey: event.columnKey, direction: 'desc' };
          } else {
            sort = null;
          }
        } else {
          sort = { columnKey: event.columnKey, direction: 'asc' };
        }
        onSortChange?.(sort);
        notify();
        break;
      }
      case 'CLEAR_SORT': {
        if (!sort) return;
        sort = null;
        onSortChange?.(null);
        notify();
        break;
      }
      case 'TOGGLE_EXPAND': {
        const next = new Set(expandedIds);
        if (next.has(event.rowId)) {
          next.delete(event.rowId);
        } else {
          next.add(event.rowId);
        }
        expandedIds = next;
        onExpandChange?.(Array.from(expandedIds));
        notify();
        break;
      }
      case 'EXPAND': {
        if (expandedIds.has(event.rowId)) return;
        expandedIds = new Set(expandedIds);
        expandedIds.add(event.rowId);
        onExpandChange?.(Array.from(expandedIds));
        notify();
        break;
      }
      case 'COLLAPSE': {
        if (!expandedIds.has(event.rowId)) return;
        expandedIds = new Set(expandedIds);
        expandedIds.delete(event.rowId);
        onExpandChange?.(Array.from(expandedIds));
        notify();
        break;
      }
      case 'EXPAND_ALL': {
        expandedIds = new Set(event.rowIds);
        onExpandChange?.(Array.from(expandedIds));
        notify();
        break;
      }
      case 'COLLAPSE_ALL': {
        if (expandedIds.size === 0) return;
        expandedIds = new Set();
        onExpandChange?.([]);
        notify();
        break;
      }
      case 'SELECT_ROW': {
        if (selectionMode === 'none') return;
        if (selectionMode === 'single') {
          selectedIds = new Set([event.rowId]);
        } else {
          selectedIds = new Set(selectedIds);
          selectedIds.add(event.rowId);
        }
        onSelectionChange?.(Array.from(selectedIds));
        notify();
        break;
      }
      case 'TOGGLE_ROW': {
        if (selectionMode === 'none') return;
        selectedIds = new Set(selectedIds);
        if (selectedIds.has(event.rowId)) {
          selectedIds.delete(event.rowId);
        } else {
          if (selectionMode === 'single') {
            selectedIds = new Set([event.rowId]);
          } else {
            selectedIds.add(event.rowId);
          }
        }
        onSelectionChange?.(Array.from(selectedIds));
        notify();
        break;
      }
      case 'DESELECT_ALL': {
        if (selectedIds.size === 0) return;
        selectedIds = new Set();
        onSelectionChange?.([]);
        notify();
        break;
      }
    }
  }

  function subscribe(fn: () => void): () => void {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }

  function destroy(): void {
    listeners.clear();
  }

  return { getContext, send, subscribe, destroy };
}
