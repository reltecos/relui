/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style, styleVariants } from '@vanilla-extract/css';

// ── Root ────────────────────────────────────────────

export const rootBaseStyle = style({
  display: 'flex',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  color: 'var(--rel-color-text, #374151)',
});

export const directionStyles = styleVariants({
  row: { flexDirection: 'row', gap: 0 },
  column: { flexDirection: 'column', gap: 0 },
});

// ── Stat wrapper ────────────────────────────────────

export const statBaseStyle = style({
  flex: '1 1 0',
  minWidth: 0,
});

export const statRowDividerStyle = style({
  borderRight: '1px solid var(--rel-color-border, #e5e7eb)',
  paddingLeft: 24,
  paddingRight: 24,
  selectors: {
    '&:first-child': { paddingLeft: 0 },
    '&:last-child': { borderRight: 'none', paddingRight: 0 },
  },
});

export const statColumnDividerStyle = style({
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  paddingTop: 16,
  paddingBottom: 16,
  selectors: {
    '&:first-child': { paddingTop: 0 },
    '&:last-child': { borderBottom: 'none', paddingBottom: 0 },
  },
});

export const statRowNoDividerStyle = style({
  paddingLeft: 24,
  paddingRight: 24,
  selectors: {
    '&:first-child': { paddingLeft: 0 },
    '&:last-child': { paddingRight: 0 },
  },
});

export const statColumnNoDividerStyle = style({
  paddingTop: 16,
  paddingBottom: 16,
  selectors: {
    '&:first-child': { paddingTop: 0 },
    '&:last-child': { paddingBottom: 0 },
  },
});
