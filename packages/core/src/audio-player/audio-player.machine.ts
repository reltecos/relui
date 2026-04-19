/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { AudioPlayerConfig, AudioPlayerContext, AudioPlayerEvent, AudioPlayerAPI, AudioTrack } from './audio-player.types';

export function createAudioPlayer(config: AudioPlayerConfig = {}): AudioPlayerAPI {
  let isPlaying = false;
  let currentTime = 0;
  let duration = 0;
  let volume = Math.max(0, Math.min(1, config.volume ?? 1));
  let muted = false;
  let tracks: AudioTrack[] = config.tracks ? [...config.tracks] : [];
  let currentTrackIndex = tracks.length > 0 ? 0 : -1;

  const listeners = new Set<() => void>();
  function notify(): void { listeners.forEach((fn) => fn()); }

  function send(event: AudioPlayerEvent): void {
    switch (event.type) {
      case 'PLAY': { if (isPlaying) return; isPlaying = true; notify(); break; }
      case 'PAUSE': { if (!isPlaying) return; isPlaying = false; notify(); break; }
      case 'TOGGLE': { isPlaying = !isPlaying; notify(); break; }
      case 'SEEK': { const t = Math.max(0, Math.min(duration, event.time)); if (t === currentTime) return; currentTime = t; notify(); break; }
      case 'SET_VOLUME': { const v = Math.max(0, Math.min(1, event.volume)); if (v === volume) return; volume = v; notify(); break; }
      case 'TOGGLE_MUTE': { muted = !muted; notify(); break; }
      case 'TIME_UPDATE': {
        currentTime = event.currentTime; duration = event.duration;
        if (duration > 0 && currentTime >= duration) { isPlaying = false; config.onEnded?.(); }
        notify(); break;
      }
      case 'LOADED': { duration = event.duration; notify(); break; }
      case 'NEXT_TRACK': {
        if (tracks.length === 0) return;
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        currentTime = 0; duration = 0;
        const track = tracks[currentTrackIndex];
        if (track) config.onTrackChange?.(track);
        notify(); break;
      }
      case 'PREV_TRACK': {
        if (tracks.length === 0) return;
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        currentTime = 0; duration = 0;
        const track = tracks[currentTrackIndex];
        if (track) config.onTrackChange?.(track);
        notify(); break;
      }
      case 'SET_TRACK': {
        const idx = tracks.findIndex((t) => t.id === event.trackId);
        if (idx === -1 || idx === currentTrackIndex) return;
        currentTrackIndex = idx; currentTime = 0; duration = 0;
        const track = tracks[currentTrackIndex];
        if (track) config.onTrackChange?.(track);
        notify(); break;
      }
      case 'SET_TRACKS': { tracks = [...event.tracks]; currentTrackIndex = tracks.length > 0 ? 0 : -1; currentTime = 0; duration = 0; notify(); break; }
    }
  }

  return {
    getContext(): AudioPlayerContext {
      return {
        isPlaying, currentTime, duration, volume, muted,
        currentTrack: currentTrackIndex >= 0 ? (tracks[currentTrackIndex] ?? null) : null,
        currentTrackIndex, tracks,
        progress: duration > 0 ? (currentTime / duration) * 100 : 0,
      };
    },
    send,
    subscribe(cb) { listeners.add(cb); return () => { listeners.delete(cb); }; },
    destroy() { listeners.clear(); },
  };
}
