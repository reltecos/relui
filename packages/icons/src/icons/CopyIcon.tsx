/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * CopyIcon — kopyala/panoya kopyala ikonu.
 * CopyIcon — copy/clipboard icon.
 */
export const CopyIcon = createIcon({
  displayName: 'CopyIcon',
  path: (sw) => (
    <>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth={sw} />
      <path
        d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
        strokeWidth={sw}
      />
    </>
  ),
});
