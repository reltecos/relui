/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * SearchIcon — arama ikonu.
 * SearchIcon — search icon.
 */
export const SearchIcon = createIcon({
  displayName: 'SearchIcon',
  path: (sw) => (
    <>
      <circle cx="11" cy="11" r="8" strokeWidth={sw} />
      <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth={sw} />
    </>
  ),
});
