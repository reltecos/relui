/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MultiColumnCombobox ek stiller — Select, Input ve Combobox CSS'ini reuse eder.
 * MultiColumnCombobox extra styles — reuses Select, Input and Combobox CSS.
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';
import { cssVar } from '@relteco/relui-tokens';

// ── Grid container (dropdown) ───────────────────────────────────────

export const mccbGridStyle = style({
  display: 'grid',
  width: '100%',
  overflowY: 'auto',
  maxHeight: '15rem',
});

// ── Başlık satırı / Header row ──────────────────────────────────────

export const mccbHeaderRowStyle = style({
  display: 'contents',
});

export const mccbHeaderCellStyle = style({
  padding: 'var(--rel-spacing-2) var(--rel-spacing-3)',
  fontSize: 'var(--rel-text-xs)',
  fontWeight: '600',
  color: cssVar.fgMuted,
  textAlign: 'left',
  borderBottom: `1px solid ${cssVar.borderDefault}`,
  userSelect: 'none',
  whiteSpace: 'nowrap',
});

// ── Veri satırı / Data row ──────────────────────────────────────────

export const mccbRowStyle = style({
  display: 'contents',
  cursor: 'pointer',
  selectors: {
    '&[data-disabled]': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
});

// ── Hücre / Cell ────────────────────────────────────────────────────

export const mccbCellStyle = style({
  padding: 'var(--rel-spacing-2) var(--rel-spacing-3)',
  fontSize: 'var(--rel-text-sm)',
  color: cssVar.fgDefault,
  whiteSpace: 'nowrap',
  minWidth: 0,
  transition: 'background-color var(--rel-duration-fast) var(--rel-ease-ease)',
  selectors: {
    '[data-highlighted] > &': {
      background: cssVar.bgSubtle,
    },
    '[aria-selected="true"] > &': {
      fontWeight: '500',
    },
    '[data-disabled] > &': {
      color: cssVar.fgMuted,
    },
  },
});

// ── "Sonuç yok" mesajı / "No results" message ──────────────────────

export const mccbNoResultStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 'var(--rel-spacing-4)',
  fontSize: 'var(--rel-text-sm)',
  color: cssVar.fgMuted,
  gridColumn: '1 / -1',
});
