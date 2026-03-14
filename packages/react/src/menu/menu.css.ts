/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Menu styles — Vanilla Extract recipes.
 * Menu stilleri — Vanilla Extract recipe tabanli.
 *
 * Masaustu tarzi menu cubugu stilleri.
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Menubar (root) ──────────────────────────────────────────────

export const menuBarRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    fontFamily: 'var(--rel-font-sans)',
    backgroundColor: cssVar.bgDefault,
    borderBottom: `1px solid ${cssVar.borderDefault}`,
    boxSizing: 'border-box',
    userSelect: 'none',
  },

  variants: {
    size: {
      xs: { height: '28px', padding: '0 4px', fontSize: '11px' },
      sm: { height: '32px', padding: '0 6px', fontSize: '12px' },
      md: { height: '36px', padding: '0 8px', fontSize: '13px' },
      lg: { height: '40px', padding: '0 10px', fontSize: '14px' },
      xl: { height: '44px', padding: '0 12px', fontSize: '15px' },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

export type MenuBarVariants = RecipeVariants<typeof menuBarRecipe>;

// ── Trigger (top-level menu item) ───────────────────────────────

export const menuTriggerStyle = style({
  appearance: 'none',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 10px',
  borderRadius: '4px',
  color: cssVar.fgDefault,
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: '400',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  lineHeight: 1.4,
  transition: 'color 100ms ease, background-color 100ms ease',
  boxSizing: 'border-box',
  selectors: {
    '&:hover, &[data-active]': {
      backgroundColor: cssVar.bgSubtle,
    },
    '&[data-highlighted]': {
      backgroundColor: cssVar.bgSubtle,
    },
    '&:focus-visible': {
      outline: `2px solid ${cssVar.accentDefault}`,
      outlineOffset: '-2px',
    },
  },
});

// ── Dropdown ────────────────────────────────────────────────────

export const menuDropdownStyle = style({
  position: 'absolute',
  top: '100%',
  left: 0,
  minWidth: '200px',
  maxWidth: '320px',
  padding: '4px',
  borderRadius: '8px',
  backgroundColor: cssVar.bgDefault,
  border: `1px solid ${cssVar.borderDefault}`,
  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
  zIndex: 1000,
  boxSizing: 'border-box',
});

// ── Submenu dropdown ────────────────────────────────────────────

export const menuSubmenuStyle = style({
  position: 'absolute',
  top: '-4px',
  left: '100%',
  minWidth: '180px',
  maxWidth: '320px',
  padding: '4px',
  borderRadius: '8px',
  backgroundColor: cssVar.bgDefault,
  border: `1px solid ${cssVar.borderDefault}`,
  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
  zIndex: 1001,
  boxSizing: 'border-box',
});

// ── Menu item ───────────────────────────────────────────────────

export const menuItemStyle = style({
  appearance: 'none',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
  padding: '6px 10px',
  borderRadius: '4px',
  color: cssVar.fgDefault,
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: '400',
  cursor: 'pointer',
  textDecoration: 'none',
  textAlign: 'left',
  lineHeight: 1.4,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  transition: 'color 100ms ease, background-color 100ms ease',
  selectors: {
    '&:hover:not([data-disabled]), &[data-highlighted]:not([data-disabled])': {
      backgroundColor: cssVar.accentDefault,
      color: '#fff',
    },
    '&[data-disabled]': {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
    '&:focus-visible': {
      outline: `2px solid ${cssVar.accentDefault}`,
      outlineOffset: '-2px',
    },
  },
});

// ── Menu item icon ──────────────────────────────────────────────

export const menuItemIconStyle = style({
  flexShrink: 0,
  width: '16px',
  height: '16px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

// ── Menu item label ─────────────────────────────────────────────

export const menuItemLabelStyle = style({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

// ── Menu item shortcut ──────────────────────────────────────────

export const menuItemShortcutStyle = style({
  flexShrink: 0,
  fontSize: '0.85em',
  color: cssVar.fgMuted,
  marginLeft: 'auto',
  paddingLeft: '16px',
  selectors: {
    '[data-highlighted] > &': {
      color: 'rgba(255,255,255,0.7)',
    },
  },
});

// ── Menu item check ─────────────────────────────────────────────

export const menuItemCheckStyle = style({
  flexShrink: 0,
  width: '14px',
  height: '14px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

// ── Submenu indicator ───────────────────────────────────────────

export const menuSubmenuIndicatorStyle = style({
  flexShrink: 0,
  width: '12px',
  height: '12px',
  marginLeft: 'auto',
  color: cssVar.fgMuted,
  selectors: {
    '[data-highlighted] > &': {
      color: 'rgba(255,255,255,0.7)',
    },
  },
});

// ── Divider ─────────────────────────────────────────────────────

export const menuDividerStyle = style({
  height: '1px',
  backgroundColor: cssVar.borderDefault,
  margin: '4px 6px',
});
