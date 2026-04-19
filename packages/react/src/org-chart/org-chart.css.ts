/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

export const rootStyle = style({ position: 'relative', overflow: 'hidden', fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)', color: 'var(--rel-color-text, #374151)', border: '1px solid var(--rel-color-border, #e5e7eb)', borderRadius: 8, backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)', width: '100%', height: 400 });
export const canvasStyle = style({ position: 'absolute', inset: 0, overflow: 'auto' });
export const toolbarStyle = style({ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4, zIndex: 10 });
export const toolbarButtonStyle = style({ padding: '4px 8px', borderRadius: 4, border: '1px solid var(--rel-color-border, #e5e7eb)', backgroundColor: 'var(--rel-color-bg, #ffffff)', color: 'var(--rel-color-text, #374151)', cursor: 'pointer', fontSize: 'var(--rel-text-xs, 12px)', fontFamily: 'inherit', boxShadow: 'var(--rel-shadow-sm, 0 1px 2px rgba(0,0,0,0.05))', selectors: { '&:hover': { backgroundColor: 'var(--rel-color-bg-hover, #f3f4f6)' } } });
export const nodeStyle = style({ position: 'absolute', backgroundColor: 'var(--rel-color-bg, #ffffff)', border: '1px solid var(--rel-color-border, #e5e7eb)', borderRadius: 8, boxShadow: 'var(--rel-shadow-sm, 0 1px 2px rgba(0,0,0,0.05))', padding: '8px 12px', textAlign: 'center', cursor: 'pointer', selectors: { '&[data-selected="true"]': { borderColor: 'var(--rel-color-primary, #3b82f6)', boxShadow: 'var(--rel-shadow-sm, 0 1px 2px rgba(0,0,0,0.05)), 0 0 0 2px var(--rel-color-primary-light, #93c5fd)' } } });
export const nodeAvatarStyle = style({ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--rel-color-bg-muted, #e5e7eb)', margin: '0 auto 4px' });
export const nodeNameStyle = style({ fontWeight: 600, fontSize: 'var(--rel-text-sm, 13px)', color: 'var(--rel-color-text, #374151)' });
export const nodeTitleStyle = style({ fontSize: 'var(--rel-text-xs, 11px)', color: 'var(--rel-color-text-secondary, #6b7280)' });
export const edgeSvgStyle = style({ position: 'absolute', inset: 0, pointerEvents: 'none' });
export const edgePathStyle = style({ fill: 'none', stroke: 'var(--rel-color-border, #94a3b8)', strokeWidth: 2 });
