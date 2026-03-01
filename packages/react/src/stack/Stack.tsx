/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Stack — dikey veya yatay yığın layout bileşeni.
 * Flex üzerine direction ve spacing varsayılanları ekler.
 *
 * @packageDocumentation
 */

import { forwardRef } from 'react';
import { Flex, type FlexProps } from '../flex';
import type { Sprinkles } from '../utils/sprinkles.css';

/** Stack slot isimleri. */
export type StackSlot = 'root';

/**
 * Stack prop'ları.
 *
 * Flex'in tüm prop'larını destekler + `spacing` kısa yolu.
 */
export interface StackProps extends Omit<FlexProps, 'direction'> {
  /** Yığın yönü. Varsayılan: 'vertical' (column). */
  direction?: 'vertical' | 'horizontal';
  /** Elemanlar arası boşluk (gap). Spacing token değeri. */
  spacing?: Sprinkles['gap'];
}

/**
 * Stack — dikey veya yatay yığın layout bileşeni.
 *
 * `direction="vertical"` varsayılanıyla Flex. `spacing` ile gap kontrolü.
 *
 * @example
 * ```tsx
 * <Stack spacing={4}>
 *   <Box>Item 1</Box>
 *   <Box>Item 2</Box>
 *   <Box>Item 3</Box>
 * </Stack>
 *
 * <Stack direction="horizontal" spacing={{ base: 2, md: 4 }}>
 *   <Box>Sol</Box>
 *   <Box>Sağ</Box>
 * </Stack>
 * ```
 */
export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(props, ref) {
  const { direction = 'vertical', spacing, ...rest } = props;

  const flexDirection = direction === 'horizontal' ? 'row' : 'column';

  return (
    <Flex
      ref={ref}
      direction={flexDirection as FlexProps['direction']}
      {...(spacing !== undefined ? { gap: spacing } : {})}
      {...rest}
    />
  );
});
