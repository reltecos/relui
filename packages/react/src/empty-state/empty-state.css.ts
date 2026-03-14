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

export const emptyStateRootRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  },
  variants: {
    size: {
      sm: { padding: '24px 16px', gap: 8 },
      md: { padding: '40px 24px', gap: 12 },
      lg: { padding: '64px 32px', gap: 16 },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// ── Icon ────────────────────────────────────────────

export const emptyStateIconRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--rel-color-text-tertiary, #94a3b8)',
    marginBottom: 4,
  },
  variants: {
    size: {
      sm: { width: 40, height: 40 },
      md: { width: 56, height: 56 },
      lg: { width: 72, height: 72 },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// ── Title ───────────────────────────────────────────

export const emptyStateTitleRecipe = recipe({
  base: {
    fontWeight: 600,
    color: 'var(--rel-color-text-primary, #1e293b)',
    margin: 0,
    lineHeight: 1.3,
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

// ── Description ─────────────────────────────────────

export const emptyStateDescriptionRecipe = recipe({
  base: {
    color: 'var(--rel-color-text-secondary, #64748b)',
    margin: 0,
    lineHeight: 1.5,
    maxWidth: 400,
  },
  variants: {
    size: {
      sm: { fontSize: 'var(--rel-text-xs, 11px)' },
      md: { fontSize: 'var(--rel-text-sm, 13px)' },
      lg: { fontSize: 'var(--rel-text-base, 15px)' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// ── Action ──────────────────────────────────────────

export const emptyStateActionStyle = style({
  display: 'flex',
  gap: 8,
  marginTop: 8,
});
