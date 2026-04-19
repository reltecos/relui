/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * VideoPlayer — video oynatici bilesen (Dual API).
 * VideoPlayer — video player component (Dual API).
 *
 * Props-based: `<VideoPlayer src="/video.mp4" />`
 * Compound:    `<VideoPlayer src="/video.mp4"><VideoPlayer.Controls /></VideoPlayer>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useRef, useEffect, type ReactNode } from 'react';
import type { PlaybackSpeed } from '@relteco/relui-core';
import {
  rootStyle, videoStyle, controlsStyle, playButtonStyle, seekBarStyle,
  volumeBarStyle, timeDisplayStyle, speedMenuStyle, fullscreenButtonStyle,
} from './video-player.css';
import { useVideoPlayer, type UseVideoPlayerProps } from './useVideoPlayer';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type VideoPlayerSlot = 'root' | 'video' | 'controls' | 'seekBar' | 'volumeBar' | 'playButton' | 'timeDisplay' | 'speedMenu' | 'fullscreenButton';

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ── Context ──

interface VideoPlayerContextValue {
  isPlaying: boolean; currentTime: number; duration: number; volume: number;
  muted: boolean; speed: PlaybackSpeed; progress: number;
  toggle: () => void; seek: (t: number) => void; setVolume: (v: number) => void;
  toggleMute: () => void; setSpeed: (s: PlaybackSpeed) => void; setFullscreen: (f: boolean) => void;
  classNames: ClassNames<VideoPlayerSlot> | undefined;
  styles: Styles<VideoPlayerSlot> | undefined;
}

const VideoPlayerContext = createContext<VideoPlayerContextValue | null>(null);

function useVideoPlayerContext(): VideoPlayerContextValue {
  const ctx = useContext(VideoPlayerContext);
  if (!ctx) throw new Error('VideoPlayer compound sub-components must be used within <VideoPlayer>.');
  return ctx;
}

// ── Sub: Controls ──

export interface VideoPlayerControlsProps { className?: string; }

const VideoPlayerControls = forwardRef<HTMLDivElement, VideoPlayerControlsProps>(
  function VideoPlayerControls(props, ref) {
    const { className } = props;
    const ctx = useVideoPlayerContext();
    const slot = getSlotProps('controls', controlsStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const pbSlot = getSlotProps('playButton', playButtonStyle, ctx.classNames, ctx.styles);
    const skSlot = getSlotProps('seekBar', seekBarStyle, ctx.classNames, ctx.styles);
    const tdSlot = getSlotProps('timeDisplay', timeDisplayStyle, ctx.classNames, ctx.styles);
    const vlSlot = getSlotProps('volumeBar', volumeBarStyle, ctx.classNames, ctx.styles);
    const spSlot = getSlotProps('speedMenu', speedMenuStyle, ctx.classNames, ctx.styles);
    const fsSlot = getSlotProps('fullscreenButton', fullscreenButtonStyle, ctx.classNames, ctx.styles);

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="video-player-controls">
        <button type="button" className={pbSlot.className} style={pbSlot.style} onClick={ctx.toggle} aria-label={ctx.isPlaying ? 'Pause' : 'Play'} data-testid="video-player-playButton">
          {ctx.isPlaying ? '\u275A\u275A' : '\u25B6'}
        </button>
        <span className={tdSlot.className} style={tdSlot.style} data-testid="video-player-timeDisplay">
          {formatTime(ctx.currentTime)} / {formatTime(ctx.duration)}
        </span>
        <input type="range" min={0} max={ctx.duration || 1} step={0.1} value={ctx.currentTime}
          onChange={(e) => ctx.seek(Number(e.target.value))}
          className={skSlot.className} style={skSlot.style} aria-label="Seek" data-testid="video-player-seekBar" />
        <button type="button" className={pbSlot.className} style={pbSlot.style} onClick={ctx.toggleMute} aria-label={ctx.muted ? 'Unmute' : 'Mute'} data-testid="video-player-muteButton">
          {ctx.muted ? '\uD83D\uDD07' : '\uD83D\uDD0A'}
        </button>
        <input type="range" min={0} max={1} step={0.05} value={ctx.muted ? 0 : ctx.volume}
          onChange={(e) => ctx.setVolume(Number(e.target.value))}
          className={vlSlot.className} style={vlSlot.style} aria-label="Volume" data-testid="video-player-volumeBar" />
        <button type="button" className={spSlot.className} style={spSlot.style} onClick={() => {
          const speeds: PlaybackSpeed[] = [0.5, 0.75, 1, 1.25, 1.5, 2];
          const idx = speeds.indexOf(ctx.speed);
          ctx.setSpeed(speeds[(idx + 1) % speeds.length] ?? 1);
        }} aria-label="Speed" data-testid="video-player-speedMenu">
          {ctx.speed}x
        </button>
        <button type="button" className={fsSlot.className} style={fsSlot.style} onClick={() => ctx.setFullscreen(true)} aria-label="Fullscreen" data-testid="video-player-fullscreenButton">
          &#x26F6;
        </button>
      </div>
    );
  },
);

// ── Sub: SeekBar ──

export interface VideoPlayerSeekBarProps { className?: string; }

const VideoPlayerSeekBar = forwardRef<HTMLInputElement, VideoPlayerSeekBarProps>(
  function VideoPlayerSeekBar(props, ref) {
    const { className } = props;
    const ctx = useVideoPlayerContext();
    const slot = getSlotProps('seekBar', seekBarStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return (
      <input ref={ref} type="range" min={0} max={ctx.duration || 1} step={0.1} value={ctx.currentTime}
        onChange={(e) => ctx.seek(Number(e.target.value))}
        className={cls} style={slot.style} aria-label="Seek" data-testid="video-player-seekBar" />
    );
  },
);

// ── Props ──

export interface VideoPlayerComponentProps extends SlotStyleProps<VideoPlayerSlot>, UseVideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ──

const VideoPlayerBase = forwardRef<HTMLDivElement, VideoPlayerComponentProps>(
  function VideoPlayer(props, ref) {
    const {
      src, poster, autoPlay = false, children, className, style: styleProp,
      classNames, styles, ...hookProps
    } = props;

    const player = useVideoPlayer(hookProps);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Sync video element
    useEffect(() => {
      const el = videoRef.current;
      if (!el) return;
      const onTimeUpdate = () => {
        const buf = el.buffered.length > 0 ? el.buffered.end(el.buffered.length - 1) : 0;
        player.timeUpdate(el.currentTime, el.duration || 0, buf);
      };
      const onLoaded = () => player.loaded(el.duration || 0);
      el.addEventListener('timeupdate', onTimeUpdate);
      el.addEventListener('loadedmetadata', onLoaded);
      return () => { el.removeEventListener('timeupdate', onTimeUpdate); el.removeEventListener('loadedmetadata', onLoaded); };
    }, [player]);

    // Sync play/pause to element
    useEffect(() => {
      const el = videoRef.current;
      if (!el) return;
      if (player.isPlaying) { el.play().catch(() => {}); } else { el.pause(); }
    }, [player.isPlaying]);

    useEffect(() => { const el = videoRef.current; if (el) el.volume = player.volume; }, [player.volume]);
    useEffect(() => { const el = videoRef.current; if (el) el.muted = player.muted; }, [player.muted]);
    useEffect(() => { const el = videoRef.current; if (el) el.playbackRate = player.speed; }, [player.speed]);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const vdSlot = getSlotProps('video', videoStyle, classNames, styles);

    const ctxValue: VideoPlayerContextValue = {
      isPlaying: player.isPlaying, currentTime: player.currentTime, duration: player.duration,
      volume: player.volume, muted: player.muted, speed: player.speed, progress: player.progress,
      toggle: player.toggle, seek: player.seek, setVolume: player.setVolume,
      toggleMute: player.toggleMute, setSpeed: player.setSpeed, setFullscreen: player.setFullscreen,
      classNames, styles,
    };

    if (children) {
      return (
        <VideoPlayerContext.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="video-player-root">
            <video ref={videoRef} src={src} poster={poster} className={vdSlot.className} style={vdSlot.style}
              autoPlay={autoPlay} playsInline data-testid="video-player-video" />
            {children}
          </div>
        </VideoPlayerContext.Provider>
      );
    }

    return (
      <VideoPlayerContext.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="video-player-root">
          <video ref={videoRef} src={src} poster={poster} className={vdSlot.className} style={vdSlot.style}
            autoPlay={autoPlay} playsInline onClick={player.toggle} data-testid="video-player-video" />
          <VideoPlayerControls />
        </div>
      </VideoPlayerContext.Provider>
    );
  },
);

export const VideoPlayer = Object.assign(VideoPlayerBase, {
  Controls: VideoPlayerControls, SeekBar: VideoPlayerSeekBar,
});
