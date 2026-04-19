/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

export const rootStyle = style({ fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)', color: 'var(--rel-color-text, #374151)' });
export const barStyle = style({ transition: 'opacity 0.15s ease' });
export const targetStyle = style({ strokeWidth: 2 });
export const rangeStyle = style({ opacity: 1 });
export const labelStyle = style({ fontSize: 'var(--rel-text-xs, 12px)', fill: 'var(--rel-color-text-secondary, #6b7280)' });
export const legendStyle = style({ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8, fontSize: 'var(--rel-text-xs, 12px)' });
