/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * AlertTriangleIcon — uyari ikonu (ucgen + unlem).
 * AlertTriangleIcon — warning icon (triangle + exclamation).
 */
export const AlertTriangleIcon = createIcon({
  displayName: 'AlertTriangleIcon',
  path: (sw) => (
    <>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeWidth={sw} />
      <line x1="12" y1="9" x2="12" y2="13" strokeWidth={sw} />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth={sw} />
    </>
  ),
});
