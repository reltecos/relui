/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * RangeSlider — styled React range slider component (Dual API).
 * RangeSlider — stilize edilmis React range slider bileseni (Dual API).
 *
 * Props-based: `<RangeSlider value={[20, 80]} />`
 * Compound:    `<RangeSlider><RangeSlider.Track /><RangeSlider.Thumb which="start" /></RangeSlider>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
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
} from './range-slider.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';
import type { ClassNames, Styles } from '../utils/slot-styles';

/** RangeSlider slot isimleri. */
export type RangeSliderSlot = 'root' | 'track' | 'fill' | 'startThumb' | 'endThumb';

// ── Context (Compound API) ──────────────────────────

interface RangeSliderContextValue {
  size: SliderSize;
  color: SliderColor;
  orientation: SliderOrientation;
  classNames: ClassNames<RangeSliderSlot> | undefined;
  styles: Styles<RangeSliderSlot> | undefined;
  hookReturn: ReturnType<typeof useRangeSlider>;
}

const RangeSliderContext = createContext<RangeSliderContextValue | null>(null);

/** RangeSlider compound context hook. */
export function useRangeSliderContext(): RangeSliderContextValue {
  const ctx = useContext(RangeSliderContext);
  if (!ctx) throw new Error('RangeSlider compound sub-components must be used within <RangeSlider>.');
  return ctx;
}

// ── Compound: RangeSlider.Track ─────────────────────

/** RangeSlider.Track props */
export interface RangeSliderTrackProps {
  /** Ek className / Additional className */
  className?: string;
  /** Icerik / Content (fill icin) */
  children?: ReactNode;
}

const RangeSliderTrack = forwardRef<HTMLDivElement, RangeSliderTrackProps>(
  function RangeSliderTrack(props, ref) {
    const { className, children } = props;
    const ctx = useRangeSliderContext();
    const isHorizontal = ctx.orientation === 'horizontal';

    const trackBaseClasses = [
      sliderTrackStyle,
      isHorizontal ? sliderTrackHorizontalStyle : sliderTrackVerticalStyle,
    ].join(' ');
    const trackSlot = getSlotProps('track', trackBaseClasses, ctx.classNames, ctx.styles);
    const cls = className ? `${trackSlot.className} ${className}` : trackSlot.className;

    return (
      <div
        ref={ref}
        {...ctx.hookReturn.trackProps}
        className={cls}
        style={trackSlot.style}
        data-orientation={ctx.orientation}
        data-testid="range-slider-track"
      >
        {children}
      </div>
    );
  },
);

// ── Compound: RangeSlider.Thumb ─────────────────────

/** RangeSlider.Thumb props */
export interface RangeSliderThumbProps {
  /** Hangi thumb / Which thumb */
  which: 'start' | 'end';
  /** Ek className / Additional className */
  className?: string;
  /** aria-label */
  'aria-label'?: string;
  /** aria-valuetext */
  'aria-valuetext'?: string;
}

const RangeSliderThumb = forwardRef<HTMLDivElement, RangeSliderThumbProps>(
  function RangeSliderThumb(props, ref) {
    const { which, className, 'aria-label': ariaLabel, 'aria-valuetext': ariaValueText } = props;
    const ctx = useRangeSliderContext();
    const isHorizontal = ctx.orientation === 'horizontal';

    const thumbRecipeClass = sliderThumbRecipe({ size: ctx.size });
    const slotName = which === 'start' ? 'startThumb' as const : 'endThumb' as const;
    const percent = which === 'start' ? ctx.hookReturn.startPercent : ctx.hookReturn.endPercent;

    const thumbPosition = isHorizontal
      ? { left: `${percent}%`, top: '50%', transform: 'translate(-50%, -50%)' }
      : { bottom: `${percent}%`, left: '50%', transform: 'translate(-50%, 50%)' };

    const thumbSlot = getSlotProps(slotName, thumbRecipeClass, ctx.classNames, ctx.styles, thumbPosition);
    const cls = className ? `${thumbSlot.className} ${className}` : thumbSlot.className;

    const thumbProps = which === 'start' ? ctx.hookReturn.startThumbProps : ctx.hookReturn.endThumbProps;

    return (
      <div
        ref={ref}
        {...thumbProps}
        className={cls}
        style={thumbSlot.style}
        aria-label={ariaLabel}
        aria-valuetext={ariaValueText}
        data-testid={`range-slider-${which}-thumb`}
      />
    );
  },
);

/**
 * RangeSlider bilesen props'lari.
 * RangeSlider component props.
 */
export interface RangeSliderComponentProps extends UseRangeSliderProps, SlotStyleProps<RangeSliderSlot> {
  /** Boyut / Size */
  size?: SliderSize;

  /** Renk semasi / Color scheme */
  color?: SliderColor;

  /** Yon / Orientation */
  orientation?: SliderOrientation;

  /** Ek CSS sinifi / Additional CSS class */
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

  /** Compound API icin children. */
  children?: ReactNode;
}

// ── Component ─────────────────────────────────────────

const RangeSliderBase = forwardRef<HTMLDivElement, RangeSliderComponentProps>(
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
      children,
      ...hookProps
    },
    forwardedRef,
  ) {
    const hookReturn = useRangeSlider({ ...hookProps, orientation });

    const {
      startThumbProps,
      endThumbProps,
      trackProps,
      value,
      startPercent,
      endPercent,
      isDisabled,
      isReadOnly,
    } = hookReturn;

    const recipeClass = sliderRootRecipe({ size, color, orientation });
    const thumbRecipeClass = sliderThumbRecipe({ size });

    const isHorizontal = orientation === 'horizontal';

    // Slot props
    const rootSlot = getSlotProps('root', recipeClass, classNames, styles, inlineStyle);
    const rootCombinedClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const ctxValue: RangeSliderContextValue = {
      size,
      color,
      orientation,
      classNames,
      styles,
      hookReturn,
    };

    // ── Compound API ──
    if (children) {
      return (
        <RangeSliderContext.Provider value={ctxValue}>
          <div
            ref={forwardedRef}
            id={id}
            className={rootCombinedClassName}
            style={rootSlot.style}
            data-disabled={isDisabled ? '' : undefined}
            data-readonly={isReadOnly ? '' : undefined}
            data-orientation={orientation}
            data-testid="range-slider-root"
          >
            {children}
          </div>
        </RangeSliderContext.Provider>
      );
    }

    // ── Props-based API ──
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
        data-testid="range-slider-root"
      >
        {hiddenInputs}

        {/* Track */}
        <div {...trackProps} className={trackSlot.className} style={trackSlot.style} data-orientation={orientation} data-testid="range-slider-track">
          {/* Fill */}
          <div className={fillSlot.className} style={fillSlot.style} data-testid="range-slider-fill" />
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
          data-testid="range-slider-start-thumb"
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
          data-testid="range-slider-end-thumb"
        />
      </div>
    );
  },
);

/**
 * RangeSlider — Dual API (props-based + compound).
 */
export const RangeSlider = Object.assign(RangeSliderBase, {
  Track: RangeSliderTrack,
  Thumb: RangeSliderThumb,
});
