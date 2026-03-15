/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

// ── Root ────────────────────────────────────────────

export const listRootStyle = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.5,
});

// ── Item ────────────────────────────────────────────

export const listItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '10px 16px',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  selectors: {
    '&:last-child': {
      borderBottom: 'none',
    },
  },
});

// ── Item Primary ────────────────────────────────────

export const listItemPrimaryStyle = style({
  fontWeight: 500,
  color: 'var(--rel-color-text, #111827)',
  lineHeight: 1.4,
});

// ── Item Secondary ──────────────────────────────────

export const listItemSecondaryStyle = style({
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  lineHeight: 1.4,
  marginTop: 2,
});

// ── Item Icon ───────────────────────────────────────

export const listItemIconStyle = style({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  color: 'var(--rel-color-text-secondary, #6b7280)',
});

// ── Item Action ─────────────────────────────────────

export const listItemActionStyle = style({
  flexShrink: 0,
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
});
