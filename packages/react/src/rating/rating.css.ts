/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style, styleVariants } from '@vanilla-extract/css';

// ── Root ────────────────────────────────────────────

export const rootStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
});

// ── Star Group ──────────────────────────────────────

export const starGroupStyle = style({
  display: 'flex',
  gap: 2,
});

// ── Star ────────────────────────────────────────────

export const starStyle = style({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  transition: 'transform 0.15s ease, color 0.15s ease',
  padding: 0,
  border: 'none',
  background: 'transparent',
  lineHeight: 1,
});

// ── Star Filled (visual marker) ─────────────────────

export const starFilledStyle = style({
  color: 'var(--rel-color-warning, #f59e0b)',
});

// ── Star ReadOnly ───────────────────────────────────

export const starReadOnlyStyle = style({
  cursor: 'default',
  pointerEvents: 'none',
});

// ── Sizes ───────────────────────────────────────────

export const sizeStyles = styleVariants({
  sm: { fontSize: 16 },
  md: { fontSize: 24 },
  lg: { fontSize: 32 },
});

// ── Label ───────────────────────────────────────────

export const labelStyle = style({
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  fontWeight: 500,
});
