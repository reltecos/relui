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
  color: 'var(--rel-color-text, #374151)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 8,
  overflow: 'hidden',
});

export const toolbarStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  padding: '6px 8px',
  backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  flexWrap: 'wrap',
});

export const toolbarButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  borderRadius: 4,
  border: 'none',
  backgroundColor: 'transparent',
  color: 'var(--rel-color-text, #374151)',
  cursor: 'pointer',
  fontSize: 'var(--rel-text-sm, 14px)',
  fontWeight: 700,
  fontFamily: 'inherit',
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' },
    '&[data-active="true"]': {
      backgroundColor: 'var(--rel-color-primary-light, #dbeafe)',
      color: 'var(--rel-color-primary, #3b82f6)',
    },
  },
});

export const toolbarSeparatorStyle = style({
  width: 1,
  height: 20,
  backgroundColor: 'var(--rel-color-border, #e5e7eb)',
  margin: '0 4px',
});

export const contentStyle = style({
  flex: 1,
  padding: 16,
  minHeight: 200,
  outline: 'none',
  fontSize: 'var(--rel-text-md, 16px)',
  lineHeight: 1.6,
  color: 'var(--rel-color-text, #374151)',
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  cursor: 'text',
});
