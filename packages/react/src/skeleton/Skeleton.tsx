/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Skeleton — icerik yer tutucu bilesen (Dual API).
 * Skeleton — content placeholder component (Dual API).
 *
 * Props-based: `<Skeleton variant="circle" width={48} />`
 * Compound:    `<Skeleton><Skeleton.Circle width={48} /><Skeleton.Text lines={3} /></Skeleton>`
 *
 * 3 varyant (text/circle/rect), 2 animasyon (shimmer/pulse).
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import { skeletonRootRecipe } from './skeleton.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

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

// ── Context (Compound API) ──────────────────────────

interface SkeletonContextValue {
  animation: SkeletonAnimation;
  classNames: ClassNames<SkeletonSlot> | undefined;
  styles: Styles<SkeletonSlot> | undefined;
}

const SkeletonContext = createContext<SkeletonContextValue | null>(null);

function useSkeletonContext(): SkeletonContextValue {
  const ctx = useContext(SkeletonContext);
  if (!ctx) throw new Error('Skeleton compound sub-components must be used within <Skeleton>.');
  return ctx;
}

// ── Compound: Skeleton.Circle ────────────────────────

/** Skeleton.Circle props */
export interface SkeletonCircleProps {
  /** Boyut (genislik = yukseklik) / Size (width = height) */
  width?: number | string;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

const SkeletonCircle = forwardRef<HTMLDivElement, SkeletonCircleProps>(
  function SkeletonCircle(props, ref) {
    const { width, className, style: styleProp } = props;
    const ctx = useSkeletonContext();
    const rootClass = skeletonRootRecipe({ variant: 'circle', animation: ctx.animation });
    const slot = getSlotProps('root', rootClass, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const dim = typeof width === 'number' ? `${width}px` : (width || '40px');
    const sizeStyle: React.CSSProperties = { width: dim, height: dim };

    return (
      <div
        ref={ref}
        className={cls}
        style={{ ...slot.style, ...sizeStyle, ...styleProp }}
        data-testid="skeleton"
        aria-hidden="true"
      />
    );
  },
);

// ── Compound: Skeleton.Rect ──────────────────────────

/** Skeleton.Rect props */
export interface SkeletonRectProps {
  /** Genislik / Width */
  width?: number | string;
  /** Yukseklik / Height */
  height?: number | string;
  /** Yaricap / Border radius */
  radius?: number | string;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

const SkeletonRect = forwardRef<HTMLDivElement, SkeletonRectProps>(
  function SkeletonRect(props, ref) {
    const { width, height, radius, className, style: styleProp } = props;
    const ctx = useSkeletonContext();
    const rootClass = skeletonRootRecipe({ variant: 'rect', animation: ctx.animation });
    const slot = getSlotProps('root', rootClass, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const sizeStyle: React.CSSProperties = {};
    if (width !== undefined) sizeStyle.width = typeof width === 'number' ? `${width}px` : width;
    if (height !== undefined) sizeStyle.height = typeof height === 'number' ? `${height}px` : height;
    if (radius !== undefined) sizeStyle.borderRadius = typeof radius === 'number' ? `${radius}px` : radius;

    return (
      <div
        ref={ref}
        className={cls}
        style={{ ...slot.style, ...sizeStyle, ...styleProp }}
        data-testid="skeleton"
        aria-hidden="true"
      />
    );
  },
);

// ── Compound: Skeleton.Text ──────────────────────────

/** Skeleton.Text props */
export interface SkeletonTextProps {
  /** Satir sayisi / Number of lines */
  lines?: number;
  /** Genislik / Width */
  width?: number | string;
  /** Yukseklik / Height */
  height?: number | string;
  /** Satir araligi / Line gap */
  lineGap?: number;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(
  function SkeletonText(props, ref) {
    const { lines = 1, width, height, lineGap = 8, className, style: styleProp } = props;
    const ctx = useSkeletonContext();
    const rootClass = skeletonRootRecipe({ variant: 'text', animation: ctx.animation });
    const slot = getSlotProps('root', rootClass, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const computedWidth = typeof width === 'number' ? `${width}px` : width;
    const computedHeight = typeof height === 'number' ? `${height}px` : height;

    const sizeStyle: React.CSSProperties = {};
    if (computedWidth) sizeStyle.width = computedWidth;
    if (computedHeight) sizeStyle.height = computedHeight;

    if (lines > 1) {
      return (
        <div
          ref={ref}
          data-testid="skeleton-group"
          aria-hidden="true"
          style={{ display: 'flex', flexDirection: 'column', gap: lineGap, ...styleProp }}
        >
          {Array.from({ length: lines }, (_, i) => {
            const isLast = i === lines - 1;
            const lineWidth = isLast ? '60%' : (computedWidth || '100%');
            return (
              <div
                key={i}
                className={cls}
                style={{ ...slot.style, ...sizeStyle, width: lineWidth }}
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
        className={cls}
        style={{ ...slot.style, ...sizeStyle, ...styleProp }}
        data-testid="skeleton"
        aria-hidden="true"
      />
    );
  },
);

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
  /** Icerik / Content (loaded=true olunca gosterilir veya compound children) */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
  /** id */
  id?: string;
  /** aria-label */
  'aria-label'?: string;
  /** Compound API aktif mi (true ise children compound sub-component olarak render edilir) */
  compound?: boolean;
}

// ── Component ─────────────────────────────────────────

const SkeletonBase = forwardRef<HTMLDivElement, SkeletonComponentProps>(
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
      compound,
    } = props;

    // ── Loaded — show children ──
    if (loaded && children) {
      return <>{children}</>;
    }

    const ctxValue: SkeletonContextValue = { animation, classNames, styles };

    // ── Compound API ── (compound=true ile acikca belirtilmeli)
    if (compound && children && !loaded) {
      return (
        <SkeletonContext.Provider value={ctxValue}>
          <div
            ref={ref}
            id={id}
            data-testid="skeleton-group"
            role="status"
            aria-busy="true"
            aria-label={ariaLabel || 'Yukleniyor'}
            className={className}
            style={styleProp}
          >
            {children}
          </div>
        </SkeletonContext.Provider>
      );
    }

    // ── Props-based API ──
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

/**
 * Skeleton bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Skeleton variant="circle" width={48} />
 * <Skeleton variant="text" lines={3} />
 * <Skeleton variant="rect" width="100%" height={200} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Skeleton>
 *   <Skeleton.Circle width={48} />
 *   <Skeleton.Text lines={3} />
 *   <Skeleton.Rect width="100%" height={120} radius={8} />
 * </Skeleton>
 * ```
 */
export const Skeleton = Object.assign(SkeletonBase, {
  Circle: SkeletonCircle,
  Rect: SkeletonRect,
  Text: SkeletonText,
});
