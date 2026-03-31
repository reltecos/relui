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
  gap: 4,
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  color: 'var(--rel-color-text, #374151)',
});

export const svgStyle = style({
  display: 'block',
});

export const labelStyle = style({
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  textAlign: 'center',
});

export const valueStyle = style({
  fontSize: 'var(--rel-text-sm, 14px)',
  fontFamily: 'var(--rel-font-mono, ui-monospace, monospace)',
  letterSpacing: '0.15em',
  textAlign: 'center',
  color: 'var(--rel-color-text, #374151)',
});

export const errorStyle = style({
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-error, #dc2626)',
  textAlign: 'center',
  padding: '8px 16px',
});
