/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Typography tokens — font families, sizes, weights, line heights, letter spacing.
 * Tipografi token'ları — yazı tipleri, boyutlar, ağırlıklar, satır yükseklikleri.
 *
 * @packageDocumentation
 */

// ---------------------------------------------------------------------------
// Font Family
// ---------------------------------------------------------------------------

export const fontFamily = {
  /** Ana yazı tipi / Primary font family */
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  /** Kod yazı tipi / Monospace font family */
  mono: "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
  /** Başlık yazı tipi / Heading font family (varsayılan: sans ile aynı) */
  heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
} as const;

// ---------------------------------------------------------------------------
// Font Size — rem tabanlı (16px base)
// ---------------------------------------------------------------------------

export const fontSize = {
  /** 11px */
  '2xs': '0.6875rem',
  /** 12px */
  xs: '0.75rem',
  /** 13px */
  sm: '0.8125rem',
  /** 14px */
  base: '0.875rem',
  /** 16px */
  lg: '1rem',
  /** 18px */
  xl: '1.125rem',
  /** 20px */
  '2xl': '1.25rem',
  /** 24px */
  '3xl': '1.5rem',
  /** 30px */
  '4xl': '1.875rem',
  /** 36px */
  '5xl': '2.25rem',
  /** 48px */
  '6xl': '3rem',
  /** 60px */
  '7xl': '3.75rem',
} as const;

// ---------------------------------------------------------------------------
// Font Weight
// ---------------------------------------------------------------------------

export const fontWeight = {
  thin: '100',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

// ---------------------------------------------------------------------------
// Line Height
// ---------------------------------------------------------------------------

export const lineHeight = {
  /** Sıkı — başlıklar / Tight — headings */
  tight: '1.2',
  /** Dar / Snug */
  snug: '1.375',
  /** Normal — gövde metni / Normal — body text */
  normal: '1.5',
  /** Geniş / Relaxed */
  relaxed: '1.625',
  /** Çok geniş / Loose */
  loose: '2',
  /** Satır yüksekliği yok — tek satır / None — single line */
  none: '1',
} as const;

// ---------------------------------------------------------------------------
// Letter Spacing
// ---------------------------------------------------------------------------

export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;
