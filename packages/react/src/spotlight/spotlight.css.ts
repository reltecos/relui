/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Spotlight styles — Vanilla Extract recipes.
 * Spotlight stilleri — Vanilla Extract recipe tabanli.
 *
 * macOS Spotlight tarzi global arama bilesen stilleri.
 *
 * @packageDocumentation
 */

import { style, keyframes } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Animasyonlar ─────────────────────────────────────────────

const slideDown = keyframes({
  from: { opacity: 0, transform: 'translateY(-12px) scale(0.98)' },
  to: { opacity: 1, transform: 'translateY(0) scale(1)' },
});

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

// ── Overlay ──────────────────────────────────────────────────

export const spotOverlayStyle = style({
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
  paddingTop: '12vh',
  animation: `${fadeIn} 120ms ease-out`,
});

// ── Root container ───────────────────────────────────────────

export const spotRootRecipe = recipe({
  base: {
    backgroundColor: cssVar.bgDefault,
    border: `1px solid ${cssVar.borderDefault}`,
    borderRadius: 'var(--rel-radius-xl, 16px)',
    boxShadow: '0 20px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: 'var(--rel-font-sans)',
    animation: `${slideDown} 180ms ease-out`,
    boxSizing: 'border-box',
    maxHeight: '65vh',
  },

  variants: {
    size: {
      xs: { width: '420px', fontSize: '12px' },
      sm: { width: '500px', fontSize: '13px' },
      md: { width: '600px', fontSize: '14px' },
      lg: { width: '700px', fontSize: '15px' },
      xl: { width: '800px', fontSize: '15px' },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

export type SpotlightVariants = RecipeVariants<typeof spotRootRecipe>;

// ── Input area ──────────────────────────────────────────────

export const spotInputWrapperStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '14px 18px',
  borderBottom: `1px solid ${cssVar.borderSubtle}`,
});

export const spotInputIconStyle = style({
  width: '20px',
  height: '20px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  color: cssVar.fgMuted,
});

export const spotInputStyle = style({
  flex: 1,
  border: 'none',
  backgroundColor: 'transparent',
  color: cssVar.fgDefault,
  fontSize: '1.1em',
  fontFamily: 'inherit',
  outline: 'none',
  '::placeholder': {
    color: cssVar.fgMuted,
  },
});

// ── List ─────────────────────────────────────────────────────

export const spotListStyle = style({
  listStyle: 'none',
  margin: 0,
  padding: '6px 0',
  overflowY: 'auto',
  flex: 1,
});

// ── Group header ─────────────────────────────────────────────

export const spotGroupStyle = style({
  padding: '10px 18px 4px',
  fontSize: '0.7em',
  fontWeight: 700,
  color: cssVar.fgMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  userSelect: 'none',
});

// ── Item ─────────────────────────────────────────────────────

export const spotItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 18px',
  cursor: 'pointer',
  transition: 'background-color 80ms ease',
  userSelect: 'none',
  borderRadius: 'var(--rel-radius-md, 8px)',
  margin: '0 6px',
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

export const spotItemIconStyle = style({
  width: '20px',
  height: '20px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  color: cssVar.fgMuted,
});

// ── Item label ───────────────────────────────────────────────

export const spotItemLabelStyle = style({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: cssVar.fgDefault,
});

// ── Item description ─────────────────────────────────────────

export const spotItemDescriptionStyle = style({
  fontSize: '0.85em',
  color: cssVar.fgMuted,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

// ── Empty state ──────────────────────────────────────────────

export const spotEmptyStyle = style({
  padding: '28px 18px',
  textAlign: 'center',
  color: cssVar.fgMuted,
  fontSize: '0.9em',
  userSelect: 'none',
});

// ── Loading state ────────────────────────────────────────────

export const spotLoadingStyle = style({
  padding: '28px 18px',
  textAlign: 'center',
  color: cssVar.fgMuted,
  fontSize: '0.9em',
  userSelect: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
});

// ── Recent searches ──────────────────────────────────────────

export const spotRecentHeaderStyle = style({
  padding: '10px 18px 4px',
  fontSize: '0.7em',
  fontWeight: 700,
  color: cssVar.fgMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  userSelect: 'none',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const spotRecentClearStyle = style({
  fontSize: '1em',
  fontWeight: 400,
  textTransform: 'none',
  letterSpacing: '0',
  color: cssVar.fgMuted,
  cursor: 'pointer',
  border: 'none',
  background: 'none',
  padding: 0,
  fontFamily: 'inherit',
  selectors: {
    '&:hover': {
      color: cssVar.fgDefault,
    },
  },
});

export const spotRecentItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '8px 18px',
  cursor: 'pointer',
  transition: 'background-color 80ms ease',
  userSelect: 'none',
  borderRadius: 'var(--rel-radius-md, 8px)',
  margin: '0 6px',
  color: cssVar.fgMuted,
  fontSize: '0.9em',
  selectors: {
    '&:hover': {
      backgroundColor: cssVar.bgComponentHover,
      color: cssVar.fgDefault,
    },
  },
});
