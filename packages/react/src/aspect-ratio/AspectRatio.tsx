/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * AspectRatio — sabit en-boy orani koruyan konteyner bilesen (Dual API).
 * CSS aspect-ratio property kullanir.
 *
 * Props-based: `<AspectRatio ratio={16/9}>icerik</AspectRatio>`
 * Compound:    minimal — sub-component gereksiz
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { rootStyle } from './aspect-ratio.css';
import { Box, type BoxProps } from '../box';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** AspectRatio slot isimleri / AspectRatio slot names. */
export type AspectRatioSlot = 'root';

// ── Types ─────────────────────────────────────────────

/**
 * AspectRatio prop'lari.
 */
export interface AspectRatioProps extends Omit<BoxProps, 'classNames' | 'styles'>, SlotStyleProps<AspectRatioSlot> {
  /**
   * En-boy orani. Sayi (orn: 16/9) veya string (orn: '16/9').
   * Varsayilan: 1 (kare).
   */
  ratio?: number | string;
  /** Alt elementler. */
  children?: ReactNode;
  /** Inline stil. */
  style?: CSSProperties;
}

// ── Component ─────────────────────────────────────────

const AspectRatioBase = forwardRef<HTMLElement, AspectRatioProps>(
  function AspectRatio(props, ref) {
    const {
      ratio = 1,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
      ...rest
    } = props;

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    return (
      <Box
        ref={ref}
        className={rootClassName}
        style={{
          ...rootSlot.style,
          ...styleProp,
          aspectRatio: typeof ratio === 'number' ? String(ratio) : ratio,
        }}
        data-testid="aspect-ratio-root"
        {...rest}
      >
        {children}
      </Box>
    );
  },
);

/**
 * AspectRatio bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <AspectRatio ratio={16 / 9} width="full">
 *   <img src="video-thumbnail.jpg" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
 * </AspectRatio>
 * ```
 *
 * @example Kare
 * ```tsx
 * <AspectRatio ratio={1} width={48}>
 *   <Box>Kare icerik</Box>
 * </AspectRatio>
 * ```
 */
export const AspectRatio = AspectRatioBase;
