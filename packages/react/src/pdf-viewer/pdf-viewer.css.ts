/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

export const rootStyle = style({ display: 'flex', flexDirection: 'column', fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)', border: '1px solid var(--rel-color-border, #e5e7eb)', borderRadius: 8, overflow: 'hidden', backgroundColor: 'var(--rel-color-bg, #ffffff)' });
export const toolbarStyle = style({ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderBottom: '1px solid var(--rel-color-border, #e5e7eb)', backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)', fontSize: 'var(--rel-text-sm, 14px)' });
export const navButtonStyle = style({ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, border: '1px solid var(--rel-color-border, #d1d5db)', borderRadius: 4, backgroundColor: 'var(--rel-color-bg, #ffffff)', cursor: 'pointer', padding: 0, ':hover': { backgroundColor: 'var(--rel-color-bg-muted, #f3f4f6)' }, ':disabled': { opacity: 0.4, cursor: 'default' } });
export const pageInfoStyle = style({ fontSize: 'var(--rel-text-sm, 14px)', color: 'var(--rel-color-text, #374151)', fontVariantNumeric: 'tabular-nums' });
export const pageDisplayStyle = style({ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: 'var(--rel-color-bg-muted, #f3f4f6)', minHeight: 400, overflow: 'auto' });
export const zoomControlsStyle = style({ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' });
export const zoomButtonStyle = style({ padding: '4px 8px', border: '1px solid var(--rel-color-border, #d1d5db)', borderRadius: 4, backgroundColor: 'var(--rel-color-bg, #ffffff)', cursor: 'pointer', fontSize: 'var(--rel-text-xs, 12px)', fontFamily: 'inherit', ':hover': { backgroundColor: 'var(--rel-color-bg-muted, #f3f4f6)' } });
