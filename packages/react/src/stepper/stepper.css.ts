/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style, styleVariants } from '@vanilla-extract/css';

// ── Root ────────────────────────────────────────────

export const rootStyle = style({
  display: 'flex',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
});

// ── Orientation ─────────────────────────────────────

export const horizontalStyle = style({
  flexDirection: 'row',
  alignItems: 'center',
});

export const verticalStyle = style({
  flexDirection: 'column',
});

// ── Step ────────────────────────────────────────────

export const stepStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

export const stepVerticalStyle = style({
  flexDirection: 'column',
  alignItems: 'flex-start',
});

// ── Indicator ───────────────────────────────────────

export const indicatorBaseStyle = style({
  width: 32,
  height: 32,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 600,
  fontSize: 'var(--rel-text-sm, 14px)',
  flexShrink: 0,
  transition: 'background-color 0.2s ease, color 0.2s ease',
});

export const indicatorStatusStyles = styleVariants({
  pending: {
    backgroundColor: 'var(--rel-color-bg-muted, #e5e7eb)',
    color: 'var(--rel-color-text-secondary, #6b7280)',
  },
  active: {
    backgroundColor: 'var(--rel-color-primary, #3b82f6)',
    color: 'var(--rel-color-bg, #ffffff)',
  },
  completed: {
    backgroundColor: 'var(--rel-color-success, #16a34a)',
    color: 'var(--rel-color-bg, #ffffff)',
  },
  error: {
    backgroundColor: 'var(--rel-color-error, #dc2626)',
    color: 'var(--rel-color-bg, #ffffff)',
  },
});

// ── Title ───────────────────────────────────────────

export const titleStyle = style({
  fontWeight: 500,
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.4,
});

// ── Description ─────────────────────────────────────

export const descriptionStyle = style({
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  lineHeight: 1.4,
});

// ── Connector ───────────────────────────────────────

export const connectorStyle = style({
  flex: 1,
  height: 2,
  backgroundColor: 'var(--rel-color-border, #e5e7eb)',
  marginLeft: 8,
  marginRight: 8,
});

export const connectorCompletedStyle = style({
  backgroundColor: 'var(--rel-color-success, #16a34a)',
});

export const connectorVerticalStyle = style({
  width: 2,
  marginLeft: 15,
  minHeight: 24,
});
