/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

export const rootStyle = style({
  display: 'inline-block',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
});

export const gridLineStyle = style({
  strokeWidth: 1,
  strokeDasharray: '3 3',
});

export const axisLineStyle = style({
  strokeWidth: 1,
});

export const axisLabelStyle = style({
  fontSize: 'var(--rel-text-xs, 11px)',
  fill: 'var(--rel-color-text-secondary, #9ca3af)',
});

export const seriesLineStyle = style({
  fill: 'none',
  strokeWidth: 2,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
});

export const dotStyle = style({
  strokeWidth: 0,
});

export const legendStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 16,
  justifyContent: 'center',
  marginTop: 8,
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text, #374151)',
});

export const legendItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
});

export const legendDotStyle = style({
  width: 8,
  height: 8,
  borderRadius: '50%',
  flexShrink: 0,
});
