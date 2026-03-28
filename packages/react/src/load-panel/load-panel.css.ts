/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { recipe } from '@vanilla-extract/recipes';
import { style, keyframes } from '@vanilla-extract/css';

// ── Animations ──────────────────────────────────────

const fadeIn = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

// ── Overlay ─────────────────────────────────────────

export const loadPanelOverlayRecipe = recipe({
  base: {
    position: 'absolute' as const,
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: `${fadeIn} 200ms ease`,
  },
  variants: {
    backdrop: {
      light: { backgroundColor: 'var(--rel-color-overlay-light, rgba(255, 255, 255, 0.75))' },
      dark: { backgroundColor: 'var(--rel-color-overlay, rgba(0, 0, 0, 0.5))' },
      none: { backgroundColor: 'transparent' },
    },
    fullscreen: {
      true: { position: 'fixed' as const },
      false: { position: 'absolute' as const },
    },
  },
  defaultVariants: {
    backdrop: 'light',
    fullscreen: false,
  },
});

// ── Content ─────────────────────────────────────────

export const loadPanelContentStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 12,
});

// ── Spinner SVG ─────────────────────────────────────

export const loadPanelSpinnerRecipe = recipe({
  base: {
    animation: `${spin} 0.65s linear infinite`,
  },
  variants: {
    size: {
      sm: { width: 24, height: 24 },
      md: { width: 36, height: 36 },
      lg: { width: 48, height: 48 },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// ── Message ─────────────────────────────────────────

export const loadPanelMessageStyle = style({
  fontSize: 'var(--rel-text-sm, 13px)',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  color: 'var(--rel-color-text-secondary, #64748b)',
  textAlign: 'center',
  maxWidth: 240,
  lineHeight: 1.4,
});
