/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * TagInput ek stiller — Select/Combobox CSS'ini reuse eder.
 * TagInput extra styles — reuses Select/Combobox CSS.
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';
import { cssVar } from '@relteco/relui-tokens';

// ── Root wrapper — color token for TagInput ──────────────────────────
export const tagInputRootStyle = style({
  color: 'var(--rel-color-text, #374151)',
});

// ── Wrapper — input + tag'ları saran konteyner ───────────────────────

export const tagInputWrapperStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '0.25rem',
  flex: 1,
  minWidth: 0,
  padding: '0.25rem 0',
});

// ── Input — tag'ların yanındaki arama input'u ────────────────────────

export const tagInputInnerInputStyle = style({
  appearance: 'none',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  color: 'inherit',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  lineHeight: 'inherit',
  padding: 0,
  margin: 0,
  flex: '1 1 60px',
  minWidth: '60px',
  height: '1.5em',
});

// ── Clear all butonu ─────────────────────────────────────────────────

export const tagInputClearStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '1.25rem',
  height: '1.25rem',
  borderRadius: 'var(--rel-radius-sm)',
  border: 'none',
  background: 'transparent',
  color: cssVar.fgMuted,
  cursor: 'pointer',
  padding: 0,
  fontSize: '0.75rem',
  lineHeight: 1,
  transition: 'color var(--rel-duration-fast) var(--rel-ease-ease)',
  selectors: {
    '&:hover': {
      color: cssVar.fgDefault,
    },
  },
});

// ── No result mesajı ─────────────────────────────────────────────────

export const tagInputNoResultStyle = style({
  padding: '0.5rem 0.75rem',
  color: cssVar.fgMuted,
  fontSize: 'var(--rel-text-sm)',
  textAlign: 'center',
  cursor: 'default',
});
