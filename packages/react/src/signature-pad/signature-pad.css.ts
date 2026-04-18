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
  gap: 8,
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
});

export const canvasStyle = style({
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 8,
  cursor: 'crosshair',
  touchAction: 'none',
});

export const controlsStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

export const controlButtonStyle = style({
  padding: '4px 12px',
  fontSize: 'var(--rel-text-xs, 12px)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 4,
  backgroundColor: 'var(--rel-color-bg, #fff)',
  color: 'var(--rel-color-text, #374151)',
  cursor: 'pointer',
  selectors: {
    '&:hover:not(:disabled)': { backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)' },
    '&:disabled': { opacity: 0.4, cursor: 'default' },
  },
});
