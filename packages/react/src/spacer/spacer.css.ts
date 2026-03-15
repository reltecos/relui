/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

// ── Root (flex spacer) ──────────────────────────────

/** Spacer root base stili. Varsayilan flex: 1 ile bosluk doldurur. */
export const rootFlexStyle = style({
  flex: 1,
});

/** Spacer fixed size stili. flex: none ile sabit boyut. */
export const rootFixedStyle = style({
  flexShrink: 0,
});
