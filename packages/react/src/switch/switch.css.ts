/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Switch styles — Vanilla Extract recipes.
 * Switch stilleri — Vanilla Extract recipe tabanlı.
 *
 * Pill şekli + kayan knob pattern.
 *
 * @packageDocumentation
 */

import { createVar, style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Local CSS Variables ──────────────────────────────────────────────

const swBg = createVar();
const swBgHover = createVar();
const swBgUnchecked = createVar();
const swBgUncheckedHover = createVar();
const swKnobColor = createVar();

// ── Disabled selector ────────────────────────────────────────────────

const NOT_DISABLED = '&:not([data-disabled])';

// ── Switch Track (pill) Recipe ───────────────────────────────────────

export const switchTrackRecipe = recipe({
  base: {
    // Reset
    appearance: 'none',
    outline: 'none',
    margin: 0,
    padding: '2px',
    cursor: 'pointer',

    // Layout
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    boxSizing: 'border-box',
    position: 'relative',
    borderRadius: '9999px',
    border: 'none',

    // Visual — unchecked
    background: swBgUnchecked,

    // Local CSS vars
    vars: {
      [swBg]: cssVar.accentDefault,
      [swBgHover]: cssVar.accentHover,
      [swBgUnchecked]: cssVar.bgComponentHover,
      [swBgUncheckedHover]: cssVar.borderDefault,
      [swKnobColor]: '#ffffff',
    },

    // Transition
    transitionProperty: 'background-color, box-shadow',
    transitionDuration: 'var(--rel-duration-fast)',
    transitionTimingFunction: 'var(--rel-ease-ease)',

    selectors: {
      // Hover — unchecked
      [`${NOT_DISABLED}[data-state="unchecked"][data-hover]`]: {
        background: swBgUncheckedHover,
      },

      // Checked — arka plan doluyor
      [`${NOT_DISABLED}[data-state="checked"]`]: {
        background: swBg,
      },

      // Checked + hover
      [`${NOT_DISABLED}[data-state="checked"][data-hover]`]: {
        background: swBgHover,
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

      // Invalid — kırmızı outline
      '&[data-invalid]': {
        boxShadow: `0 0 0 2px ${cssVar.destructiveDefault}`,
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
          [swBg]: cssVar.accentDefault,
          [swBgHover]: cssVar.accentHover,
        },
      },

      neutral: {
        vars: {
          [swBg]: cssVar.bgComponent,
          [swBgHover]: cssVar.bgComponentHover,
        },
      },

      destructive: {
        vars: {
          [swBg]: cssVar.destructiveDefault,
          [swBgHover]: cssVar.destructiveHover,
        },
      },

      success: {
        vars: {
          [swBg]: cssVar.successDefault,
          [swBgHover]: cssVar.successHover,
        },
      },

      warning: {
        vars: {
          [swBg]: cssVar.warningDefault,
          [swBgHover]: cssVar.warningHover,
        },
      },
    },

    // ── Size ─────────────────────────────────────────────────────

    size: {
      sm: {
        width: '1.75rem',
        height: '1rem',
      },

      md: {
        width: '2.25rem',
        height: '1.25rem',
      },

      lg: {
        width: '2.75rem',
        height: '1.5rem',
      },
    },
  },

  defaultVariants: {
    color: 'accent',
    size: 'md',
  },
});

/** Switch recipe varyant tipleri / Switch recipe variant types */
export type SwitchTrackRecipeVariants = RecipeVariants<typeof switchTrackRecipe>;

// ── Knob stili ───────────────────────────────────────────────────────

export const switchKnobStyle = style({
  display: 'block',
  borderRadius: '50%',
  background: swKnobColor,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',

  // Transition
  transitionProperty: 'transform',
  transitionDuration: 'var(--rel-duration-fast)',
  transitionTimingFunction: 'var(--rel-ease-ease)',

  selectors: {
    // Checked — knob sağa kayar
    '[data-state="checked"] &': {
      transform: 'translateX(100%)',
    },

    // Active — knob hafif büyür
    '[data-active] &': {
      transform: 'scale(1.1)',
    },

    // Active + checked — büyümüş ve kaymış
    '[data-state="checked"][data-active] &': {
      transform: 'translateX(100%) scale(1.1)',
    },
  },
});

// ── Switch label wrapper ─────────────────────────────────────────────

export const switchLabelStyle = style({
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

export const hiddenSwitchInputStyle = style({
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
