/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createSidebar } from './sidebar.machine';
import type { SidebarItem } from './sidebar.types';

// ── Test verileri ──────────────────────────────────────────────────

const simpleItems: SidebarItem[] = [
  { key: 'home', label: 'Ana Sayfa', icon: 'home', href: '/' },
  { key: 'products', label: 'Urunler', icon: 'box', href: '/products' },
  { key: 'about', label: 'Hakkinda', icon: 'info', href: '/about' },
];

const groupedItems: SidebarItem[] = [
  { key: 'home', label: 'Ana Sayfa', icon: 'home' },
  {
    key: 'settings',
    label: 'Ayarlar',
    icon: 'gear',
    children: [
      { key: 'profile', label: 'Profil' },
      { key: 'security', label: 'Guvenlik' },
      { key: 'notifications', label: 'Bildirimler', disabled: true },
    ],
  },
  {
    key: 'admin',
    label: 'Yonetim',
    icon: 'shield',
    children: [
      { key: 'users', label: 'Kullanicilar' },
      { key: 'roles', label: 'Roller' },
    ],
  },
];

// ── createSidebar ───────────────────────────────────────────────────

describe('createSidebar', () => {
  it('varsayilan props ile olusturulabilir', () => {
    const sb = createSidebar({ items: simpleItems });
    expect(sb.isCollapsed()).toBe(false);
    expect(sb.getActiveKey()).toBeNull();
    expect(sb.getContext().items).toEqual(simpleItems);
  });

  it('defaultCollapsed=true ile daraltilmis baslar', () => {
    const sb = createSidebar({ items: simpleItems, defaultCollapsed: true });
    expect(sb.isCollapsed()).toBe(true);
  });

  it('collapsed prop ile kontrollü daraltma', () => {
    const sb = createSidebar({ items: simpleItems, collapsed: true });
    expect(sb.isCollapsed()).toBe(true);
  });

  it('defaultActiveKey ile aktif oge', () => {
    const sb = createSidebar({ items: simpleItems, defaultActiveKey: 'products' });
    expect(sb.getActiveKey()).toBe('products');
  });

  it('activeKey ile kontrollü aktif oge', () => {
    const sb = createSidebar({ items: simpleItems, activeKey: 'about' });
    expect(sb.getActiveKey()).toBe('about');
  });

  it('defaultExpandedKeys ile acik gruplar', () => {
    const sb = createSidebar({ items: groupedItems, defaultExpandedKeys: ['settings'] });
    expect(sb.isGroupExpanded('settings')).toBe(true);
    expect(sb.isGroupExpanded('admin')).toBe(false);
  });

  it('bos items kabul edilir', () => {
    const sb = createSidebar({ items: [] });
    expect(sb.getContext().items).toEqual([]);
  });
});

// ── TOGGLE_COLLAPSE / EXPAND / COLLAPSE ─────────────────────────────

describe('daraltma event leri', () => {
  it('TOGGLE_COLLAPSE daraltir/genisletir', () => {
    const sb = createSidebar({ items: simpleItems });
    expect(sb.isCollapsed()).toBe(false);
    sb.send({ type: 'TOGGLE_COLLAPSE' });
    expect(sb.isCollapsed()).toBe(true);
    sb.send({ type: 'TOGGLE_COLLAPSE' });
    expect(sb.isCollapsed()).toBe(false);
  });

  it('EXPAND zaten genislemisse context degismez', () => {
    const sb = createSidebar({ items: simpleItems });
    const ctx1 = sb.getContext();
    const ctx2 = sb.send({ type: 'EXPAND' });
    expect(ctx2).toBe(ctx1);
  });

  it('COLLAPSE zaten daraltilmissa context degismez', () => {
    const sb = createSidebar({ items: simpleItems, defaultCollapsed: true });
    const ctx1 = sb.getContext();
    const ctx2 = sb.send({ type: 'COLLAPSE' });
    expect(ctx2).toBe(ctx1);
  });

  it('EXPAND daraltilmis hali genisletir', () => {
    const sb = createSidebar({ items: simpleItems, defaultCollapsed: true });
    sb.send({ type: 'EXPAND' });
    expect(sb.isCollapsed()).toBe(false);
  });

  it('COLLAPSE genislemis hali daraltir', () => {
    const sb = createSidebar({ items: simpleItems });
    sb.send({ type: 'COLLAPSE' });
    expect(sb.isCollapsed()).toBe(true);
  });
});

// ── SET_ACTIVE ──────────────────────────────────────────────────────

describe('SET_ACTIVE event', () => {
  it('aktif ogeyi degistirir', () => {
    const sb = createSidebar({ items: simpleItems });
    sb.send({ type: 'SET_ACTIVE', key: 'products' });
    expect(sb.getActiveKey()).toBe('products');
  });

  it('ayni key ise context degismez', () => {
    const sb = createSidebar({ items: simpleItems, defaultActiveKey: 'home' });
    const ctx1 = sb.getContext();
    const ctx2 = sb.send({ type: 'SET_ACTIVE', key: 'home' });
    expect(ctx2).toBe(ctx1);
  });

  it('ic ice oge aktif edilebilir', () => {
    const sb = createSidebar({ items: groupedItems });
    sb.send({ type: 'SET_ACTIVE', key: 'profile' });
    expect(sb.getActiveKey()).toBe('profile');
  });
});

// ── TOGGLE_GROUP / EXPAND_GROUP / COLLAPSE_GROUP ────────────────────

describe('grup event leri', () => {
  it('TOGGLE_GROUP acik grubu kapatir', () => {
    const sb = createSidebar({ items: groupedItems, defaultExpandedKeys: ['settings'] });
    sb.send({ type: 'TOGGLE_GROUP', key: 'settings' });
    expect(sb.isGroupExpanded('settings')).toBe(false);
  });

  it('TOGGLE_GROUP kapali grubu acar', () => {
    const sb = createSidebar({ items: groupedItems });
    sb.send({ type: 'TOGGLE_GROUP', key: 'settings' });
    expect(sb.isGroupExpanded('settings')).toBe(true);
  });

  it('EXPAND_GROUP zaten aciksa context degismez', () => {
    const sb = createSidebar({ items: groupedItems, defaultExpandedKeys: ['settings'] });
    const ctx1 = sb.getContext();
    const ctx2 = sb.send({ type: 'EXPAND_GROUP', key: 'settings' });
    expect(ctx2).toBe(ctx1);
  });

  it('COLLAPSE_GROUP zaten kapaliysa context degismez', () => {
    const sb = createSidebar({ items: groupedItems });
    const ctx1 = sb.getContext();
    const ctx2 = sb.send({ type: 'COLLAPSE_GROUP', key: 'settings' });
    expect(ctx2).toBe(ctx1);
  });

  it('EXPAND_ALL_GROUPS tum gruplari acar', () => {
    const sb = createSidebar({ items: groupedItems });
    sb.send({ type: 'EXPAND_ALL_GROUPS' });
    expect(sb.isGroupExpanded('settings')).toBe(true);
    expect(sb.isGroupExpanded('admin')).toBe(true);
  });

  it('COLLAPSE_ALL_GROUPS tum gruplari kapatir', () => {
    const sb = createSidebar({ items: groupedItems, defaultExpandedKeys: ['settings', 'admin'] });
    sb.send({ type: 'COLLAPSE_ALL_GROUPS' });
    expect(sb.isGroupExpanded('settings')).toBe(false);
    expect(sb.isGroupExpanded('admin')).toBe(false);
  });

  it('COLLAPSE_ALL_GROUPS zaten hepsi kapaliysa context degismez', () => {
    const sb = createSidebar({ items: groupedItems });
    const ctx1 = sb.getContext();
    const ctx2 = sb.send({ type: 'COLLAPSE_ALL_GROUPS' });
    expect(ctx2).toBe(ctx1);
  });
});

// ── SET_ITEMS / SET_COLLAPSED / SET_ACTIVE_KEY ──────────────────────

describe('prop sync event leri', () => {
  it('SET_ITEMS ogeleri gunceller', () => {
    const sb = createSidebar({ items: simpleItems });
    sb.send({ type: 'SET_ITEMS', items: groupedItems });
    expect(sb.getContext().items).toEqual(groupedItems);
  });

  it('SET_COLLAPSED daraltma durumunu gunceller', () => {
    const sb = createSidebar({ items: simpleItems });
    sb.send({ type: 'SET_COLLAPSED', collapsed: true });
    expect(sb.isCollapsed()).toBe(true);
  });

  it('SET_COLLAPSED ayni deger ise context degismez', () => {
    const sb = createSidebar({ items: simpleItems });
    const ctx1 = sb.getContext();
    const ctx2 = sb.send({ type: 'SET_COLLAPSED', collapsed: false });
    expect(ctx2).toBe(ctx1);
  });

  it('SET_ACTIVE_KEY aktif ogeyi gunceller', () => {
    const sb = createSidebar({ items: simpleItems });
    sb.send({ type: 'SET_ACTIVE_KEY', key: 'about' });
    expect(sb.getActiveKey()).toBe('about');
  });

  it('SET_ACTIVE_KEY null ile aktif oge kaldirma', () => {
    const sb = createSidebar({ items: simpleItems, defaultActiveKey: 'home' });
    sb.send({ type: 'SET_ACTIVE_KEY', key: null });
    expect(sb.getActiveKey()).toBeNull();
  });
});

// ── DOM Props ───────────────────────────────────────────────────────

describe('DOM Props', () => {
  it('getNavProps varsayilan', () => {
    const sb = createSidebar({ items: simpleItems });
    const props = sb.getNavProps();
    expect(props['aria-label']).toBe('Sidebar');
    expect(props.role).toBe('navigation');
    expect(props['data-collapsed']).toBeUndefined();
  });

  it('getNavProps daraltilmis', () => {
    const sb = createSidebar({ items: simpleItems, defaultCollapsed: true });
    const props = sb.getNavProps();
    expect(props['data-collapsed']).toBe('');
  });

  it('getItemProps aktif oge', () => {
    const sb = createSidebar({ items: simpleItems, defaultActiveKey: 'home' });
    const item = simpleItems[0];
    if (item) {
      const props = sb.getItemProps(item);
      expect(props['aria-current']).toBe('page');
      expect(props['data-active']).toBe('');
    }
  });

  it('getItemProps pasif olmayan oge', () => {
    const sb = createSidebar({ items: simpleItems, defaultActiveKey: 'home' });
    const item = simpleItems[1];
    if (item) {
      const props = sb.getItemProps(item);
      expect(props['aria-current']).toBeUndefined();
      expect(props['data-active']).toBeUndefined();
    }
  });

  it('getItemProps disabled oge', () => {
    const sb = createSidebar({ items: groupedItems });
    const item = sb.findItem('notifications');
    if (item) {
      const props = sb.getItemProps(item);
      expect(props['aria-disabled']).toBe(true);
      expect(props['data-disabled']).toBe('');
    }
  });

  it('getGroupProps acik grup', () => {
    const sb = createSidebar({ items: groupedItems, defaultExpandedKeys: ['settings'] });
    const props = sb.getGroupProps('settings');
    expect(props['aria-expanded']).toBe(true);
    expect(props['data-expanded']).toBe('');
  });

  it('getGroupProps kapali grup', () => {
    const sb = createSidebar({ items: groupedItems });
    const props = sb.getGroupProps('settings');
    expect(props['aria-expanded']).toBe(false);
    expect(props['data-expanded']).toBeUndefined();
  });
});

// ── API helpers ─────────────────────────────────────────────────────

describe('API helpers', () => {
  it('getActiveItem aktif oge doner', () => {
    const sb = createSidebar({ items: simpleItems, defaultActiveKey: 'products' });
    const active = sb.getActiveItem();
    expect(active?.key).toBe('products');
    expect(active?.label).toBe('Urunler');
  });

  it('getActiveItem aktif oge yoksa null', () => {
    const sb = createSidebar({ items: simpleItems });
    expect(sb.getActiveItem()).toBeNull();
  });

  it('getActiveItem ic ice oge bulur', () => {
    const sb = createSidebar({ items: groupedItems, defaultActiveKey: 'security' });
    const active = sb.getActiveItem();
    expect(active?.key).toBe('security');
    expect(active?.label).toBe('Guvenlik');
  });

  it('getFlatItems tum ogeleri duzlestirir', () => {
    const sb = createSidebar({ items: groupedItems });
    const flat = sb.getFlatItems();
    // home + settings + profile + security + notifications + admin + users + roles = 8
    expect(flat).toHaveLength(8);
  });

  it('findItem key ile oge bulur', () => {
    const sb = createSidebar({ items: groupedItems });
    expect(sb.findItem('users')?.label).toBe('Kullanicilar');
    expect(sb.findItem('nonexistent')).toBeNull();
  });
});

// ── bilinmeyen event ────────────────────────────────────────────────

describe('bilinmeyen event', () => {
  it('context degismez', () => {
    const sb = createSidebar({ items: simpleItems });
    const ctx = sb.getContext();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ctx2 = sb.send({ type: 'UNKNOWN' } as any);
    expect(ctx2).toBe(ctx);
  });
});
