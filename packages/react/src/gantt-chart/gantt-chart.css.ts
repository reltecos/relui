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
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 8,
  overflow: 'hidden',
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
});

// ── Header ──────────────────────────────────────────

export const headerStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 16px',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
});

// ── Zoom Controls ───────────────────────────────────

export const zoomControlStyle = style({
  display: 'flex',
  gap: 4,
});

export const zoomButtonStyle = style({
  padding: '4px 8px',
  border: '1px solid var(--rel-color-border, #d1d5db)',
  borderRadius: 4,
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  color: 'var(--rel-color-text, #374151)',
  fontSize: 'var(--rel-text-xs, 12px)',
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background-color 150ms ease',
  ':hover': {
    backgroundColor: 'var(--rel-color-bg-muted, #f3f4f6)',
  },
});

export const zoomButtonActiveStyle = style({
  backgroundColor: 'var(--rel-color-primary, #3b82f6)',
  color: 'var(--rel-color-bg, #ffffff)',
  borderColor: 'var(--rel-color-primary, #3b82f6)',
  ':hover': {
    backgroundColor: 'var(--rel-color-primary, #3b82f6)',
  },
});

// ── Content ─────────────────────────────────────────

export const contentStyle = style({
  display: 'flex',
  flex: 1,
  overflow: 'auto',
});

// ── Task List ───────────────────────────────────────

export const taskListStyle = style({
  minWidth: 200,
  borderRight: '1px solid var(--rel-color-border, #e5e7eb)',
  flexShrink: 0,
});

export const taskRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 12px',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  gap: 8,
  minHeight: 40,
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  cursor: 'pointer',
  transition: 'background-color 100ms ease',
  ':hover': {
    backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
  },
});

export const taskNameStyle = style({
  fontWeight: 500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
});

// ── Timeline ────────────────────────────────────────

export const timelineStyle = style({
  flex: 1,
  position: 'relative',
  overflow: 'auto',
});

export const timelineHeaderStyle = style({
  display: 'flex',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)',
  position: 'sticky',
  top: 0,
  zIndex: 1,
});

export const dateCellStyle = style({
  minWidth: 40,
  padding: '6px 4px',
  textAlign: 'center',
  fontSize: 'var(--rel-text-xs, 11px)',
  color: 'var(--rel-color-text-secondary, #9ca3af)',
  borderRight: '1px solid var(--rel-color-border, #f3f4f6)',
  fontWeight: 500,
  flexShrink: 0,
});

// ── Task Bar ────────────────────────────────────────

export const timelineRowStyle = style({
  position: 'relative',
  minHeight: 40,
  borderBottom: '1px solid var(--rel-color-border, #f3f4f6)',
});

export const taskBarStyle = style({
  position: 'absolute',
  top: 8,
  height: 24,
  borderRadius: 4,
  backgroundColor: 'var(--rel-color-primary, #3b82f6)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  transition: 'opacity 150ms ease',
  ':hover': {
    opacity: 0.9,
  },
});

export const taskBarCriticalStyle = style({
  backgroundColor: 'var(--rel-color-error, #ef4444)',
});

export const progressFillStyle = style({
  height: '100%',
  backgroundColor: 'var(--rel-color-primary-dark, #2563eb)',
  borderRadius: '4px 0 0 4px',
  opacity: 0.4,
});

export const taskBarLabelStyle = style({
  position: 'absolute',
  left: 6,
  fontSize: 'var(--rel-text-xs, 11px)',
  fontWeight: 500,
  color: 'var(--rel-color-bg, #ffffff)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 'calc(100% - 12px)',
  lineHeight: '24px',
  pointerEvents: 'none',
});

// ── Milestone ───────────────────────────────────────

export const milestoneStyle = style({
  position: 'absolute',
  top: 12,
  width: 16,
  height: 16,
  backgroundColor: 'var(--rel-color-warning, #f59e0b)',
  transform: 'rotate(45deg)',
  cursor: 'pointer',
});

// ── Dependency Line ─────────────────────────────────

export const dependencySvgStyle = style({
  position: 'absolute',
  top: 0,
  left: 0,
  pointerEvents: 'none',
  overflow: 'visible',
});

export const dependencyLineStyle = style({
  fill: 'none',
  strokeWidth: 1.5,
});
