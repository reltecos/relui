/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { slateGrayLight, violetLight, greenLight, amberLight, redLight, white } from '../primitives/colors';
import type { ThemeDefinition } from './types';

/** Slate Light — notr gri, violet accent, aydinlik kurumsal. */
export const slateLight: ThemeDefinition = {
  name: 'slate',
  mode: 'light',
  colors: {
    bgApp: slateGrayLight[1],
    bgDefault: white,
    bgSubtle: slateGrayLight[2],
    bgComponent: slateGrayLight[3],
    bgComponentHover: slateGrayLight[4],
    bgComponentActive: slateGrayLight[5],
    bgOverlay: 'rgba(0, 0, 0, 0.4)',
    fgDefault: slateGrayLight[12],
    fgMuted: slateGrayLight[11],
    fgDisabled: slateGrayLight[8],
    fgInverse: white,
    borderDefault: slateGrayLight[6],
    borderHover: slateGrayLight[7],
    borderFocus: violetLight[9],
    borderSubtle: slateGrayLight[4],
    accentDefault: violetLight[9],
    accentHover: violetLight[10],
    accentActive: violetLight[8],
    accentFg: white,
    accentSubtle: violetLight[3],
    accentSubtleFg: violetLight[11],
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
    warningFg: slateGrayLight[12],
    warningSubtle: amberLight[3],
    warningSubtleFg: amberLight[11],
    infoDefault: violetLight[9],
    infoHover: violetLight[10],
    infoFg: white,
    infoSubtle: violetLight[3],
    infoSubtleFg: violetLight[11],
    inputBg: white,
    inputBorder: slateGrayLight[6],
    inputBorderFocus: violetLight[9],
    inputPlaceholder: slateGrayLight[9],
    surfaceRaised: white,
    surfaceOverlay: white,
    surfaceSunken: slateGrayLight[2],
    shadowColor: 'rgba(0, 0, 0, 0.1)',
  },
};
