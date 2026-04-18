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
  width: 320,
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: 'var(--rel-color-bg, #fff)',
});

export const searchStyle = style({
  padding: '8px 12px',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
});

export const searchInputStyle = style({
  width: '100%',
  padding: '6px 10px',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 6,
  fontSize: 'var(--rel-text-sm, 14px)',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  backgroundColor: 'var(--rel-color-bg, #fff)',
  color: 'var(--rel-color-text, #374151)',
  outline: 'none',
  selectors: {
    '&:focus': { borderColor: 'var(--rel-color-primary, #3b82f6)' },
  },
});

export const categoriesStyle = style({
  display: 'flex',
  gap: 2,
  padding: '4px 8px',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  overflowX: 'auto',
});

export const categoryButtonStyle = style({
  padding: '4px 6px',
  border: 'none',
  borderRadius: 4,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  fontSize: 'var(--rel-text-base, 16px)',
  lineHeight: 1,
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' },
  },
});

export const categoryActiveStyle = style({
  backgroundColor: 'var(--rel-color-primary-subtle, #eff6ff)',
});

export const gridStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 1fr)',
  gap: 2,
  padding: 8,
  maxHeight: 240,
  overflow: 'auto',
});

export const emojiStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: 'var(--rel-text-lg, 18px)',
  border: 'none',
  backgroundColor: 'transparent',
  padding: 0,
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' },
  },
});

export const skinToneStyle = style({
  display: 'flex',
  gap: 4,
  padding: '4px 8px',
  borderTop: '1px solid var(--rel-color-border, #e5e7eb)',
  justifyContent: 'center',
});

export const skinToneButtonStyle = style({
  width: 20,
  height: 20,
  borderRadius: '50%',
  border: '2px solid transparent',
  cursor: 'pointer',
  padding: 0,
});

export const skinToneActiveStyle = style({
  borderColor: 'var(--rel-color-primary, #3b82f6)',
});

export const recentStyle = style({
  padding: '4px 8px',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-muted, #9ca3af)',
});
