/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { sunriseGrayLight, orangeLight, greenLight, amberLight, redLight, white } from '../primitives/colors';
import type { ThemeDefinition } from './types';

/** Sunrise Light — sicak turuncu accent, aydinlik Relteco gorunumu. */
export const sunriseLight: ThemeDefinition = {
  name: 'sunrise',
  mode: 'light',
  colors: {
    bgApp: sunriseGrayLight[1],
    bgDefault: white,
    bgSubtle: sunriseGrayLight[2],
    bgComponent: sunriseGrayLight[3],
    bgComponentHover: sunriseGrayLight[4],
    bgComponentActive: sunriseGrayLight[5],
    bgOverlay: 'rgba(0, 0, 0, 0.4)',
    fgDefault: sunriseGrayLight[12],
    fgMuted: sunriseGrayLight[11],
    fgDisabled: sunriseGrayLight[8],
    fgInverse: white,
    borderDefault: sunriseGrayLight[6],
    borderHover: sunriseGrayLight[7],
    borderFocus: orangeLight[9],
    borderSubtle: sunriseGrayLight[4],
    accentDefault: orangeLight[9],
    accentHover: orangeLight[10],
    accentActive: orangeLight[8],
    accentFg: white,
    accentSubtle: orangeLight[3],
    accentSubtleFg: orangeLight[11],
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
    warningFg: sunriseGrayLight[12],
    warningSubtle: amberLight[3],
    warningSubtleFg: amberLight[11],
    infoDefault: orangeLight[9],
    infoHover: orangeLight[10],
    infoFg: white,
    infoSubtle: orangeLight[3],
    infoSubtleFg: orangeLight[11],
    inputBg: white,
    inputBorder: sunriseGrayLight[6],
    inputBorderFocus: orangeLight[9],
    inputPlaceholder: sunriseGrayLight[9],
    surfaceRaised: white,
    surfaceOverlay: white,
    surfaceSunken: sunriseGrayLight[2],
    shadowColor: 'rgba(0, 0, 0, 0.1)',
  },
};
