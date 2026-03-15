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

const slideInRight = keyframes({
  '0%': { transform: 'translateX(100%)' },
  '100%': { transform: 'translateX(0)' },
});

// ── Overlay ─────────────────────────────────────────

export const ncOverlayStyle = style({
  position: 'fixed',
  inset: 0,
  zIndex: 499,
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  animation: `${fadeIn} 150ms ease-out`,
});

// ── Panel ───────────────────────────────────────────

export const ncPanelStyle = style({
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  width: 380,
  maxWidth: '100vw',
  zIndex: 500,
  backgroundColor: 'var(--rel-color-bg, #fff)',
  boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.12)',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  animation: `${slideInRight} 200ms ease-out`,
});

// ── Header ──────────────────────────────────────────

export const ncHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  flexShrink: 0,
});

export const ncHeaderTitleStyle = style({
  fontSize: 'var(--rel-text-lg, 16px)',
  fontWeight: 600,
  color: 'var(--rel-color-text, #111827)',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  margin: 0,
});

export const ncBadgeStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 20,
  height: 20,
  padding: '0 6px',
  borderRadius: 10,
  backgroundColor: 'var(--rel-color-error, #dc2626)',
  color: 'var(--rel-color-text-inverse, #fff)',
  fontSize: 11,
  fontWeight: 600,
  lineHeight: 1,
});

export const ncHeaderActionsStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
});

export const ncHeaderActionButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 10px',
  border: 'none',
  borderRadius: 6,
  backgroundColor: 'transparent',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  fontSize: 12,
  cursor: 'pointer',
  ':hover': {
    backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)',
    color: 'var(--rel-color-text, #374151)',
  },
  selectors: {
    '&:disabled': {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
  },
});

// ── List ────────────────────────────────────────────

export const ncListStyle = style({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
});

// ── Group ───────────────────────────────────────────

export const ncGroupTitleStyle = style({
  padding: '8px 20px 4px',
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--rel-color-text-secondary, #9ca3af)',
});

// ── Item ────────────────────────────────────────────

export const ncItemRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '12px 20px',
    borderBottom: '1px solid var(--rel-color-border, #f3f4f6)',
    cursor: 'pointer',
    transition: 'background-color 150ms ease',
    ':hover': {
      backgroundColor: 'var(--rel-color-bg-hover, #f9fafb)',
    },
  },
  variants: {
    read: {
      true: {
        opacity: 0.7,
      },
      false: {
        backgroundColor: 'var(--rel-color-bg-subtle, #f0f9ff)',
      },
    },
  },
  defaultVariants: {
    read: false,
  },
});

export const ncItemIconRecipe = recipe({
  base: {
    flexShrink: 0,
    width: 20,
    height: 20,
    marginTop: 2,
  },
  variants: {
    severity: {
      info: { color: 'var(--rel-color-info, #3b82f6)' },
      success: { color: 'var(--rel-color-success, #16a34a)' },
      warning: { color: 'var(--rel-color-warning, #f59e0b)' },
      error: { color: 'var(--rel-color-error, #dc2626)' },
    },
  },
  defaultVariants: {
    severity: 'info',
  },
});

export const ncItemContentStyle = style({
  flex: 1,
  minWidth: 0,
});

export const ncItemTitleStyle = style({
  fontSize: 'var(--rel-text-sm, 13px)',
  fontWeight: 600,
  color: 'var(--rel-color-text, #111827)',
  marginBottom: 2,
});

export const ncItemMessageStyle = style({
  fontSize: 'var(--rel-text-sm, 13px)',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  lineHeight: 1.4,
});

export const ncItemTimestampStyle = style({
  fontSize: 11,
  color: 'var(--rel-color-text-secondary, #9ca3af)',
  marginTop: 4,
});

export const ncItemCloseButtonStyle = style({
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 20,
  height: 20,
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  borderRadius: 4,
  padding: 0,
  opacity: 0,
  color: 'var(--rel-color-text-secondary, #9ca3af)',
  transition: 'opacity 150ms ease',
  ':hover': {
    opacity: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
  selectors: {
    '*:hover > &': {
      opacity: 0.6,
    },
  },
});

// ── Empty ───────────────────────────────────────────

export const ncEmptyStateStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px 24px',
  textAlign: 'center',
  color: 'var(--rel-color-text-secondary, #9ca3af)',
  fontSize: 'var(--rel-text-sm, 14px)',
});
