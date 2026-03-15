/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Sidebar styles — Vanilla Extract recipes.
 * Sidebar stilleri — Vanilla Extract recipe tabanli.
 *
 * 5 boyut (xs-xl), daraltilabilir, grup desteği.
 *
 * @packageDocumentation
 */

import { createVar, style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Local CSS Variables ─────────────────────────────────────────────

const sidebarWidth = createVar();
const sidebarCollapsedWidth = createVar();

// ── Root (nav) ──────────────────────────────────────────────────────

export const sidebarRootRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxSizing: 'border-box',
    fontFamily: 'var(--rel-font-sans)',
    backgroundColor: cssVar.bgDefault,
    borderRight: `1px solid ${cssVar.borderDefault}`,
    overflow: 'hidden',
    transition: 'width 200ms ease',
    vars: {
      [sidebarWidth]: '240px',
      [sidebarCollapsedWidth]: '56px',
    },
    width: sidebarWidth,
    selectors: {
      '&[data-collapsed]': {
        width: sidebarCollapsedWidth,
      },
      '&[data-position="right"]': {
        borderRight: 'none',
        borderLeft: `1px solid ${cssVar.borderDefault}`,
      },
    },
  },

  variants: {
    size: {
      xs: { vars: { [sidebarWidth]: '200px', [sidebarCollapsedWidth]: '40px' }, fontSize: '11px' },
      sm: { vars: { [sidebarWidth]: '220px', [sidebarCollapsedWidth]: '48px' }, fontSize: '12px' },
      md: { vars: { [sidebarWidth]: '240px', [sidebarCollapsedWidth]: '56px' }, fontSize: '13px' },
      lg: { vars: { [sidebarWidth]: '280px', [sidebarCollapsedWidth]: '64px' }, fontSize: '14px' },
      xl: { vars: { [sidebarWidth]: '320px', [sidebarCollapsedWidth]: '72px' }, fontSize: '15px' },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

export type SidebarRootVariants = RecipeVariants<typeof sidebarRootRecipe>;

// ── Header ──────────────────────────────────────────────────────────

export const sidebarHeaderStyle = style({
  padding: '12px',
  borderBottom: `1px solid ${cssVar.borderDefault}`,
  flexShrink: 0,
});

// ── Content (scrollable) ────────────────────────────────────────────

export const sidebarContentStyle = style({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: '8px',
});

// ── Footer ──────────────────────────────────────────────────────────

export const sidebarFooterStyle = style({
  padding: '12px',
  borderTop: `1px solid ${cssVar.borderDefault}`,
  flexShrink: 0,
  marginTop: 'auto',
});

// ── Item ────────────────────────────────────────────────────────────

export const sidebarItemStyle = style({
  appearance: 'none',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '8px 12px',
  borderRadius: '6px',
  color: cssVar.fgMuted,
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: '400',
  cursor: 'pointer',
  textDecoration: 'none',
  textAlign: 'left',
  lineHeight: 1.4,
  transition: 'color 150ms ease, background-color 150ms ease',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  boxSizing: 'border-box',
  selectors: {
    '&:hover:not([data-disabled])': {
      color: cssVar.fgDefault,
      backgroundColor: cssVar.bgSubtle,
    },
    '&[data-active]': {
      color: cssVar.accentDefault,
      backgroundColor: cssVar.bgSubtle,
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

// ── Item icon ───────────────────────────────────────────────────────

export const sidebarItemIconStyle = style({
  flexShrink: 0,
  width: '18px',
  height: '18px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

// ── Item label ──────────────────────────────────────────────────────

export const sidebarItemLabelStyle = style({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  selectors: {
    '[data-collapsed] &': {
      display: 'none',
    },
  },
});

// ── Item badge ──────────────────────────────────────────────────────

export const sidebarItemBadgeStyle = style({
  flexShrink: 0,
  fontSize: '10px',
  fontWeight: '600',
  lineHeight: 1,
  padding: '2px 6px',
  borderRadius: '10px',
  backgroundColor: cssVar.accentDefault,
  color: 'var(--rel-color-text-inverse, #fff)',
  selectors: {
    '[data-collapsed] &': {
      display: 'none',
    },
  },
});

// ── Group trigger ───────────────────────────────────────────────────

export const sidebarGroupTriggerStyle = style({
  appearance: 'none',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '8px 12px',
  borderRadius: '6px',
  color: cssVar.fgMuted,
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: '500',
  cursor: 'pointer',
  textAlign: 'left',
  lineHeight: 1.4,
  transition: 'color 150ms ease, background-color 150ms ease',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  boxSizing: 'border-box',
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

// ── Group chevron ───────────────────────────────────────────────────

export const sidebarGroupChevronStyle = style({
  flexShrink: 0,
  width: '14px',
  height: '14px',
  transition: 'transform 200ms ease',
  marginLeft: 'auto',
  color: cssVar.fgMuted,
  selectors: {
    '[data-expanded] > &': {
      transform: 'rotate(90deg)',
    },
    '[data-collapsed] &': {
      display: 'none',
    },
  },
});

// ── Group children ──────────────────────────────────────────────────

export const sidebarGroupChildrenStyle = style({
  paddingLeft: '16px',
  overflow: 'hidden',
});

// ── Collapse toggle button ──────────────────────────────────────────

export const sidebarCollapseButtonStyle = style({
  appearance: 'none',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: '8px',
  cursor: 'pointer',
  color: cssVar.fgMuted,
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

// ── Section header ──────────────────────────────────────────────────

export const sidebarSectionHeaderStyle = style({
  fontSize: '10px',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: cssVar.fgMuted,
  padding: '12px 12px 4px',
  selectors: {
    '[data-collapsed] &': {
      display: 'none',
    },
  },
});

// ── Divider ─────────────────────────────────────────────────────────

export const sidebarDividerStyle = style({
  height: '1px',
  backgroundColor: cssVar.borderDefault,
  margin: '8px 12px',
});
