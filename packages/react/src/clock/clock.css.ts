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
  justifyContent: 'center',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  color: 'var(--rel-color-text, #374151)',
});

// ── Size ────────────────────────────────────────────

export const sizeStyles = styleVariants({
  sm: { fontSize: 'var(--rel-text-lg, 18px)' },
  md: { fontSize: 'var(--rel-text-2xl, 24px)' },
  lg: { fontSize: 'var(--rel-text-4xl, 36px)' },
});

// ── Digital ─────────────────────────────────────────

export const digitalStyle = style({
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 600,
  letterSpacing: '0.05em',
  lineHeight: 1,
});

// ── Period ──────────────────────────────────────────

export const periodStyle = style({
  fontSize: '0.5em',
  fontWeight: 500,
  marginLeft: 4,
  color: 'var(--rel-color-text-secondary, #6b7280)',
  verticalAlign: 'super',
});

// ── Analog Face ─────────────────────────────────────

export const faceStyle = style({
  position: 'relative',
});

export const faceSizeStyles = styleVariants({
  sm: { width: 80, height: 80 },
  md: { width: 120, height: 120 },
  lg: { width: 180, height: 180 },
});

// ── Hands ───────────────────────────────────────────

export const hourHandStyle = style({
  transformOrigin: '50% 100%',
  transition: 'transform 300ms ease',
});

export const minuteHandStyle = style({
  transformOrigin: '50% 100%',
  transition: 'transform 300ms ease',
});

export const secondHandStyle = style({
  transformOrigin: '50% 100%',
});
