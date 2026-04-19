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
import { VideoPlayer } from './VideoPlayer';

beforeAll(() => {
  HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  HTMLMediaElement.prototype.pause = vi.fn();
});

describe('VideoPlayer', () => {
  it('root render edilir', () => {
    render(<VideoPlayer src="/video.mp4" />);
    expect(screen.getByTestId('video-player-root')).toBeInTheDocument();
  });

  it('video elementi render edilir', () => {
    render(<VideoPlayer src="/video.mp4" />);
    const video = screen.getByTestId('video-player-video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', '/video.mp4');
  });

  it('poster set edilir', () => {
    render(<VideoPlayer src="/video.mp4" poster="/poster.jpg" />);
    expect(screen.getByTestId('video-player-video')).toHaveAttribute('poster', '/poster.jpg');
  });

  it('controls render edilir', () => {
    render(<VideoPlayer src="/video.mp4" />);
    expect(screen.getByTestId('video-player-controls')).toBeInTheDocument();
  });

  it('play butonu render edilir', () => {
    render(<VideoPlayer src="/video.mp4" />);
    expect(screen.getByTestId('video-player-playButton')).toBeInTheDocument();
  });

  it('play butonu tiklaninca toggle eder', () => {
    render(<VideoPlayer src="/video.mp4" />);
    const btn = screen.getByTestId('video-player-playButton');
    expect(btn).toHaveAttribute('aria-label', 'Play');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-label', 'Pause');
  });

  it('seekBar render edilir', () => {
    render(<VideoPlayer src="/video.mp4" />);
    expect(screen.getByTestId('video-player-seekBar')).toBeInTheDocument();
  });

  it('volumeBar render edilir', () => {
    render(<VideoPlayer src="/video.mp4" />);
    expect(screen.getByTestId('video-player-volumeBar')).toBeInTheDocument();
  });

  it('mute butonu render edilir', () => {
    render(<VideoPlayer src="/video.mp4" />);
    expect(screen.getByTestId('video-player-muteButton')).toBeInTheDocument();
  });

  it('speed menu render edilir', () => {
    render(<VideoPlayer src="/video.mp4" />);
    expect(screen.getByTestId('video-player-speedMenu')).toBeInTheDocument();
    expect(screen.getByTestId('video-player-speedMenu')).toHaveTextContent('1x');
  });

  it('fullscreen butonu render edilir', () => {
    render(<VideoPlayer src="/video.mp4" />);
    expect(screen.getByTestId('video-player-fullscreenButton')).toBeInTheDocument();
  });

  it('timeDisplay render edilir', () => {
    render(<VideoPlayer src="/video.mp4" />);
    expect(screen.getByTestId('video-player-timeDisplay')).toBeInTheDocument();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<VideoPlayer src="/v.mp4" className="my-vp" />);
    expect(screen.getByTestId('video-player-root').className).toContain('my-vp');
  });

  it('style root elemana eklenir', () => {
    render(<VideoPlayer src="/v.mp4" style={{ padding: '8px' }} />);
    expect(screen.getByTestId('video-player-root')).toHaveStyle({ padding: '8px' });
  });

  // ── Slot API ──

  it('classNames.root root elemana eklenir', () => {
    render(<VideoPlayer src="/v.mp4" classNames={{ root: 'cr' }} />);
    expect(screen.getByTestId('video-player-root').className).toContain('cr');
  });

  it('styles.root root elemana eklenir', () => {
    render(<VideoPlayer src="/v.mp4" styles={{ root: { padding: '12px' } }} />);
    expect(screen.getByTestId('video-player-root')).toHaveStyle({ padding: '12px' });
  });

  it('classNames.controls controls elemana eklenir', () => {
    render(<VideoPlayer src="/v.mp4" classNames={{ controls: 'cc' }} />);
    expect(screen.getByTestId('video-player-controls').className).toContain('cc');
  });

  it('styles.controls controls elemana eklenir', () => {
    render(<VideoPlayer src="/v.mp4" styles={{ controls: { padding: '10px' } }} />);
    expect(screen.getByTestId('video-player-controls')).toHaveStyle({ padding: '10px' });
  });

  it('classNames.playButton playButton elemana eklenir', () => {
    render(<VideoPlayer src="/v.mp4" classNames={{ playButton: 'cpb' }} />);
    expect(screen.getByTestId('video-player-playButton').className).toContain('cpb');
  });

  it('styles.seekBar seekBar elemana eklenir', () => {
    render(<VideoPlayer src="/v.mp4" styles={{ seekBar: { opacity: '0.5' } }} />);
    expect(screen.getByTestId('video-player-seekBar')).toHaveStyle({ opacity: '0.5' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<VideoPlayer src="/v.mp4" ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe('VideoPlayer (Compound)', () => {
  it('compound: Controls render edilir', () => {
    render(<VideoPlayer src="/v.mp4"><VideoPlayer.Controls /></VideoPlayer>);
    expect(screen.getByTestId('video-player-controls')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(<VideoPlayer src="/v.mp4" classNames={{ controls: 'cc' }}><VideoPlayer.Controls /></VideoPlayer>);
    expect(screen.getByTestId('video-player-controls').className).toContain('cc');
  });

  it('compound: styles context ile aktarilir', () => {
    render(<VideoPlayer src="/v.mp4" styles={{ controls: { padding: '20px' } }}><VideoPlayer.Controls /></VideoPlayer>);
    expect(screen.getByTestId('video-player-controls')).toHaveStyle({ padding: '20px' });
  });

  it('VideoPlayer.Controls context disinda hata firlatir', () => {
    expect(() => render(<VideoPlayer.Controls />)).toThrow();
  });
});
