/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Select styles — Vanilla Extract recipes.
 * Select stilleri — Vanilla Extract recipe tabanlı.
 *
 * Trigger input recipe'yi reuse eder, listbox ve option ayrı stiller.
 * Trigger reuses input recipe, listbox and option have separate styles.
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Select Root (wrapper) ───────────────────────────────────────────

export const selectRootStyle = style({
  position: 'relative',
  display: 'inline-flex',
  flexDirection: 'column',
  width: '100%',
  color: 'var(--rel-color-text, #374151)',
});

// ── Select Trigger ──────────────────────────────────────────────────

export const selectTriggerRecipe = recipe({
  base: {
    // Reset
    appearance: 'none',
    outline: 'none',
    margin: 0,
    cursor: 'pointer',
    textAlign: 'left',
    background: 'none',

    // Typography
    fontFamily: 'var(--rel-font-sans)',
    fontWeight: 'var(--rel-font-normal)',
    lineHeight: '1.5',
    color: cssVar.fgDefault,

    // Layout
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--rel-spacing-2)',
    width: '100%',
    boxSizing: 'border-box',

    // Transition
    transitionProperty: 'background-color, border-color, box-shadow',
    transitionDuration: 'var(--rel-duration-fast)',
    transitionTimingFunction: 'var(--rel-ease-ease)',

    selectors: {
      // Focus ring
      '&:focus-visible': {
        outline: 'none',
        borderColor: cssVar.accentDefault,
        boxShadow: `0 0 0 2px ${cssVar.bgApp}, 0 0 0 4px ${cssVar.borderFocus}`,
      },

      // Disabled
      '&[data-disabled]': {
        opacity: 0.5,
        cursor: 'not-allowed',
      },

      // ReadOnly
      '&[data-readonly]': {
        cursor: 'default',
      },

      // Invalid
      '&[data-invalid]': {
        borderColor: cssVar.destructiveDefault,
      },

      '&[data-invalid]:focus-visible': {
        borderColor: cssVar.destructiveDefault,
        boxShadow: `0 0 0 2px ${cssVar.bgApp}, 0 0 0 4px ${cssVar.destructiveDefault}`,
      },
    },
  },

  variants: {
    variant: {
      outline: {
        background: 'transparent',
        border: '1px solid',
        borderColor: cssVar.borderDefault,
        selectors: {
          '&:not([data-disabled]):hover': {
            borderColor: cssVar.borderHover,
          },
        },
      },

      filled: {
        background: cssVar.bgSubtle,
        border: '1px solid transparent',
        selectors: {
          '&:not([data-disabled]):hover': {
            borderColor: cssVar.borderHover,
          },
        },
      },

      flushed: {
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid',
        borderBottomColor: cssVar.borderDefault,
        borderRadius: '0 !important',
        paddingLeft: '0 !important',
        paddingRight: '0 !important',
        selectors: {
          '&:not([data-disabled]):hover': {
            borderBottomColor: cssVar.borderHover,
          },
          '&:focus-visible': {
            borderBottomColor: cssVar.accentDefault,
            boxShadow: `0 1px 0 0 ${cssVar.borderFocus}`,
          },
        },
      },
    },

    size: {
      xs: {
        height: '1.5rem',
        paddingLeft: 'var(--rel-spacing-2)',
        paddingRight: 'var(--rel-spacing-2)',
        fontSize: 'var(--rel-text-2xs)',
        borderRadius: 'var(--rel-radius-sm)',
      },

      sm: {
        height: '1.75rem',
        paddingLeft: 'var(--rel-spacing-2.5)',
        paddingRight: 'var(--rel-spacing-2.5)',
        fontSize: 'var(--rel-text-xs)',
        borderRadius: 'var(--rel-radius-sm)',
      },

      md: {
        height: '2rem',
        paddingLeft: 'var(--rel-spacing-3)',
        paddingRight: 'var(--rel-spacing-3)',
        fontSize: 'var(--rel-text-sm)',
        borderRadius: 'var(--rel-radius-md)',
      },

      lg: {
        height: '2.25rem',
        paddingLeft: 'var(--rel-spacing-4)',
        paddingRight: 'var(--rel-spacing-4)',
        fontSize: 'var(--rel-text-base)',
        borderRadius: 'var(--rel-radius-md)',
      },

      xl: {
        height: '2.5rem',
        paddingLeft: 'var(--rel-spacing-5)',
        paddingRight: 'var(--rel-spacing-5)',
        fontSize: 'var(--rel-text-lg)',
        borderRadius: 'var(--rel-radius-lg)',
      },
    },
  },

  defaultVariants: {
    variant: 'outline',
    size: 'md',
  },
});

/** Trigger recipe varyant tipleri / Trigger recipe variant types */
export type SelectTriggerRecipeVariants = RecipeVariants<typeof selectTriggerRecipe>;

// ── Trigger placeholder stili ───────────────────────────────────────

export const selectPlaceholderStyle = style({
  color: cssVar.fgMuted,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

// ── Trigger value stili ─────────────────────────────────────────────

export const selectValueStyle = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

// ── Trigger indicator (chevron) ─────────────────────────────────────

export const selectIndicatorStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  color: cssVar.fgMuted,
  transition: 'transform var(--rel-duration-fast) var(--rel-ease-ease)',
  selectors: {
    '[data-state="open"] &': {
      transform: 'rotate(180deg)',
    },
  },
});

// ── Listbox (dropdown content) ──────────────────────────────────────

export const selectListboxStyle = style({
  // Reset
  listStyle: 'none',
  margin: 0,
  padding: 'var(--rel-spacing-1) 0',

  // Position
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  zIndex: 50,
  marginTop: 'var(--rel-spacing-1)',

  // Visual
  background: cssVar.surfaceRaised,
  border: `1px solid ${cssVar.borderDefault}`,
  borderRadius: 'var(--rel-radius-md)',
  boxShadow: 'var(--rel-shadow-md, 0 4px 12px rgba(0, 0, 0, 0.12))',

  // Scroll
  maxHeight: '15rem',
  overflowY: 'auto',

  // Focus
  outline: 'none',
});

// ── Option ──────────────────────────────────────────────────────────

export const selectOptionStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--rel-spacing-2)',
  paddingLeft: 'var(--rel-spacing-3)',
  paddingRight: 'var(--rel-spacing-3)',
  paddingTop: 'var(--rel-spacing-1.5)',
  paddingBottom: 'var(--rel-spacing-1.5)',
  fontSize: 'var(--rel-text-sm)',
  lineHeight: '1.5',
  cursor: 'pointer',
  color: cssVar.fgDefault,
  transition: 'background-color var(--rel-duration-fast) var(--rel-ease-ease)',
  userSelect: 'none',

  selectors: {
    '&[data-highlighted]': {
      background: cssVar.bgSubtle,
    },

    '&[aria-selected="true"]': {
      fontWeight: 'var(--rel-font-medium)',
      color: cssVar.accentDefault,
    },

    '&[data-disabled]': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
});

// ── Option Group ────────────────────────────────────────────────────

export const selectGroupLabelStyle = style({
  paddingLeft: 'var(--rel-spacing-3)',
  paddingRight: 'var(--rel-spacing-3)',
  paddingTop: 'var(--rel-spacing-2)',
  paddingBottom: 'var(--rel-spacing-1)',
  fontSize: 'var(--rel-text-xs)',
  fontWeight: 'var(--rel-font-semibold)',
  color: cssVar.fgMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  userSelect: 'none',
});

// ── Empty state ─────────────────────────────────────────────────────

export const selectEmptyStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 'var(--rel-spacing-4)',
  fontSize: 'var(--rel-text-sm)',
  color: cssVar.fgMuted,
});
