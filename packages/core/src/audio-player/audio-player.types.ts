/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Ses parcasi / Audio track */
export interface AudioTrack {
  readonly id: string;
  readonly title: string;
  readonly src: string;
  readonly artist?: string;
  readonly duration?: number;
}

export type AudioPlayerEvent =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'TOGGLE' }
  | { type: 'SEEK'; time: number }
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'TIME_UPDATE'; currentTime: number; duration: number }
  | { type: 'LOADED'; duration: number }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREV_TRACK' }
  | { type: 'SET_TRACK'; trackId: string }
  | { type: 'SET_TRACKS'; tracks: AudioTrack[] };

export interface AudioPlayerContext {
  readonly isPlaying: boolean;
  readonly currentTime: number;
  readonly duration: number;
  readonly volume: number;
  readonly muted: boolean;
  readonly currentTrack: AudioTrack | null;
  readonly currentTrackIndex: number;
  readonly tracks: readonly AudioTrack[];
  readonly progress: number;
}

export interface AudioPlayerConfig {
  tracks?: AudioTrack[];
  volume?: number;
  onTrackChange?: (track: AudioTrack) => void;
  onEnded?: () => void;
}

export interface AudioPlayerAPI {
  getContext(): AudioPlayerContext;
  send(event: AudioPlayerEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}
