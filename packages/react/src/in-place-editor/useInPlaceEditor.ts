/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useInPlaceEditor — React hook for in-place editing.
 * useInPlaceEditor — Yerinde düzenleme React hook'u.
 *
 * Core state machine'i sarmalayarak React entegrasyonu sağlar.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef } from 'react';
import {
  createInPlaceEditor,
  type InPlaceEditorProps,
  type InPlaceEditorState,
  type InPlaceEditorActivation,
} from '@relteco/relui-core';

/**
 * useInPlaceEditor hook props.
 */
export interface UseInPlaceEditorProps extends InPlaceEditorProps {
  /** Controlled value */
  value?: string;

  /** Değer değişim callback'i / Value change callback */
  onValueChange?: (value: string) => void;

  /** Onaylama callback'i / Confirm callback */
  onConfirm?: (value: string) => void;

  /** İptal callback'i / Cancel callback */
  onCancel?: () => void;
}

/**
 * useInPlaceEditor hook dönüş tipi.
 * useInPlaceEditor hook return type.
 */
export interface UseInPlaceEditorReturn {
  /** Mevcut durum / Current state */
  state: InPlaceEditorState;

  /** Kaydedilmiş değer / Committed value */
  value: string;

  /** Düzenleme değeri / Edit value */
  editValue: string;

  /** Düzenlemeye başla / Start editing */
  startEdit: () => void;

  /** Onayla ve kaydet / Confirm and save */
  confirm: () => void;

  /** İptal et / Cancel */
  cancel: () => void;

  /** Edit değerini güncelle / Update edit value */
  setEditValue: (value: string) => void;

  /** Disabled mi / Is disabled */
  isDisabled: boolean;

  /** ReadOnly mi / Is readOnly */
  isReadOnly: boolean;

  /** Activation mode */
  activationMode: InPlaceEditorActivation;

  /** Blur'da kaydet mi / Submit on blur */
  submitOnBlur: boolean;

  /** Edit'te seç mi / Select on edit */
  selectOnEdit: boolean;
}

/**
 * In-place editor hook'u — core machine'i React'a bağlar.
 * In-place editor hook — connects core machine to React.
 *
 * @example
 * ```tsx
 * const { state, value, editValue, startEdit, confirm, cancel, setEditValue } =
 *   useInPlaceEditor({ defaultValue: 'Merhaba' });
 * ```
 */
export function useInPlaceEditor(props: UseInPlaceEditorProps = {}): UseInPlaceEditorReturn {
  const {
    value: controlledValue,
    onValueChange,
    onConfirm,
    onCancel,
    activationMode = 'click',
    submitOnBlur = true,
    selectOnEdit = true,
    ...machineProps
  } = props;

  // Force re-render pattern
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  // Machine ref — tek sefer oluştur
  const machineRef = useRef<ReturnType<typeof createInPlaceEditor> | null>(null);
  if (machineRef.current === null) {
    machineRef.current = createInPlaceEditor(machineProps);
  }
  const machine = machineRef.current;

  // Prop sync
  const prevDisabledRef = useRef(machineProps.disabled);
  if (prevDisabledRef.current !== machineProps.disabled) {
    prevDisabledRef.current = machineProps.disabled;
    machine.send({ type: 'SET_DISABLED', disabled: machineProps.disabled ?? false });
  }

  const prevReadOnlyRef = useRef(machineProps.readOnly);
  if (prevReadOnlyRef.current !== machineProps.readOnly) {
    prevReadOnlyRef.current = machineProps.readOnly;
    machine.send({ type: 'SET_READ_ONLY', readOnly: machineProps.readOnly ?? false });
  }

  // Controlled value sync
  const prevControlledRef = useRef(controlledValue);
  if (prevControlledRef.current !== controlledValue && controlledValue !== undefined) {
    prevControlledRef.current = controlledValue;
    machine.send({ type: 'SET_VALUE', value: controlledValue });
  }

  const ctx = machine.getContext();

  const startEdit = useCallback(() => {
    machine.send({ type: 'EDIT' });
    forceRender();
  }, [machine]);

  const confirm = useCallback(() => {
    const editVal = machine.getContext().editValue;
    machine.send({ type: 'CONFIRM' });
    forceRender();
    onConfirm?.(editVal);
    onValueChange?.(editVal);
  }, [machine, onConfirm, onValueChange]);

  const cancel = useCallback(() => {
    machine.send({ type: 'CANCEL' });
    forceRender();
    onCancel?.();
  }, [machine, onCancel]);

  const setEditValue = useCallback((val: string) => {
    machine.send({ type: 'SET_EDIT_VALUE', value: val });
    forceRender();
  }, [machine]);

  return {
    state: ctx.state,
    value: ctx.value,
    editValue: ctx.editValue,
    startEdit,
    confirm,
    cancel,
    setEditValue,
    isDisabled: ctx.disabled,
    isReadOnly: ctx.readOnly,
    activationMode,
    submitOnBlur,
    selectOnEdit,
  };
}
