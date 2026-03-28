/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style, keyframes } from '@vanilla-extract/css';

// ── Animations ──────────────────────────────────────

const fadeIn = keyframes({
  '0%': { opacity: 0, transform: 'scale(0.95)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
});

// ── Menu ────────────────────────────────────────────

export const contextMenuStyle = style({
  position: 'fixed',
  zIndex: 10001,
  minWidth: 180,
  backgroundColor: 'var(--rel-color-text-inverse, #fff)',
  borderRadius: 8,
  boxShadow: 'var(--rel-shadow-md, 0 4px 16px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.08))',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 13px)',
  padding: '4px 0',
  animation: `${fadeIn} 120ms ease-out`,
  outline: 'none',
});

// ── Item ────────────────────────────────────────────

export const contextMenuItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 12px',
  cursor: 'pointer',
  color: 'var(--rel-color-text, #374151)',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  ':hover': {
    backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)',
  },
});

export const contextMenuItemDisabledStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 12px',
  color: 'var(--rel-color-text-disabled, #9ca3af)',
  cursor: 'not-allowed',
  userSelect: 'none',
  whiteSpace: 'nowrap',
});

export const contextMenuItemHighlightedStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 12px',
  cursor: 'pointer',
  backgroundColor: 'var(--rel-color-primary, #3b82f6)',
  color: 'var(--rel-color-text-inverse, #fff)',
  userSelect: 'none',
  whiteSpace: 'nowrap',
});

// ── Item parts ──────────────────────────────────────

export const contextMenuItemIconStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
  flexShrink: 0,
});

export const contextMenuItemLabelStyle = style({
  flex: 1,
});

export const contextMenuItemShortcutStyle = style({
  fontSize: 'var(--rel-text-xs, 11px)',
  color: 'var(--rel-color-text-secondary, #9ca3af)',
  marginLeft: 24,
  flexShrink: 0,
});

export const contextMenuItemSubmenuArrowStyle = style({
  fontSize: 10,
  marginLeft: 'auto',
  flexShrink: 0,
});

// ── Separator ───────────────────────────────────────

export const contextMenuSeparatorStyle = style({
  height: 1,
  backgroundColor: 'var(--rel-color-border, #e5e7eb)',
  margin: '4px 0',
});

// ── Submenu ─────────────────────────────────────────

export const contextMenuSubmenuStyle = style({
  position: 'absolute',
  zIndex: 10002,
  minWidth: 160,
  backgroundColor: 'var(--rel-color-text-inverse, #fff)',
  borderRadius: 8,
  boxShadow: 'var(--rel-shadow-md, 0 4px 16px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.08))',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 13px)',
  padding: '4px 0',
  animation: `${fadeIn} 100ms ease-out`,
});
