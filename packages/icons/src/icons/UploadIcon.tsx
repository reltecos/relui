/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * UploadIcon — yukleme ikonu.
 * UploadIcon — upload icon.
 */
export const UploadIcon = createIcon({
  displayName: 'UploadIcon',
  path: (sw) => (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth={sw} />
      <polyline points="17 8 12 3 7 8" strokeWidth={sw} />
      <line x1="12" y1="3" x2="12" y2="15" strokeWidth={sw} />
    </>
  ),
});
