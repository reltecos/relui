/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

// ── Root ────────────────────────────────────────────

export const rootStyle = style({
  position: 'relative',
  overflow: 'hidden',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  color: 'var(--rel-color-text, #374151)',
});

// ── Viewport (scrollable) ───────────────────────────

export const viewportStyle = style({
  position: 'relative',
  overflowY: 'auto',
  overflowX: 'hidden',
  width: '100%',
  height: '100%',
});

// ── Inner (total height spacer) ─────────────────────

export const innerStyle = style({
  position: 'relative',
  width: '100%',
});

// ── Item ────────────────────────────────────────────

export const itemStyle = style({
  position: 'absolute',
  left: 0,
  width: '100%',
  boxSizing: 'border-box',
});
