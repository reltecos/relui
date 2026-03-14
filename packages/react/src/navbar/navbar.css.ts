/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Navbar styles — Vanilla Extract recipes.
 * Navbar stilleri — Vanilla Extract recipe tabanli.
 *
 * 5 boyut (xs-xl), 3 variant (solid/transparent/blur).
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Root (nav) ──────────────────────────────────────────────────

export const navbarRootRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'var(--rel-font-sans)',
    transition: 'background-color 200ms ease, box-shadow 200ms ease',
  },

  variants: {
    size: {
      xs: { height: '40px', padding: '0 12px', fontSize: '11px', gap: '8px' },
      sm: { height: '48px', padding: '0 16px', fontSize: '12px', gap: '10px' },
      md: { height: '56px', padding: '0 20px', fontSize: '13px', gap: '12px' },
      lg: { height: '64px', padding: '0 24px', fontSize: '14px', gap: '16px' },
      xl: { height: '72px', padding: '0 32px', fontSize: '15px', gap: '20px' },
    },
    variant: {
      solid: {
        backgroundColor: cssVar.bgDefault,
        borderBottom: `1px solid ${cssVar.borderDefault}`,
      },
      transparent: {
        backgroundColor: 'transparent',
        borderBottom: 'none',
      },
      blur: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${cssVar.borderDefault}`,
      },
    },
  },

  defaultVariants: {
    size: 'md',
    variant: 'solid',
  },
});

export type NavbarRootVariants = RecipeVariants<typeof navbarRootRecipe>;

// ── Brand ───────────────────────────────────────────────────────

export const navbarBrandStyle = style({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  fontWeight: '700',
  color: cssVar.fgDefault,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
});

// ── Content (nav items) ─────────────────────────────────────────

export const navbarContentStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  flex: 1,
});

// ── Item ────────────────────────────────────────────────────────

export const navbarItemStyle = style({
  appearance: 'none',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  borderRadius: '6px',
  color: cssVar.fgMuted,
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: '500',
  cursor: 'pointer',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  lineHeight: 1.4,
  transition: 'color 150ms ease, background-color 150ms ease',
  boxSizing: 'border-box',
  selectors: {
    '&:hover:not([data-disabled])': {
      color: cssVar.fgDefault,
      backgroundColor: cssVar.bgSubtle,
    },
    '&[data-active]': {
      color: cssVar.accentDefault,
      fontWeight: '600',
    },
    '&[data-disabled]': {
      opacity: 0.4,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
    '&:focus-visible': {
      outline: `2px solid ${cssVar.accentDefault}`,
      outlineOffset: '-2px',
    },
  },
});

// ── Item icon ───────────────────────────────────────────────────

export const navbarItemIconStyle = style({
  flexShrink: 0,
  width: '16px',
  height: '16px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

// ── Item label ──────────────────────────────────────────────────

export const navbarItemLabelStyle = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

// ── Actions slot ────────────────────────────────────────────────

export const navbarActionsStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
  marginLeft: 'auto',
});

// ── Mobile toggle button ────────────────────────────────────────

export const navbarMobileToggleStyle = style({
  appearance: 'none',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  borderRadius: '6px',
  cursor: 'pointer',
  color: cssVar.fgMuted,
  flexShrink: 0,
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
  '@media': {
    '(max-width: 768px)': {
      display: 'inline-flex',
    },
  },
});

// ── Mobile menu ─────────────────────────────────────────────────

export const navbarMobileMenuStyle = style({
  display: 'none',
  flexDirection: 'column',
  gap: '4px',
  padding: '8px',
  borderTop: `1px solid ${cssVar.borderDefault}`,
  backgroundColor: cssVar.bgDefault,
  '@media': {
    '(max-width: 768px)': {
      display: 'flex',
    },
  },
});

// ── Desktop content hide on mobile ──────────────────────────────

export const navbarDesktopContentStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  flex: 1,
  '@media': {
    '(max-width: 768px)': {
      display: 'none',
    },
  },
});

export const navbarDesktopActionsStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
  marginLeft: 'auto',
  '@media': {
    '(max-width: 768px)': {
      display: 'none',
    },
  },
});
