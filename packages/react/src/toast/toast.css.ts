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

const slideInRight = keyframes({
  '0%': { transform: 'translateX(100%)', opacity: 0 },
  '100%': { transform: 'translateX(0)', opacity: 1 },
});

const slideInLeft = keyframes({
  '0%': { transform: 'translateX(-100%)', opacity: 0 },
  '100%': { transform: 'translateX(0)', opacity: 1 },
});

const slideInDown = keyframes({
  '0%': { transform: 'translateY(-100%)', opacity: 0 },
  '100%': { transform: 'translateY(0)', opacity: 1 },
});

const slideInUp = keyframes({
  '0%': { transform: 'translateY(100%)', opacity: 0 },
  '100%': { transform: 'translateY(0)', opacity: 1 },
});

// ── Container recipe ────────────────────────────────

export const toastContainerRecipe = recipe({
  base: {
    position: 'fixed' as const,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
    pointerEvents: 'none',
    maxHeight: '100vh',
    overflow: 'hidden',
  },
  variants: {
    position: {
      'top-left': { top: 16, left: 16, alignItems: 'flex-start' },
      'top-center': { top: 16, left: '50%', transform: 'translateX(-50%)', alignItems: 'center' },
      'top-right': { top: 16, right: 16, alignItems: 'flex-end' },
      'bottom-left': {
        bottom: 16,
        left: 16,
        alignItems: 'flex-start',
        flexDirection: 'column-reverse' as const,
      },
      'bottom-center': {
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        alignItems: 'center',
        flexDirection: 'column-reverse' as const,
      },
      'bottom-right': {
        bottom: 16,
        right: 16,
        alignItems: 'flex-end',
        flexDirection: 'column-reverse' as const,
      },
    },
  },
  defaultVariants: {
    position: 'top-right',
  },
});

// ── Toast item recipe ───────────────────────────────

export const toastItemRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: '12px 16px',
    borderRadius: 8,
    fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
    fontSize: 'var(--rel-text-sm, 13px)',
    lineHeight: 1.4,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08)',
    pointerEvents: 'auto',
    maxWidth: 380,
    minWidth: 280,
    position: 'relative' as const,
    overflow: 'hidden',
  },
  variants: {
    status: {
      info: {
        backgroundColor: '#eff6ff',
        borderLeft: '4px solid var(--rel-color-info, #3b82f6)',
        color: '#1e40af',
      },
      success: {
        backgroundColor: '#f0fdf4',
        borderLeft: '4px solid var(--rel-color-success, #16a34a)',
        color: '#166534',
      },
      warning: {
        backgroundColor: '#fffbeb',
        borderLeft: '4px solid var(--rel-color-warning, #f59e0b)',
        color: '#92400e',
      },
      error: {
        backgroundColor: '#fef2f2',
        borderLeft: '4px solid var(--rel-color-error, #dc2626)',
        color: '#991b1b',
      },
    },
    animation: {
      'slide-right': { animation: `${slideInRight} 300ms ease-out` },
      'slide-left': { animation: `${slideInLeft} 300ms ease-out` },
      'slide-down': { animation: `${slideInDown} 300ms ease-out` },
      'slide-up': { animation: `${slideInUp} 300ms ease-out` },
    },
  },
  defaultVariants: {
    status: 'info',
    animation: 'slide-right',
  },
});

// ── Icon ────────────────────────────────────────────

export const toastIconStyle = style({
  flexShrink: 0,
  width: 18,
  height: 18,
  marginTop: 1,
});

// ── Content ─────────────────────────────────────────

export const toastContentStyle = style({
  flex: 1,
  minWidth: 0,
});

// ── Title ───────────────────────────────────────────

export const toastTitleStyle = style({
  fontWeight: 600,
  marginBottom: 2,
});

// ── Message ─────────────────────────────────────────

export const toastMessageStyle = style({
  opacity: 0.9,
});

// ── Close button ────────────────────────────────────

export const toastCloseButtonStyle = style({
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 20,
  height: 20,
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  borderRadius: 4,
  padding: 0,
  opacity: 0.6,
  color: 'inherit',
  marginTop: 1,
  ':hover': {
    opacity: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
});

// ── Progress bar (auto-dismiss timer) ───────────────

export const toastProgressBarStyle = style({
  position: 'absolute' as const,
  bottom: 0,
  left: 0,
  height: 3,
  backgroundColor: 'currentColor',
  opacity: 0.3,
  transition: 'width 100ms linear',
});
