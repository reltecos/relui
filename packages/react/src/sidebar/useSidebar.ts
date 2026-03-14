/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useSidebar — React hook for sidebar state machine.
 * useSidebar — Sidebar state machine React hook'u.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef } from 'react';
import { createSidebar } from '@relteco/relui-core';
import type {
  SidebarProps as CoreSidebarProps,
  SidebarEvent,
  SidebarItem,
  SidebarNavDOMProps,
  SidebarItemDOMProps,
  SidebarGroupDOMProps,
} from '@relteco/relui-core';

/**
 * useSidebar hook props.
 */
export interface UseSidebarProps extends CoreSidebarProps {
  /** Aktif oge degisim callback'i / Active item change callback */
  onActiveChange?: (key: string) => void;

  /** Daraltma degisim callback'i / Collapse change callback */
  onCollapseChange?: (collapsed: boolean) => void;
}

/**
 * useSidebar hook donus tipi.
 */
export interface UseSidebarReturn {
  /** Nav DOM attribute'lari / Nav DOM attributes */
  navProps: SidebarNavDOMProps;

  /** Oge DOM attribute'lari uretici / Item DOM attributes generator */
  getItemProps: (item: SidebarItem) => SidebarItemDOMProps;

  /** Grup DOM attribute'lari uretici / Group DOM attributes generator */
  getGroupProps: (key: string) => SidebarGroupDOMProps;

  /** Daraltilmis mi / Is collapsed */
  isCollapsed: boolean;

  /** Aktif oge key / Active item key */
  activeKey: string | null;

  /** Tum ogeler / All items */
  items: SidebarItem[];

  /** Daralt/genislet toggle / Toggle collapse */
  toggleCollapse: () => void;

  /** Aktif oge sec / Set active item */
  setActive: (key: string) => void;

  /** Grup aç/kapat toggle / Toggle group */
  toggleGroup: (key: string) => void;

  /** Grup acik mi / Is group expanded */
  isGroupExpanded: (key: string) => boolean;
}

export function useSidebar(props: UseSidebarProps): UseSidebarReturn {
  const { onActiveChange, onCollapseChange, ...coreProps } = props;

  const machineRef = useRef<ReturnType<typeof createSidebar> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createSidebar(coreProps);
  }
  const machine = machineRef.current;

  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  // Prop sync
  const prevItemsRef = useRef(coreProps.items);
  const prevCollapsedRef = useRef(coreProps.collapsed);
  const prevActiveKeyRef = useRef(coreProps.activeKey);

  if (coreProps.items !== prevItemsRef.current) {
    machine.send({ type: 'SET_ITEMS', items: coreProps.items });
    prevItemsRef.current = coreProps.items;
    forceRender();
  }
  if (coreProps.collapsed !== undefined && coreProps.collapsed !== prevCollapsedRef.current) {
    machine.send({ type: 'SET_COLLAPSED', collapsed: coreProps.collapsed });
    prevCollapsedRef.current = coreProps.collapsed;
    forceRender();
  }
  if (coreProps.activeKey !== undefined && coreProps.activeKey !== prevActiveKeyRef.current) {
    machine.send({ type: 'SET_ACTIVE_KEY', key: coreProps.activeKey ?? null });
    prevActiveKeyRef.current = coreProps.activeKey;
    forceRender();
  }

  const send = useCallback(
    (event: SidebarEvent) => {
      const prevCtx = machine.getContext();
      const nextCtx = machine.send(event);
      if (nextCtx !== prevCtx) {
        forceRender();
      }
      return nextCtx;
    },
    [machine],
  );

  const toggleCollapse = useCallback(() => {
    const prevCtx = machine.getContext();
    const nextCtx = send({ type: 'TOGGLE_COLLAPSE' });
    if (nextCtx.collapsed !== prevCtx.collapsed) {
      onCollapseChange?.(nextCtx.collapsed);
    }
  }, [send, machine, onCollapseChange]);

  const setActive = useCallback(
    (key: string) => {
      const prevCtx = machine.getContext();
      send({ type: 'SET_ACTIVE', key });
      if (key !== prevCtx.activeKey) {
        onActiveChange?.(key);
      }
    },
    [send, machine, onActiveChange],
  );

  const toggleGroup = useCallback(
    (key: string) => {
      send({ type: 'TOGGLE_GROUP', key });
    },
    [send],
  );

  const getItemProps = useCallback(
    (item: SidebarItem) => machine.getItemProps(item),
    [machine],
  );

  const getGroupProps = useCallback(
    (key: string) => machine.getGroupProps(key),
    [machine],
  );

  const isGroupExpanded = useCallback(
    (key: string) => machine.isGroupExpanded(key),
    [machine],
  );

  const ctx = machine.getContext();

  return {
    navProps: machine.getNavProps(),
    getItemProps,
    getGroupProps,
    isCollapsed: ctx.collapsed,
    activeKey: ctx.activeKey,
    items: ctx.items,
    toggleCollapse,
    setActive,
    toggleGroup,
    isGroupExpanded,
  };
}
