/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useCombobox — React hook for combobox state machine.
 * useCombobox — Combobox state machine React hook'u.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef } from 'react';
import { createCombobox } from '@relteco/relui-core';
import type {
  ComboboxProps as CoreComboboxProps,
  ComboboxEvent,
  SelectValue,
} from '@relteco/relui-core';

/**
 * useCombobox hook props.
 */
export interface UseComboboxProps extends CoreComboboxProps {
  /** Değer değişim callback'i / Value change callback */
  onValueChange?: (value: SelectValue | undefined) => void;

  /** Dropdown açılma/kapanma callback'i / Open state change callback */
  onOpenChange?: (isOpen: boolean) => void;

  /** Arama değeri değişim callback'i / Search value change callback */
  onSearchChange?: (searchValue: string) => void;
}

/**
 * useCombobox hook dönüş tipi.
 */
export interface UseComboboxReturn {
  /** Input element event handler'lar ve attribute'lar */
  inputProps: {
    role: 'combobox';
    'aria-expanded': boolean;
    'aria-haspopup': 'listbox';
    'aria-activedescendant'?: string;
    'aria-disabled'?: true;
    'aria-readonly'?: true;
    'aria-invalid'?: true;
    'aria-required'?: true;
    'aria-autocomplete': 'list';
    'data-state': string;
    'data-disabled'?: '';
    'data-readonly'?: '';
    'data-invalid'?: '';
    autoComplete: 'off';
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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

  /** Option props üretici (filteredOptions indeksi) */
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

  /** Seçili değer */
  selectedValue: SelectValue | undefined;

  /** Seçili etiket */
  selectedLabel: string | undefined;

  /** Arama değeri */
  searchValue: string;

  /** Filtrelenmiş seçenekler */
  filteredOptions: { value: SelectValue; label: string; disabled?: boolean }[];

  /** Highlight indeksi */
  highlightedIndex: number;

  /** Pasif mi */
  isDisabled: boolean;

  /** Salt okunur mu */
  isReadOnly: boolean;

  /** Geçersiz mi */
  isInvalid: boolean;

  /** Seçimi temizle / Clear selection */
  clear: () => void;
}

export function useCombobox(props: UseComboboxProps): UseComboboxReturn {
  const { onValueChange, onOpenChange, onSearchChange, ...coreProps } = props;

  const machineRef = useRef<ReturnType<typeof createCombobox> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createCombobox(coreProps);
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
    machine.send({ type: 'SET_VALUE', value: coreProps.value });
    prevValueRef.current = coreProps.value;
  }
  if (coreProps.options !== prevOptionsRef.current) {
    machine.send({ type: 'SET_OPTIONS', options: coreProps.options });
    prevOptionsRef.current = coreProps.options;
  }

  const send = useCallback(
    (event: ComboboxEvent) => {
      const prevCtx = machine.getContext();
      const nextCtx = machine.send(event);
      if (nextCtx !== prevCtx) {
        forceRender();
      }
      return nextCtx;
    },
    [machine],
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      send({ type: 'SET_SEARCH', value });
      onSearchChange?.(value);
      onOpenChange?.(true);
    },
    [send, onSearchChange, onOpenChange],
  );

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

        case 'Enter': {
          event.preventDefault();
          if (ctx.isOpen && ctx.highlightedIndex >= 0) {
            const opt = ctx.filteredOptions[ctx.highlightedIndex];
            if (opt && !opt.disabled) {
              const prevValue = ctx.selectedValue;
              send({ type: 'SELECT', value: opt.value });
              const newValue = machine.getContext().selectedValue;
              if (newValue !== prevValue) {
                onValueChange?.(newValue);
              }
              onOpenChange?.(false);
            }
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
    const ctx = machine.getContext();
    const wasOpen = ctx.isOpen;
    const prevValue = ctx.selectedValue;
    send({ type: 'BLUR' });
    if (wasOpen) {
      onOpenChange?.(false);
      const newValue = machine.getContext().selectedValue;
      if (newValue !== prevValue) {
        onValueChange?.(newValue);
      }
    }
  }, [send, machine, onOpenChange, onValueChange]);

  const handleFocus = useCallback(() => {
    send({ type: 'FOCUS' });
    const ctx = machine.getContext();
    if (!ctx.isOpen && !ctx.disabled && !ctx.readOnly) {
      send({ type: 'OPEN' });
      onOpenChange?.(true);
    }
  }, [send, machine, onOpenChange]);

  const handlePointerEnter = useCallback(() => {
    send({ type: 'POINTER_ENTER' });
  }, [send]);

  const handlePointerLeave = useCallback(() => {
    send({ type: 'POINTER_LEAVE' });
  }, [send]);

  const handleOptionClick = useCallback(
    (index: number) => {
      const ctx = machine.getContext();
      const opt = ctx.filteredOptions[index];
      if (opt && !opt.disabled) {
        const prevValue = ctx.selectedValue;
        send({ type: 'SELECT', value: opt.value });
        const newValue = machine.getContext().selectedValue;
        if (newValue !== prevValue) {
          onValueChange?.(newValue);
        }
        onOpenChange?.(false);
      }
    },
    [send, machine, onValueChange, onOpenChange],
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

  const clearFn = useCallback(() => {
    const prevValue = machine.getContext().selectedValue;
    send({ type: 'CLEAR' });
    if (prevValue !== undefined) {
      onValueChange?.(undefined);
    }
  }, [send, machine, onValueChange]);

  const inputDOMProps = machine.getInputProps();
  const ctx = machine.getContext();

  // Input gösterilen değer: arama aktifse searchValue, yoksa seçili label
  const displayValue = ctx.isOpen
    ? ctx.searchValue
    : (machine.getSelectedLabel() ?? '');

  return {
    inputProps: {
      ...inputDOMProps,
      value: displayValue,
      onChange: handleChange,
      onKeyDown: handleKeyDown,
      onBlur: handleBlur,
      onFocus: handleFocus,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
    },
    listboxProps: machine.getListboxProps(),
    getOptionProps,
    isOpen: ctx.isOpen,
    selectedValue: ctx.selectedValue,
    selectedLabel: machine.getSelectedLabel(),
    searchValue: ctx.searchValue,
    filteredOptions: ctx.filteredOptions,
    highlightedIndex: ctx.highlightedIndex,
    isDisabled: ctx.disabled,
    isReadOnly: ctx.readOnly,
    isInvalid: ctx.invalid,
    clear: clearFn,
  };
}
