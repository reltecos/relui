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
  fontFamily: 'var(--rel-font-mono, ui-monospace, monospace)',
  fontSize: 'var(--rel-text-sm, 14px)',
  lineHeight: 1.5,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 8,
  overflow: 'auto',
  backgroundColor: 'var(--rel-color-bg, #fff)',
  color: 'var(--rel-color-text, #374151)',
});

export const splitRootStyle = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
});

export const sideStyle = style({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
});

export const lineStyle = style({
  display: 'flex',
  minHeight: '1.5em',
  whiteSpace: 'pre',
});

export const addedLineStyle = style({
  backgroundColor: 'var(--rel-color-diff-added-bg, #dcfce7)',
});

export const removedLineStyle = style({
  backgroundColor: 'var(--rel-color-diff-removed-bg, #fee2e2)',
});

export const gutterStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 48,
  padding: '0 8px',
  color: 'var(--rel-color-text-muted, #9ca3af)',
  fontSize: 'var(--rel-text-xs, 12px)',
  userSelect: 'none',
  flexShrink: 0,
  borderRight: '1px solid var(--rel-color-border, #e5e7eb)',
});

export const contentStyle = style({
  flex: 1,
  padding: '0 12px',
  overflow: 'hidden',
});

export const addedGutterStyle = style({
  backgroundColor: 'var(--rel-color-diff-added-gutter, #bbf7d0)',
});

export const removedGutterStyle = style({
  backgroundColor: 'var(--rel-color-diff-removed-gutter, #fecaca)',
});

export const prefixStyle = style({
  display: 'inline-block',
  width: 16,
  textAlign: 'center',
  fontWeight: 600,
  flexShrink: 0,
  userSelect: 'none',
});

export const addedPrefixStyle = style({
  color: 'var(--rel-color-success, #16a34a)',
});

export const removedPrefixStyle = style({
  color: 'var(--rel-color-error, #dc2626)',
});
