/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * ChevronDownIcon — aşağı ok ikonu (NumberInput decrement).
 * ChevronDownIcon — chevron down icon (NumberInput decrement).
 */
export const ChevronDownIcon = createIcon({
  displayName: 'ChevronDownIcon',
  path: (sw) => (
    <polyline points="6 9 12 15 18 9" strokeWidth={sw} />
  ),
});
