/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Label — styled React label component (Dual API).
 * Label — stilize edilmis React label bileseni (Dual API).
 *
 * Props-based: `<Label required>E-posta</Label>`
 * Compound:    `<Label><Label.Text>E-posta</Label.Text><Label.RequiredIndicator /></Label>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { LabelSize } from '@relteco/relui-core';
import { labelRecipe, requiredIndicatorStyle } from './label.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** Label slot isimleri. */
export type LabelSlot = 'root' | 'text' | 'requiredIndicator';

// ── Context (Compound API) ──────────────────────────

interface LabelContextValue {
  size: LabelSize;
  required: boolean;
  disabled: boolean;
  classNames: ClassNames<LabelSlot> | undefined;
  styles: Styles<LabelSlot> | undefined;
}

const LabelContext = createContext<LabelContextValue | null>(null);

function useLabelContext(): LabelContextValue {
  const ctx = useContext(LabelContext);
  if (!ctx) throw new Error('Label compound sub-components must be used within <Label>.');
  return ctx;
}

// ── Compound: Label.Text ────────────────────────────

/** Label.Text props */
export interface LabelTextProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const LabelText = forwardRef<HTMLSpanElement, LabelTextProps>(
  function LabelText(props, ref) {
    const { children, className } = props;
    const ctx = useLabelContext();
    const slot = getSlotProps('text', undefined, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}`.trim() : slot.className || undefined;

    return (
      <span
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="label-text"
      >
        {children}
      </span>
    );
  },
);

// ── Compound: Label.RequiredIndicator ───────────────

/** Label.RequiredIndicator props */
export interface LabelRequiredIndicatorProps {
  /** Gosterge karakteri / Indicator character */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const LabelRequiredIndicator = forwardRef<HTMLSpanElement, LabelRequiredIndicatorProps>(
  function LabelRequiredIndicator(props, ref) {
    const { children = '*', className } = props;
    const ctx = useLabelContext();
    const slot = getSlotProps('requiredIndicator', requiredIndicatorStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span
        ref={ref}
        className={cls}
        style={slot.style}
        aria-hidden="true"
        data-testid="label-required"
      >
        {children}
      </span>
    );
  },
);

// ── Component Props ───────────────────────────────────

/**
 * Label bilesen props'lari.
 * Label component props.
 */
export interface LabelComponentProps extends SlotStyleProps<LabelSlot> {
  /** Boyut / Size */
  size?: LabelSize;

  /** Zorunlu alan gostergesi / Required field indicator */
  required?: boolean;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

  /** Hedef form elemani id'si / Target form element id */
  htmlFor?: string;

  /** Ek CSS sinifi / Additional CSS class */
  className?: string;

  /** HTML id */
  id?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;

  /** Icerik / Content */
  children?: ReactNode;
}

// ── Component ─────────────────────────────────────────

const LabelBase = forwardRef<HTMLLabelElement, LabelComponentProps>(function Label(
  {
    size = 'md',
    required = false,
    disabled = false,
    htmlFor,
    className,
    id,
    style: inlineStyle,
    classNames,
    styles,
    children,
  },
  forwardedRef,
) {
  const recipeClass = labelRecipe({ size });
  const rootSlot = getSlotProps('root', recipeClass, classNames, styles, inlineStyle);
  const combinedClassName = className
    ? `${rootSlot.className} ${className}`
    : rootSlot.className;

  const indicatorSlot = getSlotProps('requiredIndicator', requiredIndicatorStyle, classNames, styles);

  const ctxValue: LabelContextValue = { size, required, disabled, classNames, styles };

  return (
    <LabelContext.Provider value={ctxValue}>
      <label
        ref={forwardedRef}
        id={id}
        htmlFor={htmlFor}
        className={combinedClassName}
        style={rootSlot.style}
        data-disabled={disabled ? '' : undefined}
        data-required={required ? '' : undefined}
      >
        {children}
        {required && (
          <span className={indicatorSlot.className} style={indicatorSlot.style} aria-hidden="true">
            *
          </span>
        )}
      </label>
    </LabelContext.Provider>
  );
});

/**
 * Label bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Label htmlFor="email" required>E-posta</Label>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Label htmlFor="email">
 *   <Label.Text>E-posta</Label.Text>
 *   <Label.RequiredIndicator />
 * </Label>
 * ```
 */
export const Label = Object.assign(LabelBase, {
  Text: LabelText,
  RequiredIndicator: LabelRequiredIndicator,
});
