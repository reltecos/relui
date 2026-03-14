/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Link / NavLink styles — Vanilla Extract recipes.
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Link recipe ─────────────────────────────────────────────

export const linkRecipe = recipe({
  base: {
    fontFamily: 'var(--rel-font-sans)',
    cursor: 'pointer',
    transition: 'color 120ms ease, text-decoration-color 120ms ease',
    outline: 'none',
    textDecorationSkipInk: 'auto',
    selectors: {
      '&:focus-visible': {
        outline: `2px solid ${cssVar.ringDefault}`,
        outlineOffset: '2px',
        borderRadius: 'var(--rel-radius-sm, 2px)',
      },
      '&[data-disabled]': {
        cursor: 'not-allowed',
        opacity: 0.5,
        pointerEvents: 'none',
      },
    },
  },

  variants: {
    variant: {
      default: {
        color: cssVar.accentDefault,
        selectors: {
          '&:hover': {
            color: cssVar.accentHover,
          },
        },
      },
      subtle: {
        color: cssVar.fgMuted,
        selectors: {
          '&:hover': {
            color: cssVar.fgDefault,
          },
        },
      },
      inherit: {
        color: 'inherit',
        selectors: {
          '&:hover': {
            color: cssVar.accentDefault,
          },
        },
      },
    },

    underline: {
      always: {
        textDecoration: 'underline',
      },
      hover: {
        textDecoration: 'none',
        selectors: {
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
      never: {
        textDecoration: 'none',
      },
    },

    size: {
      xs: { fontSize: 'var(--rel-text-xs, 12px)' },
      sm: { fontSize: 'var(--rel-text-sm, 14px)' },
      md: { fontSize: 'var(--rel-text-md, 16px)' },
      lg: { fontSize: 'var(--rel-text-lg, 18px)' },
      xl: { fontSize: 'var(--rel-text-xl, 20px)' },
    },
  },

  defaultVariants: {
    variant: 'default',
    underline: 'hover',
    size: 'md',
  },
});

export type LinkVariants = RecipeVariants<typeof linkRecipe>;

// ── NavLink active style ────────────────────────────────────

export const navLinkActiveStyle = style({
  fontWeight: 600,
});

// ── External icon ───────────────────────────────────────────

export const externalIconStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  marginLeft: '4px',
  verticalAlign: 'middle',
  width: '0.85em',
  height: '0.85em',
  flexShrink: 0,
});
