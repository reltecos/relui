/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * createMenu — framework-agnostic menu state machine.
 * createMenu — framework bagimsiz menu state machine.
 *
 * Masaustu tarzi menu cubugu icin durum yonetimi.
 *
 * @packageDocumentation
 */

import type {
  MenuProps,
  MenuEvent,
  MenuMachineContext,
  MenuItem,
  MenuBarDOMProps,
  MenuTriggerDOMProps,
  MenuItemDOMProps,
  MenuDropdownDOMProps,
} from './menu.types';

/**
 * Menu API tipi / Menu API type.
 */
export interface MenuAPI {
  /** Mevcut context / Current context */
  getContext: () => MenuMachineContext;

  /** Event gonder / Send event */
  send: (event: MenuEvent) => MenuMachineContext;

  /** Menubar DOM attribute'lari / Menubar DOM attributes */
  getMenuBarProps: () => MenuBarDOMProps;

  /** Trigger DOM attribute'lari / Trigger DOM attributes */
  getTriggerProps: (key: string) => MenuTriggerDOMProps;

  /** Menu item DOM attribute'lari / Menu item DOM attributes */
  getMenuItemProps: (item: MenuItem) => MenuItemDOMProps;

  /** Dropdown DOM attribute'lari / Dropdown DOM attributes */
  getDropdownProps: (parentKey: string) => MenuDropdownDOMProps;

  /** Acik menu yolu / Open menu path */
  getOpenPath: () => string[];

  /** Menu acik mi / Is any menu open */
  isOpen: () => boolean;

  /** Belirli menu acik mi / Is specific menu open */
  isMenuOpen: (key: string) => boolean;

  /** Key ile oge bul / Find item by key */
  findItem: (key: string) => MenuItem | null;

  /** Belirli seviyedeki ogeleri getir / Get items at specific level */
  getItemsAtPath: (path: string[]) => MenuItem[];
}

/**
 * Ogeler arasinda key ile recursive arama.
 */
function findItemByKey(items: MenuItem[], key: string): MenuItem | null {
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
 * Belirli path'teki ogeleri getir.
 * path = [] → top-level items
 * path = ['file'] → file'in children'i
 * path = ['file', 'recent'] → file > recent'in children'i
 */
function getItemsAtPath(items: MenuItem[], path: string[]): MenuItem[] {
  if (path.length === 0) return items;

  let current = items;
  for (const key of path) {
    const found = current.find((item) => item.key === key);
    if (!found || !found.children) return [];
    current = found.children;
  }
  return current;
}

/**
 * Navigable (divider ve disabled olmayan) ogeleri filtrele.
 */
function getNavigableItems(items: MenuItem[]): MenuItem[] {
  return items.filter((item) => !item.divider && !item.disabled);
}

/**
 * Menu state machine olusturur.
 */
export function createMenu(props: MenuProps): MenuAPI {
  // ── Mutable context ──
  const ctx: MenuMachineContext = {
    items: props.items,
    openPath: [],
    highlightedKey: null,
    isActive: false,
  };

  // ── Helpers ──

  function getCurrentMenuItems(): MenuItem[] {
    return getItemsAtPath(ctx.items, ctx.openPath);
  }

  function getTopLevelNavigable(): MenuItem[] {
    return getNavigableItems(ctx.items);
  }

  // ── Transition ──
  function send(event: MenuEvent): MenuMachineContext {
    switch (event.type) {
      case 'OPEN_MENU': {
        // Top-level menu acma
        const item = ctx.items.find((i) => i.key === event.key);
        if (item && item.children && !item.disabled) {
          ctx.openPath = [event.key];
          ctx.highlightedKey = null;
          ctx.isActive = true;
        }
        break;
      }

      case 'CLOSE_MENU': {
        // Bir seviye geri (ust seviyeye) veya kapat
        if (ctx.openPath.length > 1) {
          ctx.openPath = ctx.openPath.slice(0, -1);
          // Highlight kapanan menu'nun trigger'ina don
          const lastKey = ctx.openPath[ctx.openPath.length - 1];
          ctx.highlightedKey = lastKey ?? null;
        } else {
          ctx.openPath = [];
          ctx.highlightedKey = null;
          ctx.isActive = false;
        }
        break;
      }

      case 'CLOSE_ALL': {
        ctx.openPath = [];
        ctx.highlightedKey = null;
        ctx.isActive = false;
        break;
      }

      case 'TOGGLE_MENU': {
        const isCurrentlyOpen =
          ctx.openPath.length > 0 && ctx.openPath[0] === event.key;
        if (isCurrentlyOpen) {
          ctx.openPath = [];
          ctx.highlightedKey = null;
          ctx.isActive = false;
        } else {
          const item = ctx.items.find((i) => i.key === event.key);
          if (item && item.children && !item.disabled) {
            ctx.openPath = [event.key];
            ctx.highlightedKey = null;
            ctx.isActive = true;
          }
        }
        break;
      }

      case 'HIGHLIGHT': {
        ctx.highlightedKey = event.key;
        break;
      }

      case 'HIGHLIGHT_NEXT': {
        const menuItems = getCurrentMenuItems();
        const navigable = getNavigableItems(menuItems);
        if (navigable.length === 0) break;

        if (ctx.highlightedKey === null) {
          const first = navigable[0];
          if (first) ctx.highlightedKey = first.key;
        } else {
          const idx = navigable.findIndex((i) => i.key === ctx.highlightedKey);
          const next = navigable[(idx + 1) % navigable.length];
          if (next) ctx.highlightedKey = next.key;
        }
        break;
      }

      case 'HIGHLIGHT_PREV': {
        const menuItems = getCurrentMenuItems();
        const navigable = getNavigableItems(menuItems);
        if (navigable.length === 0) break;

        if (ctx.highlightedKey === null) {
          const last = navigable[navigable.length - 1];
          if (last) ctx.highlightedKey = last.key;
        } else {
          const idx = navigable.findIndex((i) => i.key === ctx.highlightedKey);
          const prev = navigable[(idx - 1 + navigable.length) % navigable.length];
          if (prev) ctx.highlightedKey = prev.key;
        }
        break;
      }

      case 'HIGHLIGHT_FIRST': {
        const menuItems = getCurrentMenuItems();
        const navigable = getNavigableItems(menuItems);
        const first = navigable[0];
        if (first) ctx.highlightedKey = first.key;
        break;
      }

      case 'HIGHLIGHT_LAST': {
        const menuItems = getCurrentMenuItems();
        const navigable = getNavigableItems(menuItems);
        const last = navigable[navigable.length - 1];
        if (last) ctx.highlightedKey = last.key;
        break;
      }

      case 'SELECT': {
        const item = findItemByKey(ctx.items, event.key);
        if (!item || item.disabled || item.divider) break;

        if (item.children && item.children.length > 0) {
          // Submenu aç
          ctx.openPath = [...ctx.openPath, event.key];
          ctx.highlightedKey = null;
        } else {
          // Yaprak oge — eylem tetikle, menu kapat
          ctx.openPath = [];
          ctx.highlightedKey = null;
          ctx.isActive = false;
        }
        break;
      }

      case 'ENTER_SUBMENU': {
        // Vurgulanan ogenin submenu'su varsa aç
        if (!ctx.highlightedKey) break;
        const item = findItemByKey(ctx.items, ctx.highlightedKey);
        if (item && item.children && item.children.length > 0 && !item.disabled) {
          ctx.openPath = [...ctx.openPath, ctx.highlightedKey];
          ctx.highlightedKey = null;
        }
        break;
      }

      case 'EXIT_SUBMENU': {
        // Bir seviye geri
        if (ctx.openPath.length > 1) {
          const parentKey = ctx.openPath[ctx.openPath.length - 1];
          ctx.openPath = ctx.openPath.slice(0, -1);
          ctx.highlightedKey = parentKey ?? null;
        }
        break;
      }

      case 'OPEN_NEXT_TOP': {
        const topNav = getTopLevelNavigable();
        if (topNav.length === 0) break;
        const currentTop = ctx.openPath[0];
        const idx = currentTop ? topNav.findIndex((i) => i.key === currentTop) : -1;
        const next = topNav[(idx + 1) % topNav.length];
        if (next && next.children) {
          ctx.openPath = [next.key];
          ctx.highlightedKey = null;
        }
        break;
      }

      case 'OPEN_PREV_TOP': {
        const topNav = getTopLevelNavigable();
        if (topNav.length === 0) break;
        const currentTop = ctx.openPath[0];
        const idx = currentTop ? topNav.findIndex((i) => i.key === currentTop) : 0;
        const prev = topNav[(idx - 1 + topNav.length) % topNav.length];
        if (prev && prev.children) {
          ctx.openPath = [prev.key];
          ctx.highlightedKey = null;
        }
        break;
      }

      case 'SET_ITEMS': {
        ctx.items = event.items;
        break;
      }
    }

    return ctx;
  }

  // ── DOM props ──

  function getMenuBarProps(): MenuBarDOMProps {
    return {
      role: 'menubar',
      'aria-label': 'Menu',
    };
  }

  function getTriggerProps(key: string): MenuTriggerDOMProps {
    const isOpen = ctx.openPath.length > 0 && ctx.openPath[0] === key;
    const isHighlighted = ctx.highlightedKey === key;
    return {
      role: 'menuitem',
      'aria-haspopup': true,
      'aria-expanded': isOpen,
      'data-active': isOpen ? '' : undefined,
      'data-highlighted': isHighlighted ? '' : undefined,
    };
  }

  function getMenuItemPropsImpl(item: MenuItem): MenuItemDOMProps {
    const isHighlighted = ctx.highlightedKey === item.key;
    const isDisabled = !!item.disabled;
    const isChecked = !!item.checked;
    return {
      role: 'menuitem',
      'aria-disabled': isDisabled ? true : undefined,
      'data-disabled': isDisabled ? '' : undefined,
      'data-highlighted': isHighlighted ? '' : undefined,
      'data-checked': isChecked ? '' : undefined,
    };
  }

  function getDropdownProps(parentKey: string): MenuDropdownDOMProps {
    const item = findItemByKey(ctx.items, parentKey);
    return {
      role: 'menu',
      'aria-label': item ? item.label : parentKey,
    };
  }

  // ── Public API ──
  return {
    getContext: () => ctx,
    send,
    getMenuBarProps,
    getTriggerProps,
    getMenuItemProps: getMenuItemPropsImpl,
    getDropdownProps,
    getOpenPath: () => [...ctx.openPath],
    isOpen: () => ctx.openPath.length > 0,
    isMenuOpen: (key: string) => ctx.openPath.includes(key),
    findItem: (key: string) => findItemByKey(ctx.items, key),
    getItemsAtPath: (path: string[]) => getItemsAtPath(ctx.items, path),
  };
}
