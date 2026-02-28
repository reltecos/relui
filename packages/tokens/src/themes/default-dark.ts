/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { gray, blue, green, amber, red, white } from '../primitives/colors';
import type { ThemeDefinition } from './types';

/**
 * Default Dark tema — blue-tinted gray, premium hissi.
 * Varsayılan dark tema — mavi tonlu gri, premium görünüm.
 */
export const defaultDark: ThemeDefinition = {
  name: 'default',
  mode: 'dark',
  colors: {
    // Background
    bgApp: gray[1],
    bgSubtle: gray[2],
    bgComponent: gray[3],
    bgComponentHover: gray[4],
    bgComponentActive: gray[5],
    bgOverlay: 'rgba(0, 0, 0, 0.6)',

    // Foreground
    fgDefault: gray[12],
    fgMuted: gray[11],
    fgDisabled: gray[8],
    fgInverse: gray[1],

    // Border
    borderDefault: gray[6],
    borderHover: gray[7],
    borderFocus: blue[9],
    borderSubtle: gray[4],

    // Accent
    accentDefault: blue[9],
    accentHover: blue[10],
    accentActive: blue[8],
    accentFg: white,
    accentSubtle: blue[3],
    accentSubtleFg: blue[11],

    // Destructive
    destructiveDefault: red[9],
    destructiveHover: red[10],
    destructiveFg: white,
    destructiveSubtle: red[3],
    destructiveSubtleFg: red[11],

    // Success
    successDefault: green[9],
    successHover: green[10],
    successFg: white,
    successSubtle: green[3],
    successSubtleFg: green[11],

    // Warning
    warningDefault: amber[9],
    warningHover: amber[10],
    warningFg: gray[1],
    warningSubtle: amber[3],
    warningSubtleFg: amber[11],

    // Info
    infoDefault: blue[9],
    infoHover: blue[10],
    infoFg: white,
    infoSubtle: blue[3],
    infoSubtleFg: blue[11],

    // Input
    inputBg: gray[2],
    inputBorder: gray[6],
    inputBorderFocus: blue[9],
    inputPlaceholder: gray[9],

    // Surface
    surfaceRaised: gray[3],
    surfaceOverlay: gray[4],
    surfaceSunken: gray[1],

    // Shadow
    shadowColor: 'rgba(0, 0, 0, 0.5)',
  },
};
