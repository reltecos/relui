/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * CommandPalette styles — Vanilla Extract recipes.
 * CommandPalette stilleri — Vanilla Extract recipe tabanli.
 *
 * VS Code Ctrl+K tarzi arama-tabanli komut calistiricisi.
 *
 * @packageDocumentation
 */

import { style, keyframes } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Animasyonlar ─────────────────────────────────────────────

const slideDown = keyframes({
  from: { opacity: 0, transform: 'translateY(-8px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

// ── Overlay ──────────────────────────────────────────────────

export const cpOverlayStyle = style({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 9999,
  pointerEvents: 'auto',
  backgroundColor: cssVar.bgOverlay,
  display: 'flex',
  justifyContent: 'center',
  paddingTop: '15vh',
});

// ── Root container ───────────────────────────────────────────

export const cpRootRecipe = recipe({
  base: {
    backgroundColor: cssVar.bgDefault,
    border: `1px solid ${cssVar.borderDefault}`,
    borderRadius: 'var(--rel-radius-lg)',
    boxShadow: '0 16px 70px rgba(0,0,0,0.25)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: 'var(--rel-font-sans)',
    animation: `${slideDown} 150ms ease-out`,
    boxSizing: 'border-box',
    maxHeight: '60vh',
  },

  variants: {
    size: {
      xs: { width: '380px', fontSize: '12px' },
      sm: { width: '440px', fontSize: '13px' },
      md: { width: '520px', fontSize: '14px' },
      lg: { width: '600px', fontSize: '14px' },
      xl: { width: '700px', fontSize: '15px' },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

export type CommandPaletteVariants = RecipeVariants<typeof cpRootRecipe>;

// ── Input ────────────────────────────────────────────────────

export const cpInputStyle = style({
  width: '100%',
  padding: '12px 16px',
  border: 'none',
  borderBottom: `1px solid ${cssVar.borderSubtle}`,
  backgroundColor: 'transparent',
  color: cssVar.fgDefault,
  fontSize: 'inherit',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
  '::placeholder': {
    color: cssVar.fgMuted,
  },
});

// ── List ─────────────────────────────────────────────────────

export const cpListStyle = style({
  listStyle: 'none',
  margin: 0,
  padding: '4px 0',
  overflowY: 'auto',
  flex: 1,
});

// ── Group header ─────────────────────────────────────────────

export const cpGroupStyle = style({
  padding: '8px 16px 4px',
  fontSize: '0.75em',
  fontWeight: 600,
  color: cssVar.fgMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  userSelect: 'none',
});

// ── Item ─────────────────────────────────────────────────────

export const cpItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '8px 16px',
  cursor: 'pointer',
  transition: 'background-color 80ms ease',
  userSelect: 'none',
  selectors: {
    '&[data-highlighted]': {
      backgroundColor: cssVar.bgComponentHover,
    },
    '&[data-disabled]': {
      cursor: 'not-allowed',
      opacity: 0.4,
    },
  },
});

// ── Item icon ────────────────────────────────────────────────

export const cpItemIconStyle = style({
  width: '18px',
  height: '18px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  color: cssVar.fgMuted,
});

// ── Item label ───────────────────────────────────────────────

export const cpItemLabelStyle = style({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: cssVar.fgDefault,
});

// ── Item description ─────────────────────────────────────────

export const cpItemDescriptionStyle = style({
  fontSize: '0.85em',
  color: cssVar.fgMuted,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  marginLeft: '4px',
});

// ── Item shortcut ────────────────────────────────────────────

export const cpItemShortcutStyle = style({
  fontSize: '0.8em',
  color: cssVar.fgMuted,
  flexShrink: 0,
  display: 'flex',
  gap: '4px',
  marginLeft: 'auto',
});

// ── Shortcut key badge ───────────────────────────────────────

export const cpShortcutKeyStyle = style({
  padding: '1px 5px',
  borderRadius: 'var(--rel-radius-sm)',
  backgroundColor: cssVar.bgComponent,
  border: `1px solid ${cssVar.borderSubtle}`,
  fontSize: '0.9em',
  fontFamily: 'inherit',
  lineHeight: 1.4,
});

// ── Empty state ──────────────────────────────────────────────

export const cpEmptyStyle = style({
  padding: '24px 16px',
  textAlign: 'center',
  color: cssVar.fgMuted,
  fontSize: '0.9em',
  userSelect: 'none',
});
