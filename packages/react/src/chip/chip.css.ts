/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Chip styles — Vanilla Extract recipes.
 * Chip stilleri — Vanilla Extract recipe tabanlı.
 *
 * Seçilebilir/kaldırılabilir kompakt eleman.
 * compoundVariants ile selected × color çapraz override.
 *
 * @packageDocumentation
 */

import { createVar, style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Local CSS Variables ──────────────────────────────────────────────

const chBg = createVar();
const chBgHover = createVar();
const chFg = createVar();
const chBorder = createVar();

// ── Chip recipe ─────────────────────────────────────────────────────

export const chipRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '9999px',
    fontFamily: 'var(--rel-font-sans)',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    gap: 'var(--rel-spacing-1)',
    cursor: 'pointer',
    userSelect: 'none',
    appearance: 'none',

    vars: {
      [chBg]: cssVar.bgComponent,
      [chBgHover]: cssVar.bgComponentHover,
      [chFg]: cssVar.fgDefault,
      [chBorder]: cssVar.borderDefault,
    },

    backgroundColor: chBg,
    color: chFg,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: chBorder,

    transitionProperty: 'background-color, border-color, color, box-shadow',
    transitionDuration: 'var(--rel-duration-fast)',
    transitionTimingFunction: 'var(--rel-ease-ease)',

    selectors: {
      '&:hover:not([data-disabled])': {
        backgroundColor: chBgHover,
      },
      '&:focus-visible': {
        outline: `2px solid ${cssVar.borderFocus}`,
        outlineOffset: '1px',
      },
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
          [chBg]: cssVar.bgComponent,
          [chFg]: cssVar.fgDefault,
          [chBorder]: cssVar.borderDefault,
        },
      },

      neutral: {
        vars: {
          [chBg]: cssVar.bgComponent,
          [chFg]: cssVar.fgDefault,
          [chBorder]: cssVar.borderDefault,
        },
      },

      destructive: {
        vars: {
          [chBg]: cssVar.bgComponent,
          [chFg]: cssVar.fgDefault,
          [chBorder]: cssVar.borderDefault,
        },
      },

      success: {
        vars: {
          [chBg]: cssVar.bgComponent,
          [chFg]: cssVar.fgDefault,
          [chBorder]: cssVar.borderDefault,
        },
      },

      warning: {
        vars: {
          [chBg]: cssVar.bgComponent,
          [chFg]: cssVar.fgDefault,
          [chBorder]: cssVar.borderDefault,
        },
      },
    },

    size: {
      sm: {
        paddingLeft: 'var(--rel-spacing-2)',
        paddingRight: 'var(--rel-spacing-2)',
        height: '1.5rem',
        fontSize: 'var(--rel-text-xs)',
      },

      md: {
        paddingLeft: 'var(--rel-spacing-3)',
        paddingRight: 'var(--rel-spacing-3)',
        height: '2rem',
        fontSize: 'var(--rel-text-sm)',
      },

      lg: {
        paddingLeft: 'var(--rel-spacing-4)',
        paddingRight: 'var(--rel-spacing-4)',
        height: '2.25rem',
        fontSize: 'var(--rel-text-base)',
      },
    },

    selected: {
      true: {
        backgroundColor: chBg,
        color: chFg,
        borderColor: chBorder,
      },
      false: {
        backgroundColor: chBg,
        color: chFg,
        borderColor: chBorder,
      },
    },
  },

  compoundVariants: [
    // ── Selected × Color — seçili durumda renk değişimi ─────
    { variants: { selected: true, color: 'accent' }, style: { vars: { [chBg]: cssVar.accentSubtle, [chFg]: cssVar.accentDefault, [chBorder]: cssVar.accentDefault } } },
    { variants: { selected: true, color: 'neutral' }, style: { vars: { [chBg]: cssVar.bgComponentHover, [chFg]: cssVar.fgDefault, [chBorder]: cssVar.borderHover } } },
    { variants: { selected: true, color: 'destructive' }, style: { vars: { [chBg]: cssVar.destructiveSubtle, [chFg]: cssVar.destructiveDefault, [chBorder]: cssVar.destructiveDefault } } },
    { variants: { selected: true, color: 'success' }, style: { vars: { [chBg]: cssVar.successSubtle, [chFg]: cssVar.successDefault, [chBorder]: cssVar.successDefault } } },
    { variants: { selected: true, color: 'warning' }, style: { vars: { [chBg]: cssVar.warningSubtle, [chFg]: cssVar.warningDefault, [chBorder]: cssVar.warningDefault } } },
  ],

  defaultVariants: {
    color: 'accent',
    size: 'md',
    selected: false,
  },
});

/** Chip recipe varyant tipleri */
export type ChipRecipeVariants = RecipeVariants<typeof chipRecipe>;

// ── Remove button ───────────────────────────────────────────────────

export const chipRemoveButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  appearance: 'none',
  border: 'none',
  background: 'none',
  padding: 0,
  color: 'inherit',
  cursor: 'pointer',
  borderRadius: '50%',
  opacity: 0.7,
  fontSize: '0.75em',
  lineHeight: 1,
  width: '1.1em',
  height: '1.1em',
  marginLeft: '-0.125rem',

  transitionProperty: 'opacity',
  transitionDuration: 'var(--rel-duration-fast)',

  selectors: {
    '&:hover': {
      opacity: 1,
    },
  },
});
