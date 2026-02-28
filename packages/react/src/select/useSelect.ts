/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useSelect — React hook for select state machine.
 * useSelect — Select state machine React hook'u.
 *
 * Core state machine'i React state ile senkronize eder.
 * Keyboard navigasyonu ve dropdown yönetimi sağlar.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef } from 'react';
import {
  createSelect,
} from '@relteco/relui-core';
import type {
  SelectProps as CoreSelectProps,
  SelectEvent,
  SelectValue,
} from '@relteco/relui-core';

/**
 * useSelect hook props — core props + React-specific props.
 */
export interface UseSelectProps extends CoreSelectProps {
  /** Değer değişim callback'i / Value change callback */
  onValueChange?: (value: SelectValue | undefined) => void;

  /** Dropdown açılma/kapanma callback'i / Open state change callback */
  onOpenChange?: (isOpen: boolean) => void;
}

/**
 * useSelect hook dönüş tipi.
 */
export interface UseSelectReturn {
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
    'data-state': string;
    'data-disabled'?: '';
    'data-readonly'?: '';
    'data-invalid'?: '';
    tabIndex: 0;
    onClick: () => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
    onBlur: () => void;
    onPointerEnter: () => void;
    onPointerLeave: () => void;
    onFocus: () => void;
  };

  /** Listbox element attribute'lar */
  listboxProps: {
    role: 'listbox';
    tabIndex: -1;
  };

  /** Option props üretici / Option props generator */
  getOptionProps: (index: number) => {
    role: 'option';
    'aria-selected': boolean;
    'aria-disabled'?: true;
    'data-highlighted'?: '';
    'data-disabled'?: '';
    onClick: () => void;
    onPointerEnter: () => void;
  };

  /** Dropdown açık mı / Is dropdown open */
  isOpen: boolean;

  /** Seçili değer / Selected value */
  selectedValue: SelectValue | undefined;

  /** Seçili etiket / Selected label */
  selectedLabel: string | undefined;

  /** Pasif mi / Is disabled */
  isDisabled: boolean;

  /** Salt okunur mu / Is read-only */
  isReadOnly: boolean;

  /** Geçersiz mi / Is invalid */
  isInvalid: boolean;

  /** Etkileşim durumu / Interaction state */
  interactionState: string;

  /** Highlight edilen indeks / Highlighted index */
  highlightedIndex: number;
}

/**
 * Select hook'u — core state machine + keyboard navigasyonu + React state.
 *
 * @example
 * ```tsx
 * const { triggerProps, listboxProps, getOptionProps, isOpen, selectedLabel } = useSelect({
 *   options: [{ value: 'tr', label: 'Türkiye' }],
 *   onValueChange: (v) => console.log(v),
 * });
 * ```
 */
export function useSelect(props: UseSelectProps): UseSelectReturn {
  const { onValueChange, onOpenChange, ...coreProps } = props;

  // Machine ref — stable across renders
  const machineRef = useRef<ReturnType<typeof createSelect> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createSelect(coreProps);
  }
  const machine = machineRef.current;

  // Re-render counter
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  // Prop sync — render sırasında
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
    (event: SelectEvent) => {
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
          if (ctx.isOpen) {
            send({ type: 'HIGHLIGHT_FIRST' });
          }
          break;
        }

        case 'End': {
          event.preventDefault();
          if (ctx.isOpen) {
            send({ type: 'HIGHLIGHT_LAST' });
          }
          break;
        }

        case 'Enter':
        case ' ': {
          event.preventDefault();
          if (ctx.isOpen && ctx.highlightedIndex >= 0) {
            const opt = ctx.flatOptions[ctx.highlightedIndex];
            if (opt && !opt.disabled) {
              send({ type: 'SELECT', value: opt.value });
              onValueChange?.(opt.value);
              onOpenChange?.(false);
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
    if (wasOpen) {
      onOpenChange?.(false);
    }
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
        send({ type: 'SELECT', value: opt.value });
        onValueChange?.(opt.value);
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
    selectedValue: ctx.selectedValue,
    selectedLabel: machine.getSelectedLabel(),
    isDisabled: ctx.disabled,
    isReadOnly: ctx.readOnly,
    isInvalid: ctx.invalid,
    interactionState: ctx.interactionState,
    highlightedIndex: ctx.highlightedIndex,
  };
}
