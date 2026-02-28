/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Slider — styled React slider component.
 * Slider — stilize edilmiş React slider bileşeni.
 *
 * Track + fill + thumb pattern.
 * 3 boyut × 5 renk, horizontal/vertical orientation.
 *
 * @packageDocumentation
 */

import { forwardRef } from 'react';
import type { SliderSize, SliderColor, SliderOrientation } from '@relteco/relui-core';
import { useSlider, type UseSliderProps } from './useSlider';
import {
  sliderRootRecipe,
  sliderTrackStyle,
  sliderTrackHorizontalStyle,
  sliderTrackVerticalStyle,
  sliderFillStyle,
  sliderFillHorizontalStyle,
  sliderFillVerticalStyle,
  sliderThumbRecipe,
  hiddenSliderInputStyle,
} from './slider.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** Slider slot isimleri. */
export type SliderSlot = 'root' | 'track' | 'fill' | 'thumb';

/**
 * Slider bileşen props'ları.
 * Slider component props.
 */
export interface SliderComponentProps extends UseSliderProps, SlotStyleProps<SliderSlot> {
  /** Boyut / Size */
  size?: SliderSize;

  /** Renk şeması / Color scheme */
  color?: SliderColor;

  /** Yön / Orientation */
  orientation?: SliderOrientation;

  /** Ek CSS sınıfı / Additional CSS class */
  className?: string;

  /** HTML id */
  id?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;

  /** aria-label */
  'aria-label'?: string;

  /** aria-labelledby */
  'aria-labelledby'?: string;

  /** aria-describedby */
  'aria-describedby'?: string;

  /** aria-valuetext (değerin açıklaması) */
  'aria-valuetext'?: string;
}

/**
 * Slider — RelUI slider bileşeni.
 * Slider — RelUI slider component.
 *
 * @example
 * ```tsx
 * <Slider
 *   min={0}
 *   max={100}
 *   value={volume}
 *   onValueChange={setVolume}
 *   aria-label="Ses seviyesi"
 * />
 *
 * <Slider
 *   orientation="vertical"
 *   min={0}
 *   max={100}
 *   step={5}
 *   color="success"
 * />
 * ```
 */
export const Slider = forwardRef<HTMLDivElement, SliderComponentProps>(function Slider(
  {
    size = 'md',
    color = 'accent',
    orientation = 'horizontal',
    className,
    classNames,
    styles,
    id,
    style: inlineStyle,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-valuetext': ariaValueText,
    name,
    ...hookProps
  },
  forwardedRef,
) {
  const {
    thumbProps,
    trackProps,
    value,
    percent,
    isDisabled,
    isReadOnly,
  } = useSlider({ ...hookProps, orientation });

  const recipeClass = sliderRootRecipe({ size, color, orientation });
  const thumbRecipeClass = sliderThumbRecipe({ size });

  const isHorizontal = orientation === 'horizontal';

  // Slot props
  const rootSlot = getSlotProps('root', recipeClass, classNames, styles, inlineStyle);
  const rootCombinedClassName = className
    ? `${rootSlot.className} ${className}`
    : rootSlot.className;

  const trackBaseClasses = [
    sliderTrackStyle,
    isHorizontal ? sliderTrackHorizontalStyle : sliderTrackVerticalStyle,
  ].join(' ');
  const trackSlot = getSlotProps('track', trackBaseClasses, classNames, styles);

  const fillBaseClasses = [
    sliderFillStyle,
    isHorizontal ? sliderFillHorizontalStyle : sliderFillVerticalStyle,
  ].join(' ');
  const fillPositionStyle = isHorizontal
    ? { width: `${percent}%` }
    : { height: `${percent}%` };
  const fillSlot = getSlotProps('fill', fillBaseClasses, classNames, styles, fillPositionStyle);

  const thumbPosition = isHorizontal
    ? { left: `${percent}%`, top: '50%', transform: `translate(-50%, -50%)` }
    : { bottom: `${percent}%`, left: '50%', transform: `translate(-50%, 50%)` };
  const thumbSlot = getSlotProps('thumb', thumbRecipeClass, classNames, styles, thumbPosition);

  // Hidden native input — form entegrasyonu
  const hiddenInput = name ? (
    <input
      className={hiddenSliderInputStyle}
      type="range"
      name={name}
      min={hookProps.min}
      max={hookProps.max}
      step={hookProps.step}
      value={value}
      disabled={isDisabled}
      readOnly
      tabIndex={-1}
      aria-hidden="true"
    />
  ) : null;

  return (
    <div
      ref={forwardedRef}
      id={id}
      className={rootCombinedClassName}
      style={rootSlot.style}
      data-disabled={isDisabled ? '' : undefined}
      data-readonly={isReadOnly ? '' : undefined}
      data-orientation={orientation}
    >
      {hiddenInput}

      {/* Track */}
      <div {...trackProps} className={trackSlot.className} style={trackSlot.style} data-orientation={orientation}>
        {/* Fill */}
        <div className={fillSlot.className} style={fillSlot.style} />
      </div>

      {/* Thumb */}
      <div
        {...thumbProps}
        className={thumbSlot.className}
        style={thumbSlot.style}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-valuetext={ariaValueText}
      />
    </div>
  );
});
