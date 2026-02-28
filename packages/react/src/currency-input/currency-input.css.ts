/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * CurrencyInput styles — Vanilla Extract.
 * CurrencyInput stilleri — Vanilla Extract.
 *
 * Input recipe'sini reuse eder, currency symbol adorn stili ekler.
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';
import { cssVar } from '@relteco/relui-tokens';

// ── Input recipe'si ve wrapper reuse edilir ─────────────────────────
// inputRecipe, inputWrapperStyle input.css.ts'den import edilir.

// ── Currency symbol adorn stili ─────────────────────────────────────

export const currencyAdornStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  top: 0,
  bottom: 0,
  pointerEvents: 'none',
  color: cssVar.fgMuted,
  fontFamily: 'var(--rel-font-sans)',
  fontWeight: 'var(--rel-font-normal)',
  whiteSpace: 'nowrap',
  userSelect: 'none',
});
