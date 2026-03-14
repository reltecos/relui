/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { forestGrayLight, emeraldLight, greenLight, amberLight, redLight, white } from '../primitives/colors';
import type { ThemeDefinition } from './types';

/**
 * Forest Light tema — green-tinted, doğa esintili light tema.
 * Forest Light theme — green-tinted, nature-inspired light theme.
 */
export const forestLight: ThemeDefinition = {
  name: 'forest',
  mode: 'light',
  colors: {
    // Background
    bgApp: forestGrayLight[1],
    bgDefault: white,
    bgSubtle: forestGrayLight[2],
    bgComponent: forestGrayLight[3],
    bgComponentHover: forestGrayLight[4],
    bgComponentActive: forestGrayLight[5],
    bgOverlay: 'rgba(0, 0, 0, 0.4)',

    // Foreground
    fgDefault: forestGrayLight[12],
    fgMuted: forestGrayLight[11],
    fgDisabled: forestGrayLight[8],
    fgInverse: white,

    // Border
    borderDefault: forestGrayLight[6],
    borderHover: forestGrayLight[7],
    borderFocus: emeraldLight[9],
    borderSubtle: forestGrayLight[4],

    // Accent
    accentDefault: emeraldLight[9],
    accentHover: emeraldLight[10],
    accentActive: emeraldLight[8],
    accentFg: white,
    accentSubtle: emeraldLight[3],
    accentSubtleFg: emeraldLight[11],

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
    warningFg: forestGrayLight[12],
    warningSubtle: amberLight[3],
    warningSubtleFg: amberLight[11],

    // Info
    infoDefault: emeraldLight[9],
    infoHover: emeraldLight[10],
    infoFg: white,
    infoSubtle: emeraldLight[3],
    infoSubtleFg: emeraldLight[11],

    // Input
    inputBg: white,
    inputBorder: forestGrayLight[6],
    inputBorderFocus: emeraldLight[9],
    inputPlaceholder: forestGrayLight[9],

    // Surface
    surfaceRaised: white,
    surfaceOverlay: white,
    surfaceSunken: forestGrayLight[2],

    // Shadow
    shadowColor: 'rgba(0, 0, 0, 0.1)',
  },
};
