/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Input styles — Vanilla Extract recipes.
 * Input stilleri — Vanilla Extract recipe tabanlı.
 *
 * Button ile aynı local CSS vars pattern'ı kullanır.
 * Renk şeması CSS custom property'ler üzerinden uygulanır.
 *
 * @packageDocumentation
 */

import { createVar, style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Local CSS Variables ──────────────────────────────────────────────

const inpBg = createVar();
const inpBorder = createVar();
const inpBorderHover = createVar();
const inpBorderFocus = createVar();
const inpFg = createVar();
const inpPlaceholder = createVar();

// ── Disabled/readonly ortak selector ─────────────────────────────────

const NOT_DISABLED = '&:not([data-disabled])';

// ── Input Recipe ─────────────────────────────────────────────────────

export const inputRecipe = recipe({
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
    color: inpFg,

    // Layout
    display: 'inline-flex',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',

    // Local CSS vars — tüm variant'lar tarafından kullanılır
    vars: {
      [inpBg]: cssVar.bgSubtle,
      [inpBorder]: cssVar.borderDefault,
      [inpBorderHover]: cssVar.borderHover,
      [inpBorderFocus]: cssVar.accentDefault,
      [inpFg]: cssVar.fgDefault,
      [inpPlaceholder]: cssVar.fgMuted,
    },

    // Transition
    transitionProperty: 'background-color, border-color, box-shadow',
    transitionDuration: 'var(--rel-duration-fast)',
    transitionTimingFunction: 'var(--rel-ease-ease)',

    selectors: {
      '&::placeholder': {
        color: inpPlaceholder,
        opacity: 1,
      },

      // Focus ring
      '&:focus-visible': {
        outline: 'none',
        borderColor: inpBorderFocus,
        boxShadow: `0 0 0 2px ${cssVar.bgApp}, 0 0 0 4px ${cssVar.borderFocus}`,
      },

      // Disabled
      '&[data-disabled]': {
        opacity: 0.5,
        cursor: 'not-allowed',
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
        borderColor: inpBorder,
        selectors: {
          [`${NOT_DISABLED}:hover`]: {
            borderColor: inpBorderHover,
          },
        },
      },

      filled: {
        background: inpBg,
        border: '1px solid transparent',
        selectors: {
          [`${NOT_DISABLED}:hover`]: {
            background: inpBg,
            borderColor: inpBorderHover,
          },
        },
      },

      flushed: {
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid',
        borderBottomColor: inpBorder,
        borderRadius: '0 !important',
        paddingLeft: '0 !important',
        paddingRight: '0 !important',
        selectors: {
          [`${NOT_DISABLED}:hover`]: {
            borderBottomColor: inpBorderHover,
          },
          '&:focus-visible': {
            borderBottomColor: inpBorderFocus,
            boxShadow: `0 1px 0 0 ${cssVar.borderFocus}`,
          },
        },
      },
    },

    // ── Size ─────────────────────────────────────────────────────

    size: {
      xs: {
        height: '1.5rem',
        paddingLeft: 'var(--rel-spacing-2)',
        paddingRight: 'var(--rel-spacing-2)',
        fontSize: 'var(--rel-text-2xs)',
        borderRadius: 'var(--rel-radius-sm)',
      },

      sm: {
        height: '1.75rem',
        paddingLeft: 'var(--rel-spacing-2.5)',
        paddingRight: 'var(--rel-spacing-2.5)',
        fontSize: 'var(--rel-text-xs)',
        borderRadius: 'var(--rel-radius-sm)',
      },

      md: {
        height: '2rem',
        paddingLeft: 'var(--rel-spacing-3)',
        paddingRight: 'var(--rel-spacing-3)',
        fontSize: 'var(--rel-text-sm)',
        borderRadius: 'var(--rel-radius-md)',
      },

      lg: {
        height: '2.25rem',
        paddingLeft: 'var(--rel-spacing-4)',
        paddingRight: 'var(--rel-spacing-4)',
        fontSize: 'var(--rel-text-base)',
        borderRadius: 'var(--rel-radius-md)',
      },

      xl: {
        height: '2.5rem',
        paddingLeft: 'var(--rel-spacing-5)',
        paddingRight: 'var(--rel-spacing-5)',
        fontSize: 'var(--rel-text-lg)',
        borderRadius: 'var(--rel-radius-lg)',
      },
    },
  },

  defaultVariants: {
    variant: 'outline',
    size: 'md',
  },
});

/** Input recipe varyant tipleri / Input recipe variant types */
export type InputRecipeVariants = RecipeVariants<typeof inputRecipe>;

// ── Input wrapper stili (leftElement/rightElement için) ──────────────

export const inputWrapperStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  position: 'relative',
  width: '100%',
});

export const inputElementLeftStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  pointerEvents: 'none',
  color: cssVar.fgMuted,
});

export const inputElementRightStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  right: 0,
  top: 0,
  bottom: 0,
  pointerEvents: 'none',
  color: cssVar.fgMuted,
});
