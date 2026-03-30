/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * CalendarIcon — takvim ikonu.
 * CalendarIcon — calendar icon.
 */
export const CalendarIcon = createIcon({
  displayName: 'CalendarIcon',
  path: (sw) => (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={sw} />
      <line x1="16" y1="2" x2="16" y2="6" strokeWidth={sw} />
      <line x1="8" y1="2" x2="8" y2="6" strokeWidth={sw} />
      <line x1="3" y1="10" x2="21" y2="10" strokeWidth={sw} />
    </>
  ),
});
