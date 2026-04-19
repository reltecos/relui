/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createAudioPlayer } from './audio-player.machine';
import type { AudioTrack } from './audio-player.types';

const TRACKS: AudioTrack[] = [
  { id: '1', title: 'Song A', src: '/a.mp3', artist: 'Artist A' },
  { id: '2', title: 'Song B', src: '/b.mp3', artist: 'Artist B' },
  { id: '3', title: 'Song C', src: '/c.mp3' },
];

describe('createAudioPlayer', () => {
  it('varsayilan context', () => { const api = createAudioPlayer(); const ctx = api.getContext(); expect(ctx.isPlaying).toBe(false); expect(ctx.currentTrack).toBeNull(); expect(ctx.tracks).toHaveLength(0); api.destroy(); });
  it('tracks ile baslar', () => { const api = createAudioPlayer({ tracks: TRACKS }); expect(api.getContext().currentTrack?.id).toBe('1'); expect(api.getContext().tracks).toHaveLength(3); api.destroy(); });
  it('PLAY/PAUSE/TOGGLE', () => { const api = createAudioPlayer(); api.send({ type: 'PLAY' }); expect(api.getContext().isPlaying).toBe(true); api.send({ type: 'PAUSE' }); expect(api.getContext().isPlaying).toBe(false); api.send({ type: 'TOGGLE' }); expect(api.getContext().isPlaying).toBe(true); api.destroy(); });
  it('SEEK clamp eder', () => { const api = createAudioPlayer(); api.send({ type: 'LOADED', duration: 60 }); api.send({ type: 'SEEK', time: 30 }); expect(api.getContext().currentTime).toBe(30); api.send({ type: 'SEEK', time: 100 }); expect(api.getContext().currentTime).toBe(60); api.destroy(); });
  it('SET_VOLUME clamp eder', () => { const api = createAudioPlayer(); api.send({ type: 'SET_VOLUME', volume: 0.5 }); expect(api.getContext().volume).toBe(0.5); api.send({ type: 'SET_VOLUME', volume: 1.5 }); expect(api.getContext().volume).toBe(1); api.destroy(); });
  it('TOGGLE_MUTE', () => { const api = createAudioPlayer(); api.send({ type: 'TOGGLE_MUTE' }); expect(api.getContext().muted).toBe(true); api.destroy(); });
  it('TIME_UPDATE progress hesaplar', () => { const api = createAudioPlayer(); api.send({ type: 'TIME_UPDATE', currentTime: 30, duration: 120 }); expect(api.getContext().progress).toBe(25); api.destroy(); });
  it('LOADED duration ayarlar', () => { const api = createAudioPlayer(); api.send({ type: 'LOADED', duration: 180 }); expect(api.getContext().duration).toBe(180); api.destroy(); });
  it('NEXT_TRACK sonraki parcaya gecer', () => { const onTrackChange = vi.fn(); const api = createAudioPlayer({ tracks: TRACKS, onTrackChange }); api.send({ type: 'NEXT_TRACK' }); expect(api.getContext().currentTrack?.id).toBe('2'); expect(onTrackChange).toHaveBeenCalled(); api.destroy(); });
  it('NEXT_TRACK son parcada ilke doner', () => { const api = createAudioPlayer({ tracks: TRACKS }); api.send({ type: 'NEXT_TRACK' }); api.send({ type: 'NEXT_TRACK' }); api.send({ type: 'NEXT_TRACK' }); expect(api.getContext().currentTrack?.id).toBe('1'); api.destroy(); });
  it('PREV_TRACK onceki parcaya gecer', () => { const api = createAudioPlayer({ tracks: TRACKS }); api.send({ type: 'PREV_TRACK' }); expect(api.getContext().currentTrack?.id).toBe('3'); api.destroy(); });
  it('SET_TRACK belirli parcaya gecer', () => { const api = createAudioPlayer({ tracks: TRACKS }); api.send({ type: 'SET_TRACK', trackId: '3' }); expect(api.getContext().currentTrack?.id).toBe('3'); api.destroy(); });
  it('SET_TRACKS listesi degistirir', () => { const api = createAudioPlayer(); api.send({ type: 'SET_TRACKS', tracks: TRACKS }); expect(api.getContext().tracks).toHaveLength(3); expect(api.getContext().currentTrack?.id).toBe('1'); api.destroy(); });
  it('onEnded bitince cagirilir', () => { const onEnded = vi.fn(); const api = createAudioPlayer({ onEnded }); api.send({ type: 'PLAY' }); api.send({ type: 'TIME_UPDATE', currentTime: 100, duration: 100 }); expect(api.getContext().isPlaying).toBe(false); expect(onEnded).toHaveBeenCalled(); api.destroy(); });
  it('subscribe/destroy', () => { const api = createAudioPlayer(); const l = vi.fn(); api.subscribe(l); api.send({ type: 'PLAY' }); expect(l).toHaveBeenCalledTimes(1); api.destroy(); api.send({ type: 'PAUSE' }); expect(l).toHaveBeenCalledTimes(1); });
  it('config.volume ile baslar', () => { const api = createAudioPlayer({ volume: 0.3 }); expect(api.getContext().volume).toBe(0.3); api.destroy(); });
});
