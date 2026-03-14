/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * SaveIcon — kaydet ikonu (disket).
 * SaveIcon — save icon (floppy disk).
 */
export const SaveIcon = createIcon({
  displayName: 'SaveIcon',
  path: (sw) => (
    <>
      <path
        d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"
        strokeWidth={sw}
      />
      <polyline points="17 21 17 13 7 13 7 21" strokeWidth={sw} />
      <polyline points="7 3 7 8 15 8" strokeWidth={sw} />
    </>
  ),
});
