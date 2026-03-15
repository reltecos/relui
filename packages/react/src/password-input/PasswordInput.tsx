/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * PasswordInput — styled React password input component (Dual API).
 * PasswordInput — stilize edilmis React sifre input bileseni (Dual API).
 *
 * Props-based: `<PasswordInput placeholder="Sifre" />`
 * Compound:    `<PasswordInput><PasswordInput.ToggleButton /></PasswordInput>`
 *
 * Input bilesenini temel alir, sifre gorunurluk toggle ekler.
 * EyeIcon / EyeOffIcon varsayilan ikonlar, prop ile override edilebilir.
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { InputVariant, InputSize } from '@relteco/relui-core';
import { EyeIcon, EyeOffIcon } from '@relteco/relui-icons';
import { usePasswordInput, type UsePasswordInputProps } from './usePasswordInput';
import { inputRecipe, inputWrapperStyle } from '../input/input.css';
import { passwordToggleButtonStyle } from './password-input.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/** PasswordInput slot isimleri. */
export type PasswordInputSlot = 'root' | 'input' | 'toggleButton';

// ── Context (Compound API) ──────────────────────────

interface PasswordInputContextValue {
  size: InputSize;
  variant: InputVariant;
  disabled: boolean;
  isVisible: boolean;
  toggleVisibility: () => void;
  classNames: ClassNames<PasswordInputSlot> | undefined;
  styles: Styles<PasswordInputSlot> | undefined;
}

const PasswordInputContext = createContext<PasswordInputContextValue | null>(null);

/** PasswordInput compound sub-component context hook. */
export function usePasswordInputContext(): PasswordInputContextValue {
  const ctx = useContext(PasswordInputContext);
  if (!ctx) throw new Error('PasswordInput compound sub-components must be used within <PasswordInput>.');
  return ctx;
}

// ── Compound: PasswordInput.ToggleButton ─────────────

/** PasswordInput.ToggleButton props */
export interface PasswordInputToggleButtonProps {
  /** Goster ikonu / Show icon (password gizliyken gosterilir) */
  showIcon?: ReactNode;
  /** Gizle ikonu / Hide icon (password gorunurken gosterilir) */
  hideIcon?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const PasswordInputToggleButton = forwardRef<HTMLButtonElement, PasswordInputToggleButtonProps>(
  function PasswordInputToggleButton(props, ref) {
    const { showIcon, hideIcon, className } = props;
    const ctx = usePasswordInputContext();

    const TOGGLE_WIDTH_MAP: Record<InputSize, string> = {
      xs: '1.5rem',
      sm: '1.75rem',
      md: '2rem',
      lg: '2.25rem',
      xl: '2.5rem',
    };

    const slot = getSlotProps('toggleButton', passwordToggleButtonStyle, ctx.classNames, ctx.styles, {
      width: TOGGLE_WIDTH_MAP[ctx.size],
      paddingRight: 'var(--rel-spacing-2)',
    });
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const currentShowIcon = showIcon ?? <EyeIcon />;
    const currentHideIcon = hideIcon ?? <EyeOffIcon />;

    return (
      <button
        ref={ref}
        type="button"
        className={cls}
        onClick={ctx.toggleVisibility}
        style={slot.style}
        data-disabled={ctx.disabled ? '' : undefined}
        tabIndex={ctx.disabled ? -1 : 0}
        aria-label={ctx.isVisible ? '\u015Eifreyi gizle' : '\u015Eifreyi g\u00F6ster'}
        data-testid="passwordinput-toggle"
      >
        {ctx.isVisible ? currentHideIcon : currentShowIcon}
      </button>
    );
  },
);

/**
 * PasswordInput bilesen props'lari.
 * PasswordInput component props.
 */
export interface PasswordInputComponentProps extends UsePasswordInputProps, SlotStyleProps<PasswordInputSlot> {
  /** Gorsel varyant / Visual variant */
  variant?: InputVariant;

  /** Boyut / Size */
  size?: InputSize;

  /** Placeholder metni / Placeholder text */
  placeholder?: string;

  /**
   * Goster ikonu / Show icon (password gizliyken gosterilir).
   * Varsayilan: EyeIcon.
   *
   * @example <MyEyeIcon />
   */
  showIcon?: ReactNode;

  /**
   * Gizle ikonu / Hide icon (password gorunurken gosterilir).
   * Varsayilan: EyeOffIcon.
   *
   * @example <MyEyeOffIcon />
   */
  hideIcon?: ReactNode;

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

// ── Size -> toggle buton width/padding map ───────────────────────────

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
 * PasswordInput — RelUI sifre input bileseni (Dual API).
 * PasswordInput — RelUI password input component (Dual API).
 *
 * @example Props-based
 * ```tsx
 * <PasswordInput placeholder="Sifre" />
 * ```
 *
 * @example Compound
 * ```tsx
 * <PasswordInput placeholder="Sifre">
 *   <PasswordInput.ToggleButton />
 * </PasswordInput>
 * ```
 */
const PasswordInputBase = forwardRef<HTMLInputElement, PasswordInputComponentProps>(
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
      children,
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

    // ── Compound API ──
    if (children) {
      const ctxValue: PasswordInputContextValue = {
        size,
        variant,
        disabled: isDisabled,
        isVisible,
        toggleVisibility,
        classNames,
        styles,
      };

      return (
        <PasswordInputContext.Provider value={ctxValue}>
          <div className={rootSlot.className} style={rootSlot.style} data-testid="passwordinput-root">
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
            {children}
          </div>
        </PasswordInputContext.Provider>
      );
    }

    // ── Props-based API ──

    const toggleSlot = getSlotProps('toggleButton', passwordToggleButtonStyle, classNames, styles, {
      width: TOGGLE_WIDTH[size],
      paddingRight: 'var(--rel-spacing-2)',
    });

    // Varsayilan ikonlar / Default icons
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
          aria-label={isVisible ? '\u015Eifreyi gizle' : '\u015Eifreyi g\u00F6ster'}
        >
          {isVisible ? currentHideIcon : currentShowIcon}
        </button>
      </div>
    );
  },
);

/**
 * PasswordInput bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <PasswordInput placeholder="Sifre" />
 * ```
 *
 * @example Compound
 * ```tsx
 * <PasswordInput placeholder="Sifre">
 *   <PasswordInput.ToggleButton />
 * </PasswordInput>
 * ```
 */
export const PasswordInput = Object.assign(PasswordInputBase, {
  ToggleButton: PasswordInputToggleButton,
});
