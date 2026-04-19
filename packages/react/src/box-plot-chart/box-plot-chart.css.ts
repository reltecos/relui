/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

export const rootStyle = style({ fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)', color: 'var(--rel-color-text, #374151)' });
export const boxStyle = style({ fill: 'var(--rel-color-primary-subtle, #eff6ff)', stroke: 'var(--rel-color-primary, #3b82f6)', strokeWidth: 1.5 });
export const whiskerStyle = style({ stroke: 'var(--rel-color-text-secondary, #6b7280)', strokeWidth: 1 });
export const medianStyle = style({ stroke: 'var(--rel-color-error, #ef4444)', strokeWidth: 2 });
export const outlierStyle = style({ fill: 'var(--rel-color-warning, #f59e0b)' });
export const axisStyle = style({ fontSize: 'var(--rel-text-xs, 12px)', fill: 'var(--rel-color-text-secondary, #6b7280)' });
