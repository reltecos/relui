/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ButtonGroup — butonları gruplayan compound component.
 * ButtonGroup — compound component that groups buttons.
 *
 * Context üzerinden child Button/IconButton'lara ortak
 * variant/size/color/disabled props aktarır.
 *
 * @packageDocumentation
 */

import { forwardRef, useMemo, type ReactNode } from 'react';
import type {
  ButtonVariant,
  ButtonSize,
  ButtonColor,
  ButtonGroupOrientation,
  ButtonGroupContext,
} from '@relteco/relui-core';
import { ButtonGroupProvider } from './ButtonGroupContext';
import {
  baseStyle,
  horizontalStyle,
  verticalStyle,
  gappedStyle,
  attachedBaseStyle,
  attachedHorizontalStyle,
  attachedVerticalStyle,
} from './button-group.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** ButtonGroup slot isimleri. */
export type ButtonGroupSlot = 'root';

/**
 * ButtonGroup bileşen props'ları.
 * ButtonGroup component props.
 */
export interface ButtonGroupComponentProps extends SlotStyleProps<ButtonGroupSlot> {
  /** Çocuk bileşenler / Child components */
  children: ReactNode;

  /** Yön / Orientation */
  orientation?: ButtonGroupOrientation;

  /** Ortak boyut / Shared size */
  size?: ButtonSize;

  /** Ortak varyant / Shared variant */
  variant?: ButtonVariant;

  /** Ortak renk / Shared color */
  color?: ButtonColor;

  /** Yapışık mod / Attached mode */
  attached?: boolean;

  /** Tüm butonları devre dışı bırak / Disable all buttons */
  disabled?: boolean;

  /** WAI-ARIA role label / WAI-ARIA role label */
  'aria-label'?: string;

  /** Ek CSS sınıfı / Additional CSS class */
  className?: string;

  /** HTML id */
  id?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;
}

/**
 * ButtonGroup — RelUI buton grubu bileşeni.
 * ButtonGroup — RelUI button group component.
 *
 * Birden fazla Button/IconButton'ı mantıksal olarak gruplar.
 * Ortak variant/size/color context sağlar.
 *
 * @example
 * ```tsx
 * <ButtonGroup variant="outline" size="sm">
 *   <Button>Sol</Button>
 *   <Button>Orta</Button>
 *   <Button>Sağ</Button>
 * </ButtonGroup>
 *
 * <ButtonGroup attached variant="solid" color="accent">
 *   <IconButton icon={<BoldIcon />} aria-label="Kalın" />
 *   <IconButton icon={<ItalicIcon />} aria-label="İtalik" />
 *   <IconButton icon={<UnderlineIcon />} aria-label="Altı çizili" />
 * </ButtonGroup>
 * ```
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupComponentProps>(
  function ButtonGroup(
    {
      children,
      orientation = 'horizontal',
      size,
      variant,
      color,
      attached = false,
      disabled,
      'aria-label': ariaLabel,
      className,
      id,
      style: inlineStyle,
      classNames,
      styles,
    },
    forwardedRef,
  ) {
    const contextValue = useMemo<ButtonGroupContext>(
      () => ({
        size,
        variant,
        color,
        disabled,
      }),
      [size, variant, color, disabled],
    );

    const rootSlot = getSlotProps('root', undefined, classNames, styles, inlineStyle);
    const classes = [
      baseStyle,
      orientation === 'horizontal' ? horizontalStyle : verticalStyle,
      attached ? attachedBaseStyle : gappedStyle,
      attached && orientation === 'horizontal' ? attachedHorizontalStyle : undefined,
      attached && orientation === 'vertical' ? attachedVerticalStyle : undefined,
      rootSlot.className || undefined,
      className,
    ];
    const combinedClassName = classes.filter(Boolean).join(' ');

    return (
      <ButtonGroupProvider value={contextValue}>
        <div
          ref={forwardedRef}
          role="group"
          aria-label={ariaLabel}
          id={id}
          className={combinedClassName}
          style={rootSlot.style}
        >
          {children}
        </div>
      </ButtonGroupProvider>
    );
  },
);
