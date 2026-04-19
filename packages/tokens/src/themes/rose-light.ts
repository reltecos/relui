/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { roseGrayLight, roseLight, greenLight, amberLight, redLight, white } from '../primitives/colors';
import type { ThemeDefinition } from './types';

/** Rose Light — pembe accent, yumusak modern aydinlik tema. */
export const roseLightTheme: ThemeDefinition = {
  name: 'rose',
  mode: 'light',
  colors: {
    bgApp: roseGrayLight[1],
    bgDefault: white,
    bgSubtle: roseGrayLight[2],
    bgComponent: roseGrayLight[3],
    bgComponentHover: roseGrayLight[4],
    bgComponentActive: roseGrayLight[5],
    bgOverlay: 'rgba(0, 0, 0, 0.4)',
    fgDefault: roseGrayLight[12],
    fgMuted: roseGrayLight[11],
    fgDisabled: roseGrayLight[8],
    fgInverse: white,
    borderDefault: roseGrayLight[6],
    borderHover: roseGrayLight[7],
    borderFocus: roseLight[9],
    borderSubtle: roseGrayLight[4],
    accentDefault: roseLight[9],
    accentHover: roseLight[10],
    accentActive: roseLight[8],
    accentFg: white,
    accentSubtle: roseLight[3],
    accentSubtleFg: roseLight[11],
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
    warningFg: roseGrayLight[12],
    warningSubtle: amberLight[3],
    warningSubtleFg: amberLight[11],
    infoDefault: roseLight[9],
    infoHover: roseLight[10],
    infoFg: white,
    infoSubtle: roseLight[3],
    infoSubtleFg: roseLight[11],
    inputBg: white,
    inputBorder: roseGrayLight[6],
    inputBorderFocus: roseLight[9],
    inputPlaceholder: roseGrayLight[9],
    surfaceRaised: white,
    surfaceOverlay: white,
    surfaceSunken: roseGrayLight[2],
    shadowColor: 'rgba(0, 0, 0, 0.1)',
  },
};
