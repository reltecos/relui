/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useInput — React hook for input state machine.
 * useInput — Input state machine React hook'u.
 *
 * Core state machine'i React state ile senkronize eder.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef } from 'react';
import { createInput } from '@relteco/relui-core';
import type {
  InputProps as CoreInputProps,
  InputDOMProps,
  InputEvent,
} from '@relteco/relui-core';

/**
 * useInput hook props — core props + React-specific props.
 */
export interface UseInputProps extends CoreInputProps {
  /** Focus handler */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /** Blur handler */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /** Change handler */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * useInput hook dönüş tipi.
 */
export interface UseInputReturn {
  /** DOM attribute'ları ve event handler'lar */
  inputProps: InputDOMProps & {
    onPointerEnter: () => void;
    onPointerLeave: () => void;
    onFocus: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
 * Input state machine React hook'u.
 *
 * @example
 * ```tsx
 * const { inputProps, isInvalid } = useInput({
 *   disabled: false,
 *   invalid: nameError,
 *   onChange: (e) => setName(e.target.value),
 * });
 *
 * return <input {...inputProps} placeholder="Ad" />;
 * ```
 */
export function useInput(props: UseInputProps = {}): UseInputReturn {
  const { onFocus, onBlur, onChange, ...coreProps } = props;

  // Machine ref — stable across renders
  const machineRef = useRef<ReturnType<typeof createInput> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createInput(coreProps);
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
    (event: InputEvent) => {
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
    (event: React.FocusEvent<HTMLInputElement>) => {
      send({ type: 'FOCUS' });
      onFocus?.(event);
    },
    [send, onFocus],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      send({ type: 'BLUR' });
      onBlur?.(event);
    },
    [send, onBlur],
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
    },
    [onChange],
  );

  const domProps = machine.getInputProps();
  const ctx = machine.getContext();

  return {
    inputProps: {
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
