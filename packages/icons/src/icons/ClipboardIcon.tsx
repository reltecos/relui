/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * ClipboardIcon — pano ikonu (yapistir).
 * ClipboardIcon — clipboard icon (paste).
 */
export const ClipboardIcon = createIcon({
  displayName: 'ClipboardIcon',
  path: (sw) => (
    <>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" strokeWidth={sw} />
      <path
        d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
        strokeWidth={sw}
      />
    </>
  ),
});
