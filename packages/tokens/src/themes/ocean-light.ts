/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { oceanGrayLight, tealLight, greenLight, amberLight, redLight, white } from '../primitives/colors';
import type { ThemeDefinition } from './types';

/**
 * Ocean Light tema — teal-tinted, deniz esintili light tema.
 * Ocean Light theme — teal-tinted, sea-inspired light theme.
 */
export const oceanLight: ThemeDefinition = {
  name: 'ocean',
  mode: 'light',
  colors: {
    // Background
    bgApp: oceanGrayLight[1],
    bgSubtle: oceanGrayLight[2],
    bgComponent: oceanGrayLight[3],
    bgComponentHover: oceanGrayLight[4],
    bgComponentActive: oceanGrayLight[5],
    bgOverlay: 'rgba(0, 0, 0, 0.4)',

    // Foreground
    fgDefault: oceanGrayLight[12],
    fgMuted: oceanGrayLight[11],
    fgDisabled: oceanGrayLight[8],
    fgInverse: white,

    // Border
    borderDefault: oceanGrayLight[6],
    borderHover: oceanGrayLight[7],
    borderFocus: tealLight[9],
    borderSubtle: oceanGrayLight[4],

    // Accent
    accentDefault: tealLight[9],
    accentHover: tealLight[10],
    accentActive: tealLight[8],
    accentFg: white,
    accentSubtle: tealLight[3],
    accentSubtleFg: tealLight[11],

    // Destructive
    destructiveDefault: redLight[9],
    destructiveHover: redLight[10],
    destructiveFg: white,
    destructiveSubtle: redLight[3],
    destructiveSubtleFg: redLight[11],

    // Success
    successDefault: greenLight[9],
    successHover: greenLight[10],
    successFg: white,
    successSubtle: greenLight[3],
    successSubtleFg: greenLight[11],

    // Warning
    warningDefault: amberLight[9],
    warningHover: amberLight[10],
    warningFg: oceanGrayLight[12],
    warningSubtle: amberLight[3],
    warningSubtleFg: amberLight[11],

    // Info
    infoDefault: tealLight[9],
    infoHover: tealLight[10],
    infoFg: white,
    infoSubtle: tealLight[3],
    infoSubtleFg: tealLight[11],

    // Input
    inputBg: white,
    inputBorder: oceanGrayLight[6],
    inputBorderFocus: tealLight[9],
    inputPlaceholder: oceanGrayLight[9],

    // Surface
    surfaceRaised: white,
    surfaceOverlay: white,
    surfaceSunken: oceanGrayLight[2],

    // Shadow
    shadowColor: 'rgba(0, 0, 0, 0.1)',
  },
};
