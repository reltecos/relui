/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Radio styles — Vanilla Extract recipes.
 * Radio stilleri — Vanilla Extract recipe tabanlı.
 *
 * Checkbox ile aynı local CSS vars pattern, yuvarlak kontrol.
 *
 * @packageDocumentation
 */

import { createVar, style, keyframes } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Local CSS Variables ──────────────────────────────────────────────

const rdBg = createVar();
const rdBgHover = createVar();
const rdFg = createVar();
const rdBorder = createVar();
const rdBorderHover = createVar();

// ── Keyframes ────────────────────────────────────────────────────────

const dotIn = keyframes({
  from: { transform: 'scale(0)', opacity: '0' },
  to: { transform: 'scale(1)', opacity: '1' },
});

// ── Disabled selector ────────────────────────────────────────────────

const NOT_DISABLED = '&:not([data-disabled])';

// ── Radio Control (daire) Recipe ─────────────────────────────────────

export const radioControlRecipe = recipe({
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
    borderRadius: '50%',

    // Visual
    background: 'transparent',
    border: '2px solid',
    borderColor: rdBorder,

    // Local CSS vars
    vars: {
      [rdBg]: cssVar.accentDefault,
      [rdBgHover]: cssVar.accentHover,
      [rdFg]: cssVar.accentFg,
      [rdBorder]: cssVar.borderDefault,
      [rdBorderHover]: cssVar.borderHover,
    },

    // Transition
    transitionProperty: 'background-color, border-color, box-shadow',
    transitionDuration: 'var(--rel-duration-fast)',
    transitionTimingFunction: 'var(--rel-ease-ease)',

    selectors: {
      // Hover
      [`${NOT_DISABLED}[data-hover]`]: {
        borderColor: rdBorderHover,
      },

      // Checked — dolu border
      [`${NOT_DISABLED}[data-state="checked"]`]: {
        borderColor: rdBg,
      },

      // Checked + hover
      [`${NOT_DISABLED}[data-state="checked"][data-hover]`]: {
        borderColor: rdBgHover,
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
          [rdBg]: cssVar.accentDefault,
          [rdBgHover]: cssVar.accentHover,
          [rdFg]: cssVar.accentFg,
        },
      },

      neutral: {
        vars: {
          [rdBg]: cssVar.bgComponent,
          [rdBgHover]: cssVar.bgComponentHover,
          [rdFg]: cssVar.fgDefault,
        },
      },

      destructive: {
        vars: {
          [rdBg]: cssVar.destructiveDefault,
          [rdBgHover]: cssVar.destructiveHover,
          [rdFg]: cssVar.destructiveFg,
        },
      },

      success: {
        vars: {
          [rdBg]: cssVar.successDefault,
          [rdBgHover]: cssVar.successHover,
          [rdFg]: cssVar.successFg,
        },
      },

      warning: {
        vars: {
          [rdBg]: cssVar.warningDefault,
          [rdBgHover]: cssVar.warningHover,
          [rdFg]: cssVar.warningFg,
        },
      },
    },

    // ── Size ─────────────────────────────────────────────────────

    size: {
      sm: {
        width: '0.875rem',
        height: '0.875rem',
      },

      md: {
        width: '1rem',
        height: '1rem',
      },

      lg: {
        width: '1.25rem',
        height: '1.25rem',
      },
    },
  },

  defaultVariants: {
    color: 'accent',
    size: 'md',
  },
});

/** Radio recipe varyant tipleri / Radio recipe variant types */
export type RadioControlRecipeVariants = RecipeVariants<typeof radioControlRecipe>;

// ── Inner dot stili ──────────────────────────────────────────────────

export const radioDotStyle = style({
  display: 'block',
  borderRadius: '50%',
  background: 'currentColor',
  animation: `${dotIn} 0.15s var(--rel-ease-ease)`,
});

// ── Radio label wrapper ──────────────────────────────────────────────

export const radioLabelStyle = style({
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

export const hiddenRadioInputStyle = style({
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
