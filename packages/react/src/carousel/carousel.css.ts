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
  overflow: 'hidden',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
});

// ── Viewport ────────────────────────────────────────

export const viewportStyle = style({
  display: 'flex',
  transition: 'transform 300ms ease-in-out',
});

// ── Slide ───────────────────────────────────────────

export const slideStyle = style({
  flex: '0 0 100%',
  minWidth: 0,
});

// ── Navigation Buttons ──────────────────────────────

const navButtonBase = style({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: '50%',
  border: 'none',
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  color: 'var(--rel-color-text, #374151)',
  boxShadow: 'var(--rel-shadow-md, 0 4px 6px -1px rgba(0,0,0,0.1))',
  cursor: 'pointer',
  zIndex: 1,
  padding: 0,
  fontSize: 'var(--rel-text-sm, 14px)',
  lineHeight: 1,
  transition: 'opacity 150ms ease',
  ':hover': {
    opacity: 0.8,
  },
  ':disabled': {
    opacity: 0.4,
    cursor: 'default',
  },
});

export const prevButtonStyle = style([
  navButtonBase,
  { left: 8 },
]);

export const nextButtonStyle = style([
  navButtonBase,
  { right: 8 },
]);

// ── Indicators ──────────────────────────────────────

export const indicatorsStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '12px 0',
});

export const indicatorStyle = style({
  width: 8,
  height: 8,
  borderRadius: '50%',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  backgroundColor: 'var(--rel-color-border, #d1d5db)',
  transition: 'background-color 150ms ease, transform 150ms ease',
  ':hover': {
    transform: 'scale(1.3)',
  },
});

export const indicatorActiveStyle = style({
  backgroundColor: 'var(--rel-color-primary, #3b82f6)',
  transform: 'scale(1.3)',
});
