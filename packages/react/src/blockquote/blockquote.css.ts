/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style, styleVariants } from '@vanilla-extract/css';

// ── Root ────────────────────────────────────────────

export const blockquoteRootStyle = style({
  display: 'flex',
  gap: 12,
  margin: 0,
  padding: '16px 20px',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-base, 16px)',
  lineHeight: 1.6,
  color: 'var(--rel-color-text, #374151)',
  position: 'relative',
});

// ── Variant ─────────────────────────────────────────

export const blockquoteVariantStyles = styleVariants({
  default: {
    backgroundColor: 'var(--rel-color-bg-secondary, #f9fafb)',
    borderRadius: 8,
  },
  bordered: {
    backgroundColor: 'transparent',
    borderLeft: '4px solid var(--rel-color-primary, #3b82f6)',
    borderRadius: 0,
    paddingLeft: 16,
  },
});

// ── Icon ────────────────────────────────────────────

export const blockquoteIconStyle = style({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'flex-start',
  paddingTop: 2,
  fontSize: 'var(--rel-text-lg, 18px)',
  opacity: 0.6,
});

// ── Content ─────────────────────────────────────────

export const blockquoteContentStyle = style({
  flex: 1,
  margin: 0,
  fontStyle: 'italic',
});

// ── Cite ────────────────────────────────────────────

export const blockquoteCiteStyle = style({
  display: 'block',
  marginTop: 8,
  fontSize: 'var(--rel-text-sm, 14px)',
  fontStyle: 'normal',
  fontWeight: 500,
  color: 'var(--rel-color-text-secondary, #6b7280)',
  selectors: {
    '&::before': {
      content: '"\\2014\\00A0"',
    },
  },
});
