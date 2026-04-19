/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

export const rootStyle = style({ display: 'inline-block', position: 'relative', overflow: 'hidden' });
export const imageStyle = style({ display: 'block', maxWidth: '100%', height: 'auto', transition: 'opacity 0.3s ease' });
export const placeholderStyle = style({ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--rel-color-bg-subtle, #f1f5f9)', color: 'var(--rel-color-text-muted, #9ca3af)', fontSize: 'var(--rel-text-sm, 14px)' });
export const fallbackStyle = style({ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--rel-color-bg-subtle, #f1f5f9)', color: 'var(--rel-color-text-muted, #9ca3af)', fontSize: 'var(--rel-text-sm, 14px)' });
export const lightboxStyle = style({ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)' });
export const lightboxImgStyle = style({ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' });
