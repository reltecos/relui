/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Skeleton — icerik yer tutucu bilesen.
 * Skeleton — content placeholder component.
 *
 * 3 varyant (text/circle/rect), 2 animasyon (shimmer/pulse).
 *
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';
import { skeletonRootRecipe } from './skeleton.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/**
 * Skeleton slot isimleri / Skeleton slot names.
 */
export type SkeletonSlot = 'root';

// ── Types ─────────────────────────────────────────────

/** Skeleton varyanti / Skeleton variant. */
export type SkeletonVariant = 'text' | 'circle' | 'rect';

/** Skeleton animasyon turu / Skeleton animation type. */
export type SkeletonAnimation = 'shimmer' | 'pulse' | 'none';

// ── Component Props ───────────────────────────────────

export interface SkeletonComponentProps extends SlotStyleProps<SkeletonSlot> {
  /** Varyant / Variant */
  variant?: SkeletonVariant;
  /** Animasyon / Animation */
  animation?: SkeletonAnimation;
  /** Genislik / Width */
  width?: number | string;
  /** Yukseklik / Height */
  height?: number | string;
  /** Yaricap / Border radius (sadece rect icin) */
  radius?: number | string;
  /** Satir sayisi / Number of lines (sadece text icin) */
  lines?: number;
  /** Satir araligi / Line gap (sadece text icin, lines > 1) */
  lineGap?: number;
  /** Yuklendi mi / Is loaded (true = children goster) */
  loaded?: boolean;
  /** Icerik / Content (loaded=true olunca gosterilir) */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
  /** id */
  id?: string;
  /** aria-label */
  'aria-label'?: string;
}

// ── Component ─────────────────────────────────────────

/**
 * Skeleton bilesen — icerik yer tutucu.
 * Skeleton component — content placeholder.
 *
 * @example
 * ```tsx
 * <Skeleton variant="text" width="80%" />
 * <Skeleton variant="circle" width={48} height={48} />
 * <Skeleton variant="rect" width="100%" height={200} />
 * <Skeleton loaded={isLoaded}><RealContent /></Skeleton>
 * ```
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonComponentProps>(
  function Skeleton(props, ref) {
    const {
      variant = 'text',
      animation = 'shimmer',
      width,
      height,
      radius,
      lines = 1,
      lineGap = 8,
      loaded = false,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
      id,
      'aria-label': ariaLabel,
    } = props;

    // ── Loaded — show children ──
    if (loaded && children) {
      return <>{children}</>;
    }

    // ── Slots ──
    const rootClass = skeletonRootRecipe({ variant, animation });
    const rootSlot = getSlotProps('root', rootClass, classNames, styles);
    const combinedRootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    // ── Compute dimensions ──
    const computedWidth = typeof width === 'number' ? `${width}px` : width;
    const computedHeight = typeof height === 'number' ? `${height}px` : height;
    const computedRadius = typeof radius === 'number' ? `${radius}px` : radius;

    const sizeStyle: React.CSSProperties = {};
    if (computedWidth) sizeStyle.width = computedWidth;
    if (computedHeight) sizeStyle.height = computedHeight;
    if (computedRadius && variant === 'rect') sizeStyle.borderRadius = computedRadius;

    // ── Circle variant — force equal width/height ──
    if (variant === 'circle') {
      const dim = computedWidth || computedHeight || '40px';
      sizeStyle.width = dim;
      sizeStyle.height = dim;
    }

    const combinedRootStyle = { ...rootSlot.style, ...sizeStyle, ...styleProp };

    // ── Multi-line text ──
    if (variant === 'text' && lines > 1) {
      return (
        <div
          ref={ref}
          id={id}
          data-testid="skeleton-group"
          role="status"
          aria-busy="true"
          aria-label={ariaLabel || 'Yukleniyor'}
          style={{ display: 'flex', flexDirection: 'column', gap: lineGap }}
        >
          {Array.from({ length: lines }, (_, i) => {
            const isLast = i === lines - 1;
            const lineWidth = isLast ? '60%' : computedWidth || '100%';
            const lineStyle: React.CSSProperties = {
              ...rootSlot.style,
              ...sizeStyle,
              width: lineWidth,
              ...styleProp,
            };

            return (
              <div
                key={i}
                className={combinedRootClassName}
                style={lineStyle}
                data-testid="skeleton"
                aria-hidden="true"
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
        data-testid="skeleton"
        role="status"
        aria-busy="true"
        aria-label={ariaLabel || 'Yukleniyor'}
      />
    );
  },
);
