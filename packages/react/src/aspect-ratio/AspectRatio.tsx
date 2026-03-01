/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * AspectRatio — sabit en-boy oranı koruyan konteyner bileşeni.
 * CSS aspect-ratio property kullanır.
 *
 * @packageDocumentation
 */

import { forwardRef } from 'react';
import { Box, type BoxProps } from '../box';

/** AspectRatio slot isimleri. */
export type AspectRatioSlot = 'root';

/**
 * AspectRatio prop'ları.
 */
export interface AspectRatioProps extends BoxProps {
  /**
   * En-boy oranı. Sayı (ör: 16/9) veya string (ör: '16/9').
   * Varsayılan: 1 (kare).
   */
  ratio?: number | string;
}

/**
 * AspectRatio — sabit en-boy oranı koruyan konteyner bileşeni.
 *
 * CSS `aspect-ratio` property kullanır. İçerik oranı koruyarak ölçeklenir.
 *
 * @example
 * ```tsx
 * <AspectRatio ratio={16 / 9} width="full">
 *   <img src="video-thumbnail.jpg" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
 * </AspectRatio>
 *
 * <AspectRatio ratio={1} width={48}>
 *   <Box style={{ background: 'linear-gradient(45deg, #6366f1, #ec4899)' }} />
 * </AspectRatio>
 * ```
 */
export const AspectRatio = forwardRef<HTMLElement, AspectRatioProps>(
  function AspectRatio(props, ref) {
    const { ratio = 1, style, ...rest } = props;

    return (
      <Box
        ref={ref}
        overflow="hidden"
        position="relative"
        style={{
          ...style,
          aspectRatio: typeof ratio === 'number' ? String(ratio) : ratio,
        }}
        {...rest}
      />
    );
  },
);
