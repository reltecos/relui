/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * LiveTile tipleri.
 * LiveTile types.
 *
 * @packageDocumentation
 */

// ── Events ───────────────────────────────────────────

/** LiveTile event'leri / LiveTile events */
export type LiveTileEvent =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'GOTO'; index: number }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'SET_FACE_COUNT'; count: number };

// ── Types ────────────────────────────────────────────

/** LiveTile animasyon tipi / LiveTile animation type */
export type LiveTileAnimationType = 'flip' | 'slide' | 'fade';

/** Gecis yonu / Transition direction */
export type LiveTileDirection = 'next' | 'prev';

// ── Context ──────────────────────────────────────────

/** LiveTile state / LiveTile context */
export interface LiveTileContext {
  /** Aktif face indexi / Active face index */
  readonly activeIndex: number;
  /** Toplam face sayisi / Total face count */
  readonly faceCount: number;
  /** Duraklatildi mi / Is paused */
  readonly paused: boolean;
  /** Son gecis yonu / Last transition direction */
  readonly direction: LiveTileDirection;
}

// ── Config ───────────────────────────────────────────

/** LiveTile yapilandirmasi / LiveTile configuration */
export interface LiveTileConfig {
  /** Toplam face sayisi / Total face count */
  faceCount?: number;
  /** Baslangic indexi / Default active index */
  defaultIndex?: number;
  /** Dongu mu / Loop around */
  loop?: boolean;
  /** Index degisince callback / On index change callback */
  onChange?: (index: number) => void;
}

// ── API ──────────────────────────────────────────────

/** LiveTile API / LiveTile API */
export interface LiveTileAPI {
  /** Guncel context / Get current context */
  getContext(): LiveTileContext;
  /** Event gonder / Send event */
  send(event: LiveTileEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
  /** Temizlik / Cleanup */
  destroy(): void;
}
