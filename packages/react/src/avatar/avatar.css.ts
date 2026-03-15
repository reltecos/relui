/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';

// ── Root ────────────────────────────────────────────

export const avatarRootRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    userSelect: 'none',
    flexShrink: 0,
    fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
    fontWeight: 500,
    verticalAlign: 'middle',
    lineHeight: 1,
  },
  variants: {
    size: {
      xs: { width: 24, height: 24, fontSize: 10 },
      sm: { width: 32, height: 32, fontSize: 12 },
      md: { width: 40, height: 40, fontSize: 14 },
      lg: { width: 48, height: 48, fontSize: 18 },
      xl: { width: 64, height: 64, fontSize: 24 },
    },
    variant: {
      circle: { borderRadius: '50%' },
      square: { borderRadius: 6 },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'circle',
  },
});

// ── Image ───────────────────────────────────────────

export const avatarImageStyle = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

// ── Fallback ────────────────────────────────────────

export const avatarFallbackStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  lineHeight: 1,
});
