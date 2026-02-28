/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * EyeIcon — göz ikonu (şifre göster).
 * EyeIcon — eye icon (show password).
 */
export const EyeIcon = createIcon({
  displayName: 'EyeIcon',
  path: (sw) => (
    <>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth={sw} />
      <circle cx="12" cy="12" r="3" strokeWidth={sw} />
    </>
  ),
});
