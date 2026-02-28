/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useCheckbox — React hook for checkbox state machine.
 * useCheckbox — Checkbox state machine React hook'u.
 *
 * Core state machine'i React state ile senkronize eder.
 * Toggle, indeterminate ve controlled/uncontrolled mode desteği.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef } from 'react';
import { createCheckbox } from '@relteco/relui-core';
import type {
  CheckboxProps as CoreCheckboxProps,
  CheckboxDOMProps,
  CheckboxEvent,
  CheckboxCheckedState,
} from '@relteco/relui-core';

/**
 * useCheckbox hook props — core props + React-specific props.
 */
export interface UseCheckboxProps extends CoreCheckboxProps {
  /**
   * Checked değiştiğinde çağrılır / Called when checked changes.
   *
   * Controlled mode'da kullanılır.
   */
  onCheckedChange?: (checked: CheckboxCheckedState) => void;
}

/**
 * useCheckbox hook dönüş tipi.
 */
export interface UseCheckboxReturn {
  /** Visual checkbox (control) DOM attribute'ları ve event handler'lar */
  controlProps: CheckboxDOMProps & {
    onPointerEnter: () => void;
    onPointerLeave: () => void;
    onPointerDown: () => void;
    onPointerUp: () => void;
    onFocus: () => void;
    onBlur: () => void;
    onClick: () => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
  };

  /** İşaretlenme durumu / Checked state */
  checked: CheckboxCheckedState;

  /** Pasif mi / Is disabled */
  isDisabled: boolean;

  /** Salt okunur mu / Is read-only */
  isReadOnly: boolean;

  /** Geçersiz mi / Is invalid */
  isInvalid: boolean;
}

/**
 * Checkbox state machine React hook'u.
 *
 * @example
 * ```tsx
 * const { controlProps, checked } = useCheckbox({
 *   checked: isAccepted,
 *   onCheckedChange: setAccepted,
 * });
 *
 * return (
 *   <div {...controlProps}>
 *     {checked && <CheckIcon />}
 *   </div>
 * );
 * ```
 */
export function useCheckbox(props: UseCheckboxProps = {}): UseCheckboxReturn {
  const { onCheckedChange, ...coreProps } = props;

  // Machine ref — stable across renders
  const machineRef = useRef<ReturnType<typeof createCheckbox> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createCheckbox(coreProps);
  }
  const machine = machineRef.current;

  // Re-render counter
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  // Prop sync — render sırasında, effect değil
  const prevCheckedRef = useRef(coreProps.checked);
  const prevDisabledRef = useRef(coreProps.disabled);
  const prevInvalidRef = useRef(coreProps.invalid);

  if (coreProps.checked !== prevCheckedRef.current) {
    machine.send({ type: 'SET_CHECKED', value: coreProps.checked ?? false });
    prevCheckedRef.current = coreProps.checked;
  }
  if (coreProps.disabled !== prevDisabledRef.current) {
    machine.send({ type: 'SET_DISABLED', value: coreProps.disabled ?? false });
    prevDisabledRef.current = coreProps.disabled;
  }
  if (coreProps.invalid !== prevInvalidRef.current) {
    machine.send({ type: 'SET_INVALID', value: coreProps.invalid ?? false });
    prevInvalidRef.current = coreProps.invalid;
  }

  const send = useCallback(
    (event: CheckboxEvent) => {
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

  const handlePointerDown = useCallback(() => {
    send({ type: 'POINTER_DOWN' });
  }, [send]);

  const handlePointerUp = useCallback(() => {
    send({ type: 'POINTER_UP' });
  }, [send]);

  const handleFocus = useCallback(() => {
    send({ type: 'FOCUS' });
  }, [send]);

  const handleBlur = useCallback(() => {
    send({ type: 'BLUR' });
  }, [send]);

  const handleToggle = useCallback(() => {
    if (machine.isInteractionBlocked() || machine.getContext().readOnly) {
      return;
    }

    // Controlled mode — sadece callback çağır
    if (onCheckedChange) {
      const current = machine.getContext().checked;
      const next = current === 'indeterminate' ? true : !current;
      onCheckedChange(next);
      return;
    }

    // Uncontrolled mode — machine'de toggle
    send({ type: 'TOGGLE' });
  }, [machine, send, onCheckedChange]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === ' ') {
        event.preventDefault();
        handleToggle();
      }
    },
    [handleToggle],
  );

  const domProps = machine.getCheckboxProps();
  const ctx = machine.getContext();

  return {
    controlProps: {
      ...domProps,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onClick: handleToggle,
      onKeyDown: handleKeyDown,
    },
    checked: ctx.checked,
    isDisabled: ctx.disabled,
    isReadOnly: ctx.readOnly,
    isInvalid: ctx.invalid,
  };
}
