/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Breadcrumb styles — Vanilla Extract recipes.
 * Breadcrumb stilleri — Vanilla Extract recipe tabanli.
 *
 * 5 boyut (xs-xl), separator, ellipsis butonu.
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Nav container ──────────────────────────────────────────────────

export const breadcrumbNavStyle = style({
  display: 'block',
});

// ── List (ol) recipe ───────────────────────────────────────────────

export const breadcrumbListRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    fontFamily: 'var(--rel-font-sans)',
    gap: '4px',
  },

  variants: {
    size: {
      xs: { fontSize: '11px', gap: '2px' },
      sm: { fontSize: '12px', gap: '3px' },
      md: { fontSize: '13px', gap: '4px' },
      lg: { fontSize: '14px', gap: '6px' },
      xl: { fontSize: '15px', gap: '8px' },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

export type BreadcrumbListVariants = RecipeVariants<typeof breadcrumbListRecipe>;

// ── Item (li) ──────────────────────────────────────────────────────

export const breadcrumbItemStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'inherit',
});

// ── Link (a veya span) ─────────────────────────────────────────────

export const breadcrumbLinkStyle = style({
  color: cssVar.fgMuted,
  textDecoration: 'none',
  transition: 'color 150ms ease',
  cursor: 'pointer',
  lineHeight: 1.4,
  selectors: {
    '&:hover:not([data-disabled])': {
      color: cssVar.fgDefault,
      textDecoration: 'underline',
    },
    '&[data-disabled]': {
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
    '&[aria-current="page"]': {
      color: cssVar.fgDefault,
      fontWeight: '600',
      cursor: 'default',
      pointerEvents: 'none',
    },
  },
});

// ── Separator ──────────────────────────────────────────────────────

export const breadcrumbSeparatorStyle = style({
  color: cssVar.fgMuted,
  opacity: 0.5,
  userSelect: 'none',
  flexShrink: 0,
  lineHeight: 1,
  display: 'inline-flex',
  alignItems: 'center',
});

// ── Ellipsis button ────────────────────────────────────────────────

export const breadcrumbEllipsisStyle = style({
  appearance: 'none',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: cssVar.fgMuted,
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: '500',
  padding: '2px 6px',
  borderRadius: '4px',
  lineHeight: 1,
  letterSpacing: '1px',
  transition: 'color 150ms ease, background-color 150ms ease',
  selectors: {
    '&:hover': {
      color: cssVar.fgDefault,
      backgroundColor: cssVar.bgSubtle,
    },
    '&:focus-visible': {
      outline: `2px solid ${cssVar.accentDefault}`,
      outlineOffset: '-2px',
    },
  },
});
