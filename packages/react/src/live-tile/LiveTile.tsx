/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * LiveTile — Windows Metro tarzi canli kutucuk bilesen (Dual API).
 * LiveTile — Windows Metro style live tile component (Dual API).
 *
 * Props-based: `<LiveTile faces={[<Comp1 />, <Comp2 />]} interval={3000} />`
 * Compound:    `<LiveTile interval={3000}><LiveTile.Face>...</LiveTile.Face></LiveTile>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, Children, isValidElement, type ReactNode } from 'react';
import type { LiveTileAnimationType } from '@relteco/relui-core';
import {
  rootStyle,
  sizeStyles,
  faceContainerStyle,
  faceBaseStyle,
  faceVisibleStyle,
  faceHiddenStyle,
  fadeHiddenStyle,
  slideHiddenNextStyle,
  slideHiddenPrevStyle,
  flipHiddenNextStyle,
  flipHiddenPrevStyle,
  indicatorStyle,
  indicatorDotBaseStyle,
  indicatorDotActiveStyle,
  indicatorDotInactiveStyle,
} from './live-tile.css';
import { useLiveTile } from './useLiveTile';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** LiveTile slot isimleri / LiveTile slot names. */
export type LiveTileSlot = 'root' | 'faceContainer' | 'face' | 'indicator' | 'indicatorDot';

// ── Types ─────────────────────────────────────────────

/** LiveTile boyutu / LiveTile size */
export type LiveTileSize = 'sm' | 'md' | 'lg';

// ── Context (Compound API) ──────────────────────────

interface LiveTileContextValue {
  size: LiveTileSize;
  animation: LiveTileAnimationType;
  activeIndex: number;
  direction: 'next' | 'prev';
  faceCount: number;
  paused: boolean;
  classNames: ClassNames<LiveTileSlot> | undefined;
  styles: Styles<LiveTileSlot> | undefined;
  goto: (index: number) => void;
}

const LiveTileContext = createContext<LiveTileContextValue | null>(null);

function useLiveTileContext(): LiveTileContextValue {
  const ctx = useContext(LiveTileContext);
  if (!ctx) throw new Error('LiveTile compound sub-components must be used within <LiveTile>.');
  return ctx;
}

// ── Helpers ─────────────────────────────────────────

function getHiddenClassName(animation: LiveTileAnimationType, direction: 'next' | 'prev'): string {
  switch (animation) {
    case 'fade':
      return `${faceBaseStyle} ${fadeHiddenStyle}`;
    case 'slide':
      return direction === 'next'
        ? `${faceBaseStyle} ${slideHiddenNextStyle}`
        : `${faceBaseStyle} ${slideHiddenPrevStyle}`;
    case 'flip':
      return direction === 'next'
        ? `${faceBaseStyle} ${flipHiddenNextStyle}`
        : `${faceBaseStyle} ${flipHiddenPrevStyle}`;
    default:
      return `${faceBaseStyle} ${faceHiddenStyle}`;
  }
}

// ── Compound: LiveTile.Face ─────────────────────────

/** LiveTile.Face props */
export interface LiveTileFaceProps {
  /** Face icerigi / Face content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const LiveTileFace = forwardRef<HTMLDivElement, LiveTileFaceProps>(
  function LiveTileFace(props, ref) {
    const { children, className } = props;
    const ctx = useLiveTileContext();
    const slot = getSlotProps('face', faceBaseStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="live-tile-face">
        {children}
      </div>
    );
  },
);

// ── Compound: LiveTile.Indicator ────────────────────

/** LiveTile.Indicator props */
export interface LiveTileIndicatorProps {
  /** Ek className / Additional className */
  className?: string;
}

const LiveTileIndicator = forwardRef<HTMLDivElement, LiveTileIndicatorProps>(
  function LiveTileIndicator(props, ref) {
    const { className } = props;
    const ctx = useLiveTileContext();
    const slot = getSlotProps('indicator', indicatorStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="live-tile-indicator">
        {Array.from({ length: ctx.faceCount }, (_, i) => {
          const dotSlot = getSlotProps(
            'indicatorDot',
            `${indicatorDotBaseStyle} ${i === ctx.activeIndex ? indicatorDotActiveStyle : indicatorDotInactiveStyle}`,
            ctx.classNames,
            ctx.styles,
          );
          return (
            <button
              key={i}
              type="button"
              className={dotSlot.className}
              style={dotSlot.style}
              data-testid="live-tile-indicator-dot"
              data-active={i === ctx.activeIndex}
              aria-label={`Face ${i + 1}`}
              onClick={() => ctx.goto(i)}
            />
          );
        })}
      </div>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface LiveTileComponentProps extends SlotStyleProps<LiveTileSlot> {
  /** Props-based: face listesi / Face list for auto-render */
  faces?: ReactNode[];
  /** Otomatik gecis suresi (ms) / Auto-advance interval */
  interval?: number;
  /** Animasyon tipi / Animation type */
  animation?: LiveTileAnimationType;
  /** Boyut / Size */
  size?: LiveTileSize;
  /** Duraklatildi mi / Is paused */
  paused?: boolean;
  /** Indicator gosterilsin mi / Show indicator dots */
  showIndicator?: boolean;
  /** Dongu / Loop */
  loop?: boolean;
  /** Index degisince / On index change */
  onChange?: (index: number) => void;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const LiveTileBase = forwardRef<HTMLDivElement, LiveTileComponentProps>(
  function LiveTile(props, ref) {
    const {
      faces,
      interval = 3000,
      animation = 'slide',
      size = 'md',
      paused: pausedProp,
      showIndicator = true,
      loop = true,
      onChange,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    // Face count — compound'da children'dan, props-based'de faces'dan
    const childFaces = children
      ? Children.toArray(children).filter(isValidElement)
      : undefined;
    const faceCount = faces ? faces.length : (childFaces ? childFaces.length : 0);

    const tile = useLiveTile({
      faceCount,
      interval,
      animation,
      paused: pausedProp,
      loop,
      onChange,
    });

    // ── Slots ──
    const rootSlot = getSlotProps('root', `${rootStyle} ${sizeStyles[size]}`, classNames, styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const ctxValue: LiveTileContextValue = {
      size,
      animation,
      activeIndex: tile.activeIndex,
      direction: tile.direction,
      faceCount: tile.faceCount,
      paused: tile.paused,
      classNames,
      styles,
      goto: tile.goto,
    };

    // ── Compound API ──
    if (children && !faces) {
      const faceElements = childFaces ?? [];

      return (
        <LiveTileContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="live-tile-root"
            data-size={size}
            data-animation={animation}
            data-paused={tile.paused}
            aria-roledescription="live tile"
            aria-live="polite"
          >
            <div className={faceContainerStyle} data-testid="live-tile-face-container">
              {faceElements.map((face, i) => {
                const isActive = i === tile.activeIndex;
                const baseCls = isActive
                  ? `${faceBaseStyle} ${faceVisibleStyle}`
                  : getHiddenClassName(animation, tile.direction);
                const faceSlot = getSlotProps('face', baseCls, classNames, styles);

                return (
                  <div
                    key={i}
                    className={faceSlot.className}
                    style={faceSlot.style}
                    data-testid="live-tile-face"
                    data-active={isActive}
                    aria-hidden={!isActive}
                  >
                    {face}
                  </div>
                );
              })}
            </div>
            {showIndicator && faceCount > 1 && (
              <LiveTileIndicator />
            )}
          </div>
        </LiveTileContext.Provider>
      );
    }

    // ── Props-based API ──
    const facesArr = faces ?? [];

    return (
      <LiveTileContext.Provider value={ctxValue}>
        <div
          ref={ref}
          className={rootClassName}
          style={{ ...rootSlot.style, ...styleProp }}
          data-testid="live-tile-root"
          data-size={size}
          data-animation={animation}
          data-paused={tile.paused}
          aria-roledescription="live tile"
          aria-live="polite"
        >
          <div className={faceContainerStyle} data-testid="live-tile-face-container">
            {facesArr.map((face, i) => {
              const isActive = i === tile.activeIndex;
              const baseCls = isActive
                ? `${faceBaseStyle} ${faceVisibleStyle}`
                : getHiddenClassName(animation, tile.direction);
              const faceSlot = getSlotProps('face', baseCls, classNames, styles);

              return (
                <div
                  key={i}
                  className={faceSlot.className}
                  style={faceSlot.style}
                  data-testid="live-tile-face"
                  data-active={isActive}
                  aria-hidden={!isActive}
                >
                  {face}
                </div>
              );
            })}
          </div>
          {showIndicator && faceCount > 1 && (() => {
            const indicatorSlot = getSlotProps('indicator', indicatorStyle, classNames, styles);
            return (
            <div
              className={indicatorSlot.className}
              style={indicatorSlot.style}
              data-testid="live-tile-indicator"
            >
              {facesArr.map((_, i) => {
                const dotSlot = getSlotProps(
                  'indicatorDot',
                  `${indicatorDotBaseStyle} ${i === tile.activeIndex ? indicatorDotActiveStyle : indicatorDotInactiveStyle}`,
                  classNames,
                  styles,
                );
                return (
                  <button
                    key={i}
                    type="button"
                    className={dotSlot.className}
                    style={dotSlot.style}
                    data-testid="live-tile-indicator-dot"
                    data-active={i === tile.activeIndex}
                    aria-label={`Face ${i + 1}`}
                    onClick={() => tile.goto(i)}
                  />
                );
              })}
            </div>
            );
          })()}
        </div>
      </LiveTileContext.Provider>
    );
  },
);

/**
 * LiveTile bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <LiveTile
 *   faces={[<div>Face 1</div>, <div>Face 2</div>]}
 *   interval={3000}
 *   animation="slide"
 * />
 * ```
 *
 * @example Compound
 * ```tsx
 * <LiveTile interval={3000} animation="flip">
 *   <div>Face 1 content</div>
 *   <div>Face 2 content</div>
 * </LiveTile>
 * ```
 */
export const LiveTile = Object.assign(LiveTileBase, {
  Face: LiveTileFace,
  Indicator: LiveTileIndicator,
});
