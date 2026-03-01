/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Flex — flexbox layout bileşeni.
 * Box üzerine display="flex" varsayılanı ve kısa yol prop'ları ekler.
 *
 * @packageDocumentation
 */

import { forwardRef } from 'react';
import { Box, type BoxProps } from '../box';
import type { Sprinkles } from '../utils/sprinkles.css';

/** Flex slot isimleri. */
export type FlexSlot = 'root';

/**
 * Flex prop'ları.
 *
 * Box'un tüm prop'larını destekler + kısa yol alias'ları.
 */
export interface FlexProps extends BoxProps {
  /** flexDirection kısa yolu. */
  direction?: Sprinkles['flexDirection'];
  /** alignItems kısa yolu. */
  align?: Sprinkles['alignItems'];
  /** justifyContent kısa yolu. */
  justify?: Sprinkles['justifyContent'];
  /** flexWrap kısa yolu. */
  wrap?: Sprinkles['flexWrap'];
}

/**
 * Flex — flexbox layout bileşeni.
 *
 * `display="flex"` varsayılanıyla Box. `direction`, `align`, `justify`, `wrap`
 * kısa yolları ile daha okunur JSX.
 *
 * @example
 * ```tsx
 * <Flex direction="column" align="center" gap={4}>
 *   <Box>Item 1</Box>
 *   <Box>Item 2</Box>
 * </Flex>
 *
 * <Flex
 *   direction={{ base: 'column', md: 'row' }}
 *   justify="space-between"
 *   gap={{ base: 2, lg: 4 }}
 * >
 *   <Box>Sol</Box>
 *   <Box>Sağ</Box>
 * </Flex>
 * ```
 */
export const Flex = forwardRef<HTMLElement, FlexProps>(function Flex(props, ref) {
  const { direction, align, justify, wrap, ...rest } = props;

  return (
    <Box
      ref={ref}
      display="flex"
      {...(direction !== undefined ? { flexDirection: direction } : {})}
      {...(align !== undefined ? { alignItems: align } : {})}
      {...(justify !== undefined ? { justifyContent: justify } : {})}
      {...(wrap !== undefined ? { flexWrap: wrap } : {})}
      {...rest}
    />
  );
});
