/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * IconButton styles — Vanilla Extract recipes.
 * IconButton stilleri — Vanilla Extract recipe tabanlı.
 *
 * Button recipe'yi genişletmez — kare boyutlandırma için bağımsız recipe.
 * Renk/variant stilleri Button'dan devralınır (IconButton, Button render eder).
 * Bu recipe sadece kare boyutları override eder.
 *
 * @packageDocumentation
 */

import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';

/**
 * IconButton kare boyut recipe'si.
 *
 * Button'ın padding ve width'ini override ederek kare yapar.
 * Height zaten Button size'dan gelir — burada width = height set edilir.
 */
export const iconButtonSizeRecipe = recipe({
  base: {
    padding: 0,
    aspectRatio: '1',
    flexShrink: 0,
    color: 'var(--rel-color-text, #374151)',
  },

  variants: {
    size: {
      xs: {
        width: '1.5rem',
        fontSize: 'var(--rel-text-2xs)',
      },

      sm: {
        width: '1.75rem',
        fontSize: 'var(--rel-text-xs)',
      },

      md: {
        width: '2rem',
        fontSize: 'var(--rel-text-sm)',
      },

      lg: {
        width: '2.25rem',
        fontSize: 'var(--rel-text-base)',
      },

      xl: {
        width: '2.5rem',
        fontSize: 'var(--rel-text-lg)',
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

/** IconButton size recipe varyant tipleri */
export type IconButtonSizeVariants = RecipeVariants<typeof iconButtonSizeRecipe>;
