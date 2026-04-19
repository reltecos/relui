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
  color: 'var(--rel-color-text, #374151)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 8,
  overflow: 'hidden',
});

export const toolbarStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  padding: '8px 12px',
  backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  fontSize: 'var(--rel-text-sm, 13px)',
});

export const toolbarButtonStyle = style({
  padding: '4px 10px',
  borderRadius: 4,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  color: 'var(--rel-color-text, #374151)',
  cursor: 'pointer',
  fontSize: 'inherit',
  fontFamily: 'inherit',
  selectors: { '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' } },
});

export const presetListStyle = style({
  flex: 1,
  overflow: 'auto',
  padding: 8,
});

export const presetItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 12px',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 'var(--rel-text-sm, 14px)',
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' },
    '&[data-active="true"]': {
      backgroundColor: 'var(--rel-color-primary-light, #dbeafe)',
      color: 'var(--rel-color-primary, #3b82f6)',
    },
    '&[data-selected="true"]': {
      outline: '2px solid var(--rel-color-primary, #3b82f6)',
      outlineOffset: -2,
    },
  },
});

export const presetNameStyle = style({ flex: 1, fontWeight: 500 });

export const presetBadgeStyle = style({
  fontSize: 'var(--rel-text-xs, 11px)',
  padding: '1px 6px',
  borderRadius: 4,
  backgroundColor: 'var(--rel-color-success-light, #dcfce7)',
  color: 'var(--rel-color-success, #16a34a)',
});

export const actionsStyle = style({
  display: 'flex',
  gap: 4,
  padding: '8px 12px',
  borderTop: '1px solid var(--rel-color-border, #e5e7eb)',
  backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
});
