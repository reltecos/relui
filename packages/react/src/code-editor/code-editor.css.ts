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
  fontFamily: 'var(--rel-font-mono, "Courier New", monospace)',
  fontSize: 'var(--rel-text-sm, 13px)',
  lineHeight: 1.5,
  color: 'var(--rel-color-text, #374151)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 8,
  overflow: 'hidden',
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
});

export const toolbarStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 8px',
  backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  fontSize: 'var(--rel-text-xs, 12px)',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
});

export const toolbarButtonStyle = style({
  padding: '3px 8px',
  borderRadius: 4,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  color: 'var(--rel-color-text, #374151)',
  cursor: 'pointer',
  fontSize: 'inherit',
  fontFamily: 'inherit',
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' },
  },
});

export const editorContainerStyle = style({
  display: 'flex',
  flex: 1,
  position: 'relative',
  overflow: 'auto',
  minHeight: 200,
});

export const gutterStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  padding: '8px 0',
  backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
  borderRight: '1px solid var(--rel-color-border, #e5e7eb)',
  userSelect: 'none',
  flexShrink: 0,
  minWidth: 40,
});

export const lineNumberStyle = style({
  padding: '0 8px',
  color: 'var(--rel-color-text-secondary, #9ca3af)',
  textAlign: 'right',
  fontSize: 'inherit',
  lineHeight: 'inherit',
});

export const contentStyle = style({
  flex: 1,
  padding: 8,
  whiteSpace: 'pre',
  overflowX: 'auto',
});

export const lineStyle = style({
  minHeight: '1.5em',
});

export const activeLineStyle = style({
  backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)',
});

export const tokenKeywordStyle = style({
  color: 'var(--rel-color-primary, #3b82f6)',
  fontWeight: 600,
});

export const tokenStringStyle = style({
  color: 'var(--rel-color-success, #16a34a)',
});

export const tokenCommentStyle = style({
  color: 'var(--rel-color-text-secondary, #9ca3af)',
  fontStyle: 'italic',
});

export const tokenNumberStyle = style({
  color: 'var(--rel-color-warning, #f59e0b)',
});

export const tokenOperatorStyle = style({
  color: 'var(--rel-color-error, #dc2626)',
});

export const tokenPunctuationStyle = style({
  color: 'var(--rel-color-text-secondary, #6b7280)',
});

export const findPanelStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 8px',
  backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 13px)',
});

export const findInputStyle = style({
  padding: '4px 8px',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 4,
  fontSize: 'inherit',
  fontFamily: 'inherit',
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  color: 'var(--rel-color-text, #374151)',
  outline: 'none',
  selectors: {
    '&:focus': { borderColor: 'var(--rel-color-primary, #3b82f6)' },
  },
});

export const hiddenTextareaStyle = style({
  position: 'absolute',
  opacity: 0,
  width: 1,
  height: 1,
  overflow: 'hidden',
  pointerEvents: 'none',
});
