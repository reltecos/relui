/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

export const rootStyle = style({ position: 'relative', overflow: 'hidden', fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)', color: 'var(--rel-color-text, #374151)', border: '1px solid var(--rel-color-border, #e5e7eb)', borderRadius: 8, backgroundColor: 'var(--rel-color-bg, #ffffff)', width: '100%', height: 500 });
export const canvasContainerStyle = style({ position: 'absolute', inset: 0 });
export const canvasElementStyle = style({ display: 'block', width: '100%', height: '100%' });
export const toolbarStyle = style({ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4, zIndex: 10 });
export const toolbarButtonStyle = style({ padding: '4px 8px', borderRadius: 4, border: '1px solid var(--rel-color-border, #e5e7eb)', backgroundColor: 'var(--rel-color-bg, #ffffff)', color: 'var(--rel-color-text, #374151)', cursor: 'pointer', fontSize: 'var(--rel-text-xs, 12px)', fontFamily: 'inherit', boxShadow: 'var(--rel-shadow-sm, 0 1px 2px rgba(0,0,0,0.05))', selectors: { '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' } } });
export const layerPanelStyle = style({ position: 'absolute', top: 8, right: 8, width: 180, maxHeight: 300, backgroundColor: 'var(--rel-color-bg, #ffffff)', border: '1px solid var(--rel-color-border, #e5e7eb)', borderRadius: 6, boxShadow: 'var(--rel-shadow-sm, 0 1px 2px rgba(0,0,0,0.05))', overflow: 'auto', zIndex: 10, padding: 4, fontSize: 'var(--rel-text-xs, 12px)' });
export const layerItemStyle = style({ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 4, cursor: 'pointer', selectors: { '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' }, '&[data-selected="true"]': { backgroundColor: 'var(--rel-color-primary-light, #dbeafe)' } } });
