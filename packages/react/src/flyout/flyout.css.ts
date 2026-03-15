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
  '0%': { opacity: 0, transform: 'translateY(4px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

// ── Panel ───────────────────────────────────────────

export const flyoutPanelStyle = style({
  position: 'absolute',
  zIndex: 9999,
  backgroundColor: 'var(--rel-color-bg, #fff)',
  borderRadius: 8,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.14), 0 2px 8px rgba(0, 0, 0, 0.08)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.5,
  animation: `${fadeIn} 150ms ease-out`,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

// ── Header ──────────────────────────────────────────

export const flyoutHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  flexShrink: 0,
});

// ── Title ───────────────────────────────────────────

export const flyoutTitleStyle = style({
  margin: 0,
  fontSize: 'var(--rel-text-base, 16px)',
  fontWeight: 600,
  color: 'var(--rel-color-text, #111827)',
  lineHeight: 1.4,
});

// ── Close Button ────────────────────────────────────

export const flyoutCloseButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  borderRadius: 4,
  color: 'var(--rel-color-text-secondary, #6b7280)',
  padding: 0,
  flexShrink: 0,
  transition: 'background-color 150ms ease',
  ':hover': {
    backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)',
  },
});

// ── Body ────────────────────────────────────────────

export const flyoutBodyStyle = style({
  padding: '12px 16px',
  flex: 1,
  overflow: 'auto',
});

// ── Footer ──────────────────────────────────────────

export const flyoutFooterStyle = style({
  padding: '12px 16px',
  borderTop: '1px solid var(--rel-color-border, #e5e7eb)',
  flexShrink: 0,
});
