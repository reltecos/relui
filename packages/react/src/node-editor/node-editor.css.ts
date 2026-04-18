/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

export const rootStyle = style({
  position: 'relative',
  overflow: 'hidden',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 13px)',
  color: 'var(--rel-color-text, #374151)',
  backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 8,
  width: '100%',
  height: 500,
});

export const canvasStyle = style({
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
});

export const svgLayerStyle = style({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
});

export const nodeLayerStyle = style({
  position: 'absolute',
  inset: 0,
});

export const toolbarStyle = style({
  position: 'absolute',
  top: 8,
  left: 8,
  display: 'flex',
  gap: 4,
  zIndex: 10,
});

export const toolbarButtonStyle = style({
  padding: '4px 8px',
  borderRadius: 4,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  color: 'var(--rel-color-text, #374151)',
  cursor: 'pointer',
  fontSize: 'var(--rel-text-xs, 12px)',
  fontFamily: 'inherit',
  boxShadow: 'var(--rel-shadow-sm, 0 1px 2px rgba(0,0,0,0.05))',
  selectors: {
    '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' },
  },
});

export const nodeStyle = style({
  position: 'absolute',
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 8,
  boxShadow: 'var(--rel-shadow-md, 0 4px 16px rgba(0,0,0,0.1))',
  minWidth: 160,
  userSelect: 'none',
  selectors: {
    '&[data-selected="true"]': {
      borderColor: 'var(--rel-color-primary, #3b82f6)',
      boxShadow: 'var(--rel-shadow-md, 0 4px 16px rgba(0,0,0,0.1)), 0 0 0 2px var(--rel-color-primary-light, #93c5fd)',
    },
  },
});

export const nodeHeaderStyle = style({
  padding: '6px 12px',
  fontWeight: 600,
  fontSize: 'var(--rel-text-sm, 13px)',
  color: 'var(--rel-color-text-inverse, #ffffff)',
  backgroundColor: 'var(--rel-color-primary, #3b82f6)',
  borderTopLeftRadius: 7,
  borderTopRightRadius: 7,
  cursor: 'grab',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const nodeBodyStyle = style({
  padding: '8px 0',
});

export const portStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '3px 12px',
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text, #374151)',
  cursor: 'crosshair',
});

export const portDotStyle = style({
  width: 10,
  height: 10,
  borderRadius: '50%',
  border: '2px solid var(--rel-color-bg, #ffffff)',
  flexShrink: 0,
});

export const edgeStyle = style({
  fill: 'none',
  strokeWidth: 2,
  stroke: 'var(--rel-color-border, #94a3b8)',
  pointerEvents: 'stroke',
  selectors: {
    '&:hover': {
      stroke: 'var(--rel-color-primary, #3b82f6)',
      strokeWidth: 3,
    },
  },
});

export const groupStyle = style({
  position: 'absolute',
  border: '2px dashed var(--rel-color-border, #94a3b8)',
  borderRadius: 12,
  backgroundColor: 'var(--rel-color-bg-muted, rgba(148,163,184,0.08))',
});

export const groupLabelStyle = style({
  position: 'absolute',
  top: -10,
  left: 12,
  padding: '0 4px',
  fontSize: 'var(--rel-text-xs, 11px)',
  fontWeight: 600,
  color: 'var(--rel-color-text-secondary, #6b7280)',
  backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
});

export const minimapStyle = style({
  position: 'absolute',
  bottom: 8,
  right: 8,
  width: 150,
  height: 100,
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 6,
  boxShadow: 'var(--rel-shadow-sm, 0 1px 2px rgba(0,0,0,0.05))',
  overflow: 'hidden',
  zIndex: 10,
});
