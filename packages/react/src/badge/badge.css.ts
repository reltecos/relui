/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Badge styles — Vanilla Extract recipes.
 * Badge stilleri — Vanilla Extract recipe tabanlı.
 *
 * Pill shape, solid/soft/outline variants, 5 colors, 3 sizes.
 * compoundVariants ile variant × color çapraz override.
 *
 * @packageDocumentation
 */

import { createVar, style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Local CSS Variables ──────────────────────────────────────────────

const bdBg = createVar();
const bdFg = createVar();
const bdBorder = createVar();

// ── Badge recipe ────────────────────────────────────────────────────

export const badgeRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '9999px',
    fontFamily: 'var(--rel-font-sans)',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    verticalAlign: 'middle',

    vars: {
      [bdBg]: cssVar.accentDefault,
      [bdFg]: 'var(--rel-color-text-inverse, #fff)',
      [bdBorder]: 'transparent',
    },

    backgroundColor: bdBg,
    color: bdFg,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: bdBorder,
  },

  variants: {
    // ── Color ───────────────────────────────────────────────────
    color: {
      accent: {
        vars: {
          [bdBg]: cssVar.accentDefault,
          [bdFg]: 'var(--rel-color-text-inverse, #fff)',
          [bdBorder]: cssVar.accentDefault,
        },
      },

      neutral: {
        vars: {
          [bdBg]: cssVar.bgComponent,
          [bdFg]: cssVar.fgDefault,
          [bdBorder]: cssVar.borderDefault,
        },
      },

      destructive: {
        vars: {
          [bdBg]: cssVar.destructiveDefault,
          [bdFg]: 'var(--rel-color-text-inverse, #fff)',
          [bdBorder]: cssVar.destructiveDefault,
        },
      },

      success: {
        vars: {
          [bdBg]: cssVar.successDefault,
          [bdFg]: 'var(--rel-color-text-inverse, #fff)',
          [bdBorder]: cssVar.successDefault,
        },
      },

      warning: {
        vars: {
          [bdBg]: cssVar.warningDefault,
          [bdFg]: 'var(--rel-color-text-inverse, #fff)',
          [bdBorder]: cssVar.warningDefault,
        },
      },
    },

    // ── Size ─────────────────────────────────────────────────────
    size: {
      sm: {
        paddingLeft: 'var(--rel-spacing-1.5)',
        paddingRight: 'var(--rel-spacing-1.5)',
        height: '1.25rem',
        fontSize: 'var(--rel-text-2xs)',
      },

      md: {
        paddingLeft: 'var(--rel-spacing-2)',
        paddingRight: 'var(--rel-spacing-2)',
        height: '1.5rem',
        fontSize: 'var(--rel-text-xs)',
      },

      lg: {
        paddingLeft: 'var(--rel-spacing-2.5)',
        paddingRight: 'var(--rel-spacing-2.5)',
        height: '1.75rem',
        fontSize: 'var(--rel-text-sm)',
      },
    },

    // ── Variant ──────────────────────────────────────────────────
    variant: {
      solid: {
        backgroundColor: bdBg,
        color: bdFg,
      },

      soft: {
        opacity: 0.9,
        backgroundColor: bdBg,
        color: bdFg,
      },

      outline: {
        backgroundColor: 'transparent',
        color: bdFg,
        borderColor: bdBorder,
      },
    },
  },

  compoundVariants: [
    // ── Soft variants — lighter backgrounds ──────────────────
    { variants: { variant: 'soft', color: 'accent' }, style: { vars: { [bdBg]: cssVar.accentSubtle, [bdFg]: cssVar.accentDefault } } },
    { variants: { variant: 'soft', color: 'neutral' }, style: { vars: { [bdBg]: cssVar.bgComponentHover, [bdFg]: cssVar.fgDefault } } },
    { variants: { variant: 'soft', color: 'destructive' }, style: { vars: { [bdBg]: cssVar.destructiveSubtle, [bdFg]: cssVar.destructiveDefault } } },
    { variants: { variant: 'soft', color: 'success' }, style: { vars: { [bdBg]: cssVar.successSubtle, [bdFg]: cssVar.successDefault } } },
    { variants: { variant: 'soft', color: 'warning' }, style: { vars: { [bdBg]: cssVar.warningSubtle, [bdFg]: cssVar.warningDefault } } },

    // ── Outline variants — transparent bg, colored border ────
    { variants: { variant: 'outline', color: 'accent' }, style: { vars: { [bdFg]: cssVar.accentDefault, [bdBorder]: cssVar.accentDefault } } },
    { variants: { variant: 'outline', color: 'neutral' }, style: { vars: { [bdFg]: cssVar.fgDefault, [bdBorder]: cssVar.borderDefault } } },
    { variants: { variant: 'outline', color: 'destructive' }, style: { vars: { [bdFg]: cssVar.destructiveDefault, [bdBorder]: cssVar.destructiveDefault } } },
    { variants: { variant: 'outline', color: 'success' }, style: { vars: { [bdFg]: cssVar.successDefault, [bdBorder]: cssVar.successDefault } } },
    { variants: { variant: 'outline', color: 'warning' }, style: { vars: { [bdFg]: cssVar.warningDefault, [bdBorder]: cssVar.warningDefault } } },
  ],

  defaultVariants: {
    color: 'accent',
    size: 'md',
    variant: 'solid',
  },
});

/** Badge recipe varyant tipleri */
export type BadgeRecipeVariants = RecipeVariants<typeof badgeRecipe>;

// ── Badge icon style ────────────────────────────────────────────────

export const badgeIconStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  marginRight: '0.25rem',
  fontSize: '1em',
  lineHeight: 1,
});
