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
  gap: 16,
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
});

export const fieldChooserStyle = style({
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
  padding: 12,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 8,
  backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
});

export const fieldZoneStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  flex: 1,
  minWidth: 140,
});

export const fieldZoneLabelStyle = style({
  fontSize: 'var(--rel-text-xs, 12px)',
  fontWeight: 600,
  color: 'var(--rel-color-text-secondary, #6b7280)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

export const fieldTagStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 8px',
  borderRadius: 4,
  fontSize: 'var(--rel-text-xs, 12px)',
  backgroundColor: 'var(--rel-color-primary-subtle, #eff6ff)',
  color: 'var(--rel-color-text, #374151)',
  cursor: 'grab',
});

export const gridStyle = style({
  width: '100%',
  borderCollapse: 'collapse',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
});

export const headerCellStyle = style({
  padding: '6px 12px',
  fontWeight: 600,
  textAlign: 'center',
  backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  whiteSpace: 'nowrap',
});

export const dataCellStyle = style({
  padding: '6px 12px',
  textAlign: 'right',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
});

export const totalCellStyle = style({
  padding: '6px 12px',
  textAlign: 'right',
  fontWeight: 600,
  backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
});
