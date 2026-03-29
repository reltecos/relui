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
  display: 'inline',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.5,
  fontVariantNumeric: 'tabular-nums',
});

// ── Value ───────────────────────────────────────────

export const valueStyle = style({
  fontVariantNumeric: 'tabular-nums',
});

// ── Prefix ──────────────────────────────────────────

export const prefixStyle = style({
  color: 'var(--rel-color-text-secondary, #6b7280)',
});

// ── Suffix ──────────────────────────────────────────

export const suffixStyle = style({
  color: 'var(--rel-color-text-secondary, #6b7280)',
});
