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
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  background: 'var(--rel-color-bg-muted, #f1f5f9)',
});

// ── Split Container ─────────────────────────────────

export const splitContainerStyle = style({
  display: 'flex',
  width: '100%',
  height: '100%',
});

// ── Resize Handle ───────────────────────────────────

export const resizeHandleStyle = style({
  flexShrink: 0,
  background: 'var(--rel-color-border, #e2e8f0)',
  userSelect: 'none',
  touchAction: 'none',
  transition: 'background 150ms',
  ':hover': {
    background: 'var(--rel-color-primary, #3b82f6)',
  },
});

// ── Group ───────────────────────────────────────────

export const groupStyle = style({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: 'var(--rel-color-bg, #fff)',
});

// ── Tab Bar ─────────────────────────────────────────

export const tabBarStyle = style({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  background: 'var(--rel-color-bg-subtle, #f8fafc)',
  borderBottom: '1px solid var(--rel-color-border, #e2e8f0)',
  userSelect: 'none',
  minHeight: 32,
});

// ── Tab ─────────────────────────────────────────────

export const tabStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 10px',
  fontSize: 12,
  cursor: 'pointer',
  border: 'none',
  background: 'transparent',
  color: 'var(--rel-color-text-muted, #64748b)',
  whiteSpace: 'nowrap',
});

export const tabActiveStyle = style({
  background: 'var(--rel-color-bg, #fff)',
  color: 'var(--rel-color-text, #1e293b)',
  fontWeight: 600,
  borderBottom: '2px solid var(--rel-color-primary, #3b82f6)',
});

// ── Tab Close Button ────────────────────────────────

export const tabCloseButtonStyle = style({
  width: 16,
  height: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: 10,
  color: 'var(--rel-color-text-muted, #94a3b8)',
  padding: 0,
  borderRadius: 2,
  ':hover': {
    background: 'var(--rel-color-bg-muted, #f1f5f9)',
    color: 'var(--rel-color-error, #dc2626)',
  },
});

// ── Panel Content ───────────────────────────────────

export const panelContentStyle = style({
  flex: 1,
  overflow: 'auto',
});

// ── Auto-hide Bar ───────────────────────────────────

export const autoHideBarStyle = style({
  position: 'absolute',
  display: 'flex',
  gap: 2,
  background: 'var(--rel-color-bg-subtle, #f8fafc)',
  zIndex: 500,
});

// ── Auto-hide Tab ───────────────────────────────────

export const autoHideTabStyle = style({
  padding: '4px 10px',
  fontSize: 11,
  cursor: 'pointer',
  border: 'none',
  background: 'transparent',
  color: 'var(--rel-color-text-muted, #64748b)',
  whiteSpace: 'nowrap',
});

// ── Floating Panel ──────────────────────────────────

export const floatingPanelStyle = style({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 8,
  overflow: 'hidden',
  boxShadow: 'var(--rel-shadow-lg, 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1))',
  background: 'var(--rel-color-bg, #fff)',
});

// ── Floating Title Bar ──────────────────────────────

export const floatingTitleBarStyle = style({
  display: 'flex',
  alignItems: 'center',
  padding: '6px 10px',
  background: 'var(--rel-color-bg-subtle, #f8fafc)',
  borderBottom: '1px solid var(--rel-color-border, #e2e8f0)',
  cursor: 'grab',
  userSelect: 'none',
  flexShrink: 0,
  fontSize: 12,
  fontWeight: 600,
});

// ── Drag Overlay ────────────────────────────────────

export const dragOverlayStyle = style({
  position: 'fixed',
  background: 'var(--rel-color-primary-alpha, rgba(59,130,246,0.15))',
  border: '2px solid var(--rel-color-primary, #3b82f6)',
  borderRadius: 4,
  pointerEvents: 'none',
  zIndex: 10000,
  transition: 'all 100ms ease',
});

// ── Maximized Overlay ───────────────────────────────

export const maximizedOverlayStyle = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  background: 'var(--rel-color-bg, #fff)',
  zIndex: 9000,
});
