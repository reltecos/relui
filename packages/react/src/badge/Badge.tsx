/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Badge — styled React badge component.
 * Badge — stilize edilmiş React badge bileşeni.
 *
 * Küçük durum göstergesi — pill shape, solid/soft/outline.
 *
 * @packageDocumentation
 */

import { forwardRef } from 'react';
import type { BadgeSize, BadgeColor, BadgeVariant } from '@relteco/relui-core';
import { badgeRecipe } from './badge.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** Badge slot isimleri. */
export type BadgeSlot = 'root';

/**
 * Badge bileşen props'ları.
 * Badge component props.
 */
export interface BadgeComponentProps extends SlotStyleProps<BadgeSlot> {
  /** Boyut / Size */
  size?: BadgeSize;

  /** Renk şeması / Color scheme */
  color?: BadgeColor;

  /** Görünüm varyantı / Visual variant */
  variant?: BadgeVariant;

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
 * Badge — RelUI badge bileşeni.
 * Badge — RelUI badge component.
 *
 * @example
 * ```tsx
 * <Badge color="success">Aktif</Badge>
 * <Badge variant="outline" color="destructive">Hata</Badge>
 * <Badge variant="soft" color="warning" size="sm">Beklemede</Badge>
 * ```
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeComponentProps>(function Badge(
  {
    size = 'md',
    color = 'accent',
    variant = 'solid',
    className,
    id,
    style: inlineStyle,
    classNames,
    styles,
    children,
  },
  forwardedRef,
) {
  const recipeClass = badgeRecipe({ size, color, variant });
  const rootSlot = getSlotProps('root', recipeClass, classNames, styles, inlineStyle);
  const combinedClassName = className
    ? `${rootSlot.className} ${className}`
    : rootSlot.className;

  return (
    <span
      ref={forwardedRef}
      id={id}
      className={combinedClassName}
      style={rootSlot.style}
    >
      {children}
    </span>
  );
});
