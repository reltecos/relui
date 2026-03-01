/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Section — semantik sayfa bölümü bileşeni.
 * HTML `<section>` elementi üzerine Box responsive prop'ları.
 *
 * @packageDocumentation
 */

import { forwardRef } from 'react';
import { Box, type BoxProps } from '../box';

/** Section slot isimleri. */
export type SectionSlot = 'root';

/**
 * Section prop'ları.
 *
 * Box'un tüm prop'larını destekler. Varsayılan element: `<section>`.
 */
export type SectionProps = BoxProps;

/**
 * Section — semantik sayfa bölümü bileşeni.
 *
 * `<section>` HTML elementi olarak render edilir. Tüm Box responsive prop'larını destekler.
 * Sayfa içeriğini anlamlı bölümlere ayırmak için kullanılır.
 *
 * @example
 * ```tsx
 * <Section p={{ base: 4, md: 8 }}>
 *   <h2>Bölüm Başlığı</h2>
 *   <p>Bölüm içeriği...</p>
 * </Section>
 *
 * <Section
 *   display="flex"
 *   flexDirection={{ base: 'column', lg: 'row' }}
 *   gap={6}
 *   p={8}
 *   aria-labelledby="features-title"
 * >
 *   <Box>Özellik 1</Box>
 *   <Box>Özellik 2</Box>
 * </Section>
 * ```
 */
export const Section = forwardRef<HTMLElement, SectionProps>(
  function Section(props, ref) {
    return <Box ref={ref} as="section" {...props} />;
  },
);
