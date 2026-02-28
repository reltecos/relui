/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Button styles — Vanilla Extract recipes.
 * Button stilleri — Vanilla Extract recipe tabanlı.
 *
 * Renk şeması CSS custom property'ler üzerinden uygulanır.
 * Color scheme is applied via CSS custom properties.
 *
 * @packageDocumentation
 */

import { createVar, keyframes, style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Local CSS Variables (color scheme tarafından set edilir) ─────────────

const btnBg = createVar();
const btnBgHover = createVar();
const btnBgActive = createVar();
const btnFg = createVar();
const btnSubtleBg = createVar();
const btnSubtleFg = createVar();
const btnBorder = createVar();

// ── Keyframes ──────────────────────────────────────────────────────────

const spin = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

// ── Disabled/loading ortak selector ────────────────────────────────────

const NOT_DISABLED = '&:not([data-disabled]):not([data-loading])';

// ── Button Recipe ──────────────────────────────────────────────────────

export const buttonRecipe = recipe({
  base: {
    // Reset
    appearance: 'none',
    background: 'none',
    border: '1px solid transparent',
    outline: 'none',
    textDecoration: 'none',
    cursor: 'pointer',
    userSelect: 'none',

    // Typography
    fontFamily: 'var(--rel-font-sans)',
    fontWeight: 'var(--rel-font-medium)',
    lineHeight: '1',
    whiteSpace: 'nowrap',

    // Layout
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--rel-spacing-2)',
    boxSizing: 'border-box',
    position: 'relative',
    verticalAlign: 'middle',

    // Transition
    transitionProperty: 'background-color, color, border-color, box-shadow, transform, opacity',
    transitionDuration: 'var(--rel-duration-fast)',
    transitionTimingFunction: 'var(--rel-ease-ease)',

    selectors: {
      // Focus ring (çift halka — iç: app bg, dış: focus renk)
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 2px ${cssVar.bgApp}, 0 0 0 4px ${cssVar.borderFocus}`,
      },

      // Disabled durumu
      '&[data-disabled]': {
        opacity: 0.5,
        cursor: 'not-allowed',
      },

      // Loading durumu
      '&[data-loading]': {
        cursor: 'wait',
      },
    },
  },

  variants: {
    // ── Variant ──────────────────────────────────────────────────

    variant: {
      solid: {
        background: btnBg,
        color: btnFg,
        selectors: {
          [`${NOT_DISABLED}:hover`]: {
            background: btnBgHover,
          },
          [`${NOT_DISABLED}:active`]: {
            background: btnBgActive,
            transform: 'scale(0.98)',
          },
        },
      },

      outline: {
        background: 'transparent',
        color: btnSubtleFg,
        borderColor: btnBorder,
        selectors: {
          [`${NOT_DISABLED}:hover`]: {
            background: btnSubtleBg,
          },
          [`${NOT_DISABLED}:active`]: {
            background: btnSubtleBg,
            transform: 'scale(0.98)',
          },
        },
      },

      ghost: {
        background: 'transparent',
        color: btnSubtleFg,
        selectors: {
          [`${NOT_DISABLED}:hover`]: {
            background: btnSubtleBg,
          },
          [`${NOT_DISABLED}:active`]: {
            background: btnSubtleBg,
            transform: 'scale(0.98)',
          },
        },
      },

      soft: {
        background: btnSubtleBg,
        color: btnSubtleFg,
        selectors: {
          [`${NOT_DISABLED}:hover`]: {
            borderColor: btnBorder,
          },
          [`${NOT_DISABLED}:active`]: {
            borderColor: btnBorder,
            transform: 'scale(0.98)',
          },
        },
      },

      link: {
        background: 'transparent',
        color: btnSubtleFg,
        border: 'none',
        textDecoration: 'underline',
        textUnderlineOffset: '0.2em',
        selectors: {
          [`${NOT_DISABLED}:hover`]: {
            opacity: '0.8',
          },
          [`${NOT_DISABLED}:active`]: {
            opacity: '0.7',
          },
        },
      },
    },

    // ── Color ───────────────────────────────────────────────────

    color: {
      accent: {
        vars: {
          [btnBg]: cssVar.accentDefault,
          [btnBgHover]: cssVar.accentHover,
          [btnBgActive]: cssVar.accentActive,
          [btnFg]: cssVar.accentFg,
          [btnSubtleBg]: cssVar.accentSubtle,
          [btnSubtleFg]: cssVar.accentSubtleFg,
          [btnBorder]: cssVar.accentDefault,
        },
      },

      neutral: {
        vars: {
          [btnBg]: cssVar.bgComponent,
          [btnBgHover]: cssVar.bgComponentHover,
          [btnBgActive]: cssVar.bgComponentActive,
          [btnFg]: cssVar.fgDefault,
          [btnSubtleBg]: cssVar.bgSubtle,
          [btnSubtleFg]: cssVar.fgDefault,
          [btnBorder]: cssVar.borderDefault,
        },
      },

      destructive: {
        vars: {
          [btnBg]: cssVar.destructiveDefault,
          [btnBgHover]: cssVar.destructiveHover,
          [btnBgActive]: cssVar.destructiveHover,
          [btnFg]: cssVar.destructiveFg,
          [btnSubtleBg]: cssVar.destructiveSubtle,
          [btnSubtleFg]: cssVar.destructiveSubtleFg,
          [btnBorder]: cssVar.destructiveDefault,
        },
      },

      success: {
        vars: {
          [btnBg]: cssVar.successDefault,
          [btnBgHover]: cssVar.successHover,
          [btnBgActive]: cssVar.successHover,
          [btnFg]: cssVar.successFg,
          [btnSubtleBg]: cssVar.successSubtle,
          [btnSubtleFg]: cssVar.successSubtleFg,
          [btnBorder]: cssVar.successDefault,
        },
      },

      warning: {
        vars: {
          [btnBg]: cssVar.warningDefault,
          [btnBgHover]: cssVar.warningHover,
          [btnBgActive]: cssVar.warningHover,
          [btnFg]: cssVar.warningFg,
          [btnSubtleBg]: cssVar.warningSubtle,
          [btnSubtleFg]: cssVar.warningSubtleFg,
          [btnBorder]: cssVar.warningDefault,
        },
      },
    },

    // ── Size ────────────────────────────────────────────────────

    size: {
      xs: {
        height: '1.5rem',
        paddingLeft: 'var(--rel-spacing-2)',
        paddingRight: 'var(--rel-spacing-2)',
        fontSize: 'var(--rel-text-2xs)',
        borderRadius: 'var(--rel-radius-sm)',
        gap: 'var(--rel-spacing-1)',
      },

      sm: {
        height: '1.75rem',
        paddingLeft: 'var(--rel-spacing-2.5)',
        paddingRight: 'var(--rel-spacing-2.5)',
        fontSize: 'var(--rel-text-xs)',
        borderRadius: 'var(--rel-radius-sm)',
        gap: 'var(--rel-spacing-1)',
      },

      md: {
        height: '2rem',
        paddingLeft: 'var(--rel-spacing-3)',
        paddingRight: 'var(--rel-spacing-3)',
        fontSize: 'var(--rel-text-sm)',
        borderRadius: 'var(--rel-radius-md)',
        gap: 'var(--rel-spacing-1.5)',
      },

      lg: {
        height: '2.25rem',
        paddingLeft: 'var(--rel-spacing-4)',
        paddingRight: 'var(--rel-spacing-4)',
        fontSize: 'var(--rel-text-base)',
        borderRadius: 'var(--rel-radius-md)',
        gap: 'var(--rel-spacing-2)',
      },

      xl: {
        height: '2.5rem',
        paddingLeft: 'var(--rel-spacing-5)',
        paddingRight: 'var(--rel-spacing-5)',
        fontSize: 'var(--rel-text-lg)',
        borderRadius: 'var(--rel-radius-lg)',
        gap: 'var(--rel-spacing-2)',
      },
    },

    // ── Full Width ──────────────────────────────────────────────

    fullWidth: {
      true: {
        width: '100%',
      },
    },
  },

  // Link variant boyut override'ları
  compoundVariants: [
    {
      variants: { variant: 'link' },
      style: {
        height: 'auto',
        paddingLeft: 0,
        paddingRight: 0,
        borderRadius: 0,
      },
    },
  ],

  defaultVariants: {
    variant: 'solid',
    color: 'accent',
    size: 'md',
  },
});

/** Button recipe varyant tipleri / Button recipe variant types */
export type ButtonRecipeVariants = RecipeVariants<typeof buttonRecipe>;

// ── Spinner stili ──────────────────────────────────────────────────────

export const spinnerStyle = style({
  display: 'inline-block',
  width: '1em',
  height: '1em',
  borderWidth: '2px',
  borderStyle: 'solid',
  borderColor: 'currentColor',
  borderRightColor: 'transparent',
  borderRadius: '50%',
  animation: `${spin} 0.6s linear infinite`,
  flexShrink: 0,
});

// ── Icon wrapper stili ─────────────────────────────────────────────────

export const iconStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1em',
  height: '1em',
  fontSize: '1.2em',
  flexShrink: 0,
});
