/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createAccordion } from './accordion.machine';

describe('createAccordion', () => {
  // ── Baslangic durumu ──

  it('varsayilan olarak hepsi kapali baslar', () => {
    const api = createAccordion();
    expect(api.getContext().expandedIds.size).toBe(0);
  });

  it('defaultExpanded ile acik baslar', () => {
    const api = createAccordion({ defaultExpanded: ['a', 'b'] });
    const ctx = api.getContext();
    expect(ctx.expandedIds.has('a')).toBe(true);
    expect(ctx.expandedIds.has('b')).toBe(true);
    expect(ctx.expandedIds.size).toBe(2);
  });

  // ── TOGGLE (single mode) ──

  it('TOGGLE kapali itemi acar', () => {
    const api = createAccordion();
    api.send({ type: 'TOGGLE', itemId: 'a' });
    expect(api.getContext().expandedIds.has('a')).toBe(true);
  });

  it('TOGGLE acik itemi kapatir', () => {
    const api = createAccordion({ defaultExpanded: ['a'] });
    api.send({ type: 'TOGGLE', itemId: 'a' });
    expect(api.getContext().expandedIds.has('a')).toBe(false);
  });

  it('single modda TOGGLE baska itemi acinca oncekini kapatir', () => {
    const api = createAccordion({ defaultExpanded: ['a'] });
    api.send({ type: 'TOGGLE', itemId: 'b' });
    expect(api.getContext().expandedIds.has('a')).toBe(false);
    expect(api.getContext().expandedIds.has('b')).toBe(true);
  });

  // ── TOGGLE (multiple mode) ──

  it('multiple modda TOGGLE birden fazla item acar', () => {
    const api = createAccordion({ allowMultiple: true });
    api.send({ type: 'TOGGLE', itemId: 'a' });
    api.send({ type: 'TOGGLE', itemId: 'b' });
    expect(api.getContext().expandedIds.has('a')).toBe(true);
    expect(api.getContext().expandedIds.has('b')).toBe(true);
    expect(api.getContext().expandedIds.size).toBe(2);
  });

  it('multiple modda TOGGLE acik itemi kapatir digerleri kalir', () => {
    const api = createAccordion({ allowMultiple: true, defaultExpanded: ['a', 'b'] });
    api.send({ type: 'TOGGLE', itemId: 'a' });
    expect(api.getContext().expandedIds.has('a')).toBe(false);
    expect(api.getContext().expandedIds.has('b')).toBe(true);
  });

  // ── EXPAND ──

  it('EXPAND kapali itemi acar', () => {
    const api = createAccordion();
    api.send({ type: 'EXPAND', itemId: 'a' });
    expect(api.getContext().expandedIds.has('a')).toBe(true);
  });

  it('EXPAND zaten acik item icin no-op', () => {
    const onChange = vi.fn();
    const api = createAccordion({ defaultExpanded: ['a'], onExpandChange: onChange });
    api.send({ type: 'EXPAND', itemId: 'a' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('single modda EXPAND onceki acik itemi kapatir', () => {
    const api = createAccordion({ defaultExpanded: ['a'] });
    api.send({ type: 'EXPAND', itemId: 'b' });
    expect(api.getContext().expandedIds.has('a')).toBe(false);
    expect(api.getContext().expandedIds.has('b')).toBe(true);
  });

  it('multiple modda EXPAND mevcut aciklari korur', () => {
    const api = createAccordion({ allowMultiple: true, defaultExpanded: ['a'] });
    api.send({ type: 'EXPAND', itemId: 'b' });
    expect(api.getContext().expandedIds.has('a')).toBe(true);
    expect(api.getContext().expandedIds.has('b')).toBe(true);
  });

  // ── COLLAPSE ──

  it('COLLAPSE acik itemi kapatir', () => {
    const api = createAccordion({ defaultExpanded: ['a'] });
    api.send({ type: 'COLLAPSE', itemId: 'a' });
    expect(api.getContext().expandedIds.has('a')).toBe(false);
  });

  it('COLLAPSE zaten kapali item icin no-op', () => {
    const onChange = vi.fn();
    const api = createAccordion({ onExpandChange: onChange });
    api.send({ type: 'COLLAPSE', itemId: 'a' });
    expect(onChange).not.toHaveBeenCalled();
  });

  // ── EXPAND_ALL ──

  it('multiple modda EXPAND_ALL tum verilen itemleri acar', () => {
    const api = createAccordion({ allowMultiple: true });
    api.send({ type: 'EXPAND_ALL', itemIds: ['a', 'b', 'c'] });
    const ctx = api.getContext();
    expect(ctx.expandedIds.has('a')).toBe(true);
    expect(ctx.expandedIds.has('b')).toBe(true);
    expect(ctx.expandedIds.has('c')).toBe(true);
  });

  it('single modda EXPAND_ALL no-op', () => {
    const onChange = vi.fn();
    const api = createAccordion({ onExpandChange: onChange });
    api.send({ type: 'EXPAND_ALL', itemIds: ['a', 'b'] });
    expect(onChange).not.toHaveBeenCalled();
    expect(api.getContext().expandedIds.size).toBe(0);
  });

  it('EXPAND_ALL zaten hepsi acikken no-op', () => {
    const onChange = vi.fn();
    const api = createAccordion({
      allowMultiple: true,
      defaultExpanded: ['a', 'b'],
      onExpandChange: onChange,
    });
    api.send({ type: 'EXPAND_ALL', itemIds: ['a', 'b'] });
    expect(onChange).not.toHaveBeenCalled();
  });

  // ── COLLAPSE_ALL ──

  it('COLLAPSE_ALL tum acik itemleri kapatir', () => {
    const api = createAccordion({ allowMultiple: true, defaultExpanded: ['a', 'b', 'c'] });
    api.send({ type: 'COLLAPSE_ALL' });
    expect(api.getContext().expandedIds.size).toBe(0);
  });

  it('COLLAPSE_ALL hepsi kapali iken no-op', () => {
    const onChange = vi.fn();
    const api = createAccordion({ onExpandChange: onChange });
    api.send({ type: 'COLLAPSE_ALL' });
    expect(onChange).not.toHaveBeenCalled();
  });

  // ── onExpandChange ──

  it('TOGGLE sonrasi onExpandChange cagirilir', () => {
    const onChange = vi.fn();
    const api = createAccordion({ onExpandChange: onChange });
    api.send({ type: 'TOGGLE', itemId: 'a' });
    expect(onChange).toHaveBeenCalledWith(['a']);
  });

  it('TOGGLE kapatinca onExpandChange bos array ile cagirilir', () => {
    const onChange = vi.fn();
    const api = createAccordion({ defaultExpanded: ['a'], onExpandChange: onChange });
    api.send({ type: 'TOGGLE', itemId: 'a' });
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('COLLAPSE_ALL sonrasi onExpandChange bos array ile cagirilir', () => {
    const onChange = vi.fn();
    const api = createAccordion({
      allowMultiple: true,
      defaultExpanded: ['a', 'b'],
      onExpandChange: onChange,
    });
    api.send({ type: 'COLLAPSE_ALL' });
    expect(onChange).toHaveBeenCalledWith([]);
  });

  // ── Subscribe ──

  it('subscribe ile degisiklikler dinlenir', () => {
    const api = createAccordion();
    const listener = vi.fn();
    api.subscribe(listener);

    api.send({ type: 'TOGGLE', itemId: 'a' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe sonrasi listener cagirilmaz', () => {
    const api = createAccordion();
    const listener = vi.fn();
    const unsub = api.subscribe(listener);

    unsub();
    api.send({ type: 'TOGGLE', itemId: 'a' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('no-op durumlarinda listener cagirilmaz', () => {
    const api = createAccordion();
    const listener = vi.fn();
    api.subscribe(listener);

    api.send({ type: 'COLLAPSE', itemId: 'a' }); // zaten kapali
    expect(listener).not.toHaveBeenCalled();
  });

  it('birden fazla subscriber desteklenir', () => {
    const api = createAccordion();
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    api.subscribe(listener1);
    api.subscribe(listener2);

    api.send({ type: 'TOGGLE', itemId: 'a' });
    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
  });
});
