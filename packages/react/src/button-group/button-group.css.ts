/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ButtonGroup styles — Vanilla Extract style + globalStyle.
 * ButtonGroup stilleri — Vanilla Extract style + globalStyle tabanlı.
 *
 * Child-targeting selector'lar VE'de globalStyle ile yapılır.
 * VE .css.ts dosyaları sadece CSS class'ları export edebilir (fonksiyon yasak).
 *
 * @packageDocumentation
 */

import { style, globalStyle } from '@vanilla-extract/css';

// ── Base ─────────────────────────────────────────────────────────────

export const baseStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  flexWrap: 'nowrap',
  color: 'var(--rel-color-text, #374151)',
});

// ── Orientation ──────────────────────────────────────────────────────

export const horizontalStyle = style({
  flexDirection: 'row',
});

export const verticalStyle = style({
  flexDirection: 'column',
  alignItems: 'stretch',
});

// ── Gap (not attached) ───────────────────────────────────────────────

export const gappedStyle = style({
  gap: 'var(--rel-spacing-1.5)',
});

// ── Attached base ────────────────────────────────────────────────────

export const attachedBaseStyle = style({
  gap: 0,
});

// ── Attached horizontal — child border-radius + negative margin ──

export const attachedHorizontalStyle = style({});

globalStyle(`${attachedHorizontalStyle} > *:not(:last-child)`, {
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
});

globalStyle(`${attachedHorizontalStyle} > *:not(:first-child)`, {
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  marginLeft: '-1px',
});

// ── Attached vertical — child border-radius + negative margin ──

export const attachedVerticalStyle = style({});

globalStyle(`${attachedVerticalStyle} > *:not(:last-child)`, {
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
});

globalStyle(`${attachedVerticalStyle} > *:not(:first-child)`, {
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  marginTop: '-1px',
});
