/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createDataGrid } from './data-grid.machine';
import type { DataGridConfig, ColumnDef } from './data-grid.types';

const cols: ColumnDef[] = [
  { key: 'id', title: 'ID', sortable: true, filterable: true, width: 60 },
  { key: 'name', title: 'Name', sortable: true, filterable: true, resizable: true, editable: true },
  { key: 'age', title: 'Age', sortable: true },
  { key: 'hidden', title: 'Hidden', visible: false },
  { key: 'pinned', title: 'Pinned', pinned: 'left' },
];

function make(overrides: Partial<DataGridConfig> = {}) {
  return createDataGrid({ columns: cols, ...overrides });
}

describe('createDataGrid', () => {
  // ── Initial state ──

  it('baslangic state dogru', () => {
    const api = make();
    const ctx = api.getContext();
    expect(ctx.sort).toEqual([]);
    expect(ctx.filters).toEqual([]);
    expect(ctx.selectedIds.size).toBe(0);
    expect(ctx.expandedIds.size).toBe(0);
    expect(ctx.page).toBe(0);
    expect(ctx.pageSize).toBe(50);
    expect(ctx.editingCell).toBeNull();
  });

  it('column order baslangicta key sirasinda', () => {
    const api = make();
    expect(api.getContext().columnOrder).toEqual(['id', 'name', 'age', 'hidden', 'pinned']);
  });

  it('column width baslangic degerinden okunur', () => {
    const api = make();
    expect(api.getContext().columnWidths.get('id')).toBe(60);
  });

  it('hidden column baslangicta set edilir', () => {
    const api = make();
    expect(api.getContext().hiddenColumns.has('hidden')).toBe(true);
  });

  it('pinned column baslangicta set edilir', () => {
    const api = make();
    expect(api.getContext().pinnedColumns.get('pinned')).toBe('left');
  });

  // ── Sort ──

  it('SORT asc siralama yapar', () => {
    const api = make();
    api.send({ type: 'SORT', columnKey: 'name' });
    expect(api.getContext().sort).toEqual([{ columnKey: 'name', direction: 'asc' }]);
  });

  it('SORT iki kez desc yapar', () => {
    const api = make();
    api.send({ type: 'SORT', columnKey: 'name' });
    api.send({ type: 'SORT', columnKey: 'name' });
    expect(api.getContext().sort).toEqual([{ columnKey: 'name', direction: 'desc' }]);
  });

  it('SORT uc kez siralamayi kaldirir', () => {
    const api = make();
    api.send({ type: 'SORT', columnKey: 'name' });
    api.send({ type: 'SORT', columnKey: 'name' });
    api.send({ type: 'SORT', columnKey: 'name' });
    expect(api.getContext().sort).toEqual([]);
  });

  it('sortable olmayan sutun siralanmaz', () => {
    const api = make();
    api.send({ type: 'SORT', columnKey: 'hidden' });
    expect(api.getContext().sort).toEqual([]);
  });

  it('multiSort ile birden fazla sutun siralanir', () => {
    const api = make({ multiSort: true });
    api.send({ type: 'SORT', columnKey: 'name' });
    api.send({ type: 'SORT', columnKey: 'age' });
    expect(api.getContext().sort).toHaveLength(2);
  });

  it('CLEAR_SORT siralamayi temizler', () => {
    const api = make();
    api.send({ type: 'SORT', columnKey: 'name' });
    api.send({ type: 'CLEAR_SORT' });
    expect(api.getContext().sort).toEqual([]);
  });

  it('onSortChange callback cagrilir', () => {
    const onSortChange = vi.fn();
    const api = make({ onSortChange });
    api.send({ type: 'SORT', columnKey: 'name' });
    expect(onSortChange).toHaveBeenCalledWith([{ columnKey: 'name', direction: 'asc' }]);
  });

  // ── Filter ──

  it('SET_FILTER filtre ekler', () => {
    const api = make();
    api.send({ type: 'SET_FILTER', columnKey: 'name', value: 'Ali', operator: 'contains' });
    expect(api.getContext().filters).toEqual([
      { columnKey: 'name', value: 'Ali', operator: 'contains' },
    ]);
  });

  it('SET_FILTER bos value ile filtre kaldirir', () => {
    const api = make();
    api.send({ type: 'SET_FILTER', columnKey: 'name', value: 'Ali', operator: 'contains' });
    api.send({ type: 'SET_FILTER', columnKey: 'name', value: '', operator: 'contains' });
    expect(api.getContext().filters).toEqual([]);
  });

  it('CLEAR_FILTER tek filtre kaldirir', () => {
    const api = make();
    api.send({ type: 'SET_FILTER', columnKey: 'name', value: 'Ali', operator: 'contains' });
    api.send({ type: 'CLEAR_FILTER', columnKey: 'name' });
    expect(api.getContext().filters).toEqual([]);
  });

  it('CLEAR_ALL_FILTERS tum filtreleri temizler', () => {
    const api = make();
    api.send({ type: 'SET_FILTER', columnKey: 'name', value: 'A', operator: 'contains' });
    api.send({ type: 'SET_FILTER', columnKey: 'id', value: '1', operator: 'equals' });
    api.send({ type: 'CLEAR_ALL_FILTERS' });
    expect(api.getContext().filters).toEqual([]);
  });

  it('filtre eklendikten sonra page sifirlenir', () => {
    const api = make();
    api.send({ type: 'SET_PAGE', page: 3 });
    api.send({ type: 'SET_FILTER', columnKey: 'name', value: 'A', operator: 'contains' });
    expect(api.getContext().page).toBe(0);
  });

  // ── Selection ──

  it('selectionMode none ise secim yapilmaz', () => {
    const api = make({ selectionMode: 'none' });
    api.send({ type: 'SELECT_ROW', rowId: 'r1' });
    expect(api.getContext().selectedIds.size).toBe(0);
  });

  it('single mode ile bir satir secilir', () => {
    const api = make({ selectionMode: 'single' });
    api.send({ type: 'SELECT_ROW', rowId: 'r1' });
    expect(api.getContext().selectedIds.has('r1')).toBe(true);
  });

  it('single mode ile ikinci secim birincisini kaldirir', () => {
    const api = make({ selectionMode: 'single' });
    api.send({ type: 'SELECT_ROW', rowId: 'r1' });
    api.send({ type: 'SELECT_ROW', rowId: 'r2' });
    expect(api.getContext().selectedIds.has('r1')).toBe(false);
    expect(api.getContext().selectedIds.has('r2')).toBe(true);
  });

  it('multiple mode ile birden fazla satir secilir', () => {
    const api = make({ selectionMode: 'multiple' });
    api.send({ type: 'SELECT_ROW', rowId: 'r1' });
    api.send({ type: 'SELECT_ROW', rowId: 'r2' });
    expect(api.getContext().selectedIds.size).toBe(2);
  });

  it('TOGGLE_ROW secim toggle yapar', () => {
    const api = make({ selectionMode: 'multiple' });
    api.send({ type: 'TOGGLE_ROW', rowId: 'r1' });
    expect(api.getContext().selectedIds.has('r1')).toBe(true);
    api.send({ type: 'TOGGLE_ROW', rowId: 'r1' });
    expect(api.getContext().selectedIds.has('r1')).toBe(false);
  });

  it('SELECT_ALL tum satirlari secer', () => {
    const api = make({ selectionMode: 'multiple' });
    api.send({ type: 'SELECT_ALL', rowIds: ['r1', 'r2', 'r3'] });
    expect(api.getContext().selectedIds.size).toBe(3);
  });

  it('SELECT_ALL single mode de calistirilmaz', () => {
    const api = make({ selectionMode: 'single' });
    api.send({ type: 'SELECT_ALL', rowIds: ['r1', 'r2'] });
    expect(api.getContext().selectedIds.size).toBe(0);
  });

  it('DESELECT_ALL secimi temizler', () => {
    const api = make({ selectionMode: 'multiple' });
    api.send({ type: 'SELECT_ALL', rowIds: ['r1', 'r2'] });
    api.send({ type: 'DESELECT_ALL' });
    expect(api.getContext().selectedIds.size).toBe(0);
  });

  it('onSelectionChange callback cagrilir', () => {
    const onSelectionChange = vi.fn();
    const api = make({ selectionMode: 'single', onSelectionChange });
    api.send({ type: 'SELECT_ROW', rowId: 'r1' });
    expect(onSelectionChange).toHaveBeenCalledWith(['r1']);
  });

  // ── Pagination ──

  it('SET_PAGE sayfayi degistirir', () => {
    const api = make();
    api.send({ type: 'SET_PAGE', page: 2 });
    expect(api.getContext().page).toBe(2);
  });

  it('negatif sayfa atanmaz', () => {
    const api = make();
    api.send({ type: 'SET_PAGE', page: -1 });
    expect(api.getContext().page).toBe(0);
  });

  it('SET_PAGE_SIZE sayfa boyutunu degistirir ve page sifirlanir', () => {
    const api = make();
    api.send({ type: 'SET_PAGE', page: 3 });
    api.send({ type: 'SET_PAGE_SIZE', pageSize: 25 });
    expect(api.getContext().pageSize).toBe(25);
    expect(api.getContext().page).toBe(0);
  });

  // ── Column operations ──

  it('TOGGLE_COLUMN_VISIBILITY sutun gizler', () => {
    const api = make();
    api.send({ type: 'TOGGLE_COLUMN_VISIBILITY', columnKey: 'age' });
    expect(api.getContext().hiddenColumns.has('age')).toBe(true);
  });

  it('TOGGLE_COLUMN_VISIBILITY gizli sutunu gosterir', () => {
    const api = make();
    api.send({ type: 'TOGGLE_COLUMN_VISIBILITY', columnKey: 'hidden' });
    expect(api.getContext().hiddenColumns.has('hidden')).toBe(false);
  });

  it('RESIZE_COLUMN genisligi degistirir', () => {
    const api = make();
    api.send({ type: 'RESIZE_COLUMN', columnKey: 'name', width: 200 });
    expect(api.getContext().columnWidths.get('name')).toBe(200);
  });

  it('RESIZE_COLUMN minWidth altina inmez', () => {
    const api = createDataGrid({
      columns: [{ key: 'a', title: 'A', minWidth: 80 }],
    });
    api.send({ type: 'RESIZE_COLUMN', columnKey: 'a', width: 50 });
    expect(api.getContext().columnWidths.get('a')).toBe(80);
  });

  it('REORDER_COLUMNS siralamayi degistirir', () => {
    const api = make();
    api.send({ type: 'REORDER_COLUMNS', columnOrder: ['age', 'name', 'id', 'hidden', 'pinned'] });
    expect(api.getContext().columnOrder[0]).toBe('age');
  });

  it('PIN_COLUMN sutunu sabitler', () => {
    const api = make();
    api.send({ type: 'PIN_COLUMN', columnKey: 'name', pin: 'right' });
    expect(api.getContext().pinnedColumns.get('name')).toBe('right');
  });

  it('PIN_COLUMN false ile sabitlemeyi kaldirir', () => {
    const api = make();
    api.send({ type: 'PIN_COLUMN', columnKey: 'pinned', pin: false });
    expect(api.getContext().pinnedColumns.has('pinned')).toBe(false);
  });

  // ── Row expansion ──

  it('TOGGLE_ROW_EXPANSION satiri genisletir', () => {
    const api = make();
    api.send({ type: 'TOGGLE_ROW_EXPANSION', rowId: 'r1' });
    expect(api.getContext().expandedIds.has('r1')).toBe(true);
  });

  it('TOGGLE_ROW_EXPANSION ikinci kez daraltir', () => {
    const api = make();
    api.send({ type: 'TOGGLE_ROW_EXPANSION', rowId: 'r1' });
    api.send({ type: 'TOGGLE_ROW_EXPANSION', rowId: 'r1' });
    expect(api.getContext().expandedIds.has('r1')).toBe(false);
  });

  it('COLLAPSE_ALL_ROWS tum satirlari daraltir', () => {
    const api = make();
    api.send({ type: 'EXPAND_ROW', rowId: 'r1' });
    api.send({ type: 'EXPAND_ROW', rowId: 'r2' });
    api.send({ type: 'COLLAPSE_ALL_ROWS' });
    expect(api.getContext().expandedIds.size).toBe(0);
  });

  // ── Editing ──

  it('START_EDIT duzenleme baslatir', () => {
    const api = make();
    api.send({ type: 'START_EDIT', rowId: 'r1', columnKey: 'name', value: 'Ali' });
    expect(api.getContext().editingCell).toEqual({ rowId: 'r1', columnKey: 'name', value: 'Ali' });
  });

  it('UPDATE_EDIT degeri gunceller', () => {
    const api = make();
    api.send({ type: 'START_EDIT', rowId: 'r1', columnKey: 'name', value: 'Ali' });
    api.send({ type: 'UPDATE_EDIT', value: 'Veli' });
    expect(api.getContext().editingCell?.value).toBe('Veli');
  });

  it('COMMIT_EDIT onEditCommit cagrilir ve editingCell null olur', () => {
    const onEditCommit = vi.fn();
    const api = make({ onEditCommit });
    api.send({ type: 'START_EDIT', rowId: 'r1', columnKey: 'name', value: 'Ali' });
    api.send({ type: 'COMMIT_EDIT' });
    expect(onEditCommit).toHaveBeenCalledWith('r1', 'name', 'Ali');
    expect(api.getContext().editingCell).toBeNull();
  });

  it('CANCEL_EDIT editingCell null olur', () => {
    const api = make();
    api.send({ type: 'START_EDIT', rowId: 'r1', columnKey: 'name', value: 'Ali' });
    api.send({ type: 'CANCEL_EDIT' });
    expect(api.getContext().editingCell).toBeNull();
  });

  // ── Subscribe ──

  it('subscribe ile degisiklik bildirimi alinir', () => {
    const api = make();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_PAGE', page: 1 });
    expect(listener).toHaveBeenCalledOnce();
  });

  it('unsubscribe sonrasi bildirim alinmaz', () => {
    const api = make();
    const listener = vi.fn();
    const unsub = api.subscribe(listener);
    unsub();
    api.send({ type: 'SET_PAGE', page: 1 });
    expect(listener).not.toHaveBeenCalled();
  });

  it('destroy tum listener lari temizler', () => {
    const api = make();
    const listener = vi.fn();
    api.subscribe(listener);
    api.destroy();
    api.send({ type: 'SET_PAGE', page: 1 });
    expect(listener).not.toHaveBeenCalled();
  });
});
