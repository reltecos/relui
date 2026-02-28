/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useMaskedInput — React hook for masked input state machine.
 * useMaskedInput — Maskeli input state machine React hook'u.
 *
 * Core state machine'i React state ile senkronize eder.
 * Mask pattern'a göre formatlama ve cursor yönetimi sağlar.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef } from 'react';
import {
  createMaskedInput,
  getNextEditableIndex,
} from '@relteco/relui-core';
import type {
  MaskedInputProps as CoreMaskedInputProps,
  MaskedInputDOMProps,
  MaskedInputEvent,
} from '@relteco/relui-core';

/**
 * useMaskedInput hook props — core props + React-specific props.
 */
export interface UseMaskedInputProps extends CoreMaskedInputProps {
  /** Ham değer değişim callback'i / Raw value change callback */
  onValueChange?: (rawValue: string) => void;

  /** Focus handler */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /** Blur handler */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /** Change handler (formatlı değer ile) / Change handler (with formatted value) */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * useMaskedInput hook dönüş tipi.
 */
export interface UseMaskedInputReturn {
  /** Input DOM attribute'ları ve event handler'lar */
  inputProps: MaskedInputDOMProps & {
    value: string;
    onPointerEnter: () => void;
    onPointerLeave: () => void;
    onFocus: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  };

  /** Pasif mi / Is disabled */
  isDisabled: boolean;

  /** Salt okunur mu / Is read-only */
  isReadOnly: boolean;

  /** Geçersiz mi / Is invalid */
  isInvalid: boolean;

  /** Focused mu / Is focused */
  isFocused: boolean;

  /** Formatlı değer / Formatted value */
  formattedValue: string;

  /** Ham değer (mask karakterleri olmadan) / Raw value (without mask characters) */
  rawValue: string;

  /** Mask tam dolu mu / Is mask complete */
  isComplete: boolean;

  /** Mask placeholder (tüm slotlar maskChar ile) / Mask placeholder */
  placeholder: string;
}

/**
 * Masked input hook'u — core state machine + cursor yönetimi + React state.
 *
 * @example
 * ```tsx
 * const { inputProps, rawValue, isComplete } = useMaskedInput({
 *   mask: '(###) ### ## ##',
 *   onValueChange: (raw) => console.log(raw),
 * });
 *
 * return <input {...inputProps} />;
 * ```
 */
export function useMaskedInput(props: UseMaskedInputProps): UseMaskedInputReturn {
  const { onValueChange, onFocus, onBlur, onChange, ...coreProps } = props;

  // Machine ref — stable across renders
  const machineRef = useRef<ReturnType<typeof createMaskedInput> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createMaskedInput(coreProps);
  }
  const machine = machineRef.current;

  // Re-render counter
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

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
    machine.send({ type: 'SET_RAW_VALUE', value: coreProps.value });
    prevValueRef.current = coreProps.value;
    forceRender();
  }

  const send = useCallback(
    (event: MaskedInputEvent) => {
      const prevCtx = machine.getContext();
      const nextCtx = machine.send(event);
      if (nextCtx !== prevCtx) {
        forceRender();
      }
      return nextCtx;
    },
    [machine],
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

      // Focus olunca cursor'u ilk boş editable pozisyona getir
      const ctx = machine.getContext();
      const rawLen = ctx.rawValue.length;
      let targetPos = 0;
      let editCount = 0;

      for (let i = 0; i < ctx.maskSlots.length; i++) {
        const slot = ctx.maskSlots[i];
        if (slot && slot.type === 'editable') {
          editCount++;
          if (editCount > rawLen) {
            targetPos = i;
            break;
          }
          targetPos = i + 1;
        }
      }

      requestAnimationFrame(() => {
        event.target.setSelectionRange(targetPos, targetPos);
      });

      onFocus?.(event);
    },
    [send, machine, onFocus],
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
      const input = event.target;
      const inputValue = input.value;
      const cursorPos = input.selectionStart ?? 0;

      const ctx = machine.getContext();
      const prevRaw = ctx.rawValue;

      // Eğer kullanıcı mask formatına uymayan şey yazdıysa
      // (ör. static karakter pozisyonuna yazdı), direkt değeri dene
      const prevFormatted = machine.getFormattedValue();

      if (inputValue.length > prevFormatted.length) {
        // Karakter eklendi — eklenen karakteri bul
        const diff = inputValue.length - prevFormatted.length;
        const insertPos = cursorPos - diff;
        const inserted = inputValue.slice(insertPos, cursorPos);

        // Eklenen karakterlerden sadece geçerli olanları al ve raw'a ekle
        let newRawFromInsert = '';
        let rawInsertIdx = 0;

        // insertPos'a kadar olan raw karakter sayısını bul
        for (let i = 0; i < insertPos && i < ctx.maskSlots.length; i++) {
          const slot = ctx.maskSlots[i];
          if (slot && slot.type === 'editable') {
            rawInsertIdx++;
          }
        }

        // Eklenen karakterleri filtrele
        let slotIdx = 0;
        let editIdx = 0;
        for (let i = 0; i < ctx.maskSlots.length; i++) {
          const s = ctx.maskSlots[i];
          if (s && s.type === 'editable') {
            if (editIdx === rawInsertIdx) {
              slotIdx = i;
              break;
            }
            editIdx++;
          }
        }

        for (const ch of inserted) {
          while (slotIdx < ctx.maskSlots.length) {
            const s = ctx.maskSlots[slotIdx];
            if (!s || s.type !== 'static') break;
            slotIdx++;
          }
          if (slotIdx < ctx.maskSlots.length) {
            const slot = ctx.maskSlots[slotIdx];
            if (slot && slot.accept && slot.accept.test(ch)) {
              newRawFromInsert += ch;
              slotIdx++;
            }
          }
        }

        const finalRaw = prevRaw.slice(0, rawInsertIdx) + newRawFromInsert + prevRaw.slice(rawInsertIdx);
        send({ type: 'SET_RAW_VALUE', value: finalRaw });

        const afterCtx = machine.getContext();
        if (afterCtx.rawValue !== prevRaw) {
          onValueChange?.(afterCtx.rawValue);
        }

        // Cursor pozisyonunu ayarla
        const formatted = machine.getFormattedValue();
        const newRawInsertEnd = rawInsertIdx + newRawFromInsert.length;
        let newCursorPos = 0;
        let editCounter = 0;
        for (let i = 0; i < formatted.length; i++) {
          if (ctx.maskSlots[i]?.type === 'editable') {
            editCounter++;
            if (editCounter === newRawInsertEnd) {
              newCursorPos = i + 1;
              break;
            }
          }
        }
        // Static karakter atla
        if (newCursorPos < ctx.maskSlots.length) {
          newCursorPos = getNextEditableIndex(newCursorPos, ctx.maskSlots, 'forward');
        }

        requestAnimationFrame(() => {
          input.setSelectionRange(newCursorPos, newCursorPos);
        });
      } else if (inputValue.length < prevFormatted.length) {
        // Karakter silindi
        send({ type: 'SET_INPUT_VALUE', value: inputValue });

        const afterCtx = machine.getContext();
        if (afterCtx.rawValue !== prevRaw) {
          onValueChange?.(afterCtx.rawValue);
        }

        // Cursor'u doğru pozisyona getir
        let targetPos = cursorPos;
        if (targetPos > 0) {
          targetPos = getNextEditableIndex(
            Math.max(0, targetPos - 1),
            ctx.maskSlots,
            'backward',
          );
          const tSlot = ctx.maskSlots[targetPos];
          if (targetPos < ctx.maskSlots.length && tSlot && tSlot.type === 'editable') {
            // Silme sonrası editable pozisyonda kal
          }
        }

        requestAnimationFrame(() => {
          input.setSelectionRange(targetPos, targetPos);
        });
      } else {
        // Aynı uzunluk — karakter değiştirme
        send({ type: 'SET_INPUT_VALUE', value: inputValue });

        const afterCtx = machine.getContext();
        if (afterCtx.rawValue !== prevRaw) {
          onValueChange?.(afterCtx.rawValue);
        }
      }

      onChange?.(event);
    },
    [machine, send, onValueChange, onChange],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const ctx = machine.getContext();

      // Backspace: static karakter üzerindeyse bir önceki editable'a atla
      if (event.key === 'Backspace') {
        const input = event.currentTarget;
        const pos = input.selectionStart ?? 0;
        const selEnd = input.selectionEnd ?? 0;

        // Seçim yoksa ve cursor static karakter üzerindeyse
        if (pos === selEnd && pos > 0) {
          const prevPos = pos - 1;
          const prevSlot = ctx.maskSlots[prevPos];
          if (prevPos < ctx.maskSlots.length && prevSlot && prevSlot.type === 'static') {
            // Bir önceki editable'ı bul
            const editablePos = getNextEditableIndex(prevPos, ctx.maskSlots, 'backward');
            if (editablePos >= 0 && editablePos < ctx.maskSlots.length) {
              // Raw value'dan bu pozisyondaki karakteri sil
              let editIdx = 0;
              for (let i = 0; i < editablePos; i++) {
                const s = ctx.maskSlots[i];
                if (s && s.type === 'editable') editIdx++;
              }

              const newRaw = ctx.rawValue.slice(0, editIdx) + ctx.rawValue.slice(editIdx + 1);
              send({ type: 'SET_RAW_VALUE', value: newRaw });

              if (newRaw !== ctx.rawValue) {
                onValueChange?.(newRaw);
              }

              requestAnimationFrame(() => {
                input.setSelectionRange(editablePos, editablePos);
              });

              event.preventDefault();
            }
          }
        }
      }
    },
    [machine, send, onValueChange],
  );

  const domProps = machine.getInputProps();
  const ctx = machine.getContext();

  return {
    inputProps: {
      ...domProps,
      value: machine.getFormattedValue(),
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onChange: handleChange,
      onKeyDown: handleKeyDown,
    },
    isDisabled: ctx.disabled,
    isReadOnly: ctx.readOnly,
    isInvalid: ctx.invalid,
    isFocused: ctx.interactionState === 'focused',
    formattedValue: machine.getFormattedValue(),
    rawValue: ctx.rawValue,
    isComplete: machine.isComplete(),
    placeholder: machine.getPlaceholder(),
  };
}
