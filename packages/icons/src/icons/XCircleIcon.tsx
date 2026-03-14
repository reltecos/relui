/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * XCircleIcon — hata ikonu (daire + X).
 * XCircleIcon — error icon (circle + X).
 */
export const XCircleIcon = createIcon({
  displayName: 'XCircleIcon',
  path: (sw) => (
    <>
      <circle cx="12" cy="12" r="10" strokeWidth={sw} />
      <line x1="15" y1="9" x2="9" y2="15" strokeWidth={sw} />
      <line x1="9" y1="9" x2="15" y2="15" strokeWidth={sw} />
    </>
  ),
});
