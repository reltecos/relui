/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

export const rootStyle = style({ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)' });
export const fieldStyle = style({ display: 'flex', flexDirection: 'column', gap: 4 });
export const labelStyle = style({ fontSize: 'var(--rel-text-sm, 14px)', fontWeight: 500, color: 'var(--rel-color-text, #374151)' });
export const inputStyle = style({ padding: '8px 12px', border: '1px solid var(--rel-color-border, #d1d5db)', borderRadius: 6, fontSize: 'var(--rel-text-sm, 14px)', fontFamily: 'inherit', outline: 'none', backgroundColor: 'var(--rel-color-bg, #ffffff)', color: 'var(--rel-color-text, #374151)' });
export const errorStyle = style({ fontSize: 'var(--rel-text-xs, 12px)', color: 'var(--rel-color-error, #ef4444)' });
export const submitButtonStyle = style({ padding: '10px 20px', border: 'none', borderRadius: 6, backgroundColor: 'var(--rel-color-primary, #3b82f6)', color: 'var(--rel-color-bg, #ffffff)', fontWeight: 600, fontSize: 'var(--rel-text-sm, 14px)', cursor: 'pointer', fontFamily: 'inherit', ':hover': { opacity: 0.9 }, ':disabled': { opacity: 0.5, cursor: 'default' } });
