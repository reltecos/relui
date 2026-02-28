/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * usePasswordInput — React hook for password input with visibility toggle.
 * usePasswordInput — Görünürlük toggle'ı olan şifre input'u React hook'u.
 *
 * Core Input state machine'ini kullanır, visibility state ekler.
 *
 * @packageDocumentation
 */

import { useCallback, useState } from 'react';
import { useInput, type UseInputProps, type UseInputReturn } from '../input/useInput';

/**
 * usePasswordInput hook props.
 */
export interface UsePasswordInputProps extends UseInputProps {
  /** Başlangıçta görünür mü / Initially visible */
  defaultVisible?: boolean;

  /** Controlled visibility state */
  visible?: boolean;

  /** Visibility değişim callback'i / Visibility change callback */
  onVisibleChange?: (visible: boolean) => void;
}

/**
 * usePasswordInput hook dönüş tipi.
 * usePasswordInput hook return type.
 */
export interface UsePasswordInputReturn extends UseInputReturn {
  /** Şifre görünür mü / Is password visible */
  isVisible: boolean;

  /** Görünürlüğü toggle et / Toggle visibility */
  toggleVisibility: () => void;

  /** Input type — 'password' veya 'text' */
  inputType: 'password' | 'text';
}

/**
 * Password input hook'u — useInput üzerine visibility state ekler.
 * Password input hook — adds visibility state on top of useInput.
 *
 * @example
 * ```tsx
 * const { inputProps, isVisible, toggleVisibility, inputType } = usePasswordInput({
 *   disabled: false,
 *   onChange: (e) => setPassword(e.target.value),
 * });
 *
 * return (
 *   <div>
 *     <input {...inputProps} type={inputType} />
 *     <button onClick={toggleVisibility}>
 *       {isVisible ? 'Gizle' : 'Göster'}
 *     </button>
 *   </div>
 * );
 * ```
 */
export function usePasswordInput(props: UsePasswordInputProps = {}): UsePasswordInputReturn {
  const {
    defaultVisible = false,
    visible: controlledVisible,
    onVisibleChange,
    ...inputProps
  } = props;

  // Uncontrolled visibility state
  const [internalVisible, setInternalVisible] = useState(defaultVisible);

  // Controlled vs uncontrolled
  const isControlled = controlledVisible !== undefined;
  const isVisible = isControlled ? controlledVisible : internalVisible;

  const toggleVisibility = useCallback(() => {
    const next = !isVisible;
    if (!isControlled) {
      setInternalVisible(next);
    }
    onVisibleChange?.(next);
  }, [isVisible, isControlled, onVisibleChange]);

  // Input hook — core state machine
  const inputReturn = useInput(inputProps);

  return {
    ...inputReturn,
    isVisible,
    toggleVisibility,
    inputType: isVisible ? 'text' : 'password',
  };
}
