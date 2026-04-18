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

export const svgStyle = style({
  overflow: 'visible',
});

export const arcStyle = style({
  fill: 'none',
  strokeWidth: 8,
  strokeLinecap: 'round',
});

export const bgArcStyle = style({
  fill: 'none',
  strokeWidth: 8,
  strokeLinecap: 'round',
});

export const needleStyle = style({
  strokeWidth: 2,
  strokeLinecap: 'round',
});

export const valueStyle = style({
  fontSize: 'var(--rel-text-2xl, 24px)',
  fontWeight: 700,
  textAnchor: 'middle',
  fill: 'var(--rel-color-text, #111827)',
});

export const labelStyle = style({
  fontSize: 'var(--rel-text-sm, 14px)',
  fontWeight: 500,
  textAnchor: 'middle',
  fill: 'var(--rel-color-text-secondary, #6b7280)',
});
