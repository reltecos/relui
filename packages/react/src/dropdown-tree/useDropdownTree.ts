/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useDropdownTree — React hook for dropdown tree state machine.
 * useDropdownTree — DropdownTree state machine React hook'u.
 *
 * Core state machine'i React state ile senkronize eder.
 * Tree expand/collapse, seçim ve keyboard navigasyonu sağlar.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef } from 'react';
import {
  createDropdownTree,
  findNodeByValue,
} from '@relteco/relui-core';
import type {
  DropdownTreeProps as CoreDropdownTreeProps,
  DropdownTreeEvent,
  FlatTreeNode,
  SelectValue,
} from '@relteco/relui-core';

/**
 * useDropdownTree hook props — core props + React-specific props.
 */
export interface UseDropdownTreeProps extends CoreDropdownTreeProps {
  /** Değer değişim callback'i (single mode) / Value change callback (single mode) */
  onValueChange?: (value: SelectValue | undefined) => void;

  /** Değerler değişim callback'i (multiple mode) / Values change callback (multiple mode) */
  onValuesChange?: (values: SelectValue[]) => void;

  /** Dropdown açılma/kapanma callback'i / Open state change callback */
  onOpenChange?: (isOpen: boolean) => void;
}

/**
 * useDropdownTree hook dönüş tipi.
 */
export interface UseDropdownTreeReturn {
  /** Trigger element event handler'lar ve attribute'lar */
  triggerProps: {
    role: 'combobox';
    'aria-expanded': boolean;
    'aria-haspopup': 'tree';
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

  /** Panel props */
  panelProps: {
    role: 'tree';
    'aria-multiselectable'?: true;
    tabIndex: -1;
  };

  /** Node props üretici / Node props generator */
  getNodeProps: (flatNode: FlatTreeNode) => {
    role: 'treeitem';
    'aria-expanded'?: boolean;
    'aria-selected': boolean;
    'aria-disabled'?: true;
    'aria-level': number;
    'data-highlighted'?: '';
    'data-disabled'?: '';
    onClick: () => void;
    onPointerEnter: () => void;
  };

  /** Görünür düğümler / Visible (flattened) nodes */
  visibleNodes: FlatTreeNode[];

  /** Dropdown açık mı / Is dropdown open */
  isOpen: boolean;

  /** Seçili etiketler / Selected labels */
  selectedLabels: string[];

  /** Seçili etiket (single mode) / Selected label (single mode) */
  selectedLabel: string | undefined;

  /** Seçili değer (single mode) / Selected value (single mode) */
  selectedValue: SelectValue | undefined;

  /** Seçili değerler (multiple mode) / Selected values (multiple mode) */
  selectedValues: Set<SelectValue>;

  /** Seçim modu / Selection mode */
  selectionMode: 'single' | 'multiple';

  /** Pasif mi / Is disabled */
  isDisabled: boolean;

  /** Salt okunur mu / Is read-only */
  isReadOnly: boolean;

  /** Geçersiz mi / Is invalid */
  isInvalid: boolean;

  /** Etkileşim durumu / Interaction state */
  interactionState: string;

  /** Highlight edilen value / Highlighted value */
  highlightedValue: SelectValue | undefined;
}

/**
 * DropdownTree hook'u — core state machine + keyboard navigasyonu + React state.
 *
 * @example
 * ```tsx
 * const { triggerProps, isOpen, visibleNodes, selectedLabels } = useDropdownTree({
 *   nodes: [...],
 *   onValueChange: (value) => console.log(value),
 * });
 * ```
 */
export function useDropdownTree(props: UseDropdownTreeProps): UseDropdownTreeReturn {
  const { onValueChange, onValuesChange, onOpenChange, ...coreProps } = props;

  // Machine ref — stable across renders
  const machineRef = useRef<ReturnType<typeof createDropdownTree> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createDropdownTree(coreProps);
  }
  const machine = machineRef.current;

  // Re-render counter
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  // Prop sync — render sırasında
  const prevDisabledRef = useRef(coreProps.disabled);
  const prevReadOnlyRef = useRef(coreProps.readOnly);
  const prevInvalidRef = useRef(coreProps.invalid);
  const prevValueRef = useRef(coreProps.value);
  const prevValuesRef = useRef(coreProps.values);
  const prevNodesRef = useRef(coreProps.nodes);

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
  if (coreProps.values !== undefined && coreProps.values !== prevValuesRef.current) {
    machine.send({ type: 'SET_VALUES', values: coreProps.values });
    prevValuesRef.current = coreProps.values;
  }
  if (coreProps.nodes !== prevNodesRef.current) {
    machine.send({ type: 'SET_NODES', nodes: coreProps.nodes });
    prevNodesRef.current = coreProps.nodes;
  }

  const send = useCallback(
    (event: DropdownTreeEvent) => {
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
          if (ctx.isOpen && ctx.highlightedValue !== undefined) {
            const node = findNodeByValue(ctx.nodes, ctx.highlightedValue);
            if (node && node.children && node.children.length > 0) {
              event.preventDefault();
              if (!ctx.expandedValues.has(ctx.highlightedValue)) {
                send({ type: 'EXPAND', value: ctx.highlightedValue });
              } else {
                // Zaten açıksa ilk child'a geç
                send({ type: 'HIGHLIGHT_NEXT' });
              }
            }
          }
          break;
        }

        case 'ArrowLeft': {
          if (ctx.isOpen && ctx.highlightedValue !== undefined) {
            const node = findNodeByValue(ctx.nodes, ctx.highlightedValue);
            if (node && node.children && node.children.length > 0 && ctx.expandedValues.has(ctx.highlightedValue)) {
              event.preventDefault();
              send({ type: 'COLLAPSE', value: ctx.highlightedValue });
            } else {
              // Parent'a geç — visibleNodes'dan parentValue bul
              event.preventDefault();
              const visible = machine.getVisibleNodes();
              const current = visible.find((n) => n.value === ctx.highlightedValue);
              if (current && current.parentValue !== undefined) {
                send({ type: 'HIGHLIGHT', value: current.parentValue });
              }
            }
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
          if (ctx.isOpen && ctx.highlightedValue !== undefined) {
            const prevCtx = machine.getContext();
            send({ type: 'SELECT', value: ctx.highlightedValue });
            const nextCtx = machine.getContext();

            if (nextCtx.selectionMode === 'single') {
              if (nextCtx.selectedValue !== prevCtx.selectedValue) {
                onValueChange?.(nextCtx.selectedValue);
              }
              if (!nextCtx.isOpen && prevCtx.isOpen) {
                onOpenChange?.(false);
              }
            } else {
              onValuesChange?.([...nextCtx.selectedValues]);
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
    [send, machine, onValueChange, onValuesChange, onOpenChange],
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

  const handleNodeClick = useCallback(
    (flatNode: FlatTreeNode) => {
      if (flatNode.disabled) return;

      if (flatNode.hasChildren) {
        send({ type: 'TOGGLE_EXPAND', value: flatNode.value });
        send({ type: 'HIGHLIGHT', value: flatNode.value });
      }

      // Select — leaf veya multiple modda her node seçilebilir
      const ctx = machine.getContext();
      if (ctx.selectionMode === 'multiple' || !flatNode.hasChildren) {
        const prevCtx = machine.getContext();
        send({ type: 'SELECT', value: flatNode.value });
        const nextCtx = machine.getContext();

        if (nextCtx.selectionMode === 'single') {
          if (nextCtx.selectedValue !== prevCtx.selectedValue) {
            onValueChange?.(nextCtx.selectedValue);
          }
          if (!nextCtx.isOpen && prevCtx.isOpen) {
            onOpenChange?.(false);
          }
        } else {
          onValuesChange?.([...nextCtx.selectedValues]);
        }
      }
    },
    [send, machine, onValueChange, onValuesChange, onOpenChange],
  );

  const handleNodePointerEnter = useCallback(
    (flatNode: FlatTreeNode) => {
      if (!flatNode.disabled) {
        send({ type: 'HIGHLIGHT', value: flatNode.value });
      }
    },
    [send],
  );

  const getNodeProps = useCallback(
    (flatNode: FlatTreeNode) => {
      const domProps = machine.getNodeProps(flatNode);
      return {
        ...domProps,
        onClick: () => handleNodeClick(flatNode),
        onPointerEnter: () => handleNodePointerEnter(flatNode),
      };
    },
    [machine, handleNodeClick, handleNodePointerEnter],
  );

  const triggerDOMProps = machine.getTriggerProps();
  const ctx = machine.getContext();
  const visibleNodes = ctx.isOpen ? machine.getVisibleNodes() : [];
  const labels = machine.getSelectedLabels();

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
    panelProps: machine.getPanelProps(),
    getNodeProps,
    visibleNodes,
    isOpen: ctx.isOpen,
    selectedLabels: labels,
    selectedLabel: labels.length > 0 ? labels[0] : undefined,
    selectedValue: ctx.selectedValue,
    selectedValues: ctx.selectedValues,
    selectionMode: ctx.selectionMode,
    isDisabled: ctx.disabled,
    isReadOnly: ctx.readOnly,
    isInvalid: ctx.invalid,
    interactionState: ctx.interactionState,
    highlightedValue: ctx.highlightedValue,
  };
}
