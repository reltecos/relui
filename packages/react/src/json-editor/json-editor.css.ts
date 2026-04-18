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
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  color: 'var(--rel-color-text, #374151)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 8,
  overflow: 'hidden',
});

// ── Toolbar ─────────────────────────────────────────

export const toolbarStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  padding: '6px 8px',
  backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  fontSize: 'var(--rel-text-sm, 13px)',
});

export const toolbarButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 8px',
  borderRadius: 4,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  color: 'var(--rel-color-text, #374151)',
  cursor: 'pointer',
  fontSize: 'var(--rel-text-xs, 12px)',
  fontFamily: 'inherit',
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' },
    '&[data-active="true"]': {
      backgroundColor: 'var(--rel-color-primary, #3b82f6)',
      color: 'var(--rel-color-text-inverse, #ffffff)',
      borderColor: 'var(--rel-color-primary, #3b82f6)',
    },
  },
});

// ── Tree ────────────────────────────────────────────

export const treeStyle = style({
  flex: 1,
  overflow: 'auto',
  padding: 8,
  fontFamily: 'var(--rel-font-mono, "Courier New", monospace)',
  fontSize: 'var(--rel-text-sm, 13px)',
  lineHeight: 1.6,
});

// ── Text Area ───────────────────────────────────────

export const textAreaStyle = style({
  flex: 1,
  padding: 12,
  fontFamily: 'var(--rel-font-mono, "Courier New", monospace)',
  fontSize: 'var(--rel-text-sm, 13px)',
  lineHeight: 1.6,
  border: 'none',
  outline: 'none',
  resize: 'none',
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  color: 'var(--rel-color-text, #374151)',
  minHeight: 200,
  width: '100%',
});

// ── Node ────────────────────────────────────────────

export const nodeStyle = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 4,
  paddingTop: 2,
  paddingBottom: 2,
  cursor: 'pointer',
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' },
    '&[data-selected="true"]': { backgroundColor: 'var(--rel-color-bg-subtle, #eff6ff)' },
  },
});

export const nodeExpandStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 20,
  flexShrink: 0,
  cursor: 'pointer',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  userSelect: 'none',
  fontSize: 10,
});

export const nodeKeyStyle = style({
  color: 'var(--rel-color-primary, #3b82f6)',
  fontWeight: 500,
  flexShrink: 0,
});

export const nodeValueStyle = style({
  color: 'var(--rel-color-text, #374151)',
});

export const nodeTypeStyle = style({
  fontSize: 'var(--rel-text-xs, 11px)',
  color: 'var(--rel-color-text-secondary, #9ca3af)',
  marginLeft: 4,
  fontStyle: 'italic',
});

export const nodeActionsStyle = style({
  display: 'inline-flex',
  gap: 2,
  marginLeft: 'auto',
  opacity: 0,
  selectors: {
    [`${nodeStyle}:hover &`]: { opacity: 1 },
  },
});

export const nodeActionButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 18,
  height: 18,
  borderRadius: 3,
  border: 'none',
  backgroundColor: 'transparent',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  cursor: 'pointer',
  fontSize: 11,
  padding: 0,
  selectors: {
    '&:hover': {
      backgroundColor: 'var(--rel-color-bg-hover, #e5e7eb)',
      color: 'var(--rel-color-text, #374151)',
    },
  },
});

// ── Validation ──────────────────────────────────────

export const validationStyle = style({
  padding: '4px 8px',
  fontSize: 'var(--rel-text-xs, 12px)',
  borderTop: '1px solid var(--rel-color-border, #e5e7eb)',
});

export const validationValidStyle = style({
  color: 'var(--rel-color-success, #16a34a)',
});

export const validationInvalidStyle = style({
  color: 'var(--rel-color-error, #dc2626)',
});
