/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ColorPicker state machine.
 *
 * @packageDocumentation
 */

import type {
  RgbColor,
  HslColor,
  HsvColor,
  ColorPickerConfig,
  ColorPickerContext,
  ColorPickerEvent,
  ColorPickerAPI,
} from './color-picker.types';

// ── Color Conversion Helpers ─────────────────────────

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

/** Hex → RGB */
export function hexToRgb(hex: string): RgbColor {
  const h = hex.replace('#', '');
  const full = h.length === 3
    ? h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2)
    : h;
  const num = parseInt(full, 16);
  if (isNaN(num)) return { r: 0, g: 0, b: 0 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/** RGB → Hex */
export function rgbToHex(rgb: RgbColor): string {
  const r = clamp(Math.round(rgb.r), 0, 255);
  const g = clamp(Math.round(rgb.g), 0, 255);
  const b = clamp(Math.round(rgb.b), 0, 255);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/** RGB → HSL */
export function rgbToHsl(rgb: RgbColor): HslColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/** HSL → RGB */
export function hslToRgb(hsl: HslColor): RgbColor {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p: number, q: number, t: number): number => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

/** RGB → HSV */
export function rgbToHsv(rgb: RgbColor): HsvColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const v = max;
  const s = max === 0 ? 0 : d / max;

  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

/** HSV → RGB */
export function hsvToRgb(hsv: HsvColor): RgbColor {
  const h = hsv.h / 360;
  const s = hsv.s / 100;
  const v = hsv.v / 100;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r = 0;
  let g = 0;
  let b = 0;
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// ── State Machine ────────────────────────────────────

/**
 * ColorPicker state machine olusturur.
 * Creates a ColorPicker state machine.
 */
export function createColorPicker(config: ColorPickerConfig = {}): ColorPickerAPI {
  const {
    defaultColor = '#3b82f6',
    defaultAlpha = 1,
    onChange,
  } = config;

  // ── State ──
  let rgb = hexToRgb(defaultColor);
  let hex = rgbToHex(rgb);
  let hsl = rgbToHsl(rgb);
  let hsv = rgbToHsv(rgb);
  let alpha = clamp(defaultAlpha, 0, 1);

  const listeners = new Set<() => void>();

  function notify(): void {
    onChange?.(hex, alpha);
    listeners.forEach((fn) => fn());
  }

  function syncFromRgb(newRgb: RgbColor): void {
    rgb = { r: clamp(Math.round(newRgb.r), 0, 255), g: clamp(Math.round(newRgb.g), 0, 255), b: clamp(Math.round(newRgb.b), 0, 255) };
    hex = rgbToHex(rgb);
    hsl = rgbToHsl(rgb);
    hsv = rgbToHsv(rgb);
  }

  function syncFromHsv(newHsv: HsvColor): void {
    hsv = { h: clamp(Math.round(newHsv.h), 0, 360), s: clamp(Math.round(newHsv.s), 0, 100), v: clamp(Math.round(newHsv.v), 0, 100) };
    rgb = hsvToRgb(hsv);
    hex = rgbToHex(rgb);
    hsl = rgbToHsl(rgb);
  }

  // ── Send ──
  function send(event: ColorPickerEvent): void {
    switch (event.type) {
      case 'SET_HEX': {
        const clean = event.hex.startsWith('#') ? event.hex : `#${event.hex}`;
        if (!/^#[0-9a-fA-F]{3,6}$/.test(clean)) return;
        const newRgb = hexToRgb(clean);
        syncFromRgb(newRgb);
        notify();
        break;
      }
      case 'SET_RGB': {
        syncFromRgb(event.rgb);
        notify();
        break;
      }
      case 'SET_HSL': {
        const clamped: HslColor = {
          h: clamp(Math.round(event.hsl.h), 0, 360),
          s: clamp(Math.round(event.hsl.s), 0, 100),
          l: clamp(Math.round(event.hsl.l), 0, 100),
        };
        hsl = clamped;
        rgb = hslToRgb(clamped);
        hex = rgbToHex(rgb);
        hsv = rgbToHsv(rgb);
        notify();
        break;
      }
      case 'SET_HSV': {
        syncFromHsv(event.hsv);
        notify();
        break;
      }
      case 'SET_ALPHA': {
        const newAlpha = clamp(event.alpha, 0, 1);
        if (newAlpha === alpha) return;
        alpha = newAlpha;
        notify();
        break;
      }
      case 'SET_HUE': {
        const newHue = clamp(Math.round(event.hue), 0, 360);
        syncFromHsv({ h: newHue, s: hsv.s, v: hsv.v });
        notify();
        break;
      }
      case 'SET_SATURATION_VALUE': {
        syncFromHsv({ h: hsv.h, s: clamp(Math.round(event.s), 0, 100), v: clamp(Math.round(event.v), 0, 100) });
        notify();
        break;
      }
    }
  }

  // ── API ──
  return {
    getContext(): ColorPickerContext {
      return { hex, rgb, hsl, hsv, alpha };
    },
    send,
    subscribe(callback: () => void): () => void {
      listeners.add(callback);
      return () => { listeners.delete(callback); };
    },
    destroy(): void {
      listeners.clear();
    },
  };
}
