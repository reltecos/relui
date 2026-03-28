/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';

// ── Root recipe ──────────────────────────────────────────

export const alertRootRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
    color: 'var(--rel-color-text, #374151)',
    borderRadius: 8,
    position: 'relative',
    lineHeight: 1.5,
  },
  variants: {
    variant: {
      filled: {},
      outline: {
        backgroundColor: 'transparent',
      },
      subtle: {
        borderWidth: 0,
      },
    },
    severity: {
      info: {},
      success: {},
      warning: {},
      error: {},
    },
    size: {
      sm: { padding: '8px 12px', fontSize: 'var(--rel-text-sm, 13px)' },
      md: { padding: '12px 16px', fontSize: 'var(--rel-text-sm, 14px)' },
      lg: { padding: '16px 20px', fontSize: 'var(--rel-text-base, 15px)' },
    },
  },
  compoundVariants: [
    // ── filled ──
    { variants: { variant: 'filled', severity: 'info' }, style: { backgroundColor: 'var(--rel-color-info, #3b82f6)', color: 'var(--rel-color-text-inverse, #fff)' } },
    { variants: { variant: 'filled', severity: 'success' }, style: { backgroundColor: 'var(--rel-color-success, #22c55e)', color: 'var(--rel-color-text-inverse, #fff)' } },
    { variants: { variant: 'filled', severity: 'warning' }, style: { backgroundColor: 'var(--rel-color-warning, #f59e0b)', color: 'var(--rel-color-text-inverse, #fff)' } },
    { variants: { variant: 'filled', severity: 'error' }, style: { backgroundColor: 'var(--rel-color-danger, #ef4444)', color: 'var(--rel-color-text-inverse, #fff)' } },
    // ── outline ──
    { variants: { variant: 'outline', severity: 'info' }, style: { border: '1px solid var(--rel-color-info, #3b82f6)', color: 'var(--rel-color-info, #3b82f6)' } },
    { variants: { variant: 'outline', severity: 'success' }, style: { border: '1px solid var(--rel-color-success, #22c55e)', color: 'var(--rel-color-success, #22c55e)' } },
    { variants: { variant: 'outline', severity: 'warning' }, style: { border: '1px solid var(--rel-color-warning, #f59e0b)', color: 'var(--rel-color-warning, #f59e0b)' } },
    { variants: { variant: 'outline', severity: 'error' }, style: { border: '1px solid var(--rel-color-danger, #ef4444)', color: 'var(--rel-color-danger, #ef4444)' } },
    // ── subtle ──
    { variants: { variant: 'subtle', severity: 'info' }, style: { backgroundColor: 'var(--rel-color-info-light, #eff6ff)', color: 'var(--rel-color-info, #3b82f6)' } },
    { variants: { variant: 'subtle', severity: 'success' }, style: { backgroundColor: 'var(--rel-color-success-light, #f0fdf4)', color: 'var(--rel-color-success, #22c55e)' } },
    { variants: { variant: 'subtle', severity: 'warning' }, style: { backgroundColor: 'var(--rel-color-warning-light, #fffbeb)', color: 'var(--rel-color-warning, #f59e0b)' } },
    { variants: { variant: 'subtle', severity: 'error' }, style: { backgroundColor: 'var(--rel-color-danger-light, #fef2f2)', color: 'var(--rel-color-danger, #ef4444)' } },
  ],
  defaultVariants: {
    variant: 'subtle',
    severity: 'info',
    size: 'md',
  },
});

// ── Icon style ──────────────────────────────────────────

export const alertIconStyle = style({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 20,
  height: 20,
  marginTop: 1,
});

// ── Content style ───────────────────────────────────────

export const alertContentStyle = style({
  flex: 1,
  minWidth: 0,
});

// ── Title style ─────────────────────────────────────────

export const alertTitleStyle = style({
  fontWeight: 600,
  marginBottom: 2,
});

// ── Description style ───────────────────────────────────

export const alertDescriptionStyle = style({
  opacity: 0.9,
});

// ── Close button style ──────────────────────────────────

export const alertCloseButtonStyle = style({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  borderRadius: 4,
  padding: 0,
  color: 'currentColor',
  opacity: 0.7,
  transition: 'opacity 150ms ease',
  ':hover': {
    opacity: 1,
  },
});

// ── Action style ────────────────────────────────────────

export const alertActionStyle = style({
  marginTop: 8,
});
