/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Checkbox styles — Vanilla Extract recipes.
 * Checkbox stilleri — Vanilla Extract recipe tabanlı.
 *
 * Hidden native input + custom visual box pattern.
 * Color scheme CSS custom property'ler üzerinden uygulanır.
 *
 * @packageDocumentation
 */

import { createVar, style, keyframes } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Local CSS Variables ──────────────────────────────────────────────

const cbBg = createVar();
const cbBgHover = createVar();
const cbFg = createVar();
const cbBorder = createVar();
const cbBorderHover = createVar();

// ── Keyframes ────────────────────────────────────────────────────────

const checkIn = keyframes({
  from: { transform: 'scale(0)', opacity: '0' },
  to: { transform: 'scale(1)', opacity: '1' },
});

// ── Disabled selector ────────────────────────────────────────────────

const NOT_DISABLED = '&:not([data-disabled])';

// ── Checkbox Control (kutucuk) Recipe ─────────────────────────────────

export const checkboxControlRecipe = recipe({
  base: {
    // Reset
    appearance: 'none',
    outline: 'none',
    margin: 0,
    cursor: 'pointer',

    // Layout
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxSizing: 'border-box',
    position: 'relative',

    // Visual
    background: 'transparent',
    border: '2px solid',
    borderColor: cbBorder,

    // Local CSS vars — tüm variant'lar tarafından kullanılır
    vars: {
      [cbBg]: cssVar.accentDefault,
      [cbBgHover]: cssVar.accentHover,
      [cbFg]: cssVar.accentFg,
      [cbBorder]: cssVar.borderDefault,
      [cbBorderHover]: cssVar.borderHover,
    },

    // Transition
    transitionProperty: 'background-color, border-color, box-shadow',
    transitionDuration: 'var(--rel-duration-fast)',
    transitionTimingFunction: 'var(--rel-ease-ease)',

    selectors: {
      // Hover
      [`${NOT_DISABLED}[data-hover]`]: {
        borderColor: cbBorderHover,
      },

      // Checked / indeterminate — dolu arka plan
      [`${NOT_DISABLED}[data-state="checked"]`]: {
        background: cbBg,
        borderColor: cbBg,
        color: cbFg,
      },

      [`${NOT_DISABLED}[data-state="indeterminate"]`]: {
        background: cbBg,
        borderColor: cbBg,
        color: cbFg,
      },

      // Checked + hover
      [`${NOT_DISABLED}[data-state="checked"][data-hover]`]: {
        background: cbBgHover,
        borderColor: cbBgHover,
      },

      [`${NOT_DISABLED}[data-state="indeterminate"][data-hover]`]: {
        background: cbBgHover,
        borderColor: cbBgHover,
      },

      // Focus ring
      [`${NOT_DISABLED}[data-focus]`]: {
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

      // Invalid — border kırmızıya
      '&[data-invalid]': {
        borderColor: cssVar.destructiveDefault,
      },

      // Invalid + focus
      '&[data-invalid][data-focus]': {
        boxShadow: `0 0 0 2px ${cssVar.bgApp}, 0 0 0 4px ${cssVar.destructiveDefault}`,
      },
    },
  },

  variants: {
    // ── Color ───────────────────────────────────────────────────

    color: {
      accent: {
        vars: {
          [cbBg]: cssVar.accentDefault,
          [cbBgHover]: cssVar.accentHover,
          [cbFg]: cssVar.accentFg,
        },
      },

      neutral: {
        vars: {
          [cbBg]: cssVar.bgComponent,
          [cbBgHover]: cssVar.bgComponentHover,
          [cbFg]: cssVar.fgDefault,
        },
      },

      destructive: {
        vars: {
          [cbBg]: cssVar.destructiveDefault,
          [cbBgHover]: cssVar.destructiveHover,
          [cbFg]: cssVar.destructiveFg,
        },
      },

      success: {
        vars: {
          [cbBg]: cssVar.successDefault,
          [cbBgHover]: cssVar.successHover,
          [cbFg]: cssVar.successFg,
        },
      },

      warning: {
        vars: {
          [cbBg]: cssVar.warningDefault,
          [cbBgHover]: cssVar.warningHover,
          [cbFg]: cssVar.warningFg,
        },
      },
    },

    // ── Size ─────────────────────────────────────────────────────

    size: {
      sm: {
        width: '0.875rem',
        height: '0.875rem',
        borderRadius: 'var(--rel-radius-xs)',
      },

      md: {
        width: '1rem',
        height: '1rem',
        borderRadius: 'var(--rel-radius-xs)',
      },

      lg: {
        width: '1.25rem',
        height: '1.25rem',
        borderRadius: 'var(--rel-radius-sm)',
      },
    },
  },

  defaultVariants: {
    color: 'accent',
    size: 'md',
  },
});

/** Checkbox recipe varyant tipleri / Checkbox recipe variant types */
export type CheckboxControlRecipeVariants = RecipeVariants<typeof checkboxControlRecipe>;

// ── Check ikon stili ─────────────────────────────────────────────────

export const checkIconStyle = style({
  display: 'block',
  color: 'currentColor',
  pointerEvents: 'none',
  animation: `${checkIn} 0.15s var(--rel-ease-ease)`,
});

// ── Checkbox label wrapper ───────────────────────────────────────────

export const checkboxLabelStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--rel-spacing-2)',
  cursor: 'pointer',
  userSelect: 'none',
  fontFamily: 'var(--rel-font-sans)',
  lineHeight: '1.5',
  color: cssVar.fgDefault,

  selectors: {
    '&[data-disabled]': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
});

// ── Hidden native input ──────────────────────────────────────────────

export const hiddenInputStyle = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
});
