/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MaskedInput — styled React masked input component.
 * MaskedInput — stilize edilmiş React maskeli input bileşeni.
 *
 * Mask pattern'a göre otomatik formatlama, cursor yönetimi.
 * Input recipe'sini (outline/filled/flushed) reuse eder.
 *
 * @packageDocumentation
 */

import { forwardRef } from 'react';
import type {
  MaskedInputVariant,
  MaskedInputSize,
} from '@relteco/relui-core';
import { useMaskedInput, type UseMaskedInputProps } from './useMaskedInput';
import { inputRecipe } from '../input/input.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** MaskedInput slot isimleri. */
export type MaskedInputSlot = 'root';

/**
 * MaskedInput bileşen props'ları.
 * MaskedInput component props.
 */
export interface MaskedInputComponentProps extends UseMaskedInputProps, SlotStyleProps<MaskedInputSlot> {
  /** Görsel varyant / Visual variant */
  variant?: MaskedInputVariant;

  /** Boyut / Size */
  size?: MaskedInputSize;

  /** Placeholder metni (varsayılan: mask placeholder) / Placeholder text */
  placeholder?: string;

  /** Ek CSS sınıfı / Additional CSS class */
  className?: string;

  /** HTML id */
  id?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;

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

/**
 * MaskedInput — RelUI maskeli input bileşeni.
 * MaskedInput — RelUI masked input component.
 *
 * @example
 * ```tsx
 * <MaskedInput
 *   mask="(###) ### ## ##"
 *   onValueChange={(raw) => setPhone(raw)}
 *   aria-label="Telefon"
 * />
 *
 * <MaskedInput
 *   mask="##/##/####"
 *   variant="filled"
 *   size="lg"
 *   aria-label="Tarih"
 * />
 * ```
 */
export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputComponentProps>(
  function MaskedInput(
    {
      variant = 'outline',
      size = 'md',
      placeholder: placeholderProp,
      className,
      id,
      style,
      classNames,
      styles,
      name,
      autoComplete = 'off',
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      ...hookProps
    },
    forwardedRef,
  ) {
    const {
      inputProps,
      placeholder: maskPlaceholder,
    } = useMaskedInput(hookProps);

    const recipeClass = inputRecipe({ variant, size });
    const rootSlot = getSlotProps('root', recipeClass, classNames, styles, style);
    const combinedClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    return (
      <input
        {...inputProps}
        ref={forwardedRef}
        id={id}
        className={combinedClassName}
        style={rootSlot.style}
        placeholder={placeholderProp ?? maskPlaceholder}
        name={name}
        autoComplete={autoComplete}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
      />
    );
  },
);
