/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Rating — yildiz derecelendirme bilesen (Dual API).
 * Rating — star rating component (Dual API).
 *
 * Props-based: `<Rating defaultValue={3} count={5} />`
 * Compound:    `<Rating><Rating.Star index={0} /><Rating.Label>Rating</Rating.Label></Rating>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import { StarIcon } from '@relteco/relui-icons';
import {
  rootStyle,
  starGroupStyle,
  starStyle,
  starReadOnlyStyle,
  sizeStyles,
  labelStyle,
} from './rating.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';
import { useRating } from './useRating';

// ── Slot ──────────────────────────────────────────────

/** Rating slot isimleri / Rating slot names. */
export type RatingSlot = 'root' | 'star' | 'label';

// ── Types ─────────────────────────────────────────────

/** Rating boyutu / Rating size */
export type RatingSize = 'sm' | 'md' | 'lg';

// ── Context (Compound API) ──────────────────────────

interface RatingContextValue {
  value: number;
  hoveredValue: number | null;
  isHovering: boolean;
  count: number;
  allowHalf: boolean;
  readOnly: boolean;
  size: RatingSize;
  setValue: (value: number) => void;
  hover: (value: number) => void;
  hoverEnd: () => void;
  classNames: ClassNames<RatingSlot> | undefined;
  styles: Styles<RatingSlot> | undefined;
}

const RatingContext = createContext<RatingContextValue | null>(null);

function useRatingContext(): RatingContextValue {
  const ctx = useContext(RatingContext);
  if (!ctx) throw new Error('Rating compound sub-components must be used within <Rating>.');
  return ctx;
}

// ── Compound: Rating.Star ────────────────────────────

/** Rating.Star props */
export interface RatingStarProps {
  /** Yildiz indeksi (0-tabanli) / Star index (0-based) */
  index: number;
  /** Ozel ikon / Custom icon */
  icon?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const RatingStar = forwardRef<HTMLButtonElement, RatingStarProps>(
  function RatingStar(props, ref) {
    const { index, icon, className } = props;
    const ctx = useRatingContext();

    const displayValue = ctx.isHovering && ctx.hoveredValue !== null
      ? ctx.hoveredValue
      : ctx.value;

    const isFull = displayValue >= index + 1;
    const isHalf = !isFull && ctx.allowHalf && displayValue >= index + 0.5;

    const baseClass = [
      starStyle,
      sizeStyles[ctx.size],
      ctx.readOnly ? starReadOnlyStyle : '',
    ].filter(Boolean).join(' ');

    const slot = getSlotProps('star', baseClass, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const filledColor = 'var(--rel-color-warning, #f59e0b)';
    const emptyColor = 'var(--rel-color-border, #d1d5db)';

    const handleClick = () => {
      if (ctx.readOnly) return;
      ctx.setValue(index + 1);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ctx.readOnly) return;
      if (ctx.allowHalf) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const isLeftHalf = x < rect.width / 2;
        ctx.hover(isLeftHalf ? index + 0.5 : index + 1);
      } else {
        ctx.hover(index + 1);
      }
    };

    const handleMouseLeave = () => {
      ctx.hoverEnd();
    };

    const starContent = icon || <StarIcon />;

    return (
      <button
        ref={ref}
        type="button"
        className={cls}
        style={slot.style}
        data-testid="rating-star"
        role="radio"
        aria-checked={isFull || isHalf}
        aria-label={`Star ${index + 1}`}
        tabIndex={-1}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {isHalf ? (
          <span
            style={{
              position: 'relative',
              display: 'inline-flex',
              fontSize: 'inherit',
            }}
          >
            <span style={{ color: emptyColor, display: 'inline-flex' }}>
              {starContent}
            </span>
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                overflow: 'hidden',
                color: filledColor,
                display: 'inline-flex',
              }}
            >
              {starContent}
            </span>
          </span>
        ) : (
          <span style={{ color: isFull ? filledColor : emptyColor, display: 'inline-flex' }}>
            {starContent}
          </span>
        )}
      </button>
    );
  },
);

// ── Compound: Rating.Label ───────────────────────────

/** Rating.Label props */
export interface RatingLabelProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const RatingLabel = forwardRef<HTMLSpanElement, RatingLabelProps>(
  function RatingLabel(props, ref) {
    const { children, className } = props;
    const ctx = useRatingContext();
    const slot = getSlotProps('label', labelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="rating-label"
      >
        {children}
      </span>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface RatingComponentProps extends SlotStyleProps<RatingSlot> {
  /** Kontrollü deger / Controlled value */
  value?: number;
  /** Varsayilan deger / Default value */
  defaultValue?: number;
  /** Yildiz sayisi / Star count */
  count?: number;
  /** Yarim yildiz destegi / Allow half star */
  allowHalf?: boolean;
  /** Salt okunur mu / Read only */
  readOnly?: boolean;
  /** Boyut / Size */
  size?: RatingSize;
  /** Deger degistiginde callback / On change callback */
  onChange?: (value: number) => void;
  /** Ozel ikon / Custom icon */
  icon?: ReactNode;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const RatingBase = forwardRef<HTMLDivElement, RatingComponentProps>(
  function Rating(props, ref) {
    const {
      value: controlledValue,
      defaultValue = 0,
      count = 5,
      allowHalf = false,
      readOnly = false,
      size = 'md',
      onChange,
      icon,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const {
      value: hookValue,
      hoveredValue,
      isHovering,
      setValue,
      hover,
      hoverEnd,
    } = useRating({
      defaultValue: controlledValue !== undefined ? controlledValue : defaultValue,
      count,
      allowHalf,
      readOnly,
      onChange,
    });

    const value = hookValue;

    // ── Slots ──
    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const ctxValue: RatingContextValue = {
      value,
      hoveredValue,
      isHovering,
      count,
      allowHalf,
      readOnly,
      size,
      setValue,
      hover,
      hoverEnd,
      classNames,
      styles,
    };

    // ── Keyboard handler ──
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (readOnly) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp': {
          e.preventDefault();
          const step = allowHalf ? 0.5 : 1;
          const next = Math.min(value + step, count);
          setValue(next);
          break;
        }
        case 'ArrowLeft':
        case 'ArrowDown': {
          e.preventDefault();
          const step = allowHalf ? 0.5 : 1;
          const next = Math.max(value - step, 0);
          setValue(next);
          break;
        }
        case 'Home': {
          e.preventDefault();
          setValue(0);
          break;
        }
        case 'End': {
          e.preventDefault();
          setValue(count);
          break;
        }
      }
    };

    // ── Compound API ──
    if (children) {
      return (
        <RatingContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="rating-root"
            data-size={size}
            role="radiogroup"
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            {children}
          </div>
        </RatingContext.Provider>
      );
    }

    // ── Props-based API ──
    const starSlotBase = [
      starStyle,
      sizeStyles[size],
      readOnly ? starReadOnlyStyle : '',
    ].filter(Boolean).join(' ');

    const filledColor = 'var(--rel-color-warning, #f59e0b)';
    const emptyColor = 'var(--rel-color-border, #d1d5db)';

    const displayValue = isHovering && hoveredValue !== null ? hoveredValue : value;

    const stars = Array.from({ length: count }, (_, i) => {
      const isFull = displayValue >= i + 1;
      const isHalf = !isFull && allowHalf && displayValue >= i + 0.5;

      const starSlot = getSlotProps('star', starSlotBase, classNames, styles);

      const handleStarClick = () => {
        if (readOnly) return;
        setValue(i + 1);
      };

      const handleStarMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (readOnly) return;
        if (allowHalf) {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const isLeftHalf = x < rect.width / 2;
          hover(isLeftHalf ? i + 0.5 : i + 1);
        } else {
          hover(i + 1);
        }
      };

      const handleStarMouseLeave = () => {
        hoverEnd();
      };

      const starContent = icon || <StarIcon />;

      return (
        <button
          key={i}
          type="button"
          className={starSlot.className}
          style={starSlot.style}
          data-testid="rating-star"
          role="radio"
          aria-checked={isFull || isHalf}
          aria-label={`Star ${i + 1}`}
          tabIndex={-1}
          onClick={handleStarClick}
          onMouseMove={handleStarMouseMove}
          onMouseLeave={handleStarMouseLeave}
        >
          {isHalf ? (
            <span
              style={{
                position: 'relative',
                display: 'inline-flex',
                fontSize: 'inherit',
              }}
            >
              <span style={{ color: emptyColor, display: 'inline-flex' }}>
                {starContent}
              </span>
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '50%',
                  overflow: 'hidden',
                  color: filledColor,
                  display: 'inline-flex',
                }}
              >
                {starContent}
              </span>
            </span>
          ) : (
            <span style={{ color: isFull ? filledColor : emptyColor, display: 'inline-flex' }}>
              {starContent}
            </span>
          )}
        </button>
      );
    });

    return (
      <div
        ref={ref}
        className={rootClassName}
        style={{ ...rootSlot.style, ...styleProp }}
        data-testid="rating-root"
        data-size={size}
        role="radiogroup"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className={starGroupStyle}>
          {stars}
        </div>
      </div>
    );
  },
);

/**
 * Rating bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Rating defaultValue={3} count={5} onChange={(v) => console.log(v)} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Rating>
 *   <Rating.Star index={0} />
 *   <Rating.Star index={1} />
 *   <Rating.Star index={2} />
 *   <Rating.Label>3 of 5</Rating.Label>
 * </Rating>
 * ```
 */
export const Rating = Object.assign(RatingBase, {
  Star: RatingStar,
  Label: RatingLabel,
});
