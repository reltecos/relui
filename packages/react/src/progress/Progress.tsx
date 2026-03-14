/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Progress — ilerleme gostergesi bilesen.
 * Progress — progress indicator component.
 *
 * 3 tur (bar/circular/chunk), 5 boyut, indeterminate, striped.
 *
 * @packageDocumentation
 */

import { forwardRef, useRef, useReducer, useEffect, type ReactNode } from 'react';
import {
  progressRootRecipe,
  progressTrackRecipe,
  progressFillStyle,
  progressFillIndeterminateStyle,
  progressFillIndeterminate2Style,
  progressStripedStyle,
  progressStripedAnimatedStyle,
  progressChunkTrackStyle,
  progressChunkRecipe,
  progressCircularSvgRecipe,
  progressCircularTrackStyle,
  progressCircularFillStyle,
  progressCircularFillIndeterminateStyle,
  progressLabelStyle,
  progressValueStyle,
} from './progress.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';
import { createProgress, type ProgressSize, type ProgressAPI } from '@relteco/relui-core';

// ── Slot ──────────────────────────────────────────────

/**
 * Progress slot isimleri / Progress slot names.
 */
export type ProgressSlot = 'root' | 'track' | 'fill' | 'label' | 'value' | 'circle' | 'chunk';

// ── Types ─────────────────────────────────────────────

/** Progress gorsel turu / Progress visual type. */
export type ProgressType = 'bar' | 'circular' | 'chunk';

// ── Component Props ───────────────────────────────────

export interface ProgressComponentProps extends SlotStyleProps<ProgressSlot> {
  /** Deger / Value (0–max arasi) */
  value?: number;
  /** Minimum deger / Minimum value */
  min?: number;
  /** Maksimum deger / Maximum value */
  max?: number;
  /** Gorsel turu / Visual type */
  type?: ProgressType;
  /** Boyut / Size */
  size?: ProgressSize;
  /** Belirsiz mod / Indeterminate mode */
  indeterminate?: boolean;
  /** Renk / Color (CSS color value) */
  color?: string;
  /** Cizgili / Striped (sadece bar) */
  striped?: boolean;
  /** Cizgi animasyonu / Animated stripes (sadece bar + striped) */
  animated?: boolean;
  /** Deger goster / Show value text */
  showValue?: boolean;
  /** Deger formatlayici / Value formatter */
  formatValue?: (value: number, percent: number) => string;
  /** Etiket / Label */
  label?: ReactNode;
  /** Parca sayisi / Number of chunks (sadece chunk turu) */
  chunks?: number;
  /** Dairesel kalinlik / Circular stroke width */
  thickness?: number;
  /** aria-label */
  'aria-label'?: string;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
  /** id */
  id?: string;
}

// ── Component ─────────────────────────────────────────

/**
 * Progress bilesen — ilerleme gostergesi.
 * Progress component — progress indicator.
 *
 * @example
 * ```tsx
 * <Progress value={60} />
 * <Progress type="circular" value={75} showValue />
 * <Progress type="chunk" value={40} chunks={5} />
 * <Progress indeterminate />
 * ```
 */
export const Progress = forwardRef<HTMLDivElement, ProgressComponentProps>(
  function Progress(props, ref) {
    const {
      value = 0,
      min = 0,
      max = 100,
      type = 'bar',
      size = 'md',
      indeterminate = false,
      color,
      striped = false,
      animated = false,
      showValue = false,
      formatValue,
      label,
      chunks = 5,
      thickness,
      'aria-label': ariaLabel,
      className,
      style: styleProp,
      classNames,
      styles,
      id,
    } = props;

    const [, forceRender] = useReducer((c: number) => c + 1, 0);

    const apiRef = useRef<ProgressAPI | null>(null);
    if (!apiRef.current) {
      apiRef.current = createProgress({ value, min, max, indeterminate });
    }
    const api = apiRef.current;

    // ── Prop sync ──
    const prevValueRef = useRef<number | undefined>(undefined);
    if (value !== prevValueRef.current) {
      api.send({ type: 'SET_VALUE', value });
      prevValueRef.current = value;
    }

    const prevIndeterminateRef = useRef<boolean | undefined>(undefined);
    if (indeterminate !== prevIndeterminateRef.current) {
      api.send({ type: 'SET_INDETERMINATE', indeterminate });
      prevIndeterminateRef.current = indeterminate;
    }

    // ── Subscribe ──
    useEffect(() => {
      return api.subscribe(() => forceRender());
    }, [api]);

    const percent = api.getPercent();
    const rootProps = api.getRootProps();

    // ── Slots ──
    const rootClass = progressRootRecipe({ type });
    const rootSlot = getSlotProps('root', rootClass, classNames, styles);
    const combinedRootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;
    const combinedRootStyle = styleProp
      ? { ...rootSlot.style, ...styleProp }
      : rootSlot.style;

    const trackSlot = getSlotProps('track', progressTrackRecipe({ size }), classNames, styles);
    const fillSlot = getSlotProps('fill', progressFillStyle, classNames, styles);
    const labelSlot = getSlotProps('label', progressLabelStyle, classNames, styles);
    const valueSlot = getSlotProps('value', progressValueStyle, classNames, styles);
    const circleSlot = getSlotProps('circle', progressCircularSvgRecipe({ size, indeterminate }), classNames, styles);
    const chunkSlot = getSlotProps('chunk', '', classNames, styles);

    // ── Format value ──
    const formattedValue = formatValue
      ? formatValue(api.getContext().value, percent)
      : `${Math.round(percent)}%`;

    // ── Color style ──
    const colorStyle = color ? { backgroundColor: color } : undefined;
    const strokeColor = color || undefined;

    // ── Bar variant ──
    function renderBar() {
      if (indeterminate) {
        return (
          <div className={trackSlot.className} style={trackSlot.style} data-testid="progress-track">
            <div
              className={progressFillIndeterminateStyle}
              style={{ ...fillSlot.style, ...colorStyle }}
            />
            <div
              className={progressFillIndeterminate2Style}
              style={{ ...fillSlot.style, ...colorStyle }}
            />
          </div>
        );
      }

      const fillClassNames = [fillSlot.className];
      if (striped) fillClassNames.push(progressStripedStyle);
      if (striped && animated) fillClassNames.push(progressStripedAnimatedStyle);

      return (
        <div className={trackSlot.className} style={trackSlot.style} data-testid="progress-track">
          <div
            className={fillClassNames.join(' ')}
            style={{
              ...fillSlot.style,
              ...colorStyle,
              width: `${percent}%`,
            }}
            data-testid="progress-fill"
          />
        </div>
      );
    }

    // ── Circular variant ──
    function renderCircular() {
      const svgSize = { xs: 24, sm: 32, md: 48, lg: 64, xl: 96 }[size];
      const strokeW = thickness ?? { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }[size];
      const radius = (svgSize - strokeW) / 2;
      const circumference = 2 * Math.PI * radius;
      const dashoffset = circumference - (percent / 100) * circumference;

      return (
        <svg
          className={circleSlot.className}
          style={circleSlot.style}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          data-testid="progress-circular"
        >
          <circle
            className={progressCircularTrackStyle}
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            strokeWidth={strokeW}
          />
          <circle
            className={indeterminate ? progressCircularFillIndeterminateStyle : progressCircularFillStyle}
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            strokeWidth={strokeW}
            strokeDasharray={indeterminate ? undefined : circumference}
            strokeDashoffset={indeterminate ? undefined : dashoffset}
            style={strokeColor ? { stroke: strokeColor } : undefined}
          />
        </svg>
      );
    }

    // ── Chunk variant ──
    function renderChunk() {
      const filledCount = Math.round((percent / 100) * chunks);

      return (
        <div className={progressChunkTrackStyle} data-testid="progress-chunk-track">
          {Array.from({ length: chunks }, (_, i) => {
            const isFilled = i < filledCount;
            const chunkClass = progressChunkRecipe({
              size,
              filled: isFilled,
            });
            const mergedClass = chunkSlot.className
              ? `${chunkClass} ${chunkSlot.className}`
              : chunkClass;

            return (
              <div
                key={i}
                className={mergedClass}
                style={{
                  ...chunkSlot.style,
                  ...(isFilled && color ? { backgroundColor: color } : undefined),
                }}
                data-testid="progress-chunk"
                data-filled={isFilled}
              />
            );
          })}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={combinedRootClassName}
        style={combinedRootStyle}
        id={id}
        data-testid="progress"
        {...rootProps}
        aria-label={ariaLabel || (label ? undefined : 'Progress')}
      >
        {/* Label + value header */}
        {(label || (showValue && type !== 'circular')) && (
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'baseline' }}>
            {label && (
              <span className={labelSlot.className} style={labelSlot.style} data-testid="progress-label">
                {label}
              </span>
            )}
            {showValue && !indeterminate && type !== 'circular' && (
              <span className={valueSlot.className} style={valueSlot.style} data-testid="progress-value">
                {formattedValue}
              </span>
            )}
          </div>
        )}

        {/* Progress visual */}
        {type === 'bar' && renderBar()}
        {type === 'circular' && renderCircular()}
        {type === 'chunk' && renderChunk()}

        {/* Circular value overlay */}
        {showValue && type === 'circular' && !indeterminate && (
          <span className={valueSlot.className} style={valueSlot.style} data-testid="progress-value">
            {formattedValue}
          </span>
        )}
      </div>
    );
  },
);
