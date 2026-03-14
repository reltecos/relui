/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * FolderOpenIcon — acik klasor ikonu.
 * FolderOpenIcon — open folder icon.
 */
export const FolderOpenIcon = createIcon({
  displayName: 'FolderOpenIcon',
  path: (sw) => (
    <>
      <path
        d="M2 20V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2"
        strokeWidth={sw}
      />
      <path
        d="m21.28 13.52-1.46 5.86A2 2 0 0 1 17.88 21H4a2 2 0 0 1-2-2v-5l1.6-3.2A2 2 0 0 1 5.39 9.5h13.22a2 2 0 0 1 1.79 1.11l.88 1.76Z"
        strokeWidth={sw}
      />
    </>
  ),
});
