/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Flex — flexbox layout bilesen (Dual API).
 * Box uzerine display="flex" varsayilani ve kisa yol prop'lari ekler.
 *
 * Props-based: `<Flex direction="column" gap={4}>icerik</Flex>`
 * Compound:    `<Flex><Flex.Item>icerik</Flex.Item></Flex>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import { Box, type BoxProps } from '../box';
import type { Sprinkles } from '../utils/sprinkles.css';
import { itemStyle } from './flex.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** Flex slot isimleri / Flex slot names. */
export type FlexSlot = 'root' | 'item';

// ── Context (Compound API) ────────────────────────────

interface FlexContextValue {
  classNames: ClassNames<FlexSlot> | undefined;
  styles: Styles<FlexSlot> | undefined;
}

const FlexContext = createContext<FlexContextValue | null>(null);

function useFlexContext(): FlexContextValue {
  const ctx = useContext(FlexContext);
  if (!ctx) throw new Error('Flex compound sub-components must be used within <Flex>.');
  return ctx;
}

// ── Compound: Flex.Item ──────────────────────────────

/** Flex.Item props */
export interface FlexItemProps extends BoxProps {
  /** Icerik / Content */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const FlexItem = forwardRef<HTMLElement, FlexItemProps>(
  function FlexItem(props, ref) {
    const { children, className, ...rest } = props;
    const ctx = useFlexContext();
    const slot = getSlotProps('item', itemStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <Box
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="flex-item"
        {...rest}
      >
        {children}
      </Box>
    );
  },
);

// ── Types ─────────────────────────────────────────────

/**
 * Flex prop'lari.
 *
 * Box'un tum prop'larini destekler + kisa yol alias'lari.
 */
export interface FlexProps extends Omit<BoxProps, 'classNames' | 'styles'>, SlotStyleProps<FlexSlot> {
  /** flexDirection kisa yolu. */
  direction?: Sprinkles['flexDirection'];
  /** alignItems kisa yolu. */
  align?: Sprinkles['alignItems'];
  /** justifyContent kisa yolu. */
  justify?: Sprinkles['justifyContent'];
  /** flexWrap kisa yolu. */
  wrap?: Sprinkles['flexWrap'];
}

// ── Component ─────────────────────────────────────────

const FlexBase = forwardRef<HTMLElement, FlexProps>(function Flex(props, ref) {
  const { direction, align, justify, wrap, classNames, styles, ...rest } = props;

  const ctxValue: FlexContextValue = { classNames, styles };

  return (
    <FlexContext.Provider value={ctxValue}>
      <Box
        ref={ref}
        display="flex"
        classNames={classNames ? { root: classNames.root } : undefined}
        styles={styles ? { root: styles.root } : undefined}
        {...(direction !== undefined ? { flexDirection: direction } : {})}
        {...(align !== undefined ? { alignItems: align } : {})}
        {...(justify !== undefined ? { justifyContent: justify } : {})}
        {...(wrap !== undefined ? { flexWrap: wrap } : {})}
        {...rest}
      />
    </FlexContext.Provider>
  );
});

/**
 * Flex bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Flex direction="column" align="center" gap={4}>
 *   <Box>Item 1</Box>
 *   <Box>Item 2</Box>
 * </Flex>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Flex gap={4}>
 *   <Flex.Item>Item 1</Flex.Item>
 *   <Flex.Item>Item 2</Flex.Item>
 * </Flex>
 * ```
 */
export const Flex = Object.assign(FlexBase, {
  Item: FlexItem,
});
