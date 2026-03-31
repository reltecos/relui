/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

export const rootStyle = style({
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 8,
  overflow: 'hidden',
  backgroundColor: 'var(--rel-color-bg, #fff)',
  lineHeight: 1.5,
});

export const headerStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
});

export const navigationStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

export const navButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 4,
  backgroundColor: 'var(--rel-color-bg, #fff)',
  cursor: 'pointer',
  color: 'var(--rel-color-text, #374151)',
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' },
  },
});

export const titleStyle = style({
  fontWeight: 600,
  fontSize: 'var(--rel-text-base, 16px)',
  color: 'var(--rel-color-text, #111827)',
});

export const gridStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
});

export const weekHeaderStyle = style({
  display: 'contents',
});

export const weekDayStyle = style({
  padding: '8px 4px',
  textAlign: 'center',
  fontSize: 'var(--rel-text-xs, 12px)',
  fontWeight: 600,
  color: 'var(--rel-color-text-secondary, #6b7280)',
  textTransform: 'uppercase',
});

export const dayCellStyle = style({
  position: 'relative',
  minHeight: 64,
  padding: 4,
  borderTop: '1px solid var(--rel-color-border, #e5e7eb)',
  cursor: 'pointer',
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' },
  },
});

export const dayCellOutsideStyle = style({
  opacity: 0.4,
});

export const todayCellStyle = style({
  backgroundColor: 'var(--rel-color-primary-subtle, #eff6ff)',
});

export const selectedCellStyle = style({
  backgroundColor: 'var(--rel-color-primary-subtle, #dbeafe)',
});

export const dayNumberStyle = style({
  fontSize: 'var(--rel-text-xs, 12px)',
  fontWeight: 500,
  marginBottom: 2,
});

export const eventStyle = style({
  display: 'block',
  padding: '1px 4px',
  marginBottom: 1,
  borderRadius: 2,
  fontSize: 'var(--rel-text-xs, 12px)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  backgroundColor: 'var(--rel-color-primary, #3b82f6)',
  color: 'var(--rel-color-bg, #fff)',
});

export const viewSwitchStyle = style({
  display: 'flex',
  gap: 4,
});

export const viewButtonStyle = style({
  padding: '4px 8px',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 4,
  backgroundColor: 'var(--rel-color-bg, #fff)',
  cursor: 'pointer',
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text, #374151)',
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' },
  },
});

export const viewButtonActiveStyle = style({
  backgroundColor: 'var(--rel-color-primary, #3b82f6)',
  color: 'var(--rel-color-bg, #fff)',
  borderColor: 'var(--rel-color-primary, #3b82f6)',
});
