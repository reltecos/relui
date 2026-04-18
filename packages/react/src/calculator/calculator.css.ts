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
  flexDirection: 'column',
  width: 280,
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: 'var(--rel-color-bg, #fff)',
});

// ── Display ─────────────────────────────────────────

export const displayStyle = style({
  padding: '16px 20px',
  textAlign: 'right',
  backgroundColor: 'var(--rel-color-bg-secondary, #f9fafb)',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  minHeight: 64,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
});

export const expressionStyle = style({
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-muted, #9ca3af)',
  minHeight: 18,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const displayValueStyle = style({
  fontSize: 'var(--rel-text-2xl, 24px)',
  fontWeight: 700,
  fontFamily: 'var(--rel-font-mono, ui-monospace, monospace)',
  color: 'var(--rel-color-text, #111827)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

// ── Keypad ──────────────────────────────────────────

export const keypadStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 1,
  padding: 4,
  backgroundColor: 'var(--rel-color-bg, #fff)',
});

// ── Key ─────────────────────────────────────────────

export const keyStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 48,
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 'var(--rel-text-base, 16px)',
  fontWeight: 500,
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  backgroundColor: 'var(--rel-color-bg-secondary, #f9fafb)',
  color: 'var(--rel-color-text, #374151)',
  transition: 'background-color 0.1s ease',
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #e5e7eb)' },
    '&:active': { backgroundColor: 'var(--rel-color-bg-active, #d1d5db)' },
  },
});

export const operatorKeyStyle = style({
  backgroundColor: 'var(--rel-color-primary-subtle, #eff6ff)',
  color: 'var(--rel-color-primary, #3b82f6)',
  fontWeight: 600,
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-primary-subtle-hover, #dbeafe)' },
  },
});

export const equalsKeyStyle = style({
  backgroundColor: 'var(--rel-color-primary, #3b82f6)',
  color: 'var(--rel-color-bg, #fff)',
  fontWeight: 700,
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-primary-hover, #2563eb)' },
  },
});

export const memoryKeyStyle = style({
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  backgroundColor: 'var(--rel-color-bg, #fff)',
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' },
  },
});

// ── History ─────────────────────────────────────────

export const historyStyle = style({
  maxHeight: 120,
  overflow: 'auto',
  padding: '8px 12px',
  borderTop: '1px solid var(--rel-color-border, #e5e7eb)',
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-muted, #9ca3af)',
  backgroundColor: 'var(--rel-color-bg-secondary, #f9fafb)',
});

export const historyItemStyle = style({
  padding: '2px 0',
  fontFamily: 'var(--rel-font-mono, ui-monospace, monospace)',
});
