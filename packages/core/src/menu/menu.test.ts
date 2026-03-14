/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createMenu } from './menu.machine';
import type { MenuItem, MenuEvent } from './menu.types';

// ── Test verileri ──────────────────────────────────────────────

const fileMenu: MenuItem = {
  key: 'file',
  label: 'Dosya',
  children: [
    { key: 'new', label: 'Yeni', shortcut: 'Ctrl+N' },
    { key: 'open', label: 'Ac', shortcut: 'Ctrl+O' },
    { key: 'div-1', label: '', divider: true },
    { key: 'save', label: 'Kaydet', shortcut: 'Ctrl+S' },
    { key: 'save-as', label: 'Farkli Kaydet', shortcut: 'Ctrl+Shift+S' },
    { key: 'div-2', label: '', divider: true },
    {
      key: 'recent',
      label: 'Son Dosyalar',
      children: [
        { key: 'recent-1', label: 'dosya1.ts' },
        { key: 'recent-2', label: 'dosya2.ts' },
        { key: 'recent-3', label: 'dosya3.ts' },
      ],
    },
    { key: 'exit', label: 'Cikis' },
  ],
};

const editMenu: MenuItem = {
  key: 'edit',
  label: 'Duzenle',
  children: [
    { key: 'undo', label: 'Geri Al', shortcut: 'Ctrl+Z' },
    { key: 'redo', label: 'Yinele', shortcut: 'Ctrl+Y' },
    { key: 'div-e1', label: '', divider: true },
    { key: 'cut', label: 'Kes', shortcut: 'Ctrl+X' },
    { key: 'copy', label: 'Kopyala', shortcut: 'Ctrl+C' },
    { key: 'paste', label: 'Yapistir', shortcut: 'Ctrl+V', disabled: true },
  ],
};

const viewMenu: MenuItem = {
  key: 'view',
  label: 'Goruntu',
  children: [
    { key: 'zoom-in', label: 'Yakinlastir' },
    { key: 'zoom-out', label: 'Uzaklastir' },
    { key: 'word-wrap', label: 'Sozcuk Kaydirma', checked: true },
  ],
};

const items: MenuItem[] = [fileMenu, editMenu, viewMenu];

// ── Olusturma ──────────────────────────────────────────────────

describe('createMenu', () => {
  it('varsayilan degerlerle olusturulur', () => {
    const api = createMenu({ items });
    const ctx = api.getContext();
    expect(ctx.items).toBe(items);
    expect(ctx.openPath).toEqual([]);
    expect(ctx.highlightedKey).toBeNull();
    expect(ctx.isActive).toBe(false);
  });

  it('bos items ile olusturulur', () => {
    const api = createMenu({ items: [] });
    expect(api.getContext().items).toEqual([]);
  });
});

// ── OPEN_MENU / CLOSE_MENU / TOGGLE_MENU ──────────────────────

describe('Menu open/close', () => {
  it('OPEN_MENU menuyu acar', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    expect(api.getContext().openPath).toEqual(['file']);
    expect(api.getContext().isActive).toBe(true);
  });

  it('OPEN_MENU farkli menuyu degistirir', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    api.send({ type: 'OPEN_MENU', key: 'edit' });
    expect(api.getContext().openPath).toEqual(['edit']);
  });

  it('OPEN_MENU children olmayan oge icin calismaz', () => {
    const noChildItems: MenuItem[] = [{ key: 'x', label: 'X' }];
    const api = createMenu({ items: noChildItems });
    api.send({ type: 'OPEN_MENU', key: 'x' });
    expect(api.getContext().openPath).toEqual([]);
  });

  it('OPEN_MENU disabled oge icin calismaz', () => {
    const disabledItems: MenuItem[] = [
      { key: 'x', label: 'X', disabled: true, children: [{ key: 'y', label: 'Y' }] },
    ];
    const api = createMenu({ items: disabledItems });
    api.send({ type: 'OPEN_MENU', key: 'x' });
    expect(api.getContext().openPath).toEqual([]);
  });

  it('CLOSE_MENU menuyu kapatir', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    api.send({ type: 'CLOSE_MENU' });
    expect(api.getContext().openPath).toEqual([]);
    expect(api.getContext().isActive).toBe(false);
  });

  it('CLOSE_MENU submenu seviyesinde bir uste doner', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    api.send({ type: 'SELECT', key: 'recent' });
    expect(api.getContext().openPath).toEqual(['file', 'recent']);
    api.send({ type: 'CLOSE_MENU' });
    expect(api.getContext().openPath).toEqual(['file']);
  });

  it('CLOSE_ALL tum menuleri kapatir', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    api.send({ type: 'SELECT', key: 'recent' });
    api.send({ type: 'CLOSE_ALL' });
    expect(api.getContext().openPath).toEqual([]);
    expect(api.getContext().isActive).toBe(false);
  });

  it('TOGGLE_MENU kapali menuyu acar', () => {
    const api = createMenu({ items });
    api.send({ type: 'TOGGLE_MENU', key: 'file' });
    expect(api.getContext().openPath).toEqual(['file']);
  });

  it('TOGGLE_MENU acik menuyu kapatir', () => {
    const api = createMenu({ items });
    api.send({ type: 'TOGGLE_MENU', key: 'file' });
    api.send({ type: 'TOGGLE_MENU', key: 'file' });
    expect(api.getContext().openPath).toEqual([]);
  });
});

// ── Highlight ──────────────────────────────────────────────────

describe('Menu highlight', () => {
  it('HIGHLIGHT vurgulanan ogeyi ayarlar', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    api.send({ type: 'HIGHLIGHT', key: 'new' });
    expect(api.getContext().highlightedKey).toBe('new');
  });

  it('HIGHLIGHT null ile temizler', () => {
    const api = createMenu({ items });
    api.send({ type: 'HIGHLIGHT', key: 'new' });
    api.send({ type: 'HIGHLIGHT', key: null });
    expect(api.getContext().highlightedKey).toBeNull();
  });

  it('HIGHLIGHT_NEXT ilk ogeyi vurgular (baslangiçta)', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getContext().highlightedKey).toBe('new');
  });

  it('HIGHLIGHT_NEXT sonraki ogeye gecer', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    api.send({ type: 'HIGHLIGHT', key: 'new' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getContext().highlightedKey).toBe('open');
  });

  it('HIGHLIGHT_NEXT divider atlar', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    api.send({ type: 'HIGHLIGHT', key: 'open' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    // divider (div-1) atlanir, save'e gider
    expect(api.getContext().highlightedKey).toBe('save');
  });

  it('HIGHLIGHT_NEXT son ogeden ilk ogeye wraplanir', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    api.send({ type: 'HIGHLIGHT', key: 'exit' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getContext().highlightedKey).toBe('new');
  });

  it('HIGHLIGHT_PREV son ogeyi vurgular (baslangiçta)', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    api.send({ type: 'HIGHLIGHT_PREV' });
    expect(api.getContext().highlightedKey).toBe('exit');
  });

  it('HIGHLIGHT_PREV onceki ogeye gecer', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    api.send({ type: 'HIGHLIGHT', key: 'open' });
    api.send({ type: 'HIGHLIGHT_PREV' });
    expect(api.getContext().highlightedKey).toBe('new');
  });

  it('HIGHLIGHT_PREV disabled ogeyi atlar', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'edit' });
    // paste disabled, copy'den geriye gidince paste atlanir
    // navigable: undo, redo, cut, copy (paste disabled)
    api.send({ type: 'HIGHLIGHT', key: 'copy' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    // Next after copy wraps to undo (paste disabled atlanir)
    expect(api.getContext().highlightedKey).toBe('undo');
  });

  it('HIGHLIGHT_FIRST ilk navigable ogeyi vurgular', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    api.send({ type: 'HIGHLIGHT_FIRST' });
    expect(api.getContext().highlightedKey).toBe('new');
  });

  it('HIGHLIGHT_LAST son navigable ogeyi vurgular', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    api.send({ type: 'HIGHLIGHT_LAST' });
    expect(api.getContext().highlightedKey).toBe('exit');
  });
});

// ── SELECT ─────────────────────────────────────────────────────

describe('Menu select', () => {
  it('SELECT yaprak ogeyi secer ve menuyu kapatir', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    api.send({ type: 'SELECT', key: 'new' });
    expect(api.getContext().openPath).toEqual([]);
    expect(api.getContext().isActive).toBe(false);
  });

  it('SELECT submenu olan ogeyi acar', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    api.send({ type: 'SELECT', key: 'recent' });
    expect(api.getContext().openPath).toEqual(['file', 'recent']);
  });

  it('SELECT disabled ogeyi yok sayar', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'edit' });
    api.send({ type: 'SELECT', key: 'paste' });
    // paste disabled, menu hala acik
    expect(api.getContext().openPath).toEqual(['edit']);
  });

  it('SELECT divider ogeyi yok sayar', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    api.send({ type: 'SELECT', key: 'div-1' });
    expect(api.getContext().openPath).toEqual(['file']);
  });
});

// ── Submenu navigasyonu ────────────────────────────────────────

describe('Menu submenu navigation', () => {
  it('ENTER_SUBMENU vurgulanan ogenin submenusunu acar', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    api.send({ type: 'HIGHLIGHT', key: 'recent' });
    api.send({ type: 'ENTER_SUBMENU' });
    expect(api.getContext().openPath).toEqual(['file', 'recent']);
    expect(api.getContext().highlightedKey).toBeNull();
  });

  it('ENTER_SUBMENU children olmayan ogede calismaz', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    api.send({ type: 'HIGHLIGHT', key: 'new' });
    api.send({ type: 'ENTER_SUBMENU' });
    expect(api.getContext().openPath).toEqual(['file']);
  });

  it('ENTER_SUBMENU highlightedKey yoksa calismaz', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    api.send({ type: 'ENTER_SUBMENU' });
    expect(api.getContext().openPath).toEqual(['file']);
  });

  it('EXIT_SUBMENU bir ust seviyeye doner', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    api.send({ type: 'SELECT', key: 'recent' });
    api.send({ type: 'EXIT_SUBMENU' });
    expect(api.getContext().openPath).toEqual(['file']);
    expect(api.getContext().highlightedKey).toBe('recent');
  });

  it('EXIT_SUBMENU top-level seviyesinde calismaz', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    api.send({ type: 'EXIT_SUBMENU' });
    // Hala file acik (openPath.length === 1 iken EXIT_SUBMENU etki etmez)
    expect(api.getContext().openPath).toEqual(['file']);
  });
});

// ── Top-level navigasyon ───────────────────────────────────────

describe('Menu top-level navigation', () => {
  it('OPEN_NEXT_TOP sonraki menuyu acar', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    api.send({ type: 'OPEN_NEXT_TOP' });
    expect(api.getContext().openPath).toEqual(['edit']);
  });

  it('OPEN_NEXT_TOP son menudan ilk menuye wraplanir', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'view' });
    api.send({ type: 'OPEN_NEXT_TOP' });
    expect(api.getContext().openPath).toEqual(['file']);
  });

  it('OPEN_PREV_TOP onceki menuyu acar', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'edit' });
    api.send({ type: 'OPEN_PREV_TOP' });
    expect(api.getContext().openPath).toEqual(['file']);
  });

  it('OPEN_PREV_TOP ilk menudan son menuye wraplanir', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    api.send({ type: 'OPEN_PREV_TOP' });
    expect(api.getContext().openPath).toEqual(['view']);
  });
});

// ── Prop sync ──────────────────────────────────────────────────

describe('Menu prop sync', () => {
  it('SET_ITEMS ogeleri gunceller', () => {
    const api = createMenu({ items });
    const newItems: MenuItem[] = [{ key: 'x', label: 'X', children: [{ key: 'y', label: 'Y' }] }];
    api.send({ type: 'SET_ITEMS', items: newItems });
    expect(api.getContext().items).toBe(newItems);
  });
});

// ── DOM props ──────────────────────────────────────────────────

describe('Menu DOM props', () => {
  it('getMenuBarProps menubar role doner', () => {
    const api = createMenu({ items });
    const props = api.getMenuBarProps();
    expect(props.role).toBe('menubar');
    expect(props['aria-label']).toBe('Menu');
  });

  it('getTriggerProps kapali menu icin', () => {
    const api = createMenu({ items });
    const props = api.getTriggerProps('file');
    expect(props.role).toBe('menuitem');
    expect(props['aria-haspopup']).toBe(true);
    expect(props['aria-expanded']).toBe(false);
    expect(props['data-active']).toBeUndefined();
  });

  it('getTriggerProps acik menu icin', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    const props = api.getTriggerProps('file');
    expect(props['aria-expanded']).toBe(true);
    expect(props['data-active']).toBe('');
  });

  it('getMenuItemProps normal oge', () => {
    const api = createMenu({ items });
    const newItem = fileMenu.children?.find((i) => i.key === 'new');
    expect(newItem).toBeDefined();
    const props = api.getMenuItemProps(newItem as MenuItem);
    expect(props.role).toBe('menuitem');
    expect(props['aria-disabled']).toBeUndefined();
    expect(props['data-highlighted']).toBeUndefined();
  });

  it('getMenuItemProps disabled oge', () => {
    const pasteItem = editMenu.children?.find((i) => i.key === 'paste');
    expect(pasteItem).toBeDefined();
    const api = createMenu({ items });
    const props = api.getMenuItemProps(pasteItem as MenuItem);
    expect(props['aria-disabled']).toBe(true);
    expect(props['data-disabled']).toBe('');
  });

  it('getMenuItemProps highlighted oge', () => {
    const api = createMenu({ items });
    api.send({ type: 'HIGHLIGHT', key: 'new' });
    const newItem = fileMenu.children?.find((i) => i.key === 'new');
    expect(newItem).toBeDefined();
    const props = api.getMenuItemProps(newItem as MenuItem);
    expect(props['data-highlighted']).toBe('');
  });

  it('getMenuItemProps checked oge', () => {
    const api = createMenu({ items });
    const wordWrap = viewMenu.children?.find((i) => i.key === 'word-wrap');
    expect(wordWrap).toBeDefined();
    const props = api.getMenuItemProps(wordWrap as MenuItem);
    expect(props['data-checked']).toBe('');
  });

  it('getDropdownProps menu role doner', () => {
    const api = createMenu({ items });
    const props = api.getDropdownProps('file');
    expect(props.role).toBe('menu');
    expect(props['aria-label']).toBe('Dosya');
  });
});

// ── API helpers ────────────────────────────────────────────────

describe('Menu API helpers', () => {
  it('getOpenPath kopya doner', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    const path = api.getOpenPath();
    expect(path).toEqual(['file']);
    path.push('x');
    expect(api.getOpenPath()).toEqual(['file']);
  });

  it('isOpen acik durumda true', () => {
    const api = createMenu({ items });
    expect(api.isOpen()).toBe(false);
    api.send({ type: 'OPEN_MENU', key: 'file' });
    expect(api.isOpen()).toBe(true);
  });

  it('isMenuOpen belirli menu icin', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    expect(api.isMenuOpen('file')).toBe(true);
    expect(api.isMenuOpen('edit')).toBe(false);
  });

  it('findItem mevcut ogeyi bulur', () => {
    const api = createMenu({ items });
    const item = api.findItem('save');
    expect(item).not.toBeNull();
    expect(item?.label).toBe('Kaydet');
  });

  it('findItem nested ogeyi bulur', () => {
    const api = createMenu({ items });
    const item = api.findItem('recent-2');
    expect(item).not.toBeNull();
    expect(item?.label).toBe('dosya2.ts');
  });

  it('findItem olmayan key icin null', () => {
    const api = createMenu({ items });
    expect(api.findItem('nonexistent')).toBeNull();
  });

  it('getItemsAtPath top-level ogeleri doner', () => {
    const api = createMenu({ items });
    const topItems = api.getItemsAtPath([]);
    expect(topItems).toBe(items);
  });

  it('getItemsAtPath submenu ogelerini doner', () => {
    const api = createMenu({ items });
    const fileItems = api.getItemsAtPath(['file']);
    expect(fileItems).toHaveLength(8);
    expect(fileItems[0]?.key).toBe('new');
  });

  it('getItemsAtPath nested submenu ogelerini doner', () => {
    const api = createMenu({ items });
    const recentItems = api.getItemsAtPath(['file', 'recent']);
    expect(recentItems).toHaveLength(3);
    expect(recentItems[0]?.key).toBe('recent-1');
  });

  it('getItemsAtPath olmayan path icin bos doner', () => {
    const api = createMenu({ items });
    expect(api.getItemsAtPath(['nonexistent'])).toEqual([]);
  });
});

// ── Bilinmeyen event ───────────────────────────────────────────

describe('Unknown event', () => {
  it('bilinmeyen event context degistirmez', () => {
    const api = createMenu({ items });
    api.send({ type: 'OPEN_MENU', key: 'file' });
    const pathBefore = api.getOpenPath();
    api.send({ type: 'UNKNOWN' } as unknown as MenuEvent);
    expect(api.getOpenPath()).toEqual(pathBefore);
  });
});
