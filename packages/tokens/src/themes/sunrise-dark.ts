/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { sunriseGray, orange, green, amber, red, white } from '../primitives/colors';
import type { ThemeDefinition } from './types';

/** Sunrise Dark — sicak turuncu accent, Relteco marka tonlari. */
export const sunriseDark: ThemeDefinition = {
  name: 'sunrise',
  mode: 'dark',
  colors: {
    bgApp: sunriseGray[1],
    bgDefault: sunriseGray[2],
    bgSubtle: sunriseGray[2],
    bgComponent: sunriseGray[3],
    bgComponentHover: sunriseGray[4],
    bgComponentActive: sunriseGray[5],
    bgOverlay: 'rgba(0, 0, 0, 0.6)',
    fgDefault: sunriseGray[12],
    fgMuted: sunriseGray[11],
    fgDisabled: sunriseGray[8],
    fgInverse: sunriseGray[1],
    borderDefault: sunriseGray[6],
    borderHover: sunriseGray[7],
    borderFocus: orange[9],
    borderSubtle: sunriseGray[4],
    accentDefault: orange[9],
    accentHover: orange[10],
    accentActive: orange[8],
    accentFg: white,
    accentSubtle: orange[3],
    accentSubtleFg: orange[11],
    destructiveDefault: red[9],
    destructiveHover: red[10],
    destructiveFg: white,
    destructiveSubtle: red[3],
    destructiveSubtleFg: red[11],
    successDefault: green[9],
    successHover: green[10],
    successFg: white,
    successSubtle: green[3],
    successSubtleFg: green[11],
    warningDefault: amber[9],
    warningHover: amber[10],
    warningFg: sunriseGray[1],
    warningSubtle: amber[3],
    warningSubtleFg: amber[11],
    infoDefault: orange[9],
    infoHover: orange[10],
    infoFg: white,
    infoSubtle: orange[3],
    infoSubtleFg: orange[11],
    inputBg: sunriseGray[2],
    inputBorder: sunriseGray[6],
    inputBorderFocus: orange[9],
    inputPlaceholder: sunriseGray[9],
    surfaceRaised: sunriseGray[3],
    surfaceOverlay: sunriseGray[4],
    surfaceSunken: sunriseGray[1],
    shadowColor: 'rgba(0, 0, 0, 0.5)',
  },
};
