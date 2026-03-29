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
  position: 'relative',
  overflow: 'hidden',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  color: 'var(--rel-color-text, #374151)',
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 8,
});

// ── Size ────────────────────────────────────────────

export const sizeStyles = styleVariants({
  sm: { width: 150, height: 150 },
  md: { width: 200, height: 200 },
  lg: { width: 300, height: 300 },
});

// ── Face Container ──────────────────────────────────

export const faceContainerStyle = style({
  position: 'relative',
  width: '100%',
  height: '100%',
});

// ── Face ────────────────────────────────────────────

export const faceBaseStyle = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backfaceVisibility: 'hidden',
});

export const faceVisibleStyle = style({
  opacity: 1,
  transform: 'none',
  transition: 'opacity 0.5s ease, transform 0.5s ease',
  zIndex: 1,
});

export const faceHiddenStyle = style({
  opacity: 0,
  pointerEvents: 'none',
  zIndex: 0,
});

// ── Animation Variants ──────────────────────────────

export const fadeHiddenStyle = style({
  opacity: 0,
  transition: 'opacity 0.5s ease',
});

export const slideHiddenNextStyle = style({
  opacity: 0,
  transform: 'translateX(100%)',
  transition: 'opacity 0.5s ease, transform 0.5s ease',
});

export const slideHiddenPrevStyle = style({
  opacity: 0,
  transform: 'translateX(-100%)',
  transition: 'opacity 0.5s ease, transform 0.5s ease',
});

export const flipHiddenNextStyle = style({
  opacity: 0,
  transform: 'rotateY(180deg)',
  transition: 'opacity 0.5s ease, transform 0.5s ease',
});

export const flipHiddenPrevStyle = style({
  opacity: 0,
  transform: 'rotateY(-180deg)',
  transition: 'opacity 0.5s ease, transform 0.5s ease',
});

// ── Indicator ───────────────────────────────────────

export const indicatorStyle = style({
  position: 'absolute',
  bottom: 8,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: 6,
  zIndex: 2,
});

// ── Indicator Dot ───────────────────────────────────

export const indicatorDotBaseStyle = style({
  width: 8,
  height: 8,
  borderRadius: '50%',
  transition: 'background-color 0.2s ease',
  cursor: 'pointer',
});

export const indicatorDotActiveStyle = style({
  backgroundColor: 'var(--rel-color-primary, #3b82f6)',
});

export const indicatorDotInactiveStyle = style({
  backgroundColor: 'var(--rel-color-bg-muted, #d1d5db)',
});
