/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Sticky — scroll'da yapisan eleman bileseni (Dual API).
 *
 * Props-based: `<Sticky offset={16}><nav>Nav</nav></Sticky>`
 * Compound:    `<Sticky offset={16}><Sticky.Content>Nav</Sticky.Content></Sticky>`
 *
 * @packageDocumentation
 */

import React, { forwardRef, createContext, useContext, type CSSProperties, type ReactNode } from 'react';
import { getSlotProps, type SlotStyleProps } from '../utils';
import type { ClassNames, Styles } from '../utils/slot-styles';
import { useSticky, type UseStickyProps } from './useSticky';
import { stickyRootStyle, stickySentinelStyle } from './sticky.css';

/** Sticky slot isimleri. */
export type StickySlot = 'root' | 'sentinel' | 'content';

// ── Context (Compound API) ──────────────────────────

interface StickyContextValue {
  classNames: ClassNames<StickySlot> | undefined;
  styles: Styles<StickySlot> | undefined;
  isStuck: boolean;
}

const StickyContext = createContext<StickyContextValue | null>(null);

/** Sticky compound context hook. */
export function useStickyContext(): StickyContextValue {
  const ctx = useContext(StickyContext);
  if (!ctx) throw new Error('Sticky compound sub-components must be used within <Sticky>.');
  return ctx;
}

// ── Compound: Sticky.Content ────────────────────────

/** Sticky.Content props */
export interface StickyContentProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const StickyContent = forwardRef<HTMLDivElement, StickyContentProps>(
  function StickyContent(props, ref) {
    const { children, className } = props;
    const ctx = useStickyContext();
    const contentSlot = getSlotProps('content', '', ctx.classNames, ctx.styles);
    const cls = className
      ? `${contentSlot.className} ${className}`
      : contentSlot.className || undefined;

    return (
      <div
        ref={ref}
        className={cls}
        style={contentSlot.style}
        data-stuck={ctx.isStuck || undefined}
        data-testid="sticky-content"
      >
        {children}
      </div>
    );
  },
);

/** Sticky bilesen prop'lari. */
export interface StickyComponentProps
  extends UseStickyProps,
    SlotStyleProps<StickySlot>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Root element inline style. */
  style?: CSSProperties;
  /** z-index degeri. Varsayilan: 100. */
  zIndex?: number;
}

/**
 * Sticky — scroll'da yapisan eleman (Dual API).
 *
 * @example Props-based
 * ```tsx
 * <Sticky offset={16}>
 *   <nav>Navigation</nav>
 * </Sticky>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Sticky offset={16}>
 *   <Sticky.Content>Navigation</Sticky.Content>
 * </Sticky>
 * ```
 */
const StickyBase = forwardRef<HTMLDivElement, StickyComponentProps>(
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
      stickyRootStyle,
      classNames,
      styles,
      { ...stickyStyle, ...style },
    );
    const sentinelSlot = getSlotProps('sentinel', stickySentinelStyle, classNames, styles);

    const finalClass = [rootSlot.className, className].filter(Boolean).join(' ') || undefined;

    const sentinelPosition = position === 'top' ? 'before' : 'after';

    const ctxValue: StickyContextValue = { classNames, styles, isStuck };

    return (
      <StickyContext.Provider value={ctxValue}>
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
      </StickyContext.Provider>
    );
  },
);

/**
 * Sticky — Dual API (props-based + compound).
 */
export const Sticky = Object.assign(StickyBase, {
  Content: StickyContent,
});
