/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useNumberInput — React hook for number input state machine.
 * useNumberInput — NumberInput state machine React hook'u.
 *
 * Core state machine'i React state ile senkronize eder.
 * Increment/decrement, spin (basılı tutma), keyboard desteği.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef, useEffect } from 'react';
import { createNumberInput } from '@relteco/relui-core';
import type {
  NumberInputProps as CoreNumberInputProps,
  NumberInputEvent,
  NumberInputDOMProps,
  NumberInputRootDOMProps,
  NumberInputStepperDOMProps,
} from '@relteco/relui-core';

/** Spin tekrarlama gecikmeleri / Spin repeat delays */
const SPIN_INITIAL_DELAY = 400;
const SPIN_REPEAT_INTERVAL = 80;

/**
 * useNumberInput hook props — core props + React-specific props.
 */
export interface UseNumberInputProps extends CoreNumberInputProps {
  /** Değer değişim callback'i / Value change callback */
  onValueChange?: (value: number | null) => void;

  /** Focus handler */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /** Blur handler */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * useNumberInput hook dönüş tipi.
 */
export interface UseNumberInputReturn {
  /** Root element props */
  rootProps: NumberInputRootDOMProps & {
    onPointerEnter: () => void;
    onPointerLeave: () => void;
  };

  /** Input element props */
  inputProps: NumberInputDOMProps & {
    value: string;
    onFocus: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  };

  /** Artır butonu props / Increment button props */
  incrementProps: NumberInputStepperDOMProps & {
    onPointerDown: (event: React.PointerEvent) => void;
    onPointerUp: () => void;
    onPointerLeave: () => void;
  };

  /** Azalt butonu props / Decrement button props */
  decrementProps: NumberInputStepperDOMProps & {
    onPointerDown: (event: React.PointerEvent) => void;
    onPointerUp: () => void;
    onPointerLeave: () => void;
  };

  /** Pasif mi / Is disabled */
  isDisabled: boolean;

  /** Salt okunur mu / Is read-only */
  isReadOnly: boolean;

  /** Geçersiz mi / Is invalid */
  isInvalid: boolean;

  /** Focused mu / Is focused */
  isFocused: boolean;

  /** Mevcut değer / Current value */
  value: number | null;

  /** Formatlanmış değer / Formatted value */
  formattedValue: string;
}

/**
 * NumberInput state machine React hook'u.
 *
 * @example
 * ```tsx
 * const { rootProps, inputProps, incrementProps, decrementProps } = useNumberInput({
 *   min: 0,
 *   max: 100,
 *   step: 5,
 *   onValueChange: (val) => console.log(val),
 * });
 * ```
 */
export function useNumberInput(props: UseNumberInputProps = {}): UseNumberInputReturn {
  const { onValueChange, onFocus, onBlur, ...coreProps } = props;

  // Machine ref — stable across renders
  const machineRef = useRef<ReturnType<typeof createNumberInput> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createNumberInput(coreProps);
  }
  const machine = machineRef.current;

  // Re-render counter
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  // Callback refs (stale closure prevention)
  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;

  // Spin timer refs
  const spinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spinIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Prop sync — render sırasında, effect değil
  const prevDisabledRef = useRef(coreProps.disabled);
  const prevReadOnlyRef = useRef(coreProps.readOnly);
  const prevInvalidRef = useRef(coreProps.invalid);
  const prevValueRef = useRef(coreProps.value);

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
  if (coreProps.value !== prevValueRef.current) {
    machine.send({ type: 'SET_VALUE', value: coreProps.value ?? null });
    prevValueRef.current = coreProps.value;
  }

  const send = useCallback(
    (event: NumberInputEvent) => {
      const prevCtx = machine.getContext();
      const nextCtx = machine.send(event);
      if (nextCtx !== prevCtx) {
        forceRender();

        // Value değiştiyse callback çağır
        if (nextCtx.value !== prevCtx.value) {
          onValueChangeRef.current?.(nextCtx.value);
        }
      }
    },
    [machine, forceRender],
  );

  // ── Spin cleanup ──
  const clearSpin = useCallback(() => {
    if (spinTimerRef.current) {
      clearTimeout(spinTimerRef.current);
      spinTimerRef.current = null;
    }
    if (spinIntervalRef.current) {
      clearInterval(spinIntervalRef.current);
      spinIntervalRef.current = null;
    }
    send({ type: 'SPIN_STOP' });
  }, [send]);

  // Component unmount'ta spin temizle
  useEffect(() => {
    return () => {
      if (spinTimerRef.current) clearTimeout(spinTimerRef.current);
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
    };
  }, []);

  // ── Event handlers ──

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
      send({ type: 'SET_VALUE_FROM_STRING', value: event.target.value });
    },
    [send],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        const step = event.shiftKey ? 10 : 1;
        for (let i = 0; i < step; i++) {
          send({ type: 'INCREMENT' });
        }
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        const step = event.shiftKey ? 10 : 1;
        for (let i = 0; i < step; i++) {
          send({ type: 'DECREMENT' });
        }
      } else if (event.key === 'Home' && machine.getContext().min !== -Infinity) {
        event.preventDefault();
        send({ type: 'SET_VALUE', value: machine.getContext().min });
      } else if (event.key === 'End' && machine.getContext().max !== Infinity) {
        event.preventDefault();
        send({ type: 'SET_VALUE', value: machine.getContext().max });
      }
    },
    [send, machine],
  );

  // ── Spin handlers (basılı tutma) ──

  const startSpin = useCallback(
    (direction: 'increment' | 'decrement') => {
      send({ type: 'SPIN_START', direction });

      // İlk gecikme
      spinTimerRef.current = setTimeout(() => {
        // Tekrarlayan interval
        spinIntervalRef.current = setInterval(() => {
          send({ type: direction === 'increment' ? 'INCREMENT' : 'DECREMENT' });
        }, SPIN_REPEAT_INTERVAL);
      }, SPIN_INITIAL_DELAY);
    },
    [send],
  );

  const handleIncrementPointerDown = useCallback(
    (event: React.PointerEvent) => {
      event.preventDefault();
      send({ type: 'INCREMENT' });
      startSpin('increment');
    },
    [send, startSpin],
  );

  const handleDecrementPointerDown = useCallback(
    (event: React.PointerEvent) => {
      event.preventDefault();
      send({ type: 'DECREMENT' });
      startSpin('decrement');
    },
    [send, startSpin],
  );

  // ── Props üretimi ──

  const domRootProps = machine.getRootProps();
  const domInputProps = machine.getInputProps();
  const domIncrementProps = machine.getIncrementProps();
  const domDecrementProps = machine.getDecrementProps();
  const ctx = machine.getContext();

  return {
    rootProps: {
      ...domRootProps,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
    },

    inputProps: {
      ...domInputProps,
      value: machine.getFormattedValue(),
      onFocus: handleFocus,
      onBlur: handleBlur,
      onChange: handleChange,
      onKeyDown: handleKeyDown,
    },

    incrementProps: {
      ...domIncrementProps,
      onPointerDown: handleIncrementPointerDown,
      onPointerUp: clearSpin,
      onPointerLeave: clearSpin,
    },

    decrementProps: {
      ...domDecrementProps,
      onPointerDown: handleDecrementPointerDown,
      onPointerUp: clearSpin,
      onPointerLeave: clearSpin,
    },

    isDisabled: ctx.disabled,
    isReadOnly: ctx.readOnly,
    isInvalid: ctx.invalid,
    isFocused: ctx.interactionState === 'focused',
    value: ctx.value,
    formattedValue: machine.getFormattedValue(),
  };
}
