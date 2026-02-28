/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Button — styled React button component.
 * Button — stilize edilmiş React buton bileşeni.
 *
 * 5 varyant × 5 renk × 5 boyut destekler. Vanilla Extract + CSS Variables
 * ile tam tema desteği. WAI-ARIA Button pattern uyumlu.
 *
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';
import type { ButtonVariant, ButtonSize, ButtonColor } from '@relteco/relui-core';
import { useButton, type UseButtonProps } from './useButton';
import { buttonRecipe, spinnerStyle, iconStyle } from './button.css';
import { useButtonGroupContext } from '../button-group/ButtonGroupContext';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** Button slot isimleri. */
export type ButtonSlot = 'root' | 'spinner' | 'leftIcon' | 'rightIcon';

/**
 * Button bileşen props'ları.
 * Button component props.
 */
export interface ButtonProps extends UseButtonProps, SlotStyleProps<ButtonSlot> {
  /** Buton içeriği / Button content */
  children?: ReactNode;

  /** Görsel varyant / Visual variant */
  variant?: ButtonVariant;

  /** Boyut / Size */
  size?: ButtonSize;

  /** Renk şeması / Color scheme */
  color?: ButtonColor;

  /** Tam genişlik / Full width */
  fullWidth?: boolean;

  /** Sol ikon / Left icon */
  leftIcon?: ReactNode;

  /** Sağ ikon / Right icon */
  rightIcon?: ReactNode;

  /** Yüklenme metni / Loading text (shown instead of children while loading) */
  loadingText?: string;

  /** Ek CSS sınıfı / Additional CSS class */
  className?: string;

  /** HTML id */
  id?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;
}

/**
 * Button — RelUI buton bileşeni.
 * Button — RelUI button component.
 *
 * Tüm varyant, boyut ve renk kombinasyonlarını destekler.
 * Loading, disabled, icon, fullWidth özellikleri dahil.
 *
 * @example
 * ```tsx
 * <Button variant="solid" color="accent" size="md">
 *   Kaydet
 * </Button>
 *
 * <Button variant="outline" color="destructive" loading>
 *   Siliniyor...
 * </Button>
 *
 * <Button variant="ghost" leftIcon={<SearchIcon />}>
 *   Ara
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant: variantProp,
    size: sizeProp,
    color: colorProp,
    fullWidth = false,
    leftIcon,
    rightIcon,
    loadingText,
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

  const recipeClass = buttonRecipe({ variant, size, color, fullWidth: fullWidth || undefined });
  const rootSlot = getSlotProps('root', recipeClass, classNames, styles, inlineStyle);
  const combinedClassName = className
    ? `${rootSlot.className} ${className}`
    : rootSlot.className;

  const spinnerSlot = getSlotProps('spinner', spinnerStyle, classNames, styles);
  const leftIconSlot = getSlotProps('leftIcon', iconStyle, classNames, styles);
  const rightIconSlot = getSlotProps('rightIcon', iconStyle, classNames, styles);

  // Loading durumda spinner göster
  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <span
            className={spinnerSlot.className}
            style={spinnerSlot.style}
            aria-hidden="true"
          />
          {loadingText ?? children}
        </>
      );
    }

    return (
      <>
        {leftIcon ? (
          <span
            className={leftIconSlot.className}
            style={leftIconSlot.style}
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        ) : null}
        {children}
        {rightIcon ? (
          <span
            className={rightIconSlot.className}
            style={rightIconSlot.style}
            aria-hidden="true"
          >
            {rightIcon}
          </span>
        ) : null}
      </>
    );
  };

  return (
    <button
      {...buttonProps}
      ref={forwardedRef}
      id={id}
      className={combinedClassName}
      style={rootSlot.style}
    >
      {renderContent()}
    </button>
  );
});
