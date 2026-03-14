/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * CheckCircleIcon — basari ikonu (daire + onay).
 * CheckCircleIcon — success icon (circle + checkmark).
 */
export const CheckCircleIcon = createIcon({
  displayName: 'CheckCircleIcon',
  path: (sw) => (
    <>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth={sw} />
      <polyline points="22 4 12 14.01 9 11.01" strokeWidth={sw} />
    </>
  ),
});
