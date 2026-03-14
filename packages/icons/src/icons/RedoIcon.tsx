/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * RedoIcon — yinele ikonu.
 * RedoIcon — redo icon.
 */
export const RedoIcon = createIcon({
  displayName: 'RedoIcon',
  path: (sw) => (
    <>
      <path d="M21 7v6h-6" strokeWidth={sw} />
      <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" strokeWidth={sw} />
    </>
  ),
});
