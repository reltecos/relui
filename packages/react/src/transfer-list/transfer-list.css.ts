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
  alignItems: 'stretch',
  gap: 12,
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  color: 'var(--rel-color-text, #374151)',
  fontSize: 'var(--rel-text-sm, 14px)',
});

// ── List Panel (source & target) ────────────────────

export const listPanelStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 180,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 8,
  overflow: 'hidden',
});

// ── Search Input ────────────────────────────────────

export const searchInputStyle = style({
  padding: '8px 12px',
  border: 'none',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  outline: 'none',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  color: 'inherit',
  backgroundColor: 'var(--rel-color-bg, #fff)',
  selectors: {
    '&::placeholder': {
      color: 'var(--rel-color-text-muted, #9ca3af)',
    },
  },
});

// ── List Container ──────────────────────────────────

export const listContainerStyle = style({
  flex: 1,
  overflowY: 'auto',
  minHeight: 200,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

// ── Item ────────────────────────────────────────────

export const itemStyle = style({
  display: 'flex',
  alignItems: 'center',
  padding: '6px 12px',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'background-color 0.1s ease',
  selectors: {
    '&:hover': {
      backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
    },
    '&[aria-selected="true"]': {
      backgroundColor: 'var(--rel-color-primary-subtle, #eff6ff)',
    },
    '&[data-disabled="true"]': {
      opacity: 0.5,
      cursor: 'default',
    },
  },
});

// ── Actions Panel ───────────────────────────────────

export const actionsStyle = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: 8,
});

// ── Action Button ───────────────────────────────────

export const actionButtonStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 6,
  backgroundColor: 'var(--rel-color-bg, #fff)',
  cursor: 'pointer',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  transition: 'background-color 0.1s ease',
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
    },
    '&:disabled': {
      opacity: 0.4,
      cursor: 'default',
    },
  },
});
