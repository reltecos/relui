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
  gap: 12,
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
});

// ── Zone ────────────────────────────────────────────

export const zoneStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: 32,
  border: '2px dashed var(--rel-color-border, #d1d5db)',
  borderRadius: 8,
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  cursor: 'pointer',
  transition: 'border-color 150ms ease, background-color 150ms ease',
  textAlign: 'center',
  minHeight: 120,
});

export const zoneDraggingStyle = style({
  borderColor: 'var(--rel-color-primary, #3b82f6)',
  backgroundColor: 'var(--rel-color-primary-light, #eff6ff)',
});

export const zoneTextStyle = style({
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text-secondary, #9ca3af)',
  margin: 0,
});

export const zoneIconStyle = style({
  color: 'var(--rel-color-text-secondary, #9ca3af)',
});

// ── File List ───────────────────────────────────────

export const fileListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

// ── File Item ───────────────────────────────────────

export const fileItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '8px 12px',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 6,
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
});

export const fileNameStyle = style({
  fontWeight: 500,
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const fileSizeStyle = style({
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-secondary, #9ca3af)',
  flexShrink: 0,
});

export const removeButtonStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  border: 'none',
  borderRadius: 4,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  color: 'var(--rel-color-text-secondary, #9ca3af)',
  padding: 0,
  ':hover': {
    color: 'var(--rel-color-error, #dc2626)',
  },
});

// ── Progress Bar ────────────────────────────────────

export const progressBarContainerStyle = style({
  width: '100%',
  height: 4,
  backgroundColor: 'var(--rel-color-bg-muted, #e5e7eb)',
  borderRadius: 2,
  overflow: 'hidden',
});

export const progressBarFillStyle = style({
  height: '100%',
  backgroundColor: 'var(--rel-color-primary, #3b82f6)',
  borderRadius: 2,
  transition: 'width 150ms ease',
});
