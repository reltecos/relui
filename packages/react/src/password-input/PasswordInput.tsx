/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * PasswordInput — styled React password input component.
 * PasswordInput — stilize edilmiş React şifre input bileşeni.
 *
 * Input bileşenini temel alır, şifre görünürlük toggle'ı ekler.
 * EyeIcon / EyeOffIcon varsayılan ikonlar, prop ile override edilebilir.
 *
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';
import type { InputVariant, InputSize } from '@relteco/relui-core';
import { EyeIcon, EyeOffIcon } from '@relteco/relui-icons';
import { usePasswordInput, type UsePasswordInputProps } from './usePasswordInput';
import { inputRecipe, inputWrapperStyle } from '../input/input.css';
import { passwordToggleButtonStyle } from './password-input.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** PasswordInput slot isimleri. */
export type PasswordInputSlot = 'root' | 'input' | 'toggleButton';

/**
 * PasswordInput bileşen props'ları.
 * PasswordInput component props.
 */
export interface PasswordInputComponentProps extends UsePasswordInputProps, SlotStyleProps<PasswordInputSlot> {
  /** Görsel varyant / Visual variant */
  variant?: InputVariant;

  /** Boyut / Size */
  size?: InputSize;

  /** Placeholder metni / Placeholder text */
  placeholder?: string;

  /**
   * Göster ikonu / Show icon (password gizliyken gösterilir).
   * Varsayılan: EyeIcon.
   *
   * @example <MyEyeIcon />
   */
  showIcon?: ReactNode;

  /**
   * Gizle ikonu / Hide icon (password görünürken gösterilir).
   * Varsayılan: EyeOffIcon.
   *
   * @example <MyEyeOffIcon />
   */
  hideIcon?: ReactNode;

  /** Ek CSS sınıfı / Additional CSS class */
  className?: string;

  /** HTML id */
  id?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;

  /** Input value (controlled) */
  value?: string;

  /** Default value (uncontrolled) */
  defaultValue?: string;

  /** Name attribute */
  name?: string;

  /** Autocomplete attribute */
  autoComplete?: string;

  /** aria-label */
  'aria-label'?: string;

  /** aria-labelledby */
  'aria-labelledby'?: string;

  /** aria-describedby */
  'aria-describedby'?: string;
}

// ── Size → toggle buton width/padding map ───────────────────────────

const TOGGLE_WIDTH: Record<InputSize, string> = {
  xs: '1.5rem',
  sm: '1.75rem',
  md: '2rem',
  lg: '2.25rem',
  xl: '2.5rem',
};

const TOGGLE_PADDING: Record<InputSize, string> = {
  xs: 'var(--rel-spacing-5)',
  sm: 'var(--rel-spacing-6)',
  md: 'var(--rel-spacing-8)',
  lg: 'var(--rel-spacing-9)',
  xl: 'var(--rel-spacing-10)',
};

/**
 * PasswordInput — RelUI şifre input bileşeni.
 * PasswordInput — RelUI password input component.
 *
 * @example
 * ```tsx
 * <PasswordInput placeholder="Şifre" />
 *
 * <PasswordInput
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 *   variant="filled"
 *   size="lg"
 * />
 *
 * <PasswordInput showIcon={<MyEyeIcon />} hideIcon={<MyEyeOffIcon />} />
 * ```
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputComponentProps>(
  function PasswordInput(
    {
      variant = 'outline',
      size = 'md',
      placeholder,
      showIcon,
      hideIcon,
      className,
      id,
      style: inlineStyle,
      classNames,
      styles,
      value,
      defaultValue,
      name,
      autoComplete = 'current-password',
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      ...hookProps
    },
    forwardedRef,
  ) {
    const {
      inputProps,
      isVisible,
      toggleVisibility,
      inputType,
      isDisabled,
    } = usePasswordInput(hookProps);

    const rootSlot = getSlotProps('root', inputWrapperStyle, classNames, styles, inlineStyle);

    const recipeClass = inputRecipe({ variant, size });
    const inputSlot = getSlotProps('input', recipeClass, classNames, styles, {
      paddingRight: TOGGLE_PADDING[size],
    });
    const combinedInputClassName = className
      ? `${inputSlot.className} ${className}`
      : inputSlot.className;

    const toggleSlot = getSlotProps('toggleButton', passwordToggleButtonStyle, classNames, styles, {
      width: TOGGLE_WIDTH[size],
      paddingRight: 'var(--rel-spacing-2)',
    });

    // Varsayılan ikonlar / Default icons
    const currentShowIcon = showIcon ?? <EyeIcon />;
    const currentHideIcon = hideIcon ?? <EyeOffIcon />;

    return (
      <div className={rootSlot.className} style={rootSlot.style}>
        <input
          {...inputProps}
          ref={forwardedRef}
          id={id}
          type={inputType}
          className={combinedInputClassName}
          style={inputSlot.style}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          name={name}
          autoComplete={autoComplete}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
        />

        <button
          type="button"
          className={toggleSlot.className}
          onClick={toggleVisibility}
          style={toggleSlot.style}
          data-disabled={isDisabled ? '' : undefined}
          tabIndex={isDisabled ? -1 : 0}
          aria-label={isVisible ? 'Şifreyi gizle' : 'Şifreyi göster'}
        >
          {isVisible ? currentHideIcon : currentShowIcon}
        </button>
      </div>
    );
  },
);
