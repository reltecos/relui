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

export const familySelectStyle = style({
  width: '100%',
  padding: '8px 12px',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 6,
  fontSize: 'var(--rel-text-sm, 14px)',
  backgroundColor: 'var(--rel-color-bg, #fff)',
  color: 'var(--rel-color-text, #374151)',
});

export const sizeInputStyle = style({
  width: 64,
  padding: '8px 12px',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 6,
  fontSize: 'var(--rel-text-sm, 14px)',
  textAlign: 'center',
  backgroundColor: 'var(--rel-color-bg, #fff)',
  color: 'var(--rel-color-text, #374151)',
});

export const styleToggleStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 6,
  cursor: 'pointer',
  backgroundColor: 'var(--rel-color-bg, #fff)',
  color: 'var(--rel-color-text, #374151)',
  fontSize: 'var(--rel-text-sm, 14px)',
  fontWeight: 600,
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' },
  },
});

export const styleToggleActiveStyle = style({
  backgroundColor: 'var(--rel-color-primary, #3b82f6)',
  color: 'var(--rel-color-bg, #fff)',
  borderColor: 'var(--rel-color-primary, #3b82f6)',
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-primary-hover, #2563eb)' },
  },
});

export const weightSelectStyle = style({
  padding: '8px 12px',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 6,
  fontSize: 'var(--rel-text-sm, 14px)',
  backgroundColor: 'var(--rel-color-bg, #fff)',
  color: 'var(--rel-color-text, #374151)',
});

export const previewStyle = style({
  padding: '16px 20px',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 6,
  backgroundColor: 'var(--rel-color-bg-secondary, #f9fafb)',
  minHeight: 48,
});

export const labelStyle = style({
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-muted, #9ca3af)',
  fontWeight: 500,
  marginBottom: 4,
});

export const controlRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});
