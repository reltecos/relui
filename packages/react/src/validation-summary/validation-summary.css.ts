/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

// ── Root ────────────────────────────────────────────

export const validationSummaryRootStyle = style({
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  color: 'var(--rel-color-text, #374151)',
  borderRadius: 8,
  border: '1px solid var(--rel-color-danger, #ef4444)',
  backgroundColor: 'var(--rel-color-error-subtle, #fef2f2)',
  padding: 16,
});

// ── Title ───────────────────────────────────────────

export const validationSummaryTitleStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 'var(--rel-text-base, 15px)',
  fontWeight: 600,
  color: 'var(--rel-color-danger, #dc2626)',
  marginBottom: 12,
});

// ── List ────────────────────────────────────────────

export const validationSummaryListStyle = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

// ── Item ────────────────────────────────────────────

export const validationSummaryItemRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    padding: '6px 8px',
    borderRadius: 4,
    fontSize: 'var(--rel-text-sm, 13px)',
    cursor: 'pointer',
    transition: 'background-color 150ms ease',
    ':hover': {
      backgroundColor: 'var(--rel-color-bg-hover, rgba(0, 0, 0, 0.04))',
    },
  },
  variants: {
    severity: {
      error: {
        color: 'var(--rel-color-danger, #dc2626)',
      },
      warning: {
        color: 'var(--rel-color-warning, #d97706)',
      },
    },
  },
  defaultVariants: {
    severity: 'error',
  },
});

// ── Item Icon ───────────────────────────────────────

export const validationSummaryItemIconRecipe = recipe({
  base: {
    flexShrink: 0,
    width: 16,
    height: 16,
    marginTop: 1,
  },
  variants: {
    severity: {
      error: {
        color: 'var(--rel-color-danger, #dc2626)',
      },
      warning: {
        color: 'var(--rel-color-warning, #d97706)',
      },
    },
  },
  defaultVariants: {
    severity: 'error',
  },
});

// ── Item Message ────────────────────────────────────

export const validationSummaryItemMessageStyle = style({
  flex: 1,
  lineHeight: 1.4,
});
