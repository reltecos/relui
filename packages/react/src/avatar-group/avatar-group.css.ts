/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

// ── Root ────────────────────────────────────────────

export const avatarGroupRootStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
});

// ── Avatar Wrapper ──────────────────────────────────

export const avatarGroupAvatarStyle = style({
  marginLeft: -8,
  selectors: {
    '&:first-child': {
      marginLeft: 0,
    },
  },
});

// ── Overflow ────────────────────────────────────────

export const avatarGroupOverflowRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    backgroundColor: 'var(--rel-color-bg-muted, #e5e7eb)',
    color: 'var(--rel-color-text, #374151)',
    fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
    fontWeight: 600,
    marginLeft: -8,
    lineHeight: 1,
  },
  variants: {
    size: {
      xs: { width: 24, height: 24, fontSize: 9 },
      sm: { width: 32, height: 32, fontSize: 11 },
      md: { width: 40, height: 40, fontSize: 13 },
      lg: { width: 48, height: 48, fontSize: 16 },
      xl: { width: 64, height: 64, fontSize: 20 },
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
