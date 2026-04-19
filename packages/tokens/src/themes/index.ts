/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type { ThemeDefinition, SemanticColors, ThemeName, ThemeVariant } from './types';
export { defaultDark } from './default-dark';
export { defaultLight } from './default-light';
export { oceanDark } from './ocean-dark';
export { oceanLight } from './ocean-light';
export { forestDark } from './forest-dark';
export { forestLight } from './forest-light';
export { midnightDark } from './midnight-dark';
export { midnightLight } from './midnight-light';
export { sunriseDark } from './sunrise-dark';
export { sunriseLight } from './sunrise-light';
export { slateDark } from './slate-dark';
export { slateLight } from './slate-light';
export { roseDark } from './rose-dark';
export { roseLight } from './rose-light';
export { amberDark } from './amber-dark';
export { amberLight } from './amber-light';

import { defaultDark } from './default-dark';
import { defaultLight } from './default-light';
import { oceanDark } from './ocean-dark';
import { oceanLight } from './ocean-light';
import { forestDark } from './forest-dark';
import { forestLight } from './forest-light';
import { midnightDark } from './midnight-dark';
import { midnightLight } from './midnight-light';
import { sunriseDark } from './sunrise-dark';
import { sunriseLight } from './sunrise-light';
import { slateDark } from './slate-dark';
import { slateLight } from './slate-light';
import { roseDark } from './rose-dark';
import { roseLight } from './rose-light';
import { amberDark } from './amber-dark';
import { amberLight } from './amber-light';
import type { ThemeDefinition, ThemeVariant } from './types';

/**
 * Tüm temalar / All themes registry.
 * 8 tema × 2 mod = 16 varyant.
 */
export const themes: Record<ThemeVariant, ThemeDefinition> = {
  'default-dark': defaultDark,
  'default-light': defaultLight,
  'ocean-dark': oceanDark,
  'ocean-light': oceanLight,
  'forest-dark': forestDark,
  'forest-light': forestLight,
  'midnight-dark': midnightDark,
  'midnight-light': midnightLight,
  'sunrise-dark': sunriseDark,
  'sunrise-light': sunriseLight,
  'slate-dark': slateDark,
  'slate-light': slateLight,
  'rose-dark': roseDark,
  'rose-light': roseLight,
  'amber-dark': amberDark,
  'amber-light': amberLight,
};
