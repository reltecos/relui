/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Tabs styles — Vanilla Extract recipes.
 * Tabs stilleri — Vanilla Extract recipe tabanlı.
 *
 * 4 varyant (line, enclosed, outline, pills), 5 boyut (xs-xl),
 * horizontal + vertical yönelim desteği.
 *
 * @packageDocumentation
 */

import { createVar, style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { cssVar } from '@relteco/relui-tokens';

// ── Local CSS Variables ──────────────────────────────────────────────

const tabsBg = createVar();
const tabsFg = createVar();
const tabsActiveFg = createVar();
const tabsActiveIndicator = createVar();
const tabsHoverBg = createVar();
const tabsBorderColor = createVar();
const tabsRadius = createVar();

// ── Root container style ──────────────────────────────────────────────

export const tabsRootStyle = style({
  display: 'flex',
  flexDirection: 'column',
  vars: {
    [tabsBg]: 'transparent',
    [tabsFg]: cssVar.fgMuted,
    [tabsActiveFg]: cssVar.fgDefault,
    [tabsActiveIndicator]: cssVar.accentDefault,
    [tabsHoverBg]: cssVar.bgSubtle,
    [tabsBorderColor]: cssVar.borderDefault,
    [tabsRadius]: '6px',
  },
  selectors: {
    '&[data-orientation="vertical"]': {
      flexDirection: 'row',
    },
  },
});

// ── Tablist Recipe ──────────────────────────────────────────────────

export const tabsListRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'stretch',
    position: 'relative',
    boxSizing: 'border-box',
    fontFamily: 'var(--rel-font-sans)',
    gap: '0px',
    flexShrink: 0,
    selectors: {
      '&[data-disabled]': {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
      '&[data-orientation="horizontal"]': {
        flexDirection: 'row',
      },
      '&[data-orientation="vertical"]': {
        flexDirection: 'column',
      },
    },
  },

  variants: {
    variant: {
      line: {
        selectors: {
          '&[data-orientation="horizontal"]': {
            borderBottom: `1px solid ${tabsBorderColor}`,
          },
          '&[data-orientation="vertical"]': {
            borderRight: `1px solid ${tabsBorderColor}`,
          },
        },
      },
      enclosed: {
        selectors: {
          '&[data-orientation="horizontal"]': {
            borderBottom: `1px solid ${tabsBorderColor}`,
          },
          '&[data-orientation="vertical"]': {
            borderRight: `1px solid ${tabsBorderColor}`,
          },
        },
      },
      outline: {
        gap: '4px',
      },
      pills: {
        gap: '4px',
        backgroundColor: tabsBg,
        padding: '3px',
        borderRadius: tabsRadius,
        vars: {
          [tabsBg]: cssVar.bgSubtle,
        },
      },
    },
    size: {
      xs: {
        fontSize: '11px',
      },
      sm: {
        fontSize: '12px',
      },
      md: {
        fontSize: '13px',
      },
      lg: {
        fontSize: '14px',
      },
      xl: {
        fontSize: '15px',
      },
    },
  },

  defaultVariants: {
    variant: 'line',
    size: 'md',
  },
});

export type TabsListVariants = RecipeVariants<typeof tabsListRecipe>;

// ── Tab button style ────────────────────────────────────────────────

export const tabsTabBaseStyle = style({
  // Reset
  appearance: 'none',
  border: 'none',
  outline: 'none',
  margin: 0,
  background: 'transparent',

  // Layout
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  position: 'relative',
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',

  // Visuals
  color: tabsFg,
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'color 150ms ease, background-color 150ms ease, border-color 150ms ease',
  flexShrink: 0,

  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${cssVar.accentDefault}`,
      outlineOffset: '-2px',
      zIndex: 1,
    },
    '&[data-disabled]': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
});

// ── Variant-specific tab styles ──────────────────────────────────────

export const tabsTabLineStyle = style({
  padding: '0 16px',
  selectors: {
    '&:hover:not([data-disabled])': {
      color: tabsActiveFg,
    },
    '[data-orientation="horizontal"] &': {
      borderBottom: '2px solid transparent',
      marginBottom: '-1px',
    },
    '[data-orientation="horizontal"] &[data-state="active"]': {
      color: tabsActiveFg,
      fontWeight: '600',
      borderBottomColor: tabsActiveIndicator,
    },
    '[data-orientation="vertical"] &': {
      borderRight: '2px solid transparent',
      marginRight: '-1px',
      justifyContent: 'flex-start',
    },
    '[data-orientation="vertical"] &[data-state="active"]': {
      color: tabsActiveFg,
      fontWeight: '600',
      borderRightColor: tabsActiveIndicator,
    },
  },
});

export const tabsTabEnclosedStyle = style({
  padding: '0 16px',
  borderRadius: `${tabsRadius} ${tabsRadius} 0 0`,
  selectors: {
    '&:hover:not([data-disabled]):not([data-state="active"])': {
      backgroundColor: tabsHoverBg,
    },
    '[data-orientation="horizontal"] &': {
      marginBottom: '-1px',
      border: '1px solid transparent',
      borderBottom: 'none',
    },
    '[data-orientation="horizontal"] &[data-state="active"]': {
      color: tabsActiveFg,
      fontWeight: '600',
      backgroundColor: '#fff',
      borderColor: tabsBorderColor,
      borderBottom: '1px solid #fff',
    },
    '[data-orientation="vertical"] &': {
      marginRight: '-1px',
      border: '1px solid transparent',
      borderRight: 'none',
      borderRadius: `${tabsRadius} 0 0 ${tabsRadius}`,
      justifyContent: 'flex-start',
    },
    '[data-orientation="vertical"] &[data-state="active"]': {
      color: tabsActiveFg,
      fontWeight: '600',
      backgroundColor: '#fff',
      borderColor: tabsBorderColor,
      borderRight: '1px solid #fff',
    },
  },
});

export const tabsTabOutlineStyle = style({
  padding: '0 16px',
  borderRadius: tabsRadius,
  border: '1px solid transparent',
  selectors: {
    '&:hover:not([data-disabled]):not([data-state="active"])': {
      backgroundColor: tabsHoverBg,
    },
    '&[data-state="active"]': {
      color: tabsActiveFg,
      fontWeight: '600',
      borderColor: tabsBorderColor,
    },
    '[data-orientation="vertical"] &': {
      justifyContent: 'flex-start',
    },
  },
});

export const tabsTabPillsStyle = style({
  padding: '0 12px',
  borderRadius: `calc(${tabsRadius} - 2px)`,
  selectors: {
    '&:hover:not([data-disabled]):not([data-state="active"])': {
      backgroundColor: tabsHoverBg,
    },
    '&[data-state="active"]': {
      color: '#fff',
      fontWeight: '600',
      backgroundColor: tabsActiveIndicator,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    '[data-orientation="vertical"] &': {
      justifyContent: 'flex-start',
    },
  },
});

// ── Tab size styles ──────────────────────────────────────────────────

export const tabsSizeXs = style({ height: '28px', minWidth: '28px' });
export const tabsSizeSm = style({ height: '32px', minWidth: '32px' });
export const tabsSizeMd = style({ height: '36px', minWidth: '36px' });
export const tabsSizeLg = style({ height: '40px', minWidth: '40px' });
export const tabsSizeXl = style({ height: '44px', minWidth: '44px' });

// ── Tab close button style ────────────────────────────────────────

export const tabsCloseButtonStyle = style({
  appearance: 'none',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '3px',
  width: '16px',
  height: '16px',
  padding: 0,
  marginLeft: '4px',
  color: 'inherit',
  opacity: 0.5,
  fontSize: '10px',
  lineHeight: 1,
  transition: 'opacity 150ms ease, background-color 150ms ease',
  selectors: {
    '&:hover': {
      opacity: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
  },
});

// ── Panel style ──────────────────────────────────────────────────────

export const tabsPanelStyle = style({
  outline: 'none',
  padding: '16px 0',
  selectors: {
    '&[hidden]': {
      display: 'none',
    },
  },
});

// ── Size map helper (used by component) ──────────────────────────────

export const tabSizeMap = {
  xs: tabsSizeXs,
  sm: tabsSizeSm,
  md: tabsSizeMd,
  lg: tabsSizeLg,
  xl: tabsSizeXl,
} as const;

// ── Variant tab class map (used by component) ────────────────────────

export const tabVariantMap = {
  line: tabsTabLineStyle,
  enclosed: tabsTabEnclosedStyle,
  outline: tabsTabOutlineStyle,
  pills: tabsTabPillsStyle,
} as const;
