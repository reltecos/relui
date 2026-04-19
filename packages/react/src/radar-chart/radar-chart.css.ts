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

export const gridStyle = style({
  fill: 'none',
  stroke: 'var(--rel-color-border, #e5e7eb)',
  strokeWidth: 1,
});

export const axisStyle = style({
  stroke: 'var(--rel-color-border, #d1d5db)',
  strokeWidth: 1,
});

export const axisLabelStyle = style({
  fontSize: 'var(--rel-text-xs, 11px)',
  fill: 'var(--rel-color-text-secondary, #6b7280)',
  textAnchor: 'middle',
  dominantBaseline: 'central',
});

export const seriesStyle = style({
  fillOpacity: 0.15,
  strokeWidth: 2,
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
  borderRadius: '50%',
  flexShrink: 0,
});
