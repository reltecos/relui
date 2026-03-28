/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * CopyButton styles — Button + IconButton recipe'lerini reuse eder.
 * CopyButton styles — reuses Button + IconButton recipes.
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';

// ── Root — color token for CopyButton ────────────────────────────────
export const copyButtonRootStyle = style({
  color: 'var(--rel-color-text, #374151)',
});

export { buttonRecipe } from '../button/button.css';
export { iconButtonSizeRecipe } from '../icon-button/icon-button.css';
