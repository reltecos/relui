/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useMenu — React hook for menu state machine.
 * useMenu — Menu state machine React hook'u.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef } from 'react';
import { createMenu } from '@relteco/relui-core';
import type {
  MenuProps as CoreMenuProps,
  MenuEvent,
  MenuItem,
  MenuBarDOMProps,
  MenuTriggerDOMProps,
  MenuItemDOMProps,
  MenuDropdownDOMProps,
} from '@relteco/relui-core';

/**
 * useMenu hook props.
 */
export interface UseMenuProps extends CoreMenuProps {
  /** Oge secildiginde callback / Item selected callback */
  onSelect?: (key: string, item: MenuItem) => void;

  /** Menu acilip kapandiginda callback / Menu open/close callback */
  onOpenChange?: (open: boolean) => void;
}

/**
 * useMenu hook donus tipi.
 */
export interface UseMenuReturn {
  /** Menubar DOM attribute'lari / Menubar DOM attributes */
  menuBarProps: MenuBarDOMProps;

  /** Trigger DOM attribute'lari uretici / Trigger DOM attributes generator */
  getTriggerProps: (key: string) => MenuTriggerDOMProps;

  /** Menu item DOM attribute'lari uretici / Menu item DOM attributes generator */
  getMenuItemProps: (item: MenuItem) => MenuItemDOMProps;

  /** Dropdown DOM attribute'lari uretici / Dropdown DOM attributes generator */
  getDropdownProps: (parentKey: string) => MenuDropdownDOMProps;

  /** Tum ogeler / All items */
  items: MenuItem[];

  /** Acik menu yolu / Open menu path */
  openPath: string[];

  /** Menu acik mi / Is any menu open */
  isOpen: boolean;

  /** Vurgulanan oge key / Highlighted item key */
  highlightedKey: string | null;

  /** Menuyu ac / Open menu */
  openMenu: (key: string) => void;

  /** Menuyu kapat / Close menu */
  closeMenu: () => void;

  /** Tum menuleri kapat / Close all */
  closeAll: () => void;

  /** Menu toggle / Toggle menu */
  toggleMenu: (key: string) => void;

  /** Oge sec / Select item */
  selectItem: (key: string) => void;

  /** Highlight ayarla / Set highlight */
  highlight: (key: string | null) => void;

  /** Belirli menu acik mi / Is specific menu open */
  isMenuOpen: (key: string) => boolean;

  /** Belirli path'teki ogeler / Items at path */
  getItemsAtPath: (path: string[]) => MenuItem[];
}

export function useMenu(props: UseMenuProps): UseMenuReturn {
  const { onSelect, onOpenChange, ...coreProps } = props;

  const machineRef = useRef<ReturnType<typeof createMenu> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createMenu(coreProps);
  }
  const machine = machineRef.current;

  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  // Prop sync
  const prevItemsRef = useRef(coreProps.items);
  if (coreProps.items !== prevItemsRef.current) {
    machine.send({ type: 'SET_ITEMS', items: coreProps.items });
    prevItemsRef.current = coreProps.items;
    forceRender();
  }

  const send = useCallback(
    (event: MenuEvent) => {
      machine.send(event);
      forceRender();
    },
    [machine],
  );

  const openMenu = useCallback(
    (key: string) => {
      const wasOpen = machine.isOpen();
      send({ type: 'OPEN_MENU', key });
      if (!wasOpen) {
        onOpenChange?.(true);
      }
    },
    [send, machine, onOpenChange],
  );

  const closeMenu = useCallback(() => {
    send({ type: 'CLOSE_MENU' });
    if (!machine.isOpen()) {
      onOpenChange?.(false);
    }
  }, [send, machine, onOpenChange]);

  const closeAll = useCallback(() => {
    const wasOpen = machine.isOpen();
    send({ type: 'CLOSE_ALL' });
    if (wasOpen) {
      onOpenChange?.(false);
    }
  }, [send, machine, onOpenChange]);

  const toggleMenu = useCallback(
    (key: string) => {
      const wasOpen = machine.isOpen();
      send({ type: 'TOGGLE_MENU', key });
      const nowOpen = machine.isOpen();
      if (wasOpen !== nowOpen) {
        onOpenChange?.(nowOpen);
      }
    },
    [send, machine, onOpenChange],
  );

  const selectItem = useCallback(
    (key: string) => {
      const item = machine.findItem(key);
      if (!item || item.disabled || item.divider) return;

      const hasChildren = item.children && item.children.length > 0;
      send({ type: 'SELECT', key });

      if (!hasChildren && item) {
        onSelect?.(key, item);
      }
    },
    [send, machine, onSelect],
  );

  const highlight = useCallback(
    (key: string | null) => {
      send({ type: 'HIGHLIGHT', key });
    },
    [send],
  );

  const getTriggerProps = useCallback(
    (key: string) => machine.getTriggerProps(key),
    [machine],
  );

  const getMenuItemProps = useCallback(
    (item: MenuItem) => machine.getMenuItemProps(item),
    [machine],
  );

  const getDropdownProps = useCallback(
    (parentKey: string) => machine.getDropdownProps(parentKey),
    [machine],
  );

  const isMenuOpen = useCallback(
    (key: string) => machine.isMenuOpen(key),
    [machine],
  );

  const getItemsAtPath = useCallback(
    (path: string[]) => machine.getItemsAtPath(path),
    [machine],
  );

  const ctx = machine.getContext();

  return {
    menuBarProps: machine.getMenuBarProps(),
    getTriggerProps,
    getMenuItemProps,
    getDropdownProps,
    items: ctx.items,
    openPath: [...ctx.openPath],
    isOpen: ctx.openPath.length > 0,
    highlightedKey: ctx.highlightedKey,
    openMenu,
    closeMenu,
    closeAll,
    toggleMenu,
    selectItem,
    highlight,
    isMenuOpen,
    getItemsAtPath,
  };
}
