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
  flexDirection: 'column',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  color: 'var(--rel-color-text, #374151)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 8,
  overflow: 'hidden',
});

export const videoStyle = style({
  backgroundColor: 'var(--rel-color-bg-inverse, #111827)',
  display: 'block',
  width: '100%',
});

export const controlsStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 12px',
  backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
  borderTop: '1px solid var(--rel-color-border, #e5e7eb)',
  fontSize: 'var(--rel-text-sm, 13px)',
});

export const controlButtonStyle = style({
  padding: '6px 12px',
  borderRadius: 6,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  color: 'var(--rel-color-text, #374151)',
  cursor: 'pointer',
  fontSize: 'inherit',
  fontFamily: 'inherit',
  selectors: { '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' } },
});

export const previewStyle = style({
  maxWidth: 160,
  borderRadius: 4,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
});

export const statusStyle = style({
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  marginLeft: 'auto',
});
