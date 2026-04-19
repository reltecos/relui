/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

export const rootStyle = style({ position: 'relative', overflow: 'hidden', fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)', color: 'var(--rel-color-text, #374151)', border: '1px solid var(--rel-color-border, #e5e7eb)', borderRadius: 8, backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)', width: '100%', height: 500 });
export const canvasStyle = style({ position: 'absolute', inset: 0, overflow: 'hidden' });
export const toolbarStyle = style({ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4, zIndex: 10 });
export const toolbarButtonStyle = style({ padding: '4px 8px', borderRadius: 4, border: '1px solid var(--rel-color-border, #e5e7eb)', backgroundColor: 'var(--rel-color-bg, #ffffff)', color: 'var(--rel-color-text, #374151)', cursor: 'pointer', fontSize: 'var(--rel-text-xs, 12px)', fontFamily: 'inherit', boxShadow: 'var(--rel-shadow-sm, 0 1px 2px rgba(0,0,0,0.05))', selectors: { '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' } } });
export const nodeStyle = style({ position: 'absolute', backgroundColor: 'var(--rel-color-bg, #ffffff)', border: '2px solid var(--rel-color-border, #d1d5db)', borderRadius: 8, padding: '8px 16px', textAlign: 'center', cursor: 'pointer', fontSize: 'var(--rel-text-sm, 13px)', fontWeight: 500, selectors: { '&[data-selected="true"]': { borderColor: 'var(--rel-color-primary, #3b82f6)' }, '&[data-type="decision"]': { borderRadius: 0, transform: 'rotate(45deg)' }, '&[data-type="start"], &[data-type="end"]': { borderRadius: 20 } } });
export const svgLayerStyle = style({ position: 'absolute', inset: 0, pointerEvents: 'none' });
export const edgeStyle = style({ fill: 'none', stroke: 'var(--rel-color-border, #94a3b8)', strokeWidth: 2 });
export const minimapStyle = style({ position: 'absolute', bottom: 8, right: 8, width: 150, height: 100, backgroundColor: 'var(--rel-color-bg, #ffffff)', border: '1px solid var(--rel-color-border, #e5e7eb)', borderRadius: 6, boxShadow: 'var(--rel-shadow-sm, 0 1px 2px rgba(0,0,0,0.05))', overflow: 'hidden', zIndex: 10 });
