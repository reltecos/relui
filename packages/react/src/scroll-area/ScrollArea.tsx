/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ScrollArea — ozel scrollbar li scroll bolgesi bilesen (Dual API).
 * ScrollArea — custom scrollbar scroll area component (Dual API).
 *
 * Props-based: `<ScrollArea height={300}>...</ScrollArea>`
 * Compound:    `<ScrollArea height={300}><ScrollArea.Viewport>...</ScrollArea.Viewport></ScrollArea>`
 *
 * Native scrollbar lari gizleyip ozel thumb/track render eder.
 * Hover, scroll, always, auto gorunurluk modlari destekler.
 *
 * @packageDocumentation
 */

import React, { forwardRef, createContext, useContext, type CSSProperties, type ReactNode } from 'react';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils';
import { useScrollArea, type UseScrollAreaProps } from './useScrollArea';
import {
  rootStyle,
  viewportStyle,
  scrollbarRecipe,
  thumbStyle,
  cornerStyle,
} from './scroll-area.css';

/** ScrollArea slot isimleri. */
export type ScrollAreaSlot =
  | 'root'
  | 'viewport'
  | 'scrollbarY'
  | 'scrollbarX'
  | 'thumbY'
  | 'thumbX'
  | 'corner';

// ── Context (Compound API) ──────────────────────────

interface ScrollAreaContextValue {
  classNames: ClassNames<ScrollAreaSlot> | undefined;
  styles: Styles<ScrollAreaSlot> | undefined;
}

const ScrollAreaContext = createContext<ScrollAreaContextValue | null>(null);

function useScrollAreaContext(): ScrollAreaContextValue {
  const ctx = useContext(ScrollAreaContext);
  if (!ctx) throw new Error('ScrollArea compound sub-components must be used within <ScrollArea>.');
  return ctx;
}

// ── Compound: ScrollArea.Viewport ────────────────────

/** ScrollArea.Viewport props */
export interface ScrollAreaViewportProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: CSSProperties;
}

const ScrollAreaViewport = forwardRef<HTMLDivElement, ScrollAreaViewportProps>(
  function ScrollAreaViewport(props, ref) {
    const { children, className, style: styleProp } = props;
    const ctx = useScrollAreaContext();
    const slot = getSlotProps('viewport', viewportStyle, ctx.classNames, ctx.styles, styleProp);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls || undefined}
        style={slot.style}
        data-testid="scroll-area-viewport"
      >
        {children}
      </div>
    );
  },
);

// ── Compound: ScrollArea.Scrollbar ───────────────────

/** ScrollArea.Scrollbar props */
export interface ScrollAreaScrollbarProps {
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: CSSProperties;
  /** Scrollbar yonu / Scrollbar orientation */
  orientation?: 'vertical' | 'horizontal';
}

const ScrollAreaScrollbar = forwardRef<HTMLDivElement, ScrollAreaScrollbarProps>(
  function ScrollAreaScrollbar(props, ref) {
    const { className, style: styleProp, orientation = 'vertical' } = props;
    const ctx = useScrollAreaContext();
    const slotName = orientation === 'vertical' ? 'scrollbarY' as const : 'scrollbarX' as const;
    const slot = getSlotProps(slotName, undefined, ctx.classNames, ctx.styles, styleProp);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls || undefined}
        style={slot.style}
        data-testid={`scroll-area-scrollbar-${orientation}`}
        data-orientation={orientation}
        aria-hidden="true"
      />
    );
  },
);

/** ScrollArea bilesen prop lari. */
export interface ScrollAreaComponentProps
  extends UseScrollAreaProps,
    SlotStyleProps<ScrollAreaSlot>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Root element inline style. */
  style?: CSSProperties;
  /** Scrollbar boyutu. Varsayılan: 'md'. */
  scrollbarSize?: 'sm' | 'md' | 'lg';
  /** Scroll bölgesi yüksekliği — scroll'u aktifleştirmek için gerekli. */
  height?: number | string;
  /** Scroll bölgesi genişliği. */
  width?: number | string;
  /** Scroll bölgesi max yükseklik. */
  maxHeight?: number | string;
}

/**
 * ScrollArea — özel scrollbar'lı scroll bölgesi.
 *
 * @example
 * ```tsx
 * <ScrollArea height={300}>
 *   <div style={{ height: 1000 }}>Uzun içerik...</div>
 * </ScrollArea>
 * ```
 */
const ScrollAreaBase = forwardRef<HTMLDivElement, ScrollAreaComponentProps>(
  function ScrollArea(props, ref) {
    const {
      children,
      className,
      style,
      classNames,
      styles,
      type = 'hover',
      orientation = 'vertical',
      minThumbSize,
      scrollbarSize = 'md',
      height,
      width,
      maxHeight,
      ...rest
    } = props;

    const {
      rootRef,
      viewportRef,
      verticalThumbSize,
      verticalThumbPosition,
      horizontalThumbSize,
      horizontalThumbPosition,
      verticalVisible,
      horizontalVisible,
      showScrollbars,
      getRootProps,
      getViewportProps,
      getScrollbarProps,
      getThumbProps,
    } = useScrollArea({ type, orientation, minThumbSize });

    // ── Ref merge ────────────────────────────────────────

    const mergedRef = (node: HTMLDivElement | null) => {
      (rootRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    // ── Slot props ───────────────────────────────────────

    const rootDimStyle: CSSProperties = {};
    if (height !== undefined) rootDimStyle.height = height;
    if (width !== undefined) rootDimStyle.width = width;
    if (maxHeight !== undefined) rootDimStyle.maxHeight = maxHeight;

    const rootSlot = getSlotProps(
      'root',
      rootStyle,
      classNames,
      styles,
      { ...rootDimStyle, ...style },
    );

    const viewportSlot = getSlotProps('viewport', viewportStyle, classNames, styles);
    const cornerSlot = getSlotProps('corner', cornerStyle, classNames, styles);

    const showBoth = orientation === 'both';
    const showVertical = verticalVisible && (showBoth || orientation === 'vertical');
    const showHorizontal = horizontalVisible && (showBoth || orientation === 'horizontal');

    // ── Scrollbar Y ──────────────────────────────────────

    const scrollbarYClass = scrollbarRecipe({
      orientation: 'vertical',
      visible: showScrollbars && showVertical,
      size: scrollbarSize,
    });
    const scrollbarYSlot = getSlotProps('scrollbarY', scrollbarYClass, classNames, styles);

    const thumbYStyle: CSSProperties = {
      height: `${verticalThumbSize * 100}%`,
      transform: `translateY(${verticalThumbPosition * 100}%)`,
      ...(verticalThumbSize >= 1 ? { display: 'none' } : {}),
    };
    const thumbYSlot = getSlotProps('thumbY', thumbStyle, classNames, styles, thumbYStyle);

    // ── Scrollbar X ──────────────────────────────────────

    const scrollbarXClass = scrollbarRecipe({
      orientation: 'horizontal',
      visible: showScrollbars && showHorizontal,
      size: scrollbarSize,
    });
    const scrollbarXSlot = getSlotProps('scrollbarX', scrollbarXClass, classNames, styles);

    const thumbXStyle: CSSProperties = {
      width: `${horizontalThumbSize * 100}%`,
      transform: `translateX(${horizontalThumbPosition * 100}%)`,
      ...(horizontalThumbSize >= 1 ? { display: 'none' } : {}),
    };
    const thumbXSlot = getSlotProps('thumbX', thumbStyle, classNames, styles, thumbXStyle);

    // ── Viewport overflow ─────────────────────────────────

    const viewportOverflow: CSSProperties = {};
    if (orientation === 'vertical') {
      viewportOverflow.overflowX = 'hidden';
      viewportOverflow.overflowY = 'scroll';
    } else if (orientation === 'horizontal') {
      viewportOverflow.overflowX = 'scroll';
      viewportOverflow.overflowY = 'hidden';
    } else {
      viewportOverflow.overflow = 'scroll';
    }

    const rootProps = getRootProps();
    const viewportProps = getViewportProps();

    const finalRootClass = [rootSlot.className, className].filter(Boolean).join(' ');

    const ctxValue: ScrollAreaContextValue = { classNames, styles };

    return (
      <ScrollAreaContext.Provider value={ctxValue}>
        <div
          ref={mergedRef}
          {...rest}
          className={finalRootClass || undefined}
          style={rootSlot.style}
          data-orientation={orientation}
          data-type={type}
          onPointerEnter={rootProps.onPointerEnter}
          onPointerLeave={rootProps.onPointerLeave}
        >
          {/* Viewport */}
          <div
            ref={viewportRef}
            className={viewportSlot.className || undefined}
            style={{ ...viewportSlot.style, ...viewportOverflow }}
            onScroll={viewportProps.onScroll}
            tabIndex={0}
            role="region"
            aria-label="Scrollable content"
          >
            {children}
          </div>

          {/* Vertical scrollbar */}
          {showVertical && (
            <div
              className={scrollbarYSlot.className || undefined}
              style={scrollbarYSlot.style}
              data-orientation="vertical"
              aria-hidden="true"
              {...getScrollbarProps('y')}
            >
              <div
                className={thumbYSlot.className || undefined}
                style={thumbYSlot.style}
                {...getThumbProps('y')}
              />
            </div>
          )}

          {/* Horizontal scrollbar */}
          {showHorizontal && (
            <div
              className={scrollbarXSlot.className || undefined}
              style={scrollbarXSlot.style}
              data-orientation="horizontal"
              aria-hidden="true"
              {...getScrollbarProps('x')}
            >
              <div
                className={thumbXSlot.className || undefined}
                style={thumbXSlot.style}
                {...getThumbProps('x')}
              />
            </div>
          )}

          {/* Corner — her iki scrollbar da gorunurken */}
          {showVertical && showHorizontal && (
            <div
              className={cornerSlot.className || undefined}
              style={cornerSlot.style}
              aria-hidden="true"
            />
          )}
        </div>
      </ScrollAreaContext.Provider>
    );
  },
);

/**
 * ScrollArea bilesen — Dual API (props-based + compound).
 */
export const ScrollArea = Object.assign(ScrollAreaBase, {
  Viewport: ScrollAreaViewport,
  Scrollbar: ScrollAreaScrollbar,
});
