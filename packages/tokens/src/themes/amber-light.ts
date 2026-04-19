/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { amberGrayLight, goldLight, greenLight, amberLight, redLight, white } from '../primitives/colors';
import type { ThemeDefinition } from './types';

/** Amber Light — altin/gold accent, sicak luks aydinlik tema. */
export const amberLight: ThemeDefinition = {
  name: 'amber',
  mode: 'light',
  colors: {
    bgApp: amberGrayLight[1],
    bgDefault: white,
    bgSubtle: amberGrayLight[2],
    bgComponent: amberGrayLight[3],
    bgComponentHover: amberGrayLight[4],
    bgComponentActive: amberGrayLight[5],
    bgOverlay: 'rgba(0, 0, 0, 0.4)',
    fgDefault: amberGrayLight[12],
    fgMuted: amberGrayLight[11],
    fgDisabled: amberGrayLight[8],
    fgInverse: white,
    borderDefault: amberGrayLight[6],
    borderHover: amberGrayLight[7],
    borderFocus: goldLight[9],
    borderSubtle: amberGrayLight[4],
    accentDefault: goldLight[9],
    accentHover: goldLight[10],
    accentActive: goldLight[8],
    accentFg: white,
    accentSubtle: goldLight[3],
    accentSubtleFg: goldLight[11],
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
    warningFg: amberGrayLight[12],
    warningSubtle: amberLight[3],
    warningSubtleFg: amberLight[11],
    infoDefault: goldLight[9],
    infoHover: goldLight[10],
    infoFg: white,
    infoSubtle: goldLight[3],
    infoSubtleFg: goldLight[11],
    inputBg: white,
    inputBorder: amberGrayLight[6],
    inputBorderFocus: goldLight[9],
    inputPlaceholder: amberGrayLight[9],
    surfaceRaised: white,
    surfaceOverlay: white,
    surfaceSunken: amberGrayLight[2],
    shadowColor: 'rgba(0, 0, 0, 0.1)',
  },
};
