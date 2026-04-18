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
  gap: 12,
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  padding: 16,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 8,
  backgroundColor: 'var(--rel-color-bg, #fff)',
});

export const groupStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 12,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 6,
  backgroundColor: 'var(--rel-color-bg-secondary, #f9fafb)',
});

export const groupHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 4,
});

export const combinatorStyle = style({
  padding: '4px 12px',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 4,
  backgroundColor: 'var(--rel-color-bg, #fff)',
  fontSize: 'var(--rel-text-xs, 12px)',
  fontWeight: 600,
  cursor: 'pointer',
  color: 'var(--rel-color-primary, #3b82f6)',
  textTransform: 'uppercase',
});

export const ruleStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 0',
});

export const fieldStyle = style({
  padding: '6px 10px',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 4,
  fontSize: 'var(--rel-text-sm, 14px)',
  backgroundColor: 'var(--rel-color-bg, #fff)',
  color: 'var(--rel-color-text, #374151)',
  minWidth: 120,
});

export const operatorStyle = style({
  padding: '6px 10px',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 4,
  fontSize: 'var(--rel-text-sm, 14px)',
  backgroundColor: 'var(--rel-color-bg, #fff)',
  color: 'var(--rel-color-text, #374151)',
  minWidth: 100,
});

export const valueStyle = style({
  padding: '6px 10px',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 4,
  fontSize: 'var(--rel-text-sm, 14px)',
  backgroundColor: 'var(--rel-color-bg, #fff)',
  color: 'var(--rel-color-text, #374151)',
  flex: 1,
  minWidth: 120,
});

export const addButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '6px 12px',
  border: '1px dashed var(--rel-color-border, #e5e7eb)',
  borderRadius: 4,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' },
  },
});

export const removeButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  border: 'none',
  borderRadius: 4,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  color: 'var(--rel-color-error, #dc2626)',
  fontSize: 'var(--rel-text-sm, 14px)',
  padding: 0,
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-error-subtle, #fee2e2)' },
  },
});
