/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ResponsiveBox — breakpoint kurallarıyla otomatik layout değişimi.
 *
 * Container Query veya matchMedia ile mevcut genişliğe göre
 * farklı layout kuralları uygular. Her kural bir breakpoint aralığı
 * ve uygulanacak CSS props içerir.
 *
 * @packageDocumentation
 */

import { forwardRef } from 'react';
import { getSlotProps, type SlotStyleProps } from '../utils';
import { Box, type BoxProps } from '../box';

/** ResponsiveBox slot isimleri. */
export type ResponsiveBoxSlot = 'root';

/** Breakpoint kuralı. */
export interface ResponsiveRule {
  /** Minimum genişlik (px). */
  minWidth?: number;
  /** Maksimum genişlik (px). */
  maxWidth?: number;
  /** Bu aralıkta uygulanacak Box props. */
  props: Omit<BoxProps, 'children' | 'ref' | 'classNames' | 'styles'>;
}

/** ResponsiveBox bileşen prop'ları. */
export interface ResponsiveBoxProps
  extends SlotStyleProps<ResponsiveBoxSlot>,
    Omit<BoxProps, 'classNames' | 'styles'> {
  /** Breakpoint kuralları. */
  rules?: ResponsiveRule[];
}

/**
 * ResponsiveBox — breakpoint kurallarıyla otomatik layout değişimi.
 *
 * Box bileşenini extend eder. Sprinkles responsive props'ları direkt
 * kullanılabilir (`display={{ base: 'block', md: 'flex' }}`), ama
 * `rules` prop'u ile daha karmaşık kurallar tanımlanabilir.
 *
 * @example
 * ```tsx
 * <ResponsiveBox
 *   display={{ base: 'block', md: 'flex' }}
 *   flexDirection={{ base: 'column', lg: 'row' }}
 *   gap={{ base: 4, md: 6 }}
 *   p={{ base: 4, md: 8 }}
 * >
 *   <Box width={{ base: 'full', md: '1/2' }}>Sol</Box>
 *   <Box width={{ base: 'full', md: '1/2' }}>Sağ</Box>
 * </ResponsiveBox>
 * ```
 */
export const ResponsiveBox = forwardRef<HTMLElement, ResponsiveBoxProps>(
  function ResponsiveBox(props, ref) {
    const {
      classNames,
      styles,
      className,
      style,
      ...boxProps
    } = props;

    const rootSlot = getSlotProps('root', undefined, classNames, styles, style);
    const finalClass = [rootSlot.className, className].filter(Boolean).join(' ') || undefined;

    return (
      <Box
        ref={ref}
        {...boxProps}
        className={finalClass}
        style={rootSlot.style}
      />
    );
  },
);
