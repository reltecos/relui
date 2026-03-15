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
  display: 'flex',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
});

// ── Panel ───────────────────────────────────────────

export const panelStyle = style({
  overflow: 'auto',
  flexShrink: 0,
});

// ── Gutter ──────────────────────────────────────────

export const gutterStyle = style({
  flexShrink: 0,
  background: 'var(--rel-color-border, #e2e8f0)',
  userSelect: 'none',
  touchAction: 'none',
});
