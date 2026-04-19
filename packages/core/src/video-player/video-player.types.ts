/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * VideoPlayer tipleri.
 * VideoPlayer types.
 *
 * @packageDocumentation
 */

/** Oynatma hizi / Playback speed */
export type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;

// ── Events ───────────────────────────────────────────

export type VideoPlayerEvent =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'TOGGLE' }
  | { type: 'SEEK'; time: number }
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'SET_MUTED'; muted: boolean }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'SET_SPEED'; speed: PlaybackSpeed }
  | { type: 'SET_FULLSCREEN'; fullscreen: boolean }
  | { type: 'TIME_UPDATE'; currentTime: number; duration: number; buffered: number }
  | { type: 'LOADED'; duration: number };

// ── Context ──────────────────────────────────────────

export interface VideoPlayerContext {
  readonly isPlaying: boolean;
  readonly currentTime: number;
  readonly duration: number;
  readonly volume: number;
  readonly muted: boolean;
  readonly speed: PlaybackSpeed;
  readonly isFullscreen: boolean;
  readonly buffered: number;
  /** Ilerleme yuzdesi (0-100) / Progress percentage */
  readonly progress: number;
}

// ── Config ───────────────────────────────────────────

export interface VideoPlayerConfig {
  volume?: number;
  muted?: boolean;
  speed?: PlaybackSpeed;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
}

// ── API ──────────────────────────────────────────────

export interface VideoPlayerAPI {
  getContext(): VideoPlayerContext;
  send(event: VideoPlayerEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}
