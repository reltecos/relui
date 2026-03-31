/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createTreeGrid } from './tree-grid.machine';
import type { TreeGridColumnDef } from './tree-grid.types';

const cols: TreeGridColumnDef[] = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'size', title: 'Size', sortable: true, align: 'right' },
  { key: 'type', title: 'Type' },
];

describe('createTreeGrid', () => {
  // ── Initial state ──

  it('baslangic context dogru', () => {
    const api = createTreeGrid({ columns: cols });
    const ctx = api.getContext();
    expect(ctx.sort).toBeNull();
    expect(ctx.expandedIds.size).toBe(0);
    expect(ctx.selectedIds.size).toBe(0);
  });

  it('defaultExpanded uygulanir', () => {
    const api = createTreeGrid({ columns: cols, defaultExpanded: ['r1', 'r2'] });
    expect(api.getContext().expandedIds.has('r1')).toBe(true);
    expect(api.getContext().expandedIds.has('r2')).toBe(true);
  });

  // ── Sort ──

  it('SORT asc ile baslar', () => {
    const api = createTreeGrid({ columns: cols });
    api.send({ type: 'SORT', columnKey: 'name' });
    expect(api.getContext().sort).toEqual({ columnKey: 'name', direction: 'asc' });
  });

  it('SORT ikinci kez desc olur', () => {
    const api = createTreeGrid({ columns: cols });
    api.send({ type: 'SORT', columnKey: 'name' });
    api.send({ type: 'SORT', columnKey: 'name' });
    expect(api.getContext().sort).toEqual({ columnKey: 'name', direction: 'desc' });
  });

  it('SORT ucuncu kez null olur', () => {
    const api = createTreeGrid({ columns: cols });
    api.send({ type: 'SORT', columnKey: 'name' });
    api.send({ type: 'SORT', columnKey: 'name' });
    api.send({ type: 'SORT', columnKey: 'name' });
    expect(api.getContext().sort).toBeNull();
  });

  it('SORT sortable olmayan sutun icin islem yapmaz', () => {
    const api = createTreeGrid({ columns: cols });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'SORT', columnKey: 'type' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('SORT farkli sutun yeni sort baslatir', () => {
    const api = createTreeGrid({ columns: cols });
    api.send({ type: 'SORT', columnKey: 'name' });
    api.send({ type: 'SORT', columnKey: 'size' });
    expect(api.getContext().sort).toEqual({ columnKey: 'size', direction: 'asc' });
  });

  it('CLEAR_SORT siralama temizler', () => {
    const api = createTreeGrid({ columns: cols });
    api.send({ type: 'SORT', columnKey: 'name' });
    api.send({ type: 'CLEAR_SORT' });
    expect(api.getContext().sort).toBeNull();
  });

  it('onSortChange cagirilir', () => {
    const onSortChange = vi.fn();
    const api = createTreeGrid({ columns: cols, onSortChange });
    api.send({ type: 'SORT', columnKey: 'name' });
    expect(onSortChange).toHaveBeenCalledWith({ columnKey: 'name', direction: 'asc' });
  });

  // ── Expand/Collapse ──

  it('TOGGLE_EXPAND satiri acar', () => {
    const api = createTreeGrid({ columns: cols });
    api.send({ type: 'TOGGLE_EXPAND', rowId: 'r1' });
    expect(api.getContext().expandedIds.has('r1')).toBe(true);
  });

  it('TOGGLE_EXPAND acik satiri kapatir', () => {
    const api = createTreeGrid({ columns: cols, defaultExpanded: ['r1'] });
    api.send({ type: 'TOGGLE_EXPAND', rowId: 'r1' });
    expect(api.getContext().expandedIds.has('r1')).toBe(false);
  });

  it('EXPAND satiri acar', () => {
    const api = createTreeGrid({ columns: cols });
    api.send({ type: 'EXPAND', rowId: 'r1' });
    expect(api.getContext().expandedIds.has('r1')).toBe(true);
  });

  it('COLLAPSE satiri kapatir', () => {
    const api = createTreeGrid({ columns: cols, defaultExpanded: ['r1'] });
    api.send({ type: 'COLLAPSE', rowId: 'r1' });
    expect(api.getContext().expandedIds.has('r1')).toBe(false);
  });

  it('EXPAND_ALL tum satirlari acar', () => {
    const api = createTreeGrid({ columns: cols });
    api.send({ type: 'EXPAND_ALL', rowIds: ['r1', 'r2', 'r3'] });
    expect(api.getContext().expandedIds.size).toBe(3);
  });

  it('COLLAPSE_ALL tum satirlari kapatir', () => {
    const api = createTreeGrid({ columns: cols, defaultExpanded: ['r1', 'r2'] });
    api.send({ type: 'COLLAPSE_ALL' });
    expect(api.getContext().expandedIds.size).toBe(0);
  });

  it('onExpandChange cagirilir', () => {
    const onExpandChange = vi.fn();
    const api = createTreeGrid({ columns: cols, onExpandChange });
    api.send({ type: 'TOGGLE_EXPAND', rowId: 'r1' });
    expect(onExpandChange).toHaveBeenCalledWith(['r1']);
  });

  // ── Selection ──

  it('SELECT_ROW single modda satir secer', () => {
    const api = createTreeGrid({ columns: cols, selectionMode: 'single' });
    api.send({ type: 'SELECT_ROW', rowId: 'r1' });
    expect(api.getContext().selectedIds.has('r1')).toBe(true);
  });

  it('SELECT_ROW single modda onceki secimi kaldirir', () => {
    const api = createTreeGrid({ columns: cols, selectionMode: 'single' });
    api.send({ type: 'SELECT_ROW', rowId: 'r1' });
    api.send({ type: 'SELECT_ROW', rowId: 'r2' });
    expect(api.getContext().selectedIds.has('r1')).toBe(false);
    expect(api.getContext().selectedIds.has('r2')).toBe(true);
  });

  it('SELECT_ROW multiple modda birden fazla satir secer', () => {
    const api = createTreeGrid({ columns: cols, selectionMode: 'multiple' });
    api.send({ type: 'SELECT_ROW', rowId: 'r1' });
    api.send({ type: 'SELECT_ROW', rowId: 'r2' });
    expect(api.getContext().selectedIds.size).toBe(2);
  });

  it('SELECT_ROW none modda islem yapmaz', () => {
    const api = createTreeGrid({ columns: cols, selectionMode: 'none' });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'SELECT_ROW', rowId: 'r1' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('TOGGLE_ROW toggle calisir', () => {
    const api = createTreeGrid({ columns: cols, selectionMode: 'multiple' });
    api.send({ type: 'TOGGLE_ROW', rowId: 'r1' });
    expect(api.getContext().selectedIds.has('r1')).toBe(true);
    api.send({ type: 'TOGGLE_ROW', rowId: 'r1' });
    expect(api.getContext().selectedIds.has('r1')).toBe(false);
  });

  it('DESELECT_ALL secimi temizler', () => {
    const api = createTreeGrid({ columns: cols, selectionMode: 'multiple' });
    api.send({ type: 'SELECT_ROW', rowId: 'r1' });
    api.send({ type: 'DESELECT_ALL' });
    expect(api.getContext().selectedIds.size).toBe(0);
  });

  it('onSelectionChange cagirilir', () => {
    const onSelectionChange = vi.fn();
    const api = createTreeGrid({ columns: cols, selectionMode: 'single', onSelectionChange });
    api.send({ type: 'SELECT_ROW', rowId: 'r1' });
    expect(onSelectionChange).toHaveBeenCalledWith(['r1']);
  });

  // ── Subscribe/Destroy ──

  it('subscribe ve unsubscribe calisir', () => {
    const api = createTreeGrid({ columns: cols });
    const fn = vi.fn();
    const unsub = api.subscribe(fn);
    api.send({ type: 'SORT', columnKey: 'name' });
    expect(fn).toHaveBeenCalledTimes(1);
    unsub();
    api.send({ type: 'SORT', columnKey: 'name' });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('destroy tum listener lari temizler', () => {
    const api = createTreeGrid({ columns: cols });
    const fn = vi.fn();
    api.subscribe(fn);
    api.destroy();
    api.send({ type: 'SORT', columnKey: 'name' });
    expect(fn).not.toHaveBeenCalled();
  });
});
