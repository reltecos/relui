/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Sticky styles — Vanilla Extract.
 * Sticky stilleri — Vanilla Extract tabanli.
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';

/** Root stil — sticky pozisyon. */
export const stickyRootStyle = style({
  position: 'sticky',
  zIndex: 100,
  color: 'var(--rel-color-text, #374151)',
});

/** Sentinel stil — gorunmez takip elemani. */
export const stickySentinelStyle = style({
  height: 0,
  width: '100%',
  visibility: 'hidden',
  pointerEvents: 'none',
});
