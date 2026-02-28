/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Tag — styled React tag component.
 * Tag — stilize edilmiş React tag bileşeni.
 *
 * Etiket / kategorileme bileşeni — opsiyonel kaldırma butonu.
 *
 * @packageDocumentation
 */

import { forwardRef } from 'react';
import type { TagSize, TagColor, TagVariant } from '@relteco/relui-core';
import { CloseIcon } from '@relteco/relui-icons';
import { tagRecipe, tagRemoveButtonStyle } from './tag.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** Tag slot isimleri. */
export type TagSlot = 'root' | 'removeButton';

/**
 * Tag bileşen props'ları.
 * Tag component props.
 */
export interface TagComponentProps extends SlotStyleProps<TagSlot> {
  /** Boyut / Size */
  size?: TagSize;

  /** Renk şeması / Color scheme */
  color?: TagColor;

  /** Görünüm varyantı / Visual variant */
  variant?: TagVariant;

  /** Kaldırılabilir mi / Is removable */
  removable?: boolean;

  /** Kaldırma callback'i / Remove callback */
  onRemove?: () => void;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

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
 * Tag — RelUI tag bileşeni.
 * Tag — RelUI tag component.
 *
 * @example
 * ```tsx
 * <Tag color="success">React</Tag>
 * <Tag removable onRemove={() => handleRemove('ts')}>TypeScript</Tag>
 * ```
 */
export const Tag = forwardRef<HTMLSpanElement, TagComponentProps>(function Tag(
  {
    size = 'md',
    color = 'accent',
    variant = 'soft',
    removable = false,
    onRemove,
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
  const recipeClass = tagRecipe({ size, color, variant });
  const rootSlot = getSlotProps('root', recipeClass, classNames, styles, inlineStyle);
  const combinedClassName = className
    ? `${rootSlot.className} ${className}`
    : rootSlot.className;

  const removeBtnSlot = getSlotProps('removeButton', tagRemoveButtonStyle, classNames, styles);

  return (
    <span
      ref={forwardedRef}
      id={id}
      className={combinedClassName}
      style={rootSlot.style}
      data-disabled={disabled ? '' : undefined}
    >
      {children}
      {removable && (
        <button
          type="button"
          className={removeBtnSlot.className}
          style={removeBtnSlot.style}
          onClick={onRemove}
          disabled={disabled}
          aria-label="Kaldır"
          tabIndex={disabled ? -1 : 0}
        >
          <CloseIcon size="0.75em" />
        </button>
      )}
    </span>
  );
});
