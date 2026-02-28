/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useButton — React hook for button state machine.
 * useButton — Button state machine React hook'u.
 *
 * Core state machine'i React state ile senkronize eder.
 * Her state değişikliğinde re-render tetiklenir, böylece
 * `data-state` attribute'u her zaman doğru kalır.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef } from 'react';
import {
  createButton,
  shouldTriggerClick,
  shouldTriggerClickOnKeyUp,
} from '@relteco/relui-core';
import type {
  ButtonProps as CoreButtonProps,
  ButtonDOMProps,
  ButtonEvent,
} from '@relteco/relui-core';

/**
 * useButton hook props — core props + React-specific props.
 */
export interface UseButtonProps extends CoreButtonProps {
  /** Click handler / Tıklama handler'ı */
  onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void;
}

/**
 * useButton hook dönüş tipi.
 * useButton hook return type.
 */
export interface UseButtonReturn {
  /** DOM attribute'ları ve event handler'lar / DOM attributes and event handlers */
  buttonProps: ButtonDOMProps & {
    onPointerEnter: () => void;
    onPointerLeave: () => void;
    onPointerDown: () => void;
    onPointerUp: () => void;
    onFocus: () => void;
    onBlur: () => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
    onKeyUp: (event: React.KeyboardEvent) => void;
    onClick: (event: React.MouseEvent) => void;
  };

  /** Pasif mi / Is disabled */
  isDisabled: boolean;

  /** Yükleniyor mu / Is loading */
  isLoading: boolean;
}

/**
 * Button state machine React hook'u.
 * React hook for button state machine.
 *
 * Core machine'i React state ile wrap eder. Her state değişiminde
 * React re-render tetiklenir — `data-state` her zaman güncel kalır.
 *
 * @example
 * ```tsx
 * const { buttonProps, isDisabled } = useButton({
 *   disabled: false,
 *   onClick: () => alert('Clicked!'),
 * });
 *
 * return <button {...buttonProps}>Click me</button>;
 * ```
 */
export function useButton(props: UseButtonProps = {}): UseButtonReturn {
  const { onClick, ...coreProps } = props;

  // Machine ref — stable across renders, machine has mutable internal state
  const machineRef = useRef<ReturnType<typeof createButton> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createButton(coreProps);
  }
  const machine = machineRef.current;

  // Re-render counter — her state değişiminde artırılır
  // Increment counter — triggers re-render on every state change
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  // Disabled/loading prop senkronizasyonu — render sırasında, effect değil
  // Sync disabled/loading props — during render, not in effect
  const prevDisabledRef = useRef(coreProps.disabled);
  const prevLoadingRef = useRef(coreProps.loading);

  if (coreProps.disabled !== prevDisabledRef.current) {
    machine.send({ type: 'SET_DISABLED', value: coreProps.disabled ?? false });
    prevDisabledRef.current = coreProps.disabled;
  }
  if (coreProps.loading !== prevLoadingRef.current) {
    machine.send({ type: 'SET_LOADING', value: coreProps.loading ?? false });
    prevLoadingRef.current = coreProps.loading;
  }

  const isBlocked = coreProps.disabled || coreProps.loading;

  /**
   * Event gönder — context değiştiyse re-render tetikle.
   * Send event — trigger re-render if context changed.
   *
   * Machine referans eşitliği garantisi sayesinde context değişmediyse
   * (ör. idle'da POINTER_LEAVE) gereksiz re-render olmaz.
   */
  const send = useCallback(
    (event: ButtonEvent) => {
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

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (isBlocked) return;

      send({ type: 'KEY_DOWN', key: event.key });

      // Non-native button: Enter'da click tetikle
      if (shouldTriggerClick(event.key, coreProps.elementType)) {
        event.preventDefault();
        onClick?.(event);
      }

      // Space'de scroll engelle (non-native button)
      if (event.key === ' ' && coreProps.elementType !== 'button') {
        event.preventDefault();
      }
    },
    [send, isBlocked, onClick, coreProps.elementType],
  );

  const handleKeyUp = useCallback(
    (event: React.KeyboardEvent) => {
      if (isBlocked) return;

      send({ type: 'KEY_UP', key: event.key });

      // Non-native button: Space key-up'ta click tetikle
      if (shouldTriggerClickOnKeyUp(event.key, coreProps.elementType)) {
        event.preventDefault();
        onClick?.(event);
      }
    },
    [send, isBlocked, onClick, coreProps.elementType],
  );

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      if (isBlocked) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    },
    [isBlocked, onClick],
  );

  const domProps = machine.getButtonProps();

  return {
    buttonProps: {
      ...domProps,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
      onClick: handleClick,
    },
    isDisabled: coreProps.disabled ?? false,
    isLoading: coreProps.loading ?? false,
  };
}
