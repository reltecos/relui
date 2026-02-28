/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * CheckIcon — onay işareti ikonu.
 * CheckIcon — check mark icon.
 */
export const CheckIcon = createIcon({
  displayName: 'CheckIcon',
  path: (sw) => (
    <polyline points="20 6 9 17 4 12" strokeWidth={sw} />
  ),
});
