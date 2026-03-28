/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

// ── Root ────────────────────────────────────────────

/** AspectRatio root base stili. */
export const rootStyle = style({
  position: 'relative',
  overflow: 'hidden',
  color: 'var(--rel-color-text, #374151)',
});
