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
  flexDirection: 'column',
  alignItems: 'center',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.5,
});

// ── Size ────────────────────────────────────────────

export const sizeStyles = styleVariants({
  sm: { gap: 2 },
  md: { gap: 4 },
  lg: { gap: 8 },
});

// ── Display ─────────────────────────────────────────

export const displayStyle = style({
  display: 'inline-flex',
  alignItems: 'baseline',
  gap: 1,
  fontFamily: 'var(--rel-font-mono, "Courier New", monospace)',
  fontWeight: 700,
  letterSpacing: '0.05em',
  color: 'var(--rel-color-text, #111827)',
  backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
  borderRadius: 4,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  lineHeight: 1,
});

export const displaySizeStyles = styleVariants({
  sm: { fontSize: 'var(--rel-text-xl, 20px)', padding: '4px 8px' },
  md: { fontSize: 'var(--rel-text-3xl, 30px)', padding: '8px 12px' },
  lg: { fontSize: 'var(--rel-text-5xl, 48px)', padding: '12px 20px' },
});

// ── Digit ───────────────────────────────────────────

export const digitStyle = style({
  display: 'inline-block',
  textAlign: 'center',
  minWidth: '0.6em',
});

// ── Label ───────────────────────────────────────────

export const labelStyle = style({
  margin: 0,
  fontSize: 'var(--rel-text-sm, 14px)',
  fontWeight: 500,
  color: 'var(--rel-color-text-secondary, #6b7280)',
  lineHeight: 1.4,
});

// ── Unit ────────────────────────────────────────────

export const unitStyle = style({
  fontSize: '0.5em',
  fontWeight: 400,
  color: 'var(--rel-color-text-secondary, #6b7280)',
  marginLeft: 4,
  alignSelf: 'flex-end',
});

// ── MinMax ──────────────────────────────────────────

export const minMaxStyle = style({
  display: 'flex',
  gap: 12,
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-secondary, #9ca3af)',
  lineHeight: 1.4,
});
