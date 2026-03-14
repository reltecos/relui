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

const scaleIn = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -50%) scale(0.95)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
});

// ── Overlay ─────────────────────────────────────────

export const alertDialogOverlayStyle = style({
  position: 'fixed',
  inset: 0,
  zIndex: 500,
  backgroundColor: 'rgba(0, 0, 0, 0.45)',
  animation: `${fadeIn} 150ms ease-out`,
});

// ── Content ─────────────────────────────────────────

export const alertDialogContentRecipe = recipe({
  base: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 501,
    backgroundColor: '#fff',
    borderRadius: 12,
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1)',
    fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
    maxWidth: 440,
    width: '90vw',
    maxHeight: '85vh',
    overflow: 'auto',
    animation: `${scaleIn} 200ms ease-out`,
    outline: 'none',
  },
  variants: {
    severity: {
      danger: {
        borderTop: '3px solid var(--rel-color-error, #dc2626)',
      },
      warning: {
        borderTop: '3px solid var(--rel-color-warning, #f59e0b)',
      },
      info: {
        borderTop: '3px solid var(--rel-color-info, #3b82f6)',
      },
    },
  },
  defaultVariants: {
    severity: 'danger',
  },
});

// ── Header ──────────────────────────────────────────

export const alertDialogHeaderStyle = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  padding: '20px 24px 0',
});

// ── Icon ────────────────────────────────────────────

export const alertDialogIconRecipe = recipe({
  base: {
    flexShrink: 0,
    width: 24,
    height: 24,
    marginTop: 2,
  },
  variants: {
    severity: {
      danger: { color: 'var(--rel-color-error, #dc2626)' },
      warning: { color: 'var(--rel-color-warning, #f59e0b)' },
      info: { color: 'var(--rel-color-info, #3b82f6)' },
    },
  },
  defaultVariants: {
    severity: 'danger',
  },
});

// ── Title ───────────────────────────────────────────

export const alertDialogTitleStyle = style({
  fontSize: 'var(--rel-text-lg, 16px)',
  fontWeight: 600,
  lineHeight: 1.4,
  color: 'var(--rel-color-text, #111827)',
  margin: 0,
});

// ── Description ─────────────────────────────────────

export const alertDialogDescriptionStyle = style({
  padding: '12px 24px 0',
  fontSize: 'var(--rel-text-sm, 14px)',
  lineHeight: 1.6,
  color: 'var(--rel-color-text-secondary, #6b7280)',
  margin: 0,
});

// ── Footer ──────────────────────────────────────────

export const alertDialogFooterStyle = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 8,
  padding: '20px 24px',
});

// ── Buttons ─────────────────────────────────────────

export const alertDialogCancelButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px 16px',
  fontSize: 'var(--rel-text-sm, 14px)',
  fontWeight: 500,
  lineHeight: 1,
  border: '1px solid var(--rel-color-border, #d1d5db)',
  borderRadius: 8,
  backgroundColor: '#fff',
  color: 'var(--rel-color-text, #374151)',
  cursor: 'pointer',
  transition: 'background-color 150ms ease, border-color 150ms ease',
  ':hover': {
    backgroundColor: '#f9fafb',
    borderColor: '#9ca3af',
  },
  ':focus-visible': {
    outline: '2px solid var(--rel-color-primary, #3b82f6)',
    outlineOffset: 2,
  },
  selectors: {
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
});

export const alertDialogConfirmButtonRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 16px',
    fontSize: 'var(--rel-text-sm, 14px)',
    fontWeight: 500,
    lineHeight: 1,
    border: '1px solid transparent',
    borderRadius: 8,
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 150ms ease, opacity 150ms ease',
    ':focus-visible': {
      outline: '2px solid var(--rel-color-primary, #3b82f6)',
      outlineOffset: 2,
    },
    selectors: {
      '&:disabled': {
        opacity: 0.6,
        cursor: 'not-allowed',
      },
    },
  },
  variants: {
    severity: {
      danger: {
        backgroundColor: 'var(--rel-color-error, #dc2626)',
        ':hover': {
          backgroundColor: '#b91c1c',
        },
      },
      warning: {
        backgroundColor: 'var(--rel-color-warning, #f59e0b)',
        color: '#1f2937',
        ':hover': {
          backgroundColor: '#d97706',
        },
      },
      info: {
        backgroundColor: 'var(--rel-color-info, #3b82f6)',
        ':hover': {
          backgroundColor: '#2563eb',
        },
      },
    },
  },
  defaultVariants: {
    severity: 'danger',
  },
});
