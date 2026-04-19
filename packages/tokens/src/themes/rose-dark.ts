/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { roseGray, rose, green, amber, red, white } from '../primitives/colors';
import type { ThemeDefinition } from './types';

/** Rose Dark — pembe accent, yumusak modern karanlik tema. */
export const roseDark: ThemeDefinition = {
  name: 'rose',
  mode: 'dark',
  colors: {
    bgApp: roseGray[1],
    bgDefault: roseGray[2],
    bgSubtle: roseGray[2],
    bgComponent: roseGray[3],
    bgComponentHover: roseGray[4],
    bgComponentActive: roseGray[5],
    bgOverlay: 'rgba(0, 0, 0, 0.6)',
    fgDefault: roseGray[12],
    fgMuted: roseGray[11],
    fgDisabled: roseGray[8],
    fgInverse: roseGray[1],
    borderDefault: roseGray[6],
    borderHover: roseGray[7],
    borderFocus: rose[9],
    borderSubtle: roseGray[4],
    accentDefault: rose[9],
    accentHover: rose[10],
    accentActive: rose[8],
    accentFg: white,
    accentSubtle: rose[3],
    accentSubtleFg: rose[11],
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
    warningFg: roseGray[1],
    warningSubtle: amber[3],
    warningSubtleFg: amber[11],
    infoDefault: rose[9],
    infoHover: rose[10],
    infoFg: white,
    infoSubtle: rose[3],
    infoSubtleFg: rose[11],
    inputBg: roseGray[2],
    inputBorder: roseGray[6],
    inputBorderFocus: rose[9],
    inputPlaceholder: roseGray[9],
    surfaceRaised: roseGray[3],
    surfaceOverlay: roseGray[4],
    surfaceSunken: roseGray[1],
    shadowColor: 'rgba(0, 0, 0, 0.5)',
  },
};
