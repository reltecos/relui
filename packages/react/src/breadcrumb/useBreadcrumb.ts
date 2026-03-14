/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useBreadcrumb — React hook for breadcrumb state machine.
 * useBreadcrumb — Breadcrumb state machine React hook'u.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef } from 'react';
import { createBreadcrumb } from '@relteco/relui-core';
import type {
  BreadcrumbProps as CoreBreadcrumbProps,
  BreadcrumbEvent,
  BreadcrumbVisibleItem,
  BreadcrumbItem,
  BreadcrumbNavDOMProps,
  BreadcrumbListDOMProps,
  BreadcrumbItemDOMProps,
} from '@relteco/relui-core';

/**
 * useBreadcrumb hook props.
 */
export interface UseBreadcrumbProps extends CoreBreadcrumbProps {
  /** Genisletme callback'i / Expand callback */
  onExpand?: () => void;
}

/**
 * useBreadcrumb hook donus tipi.
 */
export interface UseBreadcrumbReturn {
  /** Nav DOM attribute'lari / Nav DOM attributes */
  navProps: BreadcrumbNavDOMProps;

  /** Liste DOM attribute'lari / List DOM attributes */
  listProps: BreadcrumbListDOMProps;

  /** Oge DOM attribute'lari uretici / Item DOM attributes generator */
  getItemProps: (item: BreadcrumbItem, isLast: boolean) => BreadcrumbItemDOMProps;

  /** Gorunur ogeler / Visible items */
  visibleItems: BreadcrumbVisibleItem[];

  /** Daraltilmis mi / Is collapsed */
  isCollapsed: boolean;

  /** Toplam oge sayisi / Total item count */
  itemCount: number;

  /** Tum ogeler / All items */
  items: BreadcrumbItem[];

  /** Genislet / Expand */
  expand: () => void;

  /** Daralt / Collapse */
  collapse: () => void;
}

export function useBreadcrumb(props: UseBreadcrumbProps): UseBreadcrumbReturn {
  const { onExpand, ...coreProps } = props;

  const machineRef = useRef<ReturnType<typeof createBreadcrumb> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createBreadcrumb(coreProps);
  }
  const machine = machineRef.current;

  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  // Prop sync
  const prevItemsRef = useRef(coreProps.items);
  const prevMaxItemsRef = useRef(coreProps.maxItems);

  if (coreProps.items !== prevItemsRef.current) {
    machine.send({ type: 'SET_ITEMS', items: coreProps.items });
    prevItemsRef.current = coreProps.items;
    forceRender();
  }
  if (coreProps.maxItems !== undefined && coreProps.maxItems !== prevMaxItemsRef.current) {
    machine.send({ type: 'SET_MAX_ITEMS', maxItems: coreProps.maxItems });
    prevMaxItemsRef.current = coreProps.maxItems;
    forceRender();
  }

  const send = useCallback(
    (event: BreadcrumbEvent) => {
      const prevCtx = machine.getContext();
      const nextCtx = machine.send(event);
      if (nextCtx !== prevCtx) {
        forceRender();
      }
      return nextCtx;
    },
    [machine],
  );

  const expand = useCallback(() => {
    send({ type: 'EXPAND' });
    onExpand?.();
  }, [send, onExpand]);

  const collapse = useCallback(() => {
    send({ type: 'COLLAPSE' });
  }, [send]);

  const getItemProps = useCallback(
    (item: BreadcrumbItem, isLast: boolean) => {
      return machine.getItemProps(item, isLast);
    },
    [machine],
  );

  const ctx = machine.getContext();

  return {
    navProps: machine.getNavProps(),
    listProps: machine.getListProps(),
    getItemProps,
    visibleItems: machine.getVisibleItems(),
    isCollapsed: ctx.collapsed,
    itemCount: ctx.items.length,
    items: ctx.items,
    expand,
    collapse,
  };
}
