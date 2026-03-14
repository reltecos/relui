/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * ScissorsIcon — makas ikonu (kes).
 * ScissorsIcon — scissors icon (cut).
 */
export const ScissorsIcon = createIcon({
  displayName: 'ScissorsIcon',
  path: (sw) => (
    <>
      <circle cx="6" cy="6" r="3" strokeWidth={sw} />
      <circle cx="6" cy="18" r="3" strokeWidth={sw} />
      <line x1="20" y1="4" x2="8.12" y2="15.88" strokeWidth={sw} />
      <line x1="14.47" y1="14.48" x2="20" y2="20" strokeWidth={sw} />
      <line x1="8.12" y1="8.12" x2="12" y2="12" strokeWidth={sw} />
    </>
  ),
});
