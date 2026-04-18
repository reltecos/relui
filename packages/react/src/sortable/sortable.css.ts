/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

export const rootStyle = style({ display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)' });
export const rootHorizontalStyle = style({ flexDirection: 'row' });
export const itemStyle = style({
  padding: '8px 12px', border: '1px solid var(--rel-color-border, #e5e7eb)', borderRadius: 6,
  backgroundColor: 'var(--rel-color-bg, #fff)', cursor: 'grab', userSelect: 'none',
  transition: 'box-shadow 0.15s ease',
  selectors: {
    '&[data-dragging="true"]': { opacity: 0.4 },
    '&:hover': { boxShadow: 'var(--rel-shadow-sm, 0 1px 3px rgba(0,0,0,0.1))' },
  },
});
export const placeholderStyle = style({
  padding: '8px 12px', border: '2px dashed var(--rel-color-primary, #3b82f6)',
  borderRadius: 6, backgroundColor: 'var(--rel-color-primary-subtle, #eff6ff)', minHeight: 40,
});
