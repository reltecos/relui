/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Radio — styled React radio component.
 * Radio — stilize edilmiş React radio bileşeni.
 *
 * Hidden native input + custom visual circle pattern.
 * 3 boyut × 5 renk, RadioGroup ile birlikte kullanılır.
 *
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';
import type { RadioSize, RadioColor } from '@relteco/relui-core';
import { useRadio, type UseRadioProps } from './useRadio';
import { useRadioGroupContext } from '../radio-group/RadioGroupContext';
import {
  radioControlRecipe,
  radioDotStyle,
  radioLabelStyle,
  hiddenRadioInputStyle,
} from './radio.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** Radio slot isimleri. */
export type RadioSlot = 'root' | 'control' | 'dot' | 'label';

/**
 * Radio bileşen props'ları.
 * Radio component props.
 */
export interface RadioComponentProps extends UseRadioProps, SlotStyleProps<RadioSlot> {
  /** Boyut / Size */
  size?: RadioSize;

  /** Renk şeması / Color scheme */
  color?: RadioColor;

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
 * Dot boyutu map / Dot size map.
 */
const DOT_SIZE: Record<RadioSize, string> = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.625rem',
};

/**
 * Radio label font size map.
 */
const LABEL_FONT_SIZE: Record<RadioSize, string> = {
  sm: 'var(--rel-text-xs)',
  md: 'var(--rel-text-sm)',
  lg: 'var(--rel-text-base)',
};

/**
 * Radio — RelUI radio bileşeni.
 * Radio — RelUI radio component.
 *
 * RadioGroup içinde veya bağımsız kullanılabilir.
 * RadioGroup context'inden size/color/name/value devralır.
 *
 * @example
 * ```tsx
 * <RadioGroup value={selected} onValueChange={setSelected}>
 *   <Radio value="a">Seçenek A</Radio>
 *   <Radio value="b">Seçenek B</Radio>
 *   <Radio value="c">Seçenek C</Radio>
 * </RadioGroup>
 *
 * <Radio value="standalone" aria-label="Bağımsız radio" />
 * ```
 */
export const Radio = forwardRef<HTMLDivElement, RadioComponentProps>(function Radio(
  {
    size: sizeProp,
    color: colorProp,
    children,
    className,
    id,
    style: inlineStyle,
    classNames,
    styles,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    ...hookProps
  },
  forwardedRef,
) {
  // RadioGroup context'inden size/color al
  const groupCtx = useRadioGroupContext();
  const size = sizeProp ?? groupCtx?.size ?? 'md';
  const color = colorProp ?? groupCtx?.color ?? 'accent';

  const { controlProps, checked, isDisabled, name } = useRadio(hookProps);

  const controlClassName = radioControlRecipe({ size, color });
  const controlSlot = getSlotProps('control', controlClassName, classNames, styles);
  const dotSlot = getSlotProps('dot', radioDotStyle, classNames, styles, {
    width: DOT_SIZE[size],
    height: DOT_SIZE[size],
    color: controlProps['data-state'] === 'checked' ? undefined : 'transparent',
  });

  // Hidden native input — form entegrasyonu için
  const hiddenInput = name ? (
    <input
      className={hiddenRadioInputStyle}
      type="radio"
      name={name}
      value={hookProps.value ?? ''}
      checked={checked}
      disabled={isDisabled}
      readOnly
      tabIndex={-1}
      aria-hidden="true"
    />
  ) : null;

  // Control (daire) — visual radio
  const control = (
    <div
      {...controlProps}
      className={controlSlot.className}
      style={controlSlot.style}
      aria-label={!children ? ariaLabel : undefined}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      {checked && (
        <span
          className={dotSlot.className}
          style={dotSlot.style}
        />
      )}
    </div>
  );

  // Label yoksa sadece control döndür
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
        {control}
      </div>
    );
  }

  // Label varsa wrapper ile döndür
  const rootSlot = getSlotProps('root', radioLabelStyle, classNames, styles, {
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
      {control}
      <span className={labelSlot.className || undefined} style={labelSlot.style}>{children}</span>
    </label>
  );
});
