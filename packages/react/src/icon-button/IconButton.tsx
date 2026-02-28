/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * IconButton — kare, sadece ikon içeren buton bileşeni.
 * IconButton — square, icon-only button component.
 *
 * Button bileşenini temel alır, kare boyutlandırma ve zorunlu
 * aria-label ile erişilebilirlik sağlar.
 *
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';
import type { ButtonVariant, ButtonSize, ButtonColor } from '@relteco/relui-core';
import { useButton, type UseButtonProps } from '../button/useButton';
import { buttonRecipe, spinnerStyle } from '../button/button.css';
import { iconButtonSizeRecipe } from './icon-button.css';
import { useButtonGroupContext } from '../button-group/ButtonGroupContext';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** IconButton slot isimleri. */
export type IconButtonSlot = 'root' | 'spinner' | 'icon';

/**
 * IconButton bileşen props'ları.
 * IconButton component props.
 */
export interface IconButtonComponentProps extends UseButtonProps, SlotStyleProps<IconButtonSlot> {
  /** İkon / Icon (required) */
  icon: ReactNode;

  /** Görsel varyant / Visual variant */
  variant?: ButtonVariant;

  /** Boyut / Size */
  size?: ButtonSize;

  /** Renk şeması / Color scheme */
  color?: ButtonColor;

  /**
   * Erişilebilirlik etiketi — ZORUNLU.
   * Accessibility label — REQUIRED.
   */
  'aria-label': string;

  /** Ek CSS sınıfı / Additional CSS class */
  className?: string;

  /** HTML id */
  id?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;
}

/**
 * IconButton — RelUI ikon buton bileşeni.
 * IconButton — RelUI icon button component.
 *
 * Kare boyutlu, sadece ikon içerir. aria-label zorunludur.
 * Button'ın tüm variant ve color desteğini taşır.
 *
 * @example
 * ```tsx
 * <IconButton
 *   icon={<SearchIcon />}
 *   aria-label="Ara"
 *   variant="ghost"
 *   size="md"
 * />
 *
 * <IconButton
 *   icon={<TrashIcon />}
 *   aria-label="Sil"
 *   variant="solid"
 *   color="destructive"
 *   loading
 * />
 * ```
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonComponentProps>(
  function IconButton(
    {
      icon,
      variant: variantProp,
      size: sizeProp,
      color: colorProp,
      'aria-label': ariaLabel,
      className,
      id,
      style: inlineStyle,
      classNames,
      styles,
      disabled: disabledProp,
      ...restHookProps
    },
    forwardedRef,
  ) {
    // ButtonGroup context — grup varsa grup props'ları override eder
    const groupCtx = useButtonGroupContext();

    const variant = groupCtx?.variant ?? variantProp ?? 'solid';
    const size = groupCtx?.size ?? sizeProp ?? 'md';
    const color = groupCtx?.color ?? colorProp ?? 'accent';
    const disabled = groupCtx?.disabled ?? disabledProp;

    const { buttonProps, isLoading } = useButton({ ...restHookProps, disabled });

    const baseClass = buttonRecipe({ variant, size, color });
    const squareClass = iconButtonSizeRecipe({ size });
    const veRootClass = `${baseClass} ${squareClass}`;
    const rootSlot = getSlotProps('root', veRootClass, classNames, styles, inlineStyle);
    const combinedClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const spinnerSlot = getSlotProps('spinner', spinnerStyle, classNames, styles);
    const iconSlot = getSlotProps('icon', undefined, classNames, styles);

    return (
      <button
        {...buttonProps}
        ref={forwardedRef}
        id={id}
        className={combinedClassName}
        style={rootSlot.style}
        aria-label={ariaLabel}
      >
        {isLoading ? (
          <span
            className={spinnerSlot.className}
            style={spinnerSlot.style}
            aria-hidden="true"
          />
        ) : (
          <span
            className={iconSlot.className || undefined}
            style={iconSlot.style}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
      </button>
    );
  },
);
