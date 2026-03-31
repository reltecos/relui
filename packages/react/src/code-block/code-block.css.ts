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
  flexDirection: 'column',
  fontFamily: 'var(--rel-font-mono, ui-monospace, "Cascadia Code", "Fira Code", Menlo, monospace)',
  fontSize: 'var(--rel-text-sm, 14px)',
  lineHeight: 1.6,
  borderRadius: 8,
  overflow: 'hidden',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
});

export const themeStyles = styleVariants({
  light: {
    backgroundColor: 'var(--rel-color-bg-secondary, #f9fafb)',
    color: 'var(--rel-color-text, #374151)',
  },
  dark: {
    backgroundColor: 'var(--rel-color-bg-inverse, #1f2937)',
    color: 'var(--rel-color-text-inverse, #f3f4f6)',
  },
});

// ── Header ──────────────────────────────────────────

export const headerStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 16px',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  fontSize: 'var(--rel-text-xs, 12px)',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
});

// ── Body ────────────────────────────────────────────

export const bodyStyle = style({
  overflow: 'auto',
  padding: '12px 0',
});

// ── Line ────────────────────────────────────────────

export const lineStyle = style({
  display: 'flex',
  padding: '0 16px',
  minHeight: '1.6em',
  selectors: {
    '&:hover': {
      backgroundColor: 'var(--rel-color-bg-hover, rgba(0,0,0,0.04))',
    },
  },
});

// ── Line Number ─────────────────────────────────────

export const lineNumberStyle = style({
  display: 'inline-block',
  minWidth: 40,
  paddingRight: 16,
  textAlign: 'right',
  color: 'var(--rel-color-text-muted, #9ca3af)',
  userSelect: 'none',
  flexShrink: 0,
});

// ── Content ─────────────────────────────────────────

export const contentStyle = style({
  flex: 1,
  whiteSpace: 'pre',
  wordBreak: 'break-all',
});

// ── Copy Button ─────────────────────────────────────

export const copyButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px 8px',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 4,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  fontSize: 'var(--rel-text-xs, 12px)',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  selectors: {
    '&:hover': {
      backgroundColor: 'var(--rel-color-bg-hover, rgba(0,0,0,0.04))',
    },
  },
});

// ── Language Badge ──────────────────────────────────

export const languageStyle = style({
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-muted, #9ca3af)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

// ── Token styles ────────────────────────────────────

export const tokenStyles = styleVariants({
  keyword: { color: 'var(--rel-color-code-keyword, #8b5cf6)', fontWeight: 600 },
  string: { color: 'var(--rel-color-code-string, #059669)' },
  comment: { color: 'var(--rel-color-code-comment, #9ca3af)', fontStyle: 'italic' },
  number: { color: 'var(--rel-color-code-number, #2563eb)' },
  punctuation: { color: 'var(--rel-color-code-punctuation, #6b7280)' },
  operator: { color: 'var(--rel-color-code-operator, #dc2626)' },
  tag: { color: 'var(--rel-color-code-tag, #dc2626)' },
  attribute: { color: 'var(--rel-color-code-attribute, #d97706)' },
  property: { color: 'var(--rel-color-code-property, #2563eb)' },
  text: { color: 'inherit' },
});
