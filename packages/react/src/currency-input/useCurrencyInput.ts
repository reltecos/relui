/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useCurrencyInput — React hook for currency input state machine.
 * useCurrencyInput — Para birimi input state machine React hook'u.
 *
 * Core state machine'i React state ile senkronize eder.
 * Focus'ta ham değer, blur'da formatlı değer gösterir.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef, useState } from 'react';
import { createCurrencyInput } from '@relteco/relui-core';
import type {
  CurrencyInputProps as CoreCurrencyInputProps,
  CurrencyInputDOMProps,
  CurrencyInputEvent,
  CurrencyLocaleInfo,
} from '@relteco/relui-core';

/**
 * useCurrencyInput hook props — core props + React-specific props.
 */
export interface UseCurrencyInputProps extends CoreCurrencyInputProps {
  /** Değer değişim callback'i / Value change callback */
  onValueChange?: (value: number | null) => void;

  /** Focus handler */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /** Blur handler */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * useCurrencyInput hook dönüş tipi.
 */
export interface UseCurrencyInputReturn {
  /** Input DOM attribute'ları ve event handler'lar */
  inputProps: CurrencyInputDOMProps & {
    value: string;
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

  /** Formatlı değer (blur durumu) / Formatted value (blur state) */
  formattedValue: string;

  /** Ham sayısal değer / Raw numeric value */
  rawValue: number | null;

  /** Locale bilgisi / Locale info */
  localeInfo: CurrencyLocaleInfo;
}

/**
 * Currency input hook'u — core state machine + format/parse + React state.
 * Currency input hook — core state machine + format/parse + React state.
 *
 * @example
 * ```tsx
 * const { inputProps, formattedValue } = useCurrencyInput({
 *   value: price,
 *   onValueChange: setPrice,
 *   locale: 'tr-TR',
 *   currency: 'TRY',
 * });
 *
 * return <input {...inputProps} />;
 * ```
 */
export function useCurrencyInput(props: UseCurrencyInputProps = {}): UseCurrencyInputReturn {
  const { onValueChange, onFocus, onBlur, ...coreProps } = props;

  // Machine ref — stable across renders
  const machineRef = useRef<ReturnType<typeof createCurrencyInput> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createCurrencyInput(coreProps);
  }
  const machine = machineRef.current;

  // Re-render counter
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  // Display value state — focus'ta ham, blur'da formatlı
  const [displayValue, setDisplayValue] = useState(() => machine.getFormattedValue());
  const [isFocusedLocal, setIsFocusedLocal] = useState(false);

  // Prop sync — render sırasında
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
  // Controlled value sync
  if (coreProps.value !== undefined && coreProps.value !== prevValueRef.current) {
    machine.send({ type: 'SET_VALUE', value: coreProps.value });
    prevValueRef.current = coreProps.value;
    // Display'i de güncelle (focus'ta değilse formatlı, focus'taysa ham)
    if (!isFocusedLocal) {
      setDisplayValue(machine.getFormattedValue());
    } else {
      setDisplayValue(machine.getRawDisplayValue());
    }
  }

  const send = useCallback(
    (event: CurrencyInputEvent) => {
      const prevCtx = machine.getContext();
      const nextCtx = machine.send(event);
      if (nextCtx !== prevCtx) {
        forceRender();
      }
      return nextCtx;
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
      setIsFocusedLocal(true);
      // Focus'ta ham değer göster (binlik ayracısız)
      setDisplayValue(machine.getRawDisplayValue());
      // Input'un tüm metnini seç
      event.target.select();
      onFocus?.(event);
    },
    [send, machine, onFocus],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      // Önce input'taki metni parse et ve machine'e gönder
      const inputValue = event.target.value;
      const prevCtx = machine.getContext();
      machine.send({ type: 'SET_VALUE_FROM_STRING', value: inputValue });
      const afterParse = machine.getContext();

      // Değer değiştiyse callback
      if (afterParse.value !== prevCtx.value) {
        onValueChange?.(afterParse.value);
      }

      send({ type: 'BLUR' });
      setIsFocusedLocal(false);
      // Blur'da formatlı değer göster
      setDisplayValue(machine.getFormattedValue());
      onBlur?.(event);
    },
    [send, machine, onValueChange, onBlur],
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      setDisplayValue(inputValue);
    },
    [],
  );

  const domProps = machine.getInputProps();
  const ctx = machine.getContext();

  return {
    inputProps: {
      ...domProps,
      value: displayValue,
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
    formattedValue: machine.getFormattedValue(),
    rawValue: ctx.value,
    localeInfo: machine.getLocaleInfo(),
  };
}
