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
});

export const sliceStyle = style({
  cursor: 'pointer',
  transition: 'opacity 150ms ease',
  ':hover': { opacity: 0.85 },
});

export const labelStyle = style({
  fontSize: 'var(--rel-text-xs, 11px)',
  fontWeight: 500,
  fill: 'var(--rel-color-text, #374151)',
  textAnchor: 'middle',
  pointerEvents: 'none',
});

export const legendStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
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

export const tooltipStyle = style({
  position: 'absolute',
  padding: '4px 8px',
  borderRadius: 4,
  fontSize: 'var(--rel-text-xs, 11px)',
  fontWeight: 500,
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  backgroundColor: 'var(--rel-color-text, #1f2937)',
  color: 'var(--rel-color-bg, #ffffff)',
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
  zIndex: 10,
});
