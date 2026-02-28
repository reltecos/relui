/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * NumberInput styles — Vanilla Extract recipes.
 * NumberInput stilleri — Vanilla Extract recipe tabanlı.
 *
 * Input CSS pattern'ını temel alır, stepper butonları ekler.
 * Cross-axis ilişki yok — compoundVariants gerekmez.
 *
 * @packageDocumentation
 */

import { createVar, style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Local CSS Variables ──────────────────────────────────────────────

const niBg = createVar();
const niBorder = createVar();
const niBorderHover = createVar();
const niBorderFocus = createVar();
const niFg = createVar();
const niPlaceholder = createVar();

// ── Disabled/readonly ortak selector ─────────────────────────────────

const NOT_DISABLED = '&:not([data-disabled])';

// ── Root wrapper recipe ─────────────────────────────────────────────

export const numberInputRootRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    boxSizing: 'border-box',

    vars: {
      [niBg]: cssVar.bgSubtle,
      [niBorder]: cssVar.borderDefault,
      [niBorderHover]: cssVar.borderHover,
      [niBorderFocus]: cssVar.accentDefault,
      [niFg]: cssVar.fgDefault,
      [niPlaceholder]: cssVar.fgMuted,
    },

    transitionProperty: 'border-color, box-shadow',
    transitionDuration: 'var(--rel-duration-fast)',
    transitionTimingFunction: 'var(--rel-ease-ease)',

    selectors: {
      '&[data-disabled]': {
        opacity: 0.5,
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
      '&[data-readonly]': {
        cursor: 'default',
      },
      '&[data-invalid]': {
        borderColor: cssVar.destructiveDefault,
      },
    },
  },

  variants: {
    variant: {
      outline: {
        background: 'transparent',
        border: '1px solid',
        borderColor: niBorder,
        selectors: {
          [`${NOT_DISABLED}:hover`]: {
            borderColor: niBorderHover,
          },
          [`${NOT_DISABLED}:focus-within`]: {
            borderColor: niBorderFocus,
            boxShadow: `0 0 0 2px ${cssVar.bgApp}, 0 0 0 4px ${cssVar.borderFocus}`,
          },
          '&[data-invalid]:focus-within': {
            borderColor: cssVar.destructiveDefault,
            boxShadow: `0 0 0 2px ${cssVar.bgApp}, 0 0 0 4px ${cssVar.destructiveDefault}`,
          },
        },
      },

      filled: {
        background: niBg,
        border: '1px solid transparent',
        selectors: {
          [`${NOT_DISABLED}:hover`]: {
            background: niBg,
            borderColor: niBorderHover,
          },
          [`${NOT_DISABLED}:focus-within`]: {
            borderColor: niBorderFocus,
            boxShadow: `0 0 0 2px ${cssVar.bgApp}, 0 0 0 4px ${cssVar.borderFocus}`,
          },
          '&[data-invalid]:focus-within': {
            borderColor: cssVar.destructiveDefault,
            boxShadow: `0 0 0 2px ${cssVar.bgApp}, 0 0 0 4px ${cssVar.destructiveDefault}`,
          },
        },
      },

      flushed: {
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid',
        borderBottomColor: niBorder,
        borderRadius: '0 !important',
        selectors: {
          [`${NOT_DISABLED}:hover`]: {
            borderBottomColor: niBorderHover,
          },
          [`${NOT_DISABLED}:focus-within`]: {
            borderBottomColor: niBorderFocus,
            boxShadow: `0 1px 0 0 ${cssVar.borderFocus}`,
          },
          '&[data-invalid]:focus-within': {
            borderBottomColor: cssVar.destructiveDefault,
            boxShadow: `0 1px 0 0 ${cssVar.destructiveDefault}`,
          },
        },
      },
    },

    size: {
      xs: {
        height: '1.5rem',
        fontSize: 'var(--rel-text-2xs)',
        borderRadius: 'var(--rel-radius-sm)',
      },

      sm: {
        height: '1.75rem',
        fontSize: 'var(--rel-text-xs)',
        borderRadius: 'var(--rel-radius-sm)',
      },

      md: {
        height: '2rem',
        fontSize: 'var(--rel-text-sm)',
        borderRadius: 'var(--rel-radius-md)',
      },

      lg: {
        height: '2.25rem',
        fontSize: 'var(--rel-text-base)',
        borderRadius: 'var(--rel-radius-md)',
      },

      xl: {
        height: '2.5rem',
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

/** NumberInput root recipe varyant tipleri */
export type NumberInputRootRecipeVariants = RecipeVariants<typeof numberInputRootRecipe>;

// ── Input element stili ─────────────────────────────────────────────

export const numberInputInputStyle = style({
  appearance: 'none',
  outline: 'none',
  border: 'none',
  background: 'transparent',
  margin: 0,
  padding: 0,
  width: '100%',
  height: '100%',
  color: niFg,
  fontFamily: 'var(--rel-font-sans)',
  fontWeight: 'var(--rel-font-normal)',
  fontSize: 'inherit',
  lineHeight: '1.5',
  boxSizing: 'border-box',

  selectors: {
    '&::placeholder': {
      color: niPlaceholder,
      opacity: 1,
    },
    '&:disabled': {
      cursor: 'not-allowed',
    },
    '&[data-readonly]': {
      cursor: 'default',
    },
  },
});

// ── Stepper container ───────────────────────────────────────────────

export const numberInputStepperContainerStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  height: '100%',
  borderLeft: '1px solid',
  borderLeftColor: niBorder,
});

// ── Stepper buton stili ─────────────────────────────────────────────

export const numberInputStepperButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  appearance: 'none',
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  color: niFg,
  flex: 1,
  userSelect: 'none',
  lineHeight: 1,

  transitionProperty: 'background-color, color',
  transitionDuration: 'var(--rel-duration-fast)',
  transitionTimingFunction: 'var(--rel-ease-ease)',

  selectors: {
    '&:hover:not([data-disabled])': {
      backgroundColor: cssVar.bgComponentHover,
    },
    '&:active:not([data-disabled])': {
      backgroundColor: cssVar.bgComponent,
    },
    '&[data-disabled]': {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
  },
});

// ── Stepper divider ─────────────────────────────────────────────────

export const numberInputStepperDividerStyle = style({
  width: '100%',
  height: '1px',
  backgroundColor: niBorder,
});

// ── Size → padding map (input element için) ─────────────────────────

export const numberInputPaddingMap: Record<string, string> = {
  xs: 'var(--rel-spacing-2)',
  sm: 'var(--rel-spacing-2.5)',
  md: 'var(--rel-spacing-3)',
  lg: 'var(--rel-spacing-4)',
  xl: 'var(--rel-spacing-5)',
};

// ── Size → stepper width map ────────────────────────────────────────

export const numberInputStepperWidthMap: Record<string, string> = {
  xs: '1.25rem',
  sm: '1.5rem',
  md: '1.75rem',
  lg: '2rem',
  xl: '2.25rem',
};

// ── Size → stepper font size map ────────────────────────────────────

export const numberInputStepperFontSizeMap: Record<string, string> = {
  xs: '0.5rem',
  sm: '0.5625rem',
  md: '0.625rem',
  lg: '0.6875rem',
  xl: '0.75rem',
};
