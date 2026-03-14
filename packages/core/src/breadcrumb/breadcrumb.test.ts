/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createBreadcrumb } from './breadcrumb.machine';
import type { BreadcrumbItem } from './breadcrumb.types';

// ── Test verileri ──────────────────────────────────────────────────

const simpleItems: BreadcrumbItem[] = [
  { key: 'home', label: 'Ana Sayfa', href: '/' },
  { key: 'products', label: 'Urunler', href: '/products' },
  { key: 'detail', label: 'Urun Detayi' },
];

const longItems: BreadcrumbItem[] = [
  { key: 'home', label: 'Ana Sayfa', href: '/' },
  { key: 'cat', label: 'Kategori', href: '/cat' },
  { key: 'sub', label: 'Alt Kategori', href: '/cat/sub' },
  { key: 'brand', label: 'Marka', href: '/cat/sub/brand' },
  { key: 'product', label: 'Urun', href: '/cat/sub/brand/product' },
  { key: 'detail', label: 'Detay' },
];

// ── createBreadcrumb ────────────────────────────────────────────────

describe('createBreadcrumb', () => {
  it('varsayilan props ile olusturulabilir', () => {
    const bc = createBreadcrumb({ items: simpleItems });
    expect(bc.getContext().items).toEqual(simpleItems);
    expect(bc.getContext().collapsed).toBe(false);
    expect(bc.getContext().maxItems).toBe(0);
    expect(bc.isCollapsed()).toBe(false);
    expect(bc.getItemCount()).toBe(3);
  });

  it('maxItems ile daraltma aktif edilir', () => {
    const bc = createBreadcrumb({ items: longItems, maxItems: 4 });
    expect(bc.isCollapsed()).toBe(true);
    expect(bc.getContext().maxItems).toBe(4);
  });

  it('maxItems oge sayisindan buyukse daraltma olmaz', () => {
    const bc = createBreadcrumb({ items: simpleItems, maxItems: 10 });
    expect(bc.isCollapsed()).toBe(false);
  });

  it('maxItems oge sayisina esitse daraltma olmaz', () => {
    const bc = createBreadcrumb({ items: simpleItems, maxItems: 3 });
    expect(bc.isCollapsed()).toBe(false);
  });

  it('maxItems=0 daraltma devre disi', () => {
    const bc = createBreadcrumb({ items: longItems, maxItems: 0 });
    expect(bc.isCollapsed()).toBe(false);
  });

  it('bos items dizisi kabul edilir', () => {
    const bc = createBreadcrumb({ items: [] });
    expect(bc.getItemCount()).toBe(0);
    expect(bc.getVisibleItems()).toEqual([]);
  });

  it('itemsBeforeCollapse ve itemsAfterCollapse varsayilanlari', () => {
    const bc = createBreadcrumb({ items: longItems, maxItems: 4 });
    expect(bc.getContext().itemsBeforeCollapse).toBe(1);
    expect(bc.getContext().itemsAfterCollapse).toBe(1);
  });

  it('itemsBeforeCollapse ve itemsAfterCollapse ozel degerler', () => {
    const bc = createBreadcrumb({
      items: longItems,
      maxItems: 4,
      itemsBeforeCollapse: 2,
      itemsAfterCollapse: 2,
    });
    expect(bc.getContext().itemsBeforeCollapse).toBe(2);
    expect(bc.getContext().itemsAfterCollapse).toBe(2);
  });
});

// ── getVisibleItems ─────────────────────────────────────────────────

describe('getVisibleItems', () => {
  it('daraltilmamis halde tum ogeleri doner', () => {
    const bc = createBreadcrumb({ items: simpleItems });
    const visible = bc.getVisibleItems();
    expect(visible).toHaveLength(3);
    expect(visible[0]).toEqual({ type: 'item', item: simpleItems[0], isLast: false });
    expect(visible[1]).toEqual({ type: 'item', item: simpleItems[1], isLast: false });
    expect(visible[2]).toEqual({ type: 'item', item: simpleItems[2], isLast: true });
  });

  it('daraltilmis halde bas + ellipsis + son gosterir', () => {
    const bc = createBreadcrumb({ items: longItems, maxItems: 4 });
    const visible = bc.getVisibleItems();
    // 1 before + 1 ellipsis + 1 after = 3
    expect(visible).toHaveLength(3);
    expect(visible[0]).toEqual({ type: 'item', item: longItems[0], isLast: false });
    expect(visible[1]).toEqual({ type: 'ellipsis', isLast: false });
    expect(visible[2]).toEqual({ type: 'item', item: longItems[5], isLast: true });
  });

  it('ozel before/after daraltma', () => {
    const bc = createBreadcrumb({
      items: longItems,
      maxItems: 4,
      itemsBeforeCollapse: 2,
      itemsAfterCollapse: 2,
    });
    const visible = bc.getVisibleItems();
    // 2 before + 1 ellipsis + 2 after = 5
    expect(visible).toHaveLength(5);
    expect(visible[0]).toEqual({ type: 'item', item: longItems[0], isLast: false });
    expect(visible[1]).toEqual({ type: 'item', item: longItems[1], isLast: false });
    expect(visible[2]).toEqual({ type: 'ellipsis', isLast: false });
    expect(visible[3]).toEqual({ type: 'item', item: longItems[4], isLast: false });
    expect(visible[4]).toEqual({ type: 'item', item: longItems[5], isLast: true });
  });

  it('son ogenin isLast degeri true', () => {
    const bc = createBreadcrumb({ items: simpleItems });
    const visible = bc.getVisibleItems();
    const lastItem = visible[visible.length - 1];
    expect(lastItem?.isLast).toBe(true);
  });

  it('tek oge durumu', () => {
    const bc = createBreadcrumb({ items: [{ key: 'only', label: 'Tek' }] });
    const visible = bc.getVisibleItems();
    expect(visible).toHaveLength(1);
    expect(visible[0]).toEqual({
      type: 'item',
      item: { key: 'only', label: 'Tek' },
      isLast: true,
    });
  });
});

// ── EXPAND event ────────────────────────────────────────────────────

describe('EXPAND event', () => {
  it('daraltilmis hali genisletir', () => {
    const bc = createBreadcrumb({ items: longItems, maxItems: 4 });
    expect(bc.isCollapsed()).toBe(true);
    bc.send({ type: 'EXPAND' });
    expect(bc.isCollapsed()).toBe(false);
    expect(bc.getVisibleItems()).toHaveLength(6);
  });

  it('zaten genislemisse context degismez', () => {
    const bc = createBreadcrumb({ items: simpleItems });
    const ctx1 = bc.getContext();
    const ctx2 = bc.send({ type: 'EXPAND' });
    expect(ctx2).toBe(ctx1);
  });
});

// ── COLLAPSE event ──────────────────────────────────────────────────

describe('COLLAPSE event', () => {
  it('genislemis hali daraltir', () => {
    const bc = createBreadcrumb({ items: longItems, maxItems: 4 });
    bc.send({ type: 'EXPAND' });
    expect(bc.isCollapsed()).toBe(false);
    bc.send({ type: 'COLLAPSE' });
    expect(bc.isCollapsed()).toBe(true);
  });

  it('zaten daraltilmissa context degismez', () => {
    const bc = createBreadcrumb({ items: longItems, maxItems: 4 });
    const ctx1 = bc.getContext();
    const ctx2 = bc.send({ type: 'COLLAPSE' });
    expect(ctx2).toBe(ctx1);
  });

  it('daraltma kosulu saglanmiyorsa daraltmaz', () => {
    const bc = createBreadcrumb({ items: simpleItems, maxItems: 10 });
    const ctx1 = bc.getContext();
    const ctx2 = bc.send({ type: 'COLLAPSE' });
    expect(ctx2).toBe(ctx1);
    expect(bc.isCollapsed()).toBe(false);
  });
});

// ── SET_ITEMS event ─────────────────────────────────────────────────

describe('SET_ITEMS event', () => {
  it('ogeleri gunceller', () => {
    const bc = createBreadcrumb({ items: simpleItems });
    bc.send({ type: 'SET_ITEMS', items: longItems });
    expect(bc.getItemCount()).toBe(6);
    expect(bc.getContext().items).toEqual(longItems);
  });

  it('yeni ogeler maxItems asarsa daraltir', () => {
    const bc = createBreadcrumb({ items: simpleItems, maxItems: 4 });
    expect(bc.isCollapsed()).toBe(false);
    bc.send({ type: 'SET_ITEMS', items: longItems });
    expect(bc.isCollapsed()).toBe(true);
  });

  it('yeni ogeler maxItems altindaysa daraltmaz', () => {
    const bc = createBreadcrumb({ items: longItems, maxItems: 4 });
    expect(bc.isCollapsed()).toBe(true);
    bc.send({ type: 'SET_ITEMS', items: simpleItems });
    expect(bc.isCollapsed()).toBe(false);
  });
});

// ── SET_MAX_ITEMS event ─────────────────────────────────────────────

describe('SET_MAX_ITEMS event', () => {
  it('maxItems gunceller ve daraltir', () => {
    const bc = createBreadcrumb({ items: longItems });
    expect(bc.isCollapsed()).toBe(false);
    bc.send({ type: 'SET_MAX_ITEMS', maxItems: 3 });
    expect(bc.isCollapsed()).toBe(true);
    expect(bc.getContext().maxItems).toBe(3);
  });

  it('maxItems arttirilirsa daraltma kalkar', () => {
    const bc = createBreadcrumb({ items: longItems, maxItems: 3 });
    expect(bc.isCollapsed()).toBe(true);
    bc.send({ type: 'SET_MAX_ITEMS', maxItems: 10 });
    expect(bc.isCollapsed()).toBe(false);
  });

  it('maxItems=0 daraltmayi devre disi birakir', () => {
    const bc = createBreadcrumb({ items: longItems, maxItems: 3 });
    bc.send({ type: 'SET_MAX_ITEMS', maxItems: 0 });
    expect(bc.isCollapsed()).toBe(false);
  });
});

// ── DOM Props ───────────────────────────────────────────────────────

describe('DOM Props', () => {
  it('getNavProps aria-label doner', () => {
    const bc = createBreadcrumb({ items: simpleItems });
    expect(bc.getNavProps()).toEqual({ 'aria-label': 'Breadcrumb' });
  });

  it('getListProps role undefined doner', () => {
    const bc = createBreadcrumb({ items: simpleItems });
    expect(bc.getListProps()).toEqual({ role: undefined });
  });

  it('getItemProps son oge icin aria-current=page', () => {
    const bc = createBreadcrumb({ items: simpleItems });
    const item = simpleItems[2];
    if (item) {
      const props = bc.getItemProps(item, true);
      expect(props['aria-current']).toBe('page');
      expect(props['aria-disabled']).toBeUndefined();
      expect(props['data-disabled']).toBeUndefined();
    }
  });

  it('getItemProps son olmayan oge icin aria-current=undefined', () => {
    const bc = createBreadcrumb({ items: simpleItems });
    const item = simpleItems[0];
    if (item) {
      const props = bc.getItemProps(item, false);
      expect(props['aria-current']).toBeUndefined();
    }
  });

  it('getItemProps disabled oge', () => {
    const disabledItem: BreadcrumbItem = { key: 'dis', label: 'Disabled', disabled: true };
    const bc = createBreadcrumb({ items: [disabledItem] });
    const props = bc.getItemProps(disabledItem, false);
    expect(props['aria-disabled']).toBe(true);
    expect(props['data-disabled']).toBe('');
  });
});

// ── API helpers ─────────────────────────────────────────────────────

describe('API helpers', () => {
  it('isCollapsed dogru deger doner', () => {
    const bc = createBreadcrumb({ items: longItems, maxItems: 4 });
    expect(bc.isCollapsed()).toBe(true);
    bc.send({ type: 'EXPAND' });
    expect(bc.isCollapsed()).toBe(false);
  });

  it('getItemCount dogru deger doner', () => {
    const bc = createBreadcrumb({ items: simpleItems });
    expect(bc.getItemCount()).toBe(3);
    bc.send({ type: 'SET_ITEMS', items: longItems });
    expect(bc.getItemCount()).toBe(6);
  });

  it('getContext guncel state doner', () => {
    const bc = createBreadcrumb({ items: simpleItems });
    const ctx = bc.getContext();
    expect(ctx.items).toEqual(simpleItems);
    expect(ctx.collapsed).toBe(false);
    expect(ctx.maxItems).toBe(0);
    expect(ctx.itemsBeforeCollapse).toBe(1);
    expect(ctx.itemsAfterCollapse).toBe(1);
  });
});

// ── Bilinmeyen event ────────────────────────────────────────────────

describe('bilinmeyen event', () => {
  it('context degismez', () => {
    const bc = createBreadcrumb({ items: simpleItems });
    const ctx = bc.getContext();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ctx2 = bc.send({ type: 'UNKNOWN' } as any);
    expect(ctx2).toBe(ctx);
  });
});
