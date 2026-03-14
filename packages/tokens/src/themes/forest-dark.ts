/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { forestGray, emerald, green, amber, red, white } from '../primitives/colors';
import type { ThemeDefinition } from './types';

/**
 * Forest Dark tema — green-tinted, doğa esintili dark tema.
 * Forest Dark theme — green-tinted, nature-inspired dark theme.
 */
export const forestDark: ThemeDefinition = {
  name: 'forest',
  mode: 'dark',
  colors: {
    // Background
    bgApp: forestGray[1],
    bgDefault: forestGray[2],
    bgSubtle: forestGray[2],
    bgComponent: forestGray[3],
    bgComponentHover: forestGray[4],
    bgComponentActive: forestGray[5],
    bgOverlay: 'rgba(0, 0, 0, 0.6)',

    // Foreground
    fgDefault: forestGray[12],
    fgMuted: forestGray[11],
    fgDisabled: forestGray[8],
    fgInverse: forestGray[1],

    // Border
    borderDefault: forestGray[6],
    borderHover: forestGray[7],
    borderFocus: emerald[9],
    borderSubtle: forestGray[4],

    // Accent
    accentDefault: emerald[9],
    accentHover: emerald[10],
    accentActive: emerald[8],
    accentFg: white,
    accentSubtle: emerald[3],
    accentSubtleFg: emerald[11],

    // Destructive
    destructiveDefault: red[9],
    destructiveHover: red[10],
    destructiveFg: white,
    destructiveSubtle: red[3],
    destructiveSubtleFg: red[11],

    // Success
    successDefault: green[9],
    successHover: green[10],
    successFg: white,
    successSubtle: green[3],
    successSubtleFg: green[11],

    // Warning
    warningDefault: amber[9],
    warningHover: amber[10],
    warningFg: forestGray[1],
    warningSubtle: amber[3],
    warningSubtleFg: amber[11],

    // Info
    infoDefault: emerald[9],
    infoHover: emerald[10],
    infoFg: white,
    infoSubtle: emerald[3],
    infoSubtleFg: emerald[11],

    // Input
    inputBg: forestGray[2],
    inputBorder: forestGray[6],
    inputBorderFocus: emerald[9],
    inputPlaceholder: forestGray[9],

    // Surface
    surfaceRaised: forestGray[3],
    surfaceOverlay: forestGray[4],
    surfaceSunken: forestGray[1],

    // Shadow
    shadowColor: 'rgba(0, 0, 0, 0.5)',
  },
};
