/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Box — polymorphic layout primitive (Dual API).
 * Tum layout bilesenlerinin temeli. Sprinkles ile responsive prop destekler.
 *
 * Props-based: `<Box display="flex" gap={4} p={6}>icerik</Box>`
 * Compound:    `<Box>icerik</Box>` (minimal — sub-component gereksiz)
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  createElement,
  type ElementType,
  type HTMLAttributes,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from 'react';
import { sprinkles, type Sprinkles } from '../utils/sprinkles.css';
import { rootStyle } from './box.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** Box slot isimleri / Box slot names. */
export type BoxSlot = 'root';

// ── Types ─────────────────────────────────────────────

/**
 * Box prop'lari.
 *
 * Tum Sprinkles responsive prop'lari + HTML attribute'lari + Slot API.
 */
export type BoxProps = Sprinkles &
  SlotStyleProps<BoxSlot> & {
    /** Render edilecek HTML elementi. Varsayilan: 'div'. */
    as?: ElementType;
    /** Alt elementler. */
    children?: ReactNode;
    /** Root elemente ek CSS sinifi. */
    className?: string;
    /** Root elemente inline stil. */
    style?: CSSProperties;
    /** Ref. */
    ref?: Ref<HTMLElement>;
  } & Omit<HTMLAttributes<HTMLElement>, keyof Sprinkles>;

// ── Component ─────────────────────────────────────────

/**
 * Box — polymorphic layout primitive (Dual API).
 *
 * Tum layout prop'larini responsive olarak destekler.
 * `as` prop ile farkli HTML elementleri olarak render edilebilir.
 *
 * @example Props-based
 * ```tsx
 * <Box display="flex" gap={4} p={6}>
 *   <Box width="1/3">Sol</Box>
 *   <Box width="2/3">Sag</Box>
 * </Box>
 * ```
 *
 * @example Responsive
 * ```tsx
 * <Box
 *   display={{ base: 'block', md: 'flex' }}
 *   gap={{ base: 2, lg: 4 }}
 *   p={{ base: 4, md: 6, lg: 8 }}
 * >
 *   Responsive layout
 * </Box>
 * ```
 */
export const Box = forwardRef<HTMLElement, BoxProps>(function Box(props, ref) {
  const {
    as: Component = 'div',
    className,
    style,
    classNames,
    styles,
    children,
    ...rest
  } = props;

  // Sprinkles prop'larini HTML prop'larindan ayir
  const sprinklesProps: Record<string, unknown> = {};
  const htmlProps: Record<string, unknown> = {};

  for (const key of Object.keys(rest)) {
    if ((sprinkles.properties as Set<string>).has(key)) {
      sprinklesProps[key] = (rest as Record<string, unknown>)[key];
    } else {
      htmlProps[key] = (rest as Record<string, unknown>)[key];
    }
  }

  // Atomic CSS class'larini olustur
  const atomicClass = Object.keys(sprinklesProps).length > 0
    ? sprinkles(sprinklesProps as Sprinkles)
    : '';

  // Root base + sprinkles merge
  const baseClass = [rootStyle, atomicClass].filter(Boolean).join(' ');

  // Slot API: className + classNames.root + sprinkles merge
  const { className: slotClass, style: slotStyle } = getSlotProps(
    'root',
    baseClass,
    classNames,
    styles,
    style,
  );
  const finalClass = [slotClass, className].filter(Boolean).join(' ');

  return createElement(Component, {
    ref,
    ...(finalClass ? { className: finalClass } : {}),
    ...(slotStyle ? { style: slotStyle } : {}),
    ...htmlProps,
    children,
  });
});
