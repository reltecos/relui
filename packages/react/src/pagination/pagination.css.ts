/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Pagination styles — Vanilla Extract recipes.
 * Pagination stilleri — Vanilla Extract recipe tabanli.
 *
 * 3 variant (outline, filled, subtle), 5 boyut (xs-xl).
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Root (nav) ──────────────────────────────────────────────────────

export const paginationRootStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontFamily: 'var(--rel-font-sans)',
});

// ── List container ──────────────────────────────────────────────────

export const paginationListRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    gap: '4px',
  },

  variants: {
    size: {
      xs: { gap: '2px' },
      sm: { gap: '2px' },
      md: { gap: '4px' },
      lg: { gap: '4px' },
      xl: { gap: '6px' },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

export type PaginationListVariants = RecipeVariants<typeof paginationListRecipe>;

// ── Ortak buton temeli / Common button base ─────────────────────────

const buttonBase = {
  appearance: 'none' as const,
  border: 'none' as const,
  outline: 'none' as const,
  margin: 0,
  display: 'inline-flex',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  fontFamily: 'inherit',
  fontWeight: '500' as const,
  cursor: 'pointer' as const,
  transition: 'color 150ms ease, background-color 150ms ease, border-color 150ms ease',
  flexShrink: 0,
  lineHeight: 1,
  userSelect: 'none' as const,
  borderRadius: '6px',
};

// ── Page button recipe ──────────────────────────────────────────────

export const paginationPageRecipe = recipe({
  base: {
    ...buttonBase,
    selectors: {
      '&:focus-visible': {
        outline: `2px solid ${cssVar.accentDefault}`,
        outlineOffset: '-2px',
        zIndex: 1,
      },
      '&[data-disabled]': {
        cursor: 'not-allowed',
        opacity: 0.4,
        pointerEvents: 'none',
      },
    },
  },

  variants: {
    variant: {
      outline: {
        background: 'transparent',
        color: cssVar.fgDefault,
        border: `1px solid ${cssVar.borderDefault}`,
        selectors: {
          '&:hover:not([data-selected]):not([data-disabled])': {
            backgroundColor: cssVar.bgSubtle,
          },
          '&[data-selected]': {
            backgroundColor: cssVar.accentDefault,
            borderColor: cssVar.accentDefault,
            color: 'var(--rel-color-text-inverse, #fff)',
            fontWeight: '600',
          },
        },
      },
      filled: {
        background: 'transparent',
        color: cssVar.fgDefault,
        border: '1px solid transparent',
        selectors: {
          '&:hover:not([data-selected]):not([data-disabled])': {
            backgroundColor: cssVar.bgSubtle,
          },
          '&[data-selected]': {
            backgroundColor: cssVar.accentDefault,
            color: 'var(--rel-color-text-inverse, #fff)',
            fontWeight: '600',
          },
        },
      },
      subtle: {
        background: 'transparent',
        color: cssVar.fgMuted,
        border: '1px solid transparent',
        selectors: {
          '&:hover:not([data-selected]):not([data-disabled])': {
            color: cssVar.fgDefault,
            backgroundColor: cssVar.bgSubtle,
          },
          '&[data-selected]': {
            color: cssVar.accentDefault,
            fontWeight: '700',
            backgroundColor: 'transparent',
          },
        },
      },
    },
    size: {
      xs: { minWidth: '24px', height: '24px', fontSize: '11px', padding: '0 4px' },
      sm: { minWidth: '28px', height: '28px', fontSize: '12px', padding: '0 6px' },
      md: { minWidth: '32px', height: '32px', fontSize: '13px', padding: '0 8px' },
      lg: { minWidth: '36px', height: '36px', fontSize: '14px', padding: '0 10px' },
      xl: { minWidth: '40px', height: '40px', fontSize: '15px', padding: '0 12px' },
    },
  },

  defaultVariants: {
    variant: 'outline',
    size: 'md',
  },
});

export type PaginationPageVariants = RecipeVariants<typeof paginationPageRecipe>;

// ── Control button (prev/next/first/last) ───────────────────────────

export const paginationControlRecipe = recipe({
  base: {
    ...buttonBase,
    background: 'transparent',
    color: cssVar.fgDefault,
    border: `1px solid ${cssVar.borderDefault}`,
    selectors: {
      '&:hover:not([data-disabled])': {
        backgroundColor: cssVar.bgSubtle,
      },
      '&:focus-visible': {
        outline: `2px solid ${cssVar.accentDefault}`,
        outlineOffset: '-2px',
        zIndex: 1,
      },
      '&[data-disabled]': {
        cursor: 'not-allowed',
        opacity: 0.4,
        pointerEvents: 'none',
      },
    },
  },

  variants: {
    size: {
      xs: { minWidth: '24px', height: '24px', fontSize: '11px', padding: '0 4px' },
      sm: { minWidth: '28px', height: '28px', fontSize: '12px', padding: '0 6px' },
      md: { minWidth: '32px', height: '32px', fontSize: '13px', padding: '0 8px' },
      lg: { minWidth: '36px', height: '36px', fontSize: '14px', padding: '0 10px' },
      xl: { minWidth: '40px', height: '40px', fontSize: '15px', padding: '0 12px' },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

export type PaginationControlVariants = RecipeVariants<typeof paginationControlRecipe>;

// ── Ellipsis ────────────────────────────────────────────────────────

export const paginationEllipsisStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: cssVar.fgMuted,
  fontFamily: 'inherit',
  fontSize: 'inherit',
  lineHeight: 1,
  letterSpacing: '2px',
  userSelect: 'none',
  minWidth: '24px',
});

// ── Info text ───────────────────────────────────────────────────────

export const paginationInfoStyle = style({
  color: cssVar.fgMuted,
  fontSize: 'inherit',
  whiteSpace: 'nowrap',
});
