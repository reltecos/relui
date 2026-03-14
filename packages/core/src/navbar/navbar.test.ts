/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createNavbar } from './navbar.machine';
import type { NavbarItem } from './navbar.types';

// ── Test verileri ──────────────────────────────────────────────

const simpleItems: NavbarItem[] = [
  { key: 'home', label: 'Ana Sayfa', href: '/' },
  { key: 'products', label: 'Urunler', href: '/products' },
  { key: 'about', label: 'Hakkinda', href: '/about' },
];

const nestedItems: NavbarItem[] = [
  { key: 'home', label: 'Ana Sayfa' },
  {
    key: 'products',
    label: 'Urunler',
    children: [
      { key: 'electronics', label: 'Elektronik' },
      { key: 'clothing', label: 'Giyim' },
    ],
  },
  { key: 'about', label: 'Hakkinda' },
];

// ── Olusturma ──────────────────────────────────────────────────

describe('createNavbar', () => {
  it('varsayilan degerlerle olusturulur', () => {
    const api = createNavbar({ items: simpleItems });
    const ctx = api.getContext();
    expect(ctx.items).toBe(simpleItems);
    expect(ctx.activeKey).toBeNull();
    expect(ctx.mobileOpen).toBe(false);
  });

  it('defaultActiveKey ile olusturulur', () => {
    const api = createNavbar({ items: simpleItems, defaultActiveKey: 'home' });
    expect(api.getContext().activeKey).toBe('home');
  });

  it('controlled activeKey ile olusturulur', () => {
    const api = createNavbar({ items: simpleItems, activeKey: 'products' });
    expect(api.getContext().activeKey).toBe('products');
  });

  it('activeKey defaultActiveKey uzerine yazar', () => {
    const api = createNavbar({
      items: simpleItems,
      defaultActiveKey: 'home',
      activeKey: 'about',
    });
    expect(api.getContext().activeKey).toBe('about');
  });

  it('defaultMobileOpen ile olusturulur', () => {
    const api = createNavbar({ items: simpleItems, defaultMobileOpen: true });
    expect(api.getContext().mobileOpen).toBe(true);
  });

  it('controlled mobileOpen ile olusturulur', () => {
    const api = createNavbar({ items: simpleItems, mobileOpen: true });
    expect(api.getContext().mobileOpen).toBe(true);
  });

  it('bos items ile olusturulur', () => {
    const api = createNavbar({ items: [] });
    expect(api.getContext().items).toEqual([]);
  });
});

// ── SET_ACTIVE ─────────────────────────────────────────────────

describe('SET_ACTIVE', () => {
  it('aktif oge degisir', () => {
    const api = createNavbar({ items: simpleItems });
    api.send({ type: 'SET_ACTIVE', key: 'products' });
    expect(api.getContext().activeKey).toBe('products');
  });

  it('farkli bir ogeye gecis yapilir', () => {
    const api = createNavbar({ items: simpleItems, defaultActiveKey: 'home' });
    api.send({ type: 'SET_ACTIVE', key: 'about' });
    expect(api.getContext().activeKey).toBe('about');
  });

  it('disabled oge aktif edilemez', () => {
    const items: NavbarItem[] = [
      { key: 'a', label: 'A' },
      { key: 'b', label: 'B', disabled: true },
    ];
    const api = createNavbar({ items, defaultActiveKey: 'a' });
    api.send({ type: 'SET_ACTIVE', key: 'b' });
    expect(api.getContext().activeKey).toBe('a');
  });

  it('olmayan key ile activeKey degismez', () => {
    const api = createNavbar({ items: simpleItems, defaultActiveKey: 'home' });
    api.send({ type: 'SET_ACTIVE', key: 'nonexistent' });
    expect(api.getContext().activeKey).toBe('home');
  });

  it('nested child ogesi aktif edilebilir', () => {
    const api = createNavbar({ items: nestedItems });
    api.send({ type: 'SET_ACTIVE', key: 'electronics' });
    expect(api.getContext().activeKey).toBe('electronics');
  });
});

// ── Mobil menu ─────────────────────────────────────────────────

describe('Mobile menu', () => {
  it('TOGGLE_MOBILE acik/kapali gecis yapar', () => {
    const api = createNavbar({ items: simpleItems });
    expect(api.getContext().mobileOpen).toBe(false);
    api.send({ type: 'TOGGLE_MOBILE' });
    expect(api.getContext().mobileOpen).toBe(true);
    api.send({ type: 'TOGGLE_MOBILE' });
    expect(api.getContext().mobileOpen).toBe(false);
  });

  it('OPEN_MOBILE menuyu acar', () => {
    const api = createNavbar({ items: simpleItems });
    api.send({ type: 'OPEN_MOBILE' });
    expect(api.getContext().mobileOpen).toBe(true);
  });

  it('OPEN_MOBILE zaten aciksa degisiklik olmaz', () => {
    const api = createNavbar({ items: simpleItems, defaultMobileOpen: true });
    api.send({ type: 'OPEN_MOBILE' });
    expect(api.getContext().mobileOpen).toBe(true);
  });

  it('CLOSE_MOBILE menuyu kapatir', () => {
    const api = createNavbar({ items: simpleItems, defaultMobileOpen: true });
    api.send({ type: 'CLOSE_MOBILE' });
    expect(api.getContext().mobileOpen).toBe(false);
  });

  it('CLOSE_MOBILE zaten kapaliysa degisiklik olmaz', () => {
    const api = createNavbar({ items: simpleItems });
    api.send({ type: 'CLOSE_MOBILE' });
    expect(api.getContext().mobileOpen).toBe(false);
  });

  it('SET_MOBILE_OPEN ile kontrollu ayarlanir', () => {
    const api = createNavbar({ items: simpleItems });
    api.send({ type: 'SET_MOBILE_OPEN', open: true });
    expect(api.getContext().mobileOpen).toBe(true);
    api.send({ type: 'SET_MOBILE_OPEN', open: false });
    expect(api.getContext().mobileOpen).toBe(false);
  });
});

// ── Prop sync ──────────────────────────────────────────────────

describe('Prop sync', () => {
  it('SET_ITEMS ogeleri gunceller', () => {
    const api = createNavbar({ items: simpleItems });
    const newItems: NavbarItem[] = [{ key: 'x', label: 'X' }];
    api.send({ type: 'SET_ITEMS', items: newItems });
    expect(api.getContext().items).toBe(newItems);
  });

  it('SET_ACTIVE_KEY aktif ogeyi gunceller', () => {
    const api = createNavbar({ items: simpleItems });
    api.send({ type: 'SET_ACTIVE_KEY', key: 'about' });
    expect(api.getContext().activeKey).toBe('about');
  });

  it('SET_ACTIVE_KEY null ile temizler', () => {
    const api = createNavbar({ items: simpleItems, defaultActiveKey: 'home' });
    api.send({ type: 'SET_ACTIVE_KEY', key: null });
    expect(api.getContext().activeKey).toBeNull();
  });
});

// ── DOM props ──────────────────────────────────────────────────

describe('DOM props', () => {
  it('getNavProps navigation role doner', () => {
    const api = createNavbar({ items: simpleItems });
    const navProps = api.getNavProps();
    expect(navProps.role).toBe('navigation');
    expect(navProps['aria-label']).toBe('Navbar');
  });

  it('getItemProps aktif oge icin aria-current=page', () => {
    const api = createNavbar({ items: simpleItems, defaultActiveKey: 'home' });
    const home = simpleItems[0];
    expect(home).toBeDefined();
    const props = api.getItemProps(home as NavbarItem);
    expect(props['aria-current']).toBe('page');
    expect(props['data-active']).toBe('');
  });

  it('getItemProps aktif olmayan oge icin aria-current undefined', () => {
    const api = createNavbar({ items: simpleItems, defaultActiveKey: 'home' });
    const products = simpleItems[1];
    expect(products).toBeDefined();
    const props = api.getItemProps(products as NavbarItem);
    expect(props['aria-current']).toBeUndefined();
    expect(props['data-active']).toBeUndefined();
  });

  it('getItemProps disabled oge icin aria-disabled', () => {
    const items: NavbarItem[] = [{ key: 'a', label: 'A', disabled: true }];
    const api = createNavbar({ items });
    const first = items[0];
    expect(first).toBeDefined();
    const props = api.getItemProps(first as NavbarItem);
    expect(props['aria-disabled']).toBe(true);
    expect(props['data-disabled']).toBe('');
  });

  it('getItemProps disabled olmayan oge icin aria-disabled undefined', () => {
    const api = createNavbar({ items: simpleItems });
    const home = simpleItems[0];
    expect(home).toBeDefined();
    const props = api.getItemProps(home as NavbarItem);
    expect(props['aria-disabled']).toBeUndefined();
    expect(props['data-disabled']).toBeUndefined();
  });

  it('getMobileToggleProps kapali durumda', () => {
    const api = createNavbar({ items: simpleItems });
    const props = api.getMobileToggleProps();
    expect(props['aria-expanded']).toBe(false);
    expect(props['aria-label']).toBe('Menuyu ac');
  });

  it('getMobileToggleProps acik durumda', () => {
    const api = createNavbar({ items: simpleItems, defaultMobileOpen: true });
    const props = api.getMobileToggleProps();
    expect(props['aria-expanded']).toBe(true);
    expect(props['aria-label']).toBe('Menuyu kapat');
  });
});

// ── API helpers ────────────────────────────────────────────────

describe('API helpers', () => {
  it('getActiveItem aktif oge doner', () => {
    const api = createNavbar({ items: simpleItems, defaultActiveKey: 'products' });
    const active = api.getActiveItem();
    expect(active).not.toBeNull();
    expect(active?.key).toBe('products');
    expect(active?.label).toBe('Urunler');
  });

  it('getActiveItem aktif oge yoksa null doner', () => {
    const api = createNavbar({ items: simpleItems });
    expect(api.getActiveItem()).toBeNull();
  });

  it('getFlatItems tum ogeleri duzlestirir', () => {
    const api = createNavbar({ items: nestedItems });
    const flat = api.getFlatItems();
    expect(flat).toHaveLength(5); // home, products, electronics, clothing, about
    expect(flat.map((i) => i.key)).toEqual([
      'home',
      'products',
      'electronics',
      'clothing',
      'about',
    ]);
  });

  it('getFlatItems basit liste ile ayni doner', () => {
    const api = createNavbar({ items: simpleItems });
    const flat = api.getFlatItems();
    expect(flat).toHaveLength(3);
  });

  it('findItem mevcut ogeyi bulur', () => {
    const api = createNavbar({ items: simpleItems });
    const item = api.findItem('about');
    expect(item).not.toBeNull();
    expect(item?.label).toBe('Hakkinda');
  });

  it('findItem nested ogeyi bulur', () => {
    const api = createNavbar({ items: nestedItems });
    const item = api.findItem('clothing');
    expect(item).not.toBeNull();
    expect(item?.label).toBe('Giyim');
  });

  it('findItem olmayan key icin null doner', () => {
    const api = createNavbar({ items: simpleItems });
    expect(api.findItem('nonexistent')).toBeNull();
  });

  it('isMobileOpen dogru deger doner', () => {
    const api = createNavbar({ items: simpleItems });
    expect(api.isMobileOpen()).toBe(false);
    api.send({ type: 'TOGGLE_MOBILE' });
    expect(api.isMobileOpen()).toBe(true);
  });
});

// ── Bilinmeyen event ───────────────────────────────────────────

describe('Unknown event', () => {
  it('bilinmeyen event context degistirmez', () => {
    const api = createNavbar({ items: simpleItems, defaultActiveKey: 'home' });
    const ctxBefore = { ...api.getContext() };
    api.send({ type: 'UNKNOWN' } as unknown as NavbarEvent);
    expect(api.getContext().activeKey).toBe(ctxBefore.activeKey);
    expect(api.getContext().mobileOpen).toBe(ctxBefore.mobileOpen);
  });
});
