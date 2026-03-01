/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Container — ortlanmış, max-width sınırlamalı layout bileşeni.
 * Sayfa içeriğini responsive genişlikte tutar.
 *
 * @packageDocumentation
 */

import { forwardRef } from 'react';
import { Box, type BoxProps } from '../box';

/** Container slot isimleri. */
export type ContainerSlot = 'root';

/** Container boyut presetleri. */
export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

/** Container boyut → maxWidth eşlemesi (breakpoint değerleri). */
const sizeMap: Record<ContainerSize, string> = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%',
};

/**
 * Container prop'ları.
 *
 * Box'un tüm prop'larını destekler + `size` ve `centerContent` prop'ları.
 */
export interface ContainerProps extends BoxProps {
  /**
   * Maksimum genişlik preseti.
   * Varsayılan: 'lg' (1024px).
   */
  size?: ContainerSize;
  /**
   * İçeriği hem yatay hem dikey ortala.
   * Varsayılan: false.
   */
  centerContent?: boolean;
}

/**
 * Container — ortlanmış, max-width sınırlamalı layout bileşeni.
 *
 * Sayfa içeriğini responsive genişlikte tutar. `mx="auto"` ile ortalanır.
 *
 * @example
 * ```tsx
 * <Container size="lg" px={4}>
 *   <h1>Sayfa İçeriği</h1>
 *   <p>Maksimum 1024px genişlikte, ortalanmış.</p>
 * </Container>
 *
 * <Container size={{ base: 'sm', lg: 'xl' }} centerContent>
 *   <Box>Ortalanmış içerik</Box>
 * </Container>
 * ```
 */
export const Container = forwardRef<HTMLElement, ContainerProps>(
  function Container(props, ref) {
    const { size = 'lg', centerContent = false, style, ...rest } = props;

    const maxWidthValue = sizeMap[size];

    return (
      <Box
        ref={ref}
        width="full"
        mx="auto"
        style={{ ...style, maxWidth: maxWidthValue }}
        {...(centerContent
          ? { display: 'flex', flexDirection: 'column', alignItems: 'center' }
          : {})}
        {...rest}
      />
    );
  },
);
