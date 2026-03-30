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
  display: 'inline-flex',
  flexDirection: 'column',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
});

// ── Input ───────────────────────────────────────────

export const inputStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 12px',
  border: '1px solid var(--rel-color-border, #d1d5db)',
  borderRadius: 6,
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  cursor: 'pointer',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.5,
  transition: 'border-color 150ms ease',
  ':hover': {
    borderColor: 'var(--rel-color-primary, #3b82f6)',
  },
});

// ── Calendar ────────────────────────────────────────

export const calendarStyle = style({
  position: 'absolute',
  top: '100%',
  left: 0,
  marginTop: 4,
  padding: 12,
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 8,
  boxShadow: 'var(--rel-shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.1))',
  zIndex: 50,
  minWidth: 280,
});

// ── Header ──────────────────────────────────────────

export const headerStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 8,
});

// ── Navigation Button ───────────────────────────────

export const navButtonStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  border: 'none',
  borderRadius: 4,
  backgroundColor: 'transparent',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  cursor: 'pointer',
  padding: 0,
  transition: 'background-color 150ms ease',
  ':hover': {
    backgroundColor: 'var(--rel-color-bg-muted, #f3f4f6)',
  },
});

// ── Month Label ─────────────────────────────────────

export const monthLabelStyle = style({
  fontWeight: 600,
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #111827)',
  textAlign: 'center',
});

// ── Grid ────────────────────────────────────────────

export const gridStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 2,
});

// ── Weekday Header ──────────────────────────────────

export const weekdayStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 32,
  fontSize: 'var(--rel-text-xs, 12px)',
  fontWeight: 500,
  color: 'var(--rel-color-text-secondary, #9ca3af)',
});

// ── Day Cell ────────────────────────────────────────

export const dayCellStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  border: 'none',
  borderRadius: 6,
  backgroundColor: 'transparent',
  color: 'var(--rel-color-text, #374151)',
  cursor: 'pointer',
  fontSize: 'var(--rel-text-sm, 14px)',
  padding: 0,
  transition: 'background-color 150ms ease, color 150ms ease',
  ':hover': {
    backgroundColor: 'var(--rel-color-bg-muted, #f3f4f6)',
  },
});

export const dayCellSelectedStyle = style({
  backgroundColor: 'var(--rel-color-primary, #3b82f6)',
  color: 'var(--rel-color-bg, #ffffff)',
  fontWeight: 600,
  ':hover': {
    backgroundColor: 'var(--rel-color-primary, #3b82f6)',
  },
});

export const dayCellTodayStyle = style({
  fontWeight: 700,
  boxShadow: 'inset 0 0 0 1px var(--rel-color-primary, #3b82f6)',
});

export const dayCellDisabledStyle = style({
  opacity: 0.35,
  cursor: 'default',
  pointerEvents: 'none',
});

export const dayCellOutsideStyle = style({
  opacity: 0.3,
});

// ── Placeholder ─────────────────────────────────────

export const placeholderStyle = style({
  color: 'var(--rel-color-text-secondary, #9ca3af)',
});
