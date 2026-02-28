/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FormGroup styles — Vanilla Extract.
 * FormGroup stilleri.
 *
 * Fieldset + legend layout.
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── FormGroup (fieldset) ────────────────────────────────────────────

export const formGroupRecipe = recipe({
  base: {
    display: 'flex',
    border: 'none',
    padding: 0,
    margin: 0,
    minInlineSize: 0,
  },

  variants: {
    orientation: {
      vertical: {
        flexDirection: 'column',
        gap: 'var(--rel-spacing-4)',
      },

      horizontal: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        gap: 'var(--rel-spacing-6)',
      },
    },
  },

  defaultVariants: {
    orientation: 'vertical',
  },
});

/** FormGroup recipe varyant tipleri */
export type FormGroupRecipeVariants = RecipeVariants<typeof formGroupRecipe>;

// ── Legend ───────────────────────────────────────────────────────────

export const legendRecipe = recipe({
  base: {
    fontFamily: 'var(--rel-font-sans)',
    fontWeight: '600',
    color: cssVar.fgDefault,
    padding: 0,
    marginBottom: 'var(--rel-spacing-2)',
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

// ── Disabled fieldset ───────────────────────────────────────────────

export const formGroupDisabledStyle = style({
  opacity: 0.5,
  pointerEvents: 'none',
});
