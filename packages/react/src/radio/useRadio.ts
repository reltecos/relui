/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useRadio — React hook for radio state machine.
 * useRadio — Radio state machine React hook'u.
 *
 * Core state machine'i React state ile senkronize eder.
 * RadioGroup context'inden ortak props alır.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef } from 'react';
import { createRadio } from '@relteco/relui-core';
import type {
  RadioProps as CoreRadioProps,
  RadioDOMProps,
  RadioEvent,
} from '@relteco/relui-core';
import { useRadioGroupContext } from '../radio-group/RadioGroupContext';

/**
 * useRadio hook props — core props + React-specific props.
 */
export interface UseRadioProps extends CoreRadioProps {
  /**
   * Seçildiğinde çağrılır / Called when selected.
   *
   * Controlled mode'da kullanılır.
   */
  onSelect?: (value: string) => void;
}

/**
 * useRadio hook dönüş tipi.
 */
export interface UseRadioReturn {
  /** Visual radio (control) DOM attribute'ları ve event handler'lar */
  controlProps: RadioDOMProps & {
    onPointerEnter: () => void;
    onPointerLeave: () => void;
    onPointerDown: () => void;
    onPointerUp: () => void;
    onFocus: () => void;
    onBlur: () => void;
    onClick: () => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
  };

  /** Seçili mi / Is checked */
  checked: boolean;

  /** Pasif mi / Is disabled */
  isDisabled: boolean;

  /** Salt okunur mu / Is read-only */
  isReadOnly: boolean;

  /** Geçersiz mi / Is invalid */
  isInvalid: boolean;

  /** Form name (grup veya props'tan) */
  name: string | undefined;
}

/**
 * Radio state machine React hook'u.
 *
 * RadioGroup context'inden size/color/name/value/disabled props alır.
 * Grup varsa, checked = (groupValue === radioValue) şeklinde türetilir.
 *
 * @example
 * ```tsx
 * const { controlProps, checked } = useRadio({ value: 'option1' });
 *
 * return (
 *   <div {...controlProps}>
 *     {checked && <span className={dotStyle} />}
 *   </div>
 * );
 * ```
 */
export function useRadio(props: UseRadioProps = {}): UseRadioReturn {
  const { onSelect, ...coreProps } = props;

  // RadioGroup context'i oku
  const groupCtx = useRadioGroupContext();

  // Grup varsa, props'ları merge et
  const mergedDisabled = coreProps.disabled ?? groupCtx?.disabled ?? false;
  const mergedReadOnly = coreProps.readOnly ?? groupCtx?.readOnly ?? false;
  const mergedInvalid = coreProps.invalid ?? groupCtx?.invalid ?? false;
  const mergedName = coreProps.name ?? groupCtx?.name;

  // Grup varsa checked, groupValue === radioValue'dan türetilir
  const mergedChecked = groupCtx
    ? groupCtx.value === coreProps.value
    : (coreProps.checked ?? false);

  // Machine ref — stable across renders
  const machineRef = useRef<ReturnType<typeof createRadio> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createRadio({
      ...coreProps,
      checked: mergedChecked,
      disabled: mergedDisabled,
      readOnly: mergedReadOnly,
      invalid: mergedInvalid,
    });
  }
  const machine = machineRef.current;

  // Re-render counter
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  // Prop sync — render sırasında, effect değil
  const prevCheckedRef = useRef(mergedChecked);
  const prevDisabledRef = useRef(mergedDisabled);
  const prevInvalidRef = useRef(mergedInvalid);

  if (mergedChecked !== prevCheckedRef.current) {
    machine.send({ type: 'SET_CHECKED', value: mergedChecked });
    prevCheckedRef.current = mergedChecked;
  }
  if (mergedDisabled !== prevDisabledRef.current) {
    machine.send({ type: 'SET_DISABLED', value: mergedDisabled });
    prevDisabledRef.current = mergedDisabled;
  }
  if (mergedInvalid !== prevInvalidRef.current) {
    machine.send({ type: 'SET_INVALID', value: mergedInvalid });
    prevInvalidRef.current = mergedInvalid;
  }

  const send = useCallback(
    (event: RadioEvent) => {
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

  const handleSelect = useCallback(() => {
    if (machine.isInteractionBlocked() || machine.getContext().readOnly) {
      return;
    }

    // Zaten checked ise bir şey yapma
    if (machine.getContext().checked) {
      return;
    }

    // Grup controlled mode — onValueChange çağır
    if (groupCtx?.onValueChange && coreProps.value) {
      groupCtx.onValueChange(coreProps.value);
      return;
    }

    // Standalone controlled mode — onSelect çağır
    if (onSelect && coreProps.value) {
      onSelect(coreProps.value);
      return;
    }

    // Uncontrolled mode — machine'de select
    send({ type: 'SELECT' });
  }, [machine, send, groupCtx, onSelect, coreProps.value]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === ' ') {
        event.preventDefault();
        handleSelect();
      }
    },
    [handleSelect],
  );

  const domProps = machine.getRadioProps();
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
      onClick: handleSelect,
      onKeyDown: handleKeyDown,
    },
    checked: ctx.checked,
    isDisabled: ctx.disabled,
    isReadOnly: ctx.readOnly,
    isInvalid: ctx.invalid,
    name: mergedName,
  };
}
