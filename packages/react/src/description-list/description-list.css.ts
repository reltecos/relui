/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style, styleVariants } from '@vanilla-extract/css';

// ── Root ────────────────────────────────────────────

export const dlRootStyle = style({
  margin: 0,
  padding: 0,
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.5,
});

// ── Direction ───────────────────────────────────────

export const dlDirectionStyles = styleVariants({
  vertical: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  horizontal: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: '8px 16px',
    alignItems: 'baseline',
  },
});

// ── Item (vertical mode wrapper) ────────────────────

export const dlItemStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

// ── Term ────────────────────────────────────────────

export const dlTermBaseStyle = style({
  margin: 0,
  fontWeight: 600,
  color: 'var(--rel-color-text, #111827)',
});

export const dlTermSizeStyles = styleVariants({
  sm: { fontSize: 'var(--rel-text-xs, 12px)' },
  md: { fontSize: 'var(--rel-text-sm, 14px)' },
  lg: { fontSize: 'var(--rel-text-base, 16px)' },
});

// ── Description ─────────────────────────────────────

export const dlDescriptionBaseStyle = style({
  margin: 0,
  color: 'var(--rel-color-text-secondary, #6b7280)',
});

export const dlDescriptionSizeStyles = styleVariants({
  sm: { fontSize: 'var(--rel-text-xs, 12px)' },
  md: { fontSize: 'var(--rel-text-sm, 14px)' },
  lg: { fontSize: 'var(--rel-text-base, 16px)' },
});
