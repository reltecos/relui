/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Slider styles — Vanilla Extract recipes.
 * Slider stilleri — Vanilla Extract recipe tabanlı.
 *
 * Track + fill + thumb pattern.
 * compoundVariants ile size × orientation çapraz override.
 *
 * @packageDocumentation
 */

import { createVar, style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Local CSS Variables ──────────────────────────────────────────────

const slFill = createVar();
const slFillHover = createVar();
const slTrackBg = createVar();

// ── Disabled selector ────────────────────────────────────────────────

const NOT_DISABLED = '&:not([data-disabled])';

// ── Root wrapper ─────────────────────────────────────────────────────

export const sliderRootRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    position: 'relative',
    touchAction: 'none',
    userSelect: 'none',

    vars: {
      [slFill]: cssVar.accentDefault,
      [slFillHover]: cssVar.accentHover,
      [slTrackBg]: cssVar.bgComponentHover,
    },

    selectors: {
      '&[data-disabled]': {
        opacity: 0.5,
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },

      '&[data-readonly]': {
        cursor: 'default',
      },
    },
  },

  variants: {
    // ── Color ───────────────────────────────────────────────────

    color: {
      accent: {
        vars: {
          [slFill]: cssVar.accentDefault,
          [slFillHover]: cssVar.accentHover,
        },
      },

      neutral: {
        vars: {
          [slFill]: cssVar.bgComponent,
          [slFillHover]: cssVar.bgComponentHover,
        },
      },

      destructive: {
        vars: {
          [slFill]: cssVar.destructiveDefault,
          [slFillHover]: cssVar.destructiveHover,
        },
      },

      success: {
        vars: {
          [slFill]: cssVar.successDefault,
          [slFillHover]: cssVar.successHover,
        },
      },

      warning: {
        vars: {
          [slFill]: cssVar.warningDefault,
          [slFillHover]: cssVar.warningHover,
        },
      },
    },

    // ── Size ─────────────────────────────────────────────────────

    size: {
      sm: {
        minHeight: '1rem',
      },
      md: {
        minHeight: '1.25rem',
      },
      lg: {
        minHeight: '1.5rem',
      },
    },

    // ── Orientation ──────────────────────────────────────────────

    orientation: {
      horizontal: {
        width: '100%',
        height: 'auto',
        flexDirection: 'row',
      },

      vertical: {
        width: 'auto',
        flexDirection: 'column',
      },
    },
  },

  compoundVariants: [
    // ── Size × Orientation — boyut + yön çapraz override ─────
    // Horizontal: minHeight size'dan gelir (zaten size variant'ta set)
    // Vertical: minWidth size'dan, height sabit
    { variants: { size: 'sm', orientation: 'horizontal' }, style: { minHeight: '1rem' } },
    { variants: { size: 'md', orientation: 'horizontal' }, style: { minHeight: '1.25rem' } },
    { variants: { size: 'lg', orientation: 'horizontal' }, style: { minHeight: '1.5rem' } },
    { variants: { size: 'sm', orientation: 'vertical' }, style: { minWidth: '1rem', height: '8rem', minHeight: 'auto' } },
    { variants: { size: 'md', orientation: 'vertical' }, style: { minWidth: '1.25rem', height: '10rem', minHeight: 'auto' } },
    { variants: { size: 'lg', orientation: 'vertical' }, style: { minWidth: '1.5rem', height: '12rem', minHeight: 'auto' } },
  ],

  defaultVariants: {
    color: 'accent',
    size: 'md',
    orientation: 'horizontal',
  },
});

/** Slider root recipe varyant tipleri */
export type SliderRootRecipeVariants = RecipeVariants<typeof sliderRootRecipe>;

// ── Track (arka plan çubuk) ──────────────────────────────────────────

export const sliderTrackStyle = style({
  position: 'relative',
  borderRadius: '9999px',
  background: slTrackBg,
  overflow: 'hidden',
  flexGrow: 1,
});

export const sliderTrackHorizontalStyle = style({
  height: '4px',
  width: '100%',
});

export const sliderTrackVerticalStyle = style({
  width: '4px',
  height: '100%',
});

// ── Fill (dolu kısım) ────────────────────────────────────────────────

export const sliderFillStyle = style({
  position: 'absolute',
  borderRadius: '9999px',
  background: slFill,

  transitionProperty: 'background-color',
  transitionDuration: 'var(--rel-duration-fast)',
  transitionTimingFunction: 'var(--rel-ease-ease)',

  selectors: {
    [`${NOT_DISABLED}[data-hover] &, ${NOT_DISABLED}[data-focus] &`]: {
      background: slFillHover,
    },
  },
});

export const sliderFillHorizontalStyle = style({
  top: 0,
  left: 0,
  height: '100%',
});

export const sliderFillVerticalStyle = style({
  bottom: 0,
  left: 0,
  width: '100%',
});

// ── Thumb (tutma noktası) ────────────────────────────────────────────

export const sliderThumbRecipe = recipe({
  base: {
    position: 'absolute',
    borderRadius: '50%',
    background: '#ffffff',
    border: '2px solid',
    borderColor: slFill,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    cursor: 'grab',
    outline: 'none',

    // Transition
    transitionProperty: 'border-color, box-shadow, transform',
    transitionDuration: 'var(--rel-duration-fast)',
    transitionTimingFunction: 'var(--rel-ease-ease)',

    selectors: {
      // Hover
      [`${NOT_DISABLED}[data-hover]`]: {
        borderColor: slFillHover,
        transform: 'scale(1.1)',
      },

      // Focus
      [`${NOT_DISABLED}[data-focus]`]: {
        boxShadow: `0 0 0 2px ${cssVar.bgApp}, 0 0 0 4px ${cssVar.borderFocus}`,
      },

      // Dragging
      '&[data-state="dragging"]': {
        cursor: 'grabbing',
        transform: 'scale(1.15)',
      },

      // Disabled
      '&[data-disabled]': {
        cursor: 'not-allowed',
      },

      // Invalid
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
    size: {
      sm: {
        width: '0.875rem',
        height: '0.875rem',
      },

      md: {
        width: '1.125rem',
        height: '1.125rem',
      },

      lg: {
        width: '1.375rem',
        height: '1.375rem',
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

/** Slider thumb recipe varyant tipleri */
export type SliderThumbRecipeVariants = RecipeVariants<typeof sliderThumbRecipe>;

// ── Hidden native input ──────────────────────────────────────────────

export const hiddenSliderInputStyle = style({
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
