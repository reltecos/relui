/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ResponsiveBox styles — Vanilla Extract.
 * ResponsiveBox stilleri.
 *
 * ResponsiveBox, Box bilesenini extend eder. Sprinkles tabanli
 * responsive props ile calisirilir. Ek stiller buraya eklenir.
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';

/** Item stil — responsive box icindeki oge. */
export const responsiveBoxItemStyle = style({
  boxSizing: 'border-box',
});
