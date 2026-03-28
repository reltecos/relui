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
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: 'var(--rel-shadow-lg, 0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1))',
  borderRadius: 8,
  overflow: 'hidden',
  background: 'var(--rel-color-bg, #fff)',
});

export const rootMaximizedStyle = style({
  borderRadius: 0,
});

// ── Title Bar ───────────────────────────────────────

export const titleBarStyle = style({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 12px',
  background: 'var(--rel-color-bg-subtle, #f8fafc)',
  borderBottom: '1px solid var(--rel-color-border, #e2e8f0)',
  userSelect: 'none',
  flexShrink: 0,
});

// ── Title ───────────────────────────────────────────

export const titleStyle = style({
  flex: 1,
  fontSize: 13,
  fontWeight: 600,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

// ── Controls ────────────────────────────────────────

export const controlsStyle = style({
  display: 'flex',
  gap: 4,
  marginLeft: 8,
});

// ── Control Button ──────────────────────────────────

export const controlButtonStyle = style({
  width: 24,
  height: 24,
  border: 'none',
  borderRadius: 4,
  background: 'transparent',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 14,
  lineHeight: 1,
  color: 'var(--rel-color-text-muted, #64748b)',
  padding: 0,
});

// ── Content ─────────────────────────────────────────

export const contentStyle = style({
  flex: 1,
  overflow: 'auto',
});
