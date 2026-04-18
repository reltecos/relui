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
  },
});

export const toolbarSeparatorStyle = style({
  width: 1,
  height: 20,
  backgroundColor: 'var(--rel-color-border, #e5e7eb)',
  margin: '0 4px',
});

export const splitContainerStyle = style({
  display: 'flex',
  flex: 1,
  minHeight: 200,
});

export const editorStyle = style({
  flex: 1,
  padding: 12,
  fontFamily: 'var(--rel-font-mono, "Courier New", monospace)',
  fontSize: 'var(--rel-text-sm, 14px)',
  lineHeight: 1.6,
  border: 'none',
  outline: 'none',
  resize: 'none',
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  color: 'var(--rel-color-text, #374151)',
  width: '100%',
  minHeight: 200,
});

export const previewStyle = style({
  flex: 1,
  padding: 12,
  fontSize: 'var(--rel-text-sm, 14px)',
  lineHeight: 1.6,
  color: 'var(--rel-color-text, #374151)',
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  borderLeft: '1px solid var(--rel-color-border, #e5e7eb)',
  overflow: 'auto',
  minHeight: 200,
});

export const modeButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 8px',
  borderRadius: 4,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  color: 'var(--rel-color-text, #374151)',
  cursor: 'pointer',
  fontSize: 'var(--rel-text-xs, 12px)',
  fontFamily: 'inherit',
  marginLeft: 'auto',
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' },
    '&[data-active="true"]': {
      backgroundColor: 'var(--rel-color-primary, #3b82f6)',
      color: 'var(--rel-color-text-inverse, #ffffff)',
      borderColor: 'var(--rel-color-primary, #3b82f6)',
    },
  },
});
