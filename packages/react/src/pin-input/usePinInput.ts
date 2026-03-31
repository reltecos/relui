/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * PinInput React hook.
 * Core state machine ile React arasinda kopru.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect } from 'react';
import { createPinInput } from '@relteco/relui-core';
import type { PinInputType } from '@relteco/relui-core';

/** usePinInput hook prop'lari / usePinInput hook props */
export interface UsePinInputProps {
  /** Alan sayisi / Number of fields (default: 4) */
  length?: number;
  /** Baslangic degeri / Default value */
  defaultValue?: string;
  /** Giris tipi / Input type (default: 'number') */
  type?: PinInputType;
  /** Karakterleri gizle / Mask characters */
  mask?: boolean;
  /** Tum alanlar dolunca callback / Callback when all fields are filled */
  onComplete?: (value: string) => void;
  /** Deger degisince callback / Callback when value changes */
  onChange?: (value: string) => void;
}

/** usePinInput hook donus degeri / usePinInput hook return value */
export interface UsePinInputReturn {
  /** Her alana girilen degerler / Values entered in each field */
  values: readonly string[];
  /** Suanda odaklanmis alan indeksi / Currently focused field index */
  focusIndex: number;
  /** Tum alanlar dolu mu / Are all fields filled */
  isComplete: boolean;
  /** Birlesmis deger / Joined value */
  value: string;
  /** Tek karakter set et / Set single character */
  setChar: (index: number, char: string) => void;
  /** Geri sil / Backspace */
  backspace: (index: number) => void;
  /** Yapistr / Paste */
  paste: (value: string) => void;
  /** Belirli alana odaklan / Focus specific field */
  focusField: (index: number) => void;
  /** Tum alanlari temizle / Clear all fields */
  clear: () => void;
  /** Core API referansi / Core API reference */
  api: ReturnType<typeof createPinInput>;
}

/**
 * PinInput hook — core state machine'i React'e baglar.
 * PinInput hook — bridges core state machine to React.
 */
export function usePinInput(props: UsePinInputProps = {}): UsePinInputReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<ReturnType<typeof createPinInput> | null>(null);
  const prevRef = useRef<UsePinInputProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createPinInput({
      length: props.length,
      defaultValue: props.defaultValue,
      type: props.type,
      mask: props.mask,
      onComplete: props.onComplete,
      onChange: props.onChange,
    });
  }
  const api = apiRef.current;

  // Prop sync
  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) {
      prevRef.current = props;
      return;
    }
    prevRef.current = props;
  });

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const ctx = api.getContext();

  return {
    values: ctx.values,
    focusIndex: ctx.focusIndex,
    isComplete: ctx.isComplete,
    value: ctx.value,
    setChar: (index: number, char: string) => {
      api.send({ type: 'SET_CHAR', index, char });
    },
    backspace: (index: number) => {
      api.send({ type: 'BACKSPACE', index });
    },
    paste: (value: string) => {
      api.send({ type: 'PASTE', value });
    },
    focusField: (index: number) => {
      api.send({ type: 'FOCUS_INDEX', index });
    },
    clear: () => {
      api.send({ type: 'CLEAR' });
    },
    api,
  };
}
