/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * FilePlusIcon — yeni dosya ikonu (dosya + arti isareti).
 * FilePlusIcon — new file icon (file + plus sign).
 */
export const FilePlusIcon = createIcon({
  displayName: 'FilePlusIcon',
  path: (sw) => (
    <>
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"
        strokeWidth={sw}
      />
      <polyline points="14 2 14 8 20 8" strokeWidth={sw} />
      <line x1="12" y1="18" x2="12" y2="12" strokeWidth={sw} />
      <line x1="9" y1="15" x2="15" y2="15" strokeWidth={sw} />
    </>
  ),
});
