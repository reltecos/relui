/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FormGroup — styled React form group (fieldset) component.
 * FormGroup — stilize edilmiş React form group (fieldset) bileşeni.
 *
 * Birden fazla FormField'ı gruplar, legend desteği.
 *
 * @packageDocumentation
 */

import { forwardRef } from 'react';
import type { LabelSize, FormGroupOrientation } from '@relteco/relui-core';
import {
  formGroupRecipe,
  legendRecipe,
  formGroupDisabledStyle,
} from './form-group.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** FormGroup slot isimleri. */
export type FormGroupSlot = 'root' | 'legend';

/**
 * FormGroup bileşen props'ları.
 * FormGroup component props.
 */
export interface FormGroupComponentProps extends SlotStyleProps<FormGroupSlot> {
  /** Grup başlığı (legend) / Group legend */
  legend?: string;

  /** Yerleşim yönü / Layout orientation */
  orientation?: FormGroupOrientation;

  /** Boyut / Size */
  size?: LabelSize;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

  /** Ek CSS sınıfı / Additional CSS class */
  className?: string;

  /** HTML id */
  id?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;

  /** İçerik (FormField'lar) / Content (FormFields) */
  children?: React.ReactNode;
}

/**
 * FormGroup — RelUI form group (fieldset) bileşeni.
 * FormGroup — RelUI form group (fieldset) component.
 *
 * @example
 * ```tsx
 * <FormGroup legend="Kişisel Bilgiler">
 *   <FormField label="Ad">
 *     <Input />
 *   </FormField>
 *   <FormField label="Soyad">
 *     <Input />
 *   </FormField>
 * </FormGroup>
 * ```
 */
export const FormGroup = forwardRef<HTMLFieldSetElement, FormGroupComponentProps>(
  function FormGroup(
    {
      legend,
      orientation = 'vertical',
      size = 'md',
      disabled = false,
      className,
      id,
      style: inlineStyle,
      classNames,
      styles,
      children,
    },
    forwardedRef,
  ) {
    const rootRecipe = formGroupRecipe({ orientation });
    const legendRecipeClass = legendRecipe({ size });

    const rootSlot = getSlotProps('root', undefined, classNames, styles, inlineStyle);
    const legendSlot = getSlotProps('legend', legendRecipeClass, classNames, styles);

    const classes = [
      rootRecipe,
      disabled ? formGroupDisabledStyle : '',
      rootSlot.className || undefined,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <fieldset
        ref={forwardedRef}
        id={id}
        className={classes}
        style={rootSlot.style}
        disabled={disabled}
        data-orientation={orientation}
      >
        {legend && (
          <legend className={legendSlot.className} style={legendSlot.style}>
            {legend}
          </legend>
        )}
        {children}
      </fieldset>
    );
  },
);
