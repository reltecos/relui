/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

// ── Root ────────────────────────────────────────────

export const accordionRootStyle = style({
  width: '100%',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
});

// ── Item ────────────────────────────────────────────

export const accordionItemStyle = style({
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  ':last-child': {
    borderBottom: 'none',
  },
});

// ── Trigger ─────────────────────────────────────────

export const accordionTriggerStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '12px 16px',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  fontSize: 'var(--rel-text-sm, 14px)',
  fontWeight: 600,
  color: 'var(--rel-color-text, #111827)',
  lineHeight: 1.5,
  fontFamily: 'inherit',
  transition: 'background-color 150ms ease',
  ':hover': {
    backgroundColor: 'var(--rel-color-bg-hover, #f9fafb)',
  },
  ':focus-visible': {
    outline: '2px solid var(--rel-color-primary, #3b82f6)',
    outlineOffset: -2,
  },
});

// ── Icon ────────────────────────────────────────────

export const accordionIconStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 20,
  height: 20,
  flexShrink: 0,
  marginLeft: 8,
  transition: 'transform 200ms ease',
  color: 'var(--rel-color-text-secondary, #6b7280)',
});

// ── Content ─────────────────────────────────────────

export const accordionContentStyle = style({
  overflow: 'hidden',
  padding: '0 16px 12px',
  lineHeight: 1.6,
  color: 'var(--rel-color-text-secondary, #4b5563)',
});
