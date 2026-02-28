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

import { defaultDark } from './default-dark';
import { defaultLight } from './default-light';
import { oceanDark } from './ocean-dark';
import { oceanLight } from './ocean-light';
import { forestDark } from './forest-dark';
import { forestLight } from './forest-light';
import type { ThemeDefinition, ThemeVariant } from './types';

/**
 * Tüm temalar / All themes registry.
 * Tema adı ile ThemeDefinition eşleştirmesi.
 */
export const themes: Record<ThemeVariant, ThemeDefinition> = {
  'default-dark': defaultDark,
  'default-light': defaultLight,
  'ocean-dark': oceanDark,
  'ocean-light': oceanLight,
  'forest-dark': forestDark,
  'forest-light': forestLight,
};
