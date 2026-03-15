/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

// ── Root ────────────────────────────────────────────

export const rootStyle = style({
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  color: 'var(--rel-color-text, #1e293b)',
});

// ── Page ────────────────────────────────────────────

export const pageStyle = style({
  flex: 1,
  overflow: 'hidden',
});

// ── Controls ────────────────────────────────────────

export const controlsStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '8px 0',
});

// ── Nav Button ──────────────────────────────────────

export const navButtonStyle = style({
  border: '1px solid var(--rel-color-border, #e2e8f0)',
  borderRadius: 4,
  background: 'var(--rel-color-bg, #fff)',
  cursor: 'pointer',
  padding: '4px 12px',
  fontSize: 18,
  lineHeight: 1,
  color: 'var(--rel-color-text, #1e293b)',
});

export const navButtonDisabledStyle = style({
  border: '1px solid var(--rel-color-border, #e2e8f0)',
  borderRadius: 4,
  background: 'var(--rel-color-bg, #fff)',
  padding: '4px 12px',
  fontSize: 18,
  lineHeight: 1,
  color: 'var(--rel-color-text, #1e293b)',
  opacity: 0.4,
  cursor: 'not-allowed',
});

// ── Page Indicator ──────────────────────────────────

export const pageIndicatorStyle = style({
  fontSize: 13,
  color: 'var(--rel-color-text-muted, #64748b)',
});
