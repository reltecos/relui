/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useNavbar — React hook for navbar state machine.
 * useNavbar — Navbar state machine React hook'u.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef } from 'react';
import { createNavbar } from '@relteco/relui-core';
import type {
  NavbarProps as CoreNavbarProps,
  NavbarEvent,
  NavbarItem,
  NavbarNavDOMProps,
  NavbarItemDOMProps,
  NavbarMobileToggleDOMProps,
} from '@relteco/relui-core';

/**
 * useNavbar hook props.
 */
export interface UseNavbarProps extends CoreNavbarProps {
  /** Aktif oge degisim callback'i / Active item change callback */
  onActiveChange?: (key: string) => void;

  /** Mobil menu degisim callback'i / Mobile menu change callback */
  onMobileOpenChange?: (open: boolean) => void;
}

/**
 * useNavbar hook donus tipi.
 */
export interface UseNavbarReturn {
  /** Nav DOM attribute'lari / Nav DOM attributes */
  navProps: NavbarNavDOMProps;

  /** Oge DOM attribute'lari uretici / Item DOM attributes generator */
  getItemProps: (item: NavbarItem) => NavbarItemDOMProps;

  /** Mobil toggle DOM attribute'lari / Mobile toggle DOM attributes */
  mobileToggleProps: NavbarMobileToggleDOMProps;

  /** Aktif oge key / Active item key */
  activeKey: string | null;

  /** Tum ogeler / All items */
  items: NavbarItem[];

  /** Mobil menu acik mi / Is mobile menu open */
  mobileOpen: boolean;

  /** Aktif oge sec / Set active item */
  setActive: (key: string) => void;

  /** Mobil menu toggle / Toggle mobile menu */
  toggleMobile: () => void;

  /** Mobil menuyu ac / Open mobile menu */
  openMobile: () => void;

  /** Mobil menuyu kapat / Close mobile menu */
  closeMobile: () => void;
}

export function useNavbar(props: UseNavbarProps): UseNavbarReturn {
  const { onActiveChange, onMobileOpenChange, ...coreProps } = props;

  const machineRef = useRef<ReturnType<typeof createNavbar> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createNavbar(coreProps);
  }
  const machine = machineRef.current;

  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  // Prop sync
  const prevItemsRef = useRef(coreProps.items);
  const prevActiveKeyRef = useRef(coreProps.activeKey);
  const prevMobileOpenRef = useRef(coreProps.mobileOpen);

  if (coreProps.items !== prevItemsRef.current) {
    machine.send({ type: 'SET_ITEMS', items: coreProps.items });
    prevItemsRef.current = coreProps.items;
    forceRender();
  }
  if (coreProps.activeKey !== undefined && coreProps.activeKey !== prevActiveKeyRef.current) {
    machine.send({ type: 'SET_ACTIVE_KEY', key: coreProps.activeKey ?? null });
    prevActiveKeyRef.current = coreProps.activeKey;
    forceRender();
  }
  if (coreProps.mobileOpen !== undefined && coreProps.mobileOpen !== prevMobileOpenRef.current) {
    machine.send({ type: 'SET_MOBILE_OPEN', open: coreProps.mobileOpen });
    prevMobileOpenRef.current = coreProps.mobileOpen;
    forceRender();
  }

  const send = useCallback(
    (event: NavbarEvent) => {
      machine.send(event);
      forceRender();
    },
    [machine],
  );

  const setActive = useCallback(
    (key: string) => {
      const prevActiveKey = machine.getContext().activeKey;
      send({ type: 'SET_ACTIVE', key });
      if (key !== prevActiveKey) {
        onActiveChange?.(key);
      }
    },
    [send, machine, onActiveChange],
  );

  const toggleMobile = useCallback(() => {
    const wasMobileOpen = machine.getContext().mobileOpen;
    send({ type: 'TOGGLE_MOBILE' });
    if (machine.getContext().mobileOpen !== wasMobileOpen) {
      onMobileOpenChange?.(machine.getContext().mobileOpen);
    }
  }, [send, machine, onMobileOpenChange]);

  const openMobile = useCallback(() => {
    const wasMobileOpen = machine.getContext().mobileOpen;
    send({ type: 'OPEN_MOBILE' });
    if (!wasMobileOpen) {
      onMobileOpenChange?.(true);
    }
  }, [send, machine, onMobileOpenChange]);

  const closeMobile = useCallback(() => {
    const wasMobileOpen = machine.getContext().mobileOpen;
    send({ type: 'CLOSE_MOBILE' });
    if (wasMobileOpen) {
      onMobileOpenChange?.(false);
    }
  }, [send, machine, onMobileOpenChange]);

  const getItemProps = useCallback(
    (item: NavbarItem) => machine.getItemProps(item),
    [machine],
  );

  const ctx = machine.getContext();

  return {
    navProps: machine.getNavProps(),
    getItemProps,
    mobileToggleProps: machine.getMobileToggleProps(),
    activeKey: ctx.activeKey,
    items: ctx.items,
    mobileOpen: ctx.mobileOpen,
    setActive,
    toggleMobile,
    openMobile,
    closeMobile,
  };
}
