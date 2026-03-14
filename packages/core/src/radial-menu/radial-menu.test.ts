/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createRadialMenu } from './radial-menu.machine';
import type { RadialMenuItem, RadialMenuEvent } from './radial-menu.types';

// ── Test verileri ──────────────────────────────────────────────

const basicItems: RadialMenuItem[] = [
  { key: 'cut', label: 'Kes' },
  { key: 'copy', label: 'Kopyala' },
  { key: 'paste', label: 'Yapistir' },
  { key: 'delete', label: 'Sil' },
];

const mixedItems: RadialMenuItem[] = [
  { key: 'a', label: 'A' },
  { key: 'b', label: 'B', disabled: true },
  { key: 'c', label: 'C' },
  { key: 'd', label: 'D' },
];

const submenuItems: RadialMenuItem[] = [
  { key: 'file', label: 'Dosya', children: [
    { key: 'new', label: 'Yeni' },
    { key: 'open', label: 'Ac' },
    { key: 'save', label: 'Kaydet' },
  ]},
  { key: 'edit', label: 'Duzenle' },
  { key: 'view', label: 'Goruntu' },
];

const deepSubmenuItems: RadialMenuItem[] = [
  { key: 'root1', label: 'R1', children: [
    { key: 'child1', label: 'C1', children: [
      { key: 'grandchild1', label: 'GC1' },
      { key: 'grandchild2', label: 'GC2' },
    ]},
    { key: 'child2', label: 'C2' },
  ]},
  { key: 'root2', label: 'R2' },
];

// ── Olusturma ──────────────────────────────────────────────────

describe('createRadialMenu', () => {
  it('varsayilan degerlerle olusturulur', () => {
    const api = createRadialMenu({ items: basicItems });
    const ctx = api.getContext();
    expect(ctx.items).toBe(basicItems);
    expect(ctx.open).toBe(false);
    expect(ctx.position).toEqual({ x: 0, y: 0 });
    expect(ctx.highlightedIndex).toBe(-1);
    expect(ctx.submenuPath).toEqual([]);
  });

  it('bos items ile olusturulur', () => {
    const api = createRadialMenu({ items: [] });
    expect(api.getContext().items).toEqual([]);
  });

  it('tek item ile olusturulur', () => {
    const api = createRadialMenu({ items: [{ key: 'x', label: 'X' }] });
    expect(api.getContext().items).toHaveLength(1);
  });
});

// ── OPEN / CLOSE ──────────────────────────────────────────────

describe('RadialMenu open/close', () => {
  it('OPEN menuyu acar ve pozisyonu ayarlar', () => {
    const api = createRadialMenu({ items: basicItems });
    api.send({ type: 'OPEN', position: { x: 100, y: 200 } });
    const ctx = api.getContext();
    expect(ctx.open).toBe(true);
    expect(ctx.position).toEqual({ x: 100, y: 200 });
    expect(ctx.highlightedIndex).toBe(-1);
    expect(ctx.submenuPath).toEqual([]);
  });

  it('OPEN onceki durumu sifirlar', () => {
    const api = createRadialMenu({ items: submenuItems });
    api.send({ type: 'OPEN', position: { x: 50, y: 50 } });
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 0 });
    api.send({ type: 'SELECT' }); // submenu acar
    // Tekrar OPEN
    api.send({ type: 'OPEN', position: { x: 200, y: 300 } });
    const ctx = api.getContext();
    expect(ctx.position).toEqual({ x: 200, y: 300 });
    expect(ctx.highlightedIndex).toBe(-1);
    expect(ctx.submenuPath).toEqual([]);
  });

  it('CLOSE menuyu kapatir', () => {
    const api = createRadialMenu({ items: basicItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 1 });
    api.send({ type: 'CLOSE' });
    const ctx = api.getContext();
    expect(ctx.open).toBe(false);
    expect(ctx.highlightedIndex).toBe(-1);
    expect(ctx.submenuPath).toEqual([]);
  });

  it('CLOSE kapali menuyu etkilemez', () => {
    const api = createRadialMenu({ items: basicItems });
    api.send({ type: 'CLOSE' });
    expect(api.getContext().open).toBe(false);
  });

  it('isOpen dogru deger doner', () => {
    const api = createRadialMenu({ items: basicItems });
    expect(api.isOpen()).toBe(false);
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    expect(api.isOpen()).toBe(true);
    api.send({ type: 'CLOSE' });
    expect(api.isOpen()).toBe(false);
  });
});

// ── HIGHLIGHT_SECTOR ──────────────────────────────────────────

describe('RadialMenu HIGHLIGHT_SECTOR', () => {
  it('gecerli index vurgular', () => {
    const api = createRadialMenu({ items: basicItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 2 });
    expect(api.getHighlightedIndex()).toBe(2);
  });

  it('negatif index vurguyu temizler', () => {
    const api = createRadialMenu({ items: basicItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 1 });
    api.send({ type: 'HIGHLIGHT_SECTOR', index: -1 });
    expect(api.getHighlightedIndex()).toBe(-1);
  });

  it('sinir disi index vurguyu temizler', () => {
    const api = createRadialMenu({ items: basicItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 1 });
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 10 });
    expect(api.getHighlightedIndex()).toBe(-1);
  });

  it('disabled oge vurgulanmaz', () => {
    const api = createRadialMenu({ items: mixedItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 1 }); // B disabled
    expect(api.getHighlightedIndex()).toBe(-1);
  });

  it('menu kapali iken calismaz', () => {
    const api = createRadialMenu({ items: basicItems });
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 0 });
    expect(api.getHighlightedIndex()).toBe(-1);
  });
});

// ── HIGHLIGHT_NEXT / HIGHLIGHT_PREV ───────────────────────────

describe('RadialMenu HIGHLIGHT_NEXT', () => {
  it('baslangiçta ilk ogeyi vurgular', () => {
    const api = createRadialMenu({ items: basicItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getHighlightedIndex()).toBe(0);
  });

  it('sonraki ogeye gecer', () => {
    const api = createRadialMenu({ items: basicItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 0 });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getHighlightedIndex()).toBe(1);
  });

  it('son ogeden ilk ogeye wraplanir', () => {
    const api = createRadialMenu({ items: basicItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 3 }); // son
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getHighlightedIndex()).toBe(0);
  });

  it('disabled ogeyi atlar', () => {
    const api = createRadialMenu({ items: mixedItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 0 }); // A
    api.send({ type: 'HIGHLIGHT_NEXT' });
    // B disabled, C'ye atlar
    expect(api.getHighlightedIndex()).toBe(2);
  });

  it('menu kapali iken calismaz', () => {
    const api = createRadialMenu({ items: basicItems });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getHighlightedIndex()).toBe(-1);
  });

  it('tum ogeler disabled ise calismaz', () => {
    const allDisabled: RadialMenuItem[] = [
      { key: 'a', label: 'A', disabled: true },
      { key: 'b', label: 'B', disabled: true },
    ];
    const api = createRadialMenu({ items: allDisabled });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getHighlightedIndex()).toBe(-1);
  });
});

describe('RadialMenu HIGHLIGHT_PREV', () => {
  it('baslangiçta son ogeyi vurgular', () => {
    const api = createRadialMenu({ items: basicItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'HIGHLIGHT_PREV' });
    expect(api.getHighlightedIndex()).toBe(3);
  });

  it('onceki ogeye gecer', () => {
    const api = createRadialMenu({ items: basicItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 2 });
    api.send({ type: 'HIGHLIGHT_PREV' });
    expect(api.getHighlightedIndex()).toBe(1);
  });

  it('ilk ogeden son ogeye wraplanir', () => {
    const api = createRadialMenu({ items: basicItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 0 });
    api.send({ type: 'HIGHLIGHT_PREV' });
    expect(api.getHighlightedIndex()).toBe(3);
  });

  it('disabled ogeyi atlar', () => {
    const api = createRadialMenu({ items: mixedItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 2 }); // C
    api.send({ type: 'HIGHLIGHT_PREV' });
    // B disabled, A'ya atlar
    expect(api.getHighlightedIndex()).toBe(0);
  });

  it('menu kapali iken calismaz', () => {
    const api = createRadialMenu({ items: basicItems });
    api.send({ type: 'HIGHLIGHT_PREV' });
    expect(api.getHighlightedIndex()).toBe(-1);
  });
});

// ── SELECT ────────────────────────────────────────────────────

describe('RadialMenu SELECT', () => {
  it('yaprak oge secer ve menuyu kapatir', () => {
    const api = createRadialMenu({ items: basicItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 1 });
    api.send({ type: 'SELECT' });
    expect(api.isOpen()).toBe(false);
    expect(api.getHighlightedIndex()).toBe(-1);
    expect(api.getContext().submenuPath).toEqual([]);
  });

  it('submenu olan oge submenu acar', () => {
    const api = createRadialMenu({ items: submenuItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 0 }); // file — children var
    api.send({ type: 'SELECT' });
    expect(api.isOpen()).toBe(true);
    expect(api.getContext().submenuPath).toEqual(['file']);
    expect(api.getHighlightedIndex()).toBe(-1);
  });

  it('vurgu yokken calismaz', () => {
    const api = createRadialMenu({ items: basicItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'SELECT' });
    expect(api.isOpen()).toBe(true); // hala acik
  });

  it('disabled ogede calismaz', () => {
    const api = createRadialMenu({ items: mixedItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    // Highlight'i zorla ayarla (B disabled, ama dogrudan index verelim)
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 0 }); // A, enabled
    api.send({ type: 'SELECT' });
    // A yaprak, menu kapanir
    expect(api.isOpen()).toBe(false);
  });

  it('menu kapali iken calismaz', () => {
    const api = createRadialMenu({ items: basicItems });
    api.send({ type: 'SELECT' });
    expect(api.isOpen()).toBe(false);
  });
});

// ── SELECT_INDEX ──────────────────────────────────────────────

describe('RadialMenu SELECT_INDEX', () => {
  it('yaprak ogeyi index ile secer ve kapatir', () => {
    const api = createRadialMenu({ items: basicItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'SELECT_INDEX', index: 2 });
    expect(api.isOpen()).toBe(false);
  });

  it('submenu olan ogeyi index ile acar', () => {
    const api = createRadialMenu({ items: submenuItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'SELECT_INDEX', index: 0 }); // file
    expect(api.getContext().submenuPath).toEqual(['file']);
    expect(api.isOpen()).toBe(true);
  });

  it('disabled index ile calismaz', () => {
    const api = createRadialMenu({ items: mixedItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'SELECT_INDEX', index: 1 }); // B disabled
    expect(api.isOpen()).toBe(true); // kapanmaz
    expect(api.getContext().submenuPath).toEqual([]);
  });

  it('menu kapali iken calismaz', () => {
    const api = createRadialMenu({ items: basicItems });
    api.send({ type: 'SELECT_INDEX', index: 0 });
    expect(api.isOpen()).toBe(false);
  });
});

// ── ENTER_SUBMENU / EXIT_SUBMENU ─────────────────────────────

describe('RadialMenu submenu navigation', () => {
  it('ENTER_SUBMENU vurgulanan ogenin submenusunu acar', () => {
    const api = createRadialMenu({ items: submenuItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 0 }); // file — children var
    api.send({ type: 'ENTER_SUBMENU' });
    expect(api.getContext().submenuPath).toEqual(['file']);
    expect(api.getHighlightedIndex()).toBe(-1);
  });

  it('ENTER_SUBMENU children olmayan ogede calismaz', () => {
    const api = createRadialMenu({ items: submenuItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 1 }); // edit — children yok
    api.send({ type: 'ENTER_SUBMENU' });
    expect(api.getContext().submenuPath).toEqual([]);
  });

  it('ENTER_SUBMENU vurgu yokken calismaz', () => {
    const api = createRadialMenu({ items: submenuItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'ENTER_SUBMENU' });
    expect(api.getContext().submenuPath).toEqual([]);
  });

  it('ENTER_SUBMENU disabled ogede calismaz', () => {
    const disabledSubItems: RadialMenuItem[] = [
      { key: 'x', label: 'X', disabled: true, children: [{ key: 'y', label: 'Y' }] },
    ];
    const api = createRadialMenu({ items: disabledSubItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    // disabled oge highlight edilemez, ama dogrudan ENTER_SUBMENU cagiralim
    api.send({ type: 'ENTER_SUBMENU' });
    expect(api.getContext().submenuPath).toEqual([]);
  });

  it('EXIT_SUBMENU bir ust seviyeye doner', () => {
    const api = createRadialMenu({ items: submenuItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 0 });
    api.send({ type: 'ENTER_SUBMENU' });
    expect(api.getContext().submenuPath).toEqual(['file']);
    api.send({ type: 'EXIT_SUBMENU' });
    expect(api.getContext().submenuPath).toEqual([]);
    expect(api.getHighlightedIndex()).toBe(-1);
  });

  it('EXIT_SUBMENU root seviyesinde calismaz', () => {
    const api = createRadialMenu({ items: submenuItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'EXIT_SUBMENU' });
    expect(api.getContext().submenuPath).toEqual([]);
  });

  it('derin submenu navigasyonu', () => {
    const api = createRadialMenu({ items: deepSubmenuItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    // root1 sec (children var)
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 0 });
    api.send({ type: 'ENTER_SUBMENU' });
    expect(api.getContext().submenuPath).toEqual(['root1']);
    // child1 sec (children var)
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 0 });
    api.send({ type: 'ENTER_SUBMENU' });
    expect(api.getContext().submenuPath).toEqual(['root1', 'child1']);
    // Geri don
    api.send({ type: 'EXIT_SUBMENU' });
    expect(api.getContext().submenuPath).toEqual(['root1']);
    api.send({ type: 'EXIT_SUBMENU' });
    expect(api.getContext().submenuPath).toEqual([]);
  });

  it('isInSubmenu dogru deger doner', () => {
    const api = createRadialMenu({ items: submenuItems });
    expect(api.isInSubmenu()).toBe(false);
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    expect(api.isInSubmenu()).toBe(false);
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 0 });
    api.send({ type: 'ENTER_SUBMENU' });
    expect(api.isInSubmenu()).toBe(true);
  });

  it('submenu icinde getCurrentItems dogru ogeler doner', () => {
    const api = createRadialMenu({ items: submenuItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    expect(api.getCurrentItems()).toBe(submenuItems);
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 0 });
    api.send({ type: 'ENTER_SUBMENU' });
    const subItems = api.getCurrentItems();
    expect(subItems).toHaveLength(3);
    expect(subItems[0]?.key).toBe('new');
  });
});

// ── SET_ITEMS ─────────────────────────────────────────────────

describe('RadialMenu SET_ITEMS', () => {
  it('ogeleri gunceller ve durumu sifirlar', () => {
    const api = createRadialMenu({ items: basicItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 1 });
    const newItems: RadialMenuItem[] = [
      { key: 'x', label: 'X' },
      { key: 'y', label: 'Y' },
    ];
    api.send({ type: 'SET_ITEMS', items: newItems });
    const ctx = api.getContext();
    expect(ctx.items).toBe(newItems);
    expect(ctx.submenuPath).toEqual([]);
    expect(ctx.highlightedIndex).toBe(-1);
  });
});

// ── Aci hesaplamalari ─────────────────────────────────────────

describe('RadialMenu angle calculations', () => {
  it('getAngle sag yonu 0 derece doner', () => {
    const api = createRadialMenu({ items: basicItems });
    // Sag: mx > cx, dy = 0
    const angle = api.getAngle(100, 100, 200, 100);
    expect(angle).toBeCloseTo(0, 1);
  });

  it('getAngle asagi yonu 90 derece doner', () => {
    const api = createRadialMenu({ items: basicItems });
    const angle = api.getAngle(100, 100, 100, 200);
    expect(angle).toBeCloseTo(90, 1);
  });

  it('getAngle sol yonu 180 derece doner', () => {
    const api = createRadialMenu({ items: basicItems });
    const angle = api.getAngle(100, 100, 0, 100);
    expect(angle).toBeCloseTo(180, 1);
  });

  it('getAngle yukari yonu 270 derece doner', () => {
    const api = createRadialMenu({ items: basicItems });
    const angle = api.getAngle(100, 100, 100, 0);
    expect(angle).toBeCloseTo(270, 1);
  });

  it('getAngle capraz aci hesaplar', () => {
    const api = createRadialMenu({ items: basicItems });
    // Sag-asagi 45 derece
    const angle = api.getAngle(0, 0, 100, 100);
    expect(angle).toBeCloseTo(45, 1);
  });
});

describe('RadialMenu sector index from angle', () => {
  it('4 sektor ile 12 saat yonu index 0 doner', () => {
    const api = createRadialMenu({ items: basicItems });
    // 270 derece = 12 saat yonu = sektor 0
    const idx = api.getSectorIndexFromAngle(270);
    expect(idx).toBe(0);
  });

  it('4 sektor ile sag yonu index 1 doner', () => {
    const api = createRadialMenu({ items: basicItems });
    // 0/360 derece = sag = sektor 1
    const idx = api.getSectorIndexFromAngle(0);
    expect(idx).toBe(1);
  });

  it('4 sektor ile asagi yonu index 2 doner', () => {
    const api = createRadialMenu({ items: basicItems });
    // 90 derece = asagi = sektor 2
    const idx = api.getSectorIndexFromAngle(90);
    expect(idx).toBe(2);
  });

  it('4 sektor ile sol yonu index 3 doner', () => {
    const api = createRadialMenu({ items: basicItems });
    // 180 derece = sol = sektor 3
    const idx = api.getSectorIndexFromAngle(180);
    expect(idx).toBe(3);
  });

  it('bos items icin -1 doner', () => {
    const api = createRadialMenu({ items: [] });
    const idx = api.getSectorIndexFromAngle(90);
    expect(idx).toBe(-1);
  });

  it('sinir acilarinda dogru sektor doner', () => {
    const api = createRadialMenu({ items: basicItems });
    // 4 sektor, her biri 90 derece
    // Sektor 0: 225-315 (orta: 270)
    // Sinir: 225 derece sektor 0 baslangici
    const idx = api.getSectorIndexFromAngle(225);
    expect(idx).toBe(0);
    // Sinir: 314 derece hala sektor 0
    const idx2 = api.getSectorIndexFromAngle(314);
    expect(idx2).toBe(0);
  });
});

// ── Sektor hesaplamalari ──────────────────────────────────────

describe('RadialMenu sectors', () => {
  it('4 oge icin 4 sektor doner', () => {
    const api = createRadialMenu({ items: basicItems });
    const sectors = api.getSectors();
    expect(sectors).toHaveLength(4);
  });

  it('sektor bilgileri dogru', () => {
    const api = createRadialMenu({ items: basicItems });
    const sectors = api.getSectors();
    // Her sektor 90 derece
    const firstSector = sectors[0];
    expect(firstSector).toBeDefined();
    if (firstSector) {
      expect(firstSector.index).toBe(0);
      expect(firstSector.item).toBe(basicItems[0]);
      // Baslangic: 270 - 45 = 225
      expect(firstSector.startAngle).toBeCloseTo(225, 1);
      // Bitis: 225 + 90 = 315
      expect(firstSector.endAngle).toBeCloseTo(315, 1);
      // Orta: 270
      expect(firstSector.midAngle).toBeCloseTo(270, 1);
    }
  });

  it('bos items icin bos sektor dizi doner', () => {
    const api = createRadialMenu({ items: [] });
    expect(api.getSectors()).toEqual([]);
  });

  it('submenu icinde submenunun sektorlerini doner', () => {
    const api = createRadialMenu({ items: submenuItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 0 });
    api.send({ type: 'ENTER_SUBMENU' });
    const sectors = api.getSectors();
    expect(sectors).toHaveLength(3); // file'in children: new, open, save
  });
});

// ── DOM props ─────────────────────────────────────────────────

describe('RadialMenu DOM props', () => {
  it('getMenuProps menu role doner', () => {
    const api = createRadialMenu({ items: basicItems });
    const props = api.getMenuProps();
    expect(props.role).toBe('menu');
    expect(props['aria-label']).toBe('Radial Menu');
  });

  it('getSectorProps normal oge', () => {
    const api = createRadialMenu({ items: basicItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    const props = api.getSectorProps(0);
    expect(props.role).toBe('menuitem');
    expect(props['aria-label']).toBe('Kes');
    expect(props['data-index']).toBe(0);
    expect(props['aria-disabled']).toBeUndefined();
    expect(props['data-disabled']).toBeUndefined();
    expect(props['data-highlighted']).toBeUndefined();
  });

  it('getSectorProps highlighted oge', () => {
    const api = createRadialMenu({ items: basicItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    api.send({ type: 'HIGHLIGHT_SECTOR', index: 2 });
    const props = api.getSectorProps(2);
    expect(props['data-highlighted']).toBe('');
  });

  it('getSectorProps disabled oge', () => {
    const api = createRadialMenu({ items: mixedItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    const props = api.getSectorProps(1); // B disabled
    expect(props['aria-disabled']).toBe(true);
    expect(props['data-disabled']).toBe('');
  });

  it('getSectorProps sinir disi index', () => {
    const api = createRadialMenu({ items: basicItems });
    const props = api.getSectorProps(10);
    expect(props['aria-label']).toBe('');
  });
});

// ── API helpers ───────────────────────────────────────────────

describe('RadialMenu API helpers', () => {
  it('findItem mevcut ogeyi bulur', () => {
    const api = createRadialMenu({ items: basicItems });
    const item = api.findItem('copy');
    expect(item).not.toBeNull();
    expect(item?.label).toBe('Kopyala');
  });

  it('findItem nested ogeyi bulur', () => {
    const api = createRadialMenu({ items: submenuItems });
    const item = api.findItem('new');
    expect(item).not.toBeNull();
    expect(item?.label).toBe('Yeni');
  });

  it('findItem olmayan key icin null doner', () => {
    const api = createRadialMenu({ items: basicItems });
    expect(api.findItem('nonexistent')).toBeNull();
  });

  it('getCurrentItems root ogelerini doner', () => {
    const api = createRadialMenu({ items: basicItems });
    expect(api.getCurrentItems()).toBe(basicItems);
  });

  it('getHighlightedIndex varsayilan -1', () => {
    const api = createRadialMenu({ items: basicItems });
    expect(api.getHighlightedIndex()).toBe(-1);
  });

  it('getContext kopya degil referans doner', () => {
    const api = createRadialMenu({ items: basicItems });
    const ctx1 = api.getContext();
    const ctx2 = api.getContext();
    expect(ctx1).toBe(ctx2);
  });
});

// ── Bilinmeyen event ──────────────────────────────────────────

describe('RadialMenu unknown event', () => {
  it('bilinmeyen event context degistirmez', () => {
    const api = createRadialMenu({ items: basicItems });
    api.send({ type: 'OPEN', position: { x: 0, y: 0 } });
    const ctxBefore = { ...api.getContext() };
    api.send({ type: 'UNKNOWN' } as unknown as RadialMenuEvent);
    expect(api.getContext().open).toBe(ctxBefore.open);
    expect(api.getContext().highlightedIndex).toBe(ctxBefore.highlightedIndex);
  });
});
