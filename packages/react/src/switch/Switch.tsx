/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Switch — styled React switch (toggle) component.
 * Switch — stilize edilmiş React switch (toggle) bileşeni.
 *
 * Hidden native input + custom visual pill + knob pattern.
 * 3 boyut × 5 renk, label ile birlikte kullanılır.
 *
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';
import type { SwitchSize, SwitchColor } from '@relteco/relui-core';
import { useSwitch, type UseSwitchProps } from './useSwitch';
import {
  switchTrackRecipe,
  switchKnobStyle,
  switchLabelStyle,
  hiddenSwitchInputStyle,
} from './switch.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** Switch slot isimleri. */
export type SwitchSlot = 'root' | 'track' | 'knob' | 'label';

/**
 * Switch bileşen props'ları.
 * Switch component props.
 */
export interface SwitchComponentProps extends UseSwitchProps, SlotStyleProps<SwitchSlot> {
  /** Boyut / Size */
  size?: SwitchSize;

  /** Renk şeması / Color scheme */
  color?: SwitchColor;

  /** Label metni veya ReactNode / Label text or ReactNode */
  children?: ReactNode;

  /** Ek CSS sınıfı / Additional CSS class */
  className?: string;

  /** HTML id */
  id?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;

  /** aria-label (label yoksa zorunlu) */
  'aria-label'?: string;

  /** aria-labelledby */
  'aria-labelledby'?: string;

  /** aria-describedby */
  'aria-describedby'?: string;
}

/**
 * Knob boyutu map / Knob size map.
 */
const KNOB_SIZE: Record<SwitchSize, string> = {
  sm: '0.75rem',
  md: '1rem',
  lg: '1.25rem',
};

/**
 * Switch label font size map.
 */
const LABEL_FONT_SIZE: Record<SwitchSize, string> = {
  sm: 'var(--rel-text-xs)',
  md: 'var(--rel-text-sm)',
  lg: 'var(--rel-text-base)',
};

/**
 * Switch — RelUI switch (toggle) bileşeni.
 * Switch — RelUI switch (toggle) component.
 *
 * @example
 * ```tsx
 * <Switch>Karanlık mod</Switch>
 *
 * <Switch
 *   checked={isDark}
 *   onCheckedChange={setIsDark}
 *   color="success"
 * >
 *   Bildirimler açık
 * </Switch>
 * ```
 */
export const Switch = forwardRef<HTMLDivElement, SwitchComponentProps>(function Switch(
  {
    size = 'md',
    color = 'accent',
    children,
    className,
    id,
    style: inlineStyle,
    classNames,
    styles,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    name,
    value,
    ...hookProps
  },
  forwardedRef,
) {
  const { trackProps, checked, isDisabled } = useSwitch(hookProps);

  const trackClassName = switchTrackRecipe({ size, color });
  const trackSlot = getSlotProps('track', trackClassName, classNames, styles);
  const knobSlot = getSlotProps('knob', switchKnobStyle, classNames, styles, {
    width: KNOB_SIZE[size],
    height: KNOB_SIZE[size],
  });

  // Hidden native input — form entegrasyonu için
  const hiddenInput = name ? (
    <input
      className={hiddenSwitchInputStyle}
      type="checkbox"
      name={name}
      value={value ?? 'on'}
      checked={checked}
      disabled={isDisabled}
      readOnly
      tabIndex={-1}
      aria-hidden="true"
    />
  ) : null;

  // Track (pill) — visual switch
  const track = (
    <div
      {...trackProps}
      className={trackSlot.className}
      style={trackSlot.style}
      aria-label={!children ? ariaLabel : undefined}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      <span
        className={knobSlot.className}
        style={knobSlot.style}
      />
    </div>
  );

  // Label yoksa sadece track döndür
  if (!children) {
    const rootSlot = getSlotProps('root', undefined, classNames, styles, {
      display: 'inline-flex',
      ...inlineStyle,
    });
    const rootClass = className
      ? `${rootSlot.className} ${className}`.trim()
      : rootSlot.className || undefined;

    return (
      <div
        ref={forwardedRef}
        id={id}
        className={rootClass}
        style={rootSlot.style}
      >
        {hiddenInput}
        {track}
      </div>
    );
  }

  // Label varsa wrapper ile döndür
  const rootSlot = getSlotProps('root', switchLabelStyle, classNames, styles, {
    fontSize: LABEL_FONT_SIZE[size],
    ...inlineStyle,
  });
  const rootClass = className
    ? `${rootSlot.className} ${className}`
    : rootSlot.className;
  const labelSlot = getSlotProps('label', undefined, classNames, styles);

  return (
    <label
      ref={forwardedRef as React.Ref<HTMLLabelElement>}
      id={id}
      className={rootClass}
      style={rootSlot.style}
      data-disabled={isDisabled ? '' : undefined}
    >
      {hiddenInput}
      {track}
      <span className={labelSlot.className || undefined} style={labelSlot.style}>{children}</span>
    </label>
  );
});
