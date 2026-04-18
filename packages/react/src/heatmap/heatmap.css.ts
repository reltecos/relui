/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

export const rootStyle = style({ display: 'inline-block', fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)' });
export const cellStyle = style({ cursor: 'pointer', transition: 'opacity 150ms ease', ':hover': { opacity: 0.8 } });
export const axisLabelStyle = style({ fontSize: 'var(--rel-text-xs, 11px)', fill: 'var(--rel-color-text-secondary, #9ca3af)' });
export const legendStyle = style({ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 'var(--rel-text-xs, 12px)', color: 'var(--rel-color-text-secondary, #9ca3af)' });
