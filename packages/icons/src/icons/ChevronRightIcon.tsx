/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * ChevronRightIcon — sağ ok ikonu.
 * ChevronRightIcon — chevron right icon.
 */
export const ChevronRightIcon = createIcon({
  displayName: 'ChevronRightIcon',
  path: (sw) => (
    <polyline points="9 18 15 12 9 6" strokeWidth={sw} />
  ),
});
