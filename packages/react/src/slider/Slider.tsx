/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Slider — styled React slider bilesen (Dual API).
 * Slider — styled React slider component (Dual API).
 *
 * Props-based: `<Slider min={0} max={100} value={50} />`
 * Compound:    `<Slider><Slider.Track /><Slider.Thumb /><Slider.Label>50</Slider.Label></Slider>`
 *
 * Track + fill + thumb pattern.
 * 3 boyut x 5 renk, horizontal/vertical orientation.
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
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
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/** Slider slot isimleri. */
export type SliderSlot = 'root' | 'track' | 'fill' | 'thumb';

// ── Context (Compound API) ──────────────────────────────────────────

interface SliderContextValue {
  size: SliderSize;
  color: SliderColor;
  orientation: SliderOrientation;
  classNames: ClassNames<SliderSlot> | undefined;
  styles: Styles<SliderSlot> | undefined;
  value: number;
  percent: number;
  min: number;
  max: number;
  isDisabled: boolean;
  isReadOnly: boolean;
  thumbProps: ReturnType<typeof useSlider>['thumbProps'];
  trackProps: ReturnType<typeof useSlider>['trackProps'];
}

const SliderContext = createContext<SliderContextValue | null>(null);

function useSliderContext(): SliderContextValue {
  const ctx = useContext(SliderContext);
  if (!ctx) throw new Error('Slider compound sub-components must be used within <Slider>.');
  return ctx;
}

// ── Compound: Slider.Track ──────────────────────────────────────────

/** Slider.Track props */
export interface SliderTrackProps {
  /** Icerik (fill vb.) / Content (fill etc.) */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const SliderTrack = forwardRef<HTMLDivElement, SliderTrackProps>(
  function SliderTrack(props, ref) {
    const { children, className } = props;
    const ctx = useSliderContext();

    const isHorizontal = ctx.orientation === 'horizontal';
    const trackBaseClasses = [
      sliderTrackStyle,
      isHorizontal ? sliderTrackHorizontalStyle : sliderTrackVerticalStyle,
    ].join(' ');
    const slot = getSlotProps('track', trackBaseClasses, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const fillBaseClasses = [
      sliderFillStyle,
      isHorizontal ? sliderFillHorizontalStyle : sliderFillVerticalStyle,
    ].join(' ');
    const fillPositionStyle = isHorizontal
      ? { width: `${ctx.percent}%` }
      : { height: `${ctx.percent}%` };
    const fillSlot = getSlotProps('fill', fillBaseClasses, ctx.classNames, ctx.styles, fillPositionStyle);

    return (
      <div
        ref={ref}
        {...ctx.trackProps}
        className={cls}
        style={slot.style}
        data-orientation={ctx.orientation}
        data-testid="slider-track"
      >
        <div className={fillSlot.className} style={fillSlot.style} data-testid="slider-fill" />
        {children}
      </div>
    );
  },
);

// ── Compound: Slider.Thumb ──────────────────────────────────────────

/** Slider.Thumb props */
export interface SliderThumbProps {
  /** Ek className / Additional className */
  className?: string;
  /** aria-label */
  'aria-label'?: string;
  /** aria-labelledby */
  'aria-labelledby'?: string;
  /** aria-describedby */
  'aria-describedby'?: string;
  /** aria-valuetext */
  'aria-valuetext'?: string;
}

const SliderThumb = forwardRef<HTMLDivElement, SliderThumbProps>(
  function SliderThumb(props, ref) {
    const {
      className,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-valuetext': ariaValueText,
    } = props;
    const ctx = useSliderContext();

    const isHorizontal = ctx.orientation === 'horizontal';
    const thumbRecipeClass = sliderThumbRecipe({ size: ctx.size });
    const thumbPosition = isHorizontal
      ? { left: `${ctx.percent}%`, top: '50%', transform: 'translate(-50%, -50%)' }
      : { bottom: `${ctx.percent}%`, left: '50%', transform: 'translate(-50%, 50%)' };
    const slot = getSlotProps('thumb', thumbRecipeClass, ctx.classNames, ctx.styles, thumbPosition);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        {...ctx.thumbProps}
        className={cls}
        style={slot.style}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-valuetext={ariaValueText}
        data-testid="slider-thumb"
      />
    );
  },
);

// ── Compound: Slider.Label ──────────────────────────────────────────

/** Slider.Label props */
export interface SliderLabelProps {
  /** Icerik / Content */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const SliderLabel = forwardRef<HTMLSpanElement, SliderLabelProps>(
  function SliderLabel(props, ref) {
    const { children, className } = props;
    useSliderContext();

    return (
      <span
        ref={ref}
        className={className}
        data-testid="slider-label"
      >
        {children}
      </span>
    );
  },
);

// ── Slider Component Props ──────────────────────────────────────────

/**
 * Slider bilesen props lari.
 * Slider component props.
 */
export interface SliderComponentProps extends UseSliderProps, SlotStyleProps<SliderSlot> {
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

  /** aria-label */
  'aria-label'?: string;

  /** aria-labelledby */
  'aria-labelledby'?: string;

  /** aria-describedby */
  'aria-describedby'?: string;

  /** aria-valuetext (degerin aciklamasi) */
  'aria-valuetext'?: string;

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
}

// ── Component ───────────────────────────────────────────────────────

const SliderBase = forwardRef<HTMLDivElement, SliderComponentProps>(function Slider(
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
    children,
    ...hookProps
  },
  forwardedRef,
) {
  const {
    thumbProps,
    trackProps,
    value,
    percent,
    min,
    max,
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

  // ── Compound API ──
  if (children) {
    const ctxValue: SliderContextValue = {
      size,
      color,
      orientation,
      classNames,
      styles,
      value,
      percent,
      min,
      max,
      isDisabled,
      isReadOnly,
      thumbProps,
      trackProps,
    };

    return (
      <SliderContext.Provider value={ctxValue}>
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
          {children}
        </div>
      </SliderContext.Provider>
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
    ? { width: `${percent}%` }
    : { height: `${percent}%` };
  const fillSlot = getSlotProps('fill', fillBaseClasses, classNames, styles, fillPositionStyle);

  const thumbPosition = isHorizontal
    ? { left: `${percent}%`, top: '50%', transform: `translate(-50%, -50%)` }
    : { bottom: `${percent}%`, left: '50%', transform: `translate(-50%, 50%)` };
  const thumbSlot = getSlotProps('thumb', thumbRecipeClass, classNames, styles, thumbPosition);

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

/**
 * Slider bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Slider
 *   min={0}
 *   max={100}
 *   value={volume}
 *   onValueChange={setVolume}
 *   aria-label="Ses seviyesi"
 * />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Slider min={0} max={100} value={50}>
 *   <Slider.Track />
 *   <Slider.Thumb aria-label="Ses" />
 *   <Slider.Label>50</Slider.Label>
 * </Slider>
 * ```
 */
export const Slider = Object.assign(SliderBase, {
  Track: SliderTrack,
  Thumb: SliderThumb,
  Label: SliderLabel,
});
