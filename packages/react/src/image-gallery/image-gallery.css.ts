/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

export const rootStyle = style({ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)' });
export const gridStyle = style({ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 });
export const gridItemStyle = style({ cursor: 'pointer', borderRadius: 6, overflow: 'hidden', border: '2px solid transparent', transition: 'border-color 0.15s ease', selectors: { '&[data-active="true"]': { borderColor: 'var(--rel-color-primary, #3b82f6)' }, '&:hover': { borderColor: 'var(--rel-color-border, #d1d5db)' } } });
export const gridImgStyle = style({ width: '100%', height: 100, objectFit: 'cover', display: 'block' });
export const lightboxStyle = style({ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.85)' });
export const lightboxImgStyle = style({ maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain' });
export const navButtonStyle = style({ position: 'absolute', top: '50%', transform: 'translateY(-50%)', padding: '12px 16px', fontSize: 24, border: 'none', backgroundColor: 'rgba(255,255,255,0.15)', cursor: 'pointer', borderRadius: 8, lineHeight: 1, selectors: { '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' } } });
export const navPrevStyle = style({ left: 16 });
export const navNextStyle = style({ right: 16 });
export const thumbnailStripStyle = style({ display: 'flex', gap: 4, justifyContent: 'center', overflowX: 'auto', padding: '8px 0' });
export const thumbnailStyle = style({ width: 48, height: 48, objectFit: 'cover', borderRadius: 4, cursor: 'pointer', border: '2px solid transparent', opacity: 0.7, transition: 'opacity 0.15s ease, border-color 0.15s ease', selectors: { '&[data-active="true"]': { borderColor: 'var(--rel-color-primary, #3b82f6)', opacity: 1 } } });
