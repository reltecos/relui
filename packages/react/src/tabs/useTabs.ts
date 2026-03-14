/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useTabs — React hook for tabs state machine.
 * useTabs — Tabs state machine React hook'u.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef } from 'react';
import { createTabs } from '@relteco/relui-core';
import type {
  TabsProps as CoreTabsProps,
  TabsEvent,
  TabItem,
} from '@relteco/relui-core';

/**
 * useTabs hook props.
 */
export interface UseTabsProps extends CoreTabsProps {
  /** Değer değişim callback'i / Value change callback */
  onValueChange?: (value: string) => void;

  /** Tab kapatma callback'i / Tab close callback */
  onClose?: (value: string) => void;
}

/**
 * useTabs hook dönüş tipi.
 */
export interface UseTabsReturn {
  /** Tablist element event handler'lar ve attribute'lar */
  listProps: {
    role: 'tablist';
    'aria-orientation': 'horizontal' | 'vertical';
    'aria-disabled': true | undefined;
    'data-disabled': '' | undefined;
    'data-orientation': 'horizontal' | 'vertical';
    onKeyDown: (event: React.KeyboardEvent) => void;
  };

  /** Tab buton props üretici */
  getTabProps: (index: number) => {
    role: 'tab';
    tabIndex: 0 | -1;
    'aria-selected': boolean;
    'aria-disabled': true | undefined;
    'aria-controls': string;
    'data-state': 'active' | 'inactive';
    'data-disabled': '' | undefined;
    id: string;
    onClick: () => void;
    onFocus: () => void;
  };

  /** TabPanel props üretici */
  getPanelProps: (value: string) => {
    role: 'tabpanel';
    'aria-labelledby': string;
    id: string;
    tabIndex: 0;
    hidden: boolean;
  };

  /** Seçili değer */
  selectedValue: string | undefined;

  /** Seçili indeks */
  selectedIndex: number;

  /** Seçili etiket */
  selectedLabel: string | undefined;

  /** Focused indeks */
  focusedIndex: number;

  /** Tab tanımları */
  items: TabItem[];

  /** Pasif mi */
  isDisabled: boolean;

  /** Yönelim */
  orientation: 'horizontal' | 'vertical';

  /** Aktivasyon modu */
  activationMode: 'automatic' | 'manual';

  /** Tab kapat */
  closeTab: (value: string) => void;
}

export function useTabs(
  props: UseTabsProps,
  idPrefix = 'tabs',
): UseTabsReturn {
  const { onValueChange, onClose, ...coreProps } = props;

  const machineRef = useRef<ReturnType<typeof createTabs> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createTabs(coreProps, idPrefix);
  }
  const machine = machineRef.current;

  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  // Prop sync
  const prevDisabledRef = useRef(coreProps.disabled);
  const prevValueRef = useRef(coreProps.value);
  const prevItemsRef = useRef(coreProps.items);
  const prevOrientationRef = useRef(coreProps.orientation);
  const prevActivationModeRef = useRef(coreProps.activationMode);

  if (coreProps.disabled !== prevDisabledRef.current) {
    machine.send({ type: 'SET_DISABLED', value: coreProps.disabled ?? false });
    prevDisabledRef.current = coreProps.disabled;
  }
  if (coreProps.value !== undefined && coreProps.value !== prevValueRef.current) {
    machine.send({ type: 'SET_VALUE', value: coreProps.value });
    prevValueRef.current = coreProps.value;
  }
  if (coreProps.items !== prevItemsRef.current) {
    machine.send({ type: 'SET_ITEMS', items: coreProps.items });
    prevItemsRef.current = coreProps.items;
  }
  if (coreProps.orientation !== undefined && coreProps.orientation !== prevOrientationRef.current) {
    machine.send({ type: 'SET_ORIENTATION', orientation: coreProps.orientation });
    prevOrientationRef.current = coreProps.orientation;
  }
  if (coreProps.activationMode !== undefined && coreProps.activationMode !== prevActivationModeRef.current) {
    machine.send({ type: 'SET_ACTIVATION_MODE', activationMode: coreProps.activationMode });
    prevActivationModeRef.current = coreProps.activationMode;
  }

  const send = useCallback(
    (event: TabsEvent) => {
      const prevCtx = machine.getContext();
      const nextCtx = machine.send(event);
      if (nextCtx !== prevCtx) {
        forceRender();
      }
      return nextCtx;
    },
    [machine],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const ctx = machine.getContext();
      if (ctx.disabled) return;

      const isHorizontal = ctx.orientation === 'horizontal';
      const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
      const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';

      switch (event.key) {
        case nextKey: {
          event.preventDefault();
          const prevValue = ctx.selectedValue;
          const nextCtx = send({ type: 'FOCUS_NEXT' });
          if (ctx.activationMode === 'automatic' && nextCtx.selectedValue !== prevValue && nextCtx.selectedValue !== undefined) {
            onValueChange?.(nextCtx.selectedValue);
          }
          break;
        }
        case prevKey: {
          event.preventDefault();
          const prevValue = ctx.selectedValue;
          const nextCtx = send({ type: 'FOCUS_PREV' });
          if (ctx.activationMode === 'automatic' && nextCtx.selectedValue !== prevValue && nextCtx.selectedValue !== undefined) {
            onValueChange?.(nextCtx.selectedValue);
          }
          break;
        }
        case 'Home': {
          event.preventDefault();
          const prevValue = ctx.selectedValue;
          const nextCtx = send({ type: 'FOCUS_FIRST' });
          if (ctx.activationMode === 'automatic' && nextCtx.selectedValue !== prevValue && nextCtx.selectedValue !== undefined) {
            onValueChange?.(nextCtx.selectedValue);
          }
          break;
        }
        case 'End': {
          event.preventDefault();
          const prevValue = ctx.selectedValue;
          const nextCtx = send({ type: 'FOCUS_LAST' });
          if (ctx.activationMode === 'automatic' && nextCtx.selectedValue !== prevValue && nextCtx.selectedValue !== undefined) {
            onValueChange?.(nextCtx.selectedValue);
          }
          break;
        }
        case 'Enter':
        case ' ': {
          event.preventDefault();
          if (ctx.activationMode === 'manual') {
            const focusedItem = ctx.items[ctx.focusedIndex];
            if (focusedItem && !focusedItem.disabled) {
              const prevValue = ctx.selectedValue;
              send({ type: 'SELECT', value: focusedItem.value });
              if (focusedItem.value !== prevValue) {
                onValueChange?.(focusedItem.value);
              }
            }
          }
          break;
        }
      }
    },
    [send, machine, onValueChange],
  );

  const handleTabClick = useCallback(
    (index: number) => {
      const ctx = machine.getContext();
      if (ctx.disabled) return;
      const item = ctx.items[index];
      if (item && !item.disabled) {
        const prevValue = ctx.selectedValue;
        send({ type: 'SELECT', value: item.value });
        if (item.value !== prevValue) {
          onValueChange?.(item.value);
        }
      }
    },
    [send, machine, onValueChange],
  );

  const handleTabFocus = useCallback(
    (index: number) => {
      const ctx = machine.getContext();
      if (ctx.activationMode === 'automatic') {
        const item = ctx.items[index];
        if (item && !item.disabled) {
          const prevValue = ctx.selectedValue;
          send({ type: 'FOCUS', index });
          if (item.value !== prevValue) {
            onValueChange?.(item.value);
          }
          return;
        }
      }
      send({ type: 'FOCUS', index });
    },
    [send, machine, onValueChange],
  );

  const closeTab = useCallback(
    (value: string) => {
      const ctx = machine.getContext();
      const idx = ctx.items.findIndex((item) => item.value === value);
      if (idx < 0) return;
      const item = ctx.items[idx];
      if (!item || !item.closable) return;

      onClose?.(value);
      send({ type: 'CLOSE_TAB', value });
    },
    [send, machine, onClose],
  );

  const getTabProps = useCallback(
    (index: number) => {
      const domProps = machine.getTabProps(index);
      return {
        ...domProps,
        onClick: () => handleTabClick(index),
        onFocus: () => handleTabFocus(index),
      };
    },
    [machine, handleTabClick, handleTabFocus],
  );

  const getPanelProps = useCallback(
    (value: string) => {
      return machine.getPanelProps(value);
    },
    [machine],
  );

  const listDOMProps = machine.getListProps();
  const ctx = machine.getContext();

  return {
    listProps: {
      ...listDOMProps,
      onKeyDown: handleKeyDown,
    },
    getTabProps,
    getPanelProps,
    selectedValue: ctx.selectedValue,
    selectedIndex: machine.getSelectedIndex(),
    selectedLabel: machine.getSelectedLabel(),
    focusedIndex: ctx.focusedIndex,
    items: ctx.items,
    isDisabled: ctx.disabled,
    orientation: ctx.orientation,
    activationMode: ctx.activationMode,
    closeTab,
  };
}
