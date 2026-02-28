/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * RangeSlider — styled React range slider component.
 * RangeSlider — stilize edilmiş React range slider bileşeni.
 *
 * Track + fill (aradaki bölge) + iki thumb pattern.
 * 3 boyut x 5 renk, horizontal/vertical orientation.
 *
 * @packageDocumentation
 */

import { forwardRef } from 'react';
import type { SliderSize, SliderColor, SliderOrientation } from '@relteco/relui-core';
import { useRangeSlider, type UseRangeSliderProps } from './useRangeSlider';
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
} from '../slider/slider.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** RangeSlider slot isimleri. */
export type RangeSliderSlot = 'root' | 'track' | 'fill' | 'startThumb' | 'endThumb';

/**
 * RangeSlider bileşen props'ları.
 * RangeSlider component props.
 */
export interface RangeSliderComponentProps extends UseRangeSliderProps, SlotStyleProps<RangeSliderSlot> {
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

  /** Start thumb aria-label */
  'aria-label'?: string;

  /** End thumb aria-label */
  'aria-label-end'?: string;

  /** aria-labelledby */
  'aria-labelledby'?: string;

  /** aria-describedby */
  'aria-describedby'?: string;

  /** Start thumb aria-valuetext */
  'aria-valuetext'?: string;

  /** End thumb aria-valuetext */
  'aria-valuetext-end'?: string;
}

/**
 * RangeSlider — RelUI range slider bileşeni.
 * RangeSlider — RelUI range slider component.
 *
 * @example
 * ```tsx
 * <RangeSlider
 *   min={0}
 *   max={100}
 *   value={[20, 80]}
 *   onValueChange={setRange}
 *   aria-label="Min fiyat"
 *   aria-label-end="Max fiyat"
 * />
 *
 * <RangeSlider
 *   orientation="vertical"
 *   min={0}
 *   max={100}
 *   minDistance={10}
 *   color="success"
 * />
 * ```
 */
export const RangeSlider = forwardRef<HTMLDivElement, RangeSliderComponentProps>(
  function RangeSlider(
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
      'aria-label-end': ariaLabelEnd,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-valuetext': ariaValueText,
      'aria-valuetext-end': ariaValueTextEnd,
      name,
      ...hookProps
    },
    forwardedRef,
  ) {
    const {
      startThumbProps,
      endThumbProps,
      trackProps,
      value,
      startPercent,
      endPercent,
      isDisabled,
      isReadOnly,
    } = useRangeSlider({ ...hookProps, orientation });

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
      ? { left: `${startPercent}%`, width: `${endPercent - startPercent}%` }
      : { bottom: `${startPercent}%`, height: `${endPercent - startPercent}%` };
    const fillSlot = getSlotProps('fill', fillBaseClasses, classNames, styles, fillPositionStyle);

    // Start thumb pozisyonu
    const startThumbPosition = isHorizontal
      ? { left: `${startPercent}%`, top: '50%', transform: 'translate(-50%, -50%)' }
      : { bottom: `${startPercent}%`, left: '50%', transform: 'translate(-50%, 50%)' };
    const startThumbSlot = getSlotProps('startThumb', thumbRecipeClass, classNames, styles, startThumbPosition);

    // End thumb pozisyonu
    const endThumbPosition = isHorizontal
      ? { left: `${endPercent}%`, top: '50%', transform: 'translate(-50%, -50%)' }
      : { bottom: `${endPercent}%`, left: '50%', transform: 'translate(-50%, 50%)' };
    const endThumbSlot = getSlotProps('endThumb', thumbRecipeClass, classNames, styles, endThumbPosition);

    // Hidden native inputs — form entegrasyonu
    const hiddenInputs = name ? (
      <>
        <input
          className={hiddenSliderInputStyle}
          type="range"
          name={`${name}-start`}
          min={hookProps.min}
          max={hookProps.max}
          step={hookProps.step}
          value={value[0]}
          disabled={isDisabled}
          readOnly
          tabIndex={-1}
          aria-hidden="true"
        />
        <input
          className={hiddenSliderInputStyle}
          type="range"
          name={`${name}-end`}
          min={hookProps.min}
          max={hookProps.max}
          step={hookProps.step}
          value={value[1]}
          disabled={isDisabled}
          readOnly
          tabIndex={-1}
          aria-hidden="true"
        />
      </>
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
        {hiddenInputs}

        {/* Track */}
        <div {...trackProps} className={trackSlot.className} style={trackSlot.style} data-orientation={orientation}>
          {/* Fill — aradaki bölge */}
          <div className={fillSlot.className} style={fillSlot.style} />
        </div>

        {/* Start Thumb */}
        <div
          {...startThumbProps}
          className={startThumbSlot.className}
          style={startThumbSlot.style}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-valuetext={ariaValueText}
        />

        {/* End Thumb */}
        <div
          {...endThumbProps}
          className={endThumbSlot.className}
          style={endThumbSlot.style}
          aria-label={ariaLabelEnd ?? ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-valuetext={ariaValueTextEnd}
        />
      </div>
    );
  },
);
