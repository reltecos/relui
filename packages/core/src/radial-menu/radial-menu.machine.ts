/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * createRadialMenu — framework-agnostic radial menu state machine.
 * createRadialMenu — framework bagimsiz dairesel menu state machine.
 *
 * Blender/Maya tarzi pie menu icin durum yonetimi.
 *
 * @packageDocumentation
 */

import type {
  RadialMenuProps,
  RadialMenuEvent,
  RadialMenuMachineContext,
  RadialMenuItem,
  RadialMenuDOMProps,
  RadialMenuSectorDOMProps,
  SectorInfo,
} from './radial-menu.types';

/**
 * RadialMenu API tipi / RadialMenu API type.
 */
export interface RadialMenuAPI {
  /** Mevcut context / Current context */
  getContext: () => RadialMenuMachineContext;

  /** Event gonder / Send event */
  send: (event: RadialMenuEvent) => RadialMenuMachineContext;

  /** Menu DOM attribute'lari / Menu DOM attributes */
  getMenuProps: () => RadialMenuDOMProps;

  /** Sektor DOM attribute'lari / Sector DOM attributes */
  getSectorProps: (index: number) => RadialMenuSectorDOMProps;

  /** Acik mi / Is open */
  isOpen: () => boolean;

  /** Vurgulanan sektor / Highlighted sector index */
  getHighlightedIndex: () => number;

  /** Sektor bilgileri / Sector infos */
  getSectors: () => SectorInfo[];

  /** Aktif seviyedeki ogeler / Items at current level */
  getCurrentItems: () => RadialMenuItem[];

  /** Mouse acisina gore sektor indeksi hesapla / Calculate sector index from angle */
  getSectorIndexFromAngle: (angleDeg: number) => number;

  /** Iki nokta arasi aci hesapla / Calculate angle between two points */
  getAngle: (cx: number, cy: number, mx: number, my: number) => number;

  /** Key ile oge bul / Find item by key */
  findItem: (key: string) => RadialMenuItem | null;

  /** Submenu acik mi / Is in submenu */
  isInSubmenu: () => boolean;
}

/**
 * Aci normalizasyonu (0-360 arasi) / Normalize angle to 0-360.
 */
function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

/**
 * Iki nokta arasi aci hesapla (derece).
 * 0 = sag, 90 = asagi, 180 = sol, 270 = yukari.
 * Saat yonunde, 12 saat = -90 (yani 270).
 */
function calculateAngle(cx: number, cy: number, mx: number, my: number): number {
  const dx = mx - cx;
  const dy = my - cy;
  const rad = Math.atan2(dy, dx);
  return normalizeAngle((rad * 180) / Math.PI);
}

/**
 * Mouse acisina gore hangi sektor'a denk geldigini hesapla.
 * Sektorler ust noktadan (270 derece) baslayip saat yonunde dagitilir.
 */
function getSectorIndexFromAngle(angleDeg: number, itemCount: number): number {
  if (itemCount <= 0) return -1;
  const sectorSize = 360 / itemCount;
  // Offset: ilk sektor 270 derece (12 saat yonu) ortali
  const adjusted = normalizeAngle(angleDeg - 270 + sectorSize / 2);
  return Math.floor(adjusted / sectorSize) % itemCount;
}

/**
 * Ogeler arasinda key ile recursive arama.
 */
function findItemByKey(items: RadialMenuItem[], key: string): RadialMenuItem | null {
  for (const item of items) {
    if (item.key === key) return item;
    if (item.children) {
      const found = findItemByKey(item.children, key);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Sektor bilgilerini hesapla.
 */
function calculateSectors(items: RadialMenuItem[]): SectorInfo[] {
  const count = items.length;
  if (count === 0) return [];

  const sectorSize = 360 / count;
  // Ilk sektor 270 derecede (12 saat) ortalanir
  const startOffset = 270 - sectorSize / 2;

  return items.map((item, index) => {
    const startAngle = normalizeAngle(startOffset + index * sectorSize);
    const endAngle = normalizeAngle(startAngle + sectorSize);
    const midAngle = normalizeAngle(startAngle + sectorSize / 2);
    return { index, startAngle, endAngle, midAngle, item };
  });
}

/**
 * RadialMenu state machine olusturur.
 */
export function createRadialMenu(props: RadialMenuProps): RadialMenuAPI {
  // ── Mutable context ──
  const ctx: RadialMenuMachineContext = {
    items: props.items,
    open: false,
    position: { x: 0, y: 0 },
    highlightedIndex: -1,
    submenuPath: [],
  };

  // ── Helpers ──

  function getCurrentItems(): RadialMenuItem[] {
    let current = ctx.items;
    for (const key of ctx.submenuPath) {
      const found = current.find((i) => i.key === key);
      if (found && found.children) {
        current = found.children;
      } else {
        return [];
      }
    }
    return current;
  }

  function getNavigableIndices(): number[] {
    const items = getCurrentItems();
    const indices: number[] = [];
    items.forEach((item, i) => {
      if (!item.disabled) indices.push(i);
    });
    return indices;
  }

  // ── Transition ──
  function send(event: RadialMenuEvent): RadialMenuMachineContext {
    switch (event.type) {
      case 'OPEN': {
        ctx.open = true;
        ctx.position = { ...event.position };
        ctx.highlightedIndex = -1;
        ctx.submenuPath = [];
        break;
      }

      case 'CLOSE': {
        ctx.open = false;
        ctx.highlightedIndex = -1;
        ctx.submenuPath = [];
        break;
      }

      case 'HIGHLIGHT_SECTOR': {
        if (!ctx.open) break;
        const items = getCurrentItems();
        if (event.index >= 0 && event.index < items.length) {
          const item = items[event.index];
          if (item && !item.disabled) {
            ctx.highlightedIndex = event.index;
          }
        } else {
          ctx.highlightedIndex = -1;
        }
        break;
      }

      case 'HIGHLIGHT_NEXT': {
        if (!ctx.open) break;
        const navIndices = getNavigableIndices();
        if (navIndices.length === 0) break;

        if (ctx.highlightedIndex === -1) {
          const first = navIndices[0];
          if (first !== undefined) ctx.highlightedIndex = first;
        } else {
          const currentNavIdx = navIndices.indexOf(ctx.highlightedIndex);
          const nextNavIdx = (currentNavIdx + 1) % navIndices.length;
          const next = navIndices[nextNavIdx];
          if (next !== undefined) ctx.highlightedIndex = next;
        }
        break;
      }

      case 'HIGHLIGHT_PREV': {
        if (!ctx.open) break;
        const navIndices = getNavigableIndices();
        if (navIndices.length === 0) break;

        if (ctx.highlightedIndex === -1) {
          const last = navIndices[navIndices.length - 1];
          if (last !== undefined) ctx.highlightedIndex = last;
        } else {
          const currentNavIdx = navIndices.indexOf(ctx.highlightedIndex);
          const prevNavIdx = (currentNavIdx - 1 + navIndices.length) % navIndices.length;
          const prev = navIndices[prevNavIdx];
          if (prev !== undefined) ctx.highlightedIndex = prev;
        }
        break;
      }

      case 'SELECT': {
        if (!ctx.open || ctx.highlightedIndex === -1) break;
        const items = getCurrentItems();
        const item = items[ctx.highlightedIndex];
        if (!item || item.disabled) break;

        if (item.children && item.children.length > 0) {
          // Submenu ac
          ctx.submenuPath = [...ctx.submenuPath, item.key];
          ctx.highlightedIndex = -1;
        } else {
          // Yaprak oge — kapat
          ctx.open = false;
          ctx.highlightedIndex = -1;
          ctx.submenuPath = [];
        }
        break;
      }

      case 'SELECT_INDEX': {
        if (!ctx.open) break;
        const items = getCurrentItems();
        const item = items[event.index];
        if (!item || item.disabled) break;

        if (item.children && item.children.length > 0) {
          ctx.submenuPath = [...ctx.submenuPath, item.key];
          ctx.highlightedIndex = -1;
        } else {
          ctx.open = false;
          ctx.highlightedIndex = -1;
          ctx.submenuPath = [];
        }
        break;
      }

      case 'ENTER_SUBMENU': {
        if (!ctx.open || ctx.highlightedIndex === -1) break;
        const items = getCurrentItems();
        const item = items[ctx.highlightedIndex];
        if (item && item.children && item.children.length > 0 && !item.disabled) {
          ctx.submenuPath = [...ctx.submenuPath, item.key];
          ctx.highlightedIndex = -1;
        }
        break;
      }

      case 'EXIT_SUBMENU': {
        if (ctx.submenuPath.length > 0) {
          ctx.submenuPath = ctx.submenuPath.slice(0, -1);
          ctx.highlightedIndex = -1;
        }
        break;
      }

      case 'SET_ITEMS': {
        ctx.items = event.items;
        ctx.submenuPath = [];
        ctx.highlightedIndex = -1;
        break;
      }
    }

    return ctx;
  }

  // ── DOM props ──

  function getMenuProps(): RadialMenuDOMProps {
    return {
      role: 'menu',
      'aria-label': 'Radial Menu',
    };
  }

  function getSectorProps(index: number): RadialMenuSectorDOMProps {
    const items = getCurrentItems();
    const item = items[index];
    const isDisabled = item ? !!item.disabled : false;
    const isHighlighted = ctx.highlightedIndex === index;

    return {
      role: 'menuitem',
      'aria-label': item ? item.label : '',
      'aria-disabled': isDisabled ? true : undefined,
      'data-disabled': isDisabled ? '' : undefined,
      'data-highlighted': isHighlighted ? '' : undefined,
      'data-index': index,
    };
  }

  // ── Public API ──
  return {
    getContext: () => ctx,
    send,
    getMenuProps,
    getSectorProps,
    isOpen: () => ctx.open,
    getHighlightedIndex: () => ctx.highlightedIndex,
    getSectors: () => calculateSectors(getCurrentItems()),
    getCurrentItems,
    getSectorIndexFromAngle: (angleDeg: number) =>
      getSectorIndexFromAngle(angleDeg, getCurrentItems().length),
    getAngle: calculateAngle,
    findItem: (key: string) => findItemByKey(ctx.items, key),
    isInSubmenu: () => ctx.submenuPath.length > 0,
  };
}
