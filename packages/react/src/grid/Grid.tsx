/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Grid — CSS Grid layout bileşeni.
 * Box üzerine display="grid" varsayılanı ve kısa yol prop'ları ekler.
 *
 * @packageDocumentation
 */

import { forwardRef } from 'react';
import { Box, type BoxProps } from '../box';
import type { Sprinkles } from '../utils/sprinkles.css';

/** Grid slot isimleri. */
export type GridSlot = 'root';

/**
 * Grid prop'ları.
 *
 * Box'un tüm prop'larını destekler + `columns` ve `rows` kısa yolları.
 */
export interface GridProps extends BoxProps {
  /** gridTemplateColumns kısa yolu. Sayı (1–12) veya responsive obje. */
  columns?: Sprinkles['gridTemplateColumns'];
  /** gridRow kısa yolu (grid item'lar için). */
  rows?: Sprinkles['gridRow'];
}

/**
 * Grid — CSS Grid layout bileşeni.
 *
 * `display="grid"` varsayılanıyla Box. `columns` kısa yolu ile grid sütun sayısı.
 *
 * @example
 * ```tsx
 * <Grid columns={3} gap={4}>
 *   <Box>1</Box>
 *   <Box>2</Box>
 *   <Box>3</Box>
 * </Grid>
 *
 * <Grid columns={{ base: 1, md: 2, lg: 4 }} gap={{ base: 2, lg: 4 }}>
 *   <Box>A</Box>
 *   <Box>B</Box>
 *   <Box>C</Box>
 *   <Box>D</Box>
 * </Grid>
 * ```
 */
export const Grid = forwardRef<HTMLElement, GridProps>(function Grid(props, ref) {
  const { columns, rows, ...rest } = props;

  return (
    <Box
      ref={ref}
      display="grid"
      {...(columns !== undefined ? { gridTemplateColumns: columns } : {})}
      {...(rows !== undefined ? { gridRow: rows } : {})}
      {...rest}
    />
  );
});
