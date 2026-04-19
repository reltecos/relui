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
  gap: 12,
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
});

export const candleStyle = style({
  cursor: 'pointer',
  transition: 'opacity 0.15s ease',
  selectors: { '&:hover': { opacity: 0.85 } },
});

export const volumeStyle = style({
  opacity: 0.4,
});

export const axisStyle = style({
  stroke: 'var(--rel-color-border, #e5e7eb)',
  strokeWidth: 1,
  fontSize: 'var(--rel-text-xs, 10px)',
  fill: 'var(--rel-color-text-secondary, #6b7280)',
});

export const legendStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
  justifyContent: 'center',
});

export const legendItemStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-secondary, #6b7280)',
});

export const legendDotStyle = style({
  width: 8,
  height: 8,
  borderRadius: 2,
  flexShrink: 0,
});
