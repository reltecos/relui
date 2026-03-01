/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Cascader styles — Vanilla Extract.
 * Cascader stilleri — Vanilla Extract.
 *
 * Trigger: Select trigger recipe reuse.
 * Panel: Çok kolonlu dropdown paneli.
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';
import { cssVar } from '@relteco/relui-tokens';

// ── Panel (dropdown — multi-column container) ───────────────────────

export const cascaderPanelStyle = style({
  // Position
  position: 'absolute',
  top: '100%',
  left: 0,
  zIndex: 50,
  marginTop: 'var(--rel-spacing-1)',

  // Layout
  display: 'inline-flex',
  flexDirection: 'row',

  // Visual
  background: cssVar.surfaceRaised,
  border: `1px solid ${cssVar.borderDefault}`,
  borderRadius: 'var(--rel-radius-md)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',

  // Overflow
  overflow: 'hidden',

  // Focus
  outline: 'none',
});

// ── Column (her seviye — dikey liste) ───────────────────────────────

export const cascaderColumnStyle = style({
  // Reset
  listStyle: 'none',
  margin: 0,
  padding: 'var(--rel-spacing-1) 0',

  // Layout
  minWidth: '10rem',
  maxHeight: '15rem',
  overflowY: 'auto',

  // Visual
  outline: 'none',

  selectors: {
    '&:not(:last-child)': {
      borderRight: `1px solid ${cssVar.borderDefault}`,
    },
  },
});

// ── Option (tek seçenek) ────────────────────────────────────────────

export const cascaderOptionStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--rel-spacing-2)',
  paddingLeft: 'var(--rel-spacing-3)',
  paddingRight: 'var(--rel-spacing-3)',
  paddingTop: 'var(--rel-spacing-1.5)',
  paddingBottom: 'var(--rel-spacing-1.5)',
  fontSize: 'var(--rel-text-sm)',
  lineHeight: '1.5',
  cursor: 'pointer',
  color: cssVar.fgDefault,
  transition: 'background-color var(--rel-duration-fast) var(--rel-ease-ease)',
  userSelect: 'none',

  selectors: {
    '&[data-highlighted]': {
      background: cssVar.bgSubtle,
    },

    '&[aria-selected="true"]': {
      fontWeight: 'var(--rel-font-medium)',
      color: cssVar.accentDefault,
    },

    '&[data-disabled]': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },

    '&[data-expanded]': {
      background: cssVar.bgSubtle,
    },
  },
});

// ── Option expand indicator (chevron sağ) ───────────────────────────

export const cascaderExpandIndicatorStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  color: cssVar.fgMuted,
  marginLeft: 'auto',
});
