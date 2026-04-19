/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { midnightGray, indigo, green, amber, red, white } from '../primitives/colors';
import type { ThemeDefinition } from './types';

/** Midnight Dark — derin lacivert, IDE tarzı premium karanlik tema. */
export const midnightDark: ThemeDefinition = {
  name: 'midnight',
  mode: 'dark',
  colors: {
    bgApp: midnightGray[1],
    bgDefault: midnightGray[2],
    bgSubtle: midnightGray[2],
    bgComponent: midnightGray[3],
    bgComponentHover: midnightGray[4],
    bgComponentActive: midnightGray[5],
    bgOverlay: 'rgba(0, 0, 0, 0.6)',
    fgDefault: midnightGray[12],
    fgMuted: midnightGray[11],
    fgDisabled: midnightGray[8],
    fgInverse: midnightGray[1],
    borderDefault: midnightGray[6],
    borderHover: midnightGray[7],
    borderFocus: indigo[9],
    borderSubtle: midnightGray[4],
    accentDefault: indigo[9],
    accentHover: indigo[10],
    accentActive: indigo[8],
    accentFg: white,
    accentSubtle: indigo[3],
    accentSubtleFg: indigo[11],
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
    warningFg: midnightGray[1],
    warningSubtle: amber[3],
    warningSubtleFg: amber[11],
    infoDefault: indigo[9],
    infoHover: indigo[10],
    infoFg: white,
    infoSubtle: indigo[3],
    infoSubtleFg: indigo[11],
    inputBg: midnightGray[2],
    inputBorder: midnightGray[6],
    inputBorderFocus: indigo[9],
    inputPlaceholder: midnightGray[9],
    surfaceRaised: midnightGray[3],
    surfaceOverlay: midnightGray[4],
    surfaceSunken: midnightGray[1],
    shadowColor: 'rgba(0, 0, 0, 0.5)',
  },
};
