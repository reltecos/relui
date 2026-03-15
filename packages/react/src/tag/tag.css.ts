/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Tag styles — Vanilla Extract recipes.
 * Tag stilleri — Vanilla Extract recipe tabanlı.
 *
 * Badge benzeri ama kaldırma butonu desteği.
 * compoundVariants ile variant × color çapraz override.
 *
 * @packageDocumentation
 */

import { createVar, style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Local CSS Variables ──────────────────────────────────────────────

const tgBg = createVar();
const tgFg = createVar();
const tgBorder = createVar();

// ── Tag recipe ──────────────────────────────────────────────────────

export const tagRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: 'var(--rel-radius-md)',
    fontFamily: 'var(--rel-font-sans)',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    verticalAlign: 'middle',
    gap: 'var(--rel-spacing-1)',

    vars: {
      [tgBg]: cssVar.accentSubtle,
      [tgFg]: cssVar.accentDefault,
      [tgBorder]: 'transparent',
    },

    backgroundColor: tgBg,
    color: tgFg,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: tgBorder,

    selectors: {
      '&[data-disabled]': {
        opacity: 0.5,
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
    },
  },

  variants: {
    color: {
      accent: {
        vars: {
          [tgBg]: cssVar.accentSubtle,
          [tgFg]: cssVar.accentDefault,
        },
      },

      neutral: {
        vars: {
          [tgBg]: cssVar.bgComponentHover,
          [tgFg]: cssVar.fgDefault,
        },
      },

      destructive: {
        vars: {
          [tgBg]: cssVar.destructiveSubtle,
          [tgFg]: cssVar.destructiveDefault,
        },
      },

      success: {
        vars: {
          [tgBg]: cssVar.successSubtle,
          [tgFg]: cssVar.successDefault,
        },
      },

      warning: {
        vars: {
          [tgBg]: cssVar.warningSubtle,
          [tgFg]: cssVar.warningDefault,
        },
      },
    },

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

    variant: {
      soft: {
        backgroundColor: tgBg,
        color: tgFg,
      },

      solid: {
        backgroundColor: tgBg,
        color: tgFg,
      },

      outline: {
        backgroundColor: 'transparent',
        color: tgFg,
        borderColor: tgBorder,
      },
    },
  },

  compoundVariants: [
    // Solid — dolu renkler
    { variants: { variant: 'solid', color: 'accent' }, style: { vars: { [tgBg]: cssVar.accentDefault, [tgFg]: 'var(--rel-color-text-inverse, #fff)' } } },
    { variants: { variant: 'solid', color: 'neutral' }, style: { vars: { [tgBg]: cssVar.bgComponent, [tgFg]: cssVar.fgDefault } } },
    { variants: { variant: 'solid', color: 'destructive' }, style: { vars: { [tgBg]: cssVar.destructiveDefault, [tgFg]: 'var(--rel-color-text-inverse, #fff)' } } },
    { variants: { variant: 'solid', color: 'success' }, style: { vars: { [tgBg]: cssVar.successDefault, [tgFg]: 'var(--rel-color-text-inverse, #fff)' } } },
    { variants: { variant: 'solid', color: 'warning' }, style: { vars: { [tgBg]: cssVar.warningDefault, [tgFg]: 'var(--rel-color-text-inverse, #fff)' } } },

    // Outline — transparan bg, renkli border
    { variants: { variant: 'outline', color: 'accent' }, style: { vars: { [tgBorder]: cssVar.accentDefault } } },
    { variants: { variant: 'outline', color: 'neutral' }, style: { vars: { [tgBorder]: cssVar.borderDefault } } },
    { variants: { variant: 'outline', color: 'destructive' }, style: { vars: { [tgBorder]: cssVar.destructiveDefault } } },
    { variants: { variant: 'outline', color: 'success' }, style: { vars: { [tgBorder]: cssVar.successDefault } } },
    { variants: { variant: 'outline', color: 'warning' }, style: { vars: { [tgBorder]: cssVar.warningDefault } } },
  ],

  defaultVariants: {
    color: 'accent',
    size: 'md',
    variant: 'soft',
  },
});

/** Tag recipe varyant tipleri */
export type TagRecipeVariants = RecipeVariants<typeof tagRecipe>;

// ── Remove button ───────────────────────────────────────────────────

export const tagIconStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  fontSize: '1em',
  lineHeight: 1,
});

export const tagRemoveButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  appearance: 'none',
  border: 'none',
  background: 'none',
  padding: 0,
  color: 'inherit',
  cursor: 'pointer',
  borderRadius: 'var(--rel-radius-sm)',
  opacity: 0.7,
  fontSize: '0.75em',
  lineHeight: 1,
  width: '1em',
  height: '1em',

  transitionProperty: 'opacity, background-color',
  transitionDuration: 'var(--rel-duration-fast)',
  transitionTimingFunction: 'var(--rel-ease-ease)',

  selectors: {
    '&:hover': {
      opacity: 1,
    },
    '&:focus-visible': {
      outline: `2px solid ${cssVar.borderFocus}`,
      outlineOffset: '1px',
    },
  },
});
