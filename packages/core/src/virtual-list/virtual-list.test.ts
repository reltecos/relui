/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createVirtualList } from './virtual-list.machine';

describe('createVirtualList', () => {
  const base = { totalCount: 1000, itemHeight: 40, containerHeight: 400, overscan: 5 };

  // ── Initial state ──

  it('baslangic context dogru', () => {
    const api = createVirtualList(base);
    const ctx = api.getContext();
    expect(ctx.scrollTop).toBe(0);
    expect(ctx.containerHeight).toBe(400);
    expect(ctx.totalCount).toBe(1000);
    expect(ctx.itemHeight).toBe(40);
    expect(ctx.overscan).toBe(5);
  });

  it('totalHeight hesaplanir', () => {
    const api = createVirtualList(base);
    expect(api.getContext().totalHeight).toBe(40000); // 1000 * 40
  });

  it('baslangic visible range dogru', () => {
    const api = createVirtualList(base);
    const { visibleRange } = api.getContext();
    expect(visibleRange.startIndex).toBe(0);
    // ceil(400/40) = 10, + overscan 5 = 15
    expect(visibleRange.endIndex).toBe(15);
  });

  // ── Scroll ──

  it('scroll ile visible range guncellenir', () => {
    const api = createVirtualList(base);
    api.send({ type: 'SCROLL', scrollTop: 200 });
    const { visibleRange } = api.getContext();
    // floor(200/40) = 5, - overscan = 0; end: 5+10+5 = 20
    expect(visibleRange.startIndex).toBe(0);
    expect(visibleRange.endIndex).toBe(20);
  });

  it('scroll orta kisim visible range', () => {
    const api = createVirtualList(base);
    api.send({ type: 'SCROLL', scrollTop: 2000 });
    const { visibleRange } = api.getContext();
    // floor(2000/40) = 50, - 5 = 45; end: 50+10+5 = 65
    expect(visibleRange.startIndex).toBe(45);
    expect(visibleRange.endIndex).toBe(65);
  });

  it('scroll sonuna yakin visible range clamp edilir', () => {
    const api = createVirtualList(base);
    api.send({ type: 'SCROLL', scrollTop: 39600 }); // max: 40000 - 400 = 39600
    const { visibleRange } = api.getContext();
    expect(visibleRange.endIndex).toBe(1000);
  });

  it('scroll negatif olursa 0 clamp edilir', () => {
    const api = createVirtualList(base);
    api.send({ type: 'SCROLL', scrollTop: -100 });
    expect(api.getContext().scrollTop).toBe(0);
  });

  it('ayni scrollTop tekrar gonderilince notify olmaz', () => {
    const api = createVirtualList(base);
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'SCROLL', scrollTop: 0 });
    expect(fn).not.toHaveBeenCalled();
  });

  // ── Resize ──

  it('resize ile containerHeight guncellenir', () => {
    const api = createVirtualList(base);
    api.send({ type: 'RESIZE', containerHeight: 800 });
    expect(api.getContext().containerHeight).toBe(800);
  });

  it('resize ile visible range degisir', () => {
    const api = createVirtualList(base);
    api.send({ type: 'RESIZE', containerHeight: 800 });
    const { visibleRange } = api.getContext();
    // ceil(800/40) = 20, + 5 = 25
    expect(visibleRange.endIndex).toBe(25);
  });

  it('ayni containerHeight tekrar gonderilince notify olmaz', () => {
    const api = createVirtualList(base);
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'RESIZE', containerHeight: 400 });
    expect(fn).not.toHaveBeenCalled();
  });

  // ── SET_TOTAL_COUNT ──

  it('totalCount guncellenir', () => {
    const api = createVirtualList(base);
    api.send({ type: 'SET_TOTAL_COUNT', totalCount: 500 });
    expect(api.getContext().totalCount).toBe(500);
    expect(api.getContext().totalHeight).toBe(20000);
  });

  // ── SET_ITEM_HEIGHT ──

  it('itemHeight guncellenir', () => {
    const api = createVirtualList(base);
    api.send({ type: 'SET_ITEM_HEIGHT', itemHeight: 60 });
    expect(api.getContext().itemHeight).toBe(60);
    expect(api.getContext().totalHeight).toBe(60000);
  });

  // ── Edge cases ──

  it('totalCount 0 ise bos range', () => {
    const api = createVirtualList({ ...base, totalCount: 0 });
    const { visibleRange } = api.getContext();
    expect(visibleRange.startIndex).toBe(0);
    expect(visibleRange.endIndex).toBe(0);
  });

  it('containerHeight 0 ise bos range', () => {
    const api = createVirtualList({ ...base, containerHeight: 0 });
    const { visibleRange } = api.getContext();
    expect(visibleRange.startIndex).toBe(0);
    expect(visibleRange.endIndex).toBe(0);
  });

  it('varsayilan overscan 5', () => {
    const api = createVirtualList({ totalCount: 100, itemHeight: 40, containerHeight: 400 });
    expect(api.getContext().overscan).toBe(5);
  });

  // ── Callbacks ──

  it('onScroll callback cagirilir', () => {
    const onScroll = vi.fn();
    const api = createVirtualList({ ...base, onScroll });
    api.send({ type: 'SCROLL', scrollTop: 200 });
    expect(onScroll).toHaveBeenCalledWith(200);
  });

  // ── Subscribe / Destroy ──

  it('subscribe ile listener eklenir', () => {
    const api = createVirtualList(base);
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'SCROLL', scrollTop: 100 });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe ile listener cikarilir', () => {
    const api = createVirtualList(base);
    const fn = vi.fn();
    const unsub = api.subscribe(fn);
    unsub();
    api.send({ type: 'SCROLL', scrollTop: 100 });
    expect(fn).not.toHaveBeenCalled();
  });

  it('destroy tum listener lari temizler', () => {
    const api = createVirtualList(base);
    const fn = vi.fn();
    api.subscribe(fn);
    api.destroy();
    api.send({ type: 'SCROLL', scrollTop: 100 });
    expect(fn).not.toHaveBeenCalled();
  });
});
