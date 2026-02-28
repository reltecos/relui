/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FormField styles — Vanilla Extract.
 * FormField stilleri.
 *
 * Label + input + helper/error text layout.
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── FormField wrapper ───────────────────────────────────────────────

export const formFieldRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },

  variants: {
    size: {
      sm: {
        gap: 'var(--rel-spacing-1)',
      },

      md: {
        gap: 'var(--rel-spacing-1.5)',
      },

      lg: {
        gap: 'var(--rel-spacing-2)',
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

/** FormField recipe varyant tipleri */
export type FormFieldRecipeVariants = RecipeVariants<typeof formFieldRecipe>;

// ── Helper text ─────────────────────────────────────────────────────

export const helperTextRecipe = recipe({
  base: {
    fontFamily: 'var(--rel-font-sans)',
    color: cssVar.fgMuted,
    margin: 0,
  },

  variants: {
    size: {
      sm: {
        fontSize: 'var(--rel-text-xs)',
        lineHeight: 'var(--rel-leading-xs)',
      },

      md: {
        fontSize: 'var(--rel-text-sm)',
        lineHeight: 'var(--rel-leading-sm)',
      },

      lg: {
        fontSize: 'var(--rel-text-sm)',
        lineHeight: 'var(--rel-leading-sm)',
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

// ── Error message ───────────────────────────────────────────────────

export const errorMessageRecipe = recipe({
  base: {
    fontFamily: 'var(--rel-font-sans)',
    color: cssVar.destructiveDefault,
    fontWeight: '500',
    margin: 0,
  },

  variants: {
    size: {
      sm: {
        fontSize: 'var(--rel-text-xs)',
        lineHeight: 'var(--rel-leading-xs)',
      },

      md: {
        fontSize: 'var(--rel-text-sm)',
        lineHeight: 'var(--rel-leading-sm)',
      },

      lg: {
        fontSize: 'var(--rel-text-sm)',
        lineHeight: 'var(--rel-leading-sm)',
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

// ── Content slot (input alanı) ──────────────────────────────────────

export const formFieldContentStyle = style({
  display: 'flex',
  flexDirection: 'column',
});
