/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';

// ── Root recipe ─────────────────────────────────────

export const resultRootRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
    padding: '48px 24px',
    gap: 12,
  },
  variants: {
    size: {
      sm: { padding: '32px 16px', gap: 8 },
      md: { padding: '48px 24px', gap: 12 },
      lg: { padding: '64px 32px', gap: 16 },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// ── Icon ────────────────────────────────────────────

export const resultIconRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  variants: {
    size: {
      sm: { width: 48, height: 48 },
      md: { width: 64, height: 64 },
      lg: { width: 80, height: 80 },
    },
    status: {
      success: { color: 'var(--rel-color-success, #16a34a)' },
      error: { color: 'var(--rel-color-error, #dc2626)' },
      warning: { color: 'var(--rel-color-warning, #f59e0b)' },
      info: { color: 'var(--rel-color-info, #3b82f6)' },
      '404': { color: 'var(--rel-color-text-tertiary, #94a3b8)' },
    },
  },
  defaultVariants: {
    size: 'md',
    status: 'info',
  },
});

// ── Title ───────────────────────────────────────────

export const resultTitleRecipe = recipe({
  base: {
    fontWeight: 700,
    color: 'var(--rel-color-text-primary, #1e293b)',
    margin: 0,
    lineHeight: 1.3,
  },
  variants: {
    size: {
      sm: { fontSize: 'var(--rel-text-lg, 18px)' },
      md: { fontSize: 'var(--rel-text-xl, 20px)' },
      lg: { fontSize: 'var(--rel-text-2xl, 24px)' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// ── Subtitle ────────────────────────────────────────

export const resultSubtitleRecipe = recipe({
  base: {
    color: 'var(--rel-color-text-secondary, #64748b)',
    margin: 0,
    lineHeight: 1.5,
    maxWidth: 480,
  },
  variants: {
    size: {
      sm: { fontSize: 'var(--rel-text-sm, 13px)' },
      md: { fontSize: 'var(--rel-text-base, 15px)' },
      lg: { fontSize: 'var(--rel-text-lg, 18px)' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// ── Extra content ───────────────────────────────────

export const resultExtraStyle = style({
  marginTop: 8,
});

// ── Action ──────────────────────────────────────────

export const resultActionStyle = style({
  display: 'flex',
  gap: 8,
  marginTop: 16,
});
