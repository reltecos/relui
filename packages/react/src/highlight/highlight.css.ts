/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

export const rootStyle = style({
  display: 'inline',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  color: 'inherit',
  lineHeight: 'inherit',
});

export const markStyle = style({
  backgroundColor: 'var(--rel-color-warning-subtle, #fef3c7)',
  color: 'inherit',
  borderRadius: 2,
  padding: '0 1px',
});

export const textStyle = style({});
