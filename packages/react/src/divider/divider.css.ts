/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Divider styles — Vanilla Extract recipe.
 * Yatay veya dikey ayırıcı çizgi.
 *
 * @packageDocumentation
 */

import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

export const dividerRecipe = recipe({
  base: {
    border: 'none',
    margin: 0,
    padding: 0,
    flexShrink: 0,
  },

  variants: {
    orientation: {
      horizontal: {
        width: '100%',
        borderBottom: `1px solid ${cssVar.borderDefault}`,
      },
      vertical: {
        height: '100%',
        alignSelf: 'stretch',
        borderRight: `1px solid ${cssVar.borderDefault}`,
      },
    },

    variant: {
      solid: {
        borderStyle: 'solid',
      },
      dashed: {
        borderStyle: 'dashed',
      },
      dotted: {
        borderStyle: 'dotted',
      },
    },
  },

  defaultVariants: {
    orientation: 'horizontal',
    variant: 'solid',
  },
});

/** Divider recipe varyant tipleri. */
export type DividerRecipeVariants = RecipeVariants<typeof dividerRecipe>;
