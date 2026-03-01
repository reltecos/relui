/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Resizable — boyutlandırılabilir wrapper bileşeni.
 *
 * Kenar ve köşe handle'larıyla pointer drag ile boyut değiştirme.
 *
 * @packageDocumentation
 */

import React, { forwardRef, type CSSProperties } from 'react';
import type { ResizeDirection } from '@relteco/relui-core';
import { getSlotProps, type SlotStyleProps } from '../utils';
import { useResizable, type UseResizableProps } from './useResizable';
import { rootStyle, handleStyles } from './resizable.css';

/** Resizable slot isimleri. */
export type ResizableSlot = 'root' | 'handle';

/** Varsayılan tüm yönler. */
const ALL_DIRECTIONS: ResizeDirection[] = [
  'top', 'right', 'bottom', 'left',
  'topLeft', 'topRight', 'bottomLeft', 'bottomRight',
];

/** Resizable bileşen prop'ları. */
export interface ResizableComponentProps
  extends UseResizableProps,
    SlotStyleProps<ResizableSlot>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Root element inline style. */
  style?: CSSProperties;
}

/**
 * Resizable — boyutlandırılabilir wrapper.
 *
 * @example
 * ```tsx
 * <Resizable defaultWidth={300} defaultHeight={200} minWidth={100}>
 *   <div>İçerik</div>
 * </Resizable>
 * ```
 */
export const Resizable = forwardRef<HTMLDivElement, ResizableComponentProps>(
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

    return (
      <div
        ref={mergedRef}
        {...rest}
        className={finalClass}
        style={rootSlot.style}
        data-resizing={isResizing || undefined}
        data-disabled={disabled || undefined}
      >
        {children}

        {/* Handle'lar */}
        {!disabled && directions.map((direction) => {
          const handleProps = getHandleProps(direction);
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
              style={{ ...handleSlot.style, ...handleProps.style }}
              onPointerDown={handleProps.onPointerDown}
              data-direction={direction}
              aria-hidden="true"
            />
          );
        })}
      </div>
    );
  },
);
