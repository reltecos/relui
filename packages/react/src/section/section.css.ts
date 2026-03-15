/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

// ── Header ──────────────────────────────────────────

/** Section.Header base stili. */
export const headerStyle = style({
  margin: 0,
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontWeight: 600,
  fontSize: 'var(--rel-text-lg, 18px)',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.4,
});

// ── Content ─────────────────────────────────────────

/** Section.Content base stili. */
export const contentStyle = style({
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  lineHeight: 1.6,
});
