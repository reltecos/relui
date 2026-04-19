/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { midnightGrayLight, indigoLight, greenLight, amberLight, redLight, white } from '../primitives/colors';
import type { ThemeDefinition } from './types';

/** Midnight Light — yumusak lacivert tonlu aydinlik tema. */
export const midnightLight: ThemeDefinition = {
  name: 'midnight',
  mode: 'light',
  colors: {
    bgApp: midnightGrayLight[1],
    bgDefault: white,
    bgSubtle: midnightGrayLight[2],
    bgComponent: midnightGrayLight[3],
    bgComponentHover: midnightGrayLight[4],
    bgComponentActive: midnightGrayLight[5],
    bgOverlay: 'rgba(0, 0, 0, 0.4)',
    fgDefault: midnightGrayLight[12],
    fgMuted: midnightGrayLight[11],
    fgDisabled: midnightGrayLight[8],
    fgInverse: white,
    borderDefault: midnightGrayLight[6],
    borderHover: midnightGrayLight[7],
    borderFocus: indigoLight[9],
    borderSubtle: midnightGrayLight[4],
    accentDefault: indigoLight[9],
    accentHover: indigoLight[10],
    accentActive: indigoLight[8],
    accentFg: white,
    accentSubtle: indigoLight[3],
    accentSubtleFg: indigoLight[11],
    destructiveDefault: redLight[9],
    destructiveHover: redLight[10],
    destructiveFg: white,
    destructiveSubtle: redLight[3],
    destructiveSubtleFg: redLight[11],
    successDefault: greenLight[9],
    successHover: greenLight[10],
    successFg: white,
    successSubtle: greenLight[3],
    successSubtleFg: greenLight[11],
    warningDefault: amberLight[9],
    warningHover: amberLight[10],
    warningFg: midnightGrayLight[12],
    warningSubtle: amberLight[3],
    warningSubtleFg: amberLight[11],
    infoDefault: indigoLight[9],
    infoHover: indigoLight[10],
    infoFg: white,
    infoSubtle: indigoLight[3],
    infoSubtleFg: indigoLight[11],
    inputBg: white,
    inputBorder: midnightGrayLight[6],
    inputBorderFocus: indigoLight[9],
    inputPlaceholder: midnightGrayLight[9],
    surfaceRaised: white,
    surfaceOverlay: white,
    surfaceSunken: midnightGrayLight[2],
    shadowColor: 'rgba(0, 0, 0, 0.1)',
  },
};
