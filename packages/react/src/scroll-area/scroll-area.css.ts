/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ScrollArea styles — Vanilla Extract recipe.
 * Özel scrollbar ile scroll bölgesi stilleri.
 *
 * @packageDocumentation
 */

import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { style, keyframes } from '@vanilla-extract/css';
import { cssVar } from '@relteco/relui-tokens';

// ── Fade animation ────────────────────────────────────

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const fadeOut = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

// ── Root ──────────────────────────────────────────────

export const rootStyle = style({
  position: 'relative',
  overflow: 'hidden',
});

// ── Viewport ──────────────────────────────────────────

export const viewportStyle = style({
  width: '100%',
  height: '100%',
  overflow: 'scroll',
  scrollbarWidth: 'none',
  '::-webkit-scrollbar': {
    display: 'none',
  },
});

// ── Scrollbar ─────────────────────────────────────────

export const scrollbarRecipe = recipe({
  base: {
    position: 'absolute',
    display: 'flex',
    userSelect: 'none',
    touchAction: 'none',
    zIndex: 1,
    transition: 'opacity 200ms ease',
  },

  variants: {
    orientation: {
      vertical: {
        top: 0,
        right: 0,
        bottom: 0,
        width: 8,
        flexDirection: 'column',
        paddingRight: 1,
      },
      horizontal: {
        left: 0,
        right: 0,
        bottom: 0,
        height: 8,
        flexDirection: 'row',
        paddingBottom: 1,
      },
    },

    visible: {
      true: {
        opacity: 1,
        animation: `${fadeIn} 200ms ease`,
      },
      false: {
        opacity: 0,
        pointerEvents: 'none',
        animation: `${fadeOut} 200ms ease`,
      },
    },

    size: {
      sm: {},
      md: {},
      lg: {},
    },
  },

  compoundVariants: [
    { variants: { orientation: 'vertical', size: 'sm' }, style: { width: 6 } },
    { variants: { orientation: 'vertical', size: 'lg' }, style: { width: 12 } },
    { variants: { orientation: 'horizontal', size: 'sm' }, style: { height: 6 } },
    { variants: { orientation: 'horizontal', size: 'lg' }, style: { height: 12 } },
  ],

  defaultVariants: {
    orientation: 'vertical',
    visible: true,
    size: 'md',
  },
});

// ── Thumb ─────────────────────────────────────────────

export const thumbStyle = style({
  position: 'relative',
  borderRadius: 9999,
  backgroundColor: cssVar.borderStrong,
  opacity: 0.5,
  transition: 'opacity 150ms ease, background-color 150ms ease',
  flexShrink: 0,
  ':hover': {
    opacity: 0.7,
    backgroundColor: cssVar.borderStrong,
  },
  ':active': {
    opacity: 0.9,
  },
});

// ── Corner ────────────────────────────────────────────

export const cornerStyle = style({
  position: 'absolute',
  right: 0,
  bottom: 0,
  width: 8,
  height: 8,
  backgroundColor: 'transparent',
});

/** Scrollbar recipe varyant tipleri. */
export type ScrollbarRecipeVariants = RecipeVariants<typeof scrollbarRecipe>;
