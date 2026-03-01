/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Box — polymorphic layout primitive.
 * Tüm layout bileşenlerinin temeli. Sprinkles ile responsive prop destekler.
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
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** Box slot isimleri. */
export type BoxSlot = 'root';

/**
 * Box prop'ları.
 *
 * Tüm Sprinkles responsive prop'ları + HTML attribute'ları + Slot API.
 */
export type BoxProps = Sprinkles &
  SlotStyleProps<BoxSlot> & {
    /** Render edilecek HTML elementi. Varsayılan: 'div'. */
    as?: ElementType;
    /** Alt elementler. */
    children?: ReactNode;
    /** Root elemente ek CSS sınıfı. */
    className?: string;
    /** Root elemente inline stil. */
    style?: CSSProperties;
    /** Ref. */
    ref?: Ref<HTMLElement>;
  } & Omit<HTMLAttributes<HTMLElement>, keyof Sprinkles>;

/**
 * Box — polymorphic layout primitive.
 *
 * Tüm layout prop'larını responsive olarak destekler.
 * `as` prop ile farklı HTML elementleri olarak render edilebilir.
 *
 * @example
 * ```tsx
 * <Box display="flex" gap={4} p={6}>
 *   <Box width="1/3">Sol</Box>
 *   <Box width="2/3">Sağ</Box>
 * </Box>
 *
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

  // Sprinkles prop'larını HTML prop'larından ayır
  const sprinklesProps: Record<string, unknown> = {};
  const htmlProps: Record<string, unknown> = {};

  for (const key of Object.keys(rest)) {
    if ((sprinkles.properties as Set<string>).has(key)) {
      sprinklesProps[key] = (rest as Record<string, unknown>)[key];
    } else {
      htmlProps[key] = (rest as Record<string, unknown>)[key];
    }
  }

  // Atomic CSS class'larını oluştur
  const atomicClass = Object.keys(sprinklesProps).length > 0
    ? sprinkles(sprinklesProps as Sprinkles)
    : '';

  // Slot API: className + classNames.root + sprinkles merge
  const { className: slotClass, style: slotStyle } = getSlotProps(
    'root',
    atomicClass,
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
