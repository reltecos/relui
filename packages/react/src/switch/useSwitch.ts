/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useSwitch — React hook for switch state machine.
 * useSwitch — Switch state machine React hook'u.
 *
 * Core state machine'i React state ile senkronize eder.
 * Toggle semantiği — Checkbox ile aynı pattern.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef } from 'react';
import { createSwitch } from '@relteco/relui-core';
import type {
  SwitchProps as CoreSwitchProps,
  SwitchDOMProps,
  SwitchEvent,
} from '@relteco/relui-core';

/**
 * useSwitch hook props — core props + React-specific props.
 */
export interface UseSwitchProps extends CoreSwitchProps {
  /**
   * Checked değiştiğinde çağrılır / Called when checked changes.
   *
   * Controlled mode'da kullanılır.
   */
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * useSwitch hook dönüş tipi.
 */
export interface UseSwitchReturn {
  /** Visual switch (track) DOM attribute'ları ve event handler'lar */
  trackProps: SwitchDOMProps & {
    onPointerEnter: () => void;
    onPointerLeave: () => void;
    onPointerDown: () => void;
    onPointerUp: () => void;
    onFocus: () => void;
    onBlur: () => void;
    onClick: () => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
  };

  /** Açık mı / Is checked */
  checked: boolean;

  /** Pasif mi / Is disabled */
  isDisabled: boolean;

  /** Salt okunur mu / Is read-only */
  isReadOnly: boolean;

  /** Geçersiz mi / Is invalid */
  isInvalid: boolean;
}

/**
 * Switch state machine React hook'u.
 *
 * @example
 * ```tsx
 * const { trackProps, checked } = useSwitch({
 *   checked: isDark,
 *   onCheckedChange: setIsDark,
 * });
 *
 * return (
 *   <div {...trackProps}>
 *     <span className={knobStyle} />
 *   </div>
 * );
 * ```
 */
export function useSwitch(props: UseSwitchProps = {}): UseSwitchReturn {
  const { onCheckedChange, ...coreProps } = props;

  // Machine ref — stable across renders
  const machineRef = useRef<ReturnType<typeof createSwitch> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createSwitch(coreProps);
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
    (event: SwitchEvent) => {
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
      onCheckedChange(!current);
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

  const domProps = machine.getSwitchProps();
  const ctx = machine.getContext();

  return {
    trackProps: {
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
