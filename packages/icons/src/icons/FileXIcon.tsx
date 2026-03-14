/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * FileXIcon — dosya hata ikonu (dosya + X).
 * FileXIcon — file error icon (file + X).
 */
export const FileXIcon = createIcon({
  displayName: 'FileXIcon',
  path: (sw) => (
    <>
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" strokeWidth={sw} />
      <polyline points="13 2 13 9 20 9" strokeWidth={sw} />
      <line x1="10" y1="14" x2="14" y2="18" strokeWidth={sw} />
      <line x1="14" y1="14" x2="10" y2="18" strokeWidth={sw} />
    </>
  ),
});
