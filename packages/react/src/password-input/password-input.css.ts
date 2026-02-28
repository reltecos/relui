/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * PasswordInput styles — Vanilla Extract.
 * PasswordInput stilleri — Vanilla Extract.
 *
 * Input recipe'sini reuse eder, toggle buton stili ekler.
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';
import { cssVar } from '@relteco/relui-tokens';

// ── Input recipe'sini reuse et ──────────────────────────────────────
// inputRecipe, inputWrapperStyle zaten input.css.ts'den export ediliyor.
// PasswordInput bunları doğrudan import eder.

// ── Toggle buton stili ──────────────────────────────────────────────

export const passwordToggleButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  right: 0,
  top: 0,
  bottom: 0,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  color: cssVar.fgMuted,
  padding: 0,
  margin: 0,
  outline: 'none',
  transitionProperty: 'color',
  transitionDuration: 'var(--rel-duration-fast)',
  transitionTimingFunction: 'var(--rel-ease-ease)',

  selectors: {
    '&:hover': {
      color: cssVar.fgDefault,
    },
    '&:focus-visible': {
      color: cssVar.fgDefault,
    },
    '&[data-disabled]': {
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  },
});
