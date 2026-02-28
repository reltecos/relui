/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useTagInput — React hook for tag input state machine.
 * useTagInput — TagInput state machine React hook'u.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef } from 'react';
import { createTagInput } from '@relteco/relui-core';
import type {
  TagInputProps as CoreTagInputProps,
  TagInputEvent,
} from '@relteco/relui-core';

/**
 * useTagInput hook props.
 */
export interface UseTagInputProps extends CoreTagInputProps {
  /** Değer değişim callback'i / Value change callback */
  onValueChange?: (values: string[]) => void;

  /** Dropdown açılma/kapanma callback'i / Open state change callback */
  onOpenChange?: (isOpen: boolean) => void;

  /** Arama değeri değişim callback'i / Search value change callback */
  onSearchChange?: (searchValue: string) => void;
}

/**
 * useTagInput hook dönüş tipi.
 */
export interface UseTagInputReturn {
  /** Input element props */
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
  };

  /** Listbox props */
  listboxProps: {
    role: 'listbox';
    'aria-multiselectable': true;
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
  selectedValues: string[];

  /** Seçili etiketler */
  selectedLabels: string[];

  /** Arama değeri */
  searchValue: string;

  /** Filtrelenmiş seçenekler */
  filteredOptions: { value: string | number; label: string; disabled?: boolean }[];

  /** Highlight indeksi */
  highlightedIndex: number;

  /** Pasif mi */
  isDisabled: boolean;

  /** Salt okunur mu */
  isReadOnly: boolean;

  /** Geçersiz mi */
  isInvalid: boolean;

  /** Değer kaldır / Remove value */
  removeValue: (value: string) => void;

  /** Tüm seçimleri temizle / Clear all */
  clearAll: () => void;
}

export function useTagInput(props: UseTagInputProps): UseTagInputReturn {
  const { onValueChange, onOpenChange, onSearchChange, ...coreProps } = props;

  const machineRef = useRef<ReturnType<typeof createTagInput> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createTagInput(coreProps);
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
    (event: TagInputEvent) => {
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
              const prevValues = ctx.selectedValues;
              send({ type: 'ADD_VALUE', value: String(opt.value) });
              const newValues = machine.getContext().selectedValues;
              if (newValues !== prevValues) {
                onValueChange?.(newValues);
              }
            }
          } else if (ctx.allowCustomValue && ctx.searchValue.trim()) {
            const prevValues = ctx.selectedValues;
            send({ type: 'ADD_VALUE', value: ctx.searchValue.trim() });
            const newValues = machine.getContext().selectedValues;
            if (newValues !== prevValues) {
              onValueChange?.(newValues);
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

        case 'Backspace': {
          if (ctx.searchValue === '' && ctx.selectedValues.length > 0 && !ctx.readOnly) {
            const prevValues = ctx.selectedValues;
            send({ type: 'REMOVE_LAST' });
            const newValues = machine.getContext().selectedValues;
            if (newValues !== prevValues) {
              onValueChange?.(newValues);
            }
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
    send({ type: 'BLUR' });
    const ctx = machine.getContext();
    if (!ctx.isOpen) {
      onOpenChange?.(false);
    }
  }, [send, machine, onOpenChange]);

  const handleFocus = useCallback(() => {
    send({ type: 'FOCUS' });
    const ctx = machine.getContext();
    if (!ctx.isOpen && !ctx.disabled && !ctx.readOnly) {
      send({ type: 'OPEN' });
      onOpenChange?.(true);
    }
  }, [send, machine, onOpenChange]);

  const handleOptionClick = useCallback(
    (index: number) => {
      const ctx = machine.getContext();
      const opt = ctx.filteredOptions[index];
      if (opt && !opt.disabled) {
        const prevValues = ctx.selectedValues;
        send({ type: 'ADD_VALUE', value: String(opt.value) });
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

  const removeValue = useCallback(
    (value: string) => {
      const prevValues = machine.getContext().selectedValues;
      send({ type: 'REMOVE_VALUE', value });
      const newValues = machine.getContext().selectedValues;
      if (newValues !== prevValues) {
        onValueChange?.(newValues);
      }
    },
    [send, machine, onValueChange],
  );

  const clearAll = useCallback(() => {
    const prevValues = machine.getContext().selectedValues;
    send({ type: 'CLEAR_ALL' });
    if (prevValues.length > 0) {
      onValueChange?.([]);
    }
  }, [send, machine, onValueChange]);

  const inputDOMProps = machine.getInputProps();
  const ctx = machine.getContext();

  return {
    inputProps: {
      ...inputDOMProps,
      value: ctx.searchValue,
      onChange: handleChange,
      onKeyDown: handleKeyDown,
      onBlur: handleBlur,
      onFocus: handleFocus,
    },
    listboxProps: machine.getListboxProps(),
    getOptionProps,
    isOpen: ctx.isOpen,
    selectedValues: ctx.selectedValues,
    selectedLabels: machine.getSelectedLabels(),
    searchValue: ctx.searchValue,
    filteredOptions: ctx.filteredOptions,
    highlightedIndex: ctx.highlightedIndex,
    isDisabled: ctx.disabled,
    isReadOnly: ctx.readOnly,
    isInvalid: ctx.invalid,
    removeValue,
    clearAll,
  };
}
