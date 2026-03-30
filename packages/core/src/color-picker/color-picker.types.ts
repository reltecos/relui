/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ColorPicker tipleri.
 * ColorPicker types.
 *
 * @packageDocumentation
 */

// ── Color Models ─────────────────────────────────────

/** RGB renk modeli / RGB color model */
export interface RgbColor {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

/** HSL renk modeli / HSL color model */
export interface HslColor {
  readonly h: number;
  readonly s: number;
  readonly l: number;
}

/** HSV renk modeli / HSV color model */
export interface HsvColor {
  readonly h: number;
  readonly s: number;
  readonly v: number;
}

// ── Events ───────────────────────────────────────────

/** ColorPicker event'leri / ColorPicker events */
export type ColorPickerEvent =
  | { type: 'SET_HEX'; hex: string }
  | { type: 'SET_RGB'; rgb: RgbColor }
  | { type: 'SET_HSL'; hsl: HslColor }
  | { type: 'SET_HSV'; hsv: HsvColor }
  | { type: 'SET_ALPHA'; alpha: number }
  | { type: 'SET_HUE'; hue: number }
  | { type: 'SET_SATURATION_VALUE'; s: number; v: number };

// ── Context ──────────────────────────────────────────

/** ColorPicker state / ColorPicker context */
export interface ColorPickerContext {
  /** Hex renk degeri (#rrggbb) / Hex color value */
  readonly hex: string;
  /** RGB renk degeri / RGB color value */
  readonly rgb: RgbColor;
  /** HSL renk degeri / HSL color value */
  readonly hsl: HslColor;
  /** HSV renk degeri / HSV color value */
  readonly hsv: HsvColor;
  /** Alpha degeri (0-1) / Alpha value (0-1) */
  readonly alpha: number;
}

// ── Config ───────────────────────────────────────────

/** ColorPicker yapilandirmasi / ColorPicker configuration */
export interface ColorPickerConfig {
  /** Varsayilan renk (hex) / Default color (hex) */
  defaultColor?: string;
  /** Varsayilan alpha / Default alpha */
  defaultAlpha?: number;
  /** Renk degisince callback / On color change callback */
  onChange?: (hex: string, alpha: number) => void;
}

// ── API ──────────────────────────────────────────────

/** ColorPicker API / ColorPicker API */
export interface ColorPickerAPI {
  /** Guncel context / Get current context */
  getContext(): ColorPickerContext;
  /** Event gonder / Send event */
  send(event: ColorPickerEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
  /** Temizlik / Cleanup */
  destroy(): void;
}
