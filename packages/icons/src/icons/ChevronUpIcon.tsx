/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * ChevronUpIcon — yukarı ok ikonu (NumberInput increment).
 * ChevronUpIcon — chevron up icon (NumberInput increment).
 */
export const ChevronUpIcon = createIcon({
  displayName: 'ChevronUpIcon',
  path: (sw) => (
    <polyline points="18 15 12 9 6 15" strokeWidth={sw} />
  ),
});
