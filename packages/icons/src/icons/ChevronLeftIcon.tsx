/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * ChevronLeftIcon — sol ok ikonu.
 * ChevronLeftIcon — chevron left icon.
 */
export const ChevronLeftIcon = createIcon({
  displayName: 'ChevronLeftIcon',
  path: (sw) => (
    <polyline points="15 18 9 12 15 6" strokeWidth={sw} />
  ),
});
