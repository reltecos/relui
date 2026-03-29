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
  gap: 8,
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
});

// ── Size ────────────────────────────────────────────

export const sizeStyles = styleVariants({
  sm: { gap: 4 },
  md: { gap: 8 },
  lg: { gap: 12 },
});

// ── SVG sizes ───────────────────────────────────────

export const svgSizeStyles = styleVariants({
  sm: { width: 128, height: 128 },
  md: { width: 192, height: 192 },
  lg: { width: 256, height: 256 },
});

// ── SVG ─────────────────────────────────────────────

export const svgStyle = style({
  display: 'block',
});

// ── Label ───────────────────────────────────────────

export const labelStyle = style({
  margin: 0,
  fontSize: 'var(--rel-text-sm, 14px)',
  fontWeight: 500,
  color: 'var(--rel-color-text-secondary, #6b7280)',
  lineHeight: 1.4,
  textAlign: 'center',
});
