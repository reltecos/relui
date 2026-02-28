/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * CurrencyInput — styled React currency input component.
 * CurrencyInput — stilize edilmiş React para birimi input bileşeni.
 *
 * Locale-aware formatlama, binlik/ondalık ayracı, para birimi sembolü.
 * Input recipe'sini (outline/filled/flushed) reuse eder.
 *
 * @packageDocumentation
 */

import { forwardRef } from 'react';
import type {
  CurrencyInputVariant,
  CurrencyInputSize,
} from '@relteco/relui-core';
import { useCurrencyInput, type UseCurrencyInputProps } from './useCurrencyInput';
import { inputRecipe, inputWrapperStyle } from '../input/input.css';
import { currencyAdornStyle } from './currency-input.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** CurrencyInput slot isimleri. */
export type CurrencyInputSlot = 'root' | 'input' | 'adornPrefix' | 'adornSuffix';

/**
 * CurrencyInput bileşen props'ları.
 * CurrencyInput component props.
 */
export interface CurrencyInputComponentProps extends UseCurrencyInputProps, SlotStyleProps<CurrencyInputSlot> {
  /** Görsel varyant / Visual variant */
  variant?: CurrencyInputVariant;

  /** Boyut / Size */
  size?: CurrencyInputSize;

  /** Placeholder metni / Placeholder text */
  placeholder?: string;

  /**
   * Para birimi sembolünü göster / Show currency symbol adorn.
   *
   * true: input dışında sembol gösterilir (leftElement/rightElement pattern).
   * false: sembol sadece formatlı değerde gösterilir.
   *
   * @default true
   */
  showAdorn?: boolean;

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

// ── Size → adorn padding map ────────────────────────────────────────

const ADORN_PADDING: Record<CurrencyInputSize, string> = {
  xs: 'var(--rel-spacing-5)',
  sm: 'var(--rel-spacing-6)',
  md: 'var(--rel-spacing-8)',
  lg: 'var(--rel-spacing-9)',
  xl: 'var(--rel-spacing-10)',
};

const ADORN_WIDTH: Record<CurrencyInputSize, string> = {
  xs: '1.5rem',
  sm: '1.75rem',
  md: '2rem',
  lg: '2.25rem',
  xl: '2.5rem',
};

const ADORN_FONT_SIZE: Record<CurrencyInputSize, string> = {
  xs: 'var(--rel-text-2xs)',
  sm: 'var(--rel-text-xs)',
  md: 'var(--rel-text-sm)',
  lg: 'var(--rel-text-base)',
  xl: 'var(--rel-text-lg)',
};

/**
 * CurrencyInput — RelUI para birimi input bileşeni.
 * CurrencyInput — RelUI currency input component.
 *
 * @example
 * ```tsx
 * <CurrencyInput
 *   value={price}
 *   onValueChange={setPrice}
 *   locale="tr-TR"
 *   currency="TRY"
 * />
 *
 * <CurrencyInput
 *   locale="en-US"
 *   currency="USD"
 *   variant="filled"
 *   size="lg"
 *   placeholder="0.00"
 * />
 * ```
 */
export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputComponentProps>(
  function CurrencyInput(
    {
      variant = 'outline',
      size = 'md',
      placeholder,
      showAdorn = true,
      className,
      id,
      style: inlineStyle,
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
      localeInfo,
      isFocused,
    } = useCurrencyInput(hookProps);

    // Adorn gösterilecek mi?
    const currencyDisplay = hookProps.currencyDisplay ?? 'symbol';
    const hasAdorn = showAdorn && currencyDisplay !== 'none' && localeInfo.currencySymbol;
    const isPrefix = localeInfo.symbolPosition === 'prefix';

    // Adorn varsa padding override
    const paddingOverrides: React.CSSProperties = {};
    if (hasAdorn) {
      if (isPrefix) {
        paddingOverrides.paddingLeft = ADORN_PADDING[size];
      } else {
        paddingOverrides.paddingRight = ADORN_PADDING[size];
      }
    }

    // Text alignment — sağa hizala (para birimi inputları genellikle sağa hizalıdır)
    paddingOverrides.textAlign = 'right';

    const recipeClass = inputRecipe({ variant, size });
    const inputSlot = getSlotProps('input', recipeClass, classNames, styles, paddingOverrides);
    const combinedInputClassName = className
      ? `${inputSlot.className} ${className}`
      : inputSlot.className;

    // Placeholder: focus'taysa locale-aware placeholder, değilse formatlı
    const effectivePlaceholder = placeholder ?? (
      isFocused
        ? `0${localeInfo.decimalSeparator}${'0'.repeat(hookProps.precision ?? 2)}`
        : undefined
    );

    const inputElement = (
      <input
        {...inputProps}
        ref={forwardedRef}
        id={id}
        className={combinedInputClassName}
        style={inputSlot.style}
        placeholder={effectivePlaceholder}
        name={name}
        autoComplete={autoComplete}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
      />
    );

    // Adorn yoksa sadece input döndür
    if (!hasAdorn) {
      return inputElement;
    }

    // Adorn varsa wrapper ile döndür
    const rootSlot = getSlotProps('root', inputWrapperStyle, classNames, styles, inlineStyle);

    const prefixSlot = getSlotProps('adornPrefix', currencyAdornStyle, classNames, styles, {
      left: 0,
      width: ADORN_WIDTH[size],
      paddingLeft: 'var(--rel-spacing-2)',
      fontSize: ADORN_FONT_SIZE[size],
    });

    const suffixSlot = getSlotProps('adornSuffix', currencyAdornStyle, classNames, styles, {
      right: 0,
      width: ADORN_WIDTH[size],
      paddingRight: 'var(--rel-spacing-2)',
      fontSize: ADORN_FONT_SIZE[size],
    });

    return (
      <div className={rootSlot.className} style={rootSlot.style}>
        {isPrefix && (
          <span
            className={prefixSlot.className}
            style={prefixSlot.style}
            aria-hidden="true"
          >
            {localeInfo.currencySymbol}
          </span>
        )}

        {inputElement}

        {!isPrefix && (
          <span
            className={suffixSlot.className}
            style={suffixSlot.style}
            aria-hidden="true"
          >
            {localeInfo.currencySymbol}
          </span>
        )}
      </div>
    );
  },
);
