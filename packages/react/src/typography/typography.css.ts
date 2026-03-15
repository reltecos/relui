/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style, styleVariants } from '@vanilla-extract/css';

// ── Root ────────────────────────────────────────────

export const typographyRootStyle = style({
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.5,
  margin: 0,
  padding: 0,
});

// ── Variant ─────────────────────────────────────────

export const typographyVariantStyles = styleVariants({
  h1: {
    fontSize: 'var(--rel-text-4xl, 36px)',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: 'var(--rel-text-3xl, 30px)',
    fontWeight: 700,
    lineHeight: 1.25,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: 'var(--rel-text-2xl, 24px)',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h4: {
    fontSize: 'var(--rel-text-xl, 20px)',
    fontWeight: 600,
    lineHeight: 1.35,
  },
  h5: {
    fontSize: 'var(--rel-text-lg, 18px)',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h6: {
    fontSize: 'var(--rel-text-base, 16px)',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  subtitle1: {
    fontSize: 'var(--rel-text-base, 16px)',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.01em',
  },
  subtitle2: {
    fontSize: 'var(--rel-text-sm, 14px)',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.01em',
  },
  body1: {
    fontSize: 'var(--rel-text-base, 16px)',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  body2: {
    fontSize: 'var(--rel-text-sm, 14px)',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  caption: {
    fontSize: 'var(--rel-text-xs, 12px)',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  overline: {
    fontSize: 'var(--rel-text-xs, 12px)',
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
});

// ── Align ───────────────────────────────────────────

export const typographyAlignStyles = styleVariants({
  left: { textAlign: 'left' },
  center: { textAlign: 'center' },
  right: { textAlign: 'right' },
  justify: { textAlign: 'justify' },
});

// ── Truncate ────────────────────────────────────────

export const typographyTruncateStyle = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

// ── Gutter Bottom ───────────────────────────────────

export const typographyGutterBottomStyle = style({
  marginBottom: '0.35em',
});
