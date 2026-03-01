/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Sticky — scroll'da yapışan eleman bileşeni.
 *
 * CSS position: sticky kullanır. IntersectionObserver ile
 * stuck state'i takip edip data-stuck attribute'u ekler.
 *
 * @packageDocumentation
 */

import React, { forwardRef, type CSSProperties } from 'react';
import { getSlotProps, type SlotStyleProps } from '../utils';
import { useSticky, type UseStickyProps } from './useSticky';

/** Sticky slot isimleri. */
export type StickySlot = 'root' | 'sentinel';

/** Sticky bileşen prop'ları. */
export interface StickyComponentProps
  extends UseStickyProps,
    SlotStyleProps<StickySlot>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Root element inline style. */
  style?: CSSProperties;
  /** z-index değeri. Varsayılan: 100. */
  zIndex?: number;
}

/**
 * Sticky — scroll'da yapışan eleman.
 *
 * @example
 * ```tsx
 * <Sticky offset={16}>
 *   <nav>Navigation</nav>
 * </Sticky>
 * ```
 */
export const Sticky = forwardRef<HTMLDivElement, StickyComponentProps>(
  function Sticky(props, ref) {
    const {
      children,
      className,
      style,
      classNames,
      styles,
      position = 'top',
      offset = 0,
      enabled = true,
      onStickyChange,
      zIndex = 100,
      ...rest
    } = props;

    const { sentinelRef, stickyRef, isStuck } = useSticky({
      position,
      offset,
      enabled,
      onStickyChange,
    });

    // ── Ref merge ────────────────────────────────────────

    const mergedRef = (node: HTMLDivElement | null) => {
      (stickyRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    // ── Sticky style ────────────────────────────────────

    const stickyStyle: CSSProperties = {
      position: 'sticky',
      zIndex,
      ...(position === 'top' ? { top: offset } : { bottom: offset }),
    };

    const rootSlot = getSlotProps(
      'root',
      undefined,
      classNames,
      styles,
      { ...stickyStyle, ...style },
    );
    const sentinelSlot = getSlotProps('sentinel', undefined, classNames, styles);

    const finalClass = [rootSlot.className, className].filter(Boolean).join(' ') || undefined;

    const sentinelPosition = position === 'top' ? 'before' : 'after';

    return (
      <>
        {sentinelPosition === 'before' && (
          <div
            ref={sentinelRef}
            className={sentinelSlot.className || undefined}
            style={{
              height: 0,
              width: '100%',
              visibility: 'hidden',
              pointerEvents: 'none',
              ...sentinelSlot.style,
            }}
            aria-hidden="true"
          />
        )}
        <div
          ref={mergedRef}
          {...rest}
          className={finalClass}
          style={rootSlot.style}
          data-stuck={isStuck || undefined}
          data-position={position}
        >
          {children}
        </div>
        {sentinelPosition === 'after' && (
          <div
            ref={sentinelRef}
            className={sentinelSlot.className || undefined}
            style={{
              height: 0,
              width: '100%',
              visibility: 'hidden',
              pointerEvents: 'none',
              ...sentinelSlot.style,
            }}
            aria-hidden="true"
          />
        )}
      </>
    );
  },
);
