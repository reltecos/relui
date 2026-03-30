/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style, styleVariants } from '@vanilla-extract/css';

// ── Root ────────────────────────────────────────────

export const rootStyle = style({
  display: 'inline-flex',
  flexDirection: 'column',
  gap: 12,
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  color: 'var(--rel-color-text, #374151)',
});

export const sizeStyles = styleVariants({
  sm: { width: 220 },
  md: { width: 280 },
  lg: { width: 340 },
});

// ── Spectrum (saturation-brightness 2D area) ────────

export const spectrumStyle = style({
  position: 'relative',
  borderRadius: 6,
  cursor: 'crosshair',
  overflow: 'hidden',
  touchAction: 'none',
});

export const spectrumSizeStyles = styleVariants({
  sm: { height: 140 },
  md: { height: 180 },
  lg: { height: 220 },
});

// ── Spectrum Thumb ──────────────────────────────────

export const spectrumThumbStyle = style({
  position: 'absolute',
  width: 16,
  height: 16,
  borderRadius: '50%',
  border: '2px solid var(--rel-color-bg, #ffffff)',
  boxShadow: 'var(--rel-shadow-sm, 0 1px 2px rgba(0,0,0,0.2))',
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none',
  zIndex: 1,
});

// ── Hue Slider ─────────────────────────────────────

export const hueSliderStyle = style({
  position: 'relative',
  height: 14,
  borderRadius: 7,
  cursor: 'pointer',
  touchAction: 'none',
  background:
    'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
});

// ── Alpha Slider ───────────────────────────────────

export const alphaSliderStyle = style({
  position: 'relative',
  height: 14,
  borderRadius: 7,
  cursor: 'pointer',
  touchAction: 'none',
  backgroundImage:
    'linear-gradient(45deg, var(--rel-color-bg-muted, #ccc) 25%, transparent 25%), linear-gradient(-45deg, var(--rel-color-bg-muted, #ccc) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--rel-color-bg-muted, #ccc) 75%), linear-gradient(-45deg, transparent 75%, var(--rel-color-bg-muted, #ccc) 75%)',
  backgroundSize: '8px 8px',
  backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
});

// ── Slider Thumb ───────────────────────────────────

export const sliderThumbStyle = style({
  position: 'absolute',
  top: '50%',
  width: 18,
  height: 18,
  borderRadius: '50%',
  border: '2px solid var(--rel-color-bg, #ffffff)',
  boxShadow: 'var(--rel-shadow-sm, 0 1px 2px rgba(0,0,0,0.2))',
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none',
});

// ── Input ──────────────────────────────────────────

export const inputWrapperStyle = style({
  display: 'flex',
  gap: 8,
  alignItems: 'center',
});

export const hexInputStyle = style({
  flex: 1,
  padding: '4px 8px',
  fontSize: 'var(--rel-text-sm, 14px)',
  fontFamily: 'var(--rel-font-mono, monospace)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 4,
  color: 'var(--rel-color-text, #374151)',
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  outline: 'none',
  selectors: {
    '&:focus': {
      borderColor: 'var(--rel-color-primary, #3b82f6)',
    },
  },
});

// ── Swatch ─────────────────────────────────────────

export const swatchStyle = style({
  width: 32,
  height: 32,
  borderRadius: 4,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  flexShrink: 0,
});

// ── Swatch Grid (presets) ──────────────────────────

export const swatchGridStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
});

export const presetSwatchStyle = style({
  width: 24,
  height: 24,
  borderRadius: 4,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  cursor: 'pointer',
  transition: 'transform 0.1s ease',
  selectors: {
    '&:hover': {
      transform: 'scale(1.15)',
    },
  },
});
