/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ThemePreview styles — Vanilla Extract.
 * ThemePreview stilleri — Vanilla Extract tabanli.
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';

// ── Root ─────────────────────────────────────────────

export const rootStyle = style({
  background: 'var(--rel-color-bg-app, #0f172a)',
  color: 'var(--rel-color-fg-default, #f8fafc)',
  padding: 24,
  borderRadius: 12,
  fontFamily: "'Inter', sans-serif",
  minWidth: 600,
});

// ── Selector ─────────────────────────────────────────

export const selectorStyle = style({
  display: 'flex',
  gap: 8,
  marginBottom: 24,
  flexWrap: 'wrap',
});

// ── Selector Button ──────────────────────────────────

export const selectorButtonStyle = style({
  padding: '8px 16px',
  borderRadius: 6,
  border: '1px solid var(--rel-color-border-default, #334155)',
  background: 'var(--rel-color-bg-component, #1e293b)',
  color: 'var(--rel-color-fg-default, #f8fafc)',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 400,
});

export const selectorButtonActiveStyle = style({
  border: '2px solid var(--rel-color-accent-default, #3b82f6)',
  background: 'var(--rel-color-accent-subtle, #1e3a5f)',
  color: 'var(--rel-color-accent-subtle-fg, #93c5fd)',
  fontWeight: 600,
});

// ── Color Section ────────────────────────────────────

export const colorSectionStyle = style({
  marginBottom: 20,
});

export const colorSectionTitleStyle = style({
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'var(--rel-color-fg-muted, #94a3b8)',
  marginBottom: 8,
});

export const colorGridStyle = style({
  display: 'flex',
  gap: 6,
  flexWrap: 'wrap',
});

// ── Color Swatch ─────────────────────────────────────

export const colorSwatchContainerStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
});

export const colorSwatchStyle = style({
  width: 48,
  height: 48,
  borderRadius: 8,
  border: '1px solid var(--rel-color-border-subtle, #1e293b)',
});

export const colorSwatchLabelStyle = style({
  fontSize: 10,
  color: 'var(--rel-color-fg-muted, #94a3b8)',
});

// ── Typography Section ───────────────────────────────

export const typographySectionStyle = style({
  marginBottom: 20,
});

export const typographySectionTitleStyle = style({
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'var(--rel-color-fg-muted, #94a3b8)',
  marginBottom: 8,
});
