/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Input — styled React input component.
 * Input — stilize edilmiş React input bileşeni.
 *
 * 3 varyant × 5 boyut. Vanilla Extract + CSS Variables ile tema desteği.
 * leftElement/rightElement ile ikon veya metin eklenir.
 *
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';
import type { InputVariant, InputSize } from '@relteco/relui-core';
import { useInput, type UseInputProps } from './useInput';
import {
  inputRecipe,
  inputWrapperStyle,
  inputElementLeftStyle,
  inputElementRightStyle,
} from './input.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** Input slot isimleri. */
export type InputSlot = 'root' | 'wrapper' | 'leftElement' | 'rightElement';

/**
 * Input bileşen props'ları.
 * Input component props.
 */
export interface InputComponentProps extends UseInputProps, SlotStyleProps<InputSlot> {
  /** Görsel varyant / Visual variant */
  variant?: InputVariant;

  /** Boyut / Size */
  size?: InputSize;

  /** Placeholder metni / Placeholder text */
  placeholder?: string;

  /**
   * Sol element / Left element.
   *
   * Ikon, metin veya herhangi bir ReactNode.
   * Mutlak konumlandırılır, input padding'i buna göre ayarlanmalı.
   *
   * @example <SearchIcon />
   */
  leftElement?: ReactNode;

  /**
   * Sağ element / Right element.
   *
   * @example <EyeIcon /> (password toggle)
   */
  rightElement?: ReactNode;

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

// ── Size → element padding map ───────────────────────────────────────

const ELEMENT_PADDING: Record<InputSize, string> = {
  xs: 'var(--rel-spacing-5)',
  sm: 'var(--rel-spacing-6)',
  md: 'var(--rel-spacing-8)',
  lg: 'var(--rel-spacing-9)',
  xl: 'var(--rel-spacing-10)',
};

const ELEMENT_WIDTH: Record<InputSize, string> = {
  xs: '1.5rem',
  sm: '1.75rem',
  md: '2rem',
  lg: '2.25rem',
  xl: '2.5rem',
};

/**
 * Input — RelUI input bileşeni.
 * Input — RelUI input component.
 *
 * @example
 * ```tsx
 * <Input placeholder="E-posta" type="email" variant="outline" />
 *
 * <Input
 *   placeholder="Ara..."
 *   leftElement={<SearchIcon />}
 *   variant="filled"
 * />
 *
 * <Input
 *   placeholder="Şifre"
 *   type="password"
 *   rightElement={<EyeIcon />}
 *   invalid
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputComponentProps>(function Input(
  {
    variant = 'outline',
    size = 'md',
    placeholder,
    leftElement,
    rightElement,
    className,
    id,
    style: inlineStyle,
    classNames,
    styles,
    value,
    defaultValue,
    name,
    autoComplete,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    ...hookProps
  },
  forwardedRef,
) {
  const { inputProps } = useInput(hookProps);

  const recipeClass = inputRecipe({ variant, size });

  // leftElement/rightElement varsa padding override
  const paddingOverrides: React.CSSProperties = {};
  if (leftElement) {
    paddingOverrides.paddingLeft = ELEMENT_PADDING[size];
  }
  if (rightElement) {
    paddingOverrides.paddingRight = ELEMENT_PADDING[size];
  }

  // Merge sırası: paddingOverrides → inlineStyle → styles.root (kullanıcı kazanır)
  const rootSlot = getSlotProps('root', recipeClass, classNames, styles);
  const hasPadding = Object.keys(paddingOverrides).length > 0;
  const baseStyle =
    hasPadding || inlineStyle
      ? { ...paddingOverrides, ...inlineStyle }
      : undefined;
  const mergedStyle =
    baseStyle || rootSlot.style
      ? { ...baseStyle, ...rootSlot.style }
      : undefined;

  const baseClassName = className
    ? `${rootSlot.className} ${className}`
    : rootSlot.className;

  const inputElement = (
    <input
      {...inputProps}
      ref={forwardedRef}
      id={id}
      className={baseClassName}
      style={mergedStyle}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      name={name}
      autoComplete={autoComplete}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    />
  );

  // Element yoksa sadece input döndür
  if (!leftElement && !rightElement) {
    return inputElement;
  }

  // Element varsa wrapper ile döndür
  const wrapperSlot = getSlotProps('wrapper', inputWrapperStyle, classNames, styles);
  const leftSlot = getSlotProps('leftElement', inputElementLeftStyle, classNames, styles, {
    width: ELEMENT_WIDTH[size],
    paddingLeft: 'var(--rel-spacing-2)',
  });
  const rightSlot = getSlotProps('rightElement', inputElementRightStyle, classNames, styles, {
    width: ELEMENT_WIDTH[size],
    paddingRight: 'var(--rel-spacing-2)',
  });

  return (
    <div className={wrapperSlot.className} style={wrapperSlot.style}>
      {leftElement ? (
        <span
          className={leftSlot.className}
          style={leftSlot.style}
          aria-hidden="true"
        >
          {leftElement}
        </span>
      ) : null}

      {inputElement}

      {rightElement ? (
        <span
          className={rightSlot.className}
          style={rightSlot.style}
          aria-hidden="true"
        >
          {rightElement}
        </span>
      ) : null}
    </div>
  );
});
