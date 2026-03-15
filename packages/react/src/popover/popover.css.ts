/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style, keyframes } from '@vanilla-extract/css';

// ── Animations ──────────────────────────────────────

const fadeIn = keyframes({
  '0%': { opacity: 0, transform: 'scale(0.96)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
});

// ── Content ─────────────────────────────────────────

export const popoverContentStyle = style({
  position: 'absolute',
  zIndex: 9999,
  backgroundColor: 'var(--rel-color-bg, #fff)',
  borderRadius: 8,
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.08)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.5,
  padding: 12,
  animation: `${fadeIn} 150ms ease-out`,
  minWidth: 120,
});

// ── Arrow ───────────────────────────────────────────

export const popoverArrowStyle = style({
  position: 'absolute',
  width: 10,
  height: 10,
  backgroundColor: 'var(--rel-color-bg, #fff)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  transform: 'rotate(45deg)',
  zIndex: -1,
});
