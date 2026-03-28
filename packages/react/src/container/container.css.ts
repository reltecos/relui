/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style, styleVariants } from '@vanilla-extract/css';

// ── Root ────────────────────────────────────────────

/** Container root base stili. */
export const rootStyle = style({
  boxSizing: 'border-box',
  width: '100%',
  marginLeft: 'auto',
  marginRight: 'auto',
  color: 'var(--rel-color-text, #374151)',
});

// ── Size ────────────────────────────────────────────

export const sizeStyles = styleVariants({
  sm: { maxWidth: '640px' },
  md: { maxWidth: '768px' },
  lg: { maxWidth: '1024px' },
  xl: { maxWidth: '1280px' },
  '2xl': { maxWidth: '1536px' },
  full: { maxWidth: '100%' },
});
