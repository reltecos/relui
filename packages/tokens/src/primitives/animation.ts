/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Animation tokens — duration and easing curves.
 * Animasyon token'ları — süre ve hareket eğrileri.
 *
 * @packageDocumentation
 */

// ---------------------------------------------------------------------------
// Duration
// ---------------------------------------------------------------------------

export const duration = {
  /** 0ms — animasyon yok / No animation */
  none: '0ms',
  /** 75ms — anlık / Instant feedback */
  instant: '75ms',
  /** 150ms — hızlı / Fast transitions */
  fast: '150ms',
  /** 250ms — normal / Default transitions */
  normal: '250ms',
  /** 350ms — yavaş / Slow transitions */
  slow: '350ms',
  /** 500ms — çok yavaş / Very slow (panel açılma, drawer) */
  slower: '500ms',
  /** 700ms — en yavaş / Slowest (sayfa geçişleri) */
  slowest: '700ms',
} as const;

// ---------------------------------------------------------------------------
// Easing — cubic-bezier curves
// ---------------------------------------------------------------------------

export const easing = {
  /** Doğrusal / Linear */
  linear: 'linear',
  /** Standart ease / Default ease */
  ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  /** İçeri hızlanma / Ease in — çıkış animasyonları */
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  /** Dışarı yavaşlama / Ease out — giriş animasyonları */
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  /** İçeri-dışarı / Ease in-out — genel geçişler */
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  /** Yay efekti / Spring — doğal hareket (buton basma, card hover) */
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  /** Sert geçiş / Snap — hızlı, belirgin (toggle, switch) */
  snap: 'cubic-bezier(0.2, 0, 0, 1)',
} as const;
