/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

// ── Root ────────────────────────────────────────────

export const rootStyle = style({
  display: 'inline-block',
  verticalAlign: 'middle',
  lineHeight: 0,
});

// ── SVG ─────────────────────────────────────────────

export const svgStyle = style({
  overflow: 'visible',
});

// ── Line ────────────────────────────────────────────

export const lineStyle = style({
  fill: 'none',
  strokeWidth: 1.5,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
});

// ── Area ────────────────────────────────────────────

export const areaStyle = style({
  opacity: 0.15,
  strokeWidth: 0,
});

// ── Bar ─────────────────────────────────────────────

export const barStyle = style({
  opacity: 0.85,
});

// ── Point / Dot ─────────────────────────────────────

export const pointStyle = style({
  strokeWidth: 0,
});

// ── Tooltip ─────────────────────────────────────────

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
  boxShadow: 'var(--rel-shadow-sm, 0 1px 2px rgba(0,0,0,0.1))',
});
