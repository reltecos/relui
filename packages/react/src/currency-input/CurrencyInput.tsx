/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * CurrencyInput — styled React currency input component (Dual API).
 * CurrencyInput — stilize edilmis React para birimi input bileseni (Dual API).
 *
 * Props-based: `<CurrencyInput locale="tr-TR" currency="TRY" />`
 * Compound:    `<CurrencyInput><CurrencyInput.Symbol /><CurrencyInput.Field /></CurrencyInput>`
 *
 * Locale-aware formatlama, binlik/ondalik ayiraci, para birimi sembolu.
 * Input recipe'sini (outline/filled/flushed) reuse eder.
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type {
  CurrencyInputVariant,
  CurrencyInputSize,
} from '@relteco/relui-core';
import { useCurrencyInput, type UseCurrencyInputProps } from './useCurrencyInput';
import { inputRecipe, inputWrapperStyle } from '../input/input.css';
import { currencyAdornStyle } from './currency-input.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/** CurrencyInput slot isimleri. */
export type CurrencyInputSlot = 'root' | 'input' | 'adornPrefix' | 'adornSuffix';

// ── Context (Compound API) ──────────────────────────

interface CurrencyInputContextValue {
  size: CurrencyInputSize;
  variant: CurrencyInputVariant;
  disabled: boolean;
  currencySymbol: string;
  symbolPosition: 'prefix' | 'suffix';
  classNames: ClassNames<CurrencyInputSlot> | undefined;
  styles: Styles<CurrencyInputSlot> | undefined;
}

const CurrencyInputContext = createContext<CurrencyInputContextValue | null>(null);

/** CurrencyInput compound sub-component context hook. */
export function useCurrencyInputContext(): CurrencyInputContextValue {
  const ctx = useContext(CurrencyInputContext);
  if (!ctx) throw new Error('CurrencyInput compound sub-components must be used within <CurrencyInput>.');
  return ctx;
}

// ── Compound: CurrencyInput.Symbol ───────────────────

/** CurrencyInput.Symbol props */
export interface CurrencyInputSymbolProps {
  /** Icerik override (varsayilan: locale sembol) / Content override (default: locale symbol) */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const CurrencyInputSymbol = forwardRef<HTMLSpanElement, CurrencyInputSymbolProps>(
  function CurrencyInputSymbol(props, ref) {
    const { children, className } = props;
    const ctx = useCurrencyInputContext();

    const ADORN_WIDTH_MAP: Record<CurrencyInputSize, string> = {
      xs: '1.5rem',
      sm: '1.75rem',
      md: '2rem',
      lg: '2.25rem',
      xl: '2.5rem',
    };

    const ADORN_FONT_SIZE_MAP: Record<CurrencyInputSize, string> = {
      xs: 'var(--rel-text-2xs)',
      sm: 'var(--rel-text-xs)',
      md: 'var(--rel-text-sm)',
      lg: 'var(--rel-text-base)',
      xl: 'var(--rel-text-lg)',
    };

    const isPrefix = ctx.symbolPosition === 'prefix';
    const slotName = isPrefix ? 'adornPrefix' : 'adornSuffix';

    const existingStyle = isPrefix
      ? {
          left: 0 as const,
          width: ADORN_WIDTH_MAP[ctx.size],
          paddingLeft: 'var(--rel-spacing-2)',
          fontSize: ADORN_FONT_SIZE_MAP[ctx.size],
        }
      : {
          right: 0 as const,
          width: ADORN_WIDTH_MAP[ctx.size],
          paddingRight: 'var(--rel-spacing-2)',
          fontSize: ADORN_FONT_SIZE_MAP[ctx.size],
        };

    const slot = getSlotProps(slotName, currencyAdornStyle, ctx.classNames, ctx.styles, existingStyle);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span
        ref={ref}
        className={cls}
        style={slot.style}
        aria-hidden="true"
        data-testid="currencyinput-symbol"
      >
        {children ?? ctx.currencySymbol}
      </span>
    );
  },
);

// ── Compound: CurrencyInput.Field ────────────────────

/** CurrencyInput.Field props */
export interface CurrencyInputFieldProps {
  /** Placeholder metni / Placeholder text */
  placeholder?: string;
  /** Ek className / Additional className */
  className?: string;
  /** aria-label */
  'aria-label'?: string;
}

const CurrencyInputField = forwardRef<HTMLInputElement, CurrencyInputFieldProps>(
  function CurrencyInputField(props, ref) {
    const { placeholder, className, 'aria-label': ariaLabel } = props;
    const ctx = useCurrencyInputContext();

    const slot = getSlotProps('input', undefined, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <input
        ref={ref}
        className={cls || undefined}
        style={slot.style}
        placeholder={placeholder}
        aria-label={ariaLabel}
        data-testid="currencyinput-field"
      />
    );
  },
);

/**
 * CurrencyInput bilesen props'lari.
 * CurrencyInput component props.
 */
export interface CurrencyInputComponentProps extends UseCurrencyInputProps, SlotStyleProps<CurrencyInputSlot> {
  /** Gorsel varyant / Visual variant */
  variant?: CurrencyInputVariant;

  /** Boyut / Size */
  size?: CurrencyInputSize;

  /** Placeholder metni / Placeholder text */
  placeholder?: string;

  /**
   * Para birimi sembolunu goster / Show currency symbol adorn.
   *
   * true: input disinda sembol gosterilir (leftElement/rightElement pattern).
   * false: sembol sadece formatli degerde gosterilir.
   *
   * @default true
   */
  showAdorn?: boolean;

  /** Ek CSS sinifi / Additional CSS class */
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

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
}

// ── Size -> adorn padding map ────────────────────────────────────────

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
 * CurrencyInput — RelUI para birimi input bileseni (Dual API).
 * CurrencyInput — RelUI currency input component (Dual API).
 *
 * @example Props-based
 * ```tsx
 * <CurrencyInput value={price} onValueChange={setPrice} locale="tr-TR" currency="TRY" />
 * ```
 *
 * @example Compound
 * ```tsx
 * <CurrencyInput locale="tr-TR" currency="TRY">
 *   <CurrencyInput.Symbol />
 *   <CurrencyInput.Field />
 * </CurrencyInput>
 * ```
 */
const CurrencyInputBase = forwardRef<HTMLInputElement, CurrencyInputComponentProps>(
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
      children,
      ...hookProps
    },
    forwardedRef,
  ) {
    const {
      inputProps,
      localeInfo,
      isFocused,
      isDisabled,
    } = useCurrencyInput(hookProps);

    // Adorn gosterilecek mi?
    const currencyDisplay = hookProps.currencyDisplay ?? 'symbol';
    const hasAdorn = showAdorn && currencyDisplay !== 'none' && localeInfo.currencySymbol;
    const isPrefix = localeInfo.symbolPosition === 'prefix';

    // ── Compound API ──
    if (children) {
      const ctxValue: CurrencyInputContextValue = {
        size,
        variant,
        disabled: isDisabled,
        currencySymbol: localeInfo.currencySymbol ?? '',
        symbolPosition: isPrefix ? 'prefix' : 'suffix',
        classNames,
        styles,
      };

      // Compound modda: adorn padding + textAlign
      const paddingOverrides: React.CSSProperties = { textAlign: 'right' };
      if (hasAdorn) {
        if (isPrefix) {
          paddingOverrides.paddingLeft = ADORN_PADDING[size];
        } else {
          paddingOverrides.paddingRight = ADORN_PADDING[size];
        }
      }

      const recipeClass = inputRecipe({ variant, size });
      const inputSlot = getSlotProps('input', recipeClass, classNames, styles, paddingOverrides);
      const combinedInputClassName = className
        ? `${inputSlot.className} ${className}`
        : inputSlot.className;

      const effectivePlaceholder = placeholder ?? (
        isFocused
          ? `0${localeInfo.decimalSeparator}${'0'.repeat(hookProps.precision ?? 2)}`
          : undefined
      );

      const rootSlot = getSlotProps('root', inputWrapperStyle, classNames, styles, inlineStyle);

      return (
        <CurrencyInputContext.Provider value={ctxValue}>
          <div
            className={rootSlot.className}
            style={rootSlot.style}
            data-testid="currencyinput-root"
          >
            {children}
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
          </div>
        </CurrencyInputContext.Provider>
      );
    }

    // ── Props-based API ──

    // Adorn varsa padding override
    const paddingOverrides: React.CSSProperties = {};
    if (hasAdorn) {
      if (isPrefix) {
        paddingOverrides.paddingLeft = ADORN_PADDING[size];
      } else {
        paddingOverrides.paddingRight = ADORN_PADDING[size];
      }
    }

    // Text alignment
    paddingOverrides.textAlign = 'right';

    const recipeClass = inputRecipe({ variant, size });
    const inputSlot = getSlotProps('input', recipeClass, classNames, styles, paddingOverrides);
    const combinedInputClassName = className
      ? `${inputSlot.className} ${className}`
      : inputSlot.className;

    // Placeholder: focus'taysa locale-aware placeholder, degilse formatli
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

    // Adorn yoksa sadece input dondur
    if (!hasAdorn) {
      return inputElement;
    }

    // Adorn varsa wrapper ile dondur
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

/**
 * CurrencyInput bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <CurrencyInput value={price} locale="tr-TR" currency="TRY" />
 * ```
 *
 * @example Compound
 * ```tsx
 * <CurrencyInput locale="tr-TR" currency="TRY">
 *   <CurrencyInput.Symbol />
 *   <CurrencyInput.Field />
 * </CurrencyInput>
 * ```
 */
export const CurrencyInput = Object.assign(CurrencyInputBase, {
  Symbol: CurrencyInputSymbol,
  Field: CurrencyInputField,
});
