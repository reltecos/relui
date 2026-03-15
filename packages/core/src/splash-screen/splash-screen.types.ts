/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * SplashScreen tipleri / SplashScreen types.
 *
 * @packageDocumentation
 */

// ── Events ──────────────────────────────────────────────

/** SplashScreen event tipleri / SplashScreen event types. */
export type SplashScreenEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'SET_PROGRESS'; value: number }
  | { type: 'SET_MESSAGE'; message: string };

// ── Context ─────────────────────────────────────────────

/** SplashScreen durumu / SplashScreen state. */
export interface SplashScreenContext {
  /** Gorunur mu / Is visible */
  visible: boolean;
  /** Yukleme ilerlemesi (0-100) / Loading progress (0-100) */
  progress: number;
  /** Durum mesaji / Status message */
  message: string;
}

// ── Config ──────────────────────────────────────────────

/** SplashScreen yapilandirmasi / SplashScreen configuration. */
export interface SplashScreenConfig {
  /** Baslangicta gorunur mu / Initially visible (default: false) */
  visible?: boolean;
  /** Baslangic mesaji / Initial message */
  message?: string;
  /** Progress 100 olunca otomatik kapat / Auto-close on progress 100 (default: true) */
  autoClose?: boolean;
  /** Otomatik kapatma gecikmesi ms / Auto-close delay in ms (default: 500) */
  autoCloseDelay?: number;
  /** Tamamlaninca callback / On complete callback */
  onComplete?: () => void;
  /** Gorunurluk degisince callback / On visibility change callback */
  onVisibleChange?: (visible: boolean) => void;
}

// ── API ─────────────────────────────────────────────────

/** SplashScreen API'si / SplashScreen API. */
export interface SplashScreenAPI {
  /** Mevcut durumu al / Get current context */
  getContext(): SplashScreenContext;
  /** Event gonder / Send event */
  send(event: SplashScreenEvent): void;
  /** Dinleyici ekle / Subscribe to changes */
  subscribe(listener: () => void): () => void;
}
