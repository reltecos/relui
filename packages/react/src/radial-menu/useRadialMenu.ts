/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useRadialMenu — React hook for radial menu state machine.
 * useRadialMenu — Dairesel menu state machine React hook'u.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef } from 'react';
import { createRadialMenu } from '@relteco/relui-core';
import type {
  RadialMenuProps as CoreRadialMenuProps,
  RadialMenuEvent,
  RadialMenuItem,
  RadialMenuPosition,
  RadialMenuDOMProps,
  RadialMenuSectorDOMProps,
  SectorInfo,
} from '@relteco/relui-core';

/**
 * useRadialMenu hook props.
 */
export interface UseRadialMenuProps extends CoreRadialMenuProps {
  /** Kontrol edilen acik durumu / Controlled open state */
  open?: boolean;

  /** Menu pozisyonu / Menu position */
  position?: RadialMenuPosition;

  /** Oge secildiginde callback / Item selected callback */
  onSelect?: (key: string, item: RadialMenuItem) => void;

  /** Menu acilip kapandiginda callback / Menu open/close callback */
  onOpenChange?: (open: boolean) => void;
}

/**
 * useRadialMenu hook donus tipi.
 */
export interface UseRadialMenuReturn {
  /** Menu DOM attribute'lari / Menu DOM attributes */
  menuProps: RadialMenuDOMProps;

  /** Sektor DOM attribute'lari uretici / Sector DOM attributes generator */
  getSectorProps: (index: number) => RadialMenuSectorDOMProps;

  /** Mevcut ogeler / Current items */
  items: RadialMenuItem[];

  /** Sektor bilgileri / Sector infos */
  sectors: SectorInfo[];

  /** Menu acik mi / Is open */
  isOpen: boolean;

  /** Vurgulanan sektor indeksi / Highlighted sector index */
  highlightedIndex: number;

  /** Menu pozisyonu / Menu position */
  position: RadialMenuPosition;

  /** Menuyu kapat / Close menu */
  close: () => void;

  /** Sektoru vurgula / Highlight sector */
  highlightSector: (index: number) => void;

  /** Aci ile sektor vurgula / Highlight sector by angle */
  highlightByAngle: (angleDeg: number) => void;

  /** Mevcut vurguyu sec / Select highlighted */
  select: () => void;

  /** Index ile sec / Select by index */
  selectIndex: (index: number) => void;

  /** Sonraki oge / Next item */
  highlightNext: () => void;

  /** Onceki oge / Previous item */
  highlightPrev: () => void;

  /** Submenu gir / Enter submenu */
  enterSubmenu: () => void;

  /** Submenu cik / Exit submenu */
  exitSubmenu: () => void;

  /** Submenu icinde mi / Is in submenu */
  isInSubmenu: boolean;

  /** Mouse acisina gore sektor index / Sector index from angle */
  getSectorIndexFromAngle: (angleDeg: number) => number;

  /** Iki nokta arasi aci / Angle between two points */
  getAngle: (cx: number, cy: number, mx: number, my: number) => number;

  /** Key ile oge bul / Find item by key */
  findItem: (key: string) => RadialMenuItem | null;
}

export function useRadialMenu(props: UseRadialMenuProps): UseRadialMenuReturn {
  const {
    open: openProp,
    position: positionProp,
    onSelect,
    onOpenChange,
    ...coreProps
  } = props;

  const machineRef = useRef<ReturnType<typeof createRadialMenu> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createRadialMenu(coreProps);
  }
  const machine = machineRef.current;

  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  // Prop sync: items
  const prevItemsRef = useRef(coreProps.items);
  if (coreProps.items !== prevItemsRef.current) {
    machine.send({ type: 'SET_ITEMS', items: coreProps.items });
    prevItemsRef.current = coreProps.items;
    forceRender();
  }

  // Prop sync: controlled open/position
  const prevOpenRef = useRef<boolean | undefined>(undefined);
  if (openProp !== undefined && openProp !== prevOpenRef.current) {
    if (openProp) {
      machine.send({ type: 'OPEN', position: positionProp ?? { x: 0, y: 0 } });
    } else {
      machine.send({ type: 'CLOSE' });
    }
    prevOpenRef.current = openProp;
    forceRender();
  }

  const send = useCallback(
    (event: RadialMenuEvent) => {
      machine.send(event);
      forceRender();
    },
    [machine],
  );

  const close = useCallback(() => {
    const wasOpen = machine.isOpen();
    send({ type: 'CLOSE' });
    if (wasOpen) {
      onOpenChange?.(false);
    }
  }, [send, machine, onOpenChange]);

  const highlightSector = useCallback(
    (index: number) => {
      send({ type: 'HIGHLIGHT_SECTOR', index });
    },
    [send],
  );

  const highlightByAngle = useCallback(
    (angleDeg: number) => {
      const index = machine.getSectorIndexFromAngle(angleDeg);
      send({ type: 'HIGHLIGHT_SECTOR', index });
    },
    [send, machine],
  );

  const select = useCallback(() => {
    const idx = machine.getHighlightedIndex();
    if (idx === -1) return;

    const currentItems = machine.getCurrentItems();
    const item = currentItems[idx];
    if (!item || item.disabled) return;

    const hasChildren = item.children && item.children.length > 0;
    send({ type: 'SELECT' });

    if (!hasChildren) {
      onSelect?.(item.key, item);
      onOpenChange?.(false);
    }
  }, [send, machine, onSelect, onOpenChange]);

  const selectIndex = useCallback(
    (index: number) => {
      const currentItems = machine.getCurrentItems();
      const item = currentItems[index];
      if (!item || item.disabled) return;

      const hasChildren = item.children && item.children.length > 0;
      send({ type: 'SELECT_INDEX', index });

      if (!hasChildren) {
        onSelect?.(item.key, item);
        onOpenChange?.(false);
      }
    },
    [send, machine, onSelect, onOpenChange],
  );

  const highlightNext = useCallback(() => {
    send({ type: 'HIGHLIGHT_NEXT' });
  }, [send]);

  const highlightPrev = useCallback(() => {
    send({ type: 'HIGHLIGHT_PREV' });
  }, [send]);

  const enterSubmenu = useCallback(() => {
    send({ type: 'ENTER_SUBMENU' });
  }, [send]);

  const exitSubmenu = useCallback(() => {
    send({ type: 'EXIT_SUBMENU' });
  }, [send]);

  const ctx = machine.getContext();

  return {
    menuProps: machine.getMenuProps(),
    getSectorProps: (index: number) => machine.getSectorProps(index),
    items: machine.getCurrentItems(),
    sectors: machine.getSectors(),
    isOpen: ctx.open,
    highlightedIndex: ctx.highlightedIndex,
    position: { ...ctx.position },
    close,
    highlightSector,
    highlightByAngle,
    select,
    selectIndex,
    highlightNext,
    highlightPrev,
    enterSubmenu,
    exitSubmenu,
    isInSubmenu: machine.isInSubmenu(),
    getSectorIndexFromAngle: (angleDeg: number) => machine.getSectorIndexFromAngle(angleDeg),
    getAngle: machine.getAngle,
    findItem: (key: string) => machine.findItem(key),
  };
}
