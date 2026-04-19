/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { slateGray, violet, green, amber, red, white } from '../primitives/colors';
import type { ThemeDefinition } from './types';

/** Slate Dark — notr gri, violet accent, kurumsal premium. */
export const slateDark: ThemeDefinition = {
  name: 'slate',
  mode: 'dark',
  colors: {
    bgApp: slateGray[1],
    bgDefault: slateGray[2],
    bgSubtle: slateGray[2],
    bgComponent: slateGray[3],
    bgComponentHover: slateGray[4],
    bgComponentActive: slateGray[5],
    bgOverlay: 'rgba(0, 0, 0, 0.6)',
    fgDefault: slateGray[12],
    fgMuted: slateGray[11],
    fgDisabled: slateGray[8],
    fgInverse: slateGray[1],
    borderDefault: slateGray[6],
    borderHover: slateGray[7],
    borderFocus: violet[9],
    borderSubtle: slateGray[4],
    accentDefault: violet[9],
    accentHover: violet[10],
    accentActive: violet[8],
    accentFg: white,
    accentSubtle: violet[3],
    accentSubtleFg: violet[11],
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
    warningFg: slateGray[1],
    warningSubtle: amber[3],
    warningSubtleFg: amber[11],
    infoDefault: violet[9],
    infoHover: violet[10],
    infoFg: white,
    infoSubtle: violet[3],
    infoSubtleFg: violet[11],
    inputBg: slateGray[2],
    inputBorder: slateGray[6],
    inputBorderFocus: violet[9],
    inputPlaceholder: slateGray[9],
    surfaceRaised: slateGray[3],
    surfaceOverlay: slateGray[4],
    surfaceSunken: slateGray[1],
    shadowColor: 'rgba(0, 0, 0, 0.5)',
  },
};
