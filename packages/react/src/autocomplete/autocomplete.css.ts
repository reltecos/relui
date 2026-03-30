/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style, styleVariants } from '@vanilla-extract/css';

// ── Root ────────────────────────────────────────────

export const rootStyle = style({
  position: 'relative',
  display: 'inline-flex',
  flexDirection: 'column',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
});

export const sizeStyles = styleVariants({
  sm: { fontSize: 'var(--rel-text-sm, 14px)' },
  md: { fontSize: 'var(--rel-text-md, 16px)' },
  lg: { fontSize: 'var(--rel-text-lg, 18px)' },
});

// ── Input ──────────────────────────────────────────

export const inputStyle = style({
  width: '100%',
  padding: '8px 12px',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 6,
  color: 'var(--rel-color-text, #374151)',
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  outline: 'none',
  selectors: {
    '&:focus': {
      borderColor: 'var(--rel-color-primary, #3b82f6)',
      boxShadow: 'var(--rel-shadow-focus, 0 0 0 2px rgba(59,130,246,0.2))',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
});

export const inputSizeStyles = styleVariants({
  sm: { padding: '4px 8px' },
  md: { padding: '8px 12px' },
  lg: { padding: '12px 16px' },
});

// ── Listbox ────────────────────────────────────────

export const listboxStyle = style({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  zIndex: 50,
  marginTop: 4,
  maxHeight: 240,
  overflowY: 'auto',
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 6,
  boxShadow: 'var(--rel-shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.1))',
});

// ── Option ─────────────────────────────────────────

export const optionBaseStyle = style({
  padding: '8px 12px',
  cursor: 'pointer',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.5,
  selectors: {
    '&[data-disabled="true"]': {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
  },
});

export const optionHighlightedStyle = style({
  backgroundColor: 'var(--rel-color-bg-subtle, #f1f5f9)',
});

// ── Option Group ───────────────────────────────────

export const optionGroupStyle = style({
  padding: '6px 12px 4px',
  fontSize: 'var(--rel-text-xs, 12px)',
  fontWeight: 600,
  color: 'var(--rel-color-text-secondary, #6b7280)',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
});

// ── No Result ──────────────────────────────────────

export const noResultStyle = style({
  padding: '12px',
  textAlign: 'center',
  color: 'var(--rel-color-text-secondary, #9ca3af)',
  fontSize: 'var(--rel-text-sm, 14px)',
});
