/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Label — styled React label component.
 * Label — stilize edilmiş React label bileşeni.
 *
 * Form elemanları için etiket, opsiyonel zorunlu göstergesi.
 *
 * @packageDocumentation
 */

import { forwardRef } from 'react';
import type { LabelSize } from '@relteco/relui-core';
import { labelRecipe, requiredIndicatorStyle } from './label.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** Label slot isimleri. */
export type LabelSlot = 'root' | 'requiredIndicator';

/**
 * Label bileşen props'ları.
 * Label component props.
 */
export interface LabelComponentProps extends SlotStyleProps<LabelSlot> {
  /** Boyut / Size */
  size?: LabelSize;

  /** Zorunlu alan göstergesi / Required field indicator */
  required?: boolean;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

  /** Hedef form elemanı id'si / Target form element id */
  htmlFor?: string;

  /** Ek CSS sınıfı / Additional CSS class */
  className?: string;

  /** HTML id */
  id?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;

  /** İçerik / Content */
  children?: React.ReactNode;
}

/**
 * Label — RelUI label bileşeni.
 * Label — RelUI label component.
 *
 * @example
 * ```tsx
 * <Label htmlFor="email" required>
 *   E-posta
 * </Label>
 * ```
 */
export const Label = forwardRef<HTMLLabelElement, LabelComponentProps>(function Label(
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

  return (
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
  );
});
