/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * createNavbar — framework-agnostic navbar state machine.
 * createNavbar — framework bagimsiz navbar state machine.
 *
 * Ust navigasyon cubugu icin durum yonetimi.
 *
 * @packageDocumentation
 */

import type {
  NavbarProps,
  NavbarEvent,
  NavbarMachineContext,
  NavbarItem,
  NavbarNavDOMProps,
  NavbarItemDOMProps,
  NavbarMobileToggleDOMProps,
} from './navbar.types';

/**
 * Navbar API tipi / Navbar API type.
 */
export interface NavbarAPI {
  /** Mevcut context / Current context */
  getContext: () => NavbarMachineContext;

  /** Event gonder / Send event */
  send: (event: NavbarEvent) => NavbarMachineContext;

  /** Nav DOM attribute'lari / Nav DOM attributes */
  getNavProps: () => NavbarNavDOMProps;

  /** Oge DOM attribute'lari / Item DOM attributes */
  getItemProps: (item: NavbarItem) => NavbarItemDOMProps;

  /** Mobil menu toggle DOM attribute'lari / Mobile toggle DOM attributes */
  getMobileToggleProps: () => NavbarMobileToggleDOMProps;

  /** Aktif oge bilgisi / Active item info */
  getActiveItem: () => NavbarItem | null;

  /** Tum ogeleri duzlestir / Flatten all items */
  getFlatItems: () => NavbarItem[];

  /** Key ile oge bul / Find item by key */
  findItem: (key: string) => NavbarItem | null;

  /** Mobil menu acik mi / Is mobile menu open */
  isMobileOpen: () => boolean;
}

/**
 * Ogeler arasinda key ile recursive arama.
 * Recursive search by key among items.
 */
function findItemByKey(items: NavbarItem[], key: string): NavbarItem | null {
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
 * Tum ogeleri duz listeye cevir (recursive).
 * Flatten all items into a flat list.
 */
function flattenItems(items: NavbarItem[]): NavbarItem[] {
  const result: NavbarItem[] = [];
  for (const item of items) {
    result.push(item);
    if (item.children) {
      result.push(...flattenItems(item.children));
    }
  }
  return result;
}

/**
 * Navbar state machine olusturur.
 * Creates a navbar state machine.
 */
export function createNavbar(props: NavbarProps): NavbarAPI {
  // ── Mutable context ──
  const ctx: NavbarMachineContext = {
    items: props.items,
    activeKey: props.activeKey ?? props.defaultActiveKey ?? null,
    mobileOpen: props.mobileOpen ?? props.defaultMobileOpen ?? false,
  };

  // ── Transition ──
  function send(event: NavbarEvent): NavbarMachineContext {
    switch (event.type) {
      case 'SET_ACTIVE': {
        const item = findItemByKey(ctx.items, event.key);
        if (item && !item.disabled) {
          ctx.activeKey = event.key;
        }
        break;
      }

      case 'TOGGLE_MOBILE':
        ctx.mobileOpen = !ctx.mobileOpen;
        break;

      case 'OPEN_MOBILE':
        ctx.mobileOpen = true;
        break;

      case 'CLOSE_MOBILE':
        ctx.mobileOpen = false;
        break;

      case 'SET_ITEMS':
        ctx.items = event.items;
        break;

      case 'SET_ACTIVE_KEY':
        ctx.activeKey = event.key;
        break;

      case 'SET_MOBILE_OPEN':
        ctx.mobileOpen = event.open;
        break;
    }
    return ctx;
  }

  // ── DOM props uretici'leri ──

  function getNavProps(): NavbarNavDOMProps {
    return {
      'aria-label': 'Navbar',
      role: 'navigation',
    };
  }

  function getItemProps(item: NavbarItem): NavbarItemDOMProps {
    const isActive = ctx.activeKey === item.key;
    const isDisabled = !!item.disabled;
    return {
      'aria-current': isActive ? 'page' : undefined,
      'aria-disabled': isDisabled ? true : undefined,
      'data-active': isActive ? '' : undefined,
      'data-disabled': isDisabled ? '' : undefined,
    };
  }

  function getMobileToggleProps(): NavbarMobileToggleDOMProps {
    return {
      'aria-expanded': ctx.mobileOpen,
      'aria-label': ctx.mobileOpen ? 'Menuyu kapat' : 'Menuyu ac',
    };
  }

  function getActiveItem(): NavbarItem | null {
    if (!ctx.activeKey) return null;
    return findItemByKey(ctx.items, ctx.activeKey);
  }

  function getFlatItems(): NavbarItem[] {
    return flattenItems(ctx.items);
  }

  function findItem(key: string): NavbarItem | null {
    return findItemByKey(ctx.items, key);
  }

  function isMobileOpen(): boolean {
    return ctx.mobileOpen;
  }

  // ── Public API ──
  return {
    getContext: () => ctx,
    send,
    getNavProps,
    getItemProps,
    getMobileToggleProps,
    getActiveItem,
    getFlatItems,
    findItem,
    isMobileOpen,
  };
}
