/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * BackToTop styles — Vanilla Extract recipes.
 *
 * @packageDocumentation
 */

import { style, keyframes } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Animasyonlar ─────────────────────────────────────────────

const fadeInUp = keyframes({
  from: { opacity: 0, transform: 'translateY(8px) scale(0.95)' },
  to: { opacity: 1, transform: 'translateY(0) scale(1)' },
});

// ── Root ─────────────────────────────────────────────────────

export const bttRootRecipe = recipe({
  base: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 1000,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--rel-font-sans)',
    transition: 'background-color 120ms ease, box-shadow 120ms ease, opacity 200ms ease',
    animation: `${fadeInUp} 200ms ease-out`,
    outline: 'none',
    selectors: {
      '&:focus-visible': {
        outline: `2px solid ${cssVar.ringDefault}`,
        outlineOffset: '2px',
      },
    },
  },

  variants: {
    variant: {
      filled: {
        backgroundColor: cssVar.accentDefault,
        color: 'var(--rel-color-text-inverse, #fff)',
        boxShadow: 'var(--rel-shadow-md, 0 4px 12px rgba(0,0,0,0.15))',
        selectors: {
          '&:hover': {
            backgroundColor: cssVar.accentHover,
            boxShadow: 'var(--rel-shadow-lg, 0 6px 16px rgba(0,0,0,0.2))',
          },
        },
      },
      outline: {
        backgroundColor: cssVar.bgDefault,
        color: cssVar.fgDefault,
        border: `1px solid ${cssVar.borderDefault}`,
        boxShadow: 'var(--rel-shadow-sm, 0 2px 8px rgba(0,0,0,0.1))',
        selectors: {
          '&:hover': {
            backgroundColor: cssVar.bgComponentHover,
          },
        },
      },
      subtle: {
        backgroundColor: cssVar.bgComponent,
        color: cssVar.fgDefault,
        selectors: {
          '&:hover': {
            backgroundColor: cssVar.bgComponentHover,
          },
        },
      },
    },

    size: {
      xs: { width: '32px', height: '32px', borderRadius: '8px' },
      sm: { width: '36px', height: '36px', borderRadius: '10px' },
      md: { width: '44px', height: '44px', borderRadius: '12px' },
      lg: { width: '52px', height: '52px', borderRadius: '14px' },
      xl: { width: '60px', height: '60px', borderRadius: '16px' },
    },

    shape: {
      rounded: {},
      circle: { borderRadius: '50%' },
    },
  },

  defaultVariants: {
    variant: 'filled',
    size: 'md',
    shape: 'circle',
  },
});

export type BackToTopVariants = RecipeVariants<typeof bttRootRecipe>;

// ── Icon ────────────────────────────────────────────────────

export const bttIconStyle = style({
  width: '45%',
  height: '45%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});
