/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Sidebar state machine — framework-agnostic headless sidebar logic.
 * Sidebar state machine — framework bagimsiz headless sidebar mantigi.
 *
 * Daraltilabilir navigasyon paneli, gruplama, aktif oge izleme.
 *
 * @packageDocumentation
 */

import type {
  SidebarProps,
  SidebarMachineContext,
  SidebarEvent,
  SidebarItem,
  SidebarNavDOMProps,
  SidebarItemDOMProps,
  SidebarGroupDOMProps,
} from './sidebar.types';

// ── Context olusturucu / Context creator ────────────────────────────

function createInitialContext(props: SidebarProps): SidebarMachineContext {
  return {
    items: props.items,
    collapsed: props.collapsed ?? props.defaultCollapsed ?? false,
    activeKey: props.activeKey ?? props.defaultActiveKey ?? null,
    expandedKeys: new Set(props.defaultExpandedKeys ?? []),
  };
}

// ── Yardimci: gruplari topla / Helper: collect groups ───────────────

function collectGroupKeys(items: SidebarItem[]): string[] {
  const keys: string[] = [];
  for (const item of items) {
    if (item.children && item.children.length > 0) {
      keys.push(item.key);
      keys.push(...collectGroupKeys(item.children));
    }
  }
  return keys;
}

// ── Transition ──────────────────────────────────────────────────────

function transition(
  ctx: SidebarMachineContext,
  event: SidebarEvent,
): SidebarMachineContext {
  if (event.type === 'TOGGLE_COLLAPSE') {
    return { ...ctx, collapsed: !ctx.collapsed };
  }

  if (event.type === 'EXPAND') {
    if (!ctx.collapsed) return ctx;
    return { ...ctx, collapsed: false };
  }

  if (event.type === 'COLLAPSE') {
    if (ctx.collapsed) return ctx;
    return { ...ctx, collapsed: true };
  }

  if (event.type === 'SET_ACTIVE') {
    if (ctx.activeKey === event.key) return ctx;
    return { ...ctx, activeKey: event.key };
  }

  if (event.type === 'TOGGLE_GROUP') {
    const next = new Set(ctx.expandedKeys);
    if (next.has(event.key)) {
      next.delete(event.key);
    } else {
      next.add(event.key);
    }
    return { ...ctx, expandedKeys: next };
  }

  if (event.type === 'EXPAND_GROUP') {
    if (ctx.expandedKeys.has(event.key)) return ctx;
    const next = new Set(ctx.expandedKeys);
    next.add(event.key);
    return { ...ctx, expandedKeys: next };
  }

  if (event.type === 'COLLAPSE_GROUP') {
    if (!ctx.expandedKeys.has(event.key)) return ctx;
    const next = new Set(ctx.expandedKeys);
    next.delete(event.key);
    return { ...ctx, expandedKeys: next };
  }

  if (event.type === 'EXPAND_ALL_GROUPS') {
    const allKeys = collectGroupKeys(ctx.items);
    return { ...ctx, expandedKeys: new Set(allKeys) };
  }

  if (event.type === 'COLLAPSE_ALL_GROUPS') {
    if (ctx.expandedKeys.size === 0) return ctx;
    return { ...ctx, expandedKeys: new Set() };
  }

  if (event.type === 'SET_ITEMS') {
    return { ...ctx, items: event.items };
  }

  if (event.type === 'SET_COLLAPSED') {
    if (ctx.collapsed === event.collapsed) return ctx;
    return { ...ctx, collapsed: event.collapsed };
  }

  if (event.type === 'SET_ACTIVE_KEY') {
    if (ctx.activeKey === event.key) return ctx;
    return { ...ctx, activeKey: event.key };
  }

  return ctx;
}

// ── DOM Props ureticileri / DOM Props generators ─────────────────────

function getNavProps(ctx: SidebarMachineContext): SidebarNavDOMProps {
  return {
    'aria-label': 'Sidebar',
    role: 'navigation',
    'data-collapsed': ctx.collapsed ? '' : undefined,
  };
}

function getItemProps(item: SidebarItem, activeKey: string | null): SidebarItemDOMProps {
  const isActive = item.key === activeKey;
  const isDisabled = item.disabled === true;
  return {
    'aria-current': isActive ? 'page' : undefined,
    'aria-disabled': isDisabled ? true : undefined,
    'data-active': isActive ? '' : undefined,
    'data-disabled': isDisabled ? '' : undefined,
  };
}

function getGroupProps(key: string, expandedKeys: Set<string>): SidebarGroupDOMProps {
  const isExpanded = expandedKeys.has(key);
  return {
    'aria-expanded': isExpanded,
    'data-expanded': isExpanded ? '' : undefined,
  };
}

// ── Yardimci: aktif ogeyi bul / Helper: find active item ────────────

function findItemByKey(items: SidebarItem[], key: string): SidebarItem | null {
  for (const item of items) {
    if (item.key === key) return item;
    if (item.children) {
      const found = findItemByKey(item.children, key);
      if (found) return found;
    }
  }
  return null;
}

function flattenItems(items: SidebarItem[]): SidebarItem[] {
  const result: SidebarItem[] = [];
  for (const item of items) {
    result.push(item);
    if (item.children) {
      result.push(...flattenItems(item.children));
    }
  }
  return result;
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Sidebar API — state machine ve DOM props ureticileri.
 */
export interface SidebarAPI {
  /** Mevcut context / Current context */
  getContext(): SidebarMachineContext;

  /** Event gonder / Send event */
  send(event: SidebarEvent): SidebarMachineContext;

  /** Nav DOM attribute'lari / Nav DOM attributes */
  getNavProps(): SidebarNavDOMProps;

  /** Oge DOM attribute'lari / Item DOM attributes */
  getItemProps(item: SidebarItem): SidebarItemDOMProps;

  /** Grup DOM attribute'lari / Group DOM attributes */
  getGroupProps(key: string): SidebarGroupDOMProps;

  /** Daraltilmis mi / Is collapsed */
  isCollapsed(): boolean;

  /** Aktif oge key / Active item key */
  getActiveKey(): string | null;

  /** Aktif oge / Active item */
  getActiveItem(): SidebarItem | null;

  /** Grup acik mi / Is group expanded */
  isGroupExpanded(key: string): boolean;

  /** Tum ogeleri duzlestir / Flatten all items */
  getFlatItems(): SidebarItem[];

  /** Oge bul / Find item */
  findItem(key: string): SidebarItem | null;
}

/**
 * Sidebar state machine olustur.
 * Create a sidebar state machine.
 *
 * @example
 * ```ts
 * const sb = createSidebar({
 *   items: [
 *     { key: 'home', label: 'Ana Sayfa', icon: 'home' },
 *     { key: 'settings', label: 'Ayarlar', icon: 'gear', children: [
 *       { key: 'profile', label: 'Profil' },
 *       { key: 'security', label: 'Guvenlik' },
 *     ]},
 *   ],
 * });
 * ```
 */
export function createSidebar(props: SidebarProps): SidebarAPI {
  let ctx = createInitialContext(props);

  return {
    getContext() {
      return ctx;
    },

    send(event: SidebarEvent) {
      ctx = transition(ctx, event);
      return ctx;
    },

    getNavProps() {
      return getNavProps(ctx);
    },

    getItemProps(item: SidebarItem) {
      return getItemProps(item, ctx.activeKey);
    },

    getGroupProps(key: string) {
      return getGroupProps(key, ctx.expandedKeys);
    },

    isCollapsed() {
      return ctx.collapsed;
    },

    getActiveKey() {
      return ctx.activeKey;
    },

    getActiveItem() {
      if (!ctx.activeKey) return null;
      return findItemByKey(ctx.items, ctx.activeKey);
    },

    isGroupExpanded(key: string) {
      return ctx.expandedKeys.has(key);
    },

    getFlatItems() {
      return flattenItems(ctx.items);
    },

    findItem(key: string) {
      return findItemByKey(ctx.items, key);
    },
  };
}
