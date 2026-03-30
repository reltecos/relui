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
});

// ── Input ───────────────────────────────────────────

export const inputStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 12px',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 6,
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  cursor: 'pointer',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.5,
  ':hover': {
    borderColor: 'var(--rel-color-primary, #3b82f6)',
  },
});

// ── Dropdown ────────────────────────────────────────

export const dropdownStyle = style({
  position: 'absolute',
  top: '100%',
  left: 0,
  marginTop: 4,
  display: 'flex',
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 8,
  boxShadow: 'var(--rel-shadow-lg, 0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px rgba(0,0,0,.1))',
  zIndex: 50,
  padding: 8,
  gap: 4,
});

// ── Column ──────────────────────────────────────────

export const columnStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  maxHeight: 200,
  overflowY: 'auto',
  padding: 4,
});

// ── Cell ────────────────────────────────────────────

export const cellStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px 8px',
  borderRadius: 4,
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  fontSize: 'var(--rel-text-sm, 14px)',
  minWidth: 36,
  textAlign: 'center',
  color: 'var(--rel-color-text, #374151)',
  ':hover': {
    backgroundColor: 'var(--rel-color-bg-muted, #f3f4f6)',
  },
});

// ── Cell Selected ───────────────────────────────────

export const cellSelectedStyle = style({
  backgroundColor: 'var(--rel-color-primary, #3b82f6)',
  color: 'var(--rel-color-white, #ffffff)',
  fontWeight: 600,
});

// ── Separator ───────────────────────────────────────

export const separatorStyle = style({
  display: 'flex',
  alignItems: 'center',
  fontSize: 'var(--rel-text-lg, 18px)',
  fontWeight: 600,
  color: 'var(--rel-color-text-secondary, #6b7280)',
  paddingLeft: 4,
  paddingRight: 4,
});

// ── Period Column ───────────────────────────────────

export const periodColumnStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  padding: 4,
  borderLeft: '1px solid var(--rel-color-border, #e5e7eb)',
});

// ── Placeholder ─────────────────────────────────────

export const placeholderStyle = style({
  color: 'var(--rel-color-text-secondary, #9ca3af)',
});
