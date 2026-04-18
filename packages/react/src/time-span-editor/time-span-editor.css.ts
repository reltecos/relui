/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

export const rootStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
});

export const fieldStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
});

export const labelStyle = style({
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-muted, #9ca3af)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

export const inputStyle = style({
  width: 48,
  textAlign: 'center',
  padding: '6px 4px',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 4,
  fontSize: 'var(--rel-text-base, 16px)',
  fontFamily: 'var(--rel-font-mono, ui-monospace, monospace)',
  fontWeight: 600,
  color: 'var(--rel-color-text, #374151)',
  backgroundColor: 'var(--rel-color-bg, #fff)',
  outline: 'none',
  selectors: {
    '&:focus': { borderColor: 'var(--rel-color-primary, #3b82f6)' },
  },
});

export const buttonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 4,
  backgroundColor: 'var(--rel-color-bg, #fff)',
  cursor: 'pointer',
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  padding: 0,
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' },
  },
});

export const separatorStyle = style({
  fontSize: 'var(--rel-text-lg, 18px)',
  fontWeight: 700,
  color: 'var(--rel-color-text-secondary, #6b7280)',
  padding: '0 2px',
  alignSelf: 'center',
});
