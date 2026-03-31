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
  gap: 8,
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
});

// ── Field ───────────────────────────────────────────

export const fieldStyle = style({
  width: 40,
  height: 48,
  textAlign: 'center',
  fontSize: 'var(--rel-text-lg, 18px)',
  fontWeight: 600,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 6,
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  color: 'var(--rel-color-text, #374151)',
  outline: 'none',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  ':focus': {
    borderColor: 'var(--rel-color-primary, #3b82f6)',
    boxShadow: '0 0 0 3px var(--rel-color-primary-light, rgba(59,130,246,0.15))',
  },
});

// ── Field Filled ────────────────────────────────────

export const fieldFilledStyle = style({
  borderColor: 'var(--rel-color-primary-light, #93bbfd)',
});

// ── Size Variants ───────────────────────────────────

export const sizeStyles = styleVariants({
  sm: { gap: 6 },
  md: { gap: 8 },
  lg: { gap: 10 },
});

export const fieldSizeStyles = styleVariants({
  sm: {
    width: 32,
    height: 40,
    fontSize: 'var(--rel-text-sm, 14px)',
  },
  md: {
    width: 40,
    height: 48,
    fontSize: 'var(--rel-text-lg, 18px)',
  },
  lg: {
    width: 48,
    height: 56,
    fontSize: 'var(--rel-text-xl, 20px)',
  },
});
