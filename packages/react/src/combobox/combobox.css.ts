/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Combobox ek stiller — Select ve Input CSS'ini reuse eder.
 * Combobox extra styles — reuses Select and Input CSS.
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';
import { cssVar } from '@relteco/relui-tokens';

// ── Temizle butonu / Clear button ───────────────────────────────────

// ── Root wrapper — Combobox reuses Select trigger; color token set here ────
export const comboboxRootStyle = style({
  color: 'var(--rel-color-text, #374151)',
});

export const comboboxClearStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '1rem',
  height: '1rem',
  borderRadius: 'var(--rel-radius-sm)',
  border: 'none',
  background: 'transparent',
  color: cssVar.fgMuted,
  cursor: 'pointer',
  padding: 0,
  fontSize: '0.625rem',
  lineHeight: 1,
  transition: 'background-color var(--rel-duration-fast) var(--rel-ease-ease)',
  selectors: {
    '&:hover': {
      background: cssVar.borderDefault,
      color: cssVar.fgDefault,
    },
  },
});

// ── "Sonuç yok" mesajı / "No results" message ──────────────────────

export const comboboxNoResultStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 'var(--rel-spacing-4)',
  fontSize: 'var(--rel-text-sm)',
  color: cssVar.fgMuted,
});
