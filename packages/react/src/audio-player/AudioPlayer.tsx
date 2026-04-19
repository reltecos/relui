/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * AudioPlayer — ses oynatici bilesen (Dual API).
 * AudioPlayer — audio player component (Dual API).
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useRef, useEffect, type ReactNode } from 'react';
import type { AudioTrack } from '@relteco/relui-core';
import {
  rootStyle, controlsStyle, playButtonStyle, seekBarStyle, timeDisplayStyle,
  volumeBarStyle, trackInfoStyle, trackTitleStyle, trackArtistStyle,
  playlistStyle, playlistItemStyle, playlistItemActiveStyle,
} from './audio-player.css';
import { useAudioPlayer, type UseAudioPlayerProps } from './useAudioPlayer';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type AudioPlayerSlot = 'root' | 'controls' | 'playButton' | 'seekBar' | 'timeDisplay' | 'volumeBar' | 'trackInfo' | 'playlist' | 'playlistItem';

function formatTime(s: number): string { const m = Math.floor(s / 60); return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}`; }

interface AudioPlayerContextValue {
  isPlaying: boolean; currentTime: number; duration: number; volume: number; muted: boolean;
  currentTrack: AudioTrack | null; tracks: readonly AudioTrack[]; currentTrackIndex: number; progress: number;
  toggle: () => void; seek: (t: number) => void; setVolume: (v: number) => void; toggleMute: () => void;
  nextTrack: () => void; prevTrack: () => void; setTrack: (id: string) => void;
  classNames: ClassNames<AudioPlayerSlot> | undefined; styles: Styles<AudioPlayerSlot> | undefined;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

function useAudioPlayerContext(): AudioPlayerContextValue {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('AudioPlayer compound sub-components must be used within <AudioPlayer>.');
  return ctx;
}

export interface AudioPlayerControlsProps { className?: string; }
const AudioPlayerControls = forwardRef<HTMLDivElement, AudioPlayerControlsProps>(
  function AudioPlayerControls(props, ref) {
    const { className } = props;
    const ctx = useAudioPlayerContext();
    const slot = getSlotProps('controls', controlsStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const pbSlot = getSlotProps('playButton', playButtonStyle, ctx.classNames, ctx.styles);
    const skSlot = getSlotProps('seekBar', seekBarStyle, ctx.classNames, ctx.styles);
    const tdSlot = getSlotProps('timeDisplay', timeDisplayStyle, ctx.classNames, ctx.styles);
    const vlSlot = getSlotProps('volumeBar', volumeBarStyle, ctx.classNames, ctx.styles);
    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="audio-player-controls">
        <button type="button" className={pbSlot.className} style={pbSlot.style} onClick={ctx.prevTrack} aria-label="Previous" data-testid="audio-player-prevButton">&#x23EE;</button>
        <button type="button" className={pbSlot.className} style={pbSlot.style} onClick={ctx.toggle} aria-label={ctx.isPlaying ? 'Pause' : 'Play'} data-testid="audio-player-playButton">
          {ctx.isPlaying ? '\u275A\u275A' : '\u25B6'}
        </button>
        <button type="button" className={pbSlot.className} style={pbSlot.style} onClick={ctx.nextTrack} aria-label="Next" data-testid="audio-player-nextButton">&#x23ED;</button>
        <span className={tdSlot.className} style={tdSlot.style} data-testid="audio-player-timeDisplay">{formatTime(ctx.currentTime)} / {formatTime(ctx.duration)}</span>
        <input type="range" min={0} max={ctx.duration || 1} step={0.1} value={ctx.currentTime} onChange={(e) => ctx.seek(Number(e.target.value))} className={skSlot.className} style={skSlot.style} aria-label="Seek" data-testid="audio-player-seekBar" />
        <input type="range" min={0} max={1} step={0.05} value={ctx.muted ? 0 : ctx.volume} onChange={(e) => ctx.setVolume(Number(e.target.value))} className={vlSlot.className} style={vlSlot.style} aria-label="Volume" data-testid="audio-player-volumeBar" />
      </div>
    );
  },
);

export interface AudioPlayerTrackInfoProps { className?: string; }
const AudioPlayerTrackInfo = forwardRef<HTMLDivElement, AudioPlayerTrackInfoProps>(
  function AudioPlayerTrackInfo(props, ref) {
    const { className } = props;
    const ctx = useAudioPlayerContext();
    const slot = getSlotProps('trackInfo', trackInfoStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    if (!ctx.currentTrack) return null;
    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="audio-player-trackInfo">
        <span className={trackTitleStyle}>{ctx.currentTrack.title}</span>
        {ctx.currentTrack.artist && <span className={trackArtistStyle}>{ctx.currentTrack.artist}</span>}
      </div>
    );
  },
);

export interface AudioPlayerPlaylistProps { className?: string; }
const AudioPlayerPlaylist = forwardRef<HTMLDivElement, AudioPlayerPlaylistProps>(
  function AudioPlayerPlaylist(props, ref) {
    const { className } = props;
    const ctx = useAudioPlayerContext();
    const slot = getSlotProps('playlist', playlistStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const itemSlot = getSlotProps('playlistItem', playlistItemStyle, ctx.classNames, ctx.styles);
    if (ctx.tracks.length === 0) return null;
    return (
      <div ref={ref} className={cls} style={slot.style} role="list" data-testid="audio-player-playlist">
        {ctx.tracks.map((t, i) => {
          const isActive = i === ctx.currentTrackIndex;
          const itemCls = isActive ? `${itemSlot.className} ${playlistItemActiveStyle}` : itemSlot.className;
          return (
            <div key={t.id} className={itemCls} style={itemSlot.style} role="listitem" onClick={() => ctx.setTrack(t.id)} data-testid="audio-player-playlistItem" aria-current={isActive ? 'true' : undefined}>
              {t.title}{t.artist ? ` — ${t.artist}` : ''}
            </div>
          );
        })}
      </div>
    );
  },
);

export interface AudioPlayerComponentProps extends SlotStyleProps<AudioPlayerSlot>, UseAudioPlayerProps {
  showPlaylist?: boolean;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const AudioPlayerBase = forwardRef<HTMLDivElement, AudioPlayerComponentProps>(
  function AudioPlayer(props, ref) {
    const { tracks, volume: volProp, onTrackChange, onEnded, showPlaylist = false, children, className, style: styleProp, classNames, styles } = props;
    const player = useAudioPlayer({ tracks, volume: volProp, onTrackChange, onEnded });
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
      const el = audioRef.current; if (!el) return;
      const onTU = () => player.timeUpdate(el.currentTime, el.duration || 0);
      const onL = () => player.loaded(el.duration || 0);
      el.addEventListener('timeupdate', onTU); el.addEventListener('loadedmetadata', onL);
      return () => { el.removeEventListener('timeupdate', onTU); el.removeEventListener('loadedmetadata', onL); };
    }, [player]);

    useEffect(() => { const el = audioRef.current; if (!el) return; if (player.isPlaying) el.play().catch(() => {}); else el.pause(); }, [player.isPlaying]);
    useEffect(() => { const el = audioRef.current; if (el) el.volume = player.volume; }, [player.volume]);
    useEffect(() => { const el = audioRef.current; if (el) el.muted = player.muted; }, [player.muted]);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: AudioPlayerContextValue = {
      ...player, toggle: player.toggle, seek: player.seek, setVolume: player.setVolume,
      toggleMute: player.toggleMute, nextTrack: player.nextTrack, prevTrack: player.prevTrack, setTrack: player.setTrack,
      classNames, styles,
    };

    const src = player.currentTrack?.src ?? '';

    return (
      <AudioPlayerContext.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="audio-player-root">
          <audio ref={audioRef} src={src} data-testid="audio-player-audio" />
          {children ?? (
            <>
              <AudioPlayerTrackInfo />
              <AudioPlayerControls />
              {showPlaylist && <AudioPlayerPlaylist />}
            </>
          )}
        </div>
      </AudioPlayerContext.Provider>
    );
  },
);

export const AudioPlayer = Object.assign(AudioPlayerBase, {
  Controls: AudioPlayerControls, TrackInfo: AudioPlayerTrackInfo, Playlist: AudioPlayerPlaylist,
});
