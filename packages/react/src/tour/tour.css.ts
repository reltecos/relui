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

const popIn = keyframes({
  '0%': { opacity: 0, transform: 'scale(0.95)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
});

// ── Overlay ─────────────────────────────────────────

export const tourOverlayStyle = style({
  position: 'fixed',
  inset: 0,
  zIndex: 9998,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  animation: `${fadeIn} 200ms ease-out`,
});

// ── Spotlight (hedef vurgulama) ─────────────────────

export const tourSpotlightStyle = style({
  position: 'absolute',
  zIndex: 9998,
  borderRadius: 8,
  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
  pointerEvents: 'none',
  transition: 'all 300ms ease',
});

// ── Popover ─────────────────────────────────────────

export const tourPopoverRecipe = recipe({
  base: {
    position: 'absolute',
    zIndex: 9999,
    backgroundColor: '#fff',
    borderRadius: 12,
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)',
    fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
    maxWidth: 340,
    width: 'max-content',
    animation: `${popIn} 200ms ease-out`,
    padding: 20,
  },
  variants: {
    placement: {
      top: {},
      bottom: {},
      left: {},
      right: {},
    },
  },
  defaultVariants: {
    placement: 'bottom',
  },
});

// ── Title ───────────────────────────────────────────

export const tourTitleStyle = style({
  fontSize: 'var(--rel-text-base, 15px)',
  fontWeight: 600,
  color: 'var(--rel-color-text, #111827)',
  marginBottom: 6,
});

// ── Description ─────────────────────────────────────

export const tourDescriptionStyle = style({
  fontSize: 'var(--rel-text-sm, 13px)',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  lineHeight: 1.5,
  marginBottom: 16,
});

// ── Footer ──────────────────────────────────────────

export const tourFooterStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
});

// ── Step indicator ──────────────────────────────────

export const tourStepIndicatorStyle = style({
  fontSize: 12,
  color: 'var(--rel-color-text-secondary, #9ca3af)',
});

// ── Buttons ─────────────────────────────────────────

export const tourButtonGroupStyle = style({
  display: 'flex',
  gap: 6,
});

export const tourSkipButtonStyle = style({
  padding: '6px 12px',
  fontSize: 13,
  fontWeight: 500,
  border: 'none',
  borderRadius: 6,
  backgroundColor: 'transparent',
  color: 'var(--rel-color-text-secondary, #9ca3af)',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)',
    color: 'var(--rel-color-text, #374151)',
  },
});

export const tourPrevButtonStyle = style({
  padding: '6px 12px',
  fontSize: 13,
  fontWeight: 500,
  border: '1px solid var(--rel-color-border, #d1d5db)',
  borderRadius: 6,
  backgroundColor: '#fff',
  color: 'var(--rel-color-text, #374151)',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#f9fafb',
  },
  selectors: {
    '&:disabled': {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
  },
});

export const tourNextButtonStyle = style({
  padding: '6px 14px',
  fontSize: 13,
  fontWeight: 500,
  border: '1px solid transparent',
  borderRadius: 6,
  backgroundColor: 'var(--rel-color-primary, #3b82f6)',
  color: '#fff',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#2563eb',
  },
});
