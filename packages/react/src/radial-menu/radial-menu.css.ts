/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * RadialMenu styles — Vanilla Extract recipes.
 * RadialMenu stilleri — Vanilla Extract recipe tabanli.
 *
 * Blender/Maya pie menu stilinde dairesel sag tik menu.
 *
 * @packageDocumentation
 */

import { style, keyframes } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Animasyonlar ─────────────────────────────────────────────

const fadeIn = keyframes({
  from: { opacity: 0, transform: 'scale(0.85)' },
  to: { opacity: 1, transform: 'scale(1)' },
});

// ── Overlay ──────────────────────────────────────────────────

export const radialOverlayStyle = style({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 9999,
  pointerEvents: 'auto',
});

// ── Menu container ───────────────────────────────────────────

export const radialMenuRecipe = recipe({
  base: {
    position: 'fixed',
    borderRadius: '50%',
    backgroundColor: cssVar.bgDefault,
    border: `2px solid ${cssVar.borderDefault}`,
    boxShadow: 'var(--rel-shadow-lg, 0 8px 32px rgba(0,0,0,0.18))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    fontFamily: 'var(--rel-font-sans)',
    color: 'var(--rel-color-text, #374151)',
    animation: `${fadeIn} 150ms ease-out`,
    boxSizing: 'border-box',
    overflow: 'visible',
  },

  variants: {
    size: {
      xs: { width: '160px', height: '160px', fontSize: '10px' },
      sm: { width: '200px', height: '200px', fontSize: '11px' },
      md: { width: '250px', height: '250px', fontSize: '12px' },
      lg: { width: '300px', height: '300px', fontSize: '13px' },
      xl: { width: '360px', height: '360px', fontSize: '14px' },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

export type RadialMenuVariants = RecipeVariants<typeof radialMenuRecipe>;

// ── SVG container ────────────────────────────────────────────

export const radialSvgStyle = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
});

// ── Sector (SVG path) ────────────────────────────────────────

export const radialSectorStyle = style({
  fill: cssVar.bgDefault,
  stroke: cssVar.borderDefault,
  strokeWidth: '1px',
  cursor: 'pointer',
  pointerEvents: 'all',
  transition: 'fill 100ms ease',
  selectors: {
    '&[data-highlighted]': {
      fill: cssVar.bgComponentHover,
    },
    '&[data-disabled]': {
      cursor: 'not-allowed',
      opacity: 0.4,
    },
  },
});

// ── Sector label ─────────────────────────────────────────────

export const radialLabelStyle = style({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2px',
  pointerEvents: 'none',
  color: cssVar.fgDefault,
  fontWeight: '500',
  whiteSpace: 'nowrap',
  textAlign: 'center',
  transition: 'color 100ms ease',
  selectors: {
    '&[data-highlighted]': {
      color: cssVar.accentDefault,
      fontWeight: '600',
    },
    '&[data-disabled]': {
      opacity: 0.4,
    },
  },
});

// ── Sector icon ──────────────────────────────────────────────

export const radialIconStyle = style({
  width: '18px',
  height: '18px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

// ── Center dot ───────────────────────────────────────────────

export const radialCenterStyle = style({
  position: 'absolute',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: cssVar.bgDefault,
  border: `2px solid ${cssVar.borderDefault}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2,
  pointerEvents: 'none',
  boxSizing: 'border-box',
});

// ── Submenu indicator ────────────────────────────────────────

export const radialSubmenuIndicatorStyle = style({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: cssVar.accentDefault,
  marginTop: '2px',
  flexShrink: 0,
});
