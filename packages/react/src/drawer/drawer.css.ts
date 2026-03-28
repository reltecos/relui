/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style, keyframes } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

// ── Animations ──────────────────────────────────────

const fadeIn = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

// ── Overlay ─────────────────────────────────────────

export const drawerOverlayStyle = style({
  position: 'fixed',
  inset: 0,
  zIndex: 9998,
  backgroundColor: 'var(--rel-color-overlay, rgba(0, 0, 0, 0.5))',
  animation: `${fadeIn} 200ms ease-out`,
});

// ── Panel ───────────────────────────────────────────

const sizeMap = {
  sm: 280,
  md: 380,
  lg: 500,
  xl: 640,
};

export const drawerPanelRecipe = recipe({
  base: {
    position: 'fixed',
    zIndex: 9999,
    backgroundColor: 'var(--rel-color-bg, #fff)',
    boxShadow: 'var(--rel-shadow-xl, 0 20px 60px rgba(0, 0, 0, 0.15))',
    fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 300ms ease',
  },
  variants: {
    placement: {
      left: {
        top: 0,
        left: 0,
        bottom: 0,
        width: sizeMap.md,
      },
      right: {
        top: 0,
        right: 0,
        bottom: 0,
        width: sizeMap.md,
      },
      top: {
        top: 0,
        left: 0,
        right: 0,
        height: sizeMap.md,
      },
      bottom: {
        bottom: 0,
        left: 0,
        right: 0,
        height: sizeMap.md,
      },
    },
    size: {
      sm: {},
      md: {},
      lg: {},
      xl: {},
      full: {},
    },
  },
  compoundVariants: [
    // Left
    { variants: { placement: 'left', size: 'sm' }, style: { width: sizeMap.sm } },
    { variants: { placement: 'left', size: 'lg' }, style: { width: sizeMap.lg } },
    { variants: { placement: 'left', size: 'xl' }, style: { width: sizeMap.xl } },
    { variants: { placement: 'left', size: 'full' }, style: { width: '100vw' } },
    // Right
    { variants: { placement: 'right', size: 'sm' }, style: { width: sizeMap.sm } },
    { variants: { placement: 'right', size: 'lg' }, style: { width: sizeMap.lg } },
    { variants: { placement: 'right', size: 'xl' }, style: { width: sizeMap.xl } },
    { variants: { placement: 'right', size: 'full' }, style: { width: '100vw' } },
    // Top
    { variants: { placement: 'top', size: 'sm' }, style: { height: sizeMap.sm } },
    { variants: { placement: 'top', size: 'lg' }, style: { height: sizeMap.lg } },
    { variants: { placement: 'top', size: 'xl' }, style: { height: sizeMap.xl } },
    { variants: { placement: 'top', size: 'full' }, style: { height: '100vh' } },
    // Bottom
    { variants: { placement: 'bottom', size: 'sm' }, style: { height: sizeMap.sm } },
    { variants: { placement: 'bottom', size: 'lg' }, style: { height: sizeMap.lg } },
    { variants: { placement: 'bottom', size: 'xl' }, style: { height: sizeMap.xl } },
    { variants: { placement: 'bottom', size: 'full' }, style: { height: '100vh' } },
  ],
  defaultVariants: {
    placement: 'right',
    size: 'md',
  },
});

// ── Header ──────────────────────────────────────────

export const drawerHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  flexShrink: 0,
});

// ── Title ───────────────────────────────────────────

export const drawerTitleStyle = style({
  fontSize: 'var(--rel-text-lg, 18px)',
  fontWeight: 600,
  color: 'var(--rel-color-text, #111827)',
  margin: 0,
});

// ── Close Button ────────────────────────────────────

export const drawerCloseButtonStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  border: 'none',
  borderRadius: 6,
  backgroundColor: 'transparent',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  cursor: 'pointer',
  flexShrink: 0,
  ':hover': {
    backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)',
    color: 'var(--rel-color-text, #374151)',
  },
});

// ── Body ────────────────────────────────────────────

export const drawerBodyStyle = style({
  padding: 20,
  flex: 1,
  overflow: 'auto',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.6,
});

// ── Footer ──────────────────────────────────────────

export const drawerFooterStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 8,
  padding: '12px 20px',
  borderTop: '1px solid var(--rel-color-border, #e5e7eb)',
  flexShrink: 0,
});
