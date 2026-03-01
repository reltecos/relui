/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Sprinkles — build-time responsive atomic CSS.
 * Layout bileşenleri (Box, Flex, Grid, Stack, Container vb.)
 * için responsive prop altyapısı.
 *
 * Breakpoint'ler @relteco/relui-tokens'tan gelir.
 * Spacing skalası aynı token paketinden gelir.
 *
 * @packageDocumentation
 */

import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';
import { breakpoints, spacing } from '@relteco/relui-tokens';

// ── Conditions (responsive breakpoints) ────────────────────────────────

const conditions = {
  base: {},
  sm: { '@media': `screen and (min-width: ${breakpoints.sm})` },
  md: { '@media': `screen and (min-width: ${breakpoints.md})` },
  lg: { '@media': `screen and (min-width: ${breakpoints.lg})` },
  xl: { '@media': `screen and (min-width: ${breakpoints.xl})` },
  '2xl': { '@media': `screen and (min-width: ${breakpoints['2xl']})` },
} as const;

// ── Value sets ─────────────────────────────────────────────────────────

/** Margin: spacing + auto */
const marginValues = { ...spacing, auto: 'auto' } as const;

/** Sizing: spacing + percentage + viewport + content-sizing */
const sizeValues = {
  ...spacing,
  auto: 'auto',
  full: '100%',
  '1/2': '50%',
  '1/3': '33.333333%',
  '2/3': '66.666667%',
  '1/4': '25%',
  '3/4': '75%',
  vw: '100vw',
  vh: '100vh',
  min: 'min-content',
  max: 'max-content',
  fit: 'fit-content',
} as const;

/** Max-width: size values + breakpoint screen sizes + none */
const maxWidthValues = {
  ...sizeValues,
  'screen-sm': breakpoints.sm,
  'screen-md': breakpoints.md,
  'screen-lg': breakpoints.lg,
  'screen-xl': breakpoints.xl,
  'screen-2xl': breakpoints['2xl'],
  none: 'none',
} as const;

/** Grid template columns: 1–12 + none */
const gridColumnsValues = {
  1: 'repeat(1, minmax(0, 1fr))',
  2: 'repeat(2, minmax(0, 1fr))',
  3: 'repeat(3, minmax(0, 1fr))',
  4: 'repeat(4, minmax(0, 1fr))',
  5: 'repeat(5, minmax(0, 1fr))',
  6: 'repeat(6, minmax(0, 1fr))',
  7: 'repeat(7, minmax(0, 1fr))',
  8: 'repeat(8, minmax(0, 1fr))',
  9: 'repeat(9, minmax(0, 1fr))',
  10: 'repeat(10, minmax(0, 1fr))',
  11: 'repeat(11, minmax(0, 1fr))',
  12: 'repeat(12, minmax(0, 1fr))',
  none: 'none',
} as const;

/** Grid column span values */
const gridColumnValues = {
  auto: 'auto',
  'span-1': 'span 1 / span 1',
  'span-2': 'span 2 / span 2',
  'span-3': 'span 3 / span 3',
  'span-4': 'span 4 / span 4',
  'span-5': 'span 5 / span 5',
  'span-6': 'span 6 / span 6',
  'span-7': 'span 7 / span 7',
  'span-8': 'span 8 / span 8',
  'span-9': 'span 9 / span 9',
  'span-10': 'span 10 / span 10',
  'span-11': 'span 11 / span 11',
  'span-12': 'span 12 / span 12',
  full: '1 / -1',
} as const;

/** Grid row span values */
const gridRowValues = {
  auto: 'auto',
  'span-1': 'span 1 / span 1',
  'span-2': 'span 2 / span 2',
  'span-3': 'span 3 / span 3',
  'span-4': 'span 4 / span 4',
  'span-5': 'span 5 / span 5',
  'span-6': 'span 6 / span 6',
  full: '1 / -1',
} as const;

// ── Responsive properties ──────────────────────────────────────────────

const responsiveProperties = defineProperties({
  conditions,
  defaultCondition: 'base',
  properties: {
    // Layout
    display: [
      'none',
      'block',
      'flex',
      'inline',
      'inline-flex',
      'grid',
      'inline-grid',
      'inline-block',
    ],
    position: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
    overflow: ['visible', 'hidden', 'scroll', 'auto'],
    overflowX: ['visible', 'hidden', 'scroll', 'auto'],
    overflowY: ['visible', 'hidden', 'scroll', 'auto'],

    // Flexbox
    flexDirection: ['row', 'column', 'row-reverse', 'column-reverse'],
    flexWrap: ['nowrap', 'wrap', 'wrap-reverse'],
    alignItems: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'],
    alignSelf: ['auto', 'flex-start', 'flex-end', 'center', 'stretch', 'baseline'],
    justifyContent: [
      'flex-start',
      'flex-end',
      'center',
      'space-between',
      'space-around',
      'space-evenly',
    ],
    justifySelf: ['auto', 'flex-start', 'flex-end', 'center', 'stretch'],
    flexGrow: [0, 1],
    flexShrink: [0, 1],
    order: [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],

    // Grid
    gridTemplateColumns: gridColumnsValues,
    gridColumn: gridColumnValues,
    gridRow: gridRowValues,

    // Gap
    gap: spacing,
    rowGap: spacing,
    columnGap: spacing,

    // Padding
    paddingTop: spacing,
    paddingRight: spacing,
    paddingBottom: spacing,
    paddingLeft: spacing,

    // Margin
    marginTop: marginValues,
    marginRight: marginValues,
    marginBottom: marginValues,
    marginLeft: marginValues,

    // Sizing
    width: sizeValues,
    minWidth: sizeValues,
    maxWidth: maxWidthValues,
    height: sizeValues,
    minHeight: sizeValues,
    maxHeight: sizeValues,

    // Text
    textAlign: ['left', 'center', 'right', 'justify'],
  },

  shorthands: {
    p: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
    px: ['paddingLeft', 'paddingRight'],
    py: ['paddingTop', 'paddingBottom'],
    m: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
    mx: ['marginLeft', 'marginRight'],
    my: ['marginTop', 'marginBottom'],
    placeItems: ['alignItems', 'justifyContent'],
  },
});

// ── Sprinkles function ─────────────────────────────────────────────────

/** Sprinkles function — prop'ları atomic CSS class'larına dönüştürür. */
export const sprinkles = createSprinkles(responsiveProperties);

/** Sprinkles prop tipleri — tüm responsive layout prop'ları. */
export type Sprinkles = Parameters<typeof sprinkles>[0];
