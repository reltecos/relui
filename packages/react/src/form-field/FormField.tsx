/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FormField — styled React form field wrapper component.
 * FormField — stilize edilmiş React form field sarmalayıcı bileşeni.
 *
 * Label + input + helper text + error message layout.
 * Alt bileşenlere FormFieldContext sağlar.
 *
 * @packageDocumentation
 */

import { forwardRef, useId, useMemo } from 'react';
import type { LabelSize, FormFieldContext } from '@relteco/relui-core';
import { createFormFieldIds } from '@relteco/relui-core';
import { Label } from '../label';
import { FormFieldReactContext } from './FormFieldContext';
import {
  formFieldRecipe,
  helperTextRecipe,
  errorMessageRecipe,
} from './form-field.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** FormField slot isimleri. */
export type FormFieldSlot = 'root' | 'helperText' | 'errorMessage';

/**
 * FormField bileşen props'ları.
 * FormField component props.
 */
export interface FormFieldComponentProps extends SlotStyleProps<FormFieldSlot> {
  /** Benzersiz kimlik / Unique identifier */
  id?: string;

  /** Etiket metni / Label text */
  label?: string;

  /** Yardımcı metin / Helper text */
  helperText?: string;

  /** Hata mesajı / Error message */
  errorMessage?: string;

  /** Boyut / Size */
  size?: LabelSize;

  /** Zorunlu alan / Required field */
  required?: boolean;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

  /** Geçersiz durumu / Invalid state */
  invalid?: boolean;

  /** Ek CSS sınıfı / Additional CSS class */
  className?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;

  /** İçerik (form elemanı) / Content (form element) */
  children?: React.ReactNode;
}

/**
 * FormField — RelUI form field sarmalayıcı bileşeni.
 * FormField — RelUI form field wrapper component.
 *
 * @example
 * ```tsx
 * <FormField label="E-posta" required helperText="İş e-postanızı girin" errorMessage={errors.email}>
 *   <Input />
 * </FormField>
 * ```
 */
export const FormField = forwardRef<HTMLDivElement, FormFieldComponentProps>(
  function FormField(
    {
      id: propId,
      label,
      helperText,
      errorMessage,
      size = 'md',
      required = false,
      disabled = false,
      invalid = false,
      className,
      style: inlineStyle,
      classNames,
      styles,
      children,
    },
    forwardedRef,
  ) {
    const autoId = useId();
    const baseId = propId ?? autoId;
    const ids = createFormFieldIds(baseId);

    const hasHelperText = !!helperText;
    const hasErrorMessage = !!errorMessage;

    // Geçersiz durumu: explicit invalid veya hata mesajı varsa
    const isInvalid = invalid || hasErrorMessage;

    const contextValue = useMemo<FormFieldContext>(
      () => ({
        inputId: ids.inputId,
        labelId: ids.labelId,
        helperId: ids.helperId,
        errorId: ids.errorId,
        size,
        required,
        disabled,
        invalid: isInvalid,
        hasHelperText,
        hasErrorMessage,
      }),
      [ids.inputId, ids.labelId, ids.helperId, ids.errorId, size, required, disabled, isInvalid, hasHelperText, hasErrorMessage],
    );

    const rootRecipe = formFieldRecipe({ size });
    const helperRecipe = helperTextRecipe({ size });
    const errorRecipe = errorMessageRecipe({ size });

    const rootSlot = getSlotProps('root', rootRecipe, classNames, styles, inlineStyle);
    const helperSlot = getSlotProps('helperText', helperRecipe, classNames, styles);
    const errorSlot = getSlotProps('errorMessage', errorRecipe, classNames, styles);

    const combinedClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    // aria-describedby bağlantısı
    const describedBy = [
      hasHelperText ? ids.helperId : null,
      hasErrorMessage ? ids.errorId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <FormFieldReactContext.Provider value={contextValue}>
        <div
          ref={forwardedRef}
          className={combinedClassName}
          style={rootSlot.style}
          role="group"
          aria-describedby={describedBy}
          data-disabled={disabled ? '' : undefined}
          data-invalid={isInvalid ? '' : undefined}
          data-required={required ? '' : undefined}
        >
          {/* Label */}
          {label && (
            <Label
              id={ids.labelId}
              htmlFor={ids.inputId}
              size={size}
              required={required}
              disabled={disabled}
            >
              {label}
            </Label>
          )}

          {/* Form elemanı slot */}
          {children}

          {/* Helper text */}
          {hasHelperText && !hasErrorMessage && (
            <p id={ids.helperId} className={helperSlot.className} style={helperSlot.style}>
              {helperText}
            </p>
          )}

          {/* Error message */}
          {hasErrorMessage && (
            <p id={ids.errorId} className={errorSlot.className} style={errorSlot.style} role="alert">
              {errorMessage}
            </p>
          )}
        </div>
      </FormFieldReactContext.Provider>
    );
  },
);
