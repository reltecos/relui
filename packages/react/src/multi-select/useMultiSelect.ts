/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useMultiSelect — React hook for multi-select state machine.
 * useMultiSelect — Çoklu seçim state machine React hook'u.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef } from 'react';
import { createMultiSelect } from '@relteco/relui-core';
import type {
  MultiSelectProps as CoreMultiSelectProps,
  MultiSelectEvent,
  SelectValue,
} from '@relteco/relui-core';

/**
 * useMultiSelect hook props.
 */
export interface UseMultiSelectProps extends CoreMultiSelectProps {
  /** Değer değişim callback'i / Value change callback */
  onValueChange?: (values: SelectValue[]) => void;

  /** Dropdown açılma/kapanma callback'i / Open state change callback */
  onOpenChange?: (isOpen: boolean) => void;
}

/**
 * useMultiSelect hook dönüş tipi.
 */
export interface UseMultiSelectReturn {
  /** Trigger element event handler'lar ve attribute'lar */
  triggerProps: {
    role: 'combobox';
    'aria-expanded': boolean;
    'aria-haspopup': 'listbox';
    'aria-activedescendant'?: string;
    'aria-disabled'?: true;
    'aria-readonly'?: true;
    'aria-invalid'?: true;
    'aria-required'?: true;
    'aria-multiselectable': true;
    'data-state': string;
    'data-disabled'?: '';
    'data-readonly'?: '';
    'data-invalid'?: '';
    tabIndex: 0;
    onClick: () => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
    onBlur: () => void;
    onFocus: () => void;
    onPointerEnter: () => void;
    onPointerLeave: () => void;
  };

  /** Listbox attribute'lar */
  listboxProps: {
    role: 'listbox';
    tabIndex: -1;
  };

  /** Option props üretici */
  getOptionProps: (index: number) => {
    role: 'option';
    'aria-selected': boolean;
    'aria-disabled'?: true;
    'data-highlighted'?: '';
    'data-disabled'?: '';
    onClick: () => void;
    onPointerEnter: () => void;
  };

  /** Dropdown açık mı */
  isOpen: boolean;

  /** Seçili değerler */
  selectedValues: SelectValue[];

  /** Seçili etiketler */
  selectedLabels: string[];

  /** Seçim sayısı */
  selectionCount: number;

  /** Tümü seçili mi */
  isAllSelected: boolean;

  /** Pasif mi */
  isDisabled: boolean;

  /** Salt okunur mu */
  isReadOnly: boolean;

  /** Geçersiz mi */
  isInvalid: boolean;

  /** Bir değeri kaldır / Remove a value */
  removeValue: (value: SelectValue) => void;

  /** Tümünü seç / Select all */
  selectAll: () => void;

  /** Tümünü temizle / Clear all */
  clearAll: () => void;
}

export function useMultiSelect(props: UseMultiSelectProps): UseMultiSelectReturn {
  const { onValueChange, onOpenChange, ...coreProps } = props;

  const machineRef = useRef<ReturnType<typeof createMultiSelect> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createMultiSelect(coreProps);
  }
  const machine = machineRef.current;

  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  // Prop sync
  const prevDisabledRef = useRef(coreProps.disabled);
  const prevReadOnlyRef = useRef(coreProps.readOnly);
  const prevInvalidRef = useRef(coreProps.invalid);
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
  if (coreProps.invalid !== prevInvalidRef.current) {
    machine.send({ type: 'SET_INVALID', value: coreProps.invalid ?? false });
    prevInvalidRef.current = coreProps.invalid;
  }
  if (coreProps.value !== undefined && coreProps.value !== prevValueRef.current) {
    machine.send({ type: 'SET_VALUES', values: coreProps.value });
    prevValueRef.current = coreProps.value;
  }
  if (coreProps.options !== prevOptionsRef.current) {
    machine.send({ type: 'SET_OPTIONS', options: coreProps.options });
    prevOptionsRef.current = coreProps.options;
  }

  const send = useCallback(
    (event: MultiSelectEvent) => {
      const prevCtx = machine.getContext();
      const nextCtx = machine.send(event);
      if (nextCtx !== prevCtx) {
        forceRender();
      }
      return nextCtx;
    },
    [machine],
  );

  const handleClick = useCallback(() => {
    const prevOpen = machine.getContext().isOpen;
    send({ type: 'TOGGLE' });
    const nextOpen = machine.getContext().isOpen;
    if (nextOpen !== prevOpen) {
      onOpenChange?.(nextOpen);
    }
  }, [send, machine, onOpenChange]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const ctx = machine.getContext();

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          if (!ctx.isOpen) {
            send({ type: 'OPEN' });
            onOpenChange?.(true);
          } else {
            send({ type: 'HIGHLIGHT_NEXT' });
          }
          break;
        }

        case 'ArrowUp': {
          event.preventDefault();
          if (!ctx.isOpen) {
            send({ type: 'OPEN' });
            onOpenChange?.(true);
          } else {
            send({ type: 'HIGHLIGHT_PREV' });
          }
          break;
        }

        case 'Home': {
          event.preventDefault();
          if (ctx.isOpen) send({ type: 'HIGHLIGHT_FIRST' });
          break;
        }

        case 'End': {
          event.preventDefault();
          if (ctx.isOpen) send({ type: 'HIGHLIGHT_LAST' });
          break;
        }

        case 'Enter':
        case ' ': {
          event.preventDefault();
          if (ctx.isOpen && ctx.highlightedIndex >= 0) {
            const opt = ctx.flatOptions[ctx.highlightedIndex];
            if (opt && !opt.disabled) {
              const prevValues = ctx.selectedValues;
              send({ type: 'TOGGLE_OPTION', value: opt.value });
              const newValues = machine.getContext().selectedValues;
              if (newValues !== prevValues) {
                onValueChange?.(newValues);
              }
            }
          } else if (!ctx.isOpen) {
            send({ type: 'OPEN' });
            onOpenChange?.(true);
          }
          break;
        }

        case 'Escape': {
          if (ctx.isOpen) {
            event.preventDefault();
            send({ type: 'CLOSE' });
            onOpenChange?.(false);
          }
          break;
        }

        case 'Tab': {
          if (ctx.isOpen) {
            send({ type: 'CLOSE' });
            onOpenChange?.(false);
          }
          break;
        }
      }
    },
    [send, machine, onValueChange, onOpenChange],
  );

  const handleBlur = useCallback(() => {
    const wasOpen = machine.getContext().isOpen;
    send({ type: 'BLUR' });
    if (wasOpen) onOpenChange?.(false);
  }, [send, machine, onOpenChange]);

  const handleFocus = useCallback(() => {
    send({ type: 'FOCUS' });
  }, [send]);

  const handlePointerEnter = useCallback(() => {
    send({ type: 'POINTER_ENTER' });
  }, [send]);

  const handlePointerLeave = useCallback(() => {
    send({ type: 'POINTER_LEAVE' });
  }, [send]);

  const handleOptionClick = useCallback(
    (index: number) => {
      const ctx = machine.getContext();
      const opt = ctx.flatOptions[index];
      if (opt && !opt.disabled) {
        const prevValues = ctx.selectedValues;
        send({ type: 'TOGGLE_OPTION', value: opt.value });
        const newValues = machine.getContext().selectedValues;
        if (newValues !== prevValues) {
          onValueChange?.(newValues);
        }
      }
    },
    [send, machine, onValueChange],
  );

  const handleOptionPointerEnter = useCallback(
    (index: number) => {
      send({ type: 'HIGHLIGHT', index });
    },
    [send],
  );

  const getOptionProps = useCallback(
    (index: number) => {
      const domProps = machine.getOptionProps(index);
      return {
        ...domProps,
        onClick: () => handleOptionClick(index),
        onPointerEnter: () => handleOptionPointerEnter(index),
      };
    },
    [machine, handleOptionClick, handleOptionPointerEnter],
  );

  const removeValueFn = useCallback(
    (value: SelectValue) => {
      const prevValues = machine.getContext().selectedValues;
      send({ type: 'DESELECT', value });
      const newValues = machine.getContext().selectedValues;
      if (newValues !== prevValues) {
        onValueChange?.(newValues);
      }
    },
    [send, machine, onValueChange],
  );

  const selectAllFn = useCallback(() => {
    const prevValues = machine.getContext().selectedValues;
    send({ type: 'SELECT_ALL' });
    const newValues = machine.getContext().selectedValues;
    if (newValues !== prevValues) {
      onValueChange?.(newValues);
    }
  }, [send, machine, onValueChange]);

  const clearAllFn = useCallback(() => {
    const prevValues = machine.getContext().selectedValues;
    send({ type: 'CLEAR_ALL' });
    const newValues = machine.getContext().selectedValues;
    if (newValues !== prevValues) {
      onValueChange?.(newValues);
    }
  }, [send, machine, onValueChange]);

  const triggerDOMProps = machine.getTriggerProps();
  const ctx = machine.getContext();

  return {
    triggerProps: {
      ...triggerDOMProps,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      onBlur: handleBlur,
      onFocus: handleFocus,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
    },
    listboxProps: machine.getListboxProps(),
    getOptionProps,
    isOpen: ctx.isOpen,
    selectedValues: ctx.selectedValues,
    selectedLabels: machine.getSelectedLabels(),
    selectionCount: machine.getSelectionCount(),
    isAllSelected: machine.isAllSelected(),
    isDisabled: ctx.disabled,
    isReadOnly: ctx.readOnly,
    isInvalid: ctx.invalid,
    removeValue: removeValueFn,
    selectAll: selectAllFn,
    clearAll: clearAllFn,
  };
}
