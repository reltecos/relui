/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MaskedInput — styled React masked input component (Dual API).
 * MaskedInput — stilize edilmis React maskeli input bileseni (Dual API).
 *
 * Props-based: `<MaskedInput mask="(###) ### ## ##" />`
 * Compound:    `<MaskedInput mask="(###) ### ## ##"><MaskedInput.Field /></MaskedInput>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type {
  MaskedInputVariant,
  MaskedInputSize,
} from '@relteco/relui-core';
import { useMaskedInput, type UseMaskedInputProps } from './useMaskedInput';
import { inputRecipe } from './masked-input.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';
import type { ClassNames, Styles } from '../utils/slot-styles';

/** MaskedInput slot isimleri. */
export type MaskedInputSlot = 'root';

// ── Context (Compound API) ──────────────────────────

interface MaskedInputContextValue {
  variant: MaskedInputVariant;
  size: MaskedInputSize;
  classNames: ClassNames<MaskedInputSlot> | undefined;
  styles: Styles<MaskedInputSlot> | undefined;
  hookReturn: ReturnType<typeof useMaskedInput>;
}

const MaskedInputContext = createContext<MaskedInputContextValue | null>(null);

/** MaskedInput compound context hook. */
export function useMaskedInputContext(): MaskedInputContextValue {
  const ctx = useContext(MaskedInputContext);
  if (!ctx) throw new Error('MaskedInput compound sub-components must be used within <MaskedInput>.');
  return ctx;
}

// ── Compound: MaskedInput.Field ─────────────────────

/** MaskedInput.Field props */
export interface MaskedInputFieldProps {
  /** Ek className / Additional className */
  className?: string;
  /** Inline stil / Inline style */
  style?: React.CSSProperties;
}

const MaskedInputField = forwardRef<HTMLInputElement, MaskedInputFieldProps>(
  function MaskedInputField(props, ref) {
    const { className, style: styleProp } = props;
    const ctx = useMaskedInputContext();

    const recipeClass = inputRecipe({ variant: ctx.variant, size: ctx.size });
    const rootSlot = getSlotProps('root', recipeClass, ctx.classNames, ctx.styles, styleProp);
    const combinedClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    return (
      <input
        {...ctx.hookReturn.inputProps}
        ref={ref}
        className={combinedClassName}
        style={rootSlot.style}
        placeholder={ctx.hookReturn.placeholder}
        data-testid="masked-input-field"
      />
    );
  },
);

/**
 * MaskedInput bilesen props'lari.
 * MaskedInput component props.
 */
export interface MaskedInputComponentProps extends UseMaskedInputProps, SlotStyleProps<MaskedInputSlot> {
  /** Gorsel varyant / Visual variant */
  variant?: MaskedInputVariant;

  /** Boyut / Size */
  size?: MaskedInputSize;

  /** Placeholder metni (varsayilan: mask placeholder) / Placeholder text */
  placeholder?: string;

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

// ── Component ─────────────────────────────────────────

const MaskedInputBase = forwardRef<HTMLInputElement, MaskedInputComponentProps>(
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
      children,
      ...hookProps
    },
    forwardedRef,
  ) {
    const hookReturn = useMaskedInput(hookProps);
    const {
      inputProps,
      placeholder: maskPlaceholder,
    } = hookReturn;

    // ── Compound API ──
    if (children) {
      const ctxValue: MaskedInputContextValue = {
        variant,
        size,
        classNames,
        styles,
        hookReturn,
      };

      return (
        <MaskedInputContext.Provider value={ctxValue}>
          {children}
        </MaskedInputContext.Provider>
      );
    }

    // ── Props-based API ──
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
        data-testid="masked-input-field"
      />
    );
  },
);

/**
 * MaskedInput bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <MaskedInput mask="(###) ### ## ##" onValueChange={(raw) => setPhone(raw)} aria-label="Telefon" />
 * ```
 *
 * @example Compound
 * ```tsx
 * <MaskedInput mask="(###) ### ## ##">
 *   <MaskedInput.Field />
 * </MaskedInput>
 * ```
 */
export const MaskedInput = Object.assign(MaskedInputBase, {
  Field: MaskedInputField,
});
