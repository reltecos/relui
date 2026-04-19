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
  alignItems: 'center',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  color: 'var(--rel-color-text, #374151)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 8,
  overflow: 'hidden',
});

export const canvasStyle = style({
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  display: 'block',
});

export const controlsStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 12px',
  backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
  borderTop: '1px solid var(--rel-color-border, #e5e7eb)',
  width: '100%',
  fontSize: 'var(--rel-text-sm, 13px)',
});

export const controlButtonStyle = style({
  padding: '4px 10px',
  borderRadius: 4,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  color: 'var(--rel-color-text, #374151)',
  cursor: 'pointer',
  fontSize: 'inherit',
  fontFamily: 'inherit',
  selectors: { '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' } },
});

export const progressStyle = style({
  flex: 1,
  height: 4,
  borderRadius: 2,
  backgroundColor: 'var(--rel-color-bg-muted, #e5e7eb)',
  overflow: 'hidden',
});

export const progressBarStyle = style({
  height: '100%',
  backgroundColor: 'var(--rel-color-primary, #3b82f6)',
  borderRadius: 2,
  transition: 'width 0.1s linear',
});
