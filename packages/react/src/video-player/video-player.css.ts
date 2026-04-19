/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

export const rootStyle = style({
  position: 'relative',
  display: 'inline-flex',
  flexDirection: 'column',
  backgroundColor: 'var(--rel-color-text, #000000)',
  borderRadius: 8,
  overflow: 'hidden',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  lineHeight: 1,
});

export const videoStyle = style({
  display: 'block',
  width: '100%',
  height: 'auto',
});

export const controlsStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 12px',
  backgroundColor: 'var(--rel-color-text, rgba(0,0,0,0.85))',
  color: 'var(--rel-color-bg, #ffffff)',
  fontSize: 'var(--rel-text-xs, 12px)',
});

export const playButtonStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  border: 'none',
  borderRadius: 4,
  backgroundColor: 'transparent',
  color: 'var(--rel-color-bg, #ffffff)',
  cursor: 'pointer',
  padding: 0,
  fontSize: 'var(--rel-text-sm, 14px)',
  ':hover': { opacity: 0.8 },
});

export const seekBarStyle = style({
  flex: 1,
  height: 4,
  borderRadius: 2,
  appearance: 'none',
  backgroundColor: 'var(--rel-color-bg-muted, rgba(255,255,255,0.3))',
  cursor: 'pointer',
  outline: 'none',
});

export const volumeBarStyle = style({
  width: 60,
  height: 4,
  borderRadius: 2,
  appearance: 'none',
  backgroundColor: 'var(--rel-color-bg-muted, rgba(255,255,255,0.3))',
  cursor: 'pointer',
  outline: 'none',
});

export const timeDisplayStyle = style({
  fontSize: 'var(--rel-text-xs, 11px)',
  color: 'var(--rel-color-bg-muted, rgba(255,255,255,0.7))',
  whiteSpace: 'nowrap',
  fontVariantNumeric: 'tabular-nums',
});

export const speedMenuStyle = style({
  display: 'flex',
  alignItems: 'center',
  border: 'none',
  backgroundColor: 'transparent',
  color: 'var(--rel-color-bg, #ffffff)',
  cursor: 'pointer',
  fontSize: 'var(--rel-text-xs, 11px)',
  fontWeight: 600,
  padding: '2px 4px',
  borderRadius: 2,
  fontFamily: 'inherit',
  ':hover': { opacity: 0.8 },
});

export const fullscreenButtonStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  backgroundColor: 'transparent',
  color: 'var(--rel-color-bg, #ffffff)',
  cursor: 'pointer',
  padding: 0,
  fontSize: 'var(--rel-text-sm, 14px)',
  ':hover': { opacity: 0.8 },
});
