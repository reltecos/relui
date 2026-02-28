/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * RadioGroup styles — Vanilla Extract.
 * RadioGroup stilleri — Vanilla Extract tabanlı.
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';

// ── Base ─────────────────────────────────────────────────────────────

export const radioGroupBaseStyle = style({
  display: 'inline-flex',
  flexWrap: 'nowrap',
});

// ── Orientation ──────────────────────────────────────────────────────

export const radioGroupHorizontalStyle = style({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 'var(--rel-spacing-4)',
});

export const radioGroupVerticalStyle = style({
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 'var(--rel-spacing-2)',
});
