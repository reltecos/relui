/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * ClockIcon — saat ikonu.
 * ClockIcon — clock icon.
 */
export const ClockIcon = createIcon({
  displayName: 'ClockIcon',
  path: (sw) => (
    <>
      <circle cx="12" cy="12" r="10" strokeWidth={sw} />
      <polyline points="12 6 12 12 16 14" strokeWidth={sw} />
    </>
  ),
});
