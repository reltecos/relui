/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style, styleVariants } from '@vanilla-extract/css';

// ── Root ────────────────────────────────────────────

export const rootVerticalStyle = style({
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.5,
  position: 'relative',
});

export const rootHorizontalStyle = style({
  display: 'flex',
  flexDirection: 'row',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.5,
  position: 'relative',
  overflowX: 'auto',
});

// ── Item ────────────────────────────────────────────

export const itemVerticalStyle = style({
  display: 'flex',
  position: 'relative',
  paddingBottom: 24,
  selectors: {
    '&:last-child': { paddingBottom: 0 },
  },
});

export const itemHorizontalStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  flex: '1 1 0',
  minWidth: 140,
});

// ── Dot ─────────────────────────────────────────────

export const dotStyle = style({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: 'var(--rel-color-primary, #3b82f6)',
  flexShrink: 0,
  zIndex: 1,
  position: 'relative',
});

// ── Connector ───────────────────────────────────────

export const connectorVerticalStyle = style({
  position: 'absolute',
  width: 2,
  top: 12,
  bottom: 0,
  left: 5,
  backgroundColor: 'var(--rel-color-border, #e5e7eb)',
});

export const connectorHorizontalStyle = style({
  position: 'absolute',
  height: 2,
  top: 5,
  left: 'calc(50% + 6px)',
  right: 'calc(-50% + 6px)',
  backgroundColor: 'var(--rel-color-border, #e5e7eb)',
});

// ── Content ─────────────────────────────────────────

export const contentVerticalStyle = style({
  marginLeft: 16,
  flex: 1,
  paddingTop: 0,
});

export const contentHorizontalStyle = style({
  marginTop: 12,
  textAlign: 'center',
});

// ── Title ───────────────────────────────────────────

export const titleStyle = style({
  margin: 0,
  fontSize: 'var(--rel-text-sm, 14px)',
  fontWeight: 600,
  color: 'var(--rel-color-text, #111827)',
  lineHeight: 1.4,
});

// ── Description ─────────────────────────────────────

export const descriptionStyle = style({
  margin: '4px 0 0',
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  lineHeight: 1.4,
});

// ── Date ────────────────────────────────────────────

export const dateStyle = style({
  margin: '4px 0 0',
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-secondary, #9ca3af)',
  lineHeight: 1.4,
});

// ── Align variants (vertical only) ─────────────────

export const alignStyles = styleVariants({
  left: { alignItems: 'flex-start' },
  right: { alignItems: 'flex-end', flexDirection: 'row-reverse' },
  alternate: { alignItems: 'flex-start' },
});

export const contentAlignRightStyle = style({
  marginLeft: 0,
  marginRight: 16,
  textAlign: 'right',
});

export const connectorAlignRightStyle = style({
  left: 'auto',
  right: 5,
});
