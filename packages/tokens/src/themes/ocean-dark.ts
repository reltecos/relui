/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { oceanGray, teal, green, amber, red, white } from '../primitives/colors';
import type { ThemeDefinition } from './types';

/**
 * Ocean Dark tema — teal-tinted, deniz esintili dark tema.
 * Ocean Dark theme — teal-tinted, sea-inspired dark theme.
 */
export const oceanDark: ThemeDefinition = {
  name: 'ocean',
  mode: 'dark',
  colors: {
    // Background
    bgApp: oceanGray[1],
    bgSubtle: oceanGray[2],
    bgComponent: oceanGray[3],
    bgComponentHover: oceanGray[4],
    bgComponentActive: oceanGray[5],
    bgOverlay: 'rgba(0, 0, 0, 0.6)',

    // Foreground
    fgDefault: oceanGray[12],
    fgMuted: oceanGray[11],
    fgDisabled: oceanGray[8],
    fgInverse: oceanGray[1],

    // Border
    borderDefault: oceanGray[6],
    borderHover: oceanGray[7],
    borderFocus: teal[9],
    borderSubtle: oceanGray[4],

    // Accent
    accentDefault: teal[9],
    accentHover: teal[10],
    accentActive: teal[8],
    accentFg: white,
    accentSubtle: teal[3],
    accentSubtleFg: teal[11],

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
    warningFg: oceanGray[1],
    warningSubtle: amber[3],
    warningSubtleFg: amber[11],

    // Info
    infoDefault: teal[9],
    infoHover: teal[10],
    infoFg: white,
    infoSubtle: teal[3],
    infoSubtleFg: teal[11],

    // Input
    inputBg: oceanGray[2],
    inputBorder: oceanGray[6],
    inputBorderFocus: teal[9],
    inputPlaceholder: oceanGray[9],

    // Surface
    surfaceRaised: oceanGray[3],
    surfaceOverlay: oceanGray[4],
    surfaceSunken: oceanGray[1],

    // Shadow
    shadowColor: 'rgba(0, 0, 0, 0.5)',
  },
};
