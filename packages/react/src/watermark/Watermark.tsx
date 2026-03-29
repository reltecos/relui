/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Watermark — filigran/watermark overlay bilesen (Dual API).
 * Watermark — watermark overlay component (Dual API).
 *
 * Props-based: `<Watermark text="GIZLI" rotate={-22} opacity={0.15}>Icerik</Watermark>`
 * Compound:    `<Watermark><Watermark.Content>Icerik</Watermark.Content><Watermark.Overlay>Ozel</Watermark.Overlay></Watermark>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useMemo, type ReactNode } from 'react';
import {
  rootStyle,
  contentStyle,
  overlayStyle,
  overlaySizeStyles,
} from './watermark.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** Watermark slot isimleri / Watermark slot names. */
export type WatermarkSlot = 'root' | 'content' | 'overlay';

// ── Types ─────────────────────────────────────────────

/** Watermark boyutu / Watermark size */
export type WatermarkSize = 'sm' | 'md' | 'lg';

// ── Helpers ───────────────────────────────────────────

const SIZE_FONT_MAP: Record<WatermarkSize, number> = { sm: 12, md: 14, lg: 16 };
const SIZE_GAP_MAP: Record<WatermarkSize, number> = { sm: 80, md: 120, lg: 160 };

/**
 * SVG data URI olusturur. Tekrarlayan background-image icin.
 * Creates SVG data URI for repeating background-image pattern.
 */
function buildSvgDataUri(
  text: string,
  fontSize: number,
  rotate: number,
  opacity: number,
  gap: number,
): string {
  const w = text.length * fontSize * 0.65 + gap;
  const h = fontSize * 2 + gap;
  const cx = w / 2;
  const cy = h / 2;

  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">`,
    `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle"`,
    ` font-family="system-ui,sans-serif" font-size="${fontSize}"`,
    ` fill="currentColor" opacity="${opacity}"`,
    ` transform="rotate(${rotate} ${cx} ${cy})">${escaped}</text>`,
    `</svg>`,
  ].join('');

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

// ── Context (Compound API) ────────────────────────────

interface WatermarkContextValue {
  size: WatermarkSize;
  classNames: ClassNames<WatermarkSlot> | undefined;
  styles: Styles<WatermarkSlot> | undefined;
}

const WatermarkContext = createContext<WatermarkContextValue | null>(null);

function useWatermarkContext(): WatermarkContextValue {
  const ctx = useContext(WatermarkContext);
  if (!ctx) throw new Error('Watermark compound sub-components must be used within <Watermark>.');
  return ctx;
}

// ── Compound: Watermark.Content ───────────────────────

/** Watermark.Content props */
export interface WatermarkContentProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const WatermarkContent = forwardRef<HTMLDivElement, WatermarkContentProps>(
  function WatermarkContent(props, ref) {
    const { children, className } = props;
    const ctx = useWatermarkContext();
    const slot = getSlotProps('content', contentStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="watermark-content">
        {children}
      </div>
    );
  },
);

// ── Compound: Watermark.Overlay ───────────────────────

/** Watermark.Overlay props */
export interface WatermarkOverlayProps {
  /** Ozel filigran icerigi / Custom watermark content */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const WatermarkOverlay = forwardRef<HTMLDivElement, WatermarkOverlayProps>(
  function WatermarkOverlay(props, ref) {
    const { children, className } = props;
    const ctx = useWatermarkContext();
    const overlayVeClass = `${overlayStyle} ${overlaySizeStyles[ctx.size]}`;
    const slot = getSlotProps('overlay', overlayVeClass, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="watermark-overlay"
        aria-hidden="true"
      >
        {children}
      </div>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface WatermarkComponentProps extends SlotStyleProps<WatermarkSlot> {
  /** Props-based: filigran metni / Watermark text */
  text?: string;
  /** Dondurme acisi (derece) / Rotation angle (degrees) */
  rotate?: number;
  /** Opaklik (0-1) / Opacity (0-1) */
  opacity?: number;
  /** Boyut (font + gap) / Size (font + gap) */
  size?: WatermarkSize;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const WatermarkBase = forwardRef<HTMLDivElement, WatermarkComponentProps>(
  function Watermark(props, ref) {
    const {
      text,
      rotate = -22,
      opacity = 0.15,
      size = 'md',
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const ctxValue: WatermarkContextValue = { size, classNames, styles };

    // ── Compound API (text prop yoksa) ──
    if (text === undefined) {
      return (
        <WatermarkContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="watermark-root"
            data-size={size}
          >
            {children}
          </div>
        </WatermarkContext.Provider>
      );
    }

    // ── Props-based API ──
    const fontSize = SIZE_FONT_MAP[size];
    const gap = SIZE_GAP_MAP[size];

    const bgImage = useMemo(
      () => buildSvgDataUri(text, fontSize, rotate, opacity, gap),
      [text, fontSize, rotate, opacity, gap],
    );

    const contentSlot = getSlotProps('content', contentStyle, classNames, styles);
    const overlayVeClass = `${overlayStyle} ${overlaySizeStyles[size]}`;
    const overlaySlot = getSlotProps('overlay', overlayVeClass, classNames, styles);

    return (
      <div
        ref={ref}
        className={rootClassName}
        style={{ ...rootSlot.style, ...styleProp }}
        data-testid="watermark-root"
        data-size={size}
      >
        <div
          className={contentSlot.className}
          style={contentSlot.style}
          data-testid="watermark-content"
        >
          {children}
        </div>
        <div
          className={overlaySlot.className}
          style={{ ...overlaySlot.style, backgroundImage: bgImage }}
          data-testid="watermark-overlay"
          aria-hidden="true"
        />
      </div>
    );
  },
);

/**
 * Watermark bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Watermark text="GIZLI" rotate={-22} opacity={0.15}>
 *   <p>Korunan icerik</p>
 * </Watermark>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Watermark>
 *   <Watermark.Content>Icerik</Watermark.Content>
 *   <Watermark.Overlay>Ozel filigran</Watermark.Overlay>
 * </Watermark>
 * ```
 */
export const Watermark = Object.assign(WatermarkBase, {
  Content: WatermarkContent,
  Overlay: WatermarkOverlay,
});
