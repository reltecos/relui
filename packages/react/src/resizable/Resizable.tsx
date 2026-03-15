/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Resizable — boyutlandirilabilir wrapper bilesen (Dual API).
 * Resizable — resizable wrapper component (Dual API).
 *
 * Props-based: `<Resizable defaultWidth={300}>...</Resizable>`
 * Compound:    `<Resizable defaultWidth={300}><Resizable.Handle direction="right" /></Resizable>`
 *
 * Kenar ve kose handle lariyla pointer drag ile boyut degistirme.
 *
 * @packageDocumentation
 */

import React, { forwardRef, createContext, useContext, type CSSProperties, type ReactNode } from 'react';
import type { ResizeDirection } from '@relteco/relui-core';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils';
import { useResizable, type UseResizableProps } from './useResizable';
import { rootStyle, handleStyles } from './resizable.css';

/** Resizable slot isimleri. */
export type ResizableSlot = 'root' | 'handle';

/** Varsayilan tum yonler. */
const ALL_DIRECTIONS: ResizeDirection[] = [
  'top', 'right', 'bottom', 'left',
  'topLeft', 'topRight', 'bottomLeft', 'bottomRight',
];

// ── Context (Compound API) ──────────────────────────

interface ResizableContextValue {
  classNames: ClassNames<ResizableSlot> | undefined;
  styles: Styles<ResizableSlot> | undefined;
  getHandleProps: (direction: ResizeDirection) => {
    style: CSSProperties;
    onPointerDown: (e: React.PointerEvent) => void;
  };
  disabled: boolean | undefined;
}

const ResizableContext = createContext<ResizableContextValue | null>(null);

function useResizableContext(): ResizableContextValue {
  const ctx = useContext(ResizableContext);
  if (!ctx) throw new Error('Resizable compound sub-components must be used within <Resizable>.');
  return ctx;
}

// ── Compound: Resizable.Handle ──────────────────────

/** Resizable.Handle props */
export interface ResizableHandleProps {
  /** Handle yonu / Handle direction */
  direction: ResizeDirection;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: CSSProperties;
  /** Icerik / Content (opsiyonel) */
  children?: ReactNode;
}

const ResizableHandle = forwardRef<HTMLDivElement, ResizableHandleProps>(
  function ResizableHandle(props, ref) {
    const { direction, className, style: styleProp, children } = props;
    const ctx = useResizableContext();
    const handleProps = ctx.getHandleProps(direction);
    const dirStyle = handleStyles[direction] as string | undefined;
    const slot = getSlotProps('handle', dirStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls || undefined}
        style={{ ...slot.style, ...handleProps.style, ...styleProp }}
        onPointerDown={handleProps.onPointerDown}
        data-direction={direction}
        data-testid={`resizable-handle-${direction}`}
        aria-hidden="true"
      >
        {children}
      </div>
    );
  },
);

/** Resizable bilesen prop lari. */
export interface ResizableComponentProps
  extends UseResizableProps,
    SlotStyleProps<ResizableSlot>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Root element inline style. */
  style?: CSSProperties;
}

/**
 * Resizable — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Resizable defaultWidth={300} defaultHeight={200} minWidth={100}>
 *   <div>Icerik</div>
 * </Resizable>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Resizable defaultWidth={300} defaultHeight={200} directions={[]}>
 *   <div>Icerik</div>
 *   <Resizable.Handle direction="right" />
 *   <Resizable.Handle direction="bottom" />
 * </Resizable>
 * ```
 */
const ResizableBase = forwardRef<HTMLDivElement, ResizableComponentProps>(
  function Resizable(props, ref) {
    const {
      children,
      className,
      style,
      classNames,
      styles,
      defaultWidth,
      defaultHeight,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      directions = ALL_DIRECTIONS,
      disabled,
      onResize,
      onResizeEnd,
      ...rest
    } = props;

    const {
      rootRef,
      width,
      height,
      isResizing,
      getHandleProps,
    } = useResizable({
      defaultWidth,
      defaultHeight,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      directions,
      disabled,
      onResize,
      onResizeEnd,
    });

    // ── Ref merge ────────────────────────────────────────

    const mergedRef = (node: HTMLDivElement | null) => {
      (rootRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    // ── Slot props ───────────────────────────────────────

    const sizeStyle: CSSProperties = { width, height };

    const rootSlot = getSlotProps(
      'root',
      rootStyle,
      classNames,
      styles,
      { ...sizeStyle, ...style },
    );

    const finalClass = [rootSlot.className, className].filter(Boolean).join(' ') || undefined;

    const ctxValue: ResizableContextValue = {
      classNames,
      styles,
      getHandleProps,
      disabled,
    };

    return (
      <ResizableContext.Provider value={ctxValue}>
        <div
          ref={mergedRef}
          {...rest}
          className={finalClass}
          style={rootSlot.style}
          data-resizing={isResizing || undefined}
          data-disabled={disabled || undefined}
        >
          {children}

          {/* Handle lar */}
          {!disabled && directions.map((direction) => {
            const hProps = getHandleProps(direction);
            const handleSlot = getSlotProps(
              'handle',
              handleStyles[direction],
              classNames,
              styles,
            );
            return (
              <div
                key={direction}
                className={handleSlot.className || undefined}
                style={{ ...handleSlot.style, ...hProps.style }}
                onPointerDown={hProps.onPointerDown}
                data-direction={direction}
                aria-hidden="true"
              />
            );
          })}
        </div>
      </ResizableContext.Provider>
    );
  },
);

/**
 * Resizable bilesen — Dual API (props-based + compound).
 */
export const Resizable = Object.assign(ResizableBase, {
  Handle: ResizableHandle,
});
