/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useTextarea — React hook for textarea state machine.
 * useTextarea — Textarea state machine React hook'u.
 *
 * Core state machine'i React state ile senkronize eder.
 * autoResize desteği dahil.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef } from 'react';
import { createTextarea } from '@relteco/relui-core';
import type {
  TextareaProps as CoreTextareaProps,
  TextareaDOMProps,
  TextareaEvent,
} from '@relteco/relui-core';

/**
 * useTextarea hook props — core props + React-specific props.
 */
export interface UseTextareaProps extends CoreTextareaProps {
  /** Focus handler */
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;

  /** Blur handler */
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;

  /** Change handler */
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

/**
 * useTextarea hook dönüş tipi.
 */
export interface UseTextareaReturn {
  /** DOM attribute'ları ve event handler'lar */
  textareaProps: TextareaDOMProps & {
    onPointerEnter: () => void;
    onPointerLeave: () => void;
    onFocus: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
    onBlur: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  };

  /** Pasif mi / Is disabled */
  isDisabled: boolean;

  /** Salt okunur mu / Is read-only */
  isReadOnly: boolean;

  /** Geçersiz mi / Is invalid */
  isInvalid: boolean;

  /** Focused mu / Is focused */
  isFocused: boolean;
}

/**
 * Textarea state machine React hook'u.
 *
 * @example
 * ```tsx
 * const { textareaProps, isInvalid } = useTextarea({
 *   disabled: false,
 *   invalid: descError,
 *   onChange: (e) => setDesc(e.target.value),
 * });
 *
 * return <textarea {...textareaProps} placeholder="Açıklama" />;
 * ```
 */
export function useTextarea(props: UseTextareaProps = {}): UseTextareaReturn {
  const { onFocus, onBlur, onChange, ...coreProps } = props;

  // Machine ref — stable across renders
  const machineRef = useRef<ReturnType<typeof createTextarea> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createTextarea(coreProps);
  }
  const machine = machineRef.current;

  // Re-render counter
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  // Prop sync — render sırasında, effect değil
  const prevDisabledRef = useRef(coreProps.disabled);
  const prevReadOnlyRef = useRef(coreProps.readOnly);
  const prevInvalidRef = useRef(coreProps.invalid);

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

  const send = useCallback(
    (event: TextareaEvent) => {
      const prevCtx = machine.getContext();
      const nextCtx = machine.send(event);
      if (nextCtx !== prevCtx) {
        forceRender();
      }
    },
    [machine, forceRender],
  );

  const handlePointerEnter = useCallback(() => {
    send({ type: 'POINTER_ENTER' });
  }, [send]);

  const handlePointerLeave = useCallback(() => {
    send({ type: 'POINTER_LEAVE' });
  }, [send]);

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLTextAreaElement>) => {
      send({ type: 'FOCUS' });
      onFocus?.(event);
    },
    [send, onFocus],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLTextAreaElement>) => {
      send({ type: 'BLUR' });
      onBlur?.(event);
    },
    [send, onBlur],
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(event);
    },
    [onChange],
  );

  const domProps = machine.getTextareaProps();
  const ctx = machine.getContext();

  return {
    textareaProps: {
      ...domProps,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onChange: handleChange,
    },
    isDisabled: ctx.disabled,
    isReadOnly: ctx.readOnly,
    isInvalid: ctx.invalid,
    isFocused: ctx.interactionState === 'focused',
  };
}
