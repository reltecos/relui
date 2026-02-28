/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * SegmentedControl styles — Vanilla Extract recipes.
 * SegmentedControl stilleri — Vanilla Extract recipe tabanlı.
 *
 * iOS-tarzı segmented control: pill şekli, kayan gösterge, 5 boyut.
 *
 * @packageDocumentation
 */

import { createVar, style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Local CSS Variables ──────────────────────────────────────────────

const scBg = createVar();
const scActiveBg = createVar();
const scFg = createVar();
const scActiveFg = createVar();
const scBorderRadius = createVar();

// ── Root (tablist container) Recipe ──────────────────────────────────

export const segmentedControlRootRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    position: 'relative',
    boxSizing: 'border-box',
    borderRadius: scBorderRadius,
    fontFamily: 'var(--rel-font-sans)',
    userSelect: 'none',
    gap: '2px',
    padding: '2px',

    vars: {
      [scBg]: cssVar.bgSubtle,
      [scActiveBg]: '#ffffff',
      [scFg]: cssVar.fgMuted,
      [scActiveFg]: cssVar.fgDefault,
      [scBorderRadius]: '8px',
    },

    backgroundColor: scBg,

    selectors: {
      '&[data-disabled]': {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  },

  variants: {
    size: {
      xs: {
        height: '24px',
        fontSize: '11px',
        vars: { [scBorderRadius]: '6px' },
      },
      sm: {
        height: '28px',
        fontSize: '12px',
        vars: { [scBorderRadius]: '6px' },
      },
      md: {
        height: '32px',
        fontSize: '13px',
        vars: { [scBorderRadius]: '8px' },
      },
      lg: {
        height: '36px',
        fontSize: '14px',
        vars: { [scBorderRadius]: '8px' },
      },
      xl: {
        height: '40px',
        fontSize: '15px',
        vars: { [scBorderRadius]: '10px' },
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

export type SegmentedControlRootVariants = RecipeVariants<typeof segmentedControlRootRecipe>;

// ── Item (tab/segment) style ────────────────────────────────────────

export const segmentedControlItemStyle = style({
  // Reset
  appearance: 'none',
  border: 'none',
  outline: 'none',
  margin: 0,
  padding: '0 12px',

  // Layout
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  zIndex: 1,
  flex: '1 1 0%',
  whiteSpace: 'nowrap',

  // Visuals
  backgroundColor: 'transparent',
  color: scFg,
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: '500',
  cursor: 'pointer',
  borderRadius: `calc(${scBorderRadius} - 2px)`,
  height: 'calc(100% - 4px)',
  transition: 'color 150ms ease, background-color 150ms ease',

  selectors: {
    '&:hover:not([data-disabled]):not([data-state="active"])': {
      color: scActiveFg,
    },
    '&:focus-visible': {
      outline: `2px solid ${cssVar.accentDefault}`,
      outlineOffset: '-2px',
    },
    '&[data-state="active"]': {
      color: scActiveFg,
      backgroundColor: scActiveBg,
      fontWeight: '600',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
    },
    '&[data-disabled]': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
});
