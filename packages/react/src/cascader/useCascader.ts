/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useCascader — React hook for cascader state machine.
 * useCascader — Cascader state machine React hook'u.
 *
 * Core state machine'i React state ile senkronize eder.
 * Keyboard navigasyonu ve multi-level kolon yönetimi sağlar.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef } from 'react';
import {
  createCascader,
} from '@relteco/relui-core';
import type {
  CascaderProps as CoreCascaderProps,
  CascaderEvent,
  CascaderValue,
  CascaderOption,
} from '@relteco/relui-core';

/**
 * useCascader hook props — core props + React-specific props.
 */
export interface UseCascaderProps extends CoreCascaderProps {
  /** Değer değişim callback'i / Value change callback */
  onValueChange?: (value: CascaderValue[]) => void;

  /** Dropdown açılma/kapanma callback'i / Open state change callback */
  onOpenChange?: (isOpen: boolean) => void;
}

/**
 * useCascader hook dönüş tipi.
 */
export interface UseCascaderReturn {
  /** Trigger element event handler'lar ve attribute'lar */
  triggerProps: {
    role: 'combobox';
    'aria-expanded': boolean;
    'aria-haspopup': 'listbox';
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

  /** Kolon props üretici / Column props generator */
  getColumnProps: (level: number) => {
    role: 'listbox';
    tabIndex: -1;
    'aria-label': string;
  };

  /** Option props üretici / Option props generator */
  getOptionProps: (level: number, index: number) => {
    role: 'option';
    'aria-selected': boolean;
    'aria-disabled'?: true;
    'data-highlighted'?: '';
    'data-disabled'?: '';
    'data-expanded'?: '';
    onClick: () => void;
    onPointerEnter: () => void;
  };

  /** Belirli seviyedeki seçenekleri al / Get options at level */
  getOptionsAtLevel: (level: number) => CascaderOption[];

  /** Dropdown açık mı / Is dropdown open */
  isOpen: boolean;

  /** Seçili yol / Selected path */
  selectedPath: CascaderValue[];

  /** Seçili etiketler / Selected labels */
  selectedLabels: string[];

  /** Son seçili etiket / Last selected label */
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

  /** Aktif seviye / Active level */
  activeLevel: number;

  /** Aktif yol / Active path */
  activePath: CascaderValue[];

  /** Açık kolon sayısı / Number of visible columns */
  visibleColumnCount: number;
}

/**
 * Cascader hook'u — core state machine + keyboard navigasyonu + React state.
 *
 * @example
 * ```tsx
 * const { triggerProps, isOpen, getOptionsAtLevel, selectedLabels } = useCascader({
 *   options: [...],
 *   onValueChange: (path) => console.log(path),
 * });
 * ```
 */
export function useCascader(props: UseCascaderProps): UseCascaderReturn {
  const { onValueChange, onOpenChange, ...coreProps } = props;

  // Machine ref — stable across renders
  const machineRef = useRef<ReturnType<typeof createCascader> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createCascader(coreProps);
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
    (event: CascaderEvent) => {
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

        case 'ArrowRight': {
          if (ctx.isOpen) {
            event.preventDefault();
            send({ type: 'LEVEL_NEXT' });
          }
          break;
        }

        case 'ArrowLeft': {
          if (ctx.isOpen) {
            event.preventDefault();
            send({ type: 'LEVEL_PREV' });
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
            const levelOptions = machine.getOptionsAtLevel(ctx.activeLevel);
            const opt = levelOptions[ctx.highlightedIndex];
            if (opt && !opt.disabled) {
              // Yaprak düğüm ise seç, değilse expand et
              if (!opt.children || opt.children.length === 0) {
                // Tam yolu oluştur
                const path = ctx.activePath.slice(0, ctx.activeLevel);
                path[ctx.activeLevel] = opt.value;
                send({ type: 'SELECT', path });
                onValueChange?.(path);
                onOpenChange?.(false);
              } else {
                send({ type: 'LEVEL_NEXT' });
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
    (level: number, index: number) => {
      const levelOptions = machine.getOptionsAtLevel(level);
      const opt = levelOptions[index];
      if (!opt || opt.disabled) return;

      if (opt.children && opt.children.length > 0) {
        // Has children → expand
        send({ type: 'EXPAND', level, value: opt.value });
        // Seviyeyi de güncelle
        const ctx = machine.getContext();
        if (ctx.activeLevel !== level) {
          // activeLevel'ı güncellemek için tekrar expand gönder
          // (machine zaten doğru activePath'i ayarlamış olacak)
        }
      } else {
        // Yaprak düğüm → seç
        const ctx = machine.getContext();
        const path = ctx.activePath.slice(0, level);
        path[level] = opt.value;
        send({ type: 'SELECT', path });
        onValueChange?.(path);
        onOpenChange?.(false);
      }
    },
    [send, machine, onValueChange, onOpenChange],
  );

  const handleOptionPointerEnter = useCallback(
    (level: number, index: number) => {
      const ctx = machine.getContext();
      const expandTrigger = ctx.expandTrigger;

      // Seviye değiştiyse activeLevel güncelle
      if (level !== ctx.activeLevel) {
        // Level değişikliği olmadan sadece highlight
      }

      // Highlight güncelle — aynı seviyedeyse
      if (level === ctx.activeLevel) {
        send({ type: 'HIGHLIGHT', index });
      }

      // Hover expand tetikleyicisi
      if (expandTrigger === 'hover') {
        const levelOptions = machine.getOptionsAtLevel(level);
        const opt = levelOptions[index];
        if (opt && !opt.disabled && opt.children && opt.children.length > 0) {
          send({ type: 'EXPAND', level, value: opt.value });
        }
      }
    },
    [send, machine],
  );

  const getColumnProps = useCallback(
    (level: number) => {
      return machine.getColumnProps(level);
    },
    [machine],
  );

  const getOptionProps = useCallback(
    (level: number, index: number) => {
      const domProps = machine.getOptionProps(level, index);
      return {
        ...domProps,
        onClick: () => handleOptionClick(level, index),
        onPointerEnter: () => handleOptionPointerEnter(level, index),
      };
    },
    [machine, handleOptionClick, handleOptionPointerEnter],
  );

  const getOptionsAtLevel = useCallback(
    (level: number) => {
      return machine.getOptionsAtLevel(level);
    },
    [machine],
  );

  const triggerDOMProps = machine.getTriggerProps();
  const ctx = machine.getContext();

  // Kaç kolon görünür — activePath uzunluğu + 1 (root kolon her zaman)
  const visibleColumnCount = ctx.isOpen
    ? ctx.activePath.length + 1
    : 0;

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
    getColumnProps,
    getOptionProps,
    getOptionsAtLevel,
    isOpen: ctx.isOpen,
    selectedPath: ctx.selectedPath,
    selectedLabels: machine.getSelectedLabels(),
    selectedLabel: machine.getSelectedLabel(),
    isDisabled: ctx.disabled,
    isReadOnly: ctx.readOnly,
    isInvalid: ctx.invalid,
    interactionState: ctx.interactionState,
    highlightedIndex: ctx.highlightedIndex,
    activeLevel: ctx.activeLevel,
    activePath: ctx.activePath,
    visibleColumnCount,
  };
}
