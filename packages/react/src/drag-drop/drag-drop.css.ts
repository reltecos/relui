/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

export const rootStyle = style({ position: 'relative', fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)' });
export const draggableStyle = style({ cursor: 'grab', userSelect: 'none', selectors: { '&[data-dragging="true"]': { opacity: 0.5 } } });
export const droppableStyle = style({
  border: '2px dashed var(--rel-color-border, #e5e7eb)', borderRadius: 8, padding: 16, minHeight: 80,
  transition: 'border-color 0.15s ease',
  selectors: { '&[data-over="true"]': { borderColor: 'var(--rel-color-primary, #3b82f6)' } },
});
export const overlayStyle = style({ position: 'fixed', pointerEvents: 'none', zIndex: 9999, opacity: 0.8 });
