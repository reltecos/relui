/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Spacer — flex container içinde esnek boşluk bileşeni.
 * Kalan alanı doldurarak elemanları itmek için kullanılır.
 *
 * @packageDocumentation
 */

import { forwardRef, type HTMLAttributes, type CSSProperties, type Ref } from 'react';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** Spacer slot isimleri. */
export type SpacerSlot = 'root';

/**
 * Spacer prop'ları.
 */
export interface SpacerProps
  extends HTMLAttributes<HTMLDivElement>,
    SlotStyleProps<SpacerSlot> {
  /** Sabit genişlik (px veya CSS değeri). Verilmezse flex: 1. */
  size?: string | number;
  /** Ek CSS sınıfı. */
  className?: string;
  /** Inline stil. */
  style?: CSSProperties;
  /** Ref. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * Spacer — flex container içinde esnek boşluk bileşeni.
 *
 * Varsayılan `flex: 1` ile kalan alanı doldurur.
 * `size` prop ile sabit boşluk da verilebilir.
 *
 * @example
 * ```tsx
 * <Flex>
 *   <Box>Sol</Box>
 *   <Spacer />
 *   <Box>Sağ</Box>
 * </Flex>
 *
 * <Flex direction="column">
 *   <Box>Üst</Box>
 *   <Spacer size="2rem" />
 *   <Box>Alt</Box>
 * </Flex>
 * ```
 */
export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(
  function Spacer(props, ref) {
    const { size, className, style, classNames, styles, ...htmlProps } = props;

    const baseStyle: CSSProperties = size !== undefined
      ? { flexShrink: 0, width: typeof size === 'number' ? `${size}px` : size, height: typeof size === 'number' ? `${size}px` : size }
      : { flex: 1 };

    const { className: slotClass, style: slotStyle } = getSlotProps(
      'root',
      undefined,
      classNames,
      styles,
      { ...baseStyle, ...style },
    );
    const finalClass = [slotClass, className].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={finalClass || undefined}
        style={slotStyle}
        {...htmlProps}
      />
    );
  },
);
