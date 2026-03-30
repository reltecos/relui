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
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.5,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 8,
  overflow: 'hidden',
  backgroundColor: 'var(--rel-color-bg, #fff)',
});

// ── Toolbar ─────────────────────────────────────────

export const toolbarStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 12px',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  backgroundColor: 'var(--rel-color-bg-secondary, #f9fafb)',
});

// ── Header ──────────────────────────────────────────

export const headerStyle = style({
  display: 'flex',
  flexDirection: 'column',
  borderBottom: '2px solid var(--rel-color-border, #e5e7eb)',
  backgroundColor: 'var(--rel-color-bg-secondary, #f9fafb)',
});

// ── Header Row ──────────────────────────────────────

export const headerRowStyle = style({
  display: 'flex',
  minWidth: 'fit-content',
});

// ── Header Cell ─────────────────────────────────────

export const headerCellStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  padding: '10px 12px',
  fontWeight: 600,
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  position: 'relative',
  userSelect: 'none',
  flexShrink: 0,
});

// ── Body ────────────────────────────────────────────

export const bodyStyle = style({
  flex: 1,
  overflow: 'auto',
  position: 'relative',
});

// ── Row ─────────────────────────────────────────────

export const rowStyle = style({
  display: 'flex',
  minWidth: 'fit-content',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  transition: 'background-color 0.1s ease',
  selectors: {
    '&:hover': {
      backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)',
    },
    '&:last-child': {
      borderBottom: 'none',
    },
  },
});

export const selectedRowStyle = style({
  backgroundColor: 'var(--rel-color-primary-subtle, #eff6ff)',
  selectors: {
    '&:hover': {
      backgroundColor: 'var(--rel-color-primary-subtle, #dbeafe)',
    },
  },
});

// ── Cell ────────────────────────────────────────────

export const cellStyle = style({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 12px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flexShrink: 0,
});

export const cellAlignStyles = styleVariants({
  left: { justifyContent: 'flex-start' },
  center: { justifyContent: 'center' },
  right: { justifyContent: 'flex-end' },
});

// ── Footer ──────────────────────────────────────────

export const footerStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 12px',
  borderTop: '1px solid var(--rel-color-border, #e5e7eb)',
  backgroundColor: 'var(--rel-color-bg-secondary, #f9fafb)',
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-secondary, #6b7280)',
});

// ── Pagination ──────────────────────────────────────

export const paginationStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

export const pageButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 32,
  height: 32,
  padding: '0 8px',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 4,
  backgroundColor: 'var(--rel-color-bg, #fff)',
  cursor: 'pointer',
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text, #374151)',
  selectors: {
    '&:hover': {
      backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
});

// ── Empty State ─────────────────────────────────────

export const emptyStateStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px 24px',
  color: 'var(--rel-color-text-secondary, #9ca3af)',
  fontSize: 'var(--rel-text-sm, 14px)',
});

// ── Checkbox ────────────────────────────────────────

export const checkboxStyle = style({
  width: 16,
  height: 16,
  flexShrink: 0,
  cursor: 'pointer',
  accentColor: 'var(--rel-color-primary, #3b82f6)',
});

// ── Resize Handle ───────────────────────────────────

export const resizeHandleStyle = style({
  position: 'absolute',
  right: 0,
  top: 0,
  bottom: 0,
  width: 4,
  cursor: 'col-resize',
  backgroundColor: 'transparent',
  selectors: {
    '&:hover': {
      backgroundColor: 'var(--rel-color-primary, #3b82f6)',
    },
  },
});

// ── Sort Icon ───────────────────────────────────────

export const sortIconStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-primary, #3b82f6)',
});

// ── Edit Cell ───────────────────────────────────────

export const editCellStyle = style({
  width: '100%',
  padding: '4px 8px',
  border: '1px solid var(--rel-color-primary, #3b82f6)',
  borderRadius: 4,
  fontSize: 'var(--rel-text-sm, 14px)',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  outline: 'none',
  backgroundColor: 'var(--rel-color-bg, #fff)',
  color: 'var(--rel-color-text, #374151)',
});

// ── Expand Button ───────────────────────────────────

export const expandButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 20,
  height: 20,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  fontSize: 'var(--rel-text-xs, 12px)',
  padding: 0,
  transition: 'transform 0.15s ease',
});

// ── Detail Row ──────────────────────────────────────

export const detailRowStyle = style({
  padding: '12px 24px',
  backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
});

// ── Filter Input ────────────────────────────────────

export const filterInputStyle = style({
  width: '100%',
  padding: '4px 8px',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 4,
  fontSize: 'var(--rel-text-xs, 12px)',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  outline: 'none',
  backgroundColor: 'var(--rel-color-bg, #fff)',
  color: 'var(--rel-color-text, #374151)',
  selectors: {
    '&:focus': {
      borderColor: 'var(--rel-color-primary, #3b82f6)',
    },
  },
});

// ── Column Chooser ──────────────────────────────────

export const columnChooserStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: 8,
  backgroundColor: 'var(--rel-color-bg, #fff)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 8,
  boxShadow: 'var(--rel-shadow-md, 0 4px 6px -1px rgba(0,0,0,0.1))',
  position: 'absolute',
  zIndex: 10,
  minWidth: 180,
});

export const columnChooserItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '4px 8px',
  fontSize: 'var(--rel-text-sm, 14px)',
  cursor: 'pointer',
  borderRadius: 4,
  selectors: {
    '&:hover': {
      backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)',
    },
  },
});
