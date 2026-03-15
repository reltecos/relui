/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style, styleVariants } from '@vanilla-extract/css';

// ── Root ────────────────────────────────────────────

export const cardRootStyle = style({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 8,
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.5,
  overflow: 'hidden',
});

// ── Variant ─────────────────────────────────────────

export const cardVariantStyles = styleVariants({
  elevated: {
    backgroundColor: 'var(--rel-color-bg, #fff)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  },
  outlined: {
    backgroundColor: 'var(--rel-color-bg, #fff)',
    border: '1px solid var(--rel-color-border, #e5e7eb)',
  },
  filled: {
    backgroundColor: 'var(--rel-color-bg-secondary, #f9fafb)',
  },
});

// ── Header ──────────────────────────────────────────

export const cardHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
});

// ── Title ───────────────────────────────────────────

export const cardTitleStyle = style({
  margin: 0,
  fontSize: 'var(--rel-text-base, 16px)',
  fontWeight: 600,
  color: 'var(--rel-color-text, #111827)',
  lineHeight: 1.4,
});

// ── Subtitle ────────────────────────────────────────

export const cardSubtitleStyle = style({
  margin: '2px 0 0',
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  lineHeight: 1.4,
});

// ── Body ────────────────────────────────────────────

export const cardBodyStyle = style({
  padding: '0 20px 16px',
  flex: 1,
});

// ── Footer ──────────────────────────────────────────

export const cardFooterStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '12px 20px',
  borderTop: '1px solid var(--rel-color-border, #e5e7eb)',
});

// ── Media ───────────────────────────────────────────

export const cardMediaStyle = style({
  width: '100%',
  display: 'block',
  objectFit: 'cover',
});
