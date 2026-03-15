/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Grid — CSS Grid layout bilesen (Dual API).
 * Box uzerine display="grid" varsayilani ve kisa yol prop'lari ekler.
 *
 * Props-based: `<Grid columns={3} gap={4}>icerik</Grid>`
 * Compound:    `<Grid columns={3}><Grid.Item>1</Grid.Item></Grid>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import { Box, type BoxProps } from '../box';
import type { Sprinkles } from '../utils/sprinkles.css';
import { itemStyle } from './grid.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** Grid slot isimleri / Grid slot names. */
export type GridSlot = 'root' | 'item';

// ── Context (Compound API) ────────────────────────────

interface GridContextValue {
  classNames: ClassNames<GridSlot> | undefined;
  styles: Styles<GridSlot> | undefined;
}

const GridContext = createContext<GridContextValue | null>(null);

function useGridContext(): GridContextValue {
  const ctx = useContext(GridContext);
  if (!ctx) throw new Error('Grid compound sub-components must be used within <Grid>.');
  return ctx;
}

// ── Compound: Grid.Item ──────────────────────────────

/** Grid.Item props */
export interface GridItemProps extends BoxProps {
  /** Icerik / Content */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const GridItem = forwardRef<HTMLElement, GridItemProps>(
  function GridItem(props, ref) {
    const { children, className, ...rest } = props;
    const ctx = useGridContext();
    const slot = getSlotProps('item', itemStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <Box
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="grid-item"
        {...rest}
      >
        {children}
      </Box>
    );
  },
);

// ── Types ─────────────────────────────────────────────

/**
 * Grid prop'lari.
 *
 * Box'un tum prop'larini destekler + `columns` ve `rows` kisa yollari.
 */
export interface GridProps extends Omit<BoxProps, 'classNames' | 'styles'>, SlotStyleProps<GridSlot> {
  /** gridTemplateColumns kisa yolu. Sayi (1-12) veya responsive obje. */
  columns?: Sprinkles['gridTemplateColumns'];
  /** gridRow kisa yolu (grid item'lar icin). */
  rows?: Sprinkles['gridRow'];
}

// ── Component ─────────────────────────────────────────

const GridBase = forwardRef<HTMLElement, GridProps>(function Grid(props, ref) {
  const { columns, rows, classNames, styles, ...rest } = props;

  const ctxValue: GridContextValue = { classNames, styles };

  return (
    <GridContext.Provider value={ctxValue}>
      <Box
        ref={ref}
        display="grid"
        classNames={classNames ? { root: classNames.root } : undefined}
        styles={styles ? { root: styles.root } : undefined}
        {...(columns !== undefined ? { gridTemplateColumns: columns } : {})}
        {...(rows !== undefined ? { gridRow: rows } : {})}
        {...rest}
      />
    </GridContext.Provider>
  );
});

/**
 * Grid bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Grid columns={3} gap={4}>
 *   <Box>1</Box>
 *   <Box>2</Box>
 *   <Box>3</Box>
 * </Grid>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Grid columns={3} gap={4}>
 *   <Grid.Item>1</Grid.Item>
 *   <Grid.Item>2</Grid.Item>
 *   <Grid.Item>3</Grid.Item>
 * </Grid>
 * ```
 */
export const Grid = Object.assign(GridBase, {
  Item: GridItem,
});
