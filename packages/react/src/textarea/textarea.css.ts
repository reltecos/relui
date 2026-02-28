/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Textarea styles — Vanilla Extract recipes.
 * Textarea stilleri — Vanilla Extract recipe tabanlı.
 *
 * Input ile aynı local CSS vars pattern'ı kullanır.
 * height yerine minHeight, resize variant'ı eklenir.
 *
 * @packageDocumentation
 */

import { createVar } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Local CSS Variables ──────────────────────────────────────────────

const taBg = createVar();
const taBorder = createVar();
const taBorderHover = createVar();
const taBorderFocus = createVar();
const taFg = createVar();
const taPlaceholder = createVar();

// ── Disabled/readonly ortak selector ─────────────────────────────────

const NOT_DISABLED = '&:not([data-disabled])';

// ── Textarea Recipe ─────────────────────────────────────────────────

export const textareaRecipe = recipe({
  base: {
    // Reset
    appearance: 'none',
    outline: 'none',
    margin: 0,
    cursor: 'text',

    // Typography
    fontFamily: 'var(--rel-font-sans)',
    fontWeight: 'var(--rel-font-normal)',
    lineHeight: '1.5',
    color: taFg,

    // Layout
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',

    // Local CSS vars — tüm variant'lar tarafından kullanılır
    vars: {
      [taBg]: cssVar.bgSubtle,
      [taBorder]: cssVar.borderDefault,
      [taBorderHover]: cssVar.borderHover,
      [taBorderFocus]: cssVar.accentDefault,
      [taFg]: cssVar.fgDefault,
      [taPlaceholder]: cssVar.fgMuted,
    },

    // Transition
    transitionProperty: 'background-color, border-color, box-shadow',
    transitionDuration: 'var(--rel-duration-fast)',
    transitionTimingFunction: 'var(--rel-ease-ease)',

    selectors: {
      '&::placeholder': {
        color: taPlaceholder,
        opacity: 1,
      },

      // Focus ring
      '&:focus-visible': {
        outline: 'none',
        borderColor: taBorderFocus,
        boxShadow: `0 0 0 2px ${cssVar.bgApp}, 0 0 0 4px ${cssVar.borderFocus}`,
      },

      // Disabled
      '&[data-disabled]': {
        opacity: 0.5,
        cursor: 'not-allowed',
        resize: 'none',
      },

      // ReadOnly
      '&[data-readonly]': {
        cursor: 'default',
      },

      // Invalid — border kırmızıya döner
      '&[data-invalid]': {
        borderColor: cssVar.destructiveDefault,
      },

      // Invalid + focus
      '&[data-invalid]:focus-visible': {
        borderColor: cssVar.destructiveDefault,
        boxShadow: `0 0 0 2px ${cssVar.bgApp}, 0 0 0 4px ${cssVar.destructiveDefault}`,
      },
    },
  },

  variants: {
    // ── Variant ──────────────────────────────────────────────────

    variant: {
      outline: {
        background: 'transparent',
        border: '1px solid',
        borderColor: taBorder,
        selectors: {
          [`${NOT_DISABLED}:hover`]: {
            borderColor: taBorderHover,
          },
        },
      },

      filled: {
        background: taBg,
        border: '1px solid transparent',
        selectors: {
          [`${NOT_DISABLED}:hover`]: {
            background: taBg,
            borderColor: taBorderHover,
          },
        },
      },

      flushed: {
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid',
        borderBottomColor: taBorder,
        borderRadius: '0 !important',
        paddingLeft: '0 !important',
        paddingRight: '0 !important',
        selectors: {
          [`${NOT_DISABLED}:hover`]: {
            borderBottomColor: taBorderHover,
          },
          '&:focus-visible': {
            borderBottomColor: taBorderFocus,
            boxShadow: `0 1px 0 0 ${cssVar.borderFocus}`,
          },
        },
      },
    },

    // ── Size ─────────────────────────────────────────────────────

    size: {
      xs: {
        minHeight: '3rem',
        paddingLeft: 'var(--rel-spacing-2)',
        paddingRight: 'var(--rel-spacing-2)',
        paddingTop: 'var(--rel-spacing-1)',
        paddingBottom: 'var(--rel-spacing-1)',
        fontSize: 'var(--rel-text-2xs)',
        borderRadius: 'var(--rel-radius-sm)',
      },

      sm: {
        minHeight: '3.5rem',
        paddingLeft: 'var(--rel-spacing-2.5)',
        paddingRight: 'var(--rel-spacing-2.5)',
        paddingTop: 'var(--rel-spacing-1.5)',
        paddingBottom: 'var(--rel-spacing-1.5)',
        fontSize: 'var(--rel-text-xs)',
        borderRadius: 'var(--rel-radius-sm)',
      },

      md: {
        minHeight: '4rem',
        paddingLeft: 'var(--rel-spacing-3)',
        paddingRight: 'var(--rel-spacing-3)',
        paddingTop: 'var(--rel-spacing-2)',
        paddingBottom: 'var(--rel-spacing-2)',
        fontSize: 'var(--rel-text-sm)',
        borderRadius: 'var(--rel-radius-md)',
      },

      lg: {
        minHeight: '5rem',
        paddingLeft: 'var(--rel-spacing-4)',
        paddingRight: 'var(--rel-spacing-4)',
        paddingTop: 'var(--rel-spacing-2.5)',
        paddingBottom: 'var(--rel-spacing-2.5)',
        fontSize: 'var(--rel-text-base)',
        borderRadius: 'var(--rel-radius-md)',
      },

      xl: {
        minHeight: '6rem',
        paddingLeft: 'var(--rel-spacing-5)',
        paddingRight: 'var(--rel-spacing-5)',
        paddingTop: 'var(--rel-spacing-3)',
        paddingBottom: 'var(--rel-spacing-3)',
        fontSize: 'var(--rel-text-lg)',
        borderRadius: 'var(--rel-radius-lg)',
      },
    },

    // ── Resize ──────────────────────────────────────────────────

    resize: {
      none: { resize: 'none' },
      vertical: { resize: 'vertical' },
      horizontal: { resize: 'horizontal' },
      both: { resize: 'both' },
    },
  },

  defaultVariants: {
    variant: 'outline',
    size: 'md',
    resize: 'vertical',
  },
});

/** Textarea recipe varyant tipleri / Textarea recipe variant types */
export type TextareaRecipeVariants = RecipeVariants<typeof textareaRecipe>;
