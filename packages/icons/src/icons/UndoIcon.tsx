/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * UndoIcon — geri al ikonu.
 * UndoIcon — undo icon.
 */
export const UndoIcon = createIcon({
  displayName: 'UndoIcon',
  path: (sw) => (
    <>
      <path d="M3 7v6h6" strokeWidth={sw} />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" strokeWidth={sw} />
    </>
  ),
});
