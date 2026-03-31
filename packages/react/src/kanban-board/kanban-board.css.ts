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
  gap: 16,
  overflow: 'auto',
  padding: 16,
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.5,
  minHeight: 400,
});

export const columnStyle = style({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 280,
  maxWidth: 320,
  backgroundColor: 'var(--rel-color-bg-secondary, #f9fafb)',
  borderRadius: 8,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  flexShrink: 0,
});

export const columnHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  fontWeight: 600,
  fontSize: 'var(--rel-text-sm, 14px)',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
});

export const columnBodyStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 8,
  flex: 1,
  overflow: 'auto',
  minHeight: 100,
});

export const cardStyle = style({
  padding: '12px 16px',
  backgroundColor: 'var(--rel-color-bg, #fff)',
  borderRadius: 6,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  cursor: 'grab',
  boxShadow: 'var(--rel-shadow-sm, 0 1px 2px rgba(0,0,0,0.05))',
  selectors: {
    '&:hover': {
      boxShadow: 'var(--rel-shadow-md, 0 4px 6px -1px rgba(0,0,0,0.1))',
    },
  },
});

export const cardTitleStyle = style({
  margin: 0,
  fontWeight: 500,
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #111827)',
});

export const cardDescriptionStyle = style({
  margin: '4px 0 0',
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-secondary, #6b7280)',
});

export const wipIndicatorStyle = style({
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-muted, #9ca3af)',
  fontWeight: 400,
});

export const wipOverStyle = style({
  color: 'var(--rel-color-error, #dc2626)',
  fontWeight: 600,
});

export const addButtonStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px 12px',
  margin: 8,
  border: '1px dashed var(--rel-color-border, #e5e7eb)',
  borderRadius: 6,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' },
  },
});

export const swimlaneStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: '16px 0',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
});

export const swimlaneHeaderStyle = style({
  fontWeight: 600,
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  padding: '0 16px',
});
