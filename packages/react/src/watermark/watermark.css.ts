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
  position: 'relative',
  overflow: 'hidden',
});

// ── Content ─────────────────────────────────────────

export const contentStyle = style({
  position: 'relative',
  zIndex: 0,
});

// ── Overlay ─────────────────────────────────────────

export const overlayStyle = style({
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  pointerEvents: 'none',
  backgroundRepeat: 'repeat',
  backgroundPosition: 'center',
});

// ── Size (font + gap kontrol) ───────────────────────

export const overlaySizeStyles = styleVariants({
  sm: {
    fontSize: 'var(--rel-text-xs, 12px)',
  },
  md: {
    fontSize: 'var(--rel-text-sm, 14px)',
  },
  lg: {
    fontSize: 'var(--rel-text-base, 16px)',
  },
});
