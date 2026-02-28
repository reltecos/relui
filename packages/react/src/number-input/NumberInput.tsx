/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * NumberInput — styled React number input component.
 * NumberInput — stilize edilmiş React sayısal input bileşeni.
 *
 * Stepper butonları (▲▼), min/max/step, keyboard desteği (ArrowUp/Down).
 * 3 varyant × 5 boyut. Vanilla Extract + CSS Variables ile tema desteği.
 *
 * @packageDocumentation
 */

import { forwardRef } from 'react';
import type { NumberInputVariant, NumberInputSize } from '@relteco/relui-core';
import { ChevronUpIcon, ChevronDownIcon } from '@relteco/relui-icons';
import { useNumberInput, type UseNumberInputProps } from './useNumberInput';
import {
  numberInputRootRecipe,
  numberInputInputStyle,
  numberInputStepperContainerStyle,
  numberInputStepperButtonStyle,
  numberInputStepperDividerStyle,
  numberInputPaddingMap,
  numberInputStepperWidthMap,
  numberInputStepperFontSizeMap,
} from './number-input.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** NumberInput slot isimleri. */
export type NumberInputSlot =
  | 'root'
  | 'input'
  | 'stepperContainer'
  | 'incrementButton'
  | 'decrementButton';

/**
 * NumberInput bileşen props'ları.
 * NumberInput component props.
 */
export interface NumberInputComponentProps extends UseNumberInputProps, SlotStyleProps<NumberInputSlot> {
  /** Görsel varyant / Visual variant */
  variant?: NumberInputVariant;

  /** Boyut / Size */
  size?: NumberInputSize;

  /** Placeholder metni / Placeholder text */
  placeholder?: string;

  /** Stepper butonlarını gizle / Hide stepper buttons */
  hideStepper?: boolean;

  /** Ek CSS sınıfı / Additional CSS class */
  className?: string;

  /** HTML id */
  id?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;

  /** Name attribute */
  name?: string;

  /** aria-label */
  'aria-label'?: string;

  /** aria-labelledby */
  'aria-labelledby'?: string;

  /** aria-describedby */
  'aria-describedby'?: string;
}

/**
 * NumberInput — RelUI sayısal input bileşeni.
 * NumberInput — RelUI number input component.
 *
 * @example
 * ```tsx
 * <NumberInput min={0} max={100} step={5} />
 *
 * <NumberInput
 *   value={quantity}
 *   onValueChange={setQuantity}
 *   min={1}
 *   max={99}
 *   variant="filled"
 *   size="lg"
 * />
 *
 * <NumberInput
 *   step={0.01}
 *   precision={2}
 *   placeholder="0.00"
 * />
 * ```
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputComponentProps>(
  function NumberInput(
    {
      variant = 'outline',
      size = 'md',
      placeholder,
      hideStepper = false,
      className,
      id,
      style: inlineStyle,
      classNames,
      styles,
      name,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      ...hookProps
    },
    forwardedRef,
  ) {
    const {
      rootProps,
      inputProps,
      incrementProps,
      decrementProps,
    } = useNumberInput(hookProps);

    const rootRecipeClass = numberInputRootRecipe({ variant, size });
    const rootSlot = getSlotProps('root', rootRecipeClass, classNames, styles, inlineStyle);
    const combinedClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const padding = numberInputPaddingMap[size] ?? numberInputPaddingMap.md;
    const stepperWidth = numberInputStepperWidthMap[size] ?? numberInputStepperWidthMap.md;
    const stepperFontSize = numberInputStepperFontSizeMap[size] ?? numberInputStepperFontSizeMap.md;

    const inputSlot = getSlotProps('input', numberInputInputStyle, classNames, styles, {
      paddingLeft: padding,
      paddingRight: hideStepper ? padding : undefined,
    });

    const stepperContainerSlot = getSlotProps(
      'stepperContainer',
      numberInputStepperContainerStyle,
      classNames,
      styles,
      { width: stepperWidth },
    );

    const incrementSlot = getSlotProps(
      'incrementButton',
      numberInputStepperButtonStyle,
      classNames,
      styles,
    );

    const decrementSlot = getSlotProps(
      'decrementButton',
      numberInputStepperButtonStyle,
      classNames,
      styles,
    );

    return (
      <div
        {...rootProps}
        className={combinedClassName}
        style={rootSlot.style}
      >
        <input
          {...inputProps}
          ref={forwardedRef}
          id={id}
          name={name}
          className={inputSlot.className}
          style={inputSlot.style}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
        />

        {!hideStepper && (
          <div
            className={stepperContainerSlot.className}
            style={stepperContainerSlot.style}
            aria-hidden="true"
          >
            <span
              {...incrementProps}
              className={incrementSlot.className}
              style={incrementSlot.style}
            >
              <ChevronUpIcon size={stepperFontSize} />
            </span>

            <span className={numberInputStepperDividerStyle} />

            <span
              {...decrementProps}
              className={decrementSlot.className}
              style={decrementSlot.style}
            >
              <ChevronDownIcon size={stepperFontSize} />
            </span>
          </div>
        )}
      </div>
    );
  },
);
