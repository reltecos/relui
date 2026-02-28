/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Chip — styled React chip component.
 * Chip — stilize edilmiş React chip bileşeni.
 *
 * Seçilebilir/kaldırılabilir kompakt eleman.
 *
 * @packageDocumentation
 */

import { forwardRef, useCallback } from 'react';
import type { ChipSize, ChipColor } from '@relteco/relui-core';
import { CloseIcon } from '@relteco/relui-icons';
import { chipRecipe, chipRemoveButtonStyle } from './chip.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** Chip slot isimleri. */
export type ChipSlot = 'root' | 'removeButton';

/**
 * Chip bileşen props'ları.
 * Chip component props.
 */
export interface ChipComponentProps extends SlotStyleProps<ChipSlot> {
  /** Boyut / Size */
  size?: ChipSize;

  /** Renk şeması / Color scheme */
  color?: ChipColor;

  /** Seçili durumu / Selected state */
  selected?: boolean;

  /** Seçim callback'i / Selection callback */
  onSelectedChange?: (selected: boolean) => void;

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
 * Chip — RelUI chip bileşeni.
 * Chip — RelUI chip component.
 *
 * @example
 * ```tsx
 * <Chip selected={isActive} onSelectedChange={setIsActive}>
 *   Filtre
 * </Chip>
 *
 * <Chip removable onRemove={handleRemove}>
 *   Seçili öğe
 * </Chip>
 * ```
 */
export const Chip = forwardRef<HTMLButtonElement, ChipComponentProps>(function Chip(
  {
    size = 'md',
    color = 'accent',
    selected = false,
    onSelectedChange,
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
  const recipeClass = chipRecipe({ size, color, selected });
  const rootSlot = getSlotProps('root', recipeClass, classNames, styles, inlineStyle);
  const combinedClassName = className
    ? `${rootSlot.className} ${className}`
    : rootSlot.className;

  const removeBtnSlot = getSlotProps('removeButton', chipRemoveButtonStyle, classNames, styles);

  const handleClick = useCallback(() => {
    if (disabled) return;
    onSelectedChange?.(!selected);
  }, [disabled, selected, onSelectedChange]);

  const handleRemoveClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      if (disabled) return;
      onRemove?.();
    },
    [disabled, onRemove],
  );

  return (
    <button
      ref={forwardedRef}
      type="button"
      id={id}
      className={combinedClassName}
      style={rootSlot.style}
      onClick={handleClick}
      disabled={disabled}
      data-selected={selected ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      aria-pressed={selected}
      role="option"
      aria-selected={selected}
    >
      {children}
      {removable && (
        <span
          role="button"
          tabIndex={disabled ? -1 : 0}
          className={removeBtnSlot.className}
          style={removeBtnSlot.style}
          onClick={handleRemoveClick}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleRemoveClick(e as unknown as React.MouseEvent); }}
          aria-label="Kaldır"
        >
          <CloseIcon size="0.75em" />
        </span>
      )}
    </button>
  );
});
