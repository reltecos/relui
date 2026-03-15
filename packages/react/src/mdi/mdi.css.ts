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
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  background: 'var(--rel-color-bg-muted, #f1f5f9)',
});

// ── Window ──────────────────────────────────────────

export const windowStyle = style({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 6,
  overflow: 'hidden',
  background: 'var(--rel-color-bg, #fff)',
});

export const windowMaximizedStyle = style({
  borderRadius: 0,
});

// ── Title Bar ───────────────────────────────────────

export const titleBarStyle = style({
  display: 'flex',
  alignItems: 'center',
  padding: '6px 10px',
  borderBottom: '1px solid var(--rel-color-border, #e2e8f0)',
  cursor: 'grab',
  userSelect: 'none',
  flexShrink: 0,
});

export const titleBarActiveStyle = style({
  background: 'var(--rel-color-primary, #3b82f6)',
});

export const titleBarInactiveStyle = style({
  background: 'var(--rel-color-bg-subtle, #f8fafc)',
});

// ── Title ───────────────────────────────────────────

export const titleStyle = style({
  flex: 1,
  fontSize: 12,
  fontWeight: 600,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

// ── Controls ────────────────────────────────────────

export const controlsStyle = style({
  display: 'flex',
  gap: 2,
  marginLeft: 6,
});

// ── Control Button ──────────────────────────────────

export const controlButtonStyle = style({
  width: 20,
  height: 20,
  border: 'none',
  borderRadius: 3,
  background: 'transparent',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 12,
  lineHeight: 1,
  color: 'var(--rel-color-text-muted, #64748b)',
  padding: 0,
});

// ── Content ─────────────────────────────────────────

export const contentStyle = style({
  flex: 1,
  overflow: 'auto',
});

// ── Taskbar ─────────────────────────────────────────

export const taskbarStyle = style({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 36,
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  padding: '0 4px',
  background: 'var(--rel-color-bg-subtle, #f8fafc)',
  borderTop: '1px solid var(--rel-color-border, #e2e8f0)',
  zIndex: 1000,
});

// ── Taskbar Item ────────────────────────────────────

export const taskbarItemStyle = style({
  padding: '4px 10px',
  fontSize: 11,
  cursor: 'pointer',
  border: '1px solid var(--rel-color-border, #e2e8f0)',
  borderRadius: 3,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 150,
});
