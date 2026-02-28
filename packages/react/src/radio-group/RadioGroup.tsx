/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * RadioGroup — radio'ları gruplayan compound component.
 * RadioGroup — compound component that groups radios.
 *
 * Context üzerinden child Radio'lara ortak
 * name/size/color/disabled/value props aktarır.
 *
 * @packageDocumentation
 */

import { forwardRef, useMemo, type ReactNode } from 'react';
import type {
  RadioSize,
  RadioColor,
  RadioGroupOrientation,
  RadioGroupContext,
} from '@relteco/relui-core';
import { RadioGroupProvider } from './RadioGroupContext';
import {
  radioGroupBaseStyle,
  radioGroupHorizontalStyle,
  radioGroupVerticalStyle,
} from './radio-group.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** RadioGroup slot isimleri. */
export type RadioGroupSlot = 'root';

/**
 * RadioGroup bileşen props'ları.
 * RadioGroup component props.
 */
export interface RadioGroupComponentProps extends SlotStyleProps<RadioGroupSlot> {
  /** Çocuk bileşenler / Child components */
  children: ReactNode;

  /** Yön / Orientation */
  orientation?: RadioGroupOrientation;

  /** Ortak boyut / Shared size */
  size?: RadioSize;

  /** Ortak renk / Shared color */
  color?: RadioColor;

  /** Grup ismi / Group name (form entegrasyonu) */
  name?: string;

  /** Seçili değer / Selected value */
  value?: string;

  /** Değer değiştiğinde / On value change */
  onValueChange?: (value: string) => void;

  /** Tüm radio'ları devre dışı bırak / Disable all radios */
  disabled?: boolean;

  /** Salt okunur / Read-only */
  readOnly?: boolean;

  /** Geçersiz / Invalid */
  invalid?: boolean;

  /** Zorunlu / Required */
  required?: boolean;

  /** WAI-ARIA role label / WAI-ARIA role label */
  'aria-label'?: string;

  /** aria-labelledby */
  'aria-labelledby'?: string;

  /** Ek CSS sınıfı / Additional CSS class */
  className?: string;

  /** HTML id */
  id?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;
}

/**
 * RadioGroup — RelUI radio grubu bileşeni.
 * RadioGroup — RelUI radio group component.
 *
 * Birden fazla Radio'yu mantıksal olarak gruplar.
 * Ortak name/size/color context sağlar ve tek seçim yönetir.
 *
 * @example
 * ```tsx
 * <RadioGroup value={selected} onValueChange={setSelected} name="plan">
 *   <Radio value="free">Ücretsiz</Radio>
 *   <Radio value="pro">Pro</Radio>
 *   <Radio value="enterprise">Enterprise</Radio>
 * </RadioGroup>
 *
 * <RadioGroup orientation="horizontal" size="sm" color="success">
 *   <Radio value="yes">Evet</Radio>
 *   <Radio value="no">Hayır</Radio>
 * </RadioGroup>
 * ```
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupComponentProps>(
  function RadioGroup(
    {
      children,
      orientation = 'vertical',
      size,
      color,
      name,
      value,
      onValueChange,
      disabled,
      readOnly,
      invalid,
      required,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      className,
      id,
      style: inlineStyle,
      classNames,
      styles,
    },
    forwardedRef,
  ) {
    const contextValue = useMemo<RadioGroupContext>(
      () => ({
        size,
        color,
        name,
        value,
        disabled,
        readOnly,
        invalid,
        onValueChange,
      }),
      [size, color, name, value, disabled, readOnly, invalid, onValueChange],
    );

    const rootSlot = getSlotProps('root', undefined, classNames, styles, inlineStyle);
    const classes = [
      radioGroupBaseStyle,
      orientation === 'horizontal' ? radioGroupHorizontalStyle : radioGroupVerticalStyle,
      rootSlot.className || undefined,
      className,
    ];
    const combinedClassName = classes.filter(Boolean).join(' ');

    return (
      <RadioGroupProvider value={contextValue}>
        <div
          ref={forwardedRef}
          role="radiogroup"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-required={required ? true : undefined}
          aria-invalid={invalid ? true : undefined}
          id={id}
          className={combinedClassName}
          style={rootSlot.style}
        >
          {children}
        </div>
      </RadioGroupProvider>
    );
  },
);
