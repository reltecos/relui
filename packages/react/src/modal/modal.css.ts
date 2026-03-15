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

const scaleInCentered = keyframes({
  '0%': { opacity: 0, transform: 'scale(0.95)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
});

// ── Overlay ─────────────────────────────────────────

export const modalOverlayStyle = style({
  position: 'fixed',
  inset: 0,
  zIndex: 9998,
  backgroundColor: 'var(--rel-color-overlay, rgba(0, 0, 0, 0.5))',
  animation: `${fadeIn} 200ms ease-out`,
});

// ── Content wrapper (for centering) ─────────────────

export const modalWrapperStyle = style({
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  overflow: 'auto',
});

// ── Content ─────────────────────────────────────────

export const modalContentRecipe = recipe({
  base: {
    position: 'relative',
    backgroundColor: 'var(--rel-color-bg, #fff)',
    borderRadius: 12,
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.1)',
    fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
    width: '100%',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    animation: `${scaleInCentered} 200ms ease-out`,
  },
  variants: {
    size: {
      sm: { maxWidth: 400 },
      md: { maxWidth: 560 },
      lg: { maxWidth: 720 },
      xl: { maxWidth: 900 },
      full: {
        maxWidth: 'none',
        width: 'calc(100vw - 48px)',
        height: 'calc(100vh - 48px)',
        maxHeight: 'calc(100vh - 48px)',
        borderRadius: 8,
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// ── Header ──────────────────────────────────────────

export const modalHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  flexShrink: 0,
});

// ── Title ───────────────────────────────────────────

export const modalTitleStyle = style({
  fontSize: 'var(--rel-text-lg, 18px)',
  fontWeight: 600,
  color: 'var(--rel-color-text, #111827)',
  margin: 0,
});

// ── Close Button ────────────────────────────────────

export const modalCloseButtonStyle = style({
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

export const modalBodyStyle = style({
  padding: 20,
  flex: 1,
  overflow: 'auto',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.6,
});

// ── Footer ──────────────────────────────────────────

export const modalFooterStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 8,
  padding: '12px 20px',
  borderTop: '1px solid var(--rel-color-border, #e5e7eb)',
  flexShrink: 0,
});
