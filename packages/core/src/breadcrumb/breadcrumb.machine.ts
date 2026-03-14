/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Breadcrumb state machine — framework-agnostic headless breadcrumb logic.
 * Breadcrumb state machine — framework bağımsız headless breadcrumb mantığı.
 *
 * WAI-ARIA Breadcrumb pattern: nav + ol + aria-current="page".
 * Daraltma: çok sayıda öğe varsa orta kısım `...` ile gösterilir.
 *
 * @packageDocumentation
 */

import type {
  BreadcrumbProps,
  BreadcrumbMachineContext,
  BreadcrumbEvent,
  BreadcrumbVisibleItem,
  BreadcrumbNavDOMProps,
  BreadcrumbListDOMProps,
  BreadcrumbItemDOMProps,
  BreadcrumbItem,
} from './breadcrumb.types';

// ── Context oluşturucu / Context creator ────────────────────────────

function createInitialContext(props: BreadcrumbProps): BreadcrumbMachineContext {
  const maxItems = props.maxItems ?? 0;
  const shouldCollapse = maxItems > 0 && props.items.length > maxItems;

  return {
    items: props.items,
    collapsed: shouldCollapse,
    maxItems,
    itemsBeforeCollapse: props.itemsBeforeCollapse ?? 1,
    itemsAfterCollapse: props.itemsAfterCollapse ?? 1,
  };
}

// ── Transition ──────────────────────────────────────────────────────

function transition(
  ctx: BreadcrumbMachineContext,
  event: BreadcrumbEvent,
): BreadcrumbMachineContext {
  if (event.type === 'EXPAND') {
    if (!ctx.collapsed) return ctx;
    return { ...ctx, collapsed: false };
  }

  if (event.type === 'COLLAPSE') {
    const shouldCollapse = ctx.maxItems > 0 && ctx.items.length > ctx.maxItems;
    if (!shouldCollapse) return ctx;
    if (ctx.collapsed) return ctx;
    return { ...ctx, collapsed: true };
  }

  if (event.type === 'SET_ITEMS') {
    const shouldCollapse = ctx.maxItems > 0 && event.items.length > ctx.maxItems;
    return {
      ...ctx,
      items: event.items,
      collapsed: shouldCollapse,
    };
  }

  if (event.type === 'SET_MAX_ITEMS') {
    const shouldCollapse = event.maxItems > 0 && ctx.items.length > event.maxItems;
    return {
      ...ctx,
      maxItems: event.maxItems,
      collapsed: shouldCollapse,
    };
  }

  return ctx;
}

// ── Görünür öğeleri hesapla / Compute visible items ─────────────────

function computeVisibleItems(ctx: BreadcrumbMachineContext): BreadcrumbVisibleItem[] {
  const { items, collapsed, itemsBeforeCollapse, itemsAfterCollapse } = ctx;
  const totalItems = items.length;

  if (totalItems === 0) return [];

  if (!collapsed) {
    return items.map((item, index) => ({
      type: 'item' as const,
      item,
      isLast: index === totalItems - 1,
    }));
  }

  // Daraltılmış: baş + ... + son
  const before = items.slice(0, itemsBeforeCollapse);
  const after = items.slice(totalItems - itemsAfterCollapse);

  const result: BreadcrumbVisibleItem[] = [];

  for (const item of before) {
    result.push({ type: 'item', item, isLast: false });
  }

  result.push({ type: 'ellipsis', isLast: false });

  for (let i = 0; i < after.length; i++) {
    const item = after[i];
    if (item) {
      result.push({
        type: 'item',
        item,
        isLast: i === after.length - 1,
      });
    }
  }

  return result;
}

// ── DOM Props üreticileri / DOM Props generators ────────────────────

function getNavProps(): BreadcrumbNavDOMProps {
  return {
    'aria-label': 'Breadcrumb',
  };
}

function getListProps(): BreadcrumbListDOMProps {
  return {
    role: undefined,
  };
}

function getItemProps(item: BreadcrumbItem, isLast: boolean): BreadcrumbItemDOMProps {
  const isDisabled = item.disabled === true;
  return {
    'aria-current': isLast ? 'page' : undefined,
    'aria-disabled': isDisabled ? true : undefined,
    'data-disabled': isDisabled ? '' : undefined,
  };
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Breadcrumb API — state machine ve DOM props üreticileri.
 * Breadcrumb API — state machine and DOM props generators.
 */
export interface BreadcrumbAPI {
  /** Mevcut context / Current context */
  getContext(): BreadcrumbMachineContext;

  /** Event gönder / Send event */
  send(event: BreadcrumbEvent): BreadcrumbMachineContext;

  /** Görünür öğeleri al / Get visible items */
  getVisibleItems(): BreadcrumbVisibleItem[];

  /** Nav DOM attribute'ları / Nav DOM attributes */
  getNavProps(): BreadcrumbNavDOMProps;

  /** Liste DOM attribute'ları / List DOM attributes */
  getListProps(): BreadcrumbListDOMProps;

  /** Öğe DOM attribute'ları / Item DOM attributes */
  getItemProps(item: BreadcrumbItem, isLast: boolean): BreadcrumbItemDOMProps;

  /** Daraltılmış mı / Is collapsed */
  isCollapsed(): boolean;

  /** Toplam öğe sayısı / Total item count */
  getItemCount(): number;
}

/**
 * Breadcrumb state machine oluştur.
 * Create a breadcrumb state machine.
 *
 * @example
 * ```ts
 * const bc = createBreadcrumb({
 *   items: [
 *     { key: 'home', label: 'Ana Sayfa', href: '/' },
 *     { key: 'products', label: 'Ürünler', href: '/products' },
 *     { key: 'detail', label: 'Ürün Detayı' },
 *   ],
 * });
 *
 * bc.getVisibleItems(); // tüm öğeler
 * ```
 */
export function createBreadcrumb(props: BreadcrumbProps): BreadcrumbAPI {
  let ctx = createInitialContext(props);

  return {
    getContext() {
      return ctx;
    },

    send(event: BreadcrumbEvent) {
      ctx = transition(ctx, event);
      return ctx;
    },

    getVisibleItems() {
      return computeVisibleItems(ctx);
    },

    getNavProps() {
      return getNavProps();
    },

    getListProps() {
      return getListProps();
    },

    getItemProps(item: BreadcrumbItem, isLast: boolean) {
      return getItemProps(item, isLast);
    },

    isCollapsed() {
      return ctx.collapsed;
    },

    getItemCount() {
      return ctx.items.length;
    },
  };
}
