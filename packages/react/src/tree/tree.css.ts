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
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.5,
  fontSize: 'var(--rel-text-sm, 14px)',
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

// ── Size ────────────────────────────────────────────

export const sizeStyles = styleVariants({
  sm: { fontSize: 'var(--rel-text-xs, 12px)' },
  md: { fontSize: 'var(--rel-text-sm, 14px)' },
  lg: { fontSize: 'var(--rel-text-base, 16px)' },
});

// ── Node ────────────────────────────────────────────

export const nodeStyle = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

// ── Node Content (clickable row) ────────────────────

export const nodeContentStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 8px',
  borderRadius: 4,
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'background-color 0.1s ease',
  selectors: {
    '&:hover': {
      backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
    },
    '&[data-selected="true"]': {
      backgroundColor: 'var(--rel-color-primary-subtle, #eff6ff)',
    },
    '&[data-disabled="true"]': {
      opacity: 0.5,
      cursor: 'default',
    },
  },
});

// ── Icon (expand/collapse chevron) ──────────────────

export const iconStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
  flexShrink: 0,
  transition: 'transform 0.15s ease',
  selectors: {
    '&[data-expanded="true"]': {
      transform: 'rotate(90deg)',
    },
  },
});

// ── Icon placeholder (leaf node — no chevron) ───────

export const iconPlaceholderStyle = style({
  width: 16,
  height: 16,
  flexShrink: 0,
});

// ── Label ───────────────────────────────────────────

export const labelStyle = style({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

// ── Children container (indent) ─────────────────────

export const childrenStyle = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  paddingLeft: 20,
});
