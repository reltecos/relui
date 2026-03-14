/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createIcon } from '../createIcon';

/**
 * MessageSquareIcon — mesaj balonu ikonu.
 * MessageSquareIcon — message bubble icon.
 */
export const MessageSquareIcon = createIcon({
  displayName: 'MessageSquareIcon',
  path: (sw) => (
    <>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth={sw} />
      <line x1="9" y1="9" x2="15" y2="9" strokeWidth={sw} />
    </>
  ),
});
