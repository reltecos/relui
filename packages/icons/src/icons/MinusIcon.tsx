/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * MinusIcon — eksi ikonu (checkbox indeterminate).
 * MinusIcon — minus icon (checkbox indeterminate).
 */
export const MinusIcon = createIcon({
  displayName: 'MinusIcon',
  path: (sw) => (
    <line x1="5" y1="12" x2="19" y2="12" strokeWidth={sw} />
  ),
});
