/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { recipe } from '@vanilla-extract/recipes';
import { style, keyframes } from '@vanilla-extract/css';

// ── Indicator animation ─────────────────────────────────

const indicatorSlide = keyframes({
  '0%': { opacity: 0, transform: 'scaleY(0)' },
  '100%': { opacity: 1, transform: 'scaleY(1)' },
});

// ── Root recipe ──────────────────────────────────────────

export const tocRootRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
    position: 'relative',
  },
  variants: {
    size: {
      xs: { fontSize: 'var(--rel-text-xs, 11px)' },
      sm: { fontSize: 'var(--rel-text-sm, 12px)' },
      md: { fontSize: 'var(--rel-text-sm, 13px)' },
      lg: { fontSize: 'var(--rel-text-base, 14px)' },
      xl: { fontSize: 'var(--rel-text-lg, 16px)' },
    },
    variant: {
      default: {
        borderLeft: '2px solid var(--rel-color-border, #e2e8f0)',
      },
      filled: {
        borderLeft: 'none',
      },
      dots: {
        borderLeft: 'none',
        paddingLeft: '12px',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

// ── Link recipe ──────────────────────────────────────────

export const tocLinkRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'var(--rel-color-text-secondary, #64748b)',
    cursor: 'pointer',
    transition: 'color 150ms ease, background-color 150ms ease',
    lineHeight: 1.5,
    borderRadius: 4,
    ':hover': {
      color: 'var(--rel-color-text, #1e293b)',
    },
  },
  variants: {
    variant: {
      default: {
        paddingLeft: '12px',
        marginLeft: '-2px',
        borderLeft: '2px solid transparent',
      },
      filled: {
        paddingLeft: '8px',
        paddingRight: '8px',
        ':hover': {
          backgroundColor: 'var(--rel-color-bg-subtle, #f1f5f9)',
        },
      },
      dots: {
        paddingLeft: '0',
      },
    },
    size: {
      xs: { padding: '2px 0', minHeight: '22px' },
      sm: { padding: '3px 0', minHeight: '26px' },
      md: { padding: '4px 0', minHeight: '30px' },
      lg: { padding: '5px 0', minHeight: '34px' },
      xl: { padding: '6px 0', minHeight: '38px' },
    },
    active: {
      true: {
        color: 'var(--rel-color-primary, #3b82f6)',
        fontWeight: 600,
      },
      false: {},
    },
    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'default',
        pointerEvents: 'none' as const,
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      variants: { variant: 'default', active: true },
      style: {
        borderLeftColor: 'var(--rel-color-primary, #3b82f6)',
      },
    },
    {
      variants: { variant: 'filled', active: true },
      style: {
        backgroundColor: 'var(--rel-color-primary-light, #eff6ff)',
      },
    },
  ],
  defaultVariants: {
    variant: 'default',
    size: 'md',
    active: false,
    disabled: false,
  },
});

// ── Indicator style (dots variant) ──────────────────────

export const tocIndicatorStyle = style({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: 'var(--rel-color-border, #cbd5e1)',
  marginRight: 10,
  flexShrink: 0,
  transition: 'background-color 150ms ease, transform 150ms ease',
});

export const tocIndicatorActiveStyle = style({
  backgroundColor: 'var(--rel-color-primary, #3b82f6)',
  transform: 'scale(1.25)',
  animation: `${indicatorSlide} 200ms ease`,
});

// ── List style ──────────────────────────────────────────

export const tocListStyle = style({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
});

// ── Item style ──────────────────────────────────────────

export const tocItemStyle = style({
  display: 'flex',
  flexDirection: 'column',
});
