/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

export const rootStyle = style({
  position: 'relative',
  display: 'inline-block',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
});

export const inputStyle = style({
  width: '100%',
  padding: '8px 12px',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 6,
  fontSize: 'var(--rel-text-sm, 14px)',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  color: 'var(--rel-color-text, #374151)',
  backgroundColor: 'var(--rel-color-bg, #fff)',
  outline: 'none',
  selectors: {
    '&:focus': { borderColor: 'var(--rel-color-primary, #3b82f6)' },
  },
});

export const listStyle = style({
  position: 'absolute',
  left: 0,
  right: 0,
  zIndex: 50,
  maxHeight: 200,
  overflow: 'auto',
  backgroundColor: 'var(--rel-color-bg, #fff)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 8,
  boxShadow: 'var(--rel-shadow-md, 0 4px 6px -1px rgba(0,0,0,0.1))',
  marginTop: 4,
  padding: 4,
});

export const itemStyle = style({
  padding: '8px 12px',
  cursor: 'pointer',
  borderRadius: 4,
  fontSize: 'var(--rel-text-sm, 14px)',
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' },
  },
});

export const highlightedStyle = style({
  backgroundColor: 'var(--rel-color-primary-subtle, #eff6ff)',
});
