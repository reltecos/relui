/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Stack — dikey veya yatay yigin layout bilesen (Dual API).
 * Flex uzerine direction ve spacing varsayilanlari ekler.
 *
 * Props-based: `<Stack spacing={4}>icerik</Stack>`
 * Compound:    `<Stack spacing={4}><Stack.Item>1</Stack.Item></Stack>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import { Flex, type FlexProps } from '../flex';
import { Box, type BoxProps } from '../box';
import type { Sprinkles } from '../utils/sprinkles.css';
import { itemStyle } from './stack.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** Stack slot isimleri / Stack slot names. */
export type StackSlot = 'root' | 'item';

// ── Context (Compound API) ────────────────────────────

interface StackContextValue {
  classNames: ClassNames<StackSlot> | undefined;
  styles: Styles<StackSlot> | undefined;
}

const StackContext = createContext<StackContextValue | null>(null);

function useStackContext(): StackContextValue {
  const ctx = useContext(StackContext);
  if (!ctx) throw new Error('Stack compound sub-components must be used within <Stack>.');
  return ctx;
}

// ── Compound: Stack.Item ─────────────────────────────

/** Stack.Item props */
export interface StackItemProps extends BoxProps {
  /** Icerik / Content */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const StackItem = forwardRef<HTMLElement, StackItemProps>(
  function StackItem(props, ref) {
    const { children, className, ...rest } = props;
    const ctx = useStackContext();
    const slot = getSlotProps('item', itemStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <Box
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="stack-item"
        {...rest}
      >
        {children}
      </Box>
    );
  },
);

// ── Types ─────────────────────────────────────────────

/**
 * Stack prop'lari.
 *
 * Flex'in tum prop'larini destekler + `spacing` kisa yolu.
 */
export interface StackProps extends Omit<FlexProps, 'direction' | 'classNames' | 'styles'>, SlotStyleProps<StackSlot> {
  /** Yigin yonu. Varsayilan: 'vertical' (column). */
  direction?: 'vertical' | 'horizontal';
  /** Elemanlar arasi bosluk (gap). Spacing token degeri. */
  spacing?: Sprinkles['gap'];
}

// ── Component ─────────────────────────────────────────

const StackBase = forwardRef<HTMLElement, StackProps>(function Stack(props, ref) {
  const { direction = 'vertical', spacing, classNames, styles, ...rest } = props;

  const flexDirection = direction === 'horizontal' ? 'row' : 'column';
  const ctxValue: StackContextValue = { classNames, styles };

  return (
    <StackContext.Provider value={ctxValue}>
      <Flex
        ref={ref}
        direction={flexDirection as FlexProps['direction']}
        classNames={classNames ? { root: classNames.root } : undefined}
        styles={styles ? { root: styles.root } : undefined}
        {...(spacing !== undefined ? { gap: spacing } : {})}
        {...rest}
      />
    </StackContext.Provider>
  );
});

/**
 * Stack bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Stack spacing={4}>
 *   <Box>Item 1</Box>
 *   <Box>Item 2</Box>
 * </Stack>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Stack spacing={4}>
 *   <Stack.Item>Item 1</Stack.Item>
 *   <Stack.Item>Item 2</Stack.Item>
 * </Stack>
 * ```
 */
export const Stack = Object.assign(StackBase, {
  Item: StackItem,
});
