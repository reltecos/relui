/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

export const rootStyle = style({
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 8,
  overflow: 'hidden',
});

export const toolbarStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '4px 8px',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
});

export const formulaBarStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '4px 8px',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  backgroundColor: 'var(--rel-color-bg, #fff)',
});

export const cellAddressStyle = style({
  width: 60,
  padding: '2px 6px',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 4,
  fontFamily: 'var(--rel-font-mono, monospace)',
  fontSize: 'var(--rel-text-xs, 12px)',
  textAlign: 'center',
  backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
  color: 'var(--rel-color-text, #374151)',
});

export const formulaInputStyle = style({
  flex: 1,
  padding: '2px 6px',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 4,
  outline: 'none',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  color: 'inherit',
  backgroundColor: 'var(--rel-color-bg, #fff)',
});

export const gridContainerStyle = style({
  flex: 1,
  overflow: 'auto',
  position: 'relative',
});

export const gridTableStyle = style({
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
});

export const headerCellStyle = style({
  padding: '2px 8px',
  fontWeight: 600,
  fontSize: 'var(--rel-text-xs, 12px)',
  textAlign: 'center',
  backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  userSelect: 'none',
  minWidth: 80,
  color: 'var(--rel-color-text-secondary, #6b7280)',
});

export const rowHeaderCellStyle = style({
  padding: '2px 8px',
  fontWeight: 500,
  fontSize: 'var(--rel-text-xs, 12px)',
  textAlign: 'center',
  backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  userSelect: 'none',
  minWidth: 40,
  color: 'var(--rel-color-text-secondary, #6b7280)',
});

export const cellStyle = style({
  padding: '2px 6px',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  minWidth: 80,
  height: 24,
  cursor: 'cell',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  selectors: {
    '&[data-selected="true"]': {
      outline: '2px solid var(--rel-color-primary, #3b82f6)',
      outlineOffset: -2,
    },
    '&[data-editing="true"]': {
      padding: 0,
    },
  },
});

export const cellEditInputStyle = style({
  width: '100%',
  height: '100%',
  border: 'none',
  outline: 'none',
  padding: '2px 6px',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  color: 'inherit',
  backgroundColor: 'var(--rel-color-bg, #fff)',
});

export const sheetTabsStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 0,
  borderTop: '1px solid var(--rel-color-border, #e5e7eb)',
  backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
  overflow: 'auto',
});

export const sheetTabStyle = style({
  padding: '4px 16px',
  cursor: 'pointer',
  fontSize: 'var(--rel-text-xs, 12px)',
  borderRight: '1px solid var(--rel-color-border, #e5e7eb)',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  selectors: {
    '&[data-active="true"]': {
      backgroundColor: 'var(--rel-color-bg, #fff)',
      fontWeight: 600,
      color: 'var(--rel-color-text, #374151)',
    },
  },
});

export const addSheetButtonStyle = style({
  padding: '4px 12px',
  cursor: 'pointer',
  fontSize: 'var(--rel-text-xs, 12px)',
  border: 'none',
  backgroundColor: 'transparent',
  color: 'var(--rel-color-text-muted, #9ca3af)',
  selectors: {
    '&:hover': { color: 'var(--rel-color-text, #374151)' },
  },
});

export const toolbarButtonStyle = style({
  padding: '2px 8px',
  cursor: 'pointer',
  fontSize: 'var(--rel-text-xs, 12px)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 4,
  backgroundColor: 'var(--rel-color-bg, #fff)',
  color: 'var(--rel-color-text, #374151)',
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)' },
    '&:disabled': { opacity: 0.4, cursor: 'default' },
  },
});
