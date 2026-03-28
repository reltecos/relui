/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Input — styled React input component (Dual API).
 * Input — stilize edilmiş React input bileseni (Dual API).
 *
 * Props-based: `<Input placeholder="E-posta" leftElement={<MailIcon />} />`
 * Compound:    `<Input><Input.LeftAddon>...</Input.LeftAddon></Input>`
 *
 * 3 varyant x 5 boyut. Vanilla Extract + CSS Variables ile tema destegi.
 * leftElement/rightElement ile ikon veya metin eklenir.
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { InputVariant, InputSize } from '@relteco/relui-core';
import { useInput, type UseInputProps } from './useInput';
import {
  inputRecipe,
  inputWrapperStyle,
  inputElementLeftStyle,
  inputElementRightStyle,
} from './input.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/** Input slot isimleri. */
export type InputSlot = 'root' | 'wrapper' | 'leftElement' | 'rightElement';

// ── Context (Compound API) ──────────────────────────

interface InputContextValue {
  size: InputSize;
  variant: InputVariant;
  disabled: boolean;
  classNames: ClassNames<InputSlot> | undefined;
  styles: Styles<InputSlot> | undefined;
}

const InputContext = createContext<InputContextValue | null>(null);

/** Input compound sub-component context hook. */
export function useInputContext(): InputContextValue {
  const ctx = useContext(InputContext);
  if (!ctx) throw new Error('Input compound sub-components must be used within <Input>.');
  return ctx;
}

// ── Compound: Input.LeftAddon ────────────────────────

/** Input.LeftAddon props */
export interface InputLeftAddonProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const InputLeftAddon = forwardRef<HTMLSpanElement, InputLeftAddonProps>(
  function InputLeftAddon(props, ref) {
    const { children, className } = props;
    const ctx = useInputContext();

    const ELEMENT_WIDTH_MAP: Record<InputSize, string> = {
      xs: '1.5rem',
      sm: '1.75rem',
      md: '2rem',
      lg: '2.25rem',
      xl: '2.5rem',
    };

    const slot = getSlotProps('leftElement', inputElementLeftStyle, ctx.classNames, ctx.styles, {
      width: ELEMENT_WIDTH_MAP[ctx.size],
      paddingLeft: 'var(--rel-spacing-2)',
    });
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span
        ref={ref}
        className={cls}
        style={slot.style}
        aria-hidden="true"
        data-testid="input-left-element"
      >
        {children}
      </span>
    );
  },
);

// ── Compound: Input.RightAddon ───────────────────────

/** Input.RightAddon props */
export interface InputRightAddonProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const InputRightAddon = forwardRef<HTMLSpanElement, InputRightAddonProps>(
  function InputRightAddon(props, ref) {
    const { children, className } = props;
    const ctx = useInputContext();

    const ELEMENT_WIDTH_MAP: Record<InputSize, string> = {
      xs: '1.5rem',
      sm: '1.75rem',
      md: '2rem',
      lg: '2.25rem',
      xl: '2.5rem',
    };

    const slot = getSlotProps('rightElement', inputElementRightStyle, ctx.classNames, ctx.styles, {
      width: ELEMENT_WIDTH_MAP[ctx.size],
      paddingRight: 'var(--rel-spacing-2)',
    });
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span
        ref={ref}
        className={cls}
        style={slot.style}
        aria-hidden="true"
        data-testid="input-right-element"
      >
        {children}
      </span>
    );
  },
);

/**
 * Input bilesen props'lari.
 * Input component props.
 */
export interface InputComponentProps extends UseInputProps, SlotStyleProps<InputSlot> {
  /** Gorsel varyant / Visual variant */
  variant?: InputVariant;

  /** Boyut / Size */
  size?: InputSize;

  /** Placeholder metni / Placeholder text */
  placeholder?: string;

  /**
   * Sol element / Left element.
   *
   * Ikon, metin veya herhangi bir ReactNode.
   * Mutlak konumlandirilir, input padding'i buna gore ayarlanmali.
   *
   * @example <SearchIcon />
   */
  leftElement?: ReactNode;

  /**
   * Sag element / Right element.
   *
   * @example <EyeIcon /> (password toggle)
   */
  rightElement?: ReactNode;

  /** Ek CSS sinifi / Additional CSS class */
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

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
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
 * Input — RelUI input bileseni (Dual API).
 * Input — RelUI input component (Dual API).
 *
 * @example Props-based
 * ```tsx
 * <Input placeholder="E-posta" type="email" variant="outline" />
 * <Input placeholder="Ara..." leftElement={<SearchIcon />} variant="filled" />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Input placeholder="Ara...">
 *   <Input.LeftAddon><SearchIcon /></Input.LeftAddon>
 * </Input>
 * ```
 */
const InputBase = forwardRef<HTMLInputElement, InputComponentProps>(function Input(
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
    children,
    ...hookProps
  },
  forwardedRef,
) {
  const { inputProps, isDisabled } = useInput(hookProps);

  const recipeClass = inputRecipe({ variant, size });

  const ctxValue: InputContextValue = {
    size,
    variant,
    disabled: isDisabled,
    classNames,
    styles,
  };

  // ── Compound API ──
  if (children) {
    // Compound modda input + children wrapper icinde render edilir
    const rootSlot = getSlotProps('root', recipeClass, classNames, styles);
    const baseClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;
    const mergedStyle =
      inlineStyle || rootSlot.style
        ? { ...inlineStyle, ...rootSlot.style }
        : undefined;

    const wrapperSlot = getSlotProps('wrapper', inputWrapperStyle, classNames, styles);

    const inputEl = (
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
        data-testid="input-root"
      />
    );

    return (
      <InputContext.Provider value={ctxValue}>
        <div
          className={wrapperSlot.className}
          style={wrapperSlot.style}
          data-testid="input-wrapper"
        >
          {children}
          {inputEl}
        </div>
      </InputContext.Provider>
    );
  }

  // ── Props-based API ──

  // leftElement/rightElement varsa padding override
  const paddingOverrides: React.CSSProperties = {};
  if (leftElement) {
    paddingOverrides.paddingLeft = ELEMENT_PADDING[size];
  }
  if (rightElement) {
    paddingOverrides.paddingRight = ELEMENT_PADDING[size];
  }

  // Merge sirasi: paddingOverrides -> inlineStyle -> styles.root (kullanici kazanir)
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
      data-testid="input-root"
    />
  );

  // Element yoksa sadece input dondur
  if (!leftElement && !rightElement) {
    return inputElement;
  }

  // Element varsa wrapper ile dondur
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
    <div className={wrapperSlot.className} style={wrapperSlot.style} data-testid="input-wrapper">
      {leftElement ? (
        <span
          className={leftSlot.className}
          style={leftSlot.style}
          aria-hidden="true"
          data-testid="input-left-element"
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
          data-testid="input-right-element"
        >
          {rightElement}
        </span>
      ) : null}
    </div>
  );
});

/**
 * Input bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Input placeholder="E-posta" leftElement={<MailIcon />} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Input placeholder="Ara...">
 *   <Input.LeftAddon><SearchIcon /></Input.LeftAddon>
 * </Input>
 * ```
 */
export const Input = Object.assign(InputBase, {
  LeftAddon: InputLeftAddon,
  RightAddon: InputRightAddon,
});
