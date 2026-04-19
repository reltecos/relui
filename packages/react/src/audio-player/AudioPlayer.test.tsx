/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { AudioPlayer } from './AudioPlayer';
import type { AudioTrack } from '@relteco/relui-core';

beforeAll(() => { HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined); HTMLMediaElement.prototype.pause = vi.fn(); });

const TRACKS: AudioTrack[] = [
  { id: '1', title: 'Song A', src: '/a.mp3', artist: 'Artist A' },
  { id: '2', title: 'Song B', src: '/b.mp3' },
];

describe('AudioPlayer', () => {
  it('root render edilir', () => { render(<AudioPlayer tracks={TRACKS} />); expect(screen.getByTestId('audio-player-root')).toBeInTheDocument(); });
  it('audio elementi render edilir', () => { render(<AudioPlayer tracks={TRACKS} />); expect(screen.getByTestId('audio-player-audio')).toBeInTheDocument(); });
  it('controls render edilir', () => { render(<AudioPlayer tracks={TRACKS} />); expect(screen.getByTestId('audio-player-controls')).toBeInTheDocument(); });
  it('play butonu render edilir', () => { render(<AudioPlayer tracks={TRACKS} />); expect(screen.getByTestId('audio-player-playButton')).toBeInTheDocument(); });
  it('play butonu toggle eder', () => { render(<AudioPlayer tracks={TRACKS} />); const btn = screen.getByTestId('audio-player-playButton'); fireEvent.click(btn); expect(btn).toHaveAttribute('aria-label', 'Pause'); });
  it('seekBar render edilir', () => { render(<AudioPlayer tracks={TRACKS} />); expect(screen.getByTestId('audio-player-seekBar')).toBeInTheDocument(); });
  it('volumeBar render edilir', () => { render(<AudioPlayer tracks={TRACKS} />); expect(screen.getByTestId('audio-player-volumeBar')).toBeInTheDocument(); });
  it('timeDisplay render edilir', () => { render(<AudioPlayer tracks={TRACKS} />); expect(screen.getByTestId('audio-player-timeDisplay')).toBeInTheDocument(); });
  it('trackInfo render edilir', () => { render(<AudioPlayer tracks={TRACKS} />); expect(screen.getByTestId('audio-player-trackInfo')).toBeInTheDocument(); expect(screen.getByText('Song A')).toBeInTheDocument(); });
  it('next/prev butonlari render edilir', () => { render(<AudioPlayer tracks={TRACKS} />); expect(screen.getByTestId('audio-player-nextButton')).toBeInTheDocument(); expect(screen.getByTestId('audio-player-prevButton')).toBeInTheDocument(); });
  it('playlist showPlaylist ile gosterilir', () => { render(<AudioPlayer tracks={TRACKS} showPlaylist />); expect(screen.getByTestId('audio-player-playlist')).toBeInTheDocument(); });
  it('playlist varsayilan gizli', () => { render(<AudioPlayer tracks={TRACKS} />); expect(screen.queryByTestId('audio-player-playlist')).not.toBeInTheDocument(); });
  it('playlist item lar render edilir', () => { render(<AudioPlayer tracks={TRACKS} showPlaylist />); expect(screen.getAllByTestId('audio-player-playlistItem')).toHaveLength(2); });

  // ── Slot API ──
  it('className root elemana eklenir', () => { render(<AudioPlayer tracks={TRACKS} className="my-ap" />); expect(screen.getByTestId('audio-player-root').className).toContain('my-ap'); });
  it('style root elemana eklenir', () => { render(<AudioPlayer tracks={TRACKS} style={{ padding: '8px' }} />); expect(screen.getByTestId('audio-player-root')).toHaveStyle({ padding: '8px' }); });
  it('classNames.root eklenir', () => { render(<AudioPlayer tracks={TRACKS} classNames={{ root: 'cr' }} />); expect(screen.getByTestId('audio-player-root').className).toContain('cr'); });
  it('styles.root eklenir', () => { render(<AudioPlayer tracks={TRACKS} styles={{ root: { padding: '12px' } }} />); expect(screen.getByTestId('audio-player-root')).toHaveStyle({ padding: '12px' }); });
  it('classNames.controls eklenir', () => { render(<AudioPlayer tracks={TRACKS} classNames={{ controls: 'cc' }} />); expect(screen.getByTestId('audio-player-controls').className).toContain('cc'); });
  it('styles.controls eklenir', () => { render(<AudioPlayer tracks={TRACKS} styles={{ controls: { padding: '10px' } }} />); expect(screen.getByTestId('audio-player-controls')).toHaveStyle({ padding: '10px' }); });
  it('classNames.trackInfo eklenir', () => { render(<AudioPlayer tracks={TRACKS} classNames={{ trackInfo: 'ct' }} />); expect(screen.getByTestId('audio-player-trackInfo').className).toContain('ct'); });
  it('styles.trackInfo eklenir', () => { render(<AudioPlayer tracks={TRACKS} styles={{ trackInfo: { padding: '6px' } }} />); expect(screen.getByTestId('audio-player-trackInfo')).toHaveStyle({ padding: '6px' }); });
  it('classNames.playlist eklenir', () => { render(<AudioPlayer tracks={TRACKS} showPlaylist classNames={{ playlist: 'cp' }} />); expect(screen.getByTestId('audio-player-playlist').className).toContain('cp'); });
  it('styles.playlist eklenir', () => { render(<AudioPlayer tracks={TRACKS} showPlaylist styles={{ playlist: { padding: '8px' } }} />); expect(screen.getByTestId('audio-player-playlist')).toHaveStyle({ padding: '8px' }); });
  it('ref forward edilir', () => { const ref = vi.fn(); render(<AudioPlayer tracks={TRACKS} ref={ref} />); expect(ref).toHaveBeenCalled(); });
});

describe('AudioPlayer (Compound)', () => {
  it('compound: Controls render edilir', () => { render(<AudioPlayer tracks={TRACKS}><AudioPlayer.Controls /></AudioPlayer>); expect(screen.getByTestId('audio-player-controls')).toBeInTheDocument(); });
  it('compound: TrackInfo render edilir', () => { render(<AudioPlayer tracks={TRACKS}><AudioPlayer.TrackInfo /></AudioPlayer>); expect(screen.getByTestId('audio-player-trackInfo')).toBeInTheDocument(); });
  it('compound: Playlist render edilir', () => { render(<AudioPlayer tracks={TRACKS}><AudioPlayer.Playlist /></AudioPlayer>); expect(screen.getByTestId('audio-player-playlist')).toBeInTheDocument(); });
  it('compound: classNames context ile aktarilir', () => { render(<AudioPlayer tracks={TRACKS} classNames={{ controls: 'cc' }}><AudioPlayer.Controls /></AudioPlayer>); expect(screen.getByTestId('audio-player-controls').className).toContain('cc'); });
  it('compound: styles context ile aktarilir', () => { render(<AudioPlayer tracks={TRACKS} styles={{ controls: { padding: '20px' } }}><AudioPlayer.Controls /></AudioPlayer>); expect(screen.getByTestId('audio-player-controls')).toHaveStyle({ padding: '20px' }); });
  it('AudioPlayer.Controls context disinda hata firlatir', () => { expect(() => render(<AudioPlayer.Controls />)).toThrow(); });
});
