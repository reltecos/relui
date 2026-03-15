/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Spacer — flex container icinde esnek bosluk bilesen (Dual API).
 * Kalan alani doldurarak elemanlari itmek icin kullanilir.
 *
 * Props-based: `<Spacer />` veya `<Spacer size="2rem" />`
 * Compound:    minimal — sub-component gereksiz
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  type HTMLAttributes,
  type CSSProperties,
  type Ref,
} from 'react';
import { rootFlexStyle, rootFixedStyle } from './spacer.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** Spacer slot isimleri / Spacer slot names. */
export type SpacerSlot = 'root';

// ── Types ─────────────────────────────────────────────

/**
 * Spacer prop'lari.
 */
export interface SpacerProps
  extends HTMLAttributes<HTMLDivElement>,
    SlotStyleProps<SpacerSlot> {
  /** Sabit genislik (px veya CSS degeri). Verilmezse flex: 1. */
  size?: string | number;
  /** Ek CSS sinifi. */
  className?: string;
  /** Inline stil. */
  style?: CSSProperties;
  /** Ref. */
  ref?: Ref<HTMLDivElement>;
}

// ── Component ─────────────────────────────────────────

const SpacerBase = forwardRef<HTMLDivElement, SpacerProps>(
  function Spacer(props, ref) {
    const { size, className, style, classNames, styles, ...htmlProps } = props;

    // CSS class + dinamik inline style
    const baseClass = size !== undefined ? rootFixedStyle : rootFlexStyle;
    const dynamicStyle: CSSProperties | undefined = size !== undefined
      ? { width: typeof size === 'number' ? `${size}px` : size, height: typeof size === 'number' ? `${size}px` : size }
      : undefined;

    const { className: slotClass, style: slotStyle } = getSlotProps(
      'root',
      baseClass,
      classNames,
      styles,
      { ...dynamicStyle, ...style },
    );
    const finalClass = [slotClass, className].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={finalClass || undefined}
        style={slotStyle}
        data-testid="spacer-root"
        {...htmlProps}
      />
    );
  },
);

/**
 * Spacer bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Flex>
 *   <Box>Sol</Box>
 *   <Spacer />
 *   <Box>Sag</Box>
 * </Flex>
 * ```
 *
 * @example Sabit boyut
 * ```tsx
 * <Flex direction="column">
 *   <Box>Ust</Box>
 *   <Spacer size="2rem" />
 *   <Box>Alt</Box>
 * </Flex>
 * ```
 */
export const Spacer = SpacerBase;
