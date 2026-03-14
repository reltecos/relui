/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { recipe } from '@vanilla-extract/recipes';
import { style, keyframes } from '@vanilla-extract/css';

// ── Animations ──────────────────────────────────────────

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

// ── Root recipe ──────────────────────────────────────────

export const spinnerRootRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    verticalAlign: 'middle',
  },
  variants: {
    size: {
      xs: { width: 14, height: 14 },
      sm: { width: 18, height: 18 },
      md: { width: 24, height: 24 },
      lg: { width: 32, height: 32 },
      xl: { width: 48, height: 48 },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// ── SVG spinner style ───────────────────────────────────

export const spinnerSvgStyle = style({
  animation: `${spin} 0.65s linear infinite`,
  width: '100%',
  height: '100%',
});

// ── Label style ─────────────────────────────────────────

export const spinnerLabelStyle = style({
  marginLeft: 8,
  fontSize: 'var(--rel-text-sm, 13px)',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  color: 'var(--rel-color-text-secondary, #64748b)',
});
