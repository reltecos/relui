/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { recipe } from '@vanilla-extract/recipes';
import { style, keyframes } from '@vanilla-extract/css';

// ── Animations ──────────────────────────────────────────

const scaleIn = keyframes({
  '0%': { opacity: 0, transform: 'scale(0.4)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
});

const rotate45 = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(45deg)' },
});

// ── Root (container) ────────────────────────────────────

export const fabRootRecipe = recipe({
  base: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1000,
    gap: 8,
  },
  variants: {
    position: {
      'bottom-right': { bottom: 24, right: 24 },
      'bottom-left': { bottom: 24, left: 24 },
      'top-right': { top: 24, right: 24 },
      'top-left': { top: 24, left: 24 },
    },
    direction: {
      up: { flexDirection: 'column-reverse' as const },
      down: { flexDirection: 'column' as const },
    },
  },
  defaultVariants: {
    position: 'bottom-right',
    direction: 'up',
  },
});

// ── Main button ─────────────────────────────────────────

export const fabButtonRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '50%',
    fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
    fontWeight: 600,
    transition: 'background-color 200ms ease, transform 200ms ease, box-shadow 200ms ease',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)',
    color: '#fff',
    ':hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.12)',
    },
    ':active': {
      transform: 'scale(0.95)',
    },
  },
  variants: {
    variant: {
      filled: {
        backgroundColor: 'var(--rel-color-primary, #3b82f6)',
        ':hover': {
          backgroundColor: 'var(--rel-color-primary-hover, #2563eb)',
        },
      },
      secondary: {
        backgroundColor: 'var(--rel-color-secondary, #64748b)',
        ':hover': {
          backgroundColor: 'var(--rel-color-secondary-hover, #475569)',
        },
      },
      danger: {
        backgroundColor: 'var(--rel-color-danger, #ef4444)',
        ':hover': {
          backgroundColor: 'var(--rel-color-danger-hover, #dc2626)',
        },
      },
    },
    size: {
      sm: { width: 40, height: 40 },
      md: { width: 52, height: 52 },
      lg: { width: 64, height: 64 },
    },
  },
  defaultVariants: {
    variant: 'filled',
    size: 'md',
  },
});

// ── Button icon ─────────────────────────────────────────

export const fabIconStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 300ms ease',
  pointerEvents: 'none',
});

export const fabIconOpenStyle = style({
  animation: `${rotate45} 300ms ease forwards`,
});

// ── Icon size helpers ───────────────────────────────────

export const fabIconSizeRecipe = recipe({
  base: {},
  variants: {
    size: {
      sm: { width: 18, height: 18 },
      md: { width: 22, height: 22 },
      lg: { width: 26, height: 26 },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// ── Action item ─────────────────────────────────────────

export const fabActionRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    animation: `${scaleIn} 200ms ease both`,
  },
  variants: {
    direction: {
      up: {},
      down: {},
    },
  },
  defaultVariants: {
    direction: 'up',
  },
});

// ── Action button ───────────────────────────────────────

export const fabActionButtonRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '50%',
    backgroundColor: 'var(--rel-color-bg, #fff)',
    color: 'var(--rel-color-text, #1e293b)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
    transition: 'background-color 150ms ease, transform 150ms ease, box-shadow 150ms ease',
    ':hover': {
      backgroundColor: 'var(--rel-color-bg-subtle, #f1f5f9)',
      transform: 'scale(1.08)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    ':active': {
      transform: 'scale(0.95)',
    },
  },
  variants: {
    size: {
      sm: { width: 32, height: 32 },
      md: { width: 40, height: 40 },
      lg: { width: 48, height: 48 },
    },
    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'default',
        pointerEvents: 'none' as const,
      },
      false: {},
    },
  },
  defaultVariants: {
    size: 'md',
    disabled: false,
  },
});

// ── Action label (tooltip) ──────────────────────────────

export const fabActionLabelStyle = style({
  fontSize: 12,
  fontWeight: 500,
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  color: 'var(--rel-color-text, #1e293b)',
  backgroundColor: 'var(--rel-color-bg, #fff)',
  padding: '4px 10px',
  borderRadius: 4,
  boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
});

// ── Overlay (backdrop) ──────────────────────────────────

export const fabOverlayStyle = style({
  position: 'fixed',
  inset: 0,
  zIndex: 999,
});
