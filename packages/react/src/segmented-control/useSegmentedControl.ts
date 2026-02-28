/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useSegmentedControl — React hook for segmented control state machine.
 * useSegmentedControl — SegmentedControl state machine React hook'u.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef } from 'react';
import { createSegmentedControl } from '@relteco/relui-core';
import type {
  SegmentedControlProps as CoreSegmentedControlProps,
  SegmentedControlEvent,
} from '@relteco/relui-core';

/**
 * useSegmentedControl hook props.
 */
export interface UseSegmentedControlProps extends CoreSegmentedControlProps {
  /** Değer değişim callback'i / Value change callback */
  onValueChange?: (value: string) => void;
}

/**
 * useSegmentedControl hook dönüş tipi.
 */
export interface UseSegmentedControlReturn {
  /** Root element event handler'lar ve attribute'lar */
  rootProps: {
    role: 'tablist';
    'aria-disabled': true | undefined;
    'data-disabled': '' | undefined;
    'data-readonly': '' | undefined;
    onKeyDown: (event: React.KeyboardEvent) => void;
  };

  /** Item (segment) props üretici */
  getItemProps: (index: number) => {
    role: 'tab';
    tabIndex: 0 | -1;
    'aria-selected': boolean;
    'aria-disabled': true | undefined;
    'data-state': 'active' | 'inactive';
    'data-disabled': '' | undefined;
    id: string;
    onClick: () => void;
    onFocus: () => void;
  };

  /** Seçili değer */
  selectedValue: string | undefined;

  /** Seçili indeks */
  selectedIndex: number;

  /** Seçili etiket */
  selectedLabel: string | undefined;

  /** Focused indeks */
  focusedIndex: number;

  /** Seçenekler */
  options: CoreSegmentedControlProps['options'];

  /** Pasif mi */
  isDisabled: boolean;

  /** Salt okunur mu */
  isReadOnly: boolean;
}

export function useSegmentedControl(
  props: UseSegmentedControlProps,
  idPrefix = 'sc',
): UseSegmentedControlReturn {
  const { onValueChange, ...coreProps } = props;

  const machineRef = useRef<ReturnType<typeof createSegmentedControl> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createSegmentedControl(coreProps, idPrefix);
  }
  const machine = machineRef.current;

  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  // Prop sync
  const prevDisabledRef = useRef(coreProps.disabled);
  const prevReadOnlyRef = useRef(coreProps.readOnly);
  const prevValueRef = useRef(coreProps.value);
  const prevOptionsRef = useRef(coreProps.options);

  if (coreProps.disabled !== prevDisabledRef.current) {
    machine.send({ type: 'SET_DISABLED', value: coreProps.disabled ?? false });
    prevDisabledRef.current = coreProps.disabled;
  }
  if (coreProps.readOnly !== prevReadOnlyRef.current) {
    machine.send({ type: 'SET_READ_ONLY', value: coreProps.readOnly ?? false });
    prevReadOnlyRef.current = coreProps.readOnly;
  }
  if (coreProps.value !== undefined && coreProps.value !== prevValueRef.current) {
    machine.send({ type: 'SET_VALUE', value: coreProps.value });
    prevValueRef.current = coreProps.value;
  }
  if (coreProps.options !== prevOptionsRef.current) {
    machine.send({ type: 'SET_OPTIONS', options: coreProps.options });
    prevOptionsRef.current = coreProps.options;
  }

  const send = useCallback(
    (event: SegmentedControlEvent) => {
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

      switch (event.key) {
        case 'ArrowRight': {
          event.preventDefault();
          send({ type: 'FOCUS_NEXT' });
          break;
        }
        case 'ArrowLeft': {
          event.preventDefault();
          send({ type: 'FOCUS_PREV' });
          break;
        }
        case 'Home': {
          event.preventDefault();
          send({ type: 'FOCUS_FIRST' });
          break;
        }
        case 'End': {
          event.preventDefault();
          send({ type: 'FOCUS_LAST' });
          break;
        }
        case 'Enter':
        case ' ': {
          event.preventDefault();
          if (ctx.readOnly) break;
          const focusedOpt = ctx.options[ctx.focusedIndex];
          if (focusedOpt && !focusedOpt.disabled) {
            const prevValue = ctx.selectedValue;
            send({ type: 'SELECT', value: focusedOpt.value });
            if (focusedOpt.value !== prevValue) {
              onValueChange?.(focusedOpt.value);
            }
          }
          break;
        }
      }
    },
    [send, machine, onValueChange],
  );

  const handleItemClick = useCallback(
    (index: number) => {
      const ctx = machine.getContext();
      if (ctx.disabled || ctx.readOnly) return;
      const opt = ctx.options[index];
      if (opt && !opt.disabled) {
        const prevValue = ctx.selectedValue;
        send({ type: 'SELECT', value: opt.value });
        if (opt.value !== prevValue) {
          onValueChange?.(opt.value);
        }
      }
    },
    [send, machine, onValueChange],
  );

  const handleItemFocus = useCallback(
    (index: number) => {
      send({ type: 'FOCUS', index });
    },
    [send],
  );

  const getItemProps = useCallback(
    (index: number) => {
      const domProps = machine.getItemProps(index);
      return {
        ...domProps,
        onClick: () => handleItemClick(index),
        onFocus: () => handleItemFocus(index),
      };
    },
    [machine, handleItemClick, handleItemFocus],
  );

  const rootDOMProps = machine.getRootProps();
  const ctx = machine.getContext();

  return {
    rootProps: {
      ...rootDOMProps,
      onKeyDown: handleKeyDown,
    },
    getItemProps,
    selectedValue: ctx.selectedValue,
    selectedIndex: machine.getSelectedIndex(),
    selectedLabel: machine.getSelectedLabel(),
    focusedIndex: ctx.focusedIndex,
    options: ctx.options,
    isDisabled: ctx.disabled,
    isReadOnly: ctx.readOnly,
  };
}
