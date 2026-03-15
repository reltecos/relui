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
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

// ── Content ─────────────────────────────────────────

export const tooltipContentStyle = style({
  position: 'absolute',
  zIndex: 10000,
  backgroundColor: 'var(--rel-color-tooltip-bg, #1f2937)',
  color: 'var(--rel-color-tooltip-text, #f9fafb)',
  borderRadius: 6,
  padding: '6px 10px',
  fontSize: 'var(--rel-text-xs, 12px)',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  lineHeight: 1.4,
  maxWidth: 280,
  wordWrap: 'break-word',
  pointerEvents: 'none',
  animation: `${fadeIn} 150ms ease-out`,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
});

// ── Arrow ───────────────────────────────────────────

export const tooltipArrowStyle = style({
  position: 'absolute',
  width: 8,
  height: 8,
  backgroundColor: 'var(--rel-color-tooltip-bg, #1f2937)',
  transform: 'rotate(45deg)',
  zIndex: -1,
});
