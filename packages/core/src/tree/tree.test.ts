/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createTree } from './tree.machine';

describe('createTree', () => {
  // ── Initial state ──

  it('baslangic context bos setler', () => {
    const api = createTree();
    const ctx = api.getContext();
    expect(ctx.expandedIds.size).toBe(0);
    expect(ctx.selectedIds.size).toBe(0);
    expect(ctx.checkedIds.size).toBe(0);
  });

  it('defaultExpanded uygulanir', () => {
    const api = createTree({ defaultExpanded: ['a', 'b'] });
    expect(api.getContext().expandedIds.has('a')).toBe(true);
    expect(api.getContext().expandedIds.has('b')).toBe(true);
  });

  it('defaultSelected uygulanir', () => {
    const api = createTree({ defaultSelected: ['x'] });
    expect(api.getContext().selectedIds.has('x')).toBe(true);
  });

  it('defaultChecked uygulanir', () => {
    const api = createTree({ defaultChecked: ['c'], checkable: true });
    expect(api.getContext().checkedIds.has('c')).toBe(true);
  });

  // ── Expand / Collapse ──

  it('TOGGLE_EXPAND acik olmayan dugumu acar', () => {
    const api = createTree();
    api.send({ type: 'TOGGLE_EXPAND', nodeId: 'n1' });
    expect(api.getContext().expandedIds.has('n1')).toBe(true);
  });

  it('TOGGLE_EXPAND acik dugumu kapatir', () => {
    const api = createTree({ defaultExpanded: ['n1'] });
    api.send({ type: 'TOGGLE_EXPAND', nodeId: 'n1' });
    expect(api.getContext().expandedIds.has('n1')).toBe(false);
  });

  it('EXPAND dugumu acar', () => {
    const api = createTree();
    api.send({ type: 'EXPAND', nodeId: 'n2' });
    expect(api.getContext().expandedIds.has('n2')).toBe(true);
  });

  it('EXPAND zaten acik dugum icin notify olmaz', () => {
    const api = createTree({ defaultExpanded: ['n1'] });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'EXPAND', nodeId: 'n1' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('COLLAPSE dugumu kapatir', () => {
    const api = createTree({ defaultExpanded: ['n1'] });
    api.send({ type: 'COLLAPSE', nodeId: 'n1' });
    expect(api.getContext().expandedIds.has('n1')).toBe(false);
  });

  it('COLLAPSE zaten kapali dugum icin notify olmaz', () => {
    const api = createTree();
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'COLLAPSE', nodeId: 'n1' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('EXPAND_ALL tum dugumleri acar', () => {
    const api = createTree();
    api.send({ type: 'EXPAND_ALL', nodeIds: ['a', 'b', 'c'] });
    const ctx = api.getContext();
    expect(ctx.expandedIds.has('a')).toBe(true);
    expect(ctx.expandedIds.has('b')).toBe(true);
    expect(ctx.expandedIds.has('c')).toBe(true);
  });

  it('COLLAPSE_ALL tum dugumleri kapatir', () => {
    const api = createTree({ defaultExpanded: ['a', 'b'] });
    api.send({ type: 'COLLAPSE_ALL' });
    expect(api.getContext().expandedIds.size).toBe(0);
  });

  it('COLLAPSE_ALL bos iken notify olmaz', () => {
    const api = createTree();
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'COLLAPSE_ALL' });
    expect(fn).not.toHaveBeenCalled();
  });

  // ── Selection ──

  it('SELECT single modda dugum secer', () => {
    const api = createTree({ selectionMode: 'single' });
    api.send({ type: 'SELECT', nodeId: 'n1' });
    expect(api.getContext().selectedIds.has('n1')).toBe(true);
  });

  it('SELECT single modda onceki secimi kaldirir', () => {
    const api = createTree({ selectionMode: 'single' });
    api.send({ type: 'SELECT', nodeId: 'n1' });
    api.send({ type: 'SELECT', nodeId: 'n2' });
    expect(api.getContext().selectedIds.has('n1')).toBe(false);
    expect(api.getContext().selectedIds.has('n2')).toBe(true);
  });

  it('SELECT multiple modda birden fazla secer', () => {
    const api = createTree({ selectionMode: 'multiple' });
    api.send({ type: 'SELECT', nodeId: 'n1' });
    api.send({ type: 'SELECT', nodeId: 'n2' });
    expect(api.getContext().selectedIds.has('n1')).toBe(true);
    expect(api.getContext().selectedIds.has('n2')).toBe(true);
  });

  it('SELECT none modda ise islem yapmaz', () => {
    const api = createTree({ selectionMode: 'none' });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'SELECT', nodeId: 'n1' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('DESELECT secimi kaldirir', () => {
    const api = createTree({ selectionMode: 'single', defaultSelected: ['n1'] });
    api.send({ type: 'DESELECT', nodeId: 'n1' });
    expect(api.getContext().selectedIds.has('n1')).toBe(false);
  });

  // ── Check ──

  it('CHECK dugumu isaretler', () => {
    const api = createTree({ checkable: true });
    api.send({ type: 'CHECK', nodeId: 'n1', allDescendants: [] });
    expect(api.getContext().checkedIds.has('n1')).toBe(true);
  });

  it('CHECK alt dugumleri de isaretler', () => {
    const api = createTree({ checkable: true });
    api.send({ type: 'CHECK', nodeId: 'parent', allDescendants: ['child1', 'child2'] });
    const ctx = api.getContext();
    expect(ctx.checkedIds.has('parent')).toBe(true);
    expect(ctx.checkedIds.has('child1')).toBe(true);
    expect(ctx.checkedIds.has('child2')).toBe(true);
  });

  it('UNCHECK isareti kaldirir', () => {
    const api = createTree({ checkable: true, defaultChecked: ['n1'] });
    api.send({ type: 'UNCHECK', nodeId: 'n1', allDescendants: [] });
    expect(api.getContext().checkedIds.has('n1')).toBe(false);
  });

  it('UNCHECK alt dugumlerden de isareti kaldirir', () => {
    const api = createTree({ checkable: true, defaultChecked: ['parent', 'c1', 'c2'] });
    api.send({ type: 'UNCHECK', nodeId: 'parent', allDescendants: ['c1', 'c2'] });
    expect(api.getContext().checkedIds.size).toBe(0);
  });

  it('CHECK checkable false ise islem yapmaz', () => {
    const api = createTree({ checkable: false });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'CHECK', nodeId: 'n1', allDescendants: [] });
    expect(fn).not.toHaveBeenCalled();
  });

  // ── Callbacks ──

  it('onExpandChange cagirilir', () => {
    const onExpandChange = vi.fn();
    const api = createTree({ onExpandChange });
    api.send({ type: 'TOGGLE_EXPAND', nodeId: 'n1' });
    expect(onExpandChange).toHaveBeenCalledWith(['n1']);
  });

  it('onSelectChange cagirilir', () => {
    const onSelectChange = vi.fn();
    const api = createTree({ selectionMode: 'single', onSelectChange });
    api.send({ type: 'SELECT', nodeId: 'n1' });
    expect(onSelectChange).toHaveBeenCalledWith(['n1']);
  });

  it('onCheckChange cagirilir', () => {
    const onCheckChange = vi.fn();
    const api = createTree({ checkable: true, onCheckChange });
    api.send({ type: 'CHECK', nodeId: 'n1', allDescendants: [] });
    expect(onCheckChange).toHaveBeenCalledWith(['n1']);
  });

  // ── Tristate (indeterminate) ──

  const treeMap = {
    parentToChildren: new Map([
      ['parent', ['c1', 'c2', 'c3']],
    ]),
    childToParent: new Map([
      ['c1', 'parent'],
      ['c2', 'parent'],
      ['c3', 'parent'],
    ]),
  };

  it('tum children check edilince parent checked olur', () => {
    const api = createTree({ checkable: true });
    api.send({ type: 'SET_TREE_MAP', map: treeMap });
    api.send({ type: 'CHECK', nodeId: 'c1', allDescendants: [] });
    api.send({ type: 'CHECK', nodeId: 'c2', allDescendants: [] });
    api.send({ type: 'CHECK', nodeId: 'c3', allDescendants: [] });
    const ctx = api.getContext();
    expect(ctx.checkedIds.has('parent')).toBe(true);
    expect(ctx.indeterminateIds.has('parent')).toBe(false);
  });

  it('bazi children check edilince parent indeterminate olur', () => {
    const api = createTree({ checkable: true });
    api.send({ type: 'SET_TREE_MAP', map: treeMap });
    api.send({ type: 'CHECK', nodeId: 'c1', allDescendants: [] });
    const ctx = api.getContext();
    expect(ctx.checkedIds.has('parent')).toBe(false);
    expect(ctx.indeterminateIds.has('parent')).toBe(true);
  });

  it('hic child check edilmezse parent ne checked ne indeterminate', () => {
    const api = createTree({ checkable: true });
    api.send({ type: 'SET_TREE_MAP', map: treeMap });
    const ctx = api.getContext();
    expect(ctx.checkedIds.has('parent')).toBe(false);
    expect(ctx.indeterminateIds.has('parent')).toBe(false);
  });

  it('parent check edilince tum children checked olur', () => {
    const api = createTree({ checkable: true });
    api.send({ type: 'SET_TREE_MAP', map: treeMap });
    api.send({ type: 'CHECK', nodeId: 'parent', allDescendants: ['c1', 'c2', 'c3'] });
    const ctx = api.getContext();
    expect(ctx.checkedIds.has('c1')).toBe(true);
    expect(ctx.checkedIds.has('c2')).toBe(true);
    expect(ctx.checkedIds.has('c3')).toBe(true);
    expect(ctx.checkedIds.has('parent')).toBe(true);
  });

  it('child uncheck edilince parent indeterminate olur', () => {
    const api = createTree({ checkable: true });
    api.send({ type: 'SET_TREE_MAP', map: treeMap });
    api.send({ type: 'CHECK', nodeId: 'parent', allDescendants: ['c1', 'c2', 'c3'] });
    api.send({ type: 'UNCHECK', nodeId: 'c1', allDescendants: [] });
    const ctx = api.getContext();
    expect(ctx.checkedIds.has('parent')).toBe(false);
    expect(ctx.indeterminateIds.has('parent')).toBe(true);
  });

  it('tum children uncheck edilince parent temiz olur', () => {
    const api = createTree({ checkable: true });
    api.send({ type: 'SET_TREE_MAP', map: treeMap });
    api.send({ type: 'CHECK', nodeId: 'c1', allDescendants: [] });
    api.send({ type: 'UNCHECK', nodeId: 'c1', allDescendants: [] });
    const ctx = api.getContext();
    expect(ctx.checkedIds.has('parent')).toBe(false);
    expect(ctx.indeterminateIds.has('parent')).toBe(false);
  });

  // ── Subscribe / Destroy ──

  it('subscribe ve unsubscribe calisir', () => {
    const api = createTree();
    const fn = vi.fn();
    const unsub = api.subscribe(fn);
    api.send({ type: 'TOGGLE_EXPAND', nodeId: 'n1' });
    expect(fn).toHaveBeenCalledTimes(1);
    unsub();
    api.send({ type: 'TOGGLE_EXPAND', nodeId: 'n2' });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('destroy tum listener lari temizler', () => {
    const api = createTree();
    const fn = vi.fn();
    api.subscribe(fn);
    api.destroy();
    api.send({ type: 'TOGGLE_EXPAND', nodeId: 'n1' });
    expect(fn).not.toHaveBeenCalled();
  });
});
