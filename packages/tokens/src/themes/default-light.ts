/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { grayLight, blueLight, greenLight, amberLight, redLight, white } from '../primitives/colors';
import type { ThemeDefinition } from './types';

/**
 * Default Light tema — temiz, modern, premium aydınlık görünüm.
 * Varsayılan light tema — clean, modern, premium bright look.
 */
export const defaultLight: ThemeDefinition = {
  name: 'default',
  mode: 'light',
  colors: {
    // Background
    bgApp: grayLight[1],
    bgDefault: white,
    bgSubtle: grayLight[2],
    bgComponent: grayLight[3],
    bgComponentHover: grayLight[4],
    bgComponentActive: grayLight[5],
    bgOverlay: 'rgba(0, 0, 0, 0.4)',

    // Foreground
    fgDefault: grayLight[12],
    fgMuted: grayLight[11],
    fgDisabled: grayLight[8],
    fgInverse: white,

    // Border
    borderDefault: grayLight[6],
    borderHover: grayLight[7],
    borderFocus: blueLight[9],
    borderSubtle: grayLight[4],

    // Accent
    accentDefault: blueLight[9],
    accentHover: blueLight[10],
    accentActive: blueLight[8],
    accentFg: white,
    accentSubtle: blueLight[3],
    accentSubtleFg: blueLight[11],

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
    warningFg: grayLight[12],
    warningSubtle: amberLight[3],
    warningSubtleFg: amberLight[11],

    // Info
    infoDefault: blueLight[9],
    infoHover: blueLight[10],
    infoFg: white,
    infoSubtle: blueLight[3],
    infoSubtleFg: blueLight[11],

    // Input
    inputBg: white,
    inputBorder: grayLight[6],
    inputBorderFocus: blueLight[9],
    inputPlaceholder: grayLight[9],

    // Surface
    surfaceRaised: white,
    surfaceOverlay: white,
    surfaceSunken: grayLight[2],

    // Shadow
    shadowColor: 'rgba(0, 0, 0, 0.1)',
  },
};
