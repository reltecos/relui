/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

export const rootStyle = style({ display: 'flex', gap: 16, fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)', minHeight: 400 });
export const paletteStyle = style({ display: 'flex', flexDirection: 'column', gap: 4, padding: 12, borderRight: '1px solid var(--rel-color-border, #e5e7eb)', minWidth: 160 });
export const paletteItemStyle = style({ padding: '8px 12px', border: '1px solid var(--rel-color-border, #d1d5db)', borderRadius: 4, cursor: 'pointer', fontSize: 'var(--rel-text-sm, 14px)', backgroundColor: 'var(--rel-color-bg, #ffffff)', color: 'var(--rel-color-text, #374151)', ':hover': { backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)' } });
export const canvasStyle = style({ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, padding: 16, backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)', borderRadius: 8, minHeight: 200 });
export const canvasFieldStyle = style({ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: '1px solid var(--rel-color-border, #e5e7eb)', borderRadius: 4, backgroundColor: 'var(--rel-color-bg, #ffffff)', cursor: 'pointer', fontSize: 'var(--rel-text-sm, 14px)' });
export const canvasFieldSelectedStyle = style({ borderColor: 'var(--rel-color-primary, #3b82f6)', boxShadow: 'var(--rel-shadow-sm, 0 0 0 2px rgba(59,130,246,0.2))' });
export const fieldConfigStyle = style({ display: 'flex', flexDirection: 'column', gap: 8, padding: 12, borderLeft: '1px solid var(--rel-color-border, #e5e7eb)', minWidth: 200, fontSize: 'var(--rel-text-sm, 14px)' });
export const configLabelStyle = style({ fontSize: 'var(--rel-text-xs, 12px)', fontWeight: 500, color: 'var(--rel-color-text-secondary, #6b7280)' });
export const configInputStyle = style({ padding: '6px 8px', border: '1px solid var(--rel-color-border, #d1d5db)', borderRadius: 4, fontSize: 'var(--rel-text-sm, 14px)', fontFamily: 'inherit' });
export const moveButtonStyle = style({ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, border: '1px solid var(--rel-color-border, #d1d5db)', borderRadius: 4, backgroundColor: 'var(--rel-color-bg, #ffffff)', cursor: 'pointer', padding: 0, fontSize: 10, ':hover': { backgroundColor: 'var(--rel-color-bg-muted, #f3f4f6)' } });
export const removeButtonStyle = style({ marginLeft: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, border: 'none', borderRadius: 4, backgroundColor: 'transparent', cursor: 'pointer', padding: 0, color: 'var(--rel-color-error, #ef4444)', fontSize: 14 });
