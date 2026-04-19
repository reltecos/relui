/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

export const rootStyle = style({ display: 'flex', flexDirection: 'column', gap: 8, padding: 12, borderRadius: 8, backgroundColor: 'var(--rel-color-bg, #ffffff)', border: '1px solid var(--rel-color-border, #e5e7eb)', fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)' });
export const controlsStyle = style({ display: 'flex', alignItems: 'center', gap: 8 });
export const playButtonStyle = style({ width: 36, height: 36, borderRadius: '50%', border: 'none', backgroundColor: 'var(--rel-color-primary, #3b82f6)', color: 'var(--rel-color-bg, #ffffff)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--rel-text-sm, 14px)', padding: 0, flexShrink: 0, ':hover': { opacity: 0.9 } });
export const seekBarStyle = style({ flex: 1, height: 4, borderRadius: 2, appearance: 'none', cursor: 'pointer', outline: 'none', backgroundColor: 'var(--rel-color-bg-muted, #e5e7eb)' });
export const timeDisplayStyle = style({ fontSize: 'var(--rel-text-xs, 11px)', color: 'var(--rel-color-text-secondary, #9ca3af)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' });
export const volumeBarStyle = style({ width: 60, height: 4, borderRadius: 2, appearance: 'none', cursor: 'pointer', outline: 'none', backgroundColor: 'var(--rel-color-bg-muted, #e5e7eb)' });
export const trackInfoStyle = style({ display: 'flex', flexDirection: 'column', gap: 2 });
export const trackTitleStyle = style({ fontWeight: 600, fontSize: 'var(--rel-text-sm, 14px)', color: 'var(--rel-color-text, #111827)' });
export const trackArtistStyle = style({ fontSize: 'var(--rel-text-xs, 12px)', color: 'var(--rel-color-text-secondary, #6b7280)' });
export const playlistStyle = style({ display: 'flex', flexDirection: 'column', gap: 2, borderTop: '1px solid var(--rel-color-border, #e5e7eb)', paddingTop: 8 });
export const playlistItemStyle = style({ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 4, cursor: 'pointer', fontSize: 'var(--rel-text-sm, 14px)', color: 'var(--rel-color-text, #374151)', ':hover': { backgroundColor: 'var(--rel-color-bg-subtle, #f8fafc)' } });
export const playlistItemActiveStyle = style({ backgroundColor: 'var(--rel-color-primary-light, #eff6ff)', fontWeight: 600 });
