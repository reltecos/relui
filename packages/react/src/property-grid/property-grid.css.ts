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
    '&::placeholder': { color: 'var(--rel-color-text-muted, #9ca3af)' },
  },
});

export const categoryStyle = style({
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
});

export const categoryHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 12px',
  fontWeight: 600,
  fontSize: 'var(--rel-text-xs, 12px)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
  cursor: 'pointer',
  userSelect: 'none',
  color: 'var(--rel-color-text-secondary, #6b7280)',
});

export const propertyStyle = style({
  display: 'flex',
  alignItems: 'center',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  selectors: {
    '&:last-child': { borderBottom: 'none' },
  },
});

export const labelStyle = style({
  flex: '0 0 45%',
  padding: '4px 12px',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  borderRight: '1px solid var(--rel-color-border, #e5e7eb)',
});

export const editorStyle = style({
  flex: 1,
  padding: '2px 8px',
  minHeight: 28,
  display: 'flex',
  alignItems: 'center',
});

export const editorInputStyle = style({
  width: '100%',
  border: 'none',
  outline: 'none',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  color: 'inherit',
  backgroundColor: 'transparent',
  padding: '2px 4px',
});

export const editorCheckboxStyle = style({
  cursor: 'pointer',
});

export const editorSelectStyle = style({
  width: '100%',
  border: 'none',
  outline: 'none',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  color: 'inherit',
  backgroundColor: 'transparent',
  padding: '2px 4px',
  cursor: 'pointer',
});

export const chevronStyle = style({
  display: 'inline-flex',
  transition: 'transform 0.15s ease',
  selectors: {
    '&[data-collapsed="true"]': { transform: 'rotate(-90deg)' },
  },
});
