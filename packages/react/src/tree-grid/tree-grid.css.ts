/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style, styleVariants } from '@vanilla-extract/css';

export const rootStyle = style({
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.5,
});

export const headerStyle = style({
  borderBottom: '2px solid var(--rel-color-border, #e5e7eb)',
});

export const headerCellStyle = style({
  padding: '8px 12px',
  fontWeight: 600,
  textAlign: 'left',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  selectors: {
    '&[data-sortable="true"]': { cursor: 'pointer' },
    '&[data-sortable="true"]:hover': { backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)' },
  },
});

export const headerCellAlignStyles = styleVariants({
  left: { textAlign: 'left' },
  center: { textAlign: 'center' },
  right: { textAlign: 'right' },
});

export const bodyStyle = style({});

export const rowStyle = style({
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  transition: 'background-color 0.1s ease',
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)' },
    '&[data-selected="true"]': { backgroundColor: 'var(--rel-color-primary-subtle, #eff6ff)' },
  },
});

export const cellStyle = style({
  padding: '6px 12px',
  verticalAlign: 'middle',
});

export const cellAlignStyles = styleVariants({
  left: { textAlign: 'left' },
  center: { textAlign: 'center' },
  right: { textAlign: 'right' },
});

export const expandButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 20,
  height: 20,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  padding: 0,
  marginRight: 4,
  borderRadius: 4,
  color: 'var(--rel-color-text-secondary, #6b7280)',
  transition: 'transform 0.15s ease',
  selectors: {
    '&[data-expanded="true"]': { transform: 'rotate(90deg)' },
    '&:hover': { backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)' },
  },
});

export const expandPlaceholderStyle = style({
  display: 'inline-block',
  width: 24,
});

export const sortIndicatorStyle = style({
  marginLeft: 4,
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-muted, #9ca3af)',
});
