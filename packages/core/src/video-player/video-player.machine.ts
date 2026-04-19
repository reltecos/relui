/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * VideoPlayer state machine.
 * @packageDocumentation
 */

import type {
  VideoPlayerConfig, VideoPlayerContext, VideoPlayerEvent, VideoPlayerAPI, PlaybackSpeed,
} from './video-player.types';

export function createVideoPlayer(config: VideoPlayerConfig = {}): VideoPlayerAPI {
  let isPlaying = false;
  let currentTime = 0;
  let duration = 0;
  let volume = Math.max(0, Math.min(1, config.volume ?? 1));
  let muted = config.muted ?? false;
  let speed: PlaybackSpeed = config.speed ?? 1;
  let isFullscreen = false;
  let buffered = 0;

  const listeners = new Set<() => void>();
  function notify(): void { listeners.forEach((fn) => fn()); }

  function send(event: VideoPlayerEvent): void {
    switch (event.type) {
      case 'PLAY': {
        if (isPlaying) return;
        isPlaying = true;
        config.onPlay?.();
        notify();
        break;
      }
      case 'PAUSE': {
        if (!isPlaying) return;
        isPlaying = false;
        config.onPause?.();
        notify();
        break;
      }
      case 'TOGGLE': {
        isPlaying = !isPlaying;
        if (isPlaying) config.onPlay?.(); else config.onPause?.();
        notify();
        break;
      }
      case 'SEEK': {
        const t = Math.max(0, Math.min(duration, event.time));
        if (t === currentTime) return;
        currentTime = t;
        notify();
        break;
      }
      case 'SET_VOLUME': {
        const v = Math.max(0, Math.min(1, event.volume));
        if (v === volume) return;
        volume = v;
        notify();
        break;
      }
      case 'SET_MUTED': {
        if (event.muted === muted) return;
        muted = event.muted;
        notify();
        break;
      }
      case 'TOGGLE_MUTE': {
        muted = !muted;
        notify();
        break;
      }
      case 'SET_SPEED': {
        if (event.speed === speed) return;
        speed = event.speed;
        notify();
        break;
      }
      case 'SET_FULLSCREEN': {
        if (event.fullscreen === isFullscreen) return;
        isFullscreen = event.fullscreen;
        notify();
        break;
      }
      case 'TIME_UPDATE': {
        currentTime = event.currentTime;
        duration = event.duration;
        buffered = event.buffered;
        config.onTimeUpdate?.(currentTime, duration);
        if (duration > 0 && currentTime >= duration) {
          isPlaying = false;
          config.onEnded?.();
        }
        notify();
        break;
      }
      case 'LOADED': {
        duration = event.duration;
        notify();
        break;
      }
    }
  }

  return {
    getContext(): VideoPlayerContext {
      return {
        isPlaying, currentTime, duration, volume, muted, speed, isFullscreen, buffered,
        progress: duration > 0 ? (currentTime / duration) * 100 : 0,
      };
    },
    send,
    subscribe(cb) { listeners.add(cb); return () => { listeners.delete(cb); }; },
    destroy() { listeners.clear(); },
  };
}
