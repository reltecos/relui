/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * InfoCircleIcon — bilgi ikonu (daire + i).
 * InfoCircleIcon — info icon (circle + i).
 */
export const InfoCircleIcon = createIcon({
  displayName: 'InfoCircleIcon',
  path: (sw) => (
    <>
      <circle cx="12" cy="12" r="10" strokeWidth={sw} />
      <line x1="12" y1="16" x2="12" y2="12" strokeWidth={sw} />
      <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth={sw} />
    </>
  ),
});
