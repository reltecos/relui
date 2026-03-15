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
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.5,
});

// ── Size ────────────────────────────────────────────

export const sizeStyles = styleVariants({
  sm: { gap: 2 },
  md: { gap: 4 },
  lg: { gap: 6 },
});

// ── Icon ────────────────────────────────────────────

export const iconStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 4,
  color: 'var(--rel-color-primary, #3b82f6)',
});

// ── Value ───────────────────────────────────────────

export const valueBaseStyle = style({
  margin: 0,
  fontWeight: 700,
  color: 'var(--rel-color-text, #111827)',
  lineHeight: 1.2,
});

export const valueSizeStyles = styleVariants({
  sm: { fontSize: 'var(--rel-text-lg, 18px)' },
  md: { fontSize: 'var(--rel-text-2xl, 24px)' },
  lg: { fontSize: 'var(--rel-text-4xl, 36px)' },
});

// ── Label ───────────────────────────────────────────

export const labelStyle = style({
  margin: 0,
  fontSize: 'var(--rel-text-sm, 14px)',
  fontWeight: 500,
  color: 'var(--rel-color-text-secondary, #6b7280)',
  lineHeight: 1.4,
});

// ── HelpText ────────────────────────────────────────

export const helpTextStyle = style({
  margin: 0,
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-secondary, #9ca3af)',
  lineHeight: 1.4,
});

// ── Trend ───────────────────────────────────────────

export const trendBaseStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 'var(--rel-text-xs, 12px)',
  fontWeight: 600,
  lineHeight: 1.4,
});

export const trendDirectionStyles = styleVariants({
  up: { color: 'var(--rel-color-success, #16a34a)' },
  down: { color: 'var(--rel-color-error, #dc2626)' },
  neutral: { color: 'var(--rel-color-text-secondary, #6b7280)' },
});
