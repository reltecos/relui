/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MasterDetailLayout styles — Vanilla Extract.
 * MasterDetailLayout stilleri — Vanilla Extract tabanli.
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';

// ── Root ─────────────────────────────────────────────

export const rootStyle = style({
  display: 'flex',
  color: 'var(--rel-color-text, #374151)',
  width: '100%',
  height: '100%',
});

// ── Master ───────────────────────────────────────────

export const masterStyle = style({
  overflow: 'hidden',
  flexShrink: 0,
  transition: 'width 0.2s ease, height 0.2s ease',
});

// ── Detail ───────────────────────────────────────────

export const detailStyle = style({
  flex: 1,
  overflow: 'auto',
});

// ── Collapse Button ──────────────────────────────────

export const collapseButtonStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  padding: 0,
  border: 'none',
  background: 'var(--rel-color-bg-subtle, #f8fafc)',
  cursor: 'pointer',
  width: 24,
  selectors: {
    '&:hover': {
      background: 'var(--rel-color-bg-component-hover, #e2e8f0)',
    },
  },
});
