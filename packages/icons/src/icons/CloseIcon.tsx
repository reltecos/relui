/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * CloseIcon — kapatma/kaldırma ikonu (Tag/Chip remove).
 * CloseIcon — close/remove icon (Tag/Chip remove).
 */
export const CloseIcon = createIcon({
  displayName: 'CloseIcon',
  path: (sw) => (
    <>
      <line x1="18" y1="6" x2="6" y2="18" strokeWidth={sw} />
      <line x1="6" y1="6" x2="18" y2="18" strokeWidth={sw} />
    </>
  ),
});
