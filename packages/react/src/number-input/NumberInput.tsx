/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * NumberInput — styled React number input component (Dual API).
 * NumberInput — stilize edilmis React sayisal input bileseni (Dual API).
 *
 * Props-based: `<NumberInput min={0} max={100} step={5} />`
 * Compound:    `<NumberInput><NumberInput.Field /><NumberInput.IncrementButton /><NumberInput.DecrementButton /></NumberInput>`
 *
 * Stepper butonlari, min/max/step, keyboard destegi (ArrowUp/Down).
 * 3 varyant x 5 boyut. Vanilla Extract + CSS Variables ile tema destegi.
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
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
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/** NumberInput slot isimleri. */
export type NumberInputSlot =
  | 'root'
  | 'input'
  | 'stepperContainer'
  | 'incrementButton'
  | 'decrementButton';

// ── Context (Compound API) ──────────────────────────

interface NumberInputContextValue {
  size: NumberInputSize;
  variant: NumberInputVariant;
  disabled: boolean;
  value: number | null;
  min: number;
  max: number;
  step: number;
  classNames: ClassNames<NumberInputSlot> | undefined;
  styles: Styles<NumberInputSlot> | undefined;
  /** Hook return referansi - compound sub-component'lar icin */
  incrementProps: Record<string, unknown>;
  decrementProps: Record<string, unknown>;
  inputProps: Record<string, unknown>;
  formattedValue: string;
}

const NumberInputContext = createContext<NumberInputContextValue | null>(null);

/** NumberInput compound sub-component context hook. */
export function useNumberInputContext(): NumberInputContextValue {
  const ctx = useContext(NumberInputContext);
  if (!ctx) throw new Error('NumberInput compound sub-components must be used within <NumberInput>.');
  return ctx;
}

// ── Compound: NumberInput.Field ──────────────────────

/** NumberInput.Field props */
export interface NumberInputFieldProps {
  /** Placeholder metni / Placeholder text */
  placeholder?: string;
  /** Ek className / Additional className */
  className?: string;
  /** aria-label */
  'aria-label'?: string;
}

const NumberInputField = forwardRef<HTMLInputElement, NumberInputFieldProps>(
  function NumberInputField(props, ref) {
    const { placeholder, className, 'aria-label': ariaLabel } = props;
    const ctx = useNumberInputContext();

    const padding = numberInputPaddingMap[ctx.size] ?? numberInputPaddingMap.md;
    const slot = getSlotProps('input', numberInputInputStyle, ctx.classNames, ctx.styles, {
      paddingLeft: padding,
    });
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <input
        {...(ctx.inputProps as Record<string, unknown>)}
        ref={ref}
        className={cls}
        style={slot.style}
        placeholder={placeholder}
        aria-label={ariaLabel}
        data-testid="numberinput-field"
      />
    );
  },
);

// ── Compound: NumberInput.IncrementButton ─────────────

/** NumberInput.IncrementButton props */
export interface NumberInputIncrementButtonProps {
  /** Icerik / Content (varsayilan: ChevronUpIcon) */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const NumberInputIncrementButton = forwardRef<HTMLSpanElement, NumberInputIncrementButtonProps>(
  function NumberInputIncrementButton(props, ref) {
    const { children, className } = props;
    const ctx = useNumberInputContext();
    const stepperFontSize = numberInputStepperFontSizeMap[ctx.size] ?? numberInputStepperFontSizeMap.md;

    const slot = getSlotProps('incrementButton', numberInputStepperButtonStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span
        {...(ctx.incrementProps as Record<string, unknown>)}
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="numberinput-increment"
      >
        {children ?? <ChevronUpIcon size={stepperFontSize} />}
      </span>
    );
  },
);

// ── Compound: NumberInput.DecrementButton ─────────────

/** NumberInput.DecrementButton props */
export interface NumberInputDecrementButtonProps {
  /** Icerik / Content (varsayilan: ChevronDownIcon) */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const NumberInputDecrementButton = forwardRef<HTMLSpanElement, NumberInputDecrementButtonProps>(
  function NumberInputDecrementButton(props, ref) {
    const { children, className } = props;
    const ctx = useNumberInputContext();
    const stepperFontSize = numberInputStepperFontSizeMap[ctx.size] ?? numberInputStepperFontSizeMap.md;

    const slot = getSlotProps('decrementButton', numberInputStepperButtonStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span
        {...(ctx.decrementProps as Record<string, unknown>)}
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="numberinput-decrement"
      >
        {children ?? <ChevronDownIcon size={stepperFontSize} />}
      </span>
    );
  },
);

/**
 * NumberInput bilesen props'lari.
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

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
}

/**
 * NumberInput — RelUI sayisal input bileseni (Dual API).
 * NumberInput — RelUI number input component (Dual API).
 *
 * @example Props-based
 * ```tsx
 * <NumberInput min={0} max={100} step={5} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <NumberInput min={0} max={100}>
 *   <NumberInput.Field placeholder="Sayi girin" />
 *   <NumberInput.IncrementButton />
 *   <NumberInput.DecrementButton />
 * </NumberInput>
 * ```
 */
const NumberInputBase = forwardRef<HTMLInputElement, NumberInputComponentProps>(
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
      children,
      ...hookProps
    },
    forwardedRef,
  ) {
    const {
      rootProps,
      inputProps,
      incrementProps,
      decrementProps,
      isDisabled,
      value: currentValue,
      formattedValue,
    } = useNumberInput(hookProps);

    const rootRecipeClass = numberInputRootRecipe({ variant, size });
    const rootSlot = getSlotProps('root', rootRecipeClass, classNames, styles, inlineStyle);
    const combinedClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    // ── Compound API ──
    if (children) {
      const ctxValue: NumberInputContextValue = {
        size,
        variant,
        disabled: isDisabled,
        value: currentValue,
        min: hookProps.min ?? -Infinity,
        max: hookProps.max ?? Infinity,
        step: hookProps.step ?? 1,
        classNames,
        styles,
        incrementProps: incrementProps as unknown as Record<string, unknown>,
        decrementProps: decrementProps as unknown as Record<string, unknown>,
        inputProps: { ...inputProps, value: formattedValue } as unknown as Record<string, unknown>,
        formattedValue,
      };

      return (
        <NumberInputContext.Provider value={ctxValue}>
          <div
            {...rootProps}
            className={combinedClassName}
            style={rootSlot.style}
            data-testid="numberinput-root"
          >
            {children}
          </div>
        </NumberInputContext.Provider>
      );
    }

    // ── Props-based API ──

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

/**
 * NumberInput bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <NumberInput min={0} max={100} step={5} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <NumberInput min={0} max={100}>
 *   <NumberInput.Field placeholder="Sayi" />
 *   <NumberInput.IncrementButton />
 *   <NumberInput.DecrementButton />
 * </NumberInput>
 * ```
 */
export const NumberInput = Object.assign(NumberInputBase, {
  Field: NumberInputField,
  IncrementButton: NumberInputIncrementButton,
  DecrementButton: NumberInputDecrementButton,
});
