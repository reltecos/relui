/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Label styles — Vanilla Extract recipes.
 * Label stilleri — Vanilla Extract recipe tabanlı.
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Label recipe ────────────────────────────────────────────────────

export const labelRecipe = recipe({
  base: {
    display: 'inline-block',
    fontFamily: 'var(--rel-font-sans)',
    fontWeight: '500',
    color: cssVar.fgDefault,
    cursor: 'pointer',
    userSelect: 'none',

    transitionProperty: 'color, opacity',
    transitionDuration: 'var(--rel-duration-fast)',
    transitionTimingFunction: 'var(--rel-ease-ease)',

    selectors: {
      '&[data-disabled]': {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  },

  variants: {
    size: {
      sm: {
        fontSize: 'var(--rel-text-sm)',
        lineHeight: 'var(--rel-leading-sm)',
      },

      md: {
        fontSize: 'var(--rel-text-base)',
        lineHeight: 'var(--rel-leading-base)',
      },

      lg: {
        fontSize: 'var(--rel-text-lg)',
        lineHeight: 'var(--rel-leading-lg)',
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

/** Label recipe varyant tipleri */
export type LabelRecipeVariants = RecipeVariants<typeof labelRecipe>;

// ── Required indicator ──────────────────────────────────────────────

export const requiredIndicatorStyle = style({
  color: cssVar.destructiveDefault,
  marginLeft: '0.25rem',
  fontWeight: '700',
});
