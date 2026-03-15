/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FormGroup — styled React form group (fieldset) bilesen (Dual API).
 * FormGroup — styled React form group (fieldset) component (Dual API).
 *
 * Props-based: `<FormGroup legend="Kisisel Bilgiler"><Input /></FormGroup>`
 * Compound:    `<FormGroup><FormGroup.Legend>Kisisel Bilgiler</FormGroup.Legend><FormGroup.Content>...</FormGroup.Content></FormGroup>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { LabelSize, FormGroupOrientation } from '@relteco/relui-core';
import {
  formGroupRecipe,
  legendRecipe,
  formGroupDisabledStyle,
} from './form-group.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/** FormGroup slot isimleri. */
export type FormGroupSlot = 'root' | 'legend' | 'content';

// ── Context (Compound API) ──────────────────────────

interface FormGroupContextValue {
  orientation: FormGroupOrientation;
  size: LabelSize;
  disabled: boolean;
  classNames: ClassNames<FormGroupSlot> | undefined;
  styles: Styles<FormGroupSlot> | undefined;
}

const FormGroupContext = createContext<FormGroupContextValue | null>(null);

function useFormGroupContext(): FormGroupContextValue {
  const ctx = useContext(FormGroupContext);
  if (!ctx) throw new Error('FormGroup compound sub-components must be used within <FormGroup>.');
  return ctx;
}

// ── Compound: FormGroup.Legend ──────────────────────

/** FormGroup.Legend props */
export interface FormGroupLegendProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const FormGroupLegend = forwardRef<HTMLLegendElement, FormGroupLegendProps>(
  function FormGroupLegend(props, ref) {
    const { children, className } = props;
    const ctx = useFormGroupContext();
    const legendRecipeClass = legendRecipe({ size: ctx.size });
    const slot = getSlotProps('legend', legendRecipeClass, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <legend ref={ref} className={cls} style={slot.style} data-testid="form-group-legend">
        {children}
      </legend>
    );
  },
);

// ── Compound: FormGroup.Content ────────────────────

/** FormGroup.Content props */
export interface FormGroupContentProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const FormGroupContent = forwardRef<HTMLDivElement, FormGroupContentProps>(
  function FormGroupContent(props, ref) {
    const { children, className } = props;
    const ctx = useFormGroupContext();
    const slot = getSlotProps('content', undefined, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}`.trim() : slot.className || undefined;

    return (
      <div ref={ref} className={cls || undefined} style={slot.style} data-testid="form-group-content">
        {children}
      </div>
    );
  },
);

// ── Component Props ──────────────────────────────────

/**
 * FormGroup bilesen props.
 * FormGroup component props.
 */
export interface FormGroupComponentProps extends SlotStyleProps<FormGroupSlot> {
  /** Grup basligi (legend) / Group legend */
  legend?: string;

  /** Yerlesim yonu / Layout orientation */
  orientation?: FormGroupOrientation;

  /** Boyut / Size */
  size?: LabelSize;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

  /** Ek CSS sinifi / Additional CSS class */
  className?: string;

  /** HTML id */
  id?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;

  /** Icerik (FormField lar) / Content (FormFields) */
  children?: ReactNode;
}

// ── Component ────────────────────────────────────────

const FormGroupBase = forwardRef<HTMLFieldSetElement, FormGroupComponentProps>(
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

    const ctxValue: FormGroupContextValue = { orientation, size, disabled, classNames, styles };

    // ── Compound API icin context saglayici ──
    // Hem props-based hem compound API desteklenir.
    // Props-based API'de legend prop ile calisan eski davranis korunur.
    return (
      <FormGroupContext.Provider value={ctxValue}>
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
      </FormGroupContext.Provider>
    );
  },
);

/**
 * FormGroup bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <FormGroup legend="Kisisel Bilgiler">
 *   <FormField label="Ad"><Input /></FormField>
 * </FormGroup>
 * ```
 *
 * @example Compound
 * ```tsx
 * <FormGroup>
 *   <FormGroup.Legend>Kisisel Bilgiler</FormGroup.Legend>
 *   <FormGroup.Content>
 *     <FormField label="Ad"><Input /></FormField>
 *   </FormGroup.Content>
 * </FormGroup>
 * ```
 */
export const FormGroup = Object.assign(FormGroupBase, {
  Legend: FormGroupLegend,
  Content: FormGroupContent,
});
