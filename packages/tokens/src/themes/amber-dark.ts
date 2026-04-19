/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { amberGray, gold, green, amber, red, white } from '../primitives/colors';
import type { ThemeDefinition } from './types';

/** Amber Dark — altin/gold accent, sicak luks fintech karanlik tema. */
export const amberDark: ThemeDefinition = {
  name: 'amber',
  mode: 'dark',
  colors: {
    bgApp: amberGray[1],
    bgDefault: amberGray[2],
    bgSubtle: amberGray[2],
    bgComponent: amberGray[3],
    bgComponentHover: amberGray[4],
    bgComponentActive: amberGray[5],
    bgOverlay: 'rgba(0, 0, 0, 0.6)',
    fgDefault: amberGray[12],
    fgMuted: amberGray[11],
    fgDisabled: amberGray[8],
    fgInverse: amberGray[1],
    borderDefault: amberGray[6],
    borderHover: amberGray[7],
    borderFocus: gold[9],
    borderSubtle: amberGray[4],
    accentDefault: gold[9],
    accentHover: gold[10],
    accentActive: gold[8],
    accentFg: amberGray[1],
    accentSubtle: gold[3],
    accentSubtleFg: gold[11],
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
    warningFg: amberGray[1],
    warningSubtle: amber[3],
    warningSubtleFg: amber[11],
    infoDefault: gold[9],
    infoHover: gold[10],
    infoFg: amberGray[1],
    infoSubtle: gold[3],
    infoSubtleFg: gold[11],
    inputBg: amberGray[2],
    inputBorder: amberGray[6],
    inputBorderFocus: gold[9],
    inputPlaceholder: amberGray[9],
    surfaceRaised: amberGray[3],
    surfaceOverlay: amberGray[4],
    surfaceSunken: amberGray[1],
    shadowColor: 'rgba(0, 0, 0, 0.5)',
  },
};
