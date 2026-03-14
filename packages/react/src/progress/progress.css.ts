/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { recipe } from '@vanilla-extract/recipes';
import { style, keyframes } from '@vanilla-extract/css';

// ── Animations ──────────────────────────────────────

const indeterminateBar = keyframes({
  '0%': { left: '-35%', width: '35%' },
  '60%': { left: '100%', width: '35%' },
  '100%': { left: '100%', width: '35%' },
});

const indeterminateBar2 = keyframes({
  '0%': { left: '-200%', width: '100%' },
  '60%': { left: '107%', width: '100%' },
  '100%': { left: '107%', width: '100%' },
});

const circularSpin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

const circularDash = keyframes({
  '0%': { strokeDasharray: '1, 200', strokeDashoffset: '0' },
  '50%': { strokeDasharray: '100, 200', strokeDashoffset: '-15' },
  '100%': { strokeDasharray: '100, 200', strokeDashoffset: '-125' },
});

const stripedMove = keyframes({
  '0%': { backgroundPosition: '0 0' },
  '100%': { backgroundPosition: '40px 0' },
});

// ── Root recipe ─────────────────────────────────────

export const progressRootRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  },
  variants: {
    type: {
      bar: { flexDirection: 'column' as const, gap: 4 },
      circular: {
        display: 'inline-flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        width: 'auto',
        gap: 4,
      },
      chunk: { flexDirection: 'column' as const, gap: 4 },
    },
  },
  defaultVariants: {
    type: 'bar',
  },
});

// ── Track (bar ve chunk icin) ───────────────────────

export const progressTrackRecipe = recipe({
  base: {
    position: 'relative' as const,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 9999,
    backgroundColor: 'var(--rel-color-neutral-100, #f1f5f9)',
  },
  variants: {
    size: {
      xs: { height: 2 },
      sm: { height: 4 },
      md: { height: 8 },
      lg: { height: 12 },
      xl: { height: 16 },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// ── Fill (bar icin) ─────────────────────────────────

export const progressFillStyle = style({
  height: '100%',
  borderRadius: 'inherit',
  backgroundColor: 'var(--rel-color-primary, #3b82f6)',
  transition: 'width 300ms ease',
});

// ── Indeterminate bar fill ──────────────────────────

export const progressFillIndeterminateStyle = style({
  position: 'absolute' as const,
  top: 0,
  bottom: 0,
  borderRadius: 'inherit',
  backgroundColor: 'var(--rel-color-primary, #3b82f6)',
  animation: `${indeterminateBar} 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite`,
});

export const progressFillIndeterminate2Style = style({
  position: 'absolute' as const,
  top: 0,
  bottom: 0,
  borderRadius: 'inherit',
  backgroundColor: 'var(--rel-color-primary, #3b82f6)',
  animation: `${indeterminateBar2} 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite`,
});

// ── Striped fill ────────────────────────────────────

export const progressStripedStyle = style({
  backgroundImage: `linear-gradient(
    45deg,
    rgba(255,255,255,0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255,255,255,0.15) 50%,
    rgba(255,255,255,0.15) 75%,
    transparent 75%,
    transparent
  )`,
  backgroundSize: '40px 40px',
});

export const progressStripedAnimatedStyle = style({
  animation: `${stripedMove} 1s linear infinite`,
});

// ── Chunk track ─────────────────────────────────────

export const progressChunkTrackStyle = style({
  display: 'flex',
  width: '100%',
  gap: 3,
});

export const progressChunkRecipe = recipe({
  base: {
    flex: 1,
    borderRadius: 2,
    backgroundColor: 'var(--rel-color-neutral-100, #f1f5f9)',
    transition: 'background-color 200ms ease',
  },
  variants: {
    size: {
      xs: { height: 2 },
      sm: { height: 4 },
      md: { height: 8 },
      lg: { height: 12 },
      xl: { height: 16 },
    },
    filled: {
      true: { backgroundColor: 'var(--rel-color-primary, #3b82f6)' },
      false: { backgroundColor: 'var(--rel-color-neutral-100, #f1f5f9)' },
    },
  },
  defaultVariants: {
    size: 'md',
    filled: false,
  },
});

// ── Circular SVG ────────────────────────────────────

export const progressCircularSvgRecipe = recipe({
  base: {
    transform: 'rotate(-90deg)',
  },
  variants: {
    size: {
      xs: { width: 24, height: 24 },
      sm: { width: 32, height: 32 },
      md: { width: 48, height: 48 },
      lg: { width: 64, height: 64 },
      xl: { width: 96, height: 96 },
    },
    indeterminate: {
      true: {
        animation: `${circularSpin} 1.4s linear infinite`,
        transform: 'none',
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      variants: { indeterminate: true },
      style: {
        transform: 'none',
      },
    },
  ],
  defaultVariants: {
    size: 'md',
    indeterminate: false,
  },
});

// ── Circular track circle ───────────────────────────

export const progressCircularTrackStyle = style({
  fill: 'none',
  stroke: 'var(--rel-color-neutral-100, #f1f5f9)',
});

// ── Circular fill circle ────────────────────────────

export const progressCircularFillStyle = style({
  fill: 'none',
  stroke: 'var(--rel-color-primary, #3b82f6)',
  strokeLinecap: 'round',
  transition: 'stroke-dashoffset 300ms ease',
});

export const progressCircularFillIndeterminateStyle = style({
  fill: 'none',
  stroke: 'var(--rel-color-primary, #3b82f6)',
  strokeLinecap: 'round',
  animation: `${circularDash} 1.4s ease-in-out infinite`,
});

// ── Label ───────────────────────────────────────────

export const progressLabelStyle = style({
  fontSize: 'var(--rel-text-sm, 13px)',
  color: 'var(--rel-color-text-secondary, #64748b)',
  lineHeight: 1,
});

// ── Value text ──────────────────────────────────────

export const progressValueStyle = style({
  fontSize: 'var(--rel-text-xs, 11px)',
  fontWeight: 600,
  color: 'var(--rel-color-text-primary, #1e293b)',
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums',
});
